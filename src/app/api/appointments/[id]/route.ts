import { clean, isResponse, jsonError, jsonOk, readJson, requireApiUser } from "@/lib/api";
import { getAppointmentById, updateAppointment } from "@/lib/hospital-db";
import type { AppointmentStatus } from "@/lib/types";

export const runtime = "nodejs";

const STATUSES: AppointmentStatus[] = ["pending", "confirmed", "checked-in", "completed", "cancelled", "no-show"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser();
  if (isResponse(user)) return user;
  const { id } = await params;
  const appointment = getAppointmentById(id);
  if (!appointment) return jsonError("Appointment not found.", 404);
  const body = await readJson<{ status?: string; doctorName?: string; vetNotes?: string; followUpDate?: string; date?: string; timeSlot?: string }>(request);
  const staff = user.role === "admin" || user.role === "vet";

  if (!staff) {
    // Customers may only cancel their own upcoming appointment.
    if (appointment.userId !== user.id) return jsonError("This appointment does not belong to your account.", 403);
    if (body?.status !== "cancelled") return jsonError("Customers can only cancel an appointment here.", 403);
    if (!["pending", "confirmed"].includes(appointment.status)) return jsonError("This appointment can no longer be cancelled online. Please call us.");
    updateAppointment(id, { status: "cancelled" });
    return jsonOk({ ok: true });
  }

  const patch: Parameters<typeof updateAppointment>[1] = {};
  if (body?.status && STATUSES.includes(body.status as AppointmentStatus)) patch.status = body.status as AppointmentStatus;
  if (typeof body?.doctorName === "string") patch.doctorName = clean(body.doctorName, 120);
  if (typeof body?.vetNotes === "string") patch.vetNotes = clean(body.vetNotes, 3000);
  if (typeof body?.followUpDate === "string") patch.followUpDate = clean(body.followUpDate, 20);
  if (typeof body?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date)) patch.date = body.date;
  if (typeof body?.timeSlot === "string") patch.timeSlot = clean(body.timeSlot, 40);
  updateAppointment(id, patch);
  return jsonOk({ ok: true, appointment: getAppointmentById(id) });
}
