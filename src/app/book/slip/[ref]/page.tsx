import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { BookingSlip } from "@/components/booking-slip";
import { BookingSlipActions } from "@/components/slip-actions";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getAppointmentByRef } from "@/lib/hospital-db";
import { business } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Your Booking Slip", "Your Jawad Veterinary Hospital booking slip with token number.", "/book/slip");

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function BookingSlipPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const appointment = getAppointmentByRef(ref);
  if (!appointment) notFound();
  const user = await getCurrentUser();
  const isOwner = Boolean(user && appointment.userId === user.id);
  const isStaff = Boolean(user && (user.role === "admin" || user.role === "vet"));
  const full = isOwner || isStaff;

  const whatsappText = `🐾 Jawad Veterinary Hospital — Booking Confirmed\n\nBooking Ref: ${appointment.ref}\nToken No: ${appointment.token}\nPet: ${appointment.petName} (${appointment.petType})\nService: ${appointment.serviceTitle}\n${appointment.visitType === "home" ? "Home visit" : "Hospital visit"} · ${formatDate(appointment.date)} at ${appointment.timeSlot}\nVisiting charges: Rs ${appointment.fee.toLocaleString("en-PK")}\n\n${appointment.visitType === "hospital" ? `Please arrive 10 minutes early at ${business.shortAddress} and show your token number at reception.` : "Our vet will call before arriving."}`;

  return (
    <main id="main-content">
      <section className="section" style={{ paddingTop: 52 }}>
        <div className="container">
          <div className="slip-wrap">
            <div className="slip-success-banner no-print" role="status">
              <span className="success-icon"><Check size={26} /></span>
              <div>
                <h2>Booking received — see you soon, {appointment.petName}!</h2>
                <p>
                  Your token number is <strong>{appointment.token}</strong>. Our team will confirm shortly on WhatsApp at your given number.
                  Save or print this slip{isOwner ? " — it is also saved in your portal" : ""}.
                </p>
              </div>
            </div>
            <BookingSlip appointment={appointment} full={full} />
            <BookingSlipActions whatsappText={whatsappText} showPortal={isOwner} />
          </div>
        </div>
      </section>
    </main>
  );
}
