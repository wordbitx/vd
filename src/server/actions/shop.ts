"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { quoteOrder } from "@/lib/pricing";
import { catalogProducts } from "@/server/catalog";
import { currentUser } from "@/server/auth";
import { audit, getSettings, insert, nextRef, rows, uid, update } from "@/server/store";
import { emailValid, field, normalisePhone, oneOf, parseJson, phoneValid, required } from "@/server/validate";
import type { FieldErrors } from "@/server/validate";
import type { Order, OrderItem } from "@/lib/types";

export type CheckoutResult = { ok: boolean; message?: string; errors?: FieldErrors };

export async function createOrder(_prev: CheckoutResult | null, form: FormData): Promise<CheckoutResult> {
  const errors: FieldErrors = {};
  const name = required(form, errors, "name", "Full name", 70);
  const phone = field(form, "phone");
  const email = field(form, "email").toLowerCase();
  const address = required(form, errors, "address", "Delivery address", 240);
  const cart = parseJson<{ id: string; qty: number; size?: string }[]>(field(form, "items"), []);
  if (!phoneValid(phone)) errors.phone = "Enter a mobile number for the rider.";
  if (email && !emailValid(email)) errors.email = "Check the email address.";
  if (!cart.length) errors.items = "Your basket is empty.";
  if (Object.keys(errors).length || !name) return { ok: false, errors, message: "Please correct the highlighted fields." };

  const products = await catalogProducts();
  const items: OrderItem[] = [];
  for (const line of cart.slice(0, 40)) {
    const product = products.find((p) => p.id === line.id);
    if (!product) continue;
    const qty = Math.min(20, Math.max(1, Math.round(line.qty || 1)));
    if (product.stock < qty) {
      errors[`stock_${product.id}`] = `Only ${product.stock} left of ${product.name}.`;
      continue;
    }
    items.push({ productId: product.id, slug: product.slug, name: product.name, price: product.price, qty, image: product.image, size: line.size });
  }
  if (Object.keys(errors).length) return { ok: false, errors, message: "Some items are out of stock — adjust the basket and try again." };

  const settings = await getSettings();
  const promoCode = field(form, "promo").toUpperCase();
  const promos = await rows("promos");
  const promo = promos.find((p) => p.active && p.code.toUpperCase() === promoCode) ?? null;
  const quote = quoteOrder(items, settings, promo);
  const user = await currentUser();
  const stamp = new Date().toISOString();

  const order: Order = {
    id: uid("ord"), ref: await nextRef("order"), userId: user?.id ?? null,
    name, phone: normalisePhone(phone), email: email || undefined, items,
    subtotal: quote.subtotal, delivery: quote.delivery, discount: quote.discount, total: quote.total,
    status: "pending",
    payment: { method: oneOf(form, "payment", ["cod", "transfer", "easypaisa"] as const, "cod"), status: "unpaid" },
    address, area: field(form, "area").slice(0, 60) || "Lahore", notes: field(form, "notes").slice(0, 300) || undefined,
    timeline: [{ at: stamp, label: "Order placed online", by: name }],
    createdAt: stamp, updatedAt: stamp,
  };
  await insert("orders", order);
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    await update("products", product.id, { stock: Math.max(0, product.stock - item.qty) });
  }
  await audit(user?.name ?? name, "Order placed", order.ref, `${items.length} item(s) · Rs. ${quote.total} · ${order.area}`);
  revalidatePath("/portal", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/shop");
  redirect(`/order/${order.ref}`);
}

export async function reorderOrder(orderId: string) {
  const orders = await rows("orders");
  const order = orders.find((o) => o.id === orderId);
  if (!order) return { ok: false, message: "Order not found." };
  const products = await catalogProducts();
  const items = order.items
    .map((i) => ({ id: i.productId, qty: i.qty, size: i.size }))
    .filter((i) => products.some((p) => p.id === i.id && p.active && p.stock > 0));
  if (!items.length) return { ok: false, message: "Those products are unavailable right now." };
  return { ok: true, message: "Items added back to your basket.", items };
}

export async function requestOrderChange(_prev: { ok: boolean; message?: string } | null, form: FormData) {
  const errors: FieldErrors = {};
  const id = field(form, "id");
  const action = field(form, "action");
  const reason = field(form, "reason").slice(0, 300);
  if (!["cancel", "address", "time"].includes(action)) errors.action = "Choose what you need.";
  if (!reason) errors.reason = "Add a short note for the team.";
  if (Object.keys(errors).length) return { ok: false, errors, message: "Please add a short note." };
  const orders = await rows("orders");
  const order = orders.find((o) => o.id === id);
  if (!order) return { ok: false, message: "Order not found." };
  const label = action === "cancel" ? "Cancellation requested" : action === "address" ? "Address change requested" : "Delivery time change requested";
  await update("orders", order.id, {
    notes: `${order.notes ? `${order.notes} · ` : ""}${label}: ${reason}`.slice(0, 400),
    timeline: [...order.timeline, { at: new Date().toISOString(), label, by: order.name }],
    updatedAt: new Date().toISOString(),
  });
  await audit(order.name, label, order.ref, reason);
  revalidatePath("/portal/orders");
  revalidatePath("/admin/orders");
  return { ok: true, message: "Request sent to the fulfilment desk — you will get a WhatsApp before the rider leaves." };
}

export async function uploadPaymentProof(_prev: { ok: boolean; message?: string } | null, form: FormData) {
  const errors: FieldErrors = {};
  const kind = field(form, "kind");
  const id = field(form, "id");
  const reference = field(form, "reference").slice(0, 80);
  if (!reference) errors.reference = "Paste the transfer reference or Easypaisa TID.";
  if (Object.keys(errors).length) return { ok: false, errors, message: "Add your transaction reference so we can match the payment." };
  const stamp = new Date().toISOString();
  if (kind === "order") {
    const orders = await rows("orders");
    const order = orders.find((o) => o.id === id);
    if (!order) return { ok: false, message: "Order not found." };
    await update("orders", order.id, {
      payment: { ...order.payment, reference },
      timeline: [...order.timeline, { at: stamp, label: `Payment reference submitted (${reference})`, by: order.name }],
      updatedAt: stamp,
    });
    await audit(order.name, "Payment reference", order.ref, reference);
    revalidatePath("/portal/orders");
    revalidatePath("/admin/orders");
    return { ok: true, message: "Reference submitted — we verify transfers on the same working day." };
  }
  const appointments = await rows("appointments");
  const appointment = appointments.find((a) => a.id === id);
  if (!appointment) return { ok: false, message: "Booking not found." };
  await update("appointments", appointment.id, {
    payment: { ...appointment.payment, reference },
    timeline: [...appointment.timeline, { at: stamp, label: `Payment reference submitted (${reference})`, by: appointment.guestName }],
    updatedAt: stamp,
  });
  await audit(appointment.guestName, "Payment reference", appointment.ref, reference);
  revalidatePath("/portal/appointments");
  revalidatePath("/admin/appointments");
  return { ok: true, message: "Reference submitted — we verify transfers on the same working day." };
}
