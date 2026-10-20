import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Calendar, Check, Clock, Home, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { Breadcrumbs, CheckList, EmergencyStrip, Eyebrow, SectionHead, WhatsAppButton } from "@/components/ui";
import { ServiceCard } from "@/components/cards";
import { business, faqs, fees } from "@/lib/site";
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
  const home = services.filter((s) => s.homeAvailable);
  const hospital = services.filter((s) => !s.homeAvailable);

  return (
    <>
      <section className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: "Veterinary services" }]} />
          <div className="split">
            <div>
              <Eyebrow>{business.city} · hospital &amp; mobile clinic</Eyebrow>
              <h1 style={{ margin: "16px 0 18px", fontSize: "clamp(36px,5vw,64px)" }}>
                Veterinary services, <em>priced before you arrive.</em></h1>
              <p className="lead">
                Every service below can be booked as a home visit or at the Al Kabir Town hospital. The fee shown is the professional
                fee; a home visit adds {money(fees.visitHomeStandard)} ({money(fees.visitHomeEmergency)} for emergency or night dispatch),
                and medicines or lab analysis are quoted at the visit.
              </p>
              <div className="row" style={{ gap: 11, marginTop: 24 }}>
                <Link href="/book-vet-appointment-lahore" className="button button-primary button-lg">Book a service <ArrowRight size={17} /></Link>
                <WhatsAppButton message="Assalam-o-Alaikum, I would like advice on which service my pet needs." className="button button-ghost button-lg" label="Not sure? Ask us" />
              </div>
            </div>
            <div className="figure figure-wide" style={{ boxShadow: "var(--shadow)" }}>
              <Image src="/images/hero-care.jpg" alt="Veterinarian examining a dog during a service at Jawad Veterinary Hospital" fill sizes="45vw" className="object-cover" priority unoptimized />
              <span className="figure-tag" style={{ bottom: 22, left: 22 }}>Everything here is done in-house<br />or with a partner lab we trust.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="grid cols-4" style={{ gap: 12 }}>
            {[
              { icon: <Home size={17} />, t: "Home visits", d: "16 areas across Lahore, 10 am – 2 am" },
              { icon: <Stethoscope size={17} />, t: "Hospital consult", d: `Walk-in & scheduled from ${money(fees.visitClinic)}` },
              { icon: <ShieldCheck size={17} />, t: "Cold-chain vaccines", d: "Batch logged, card issued every time" },
              { icon: <Users size={17} />, t: "All species", d: "Dogs, cats, rabbits, birds, reptiles" },
            ].map((item) => (
              <div key={item.t} className="card card-pad" style={{ display: "grid", gap: 7 }}>
                <span className="service-icon" style={{ width: 36, height: 36, marginBottom: 0 }}>{item.icon}</span>
                <b style={{ fontSize: 14.5 }}>{item.t}</b>
                <span className="small muted">{item.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 34 }}>
        <div className="container">
          <SectionHead eyebrow="Available at your door" title={<>Home-visit services</>} lead="The veterinarian arrives with examination tools, oxygen, IV support, a splinting kit and the mobile pharmacy." />
          <div className="service-grid" style={{ marginTop: 26 }}>
            {home.map((service) => <ServiceCard key={service.slug} service={service} cta="Book a visit" />)}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="container">
          <SectionHead eyebrow="At the hospital" title={<>Procedures that need the theatre</>} lead="These are done in the Al Kabir Town facility, with pre-anaesthetic screening and monitored recovery." />
          <div className="service-grid" style={{ marginTop: 26 }}>
            {hospital.map((service) => <ServiceCard key={service.slug} service={service} cta="Book at hospital" />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <div>
              <Eyebrow>Fees, honestly</Eyebrow>
              <h2 style={{ margin: "14px 0 16px" }}>What a <em>“starting fee”</em> actually covers.</h2>
              <CheckList
                items={[
                  "The veterinarian's time, examination and written plan",
                  "Records filed in your Digital Pet Passport",
                  "Travel within Lahore for home visits (charged once per visit)",
                  "Dispensed medicines where they are simple and in stock",
                ]}
              />
              <p className="muted small" style={{ marginTop: 18 }}>
                Anything beyond the consult — lab panels, imaging, surgery, hospitalisation — is quoted in writing before it starts.
                If the estimate changes mid-treatment, we call you first.
              </p>
            </div>
            <div className="card card-pad">
              <h3 style={{ fontSize: 19, marginBottom: 14 }}>Typical ranges in Lahore</h3>
              <div className="summary-rows">
                {[
                  ["Hospital consultation", `${money(fees.visitClinic)} – ${money(1500)}`],
                  ["Home visit charge", `${money(fees.visitHomeStandard)} (day) · ${money(fees.visitHomeEmergency)} (emergency)`],
                  ["Vaccination (imported, incl. record card)", `${money(3000)} – ${money(5500)}`],
                  ["Dental scale & polish (monitored anaesthesia)", `${money(8000)} – ${money(16000)}`],
                  ["Neutering (cat / small dog)", `${money(12000)} – ${money(26000)}`],
                  ["Blood panel (CBC + 6 biochemistry)", `${money(4500)} – ${money(7500)}`],
                ].map(([label, value]) => (
                  <div className="summary-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </div>
              <p className="tiny muted" style={{ margin: "14px 0 0" }}>
                <Clock size={12} style={{ display: "inline", verticalAlign: "-2px" }} /> Indicative only. Final quotes depend on weight, age,
                anaesthesia risk and what the examination finds — confirmed before treatment begins.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section band-sage">
        <div className="container">
          <SectionHead eyebrow="Common questions" title={<>Before you <em>press book.</em></>} align="center" />
          <div className="faq" style={{ marginTop: 30, maxWidth: 900, marginInline: "auto" }}>
            {faqs.map((faq, i) => (
              <details key={faq.q} open={i === 0}><summary>{faq.q}</summary><div className="faq-body"><p>{faq.a}</p></div></details>
            ))}
          </div>
          <div className="row" style={{ justifyContent: "center", gap: 11, marginTop: 28 }}>
            <Link href="/book-vet-appointment-lahore" className="button button-primary"><Calendar size={16} /> Book a slot</Link>
            <Link href="/contact-vet-lahore" className="button button-ghost">Talk to the desk <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingBottom: 46 }}>
        <div className="container"><EmergencyStrip /></div>
      </section>
    </>
  );
}
