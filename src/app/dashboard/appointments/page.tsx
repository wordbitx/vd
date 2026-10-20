import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { PortalHead } from "@/components/portal-shell";
import { MyAppointments } from "@/components/my-appointments";
import { requireUser } from "@/lib/auth";
import { listAppointmentsByUser } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("My Appointments", "Your Jawad Veterinary Hospital appointments and booking slips.", "/dashboard/appointments");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function MyAppointmentsPage() {
  const user = await requireUser("/dashboard/appointments");
  const appointments = listAppointmentsByUser(user.id);
  return (
    <div>
      <PortalHead eyebrow="Appointments" title="My appointments" description="Upcoming visits, token numbers, booking slips and your complete visit history.">
        <Link href="/book" className="button button-gold"><CalendarPlus size={16} /> Book a visit</Link>
      </PortalHead>
      <MyAppointments appointments={appointments} />
    </div>
  );
}
