"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { todayISO } from "@/lib/format";
import { quoteAppointment } from "@/lib/pricing";
import { slotLabel, slotWindow } from "@/lib/pricing";
import { catalogServices } from "@/server/catalog";
import { audit, getSettings, insert, nextRef, rows, uid, update } from "@/server/store";
import { currentUser } from "@/server/auth";
import { emailValid, field, checkbox, listField, numberField, normalisePhone, oneOf, phoneValid, required } from "@/server/validate";
import type { FieldErrors } from "@/server/validate";
import type { Appointment } from "@/lib/types";

export type BookingResult = { ok: boolean; message?: string; errors?: FieldErrors };

/** The 3-step wizard posts everything at once; the server re-prices it and owns the reference number. */
export async function createAppointment(_prev: BookingResult | null, form: FormData): Promise<BookingResult> {
  const errors: FieldErrors = {};
  const name = required(form, errors, "guestName", "Your name", 70);
  const phone = field(form, "guestPhone");
  const email = field(form, "guestEmail").toLowerCase();
  const petName = required(form, errors, "petName", "Pet's name", 40);
  const serviceSlug = field(form, "serviceSlug");
  const date = field(form, "date");
  const consent = checkbox(form, "consent");

  if (!phoneValid(phone)) errors.guestPhone = "Enter a mobile number we can reach you on.";
  if (email && !emailValid(email)) errors.guestEmail = "Check the email address.";
  const services = await catalogServices();
  const service = services.find((s) => s.slug === serviceSlug && s.active);
  if (!service) errors.serviceSlug = "Choose a service.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.date = "Choose a visit date.";
  else if (date < todayISO()) errors.date = "Pick today or a future date.";
  if (!consent) errors.consent = "Please confirm the clinic may contact you about this booking.";
  if (Object.keys(errors).length || !name || !service) return { ok: false, errors, message: "Please correct the highlighted fields." };

  const mode = oneOf(form, "mode", ["home", "clinic"] as const, "home");
  const urgency = oneOf(form, "urgency", ["standard", "emergency"] as const, "standard");
  const slotId = oneOf(form, "slotId", ["morning", "midday", "evening", "night", "any"] as const, "any");
  const addOns = listField(form, "addOns").filter((a) => ["lab-kit", "follow-up", "nebulisation"].includes(a));
  const settings = await getSettings();
  const quote = quoteAppointment({
    servicePrice: service.price,
    mode,
    urgency,
    slotId,
    addOns,
    settings,
    credit: Math.max(0, numberField(form, "credit", 0)),
  });

  const user = await currentUser();
  const knownUsers = await rows("users");
  const linked = user ?? knownUsers.find((u) => u.email.toLowerCase() === email) ?? null;

  let petId: string | null = field(form, "petId") || null;
  if (!petId && linked && linked.role === "customer") {
    // Never duplicate a passport: reuse the client's pet when the name matches.
    const existing = (await rows("pets")).find(
      (pet) => pet.userId === linked.id && pet.name.trim().toLowerCase() === petName.trim().toLowerCase(),
    );
    if (existing) petId = existing.id;
  }
  if (!petId && linked && linked.role === "customer") {
    const created = {
      id: uid("pet"), userId: linked.id, name: petName, species: field(form, "species") || "Dog",
      breed: field(form, "breed").slice(0, 60) || "Not recorded",
      sex: oneOf(form, "sex", ["Male", "Female", "Unknown"] as const, "Unknown"),
      dob: field(form, "dob") || undefined, photo: petPhotoFor(field(form, "species") || "Dog"),
      createdAt: new Date().toISOString(),
    };
    await insert("pets", created);
    petId = created.id;
  }

  const ref = await nextRef("booking");
  const stamp = new Date().toISOString();
  const appointment: Appointment = {
    id: uid("apt"), ref, userId: linked?.id ?? null,
    guestName: name, guestPhone: normalisePhone(phone), guestEmail: email || undefined,
    petId, petName, species: field(form, "species") || "Dog", breed: field(form, "breed") || "Not recorded",
    petAge: field(form, "petAge") || undefined,
    serviceSlug: service.slug, serviceTitle: service.title, mode, urgency, date,
    slotId, slotLabel: slotLabel(slotId), slotWindow: slotWindow(slotId),
    address: field(form, "address").slice(0, 240) || (mode === "clinic" ? settings.address : ""),
    area: field(form, "area").slice(0, 60) || "Lahore",
    symptoms: field(form, "symptoms").slice(0, 600) || undefined,
    addOns, lines: quote.lines, subtotal: quote.subtotal, total: quote.total,
    status: "pending",
    payment: { method: oneOf(form, "payment", ["cod", "transfer", "easypaisa", "card"] as const, "cod"), status: "unpaid" },
    timeline: [{ at: stamp, label: mode === "home" ? "Home visit requested online" : "Hospital visit booked online", by: name }],
    consent, createdAt: stamp, updatedAt: stamp,
  };
  await insert("appointments", appointment);
  await audit(linked?.name ?? name, "Booking created", ref, `${service.title} · ${mode === "home" ? "home visit" : "hospital"} · ${date} ${appointment.slotLabel} · Rs. ${quote.total}`);
  const used = settings.whatsappTemplate
    .replace("{ref}", ref).replace("{service}", service.title).replace("{pet}", petName)
    .replace("{date}", date).replace("{slot}", appointment.slotLabel).replace("{name}", name).replace("{area}", appointment.area);

  revalidatePath("/portal", "layout");
  revalidatePath("/admin", "layout");
  redirect(`/booking/${ref}?wa=${encodeURIComponent(used)}`);
}

function petPhotoFor(species: string) {
  return species.toLowerCase().startsWith("cat") ? "/images/pet-cat.jpg" : "/images/pet-dog.jpg";
}

export async function shareWithClinic(ref: string) {
  const all = await rows("appointments");
  const appointment = all.find((a) => a.ref === ref);
  if (!appointment) return { ok: false, message: "Unknown reference." };
  await update("appointments", appointment.id, { timeline: [...appointment.timeline, { at: new Date().toISOString(), label: "Client sent slip to clinic", by: appointment.guestName }] });
  await audit(appointment.guestName, "Slip sent", ref, "Front desk flagged for same-day confirmation");
  revalidatePath("/admin/appointments");
  return { ok: true, message: "Slip sent — the front desk will confirm shortly." };
}
