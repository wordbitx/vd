import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Calendar, Clock, Phone, ShieldCheck } from "lucide-react";
import { BookingWizard } from "@/components/booking-wizard";
import { Breadcrumbs, Eyebrow, WhatsAppButton } from "@/components/ui";
import { business, fees, timeSlots } from "@/lib/site";
import { money } from "@/lib/format";
import { catalogServices } from "@/server/catalog";
import { currentUser } from "@/server/auth";
import { getSettings, rows } from "@/server/store";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Book a vet appointment in Lahore — home visit or hospital",
  "Book a veterinary home visit or hospital appointment in three minutes: choose the service, a time window from morning to night, and get a printable booking slip with a barcode reference.",
  "/book-vet-appointment-lahore",
  "/images/home-visit.jpg",
);

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string; date?: string; slot?: string; species?: string }> }) {
  const [params, services, settings, user] = await Promise.all([
    searchParams, catalogServices(), getSettings(), currentUser().catch(() => null),
  ]);
  const myPets = user ? (await rows("pets")).filter((p) => p.userId === user.id) : [];

  return (
    <>
      <section className="page-head" style={{ paddingBottom: 8 }}>
        <div className="container">
          <Breadcrumbs items={[{ label: "Veterinary services", href: "/services" }, { label: "Book an appointment" }]} />
          <div className="row-between" style={{ gap: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ maxWidth: 680 }}>
              <Eyebrow>Booking · {business.city}</Eyebrow>
              <h1 style={{ margin: "14px 0 12px", fontSize: "clamp(32px,4.4vw,54px)" }}>
                Book a veterinarian for <em>your pet, today.</em></h1>
              <p className="lead" style={{ margin: 0 }}>
                Three short steps. You will see the exact fee, get a barcode booking slip you can print or send on WhatsApp, and a
                confirmation from the clinic — usually inside twenty minutes.
              </p>
            </div>
            <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
              {[
                { icon: <Clock size={14} />, label: `${timeSlots.length} windows, 10 am – 2 am` },
                { icon: <BadgeCheck size={14} />, label: "Printable slip with reference" },
                { icon: <ShieldCheck size={14} />, label: "No advance payment" },
              ].map((chip) => (
                <span key={chip.label} className="pill pill-soft">{chip.icon} {chip.label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 18, paddingBottom: 46 }}>
        <div className="container">
          <BookingWizard
            services={services.map((s) => ({ slug: s.slug, title: s.title, shortTitle: s.shortTitle, summary: s.summary, icon: s.icon, price: s.price, duration: s.duration, homeAvailable: s.homeAvailable }))}
            settings={{
              visitHomeStandard: settings.visitHomeStandard, visitHomeEmergency: settings.visitHomeEmergency,
              visitClinic: settings.visitClinic, nightSurcharge: settings.nightSurcharge, taxPercent: settings.taxPercent,
            }}
            pets={myPets.map((p) => ({ id: p.id, name: p.name, species: p.species, breed: p.breed }))}
            areas={[...business.serviceAreas]}
            user={user ? { name: user.name, phone: user.phone, email: user.email } : null}
            initialService={params.service}
            emergencyLine={settings.emergencyLine || business.emergencyPhone}
          />

          <div className="grid cols-3" style={{ marginTop: 34 }}>
            <div className="card card-pad">
              <h3 style={{ fontSize: 18 }}>What happens next</h3>
              <ol className="col" style={{ margin: "10px 0 0", paddingLeft: 18, gap: 6, fontSize: 13.5, color: "var(--muted)" }}>
                <li>Front desk reviews the request against the rota.</li>
                <li>WhatsApp confirmation with the arrival window and the vet’s name.</li>
                <li>Visit, treatment and written plan — records added to your portal.</li>
              </ol>
            </div>
            <div className="card card-pad">
              <h3 style={{ fontSize: 18 }}>Fees at a glance</h3>
              <div className="summary-rows" style={{ marginTop: 6 }}>
                <div className="summary-row"><dt>Hospital consult</dt><dd>from {money(fees.visitClinic)}</dd></div>
                <div className="summary-row"><dt>Home visit charge</dt><dd>{money(fees.visitHomeStandard)}</dd></div>
                <div className="summary-row"><dt>Emergency / night</dt><dd>{money(fees.visitHomeEmergency)}</dd></div>
              </div>
            </div>
            <div className="card card-pad">
              <h3 style={{ fontSize: 18 }}>Rather just talk?</h3>
              <p className="small muted" style={{ margin: "8px 0 12px" }}>A vet answers clinical questions on WhatsApp during working hours — no charge for advice.</p>
              <div className="col" style={{ gap: 9 }}>
                <WhatsAppButton message="Assalam-o-Alaikum, I need advice before booking a visit." className="button button-brass button-sm" />
                <Link href={`tel:${business.phone.replace(/\s/g, "")}`} className="button button-ghost button-sm"><Phone size={15} /> {business.phone}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
