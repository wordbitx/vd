import { CalendarDays, Check, Clock3, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { BookingWizard } from "@/components/booking-wizard";
import { PageHero } from "@/components/page-parts";
import { getCurrentUser } from "@/lib/auth";
import { bookingServiceBySlug } from "@/lib/catalog";
import { getSettings, listPetsByUser } from "@/lib/hospital-db";
import { business, whatsappUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Book a Vet Appointment in Lahore",
  "Book a hospital or home vet visit at Jawad Veterinary Hospital in under 2 minutes — instant booking slip with token number, transparent fees, WhatsApp confirmation.",
  "/book",
);

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string; pet?: string }> }) {
  const { service, pet } = await searchParams;
  const user = await getCurrentUser();
  const settings = getSettings();
  const myPets = user ? listPetsByUser(user.id) : [];
  const initialService = service && bookingServiceBySlug(service) ? service : "";
  const initialPetId = pet && myPets.some((item) => item.id === pet) ? pet : "";

  return (
    <main id="main-content">
      <PageHero
        eyebrow="BOOK IN UNDER 2 MINUTES"
        title="Book a vet visit."
        description="Premium veterinary care at our Al Kabir Town hospital — or at your doorstep anywhere in Lahore. Your booking slip with token number is generated instantly."
      />
      <section className="appointment-page-section">
        <div className="container appointment-layout">
          <div className="wizard-card">
            <BookingWizard key={`${initialService}-${initialPetId}`} settings={settings} user={user} myPets={myPets} initialService={initialService} initialPetId={initialPetId} />
          </div>
          <aside className="appointment-sidebar">
            <div className="sidebar-info-card">
              <span className="sidebar-icon"><CalendarDays size={23} /></span>
              <h2>What happens next?</h2>
              <div className="booking-steps">
                <div><span>1</span><p>Tell us about your pet, service and preferred time.</p></div>
                <div><span>2</span><p>Get your instant booking slip with a token number — print it or save it on your phone.</p></div>
                <div><span>3</span><p>We confirm on WhatsApp. Then visit us with your token, or welcome our vet at home.</p></div>
              </div>
            </div>
            <div className="sidebar-info-card sidebar-muted">
              <h3>Need to speak to someone?</h3>
              <a href={business.phoneHref} className="sidebar-phone"><Phone size={19} />{business.phone}</a>
              <a href={whatsappUrl("Hello Jawad Veterinary Hospital, I would like to book a visit for my pet.")} target="_blank" rel="noopener noreferrer" className="sidebar-phone" style={{ marginTop: 8 }}><MessageCircle size={19} /> WhatsApp the hospital</a>
              <p><MapPin size={16} />{business.shortAddress}</p>
              <p><Clock3 size={16} />Open daily · 8:00 AM – 11:30 PM</p>
            </div>
            <div className="sidebar-truth">
              <ShieldCheck size={18} />
              <p>Transparent fees — visiting charges shown upfront; treatment costs always agreed with you before we begin.</p>
            </div>
            <div className="sidebar-truth">
              <Check size={18} />
              <p>{user ? "You're signed in — this booking will appear in your portal with your pet's Digital Passport." : "Booking as a guest is fine. Create a free account afterwards to track visits and build your pet's Digital Passport."}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
