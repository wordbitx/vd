import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Clock, Home, Mail, Phone, ShieldCheck, Stethoscope } from "lucide-react";
import { ServiceGlyph, WhatsAppIcon } from "@/components/icons";
import { business } from "@/lib/site";
import { money } from "@/lib/format";
import { catalogServices } from "@/server/catalog";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Veterinary services in Lahore — fees & what's included",
  "Consultations, vaccination, deworming, dentistry, surgery aftercare, lab tests, grooming and 24/7 emergency home visits. Starting fees for each service, itemised before you book.",
  "/services",
  "/images/consultation.jpg",
);

export default async function ServicesPage() {
  const services = await catalogServices();

  return (
    <>
      <section className="v-section" style={{ paddingBottom: 0 }}>
        <div className="v-wrap">
          <span className="v-eyebrow">Our veterinary services</span>
          <h1 style={{ margin: "14px 0 12px", maxWidth: 760 }}>Veterinary Services in Lahore</h1>
          <p className="lead" style={{ maxWidth: 700 }}>
            Clinic-grade home vet care across all areas of Lahore — and a fully equipped hospital in Al Kabir Town for
            surgery, dentistry and diagnostics. Every fee below is the starting professional fee; a home visit adds the
            travel charge shown at booking, and anything else is itemised before treatment starts.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
            <span className="v-eyebrow"><Home size={13} /> Home visits</span>
            <span className="v-eyebrow"><Stethoscope size={13} /> Hospital consults</span>
            <span className="v-eyebrow"><ShieldCheck size={13} /> RVMP registered</span>
            <span className="v-eyebrow"><BadgeCheck size={13} /> Printed slip every time</span>
          </div>
        </div>
      </section>

      <section className="v-section">
        <div className="v-wrap">
          <div className="v-grid v-cols-3">
            {services.map((service) => (
              <article key={service.slug} className="v-card v-card-hover v-service">
                <span className="v-icon-tile"><ServiceGlyph icon={service.icon} size={21} /></span>
                <h3>{service.shortTitle}</h3>
                <p>{service.summary}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11.5, fontWeight: 700, color: "var(--v-muted)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> {service.duration}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Home size={13} /> {service.homeAvailable ? "Home or hospital" : "Hospital"}</span>
                </div>
                <div className="v-service-meta">
                  <span className="v-price"><small>From</small><b>{money(service.price)}</b></span>
                  <span style={{ display: "inline-flex", gap: 6 }}>
                    <Link href={`/services/${service.slug}`} className="button button-ghost button-sm">Learn More</Link>
                    <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="v-service-link">
                      Book Now <ArrowRight size={13} />
                    </Link>
                  </span>
                </div>
              </article>
            ))}
          </div>
          <p className="small muted" style={{ textAlign: "center", marginTop: 24 }}>
            Home visit charge: {money(1500)} standard · {money(2500)} emergency or night dispatch. No advance payment —
            pay after the consultation.
          </p>
        </div>
      </section>

      <section className="v-section" style={{ paddingTop: 0 }}>
        <div className="v-wrap">
          <div className="v-emergency">
            <div>
              <span className="v-eyebrow v-eyebrow-brass">Life-threatening emergency?</span>
              <h2>Don&apos;t book — call immediately.</h2>
              <p>
                Our rapid response team is available 24/7 for critical cases. If your pet is struggling to breathe,
                bleeding, collapsing or straining to urinate, call the clinic now.
              </p>
            </div>
            <div className="v-emergency-actions">
              <a className="v-emergency-call" href={`tel:${business.phone.replace(/[^\d+]/g, "")}`}>
                <Phone size={16} /> Call {business.phone}
              </a>
              <a className="v-emergency-mail" href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={14} /> WhatsApp the clinic
              </a>
              <a className="v-emergency-mail" href={`mailto:${business.email}`}>
                <Mail size={14} /> {business.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
