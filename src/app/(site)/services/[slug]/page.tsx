import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, CheckCircle2, Clock, MapPin, Phone, ShieldCheck, Stethoscope } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { business } from "@/lib/site";
import { catalogServices } from "@/server/catalog";
import { PageHero } from "@/components/page-hero";
import { pageMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const services = await catalogServices();
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service not found" };
  return pageMetadata(`${service.title} in Lahore`, service.summary, `/services/${service.slug}`, service.image);
}

const tel = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;

const DISPLAY: Record<string, string> = {
  "general-checkup": "General Checkup",
  vaccination: "Vaccination",
  deworming: "Deworming",
  "surgical-consult": "Surgical Consultation",
  dental: "Dental Cleaning",
  "emergency-care": "Emergency Care",
  nutrition: "Pet Nutrition Consultation",
  "lab-tests": "Diagnostic & Lab Tests",
  "tick-flea": "Tick & Flea Treatments",
};

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const services = await catalogServices();
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const label = DISPLAY[service.slug] ?? service.shortTitle;

  const faq = service.faq ?? [
    {
      q: `How long does a ${service.shortTitle.toLowerCase()} visit take?`,
      a: `Plan for about ${service.duration}. The clinician will tell you at the start of the visit if your pet needs longer.`,
    },
    {
      q: "Do you cover my area in Lahore?",
      a: `Yes — we visit all of Lahore, including ${business.serviceAreas.slice(0, 4).join(", ")} and the surrounding neighbourhoods. Tell us your area when you book and we will confirm the window.`,
    },
    {
      q: "What happens after the visit?",
      a: "You get a written plan, any medicines with the dose on the label, and a record in your Digital Pet Passport. If something worries you afterwards, message the same clinician on WhatsApp.",
    },
  ];

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 4);
  const areas = [...business.serviceAreas];

  return (
    <>
      <PageHero
        variant="gradient"
        crumb="Services"
        eyebrow={<><Stethoscope size={12} /> {service.duration} · {service.homeAvailable ? "at your home" : "at our hospital"}</>}
        title={`${service.title} in Lahore`}
        subtitle={service.overview}
      >
        <div className="r-pagehero-chips">
          <span className="r-chip r-chip-teal"><Clock size={11} /> Duration: {service.duration}</span>
          <span className="r-chip r-chip-teal"><MapPin size={11} /> {service.homeAvailable ? "All Lahore Areas" : business.shortAddress}</span>
        </div>
        <div className="r-pagehero-actions">
          <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="r-btn r-btn-teal r-btn-lg">
            Book This Service <ArrowRight size={15} />
          </Link>
          <a href={tel(business.phone)} className="r-btn r-btn-outline r-btn-lg">
            <Phone size={15} /> Call {business.phone}
          </a>
        </div>
      </PageHero>

      <section className="r-section" style={{ paddingTop: 34 }}>
        <div className="r-wrap">
          <div className="r-panel">
            <span className="r-kicker">What&apos;s included</span>
            <h2 style={{ margin: "10px 0 18px", fontSize: 28 }}>What&apos;s Included in {label}</h2>
            <ul className="r-checks r-checks-2">
              {service.includes.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className="r-divider-gold" style={{ margin: "20px 0 16px" }} />
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--r-muted)" }}>
              You leave with a written summary, any dispensed medicine with dosing on the label, and the next due date
              recorded in your Digital Pet Passport. Reprints are free, forever.
            </p>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <h2 className="r-sec-title">{service.homeAvailable ? "Benefits of Home Service" : "Why Have It Done Here"}</h2>
          <div className="r-tiles">
            {[
              { icon: <CheckCircle2 size={18} />, t: service.homeAvailable ? "No travel, no waiting room" : "Hospital-grade equipment", d: service.homeAvailable ? "Your pet is examined where it feels safe — quieter, calmer and far less exposed to other animals." : "Theatre lighting, monitoring and diagnostics that a home kit cannot carry — all in one visit." },
              { icon: <ShieldCheck size={18} />, t: "Prepared before we arrive", d: "Equipment, medicines and cold-chain carriers are packed for the service you booked, not improvised at the door." },
              { icon: <BadgeCheck size={18} />, t: "Certified & safe", d: "Every visit is carried out by an RVMP-registered veterinarian, with the same standards as the hospital." },
            ].map((item) => (
              <div key={item.t} className="r-tile">
                <span className="r-tile-icon">{item.icon}</span>
                <b>{item.t}</b>
                <span>{item.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="r-section r-section-cream" style={{ paddingTop: 46 }}>
        <div className="r-wrap" style={{ maxWidth: 920 }}>
          <h2 className="r-sec-title">Frequently Asked Questions</h2>
          <div className="r-faq">
            {faq.map((item, i) => (
              <details key={item.q} open={i === 0}>
                <summary>{item.q}</summary>
                <div className="r-faq-body">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 40 }}>
        <div className="r-wrap">
          <h2 className="r-sec-title">
            {service.homeAvailable ? `${label} Available Across All of Lahore` : "Easy to Reach From Across Lahore"}
          </h2>
          <p className="r-sec-lead">
            {service.homeAvailable
              ? "We cover all major neighbourhoods — book in your area for a home visit."
              : `This one is done at our hospital in Al Kabir Town — ${business.shortAddress}.`}
          </p>
          <div className="r-areas">
            {areas.map((area) => <span key={area} className="r-area">{area}</span>)}
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-head-row" style={{ marginBottom: 20 }}>
            <h2 className="r-sec-title" style={{ margin: 0 }}>Explore Other Services</h2>
            <Link href="/services" className="r-btn r-btn-outline">View All Services <ArrowRight size={14} /></Link>
          </div>
          <div className="r-chips-row">
            {others.map((item) => (
              <Link key={item.slug} href={`/services/${item.slug}`} className="r-filter">
                {DISPLAY[item.slug] ?? item.shortTitle}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-band">
            <div>
              <h2>Ready to Book {label} in Lahore?</h2>
              <p>Slots fill up fast. Book now and our team will confirm on WhatsApp within minutes.</p>
            </div>
            <div className="r-band-actions">
              <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="r-btn r-btn-orange r-btn-lg">
                Book Now <ArrowRight size={15} />
              </Link>
              <a
                href={`https://wa.me/${business.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="r-btn r-btn-ghost-dark r-btn-lg"
              >
                <WhatsAppIcon size={15} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
