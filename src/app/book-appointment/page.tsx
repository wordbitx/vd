import { CalendarDays, Check, Clock3, MapPin, Phone } from "lucide-react";
import { AppointmentForm } from "@/components/appointment-form";
import { PageHero } from "@/components/page-parts";
import { business, services } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Request a Veterinary Appointment", "Prepare an appointment request for Jawad Veterinary Hospital in Lahore. Review your pet’s details and contact the team to confirm a time.", "/book-appointment");

export default async function AppointmentPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const initialService = services.some((item) => item.slug === service) ? service : "";
  return <main id="main-content"><PageHero eyebrow="LET’S GET TO KNOW YOUR PET" title="Book your pet’s visit." description="Share a few details and choose a preferred time. Your request is not a confirmed appointment until the hospital responds and accepts it." /><section className="appointment-page-section"><div className="container appointment-layout"><div className="appointment-form-card"><AppointmentForm key={initialService ?? ""} initialService={initialService ?? ""} /></div><aside className="appointment-sidebar"><div className="sidebar-info-card"><span className="sidebar-icon"><CalendarDays size={23} /></span><h2>What happens next?</h2><div className="booking-steps"><div><span>1</span><p>Tell us about your pet and preferred visit.</p></div><div><span>2</span><p>Review the message we prepare for you.</p></div><div><span>3</span><p>Send it via WhatsApp or call. The hospital confirms availability.</p></div></div></div><div className="sidebar-info-card sidebar-muted"><h3>Need to speak to someone?</h3><a href={business.phoneHref} className="sidebar-phone"><Phone size={19} />{business.phone}</a><p><MapPin size={16} />{business.shortAddress}</p><p><Clock3 size={16} />{business.reportedHours}<br />{business.hoursNote}</p></div><div className="sidebar-truth"><Check size={18} /><p>No automatic booking, payment or guaranteed time slot is connected to this preview.</p></div></aside></div></section></main>;
}
