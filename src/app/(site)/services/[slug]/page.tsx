import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Calendar, CheckCircle2, Clock, Home, MapPin, Phone, ShieldCheck, Stethoscope } from "lucide-react";
import { ServiceGlyph, WhatsAppIcon } from "@/components/icons";
import { ServiceCard } from "@/components/cards";
import { business, fees } from "@/lib/site";
import { pkrLabel } from "@/lib/format";
import { catalogServices } from "@/server/catalog";
import { pageMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const services = await catalogServices();
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service not found" };
  return pageMetadata(
    `${service.title} in Lahore — from ${pkrLabel(service.price)}`,
    service.summary,
    `/services/${service.slug}`,
    service.image,
  );
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const services = await catalogServices();
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const faq = (service as { faq?: { q: string; a: string }[] }).faq ?? [];

  return (
    <>
      <section className="r-pagehero">
        <div className="r-wrap">
          <div className="r-crumbs">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/services">Services</Link><span className="sep">/</span>
            <span>{service.shortTitle}</span>
          </div>
          <div className="r-pagehero-inner">
            <div>
              <span className="label"><ServiceGlyph icon={service.icon} size={14} /> {service.duration} typical · {service.homeAvailable ? "home or hospital" : "hospital only"}</span>
              <h1>{service.title}</h1>
              <p>{service.overview}</p>
              <div className="r-pagehero-chips">
                <span className="r-chip r-chip-teal"><ShieldCheck size={12} /> RVMP registered</span>
                <span className="r-chip r-chip-teal"><BadgeCheck size={12} /> Printed slip &amp; portal record</span>
                <span className="r-chip r-chip-teal"><Clock size={12} /> {service.duration}</span>
              </div>
              <div className="r-pagehero-actions">
                <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="r-btn r-btn-teal r-btn-lg">
                  Book This Service <ArrowRight size={15} />
                </Link>
                <a href={`tel:${business.phone.replace(/[^\d+]/g, "")}`} className="r-btn r-btn-outline r-btn-lg">
                  <Phone size={15} /> {business.phone}
                </a>
              </div>
              <div className="r-pagehero-chips" style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--r-line)" }}>
                <span className="r-svc2-price" style={{ marginRight: 14 }}>
                  <small>Professional fee from</small>
                  <b style={{ fontSize: 20 }}>{pkrLabel(service.price)}</b>
                </span>
                {service.homeAvailable ? (
                  <span className="r-chip r-chip-teal"><Home size={12} /> Home visit +{pkrLabel(fees.visitHomeStandard)}</span>
                ) : (
                  <span className="r-chip r-chip-teal"><MapPin size={12} /> Hospital only</span>
                )}
              </div>
            </div>
            <div className="r-pagehero-media" style={{ aspectRatio: "4 / 3.4" }}>
              <Image src={service.image} alt={service.title} fill sizes="(max-width:900px) 92vw, 40vw" className="object-cover" priority unoptimized />
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 24 }}>
        <div className="r-wrap">
          <div className="r-grid-2" style={{ alignItems: "start", gap: 24 }}>
            <div className="r-panel">
              <span className="r-kicker">What&apos;s included</span>
              <h2 style={{ margin: "10px 0 18px", fontSize: 28 }}>What&apos;s included in {service.shortTitle}</h2>
              <ul className="r-checks">
                {service.includes.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="r-divider-gold" style={{ margin: "20px 0 16px" }} />
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.7, color: "var(--r-muted)" }}>
                You leave with a written summary, any dispensed medicine with dosing on the label, and the next due date
                recorded in your Digital Pet Passport. Reprints are free, forever.
              </p>
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              <div className="r-panel">
                <span className="r-kicker">Who it suits</span>
                <p style={{ margin: "10px 0 0", fontSize: 13.5, lineHeight: 1.7, color: "var(--r-muted)" }}>{service.suitable}</p>
              </div>
              <div className="r-panel">
                <span className="r-kicker">How to prepare</span>
                <p style={{ margin: "10px 0 0", fontSize: 13.5, lineHeight: 1.7, color: "var(--r-muted)" }}>{service.preparation}</p>
              </div>
              <div className="r-panel-dark">
                <h3 style={{ margin: "0 0 8px", fontSize: 20 }}>Slots today and this week</h3>
                <p style={{ margin: "0 0 16px", fontSize: 12.5, lineHeight: 1.65 }}>
                  Morning to night windows. Emergency cases are dispatched whenever they arrive.
                </p>
                <div className="r-band-actions">
                  <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="r-btn r-btn-orange">
                    <Calendar size={14} /> Choose a time
                  </Link>
                  <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="r-btn r-btn-ghost-dark">
                    <WhatsAppIcon size={14} /> Ask first
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section r-section-white" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-tiles">
            {[
              { icon: <Stethoscope size={18} />, t: "One veterinarian, start to finish", d: "The clinician who examines your pet writes the plan and signs the record." },
              { icon: <ShieldCheck size={18} />, t: "Cold chain & batch logs", d: "Vaccines and injectables stored and transported under documented temperature control." },
              { icon: <CheckCircle2 size={18} />, t: "No surprise line items", d: "Anything beyond the professional fee is quoted and agreed before it is used." },
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

      {faq.length ? (
        <section className="r-section">
          <div className="r-wrap" style={{ maxWidth: 900 }}>
            <div className="r-rulehead"><h2>Frequently asked questions</h2></div>
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
      ) : null}

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-head-row" style={{ marginBottom: 22 }}>
            <h2 style={{ margin: 0, fontSize: 28 }}>Explore other services</h2>
            <Link href="/services" className="r-btn r-btn-outline">View All Services <ArrowRight size={14} /></Link>
          </div>
          <div className="r-cards">
            {related.map((item) => <ServiceCard key={item.slug} service={item} />)}
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-band">
            <div>
              <span className="label" style={{ color: "#e7b39a" }}>Ready when you are</span>
              <h2>Ready to book {service.shortTitle.toLowerCase()} in Lahore?</h2>
              <p>Choose a window, see the fee, get a printable booking slip. A veterinarian confirms every request — usually within twenty minutes.</p>
            </div>
            <div className="r-band-actions">
              <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="r-btn r-btn-orange r-btn-lg">Book Now <ArrowRight size={15} /></Link>
              <Link href="/contact-vet-lahore" className="r-btn r-btn-ghost-dark r-btn-lg">Ask a question</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
