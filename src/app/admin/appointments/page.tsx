import { PortalHead } from "@/components/portal-shell";
import { AdminAppointments } from "@/components/admin-appointments";
import { requireRole } from "@/lib/auth";
import { listAppointments } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Appointments · Admin", "Manage bookings, tokens and visit records.", "/admin/appointments");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminAppointmentsPage() {
  const user = await requireRole(["admin", "vet"], "/admin/appointments");
  const appointments = listAppointments();
  return (
    <div>
      <PortalHead
        eyebrow="Hospital Operations"
        title="Appointments"
        description="Confirm bookings, run the daily token queue, assign vets and record diagnoses & prescriptions — customers see updates instantly in their portal."
      />
      <AdminAppointments appointments={appointments} focusUserName={user.role === "vet" ? user.name : undefined} />
    </div>
  );
}
