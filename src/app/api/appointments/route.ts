import { getCurrentUser } from "@/lib/auth";
import { clean, jsonError, jsonOk, readJson, validPhone } from "@/lib/api";
import { bookingServiceBySlug } from "@/lib/catalog";
import { todayIso } from "@/lib/format";
import { createAppointment, getPet, listAppointments, listAppointmentsByUser, quoteFee } from "@/lib/hospital-db";
import type { VisitType } from "@/lib/types";

export const runtime = "nodejs";

type BookingBody = {
  ownerName?: string; ownerPhone?: string; ownerEmail?: string;
  petId?: string; petName?: string; petType?: string; petBreed?: string; petAge?: string;
  serviceSlug?: string; visitType?: string; emergency?: boolean;
  date?: string; timeSlot?: string; area?: string; address?: string; symptoms?: string;
};

export async function POST(request: Request) {
  const body = await readJson<BookingBody>(request);
  const user = await getCurrentUser();

  const ownerName = clean(body?.ownerName, 120) || user?.name || "";
  const ownerPhone = clean(body?.ownerPhone, 40) || user?.phone || "";
  const ownerEmail = clean(body?.ownerEmail, 160) || user?.email || "";
  const petName = clean(body?.petName, 80);
  const petType = clean(body?.petType, 40);
  const petBreed = clean(body?.petBreed, 80);
  const petAge = clean(body?.petAge, 40);
  const serviceSlug = clean(body?.serviceSlug, 80);
  const visitType: VisitType = body?.visitType === "home" ? "home" : "hospital";
  const emergency = body?.emergency === true;
  const date = clean(body?.date, 20);
  const timeSlot = clean(body?.timeSlot, 40) || (emergency ? "As soon as possible" : "");
  const area = clean(body?.area, 80);
  const address = clean(body?.address, 400);
  const symptoms = clean(body?.symptoms, 1000);

  if (ownerName.length < 2) return jsonError("Please enter your name.");
  if (!validPhone(ownerPhone)) return jsonError("Please enter a valid mobile number so we can confirm on WhatsApp.");
  if (!petType) return jsonError("Please select your pet type.");
  const service = bookingServiceBySlug(serviceSlug);
  if (!service) return jsonError("Please select a service.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < todayIso()) return jsonError("Please choose today or a future date.");
  if (!timeSlot) return jsonError("Please choose a time slot.");
  if (visitType === "home" && address.length < 8) return jsonError("Please enter your complete home address for the home visit.");

  // Attach a registered pet only when it belongs to the signed-in user.
  let petId: string | null = null;
  if (user && body?.petId) {
    const pet = getPet(body.petId);
    if (pet && pet.userId === user.id) petId = pet.id;
  }

  const appointment = createAppointment({
    userId: user?.id ?? null,
    petId,
    ownerName, ownerPhone, ownerEmail,
    petName: petName || "My pet", petType, petBreed, petAge,
    serviceSlug: service.slug, serviceTitle: service.title,
    visitType, emergency, date, timeSlot, area,
    address: visitType === "home" ? address : address || user?.address || "",
    symptoms,
    fee: quoteFee(visitType, emergency),
  });
  return jsonOk({ appointment }, 201);
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Please log in to view appointments.", 401);
  const url = new URL(request.url);
  if (user.role === "admin" || user.role === "vet") {
    return jsonOk({
      appointments: listAppointments({
        date: url.searchParams.get("date") ?? undefined,
        status: url.searchParams.get("status") ?? undefined,
        search: url.searchParams.get("search") ?? undefined,
      }),
    });
  }
  return jsonOk({ appointments: listAppointmentsByUser(user.id) });
}
