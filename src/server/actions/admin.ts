"use server";

import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/format";
import { quoteAppointment } from "@/lib/pricing";
import { slotLabel, slotWindow } from "@/lib/pricing";
import { requireStaff } from "@/server/auth";
import { audit, getSettings, insert, nextRef, remove, replaceRows, rows, saveSettings, uid, update } from "@/server/store";
import { checkbox, field, listField, numberField, oneOf, required } from "@/server/validate";
import type { FieldErrors } from "@/server/validate";
import type { Appointment, PostRow, ProductRow } from "@/lib/types";

export type AdminResult = { ok: boolean; message?: string; errors?: FieldErrors };

const now = () => new Date().toISOString();
const APPOINTMENT_PATHS = ["/admin", "/admin/appointments", "/admin/today", "/portal", "/portal/appointments"] as const;

async function touch(paths: readonly string[] = APPOINTMENT_PATHS) {
  for (const p of paths) revalidatePath(p, "layout");
  revalidatePath("/admin");
}

export async function setAppointmentStatus(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const id = field(form, "id");
  const status = oneOf(form, "status", ["pending", "confirmed", "dispatched", "in_progress", "completed", "cancelled", "no_show"] as const, "pending");
  const note = field(form, "note").slice(0, 200);
  const appointments = await rows("appointments");
  const appointment = appointments.find((a) => a.id === id);
  if (!appointment) return { ok: false, message: "Booking not found.", errors: {} };
  const stamp = now();
  const entry = { at: stamp, label: `Marked ${status.replace(/_/g, " ")}${note ? ` — ${note}` : ""}`, by: staff.name };
  await update("appointments", appointment.id, { status, updatedAt: stamp, timeline: [...appointment.timeline, entry] });
  await audit(staff.name, "Booking status", appointment.ref, `${appointment.serviceTitle} → ${status}`);
  await touch();
  return { ok: true, message: `${appointment.ref} is now ${status.replace(/_/g, " ")}.` };
}

export async function assignVet(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const id = field(form, "id");
  const vetId = field(form, "vetId");
  const users = await rows("users");
  const vet = users.find((u) => u.id === vetId && ["vet", "owner"].includes(u.role));
  const appointments = await rows("appointments");
  const appointment = appointments.find((a) => a.id === id);
  if (!appointment) return { ok: false, message: "Booking not found.", errors: {} };
  const stamp = now();
  await update("appointments", appointment.id, {
    vetId: vet?.id, vetName: vet?.name ?? "Unassigned", updatedAt: stamp,
    timeline: [...appointment.timeline, { at: stamp, label: `Assigned to ${vet?.name ?? "no one"}`, by: staff.name }],
  });
  await audit(staff.name, "Vet assigned", appointment.ref, vet?.name ?? "cleared");
  await touch();
  return { ok: true, message: vet ? `${appointment.ref} assigned to ${vet.name}.` : "Assignment cleared." };
}

export async function setAppointmentPayment(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const id = field(form, "id");
  const status = oneOf(form, "paymentStatus", ["unpaid", "paid", "refunded"] as const, "unpaid");
  const method = oneOf(form, "paymentMethod", ["cod", "transfer", "easypaisa", "card"] as const, "cod");
  const appointments = await rows("appointments");
  const appointment = appointments.find((a) => a.id === id);
  if (!appointment) return { ok: false, message: "Booking not found.", errors: {} };
  await update("appointments", appointment.id, { payment: { ...appointment.payment, status, method }, updatedAt: now() });
  await audit(staff.name, "Payment updated", appointment.ref, `${status} via ${method}`);
  await touch();
  return { ok: true, message: `Payment marked ${status}.` };
}

export async function createAppointmentByStaff(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const errors: FieldErrors = {};
  const name = required(form, errors, "guestName", "Client name", 70);
  const phone = field(form, "guestPhone");
  const serviceSlug = field(form, "serviceSlug");
  const date = field(form, "date");
  if (!name) errors.guestName = "Client name is required.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.date = "Choose the visit date.";
  const services = await rows("services");
  const service = services.find((s) => s.slug === serviceSlug);
  if (!service) errors.serviceSlug = "Choose a service.";
  if (Object.keys(errors).length || !service) return { ok: false, errors, message: "Please correct the highlighted fields." };

  const mode = oneOf(form, "mode", ["home", "clinic"] as const, "home");
  const urgency = oneOf(form, "urgency", ["standard", "emergency"] as const, "standard");
  const slotId = oneOf(form, "slotId", ["morning", "midday", "evening", "night", "any"] as const, "any");
  const settings = await getSettings();
  const quote = quoteAppointment({ servicePrice: service.price, mode, urgency, slotId, addOns: listField(form, "addOns"), settings });
  const users = await rows("users");
  const client = users.find((u) => phone && u.phone.replace(/\D/g, "") === phone.replace(/\D/g, ""));
  const stamp = now();
  const appointment: Appointment = {
    id: uid("apt"), ref: await nextRef("booking"), userId: client?.id ?? null,
    guestName: name, guestPhone: phone, guestEmail: client?.email,
    petId: field(form, "petId") || null, petName: field(form, "petName") || "Unnamed patient",
    species: field(form, "species") || "Dog", breed: field(form, "breed") || "Not recorded",
    serviceSlug: service.slug, serviceTitle: service.title, mode, urgency, date,
    slotId, slotLabel: slotLabel(slotId), slotWindow: slotWindow(slotId),
    address: field(form, "address") || settings.address, area: field(form, "area") || "Lahore",
    symptoms: field(form, "symptoms") || undefined, addOns: listField(form, "addOns"),
    lines: quote.lines, subtotal: quote.subtotal, total: quote.total,
    status: oneOf(form, "status", ["pending", "confirmed", "in_progress", "completed"] as const, "confirmed"),
    vetId: staff.role === "vet" || staff.role === "owner" ? staff.id : undefined,
    vetName: field(form, "vetName") || (staff.role !== "staff" ? staff.name : undefined),
    payment: { method: "cod", status: "unpaid" },
    timeline: [{ at: stamp, label: "Booked by front desk", by: staff.name }],
    consent: true, createdAt: stamp, updatedAt: stamp,
  };
  await insert("appointments", appointment);
  await audit(staff.name, "Booking created", appointment.ref, `${service.title} · ${name} · Rs. ${quote.total}`);
  await touch();
  return { ok: true, message: `${appointment.ref} created — print the slip at the desk.`, errors: {} };
}

/* ---------------- orders ---------------- */

export async function setOrderStatus(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const id = field(form, "id");
  const status = oneOf(form, "status", ["pending", "packed", "dispatched", "delivered", "cancelled"] as const, "pending");
  const orders = await rows("orders");
  const order = orders.find((o) => o.id === id);
  if (!order) return { ok: false, message: "Order not found.", errors: {} };
  const stamp = now();
  await update("orders", order.id, {
    status, updatedAt: stamp,
    timeline: [...order.timeline, { at: stamp, label: `Order ${status.replace(/_/g, " ")}`, by: staff.name }],
  });
  if (status === "delivered") {
    const products = await rows("products");
    for (const item of order.items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) await update("products", product.id, { stock: Math.max(0, product.stock) });
    }
  }
  await audit(staff.name, "Order status", order.ref, `→ ${status}`);
  revalidatePath("/admin/orders", "layout");
  revalidatePath("/portal/orders", "layout");
  return { ok: true, message: `${order.ref} marked ${status}.` };
}

export async function setOrderPayment(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const id = field(form, "id");
  const status = oneOf(form, "paymentStatus", ["unpaid", "paid", "refunded"] as const, "unpaid");
  const orders = await rows("orders");
  const order = orders.find((o) => o.id === id);
  if (!order) return { ok: false, message: "Order not found.", errors: {} };
  await update("orders", order.id, { payment: { ...order.payment, status }, updatedAt: now() });
  await audit(staff.name, "Order payment", order.ref, status);
  revalidatePath("/admin/orders");
  return { ok: true, message: `Payment marked ${status}.` };
}

/* ---------------- catalogue ---------------- */

export async function saveProduct(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const errors: FieldErrors = {};
  const id = field(form, "id");
  const name = required(form, errors, "name", "Product name", 90);
  const price = numberField(form, "price", 0);
  if (price <= 0) errors.price = "Enter a price in rupees.";
  if (Object.keys(errors).length || !name) return { ok: false, errors, message: "Please correct the highlighted fields." };
  const payload: Partial<ProductRow> = {
    name, price, brand: field(form, "brand") || "In-house", categorySlug: field(form, "categorySlug") || "dog-food",
    compareAt: numberField(form, "compareAt", 0) || undefined, stock: Math.max(0, Math.round(numberField(form, "stock", 0))),
    image: field(form, "image") || "/images/product-dog-food.jpg", badge: field(form, "badge") || undefined,
    description: field(form, "description").slice(0, 600), highlights: listField(form, "highlights").map((h) => h.slice(0, 90)).filter(Boolean),
    active: checkbox(form, "active"), featured: checkbox(form, "featured"),
  };
  if (id) {
    await update("products", id, payload);
    await audit(staff.name, "Product updated", id, name);
  } else {
    const slug = `${slugify(name).slice(0, 48)}-${uid("").slice(1, 5)}`;
    await insert("products", { ...payload, id: uid("p"), slug, rating: 5, reviews: 0, sizes: [], tags: [] } as ProductRow);
    await audit(staff.name, "Product created", slug, name);
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { ok: true, message: id ? "Product updated." : "Product added to the Pet Mall." };
}

export async function toggleProduct(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const id = field(form, "id");
  const products = await rows("products");
  const product = products.find((p) => p.id === id);
  if (!product) return { ok: false, message: "Product not found.", errors: {} };
  await update("products", product.id, { active: !product.active });
  await audit(staff.name, product.active ? "Product archived" : "Product published", product.slug, product.name);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { ok: true, message: product.active ? "Hidden from the Pet Mall." : "Live in the Pet Mall." };
}

export async function adjustStock(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const id = field(form, "id");
  const delta = numberField(form, "delta", 0);
  const products = await rows("products");
  const product = products.find((p) => p.id === id);
  if (!product) return { ok: false, message: "Product not found.", errors: {} };
  const stock = Math.max(0, product.stock + delta);
  await update("products", product.id, { stock });
  await audit(staff.name, "Stock adjusted", product.slug, `${product.stock} → ${stock}`);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { ok: true, message: `${product.name}: ${stock} in stock.` };
}

export async function saveService(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const errors: FieldErrors = {};
  const slug = field(form, "slug");
  const price = numberField(form, "price", 0);
  if (price <= 0) errors.price = "Enter the starting professional fee.";
  if (!slug) errors.slug = "Unknown service.";
  if (Object.keys(errors).length) return { ok: false, errors, message: "Please correct the highlighted fields." };
  const services = await rows("services");
  const existing = services.find((s) => s.slug === slug);
  const patch = {
    price, duration: field(form, "duration") || existing?.duration || "30–45 mins",
    active: checkbox(form, "active"), homeAvailable: checkbox(form, "homeAvailable"),
    summary: field(form, "summary").slice(0, 240) || existing?.summary,
    shortTitle: field(form, "shortTitle").slice(0, 40) || existing?.shortTitle,
  };
  if (existing) await update("services", existing.slug, patch);
  else {
    const marketing = (await import("@/lib/site")).services.find((s) => s.slug === slug);
    await insert("services", { slug, title: marketing?.title ?? slug, icon: marketing?.icon ?? "stethoscope", image: marketing?.image ?? "/images/consultation.jpg", ...patch } as never);
  }
  await audit(staff.name, "Service updated", slug, `Rs. ${patch.price}${patch.active ? "" : " · hidden"}`);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true, message: "Service pricing saved." };
}

/* ---------------- content ---------------- */

export async function savePost(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const errors: FieldErrors = {};
  const id = field(form, "id");
  const title = required(form, errors, "title", "Title", 120);
  if (Object.keys(errors).length || !title) return { ok: false, errors, message: "Add a title." };
  const paragraphs = listField(form, "paragraph").map((x) => x.trim()).filter(Boolean);
  const bullets = listField(form, "bullet").map((x) => x.trim()).filter(Boolean);
  const body = [
    {
      heading: field(form, "heading") || "What pet parents should know",
      paragraphs: paragraphs.length ? paragraphs : [field(form, "excerpt").slice(0, 600) || title],
      bullets: bullets.length ? bullets : undefined,
    },
  ];
  const payload: Partial<PostRow> = {
    title, category: field(form, "category") || "Vet Tips", excerpt: field(form, "excerpt").slice(0, 300),
    image: field(form, "image") || "/images/consultation.jpg", readTime: field(form, "readTime") || "3 min read",
    date: field(form, "date") || now().slice(0, 10), status: checkbox(form, "publish") ? "published" : "draft", body,
  };
  if (id) {
    await update("posts", id, payload);
    await audit(staff.name, "Post updated", id, title);
  } else {
    const slug = `${slugify(title).slice(0, 60)}-${uid("").slice(1, 4)}`;
    await insert("posts", { ...payload, id: uid("post"), slug } as PostRow);
    await audit(staff.name, "Post created", slug, title);
  }
  revalidatePath("/admin/posts");
  revalidatePath("/pet-care-tips");
  return { ok: true, message: id ? "Post saved." : "Post created." };
}

export async function deletePost(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const id = field(form, "id");
  await remove("posts", id);
  await audit(staff.name, "Post deleted", id, "");
  revalidatePath("/admin/posts");
  revalidatePath("/pet-care-tips");
  return { ok: true, message: "Post removed." };
}

export async function saveAdoption(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const errors: FieldErrors = {};
  const id = field(form, "id");
  const name = required(form, errors, "name", "Name", 40);
  if (Object.keys(errors).length || !name) return { ok: false, errors, message: "Add a name." };
  const payload = {
    name, species: field(form, "species") || "Dog", breed: field(form, "breed") || "Mix", age: field(form, "age") || "Young",
    sex: oneOf(form, "sex", ["Male", "Female", "Unknown"] as const, "Unknown"),
    status: oneOf(form, "status", ["available", "reserved", "adopted"] as const, "available"),
    image: field(form, "image") || "/images/adopt-1.jpg", story: field(form, "story").slice(0, 800),
    vaccinated: checkbox(form, "vaccinated"), dewormed: checkbox(form, "dewormed"), traits: listField(form, "trait"),
  };
  if (id) await update("adoption", id, payload);
  else await insert("adoption", { ...payload, id: uid("ad"), postedAt: now().slice(0, 10) });
  await audit(staff.name, id ? "Adoption profile updated" : "Adoption profile created", name, payload.status);
  revalidatePath("/admin/adoption");
  revalidatePath("/adopt");
  return { ok: true, message: id ? "Profile saved." : "Listing published." };
}

export async function setAdoptionStatus(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const id = field(form, "id");
  const status = oneOf(form, "status", ["available", "reserved", "adopted"] as const, "available");
  await update("adoption", id, { status });
  await audit(staff.name, "Adoption status", id, status);
  revalidatePath("/admin/adoption");
  revalidatePath("/adopt");
  return { ok: true, message: `Marked ${status}.` };
}

export async function publishReview(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const id = field(form, "id");
  const status = oneOf(form, "status", ["published", "pending"] as const, "published");
  await update("reviews", id, { status });
  await audit(staff.name, "Review moderation", id, status);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  return { ok: true, message: `Review ${status}.` };
}

/* ---------------- people & messages ---------------- */

export async function replyMessage(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const errors: FieldErrors = {};
  const id = field(form, "id");
  const reply = required(form, errors, "reply", "Reply", 1200);
  if (Object.keys(errors).length) return { ok: false, errors, message: "Write a reply first." };
  const messages = await rows("messages");
  const message = messages.find((m) => m.id === id);
  if (!message) return { ok: false, message: "Message not found.", errors: {} };
  await update("messages", message.id, { reply: reply.slice(0, 1200), repliedAt: now() });
  await audit(staff.name, "Replied in portal", message.subject, `to ${message.userName}`);
  revalidatePath("/admin/messages");
  revalidatePath("/portal/messages");
  return { ok: true, message: "Reply delivered to the portal." };
}

export async function saveCustomerNote(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const id = field(form, "id");
  const users = await rows("users");
  const user = users.find((u) => u.id === id);
  if (!user) return { ok: false, message: "Account not found.", errors: {} };
  const note = field(form, "note").slice(0, 400);
  await update("users", user.id, { notes: note ? `NOTE:${note}` : undefined });
  await audit(staff.name, "Client note", user.name, note.slice(0, 60));
  revalidatePath("/admin/customers");
  return { ok: true, message: "Note saved." };
}

export async function setUserRole(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  if (staff.role !== "owner") return { ok: false, message: "Only the clinic owner can change roles.", errors: {} };
  const id = field(form, "id");
  const role = oneOf(form, "role", ["customer", "vet", "staff", "owner"] as const, "customer");
  await update("users", id, { role });
  await audit(staff.name, "Role changed", id, `→ ${role}`);
  revalidatePath("/admin/staff");
  return { ok: true, message: "Role updated." };
}

/* ---------------- settings ---------------- */

export async function saveClinicSettings(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const errors: FieldErrors = {};
  const current = await getSettings();
  const has = (key: string) => form.has(key);

  // The profile and fee panels are separate forms; only touch what this submission actually sent.
  if (has("clinicName") && !field(form, "clinicName")) errors.clinicName = "Clinic name is required.";
  const prefix = has("bookingPrefix") ? field(form, "bookingPrefix").toUpperCase().replace(/[^A-Z0-9]/g, "") : current.bookingPrefix;
  if (has("bookingPrefix") && !prefix) errors.bookingPrefix = "Use a short code such as JVH.";
  if (has("visitHomeStandard") && numberField(form, "visitHomeStandard", -1) < 0) errors.visitHomeStandard = "Cannot be negative.";
  if (Object.keys(errors).length) return { ok: false, errors, message: "Please correct the highlighted fields." };

  const patch: Partial<typeof current> = {};
  if (has("clinicName")) patch.clinicName = field(form, "clinicName").slice(0, 80);
  if (has("bookingPrefix")) { patch.bookingPrefix = prefix; patch.monogram = prefix; }
  if (has("phone")) patch.phone = field(form, "phone").slice(0, 40);
  if (has("whatsapp")) patch.whatsapp = field(form, "whatsapp").replace(/\D/g, "");
  if (has("email")) patch.email = field(form, "email").slice(0, 80);
  if (has("address")) patch.address = field(form, "address").slice(0, 240);
  if (has("tagline")) patch.tagline = field(form, "tagline").slice(0, 120);
  if (has("emergencyLine")) patch.emergencyLine = field(form, "emergencyLine").slice(0, 40);
  if (has("hoursNote")) patch.hoursNote = field(form, "hoursNote").slice(0, 120);
  if (has("announcement")) patch.announcement = field(form, "announcement").slice(0, 200);
  if (has("announcementHref")) patch.announcementHref = field(form, "announcementHref").slice(0, 120);
  if (has("paymentInstructions")) patch.paymentInstructions = field(form, "paymentInstructions").slice(0, 800);
  if (has("whatsappTemplate") && field(form, "whatsappTemplate")) patch.whatsappTemplate = field(form, "whatsappTemplate").slice(0, 400);
  if (has("visitHomeStandard")) patch.visitHomeStandard = numberField(form, "visitHomeStandard", current.visitHomeStandard);
  if (has("visitHomeEmergency")) patch.visitHomeEmergency = numberField(form, "visitHomeEmergency", current.visitHomeEmergency);
  if (has("visitClinic")) patch.visitClinic = numberField(form, "visitClinic", current.visitClinic);
  if (has("nightSurcharge")) patch.nightSurcharge = numberField(form, "nightSurcharge", current.nightSurcharge);
  if (has("deliveryLahore")) patch.deliveryLahore = numberField(form, "deliveryLahore", current.deliveryLahore);
  if (has("freeDeliveryOver")) patch.freeDeliveryOver = numberField(form, "freeDeliveryOver", current.freeDeliveryOver);
  if (has("taxPercent")) patch.taxPercent = Math.min(25, Math.max(0, numberField(form, "taxPercent", current.taxPercent)));

  await saveSettings(patch);
  await audit(staff.name, "Settings saved", "clinic", `${Object.keys(patch).join(", ")}`);
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved. New bookings and orders use these values immediately." };
}

export async function togglePromo(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  const code = field(form, "code").toUpperCase();
  const promos = await rows("promos");
  const promo = promos.find((p) => p.code.toUpperCase() === code);
  if (!promo) return { ok: false, message: "Promo not found.", errors: {} };
  await replaceRows("promos", promos.map((p) => (p.code === promo.code ? { ...p, active: !p.active } : p)));
  await audit(staff.name, "Promo toggled", promo.code, promo.active ? "disabled" : "enabled");
  revalidatePath("/admin/settings");
  return { ok: true, message: `${promo.code} ${promo.active ? "disabled" : "enabled"}.` };
}

export async function resetDemoData(_prev: AdminResult | null, form: FormData): Promise<AdminResult> {
  const staff = await requireStaff();
  if (staff.role !== "owner") return { ok: false, message: "Only the clinic owner can reset demo data.", errors: {} };
  if (field(form, "confirm") !== "RESET") return { ok: false, message: 'Type RESET to confirm.', errors: { confirm: 'Type RESET to confirm.' } };
  const fs = await import("node:fs/promises");
  const dir = process.env.JVH_DATA_DIR ?? `${process.cwd()}/.data`;
  await fs.rm(dir, { recursive: true, force: true });
  await audit(staff.name, "Demo data reset", "store", "Seeded catalogue restored");
  revalidatePath("/", "layout");
  return { ok: true, message: "Demo store cleared — it reseeds on the next request." };
}
