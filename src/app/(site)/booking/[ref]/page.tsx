import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Check, Clock, Phone, Printer, ShieldCheck } from "lucide-react";
import { AppointmentSlip, SlipActions } from "@/components/slip";
import { Breadcrumbs, Eyebrow } from "@/components/ui";
import { findAppointmentByRef } from "@/server/queries";
import { business, whatsappUrl } from "@/lib/site";
import { dateShort } from "@/lib/format";
import { currentUser } from "@/server/auth";
import { noIndex } from "@/lib/metadata";

export const metadata: Metadata = { title: "Booking confirmed", ...noIndex };

export default async function BookingConfirmation({ params, searchParams }: { params: Promise<{ ref: string }>; searchParams: Promise<{ wa?: string }> }) {
  const [{ ref }, { wa }, user] = await Promise.all([params, searchParams, currentUser().catch(() => null)]);
  const appointment = await findAppointmentByRef(ref);
  if (!appointment) redirect("/slip");
  const message = decodeURIComponent(wa?.length ? wa : `Reference ${appointment.ref}: ${appointment.serviceTitle} for ${appointment.petName} on ${appointment.date} (${appointment.slotLabel}).`);

  return (
    <section className="section-tight" style={{ paddingTop: 20, paddingBottom: 56 }}>
      <div className="container">
        <Breadcrumbs items={[{ label: "Booking", href: "/book-vet-appointment-lahore" }, { label: appointment.ref }]} />
        <div className="grid" style={{ gridTemplateColumns: "minmax(0,1.1fr) minmax(0,420px)", gap: 34, alignItems: "start" }}>
          <div className="col" style={{ gap: 20 }}>
            <div className="card card-pad" style={{ borderColor: "rgba(44,114,87,.3)", background: "linear-gradient(150deg,#eef6f0,#fffdfa)" }}>
              <span className="row" style={{ gap: 10, marginBottom: 10 }}>
                <span className="avatar" style={{ background: "var(--ok)", color: "#fff" }}><Check size={15} strokeWidth={3} /></span>
                <Eyebrow>Request received</Eyebrow>
              </span>
              <h1 style={{ fontSize: "clamp(26px,3.4vw,40px)", margin: "0 0 10px" }}>
                {dateShort(appointment.date)}, {appointment.slotLabel.toLowerCase()} window — <em>noted.</em></h1>
              <p className="muted small" style={{ margin: 0 }}>
                The front desk is confirming the slot now and will WhatsApp {appointment.guestPhone}. For a home visit, the veterinarian
                calls fifteen minutes before setting off. Keep this page — your slip is on the right.
              </p>
            </div>

            <div className="grid cols-2" style={{ gap: 14 }}>
              {[
                { icon: <Calendar size={17} />, t: "When", d: `${dateShort(appointment.date)}\n${appointment.slotWindow}` },
                { icon: <Clock size={17} />, t: "Confirmation", d: "Usually within 20 minutes during working hours; overnight requests confirm at 10 am." },
                { icon: <ShieldCheck size={17} />, t: "Payment", d: appointment.payment.status === "paid" ? "Already settled — receipt filed." : `Rs. ${appointment.total} after the visit. Cash or transfer — nothing charged now.` },
                { icon: <Phone size={17} />, t: "Change of plan?", d: "Reschedule or cancel yourself in the portal, any hour. Call the desk if it is today." },
              ].map((item) => (
                <div key={item.t} className="card card-pad" style={{ display: "grid", gap: 8 }}>
                  <span className="service-icon" style={{ width: 34, height: 34, marginBottom: 0 }}>{item.icon}</span>
                  <b style={{ fontSize: 14 }}>{item.t}</b>
                  <span className="small muted" style={{ whiteSpace: "pre-line" }}>{item.d}</span>
                </div>
              ))}
            </div>

            <div className="note">
              <Printer size={16} />
              <span>
                Print the slip or save it as a PDF from the print dialog. Pet parents show it at the gate — the barcode carries the
                reference, so nobody has to search for your booking.
              </span>
            </div>

            <div className="row" style={{ gap: 10 }}>
              <Link href={user ? "/portal/appointments" : "/register"} className="button button-primary">
                {user ? "See it in my portal" : "Create a free portal account"} <ArrowRight size={15} />
              </Link>
              <Link href={`/slip/${appointment.ref}`} className="button button-ghost">Print view <ArrowRight size={15} /></Link>
              <Link href="/shop" className="button button-ghost">Add pet essentials</Link>
            </div>
          </div>

          <div className="col" style={{ gap: 14, position: "sticky", top: 96 }}>
            <AppointmentSlip appointment={appointment} />
            <SlipActions refCode={appointment.ref} message={message} href={user ? "/portal/appointments" : undefined} />
            <p className="tiny muted center" style={{ margin: 0 }}>
              Need to reach us? <a href={`tel:${business.phone.replace(/\s/g, "")}`} style={{ textDecoration: "underline" }}>{business.phone}</a> ·{" "}
              <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>WhatsApp</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
