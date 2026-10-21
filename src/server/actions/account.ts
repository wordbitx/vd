"use server";

import { revalidatePath } from "next/cache";
import { addMonths } from "@/lib/format";
import { currentUser } from "@/server/auth";
import { audit, insert, remove, rows, uid, update } from "@/server/store";
import { checkbox, field, numberField, oneOf, required } from "@/server/validate";
import type { FieldErrors } from "@/server/validate";

export type AccountResult = { ok: boolean; message?: string; errors?: FieldErrors; petId?: string };

export async function savePet(_prev: AccountResult | null, form: FormData): Promise<AccountResult> {
  const errors: FieldErrors = {};
  const user = await currentUser();
  if (!user) return { ok: false, message: "Please sign in first.", errors };
  const id = field(form, "id");
  const name = required(form, errors, "name", "Pet's name", 40);
  const species = field(form, "species") || "Dog";
  if (Object.keys(errors).length || !name) return { ok: false, errors, message: "Please correct the highlighted fields." };
  const payload = {
    name, species,
    breed: field(form, "breed").slice(0, 60) || "Not recorded",
    sex: oneOf(form, "sex", ["Male", "Female", "Unknown"] as const, "Unknown"),
    dob: field(form, "dob") || undefined,
    weightKg: numberField(form, "weightKg", 0) || undefined,
    microchip: field(form, "microchip").slice(0, 40) || undefined,
    colour: field(form, "colour").slice(0, 40) || undefined,
    allergies: field(form, "allergies").slice(0, 200) || undefined,
    notes: field(form, "notes").slice(0, 400) || undefined,
    photo: field(form, "photo") || (species.toLowerCase().startsWith("cat") ? "/images/pet-cat.jpg" : "/images/pet-dog.jpg"),
  };
  if (id) {
    const pets = await rows("pets");
    const pet = pets.find((p) => p.id === id && p.userId === user.id);
    if (!pet) return { ok: false, message: "That pet is not on your account.", errors };
    await update("pets", pet.id, payload);
    await audit(user.name, "Pet profile updated", pet.name, `${species} · ${payload.breed}`);
    revalidatePath("/portal/pets");
    return { ok: true, message: `${name}'s passport updated.`, petId: pet.id };
  }
  const created = { id: uid("pet"), userId: user.id, createdAt: new Date().toISOString(), ...payload };
  await insert("pets", created);
  await audit(user.name, "Pet added to passport", name, `${species} · ${payload.breed}`);
  revalidatePath("/portal/pets");
  revalidatePath("/portal");
  return { ok: true, message: `${name} has been added to your Digital Pet Passport.`, petId: created.id };
}

export async function removePet(_prev: AccountResult | null, form: FormData): Promise<AccountResult> {
  const user = await currentUser();
  const id = field(form, "id");
  if (!user) return { ok: false, message: "Please sign in first.", errors: {} };
  const pets = await rows("pets");
  const pet = pets.find((p) => p.id === id && p.userId === user.id);
  if (!pet) return { ok: false, message: "Pet not found.", errors: {} };
  const remaining = pets.filter((x) => x.id !== pet.id).length;
  // Archive the profile; consultation and vaccine history stays with the clinic.
  await remove("pets", pet.id);
  revalidatePath("/portal/pets");
  await audit(user.name, "Pet archived", pet.name, `${remaining} pet(s) remaining on the account`);
  return { ok: true, message: `${pet.name} was removed from your passport. Past records stay with the clinic.` };
}

export async function addVaccineRecord(_prev: AccountResult | null, form: FormData): Promise<AccountResult> {
  const errors: FieldErrors = {};
  const user = await currentUser();
  if (!user) return { ok: false, message: "Please sign in first.", errors };
  const petId = required(form, errors, "petId", "Pet", 40);
  const vaccine = required(form, errors, "vaccine", "Vaccine name", 80);
  const givenOn = field(form, "givenOn");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(givenOn)) errors.givenOn = "Enter the date it was given.";
  if (Object.keys(errors).length || !petId) return { ok: false, errors, message: "Please correct the highlighted fields." };
  const pets = await rows("pets");
  const pet = pets.find((p) => p.id === petId && p.userId === user.id);
  if (!pet) return { ok: false, message: "That pet is not on your account.", errors };
  await insert("vaccines", {
    id: uid("v"), petId: pet.id, vaccine: vaccine.slice(0, 80), givenOn,
    nextDue: field(form, "nextDue") || addMonths(givenOn, 12), batch: field(form, "batch").slice(0, 30) || undefined,
    vet: field(form, "vet").slice(0, 60) || "Recorded by owner — awaiting clinic verification",
    note: field(form, "note").slice(0, 240) || undefined,
  });
  await audit(user.name, "Vaccine record added", pet.name, `${vaccine} on ${givenOn}`);
  revalidatePath("/portal/pets");
  return { ok: true, message: `${vaccine} logged for ${pet.name}. Front desk will verify the batch at your next visit.` };
}

export async function cancelAppointment(_prev: AccountResult | null, form: FormData): Promise<AccountResult> {
  const user = await currentUser();
  const id = field(form, "id");
  if (!user) return { ok: false, message: "Please sign in first.", errors: {} };
  const appointments = await rows("appointments");
  const appointment = appointments.find((a) => a.id === id && (a.userId === user.id || a.guestEmail?.toLowerCase() === user.email.toLowerCase()));
  if (!appointment) return { ok: false, message: "Booking not found.", errors: {} };
  if (!["pending", "confirmed"].includes(appointment.status)) return { ok: false, message: "This visit is already past the point of online changes — call the clinic.", errors: {} };
  const stamp = new Date().toISOString();
  await update("appointments", appointment.id, {
    status: "cancelled", updatedAt: stamp,
    timeline: [...appointment.timeline, { at: stamp, label: `Cancelled from the portal (reason: ${field(form, "reason").slice(0, 120) || "not given"})`, by: user.name }],
  });
  await audit(user.name, "Booking cancelled", appointment.ref, appointment.serviceTitle);
  revalidatePath("/portal/appointments");
  revalidatePath("/admin/appointments");
  return { ok: true, message: "Visit cancelled. Nothing is owed — the slot has been released." };
}

export async function requestReschedule(_prev: AccountResult | null, form: FormData): Promise<AccountResult> {
  const errors: FieldErrors = {};
  const user = await currentUser();
  const id = field(form, "id");
  const preferredDate = field(form, "preferredDate");
  const slotId = field(form, "slotId");
  if (!user) return { ok: false, message: "Please sign in first.", errors };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) errors.preferredDate = "Choose the date you would prefer.";
  if (!slotId) errors.slotId = "Choose a time window.";
  if (Object.keys(errors).length) return { ok: false, errors, message: "Pick a new date and window." };
  const appointments = await rows("appointments");
  const appointment = appointments.find((a) => a.id === id && (a.userId === user.id || a.guestEmail?.toLowerCase() === user.email.toLowerCase()));
  if (!appointment) return { ok: false, message: "Booking not found.", errors };
  const stamp = new Date().toISOString();
  const windows: Record<string, string> = { morning: "10:00 AM – 02:00 PM", midday: "02:00 PM – 06:00 PM", evening: "06:00 PM – 10:00 PM", night: "10:00 PM – 02:00 AM", any: "We call to confirm" };
  await update("appointments", appointment.id, {
    updatedAt: stamp,
    timeline: [...appointment.timeline, { at: stamp, label: `Reschedule requested → ${preferredDate}, ${slotId} (${windows[slotId] ?? ""})`, by: user.name }],
  });
  await audit(user.name, "Reschedule requested", appointment.ref, `${preferredDate} · ${slotId}`);
  revalidatePath("/portal/appointments");
  revalidatePath("/admin/appointments");
  return { ok: true, message: "Request sent. The front desk confirms new slots within working hours." };
}

export async function sendMessage(_prev: AccountResult | null, form: FormData): Promise<AccountResult> {
  const errors: FieldErrors = {};
  const user = await currentUser();
  const subject = required(form, errors, "subject", "Subject", 90);
  const body = required(form, errors, "body", "Message", 1200);
  const phone = (field(form, "phone") || "").trim();
  const email = (field(form, "email") || "").trim();
  const typedName = (field(form, "name") || "").trim();
  if (!user && !typedName) errors.name = "Tell us who we are replying to.";
  if (phone.replace(/[^\d]/g, "").length < 9) errors.phone = "Add a number the front desk can reach you on.";
  if (Object.keys(errors).length) return { ok: false, errors, message: "Add your name, number and your question." };
  const id = user?.id ?? "guest";
  const name = user?.name ?? typedName;
  const reach = [phone, email].filter(Boolean).join(" · ");
  await insert("messages", {
    id: uid("m"), userId: id, userName: name, subject: subject.slice(0, 90),
    body: (reach ? `${body}\n\nReply to: ${reach}` : body).slice(0, 1200),
    at: new Date().toISOString(), from: user ? "customer" : "customer",
  });
  await audit(name, "Question sent to the clinic", subject.slice(0, 40), body.slice(0, 80));
  revalidatePath("/portal/messages");
  revalidatePath("/admin/messages");
  return { ok: true, message: user ? "Sent. A veterinarian answers portal messages within one working day." : "Message sent to the front desk — we reply on the number you gave us." };
}

export async function saveReminderPrefs(_prev: AccountResult | null, form: FormData): Promise<AccountResult> {
  const user = await currentUser();
  if (!user) return { ok: false, message: "Please sign in first.", errors: {} };
  const users = await rows("users");
  const me = users.find((u) => u.id === user.id);
  if (!me) return { ok: false, message: "Account not found.", errors: {} };
  const prefs = { whatsappReminders: checkbox(form, "whatsappReminders"), emailReminders: checkbox(form, "emailReminders"), smsNoShow: checkbox(form, "smsNoShow") };
  await update("users", me.id, { notes: `PREFS:${JSON.stringify(prefs)}|${(me.notes ?? "").replace(/^PREFS:.*?\|/, "")}`.slice(0, 400) });
  revalidatePath("/portal/profile");
  return { ok: true, message: "Reminder preferences saved." };
}
