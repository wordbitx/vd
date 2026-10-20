import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BookingSlip } from "@/components/booking-slip";
import { BookingSlipActions } from "@/components/slip-actions";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getAppointmentByRef } from "@/lib/hospital-db";
import { business } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Booking Slip", "Your appointment booking slip.", "/dashboard/appointments");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function MyAppointmentSlipPage({ params }: { params: Promise<{ ref: string }> }) {
  const user = await requireUser("/dashboard/appointments");
  const { ref } = await params;
  const appointment = getAppointmentByRef(ref);
  if (!appointment || appointment.userId !== user.id) notFound();

  const whatsappText = `🐾 Jawad Veterinary Hospital — My Booking\n\nBooking Ref: ${appointment.ref}\nToken No: ${appointment.token}\nPet: ${appointment.petName} (${appointment.petType})\nService: ${appointment.serviceTitle}\n${appointment.visitType === "home" ? "Home visit" : "Hospital visit"} · ${formatDate(appointment.date)} at ${appointment.timeSlot}\nStatus: ${appointment.status}\n\n${appointment.visitType === "hospital" ? business.shortAddress : "The vet will visit our home."}`;

  return (
    <div>
      <p className="no-print" style={{ marginBottom: 16 }}>
        <Link href="/dashboard/appointments" className="back-link"><ArrowLeft size={16} /> All appointments</Link>
      </p>
      <BookingSlip appointment={appointment} full />
      <BookingSlipActions whatsappText={whatsappText} showPortal />
    </div>
  );
}
