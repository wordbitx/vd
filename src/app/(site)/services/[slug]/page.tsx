import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Calendar, Check, Clock, Home, MapPin, ShieldCheck, Stethoscope } from "lucide-react";
import { Breadcrumbs, CheckList, Divider, EmergencyStrip, Eyebrow, SectionHead, WhatsAppButton } from "@/components/ui";
import { ServiceCard } from "@/components/cards";
import { business, fees } from "@/lib/site";
import { money } from "@/lib/format";
import { catalogServices } from "@/server/catalog";
import { pageMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const services = await catalogServices();
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service not found" };
  return pageMetadata(
    `${service.title} in Lahore — from ${money(service.price)}`,
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
      <section className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: "Veterinary services", href: "/services" }, { label: service.shortTitle }]} />
          <div className="split">
            <div>
              <span className="pill pill-brass">{service.duration} typical</span>
              <h1 style={{ margin: "16px 0 18px", fontSize: "clamp(34px,4.6vw,56px)" }}>{service.title}</h1>
              <p className="lead">{service.overview}</p>
              <div className="row" style={{ gap: 11, marginTop: 24 }}>
                <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="button button-primary button-lg">
                  Book {service.shortTitle.toLowerCase()} <ArrowRight size={17} />
                </Link>
                <WhatsAppButton message={`Assalam-o-Alaikum, I would like to book ${service.title} for my pet.`} className="button button-ghost button-lg" label="Ask a question first" />
              </div>
              <div className="row" style={{ gap: 22, marginTop: 26, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
                <span className="price"><small>Professional fee from</small><b>{money(service.price)}</b></span>
                {service.homeAvailable ? (
                  <span className="trust-item"><Home size={15} style={{ color: "var(--brass)" }} /> Home visit +{money(fees.visitHomeStandard)}</span>
                ) : (
                  <span className="trust-item"><MapPin size={15} style={{ color: "var(--brass)" }} /> Hospital only</span>
                )}
                <span className="trust-item"><Stethoscope size={15} style={{ color: "var(--brass)" }} /> Records filed in your portal</span>
              </div>
            </div>
            <div className="figure figure-tall figure-frame" style={{ boxShadow: "var(--shadow-lg)" }}>
              <Image src={service.image} alt={service.title} fill sizes="45vw" className="object-cover" priority unoptimized />
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 30 }}>
        <div className="container grid cols-2" style={{ alignItems: "start", gap: 30 }}>
          <div className="card card-pad">
            <Eyebrow>What the visit includes</Eyebrow>
            <div style={{ marginTop: 16 }}>
              <CheckList items={service.includes} />
            </div>
            <Divider label="afterwards" />
            <p className="small muted" style={{ margin: "14px 0 0" }}>
              You leave with a written summary, any dispensed medicine with dosing on the label, and the next due date recorded in your
              Digital Pet Passport. Reprints are free, forever.
            </p>
          </div>
          <div className="col" style={{ gap: 18 }}>
            <div className="card card-pad">
              <h3 style={{ fontSize: 19 }}>Who it suits</h3>
              <p className="muted small" style={{ margin: "8px 0 0" }}>{service.suitable}</p>
            </div>
            <div className="card card-pad">
              <h3 style={{ fontSize: 19 }}>How to prepare</h3>
              <p className="muted small" style={{ margin: "8px 0 0" }}>{service.preparation}</p>
            </div>
            <div className="cta-band" style={{ padding: 22 }}>
              <div>
                <h3 style={{ color: "#fbf9f4", fontSize: 20 }}>Slots today and this week</h3>
                <p className="small" style={{ margin: "8px 0 14px", color: "#adc0c4" }}>
                  Morning to night windows. Emergency cases are dispatched whenever they arrive.
                </p>
                <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="button button-brass button-sm">
                  <Calendar size={14} /> Choose a time
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {faq.length ? (
        <section className="section band">
          <div className="container-narrow">
            <SectionHead eyebrow="Asked about this service" title={<>Good questions, <em>straight answers.</em></>} />
            <div className="faq" style={{ marginTop: 24 }}>
              {faq.map((item, i) => (
                <details key={item.q} open={i === 0}><summary>{item.q}</summary><div className="faq-body"><p>{item.a}</p></div></details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Often booked together" title="Next to this, pet parents also ask for" action={<Link href="/services" className="button button-ghost button-sm"><ArrowLeft size={14} /> All services</Link>} />
          <div className="service-grid" style={{ marginTop: 26 }}>
            {related.map((item) => <ServiceCard key={item.slug} service={item} />)}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingBottom: 46 }}>
        <div className="container grid" style={{ gap: 18 }}>
          <div className="card card-pad row" style={{ gap: 16 }}>
            <span className="service-icon" style={{ marginBottom: 0 }}><ShieldCheck size={19} /></span>
            <p className="small" style={{ margin: 0, flex: 1 }}>
              <b>Medicines dispensed by the clinic.</b> Where a treatment is straightforward we hand it over at the visit; anything that
              needs preparing is dispensed at the Al Kabir Town pharmacy with a dated label. {business.registration}.
            </p>
            <span className="tiny muted"><Clock size={12} style={{ verticalAlign: "-2px" }} /> Same-day for Lahore orders before 4 pm</span>
          </div>
          <EmergencyStrip />
        </div>
      </section>
    </>
  );
}
