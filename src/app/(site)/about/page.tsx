import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Award, Building2, HeartHandshake, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { Breadcrumbs, CheckList, Eyebrow, SectionHead, WhatsAppButton } from "@/components/ui";
import { ReviewCard, TrustStrip } from "@/components/cards";
import { business, fees, team } from "@/lib/site";
import { money } from "@/lib/format";
import { catalogTestimonials } from "@/server/catalog";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "About Jawad Veterinary Hospital in Lahore — Al Kabir Town",
  "A neighbourhood veterinary hospital with 24/7 home visits, an in-house pharmacy and a pet mall in Al Kabir Town, Lahore. Registered vets, honest referrals and records you keep.",
  "/about",
  "/images/clinic-interior.jpg",
);

export default async function AboutPage() {
  const reviews = await catalogTestimonials();
  return (
    <>
      <section className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: "About" }]} />
          <div className="split">
            <div>
              <Eyebrow>About us · since {business.established}</Eyebrow>
              <h1 style={{ margin: "16px 0 18px", fontSize: "clamp(34px,4.8vw,60px)" }}>
                Professional Veterinary Care, Delivered to Your Doorstep Across Lahore.</h1>
              <p className="lead">
                Jawad Veterinary Hospital started as a two-room clinic on Raiwind Road with one rule: never let a frightened animal be
                handled roughly, and never let an owner leave without understanding the plan. Seven years later that rule still runs the
                place — it just has a theatre, a pharmacy, a cold chain and a delivery bike now.
              </p>
              <div className="row" style={{ gap: 11, marginTop: 24 }}>
                <Link href="/book-vet-appointment-lahore" className="button button-primary button-lg">Book a visit <ArrowRight size={17} /></Link>
                <Link href="/team" className="button button-ghost button-lg">Meet the team</Link>
              </div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="figure figure-tall" style={{ boxShadow: "var(--shadow)" }}>
                <Image src="/images/clinic-interior.jpg" alt="The Jawad Veterinary Hospital waiting area" fill sizes="24vw" className="object-cover" priority unoptimized />
              </div>
              <div className="col" style={{ gap: 12 }}>
                <div className="figure figure-square">
                  <Image src="/images/team-vets.jpg" alt="Veterinary team examining a dog" fill sizes="22vw" className="object-cover" unoptimized />
                </div>
                <div className="card card-pad">
                  <b style={{ fontSize: 13 }}>What we will not do</b>
                  <p className="small muted" style={{ margin: "6px 0 0" }}>We do not sell a treatment we cannot explain, and we do not
                    pretend a hospital-only procedure can be done at home.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 26 }}>
        <div className="container">
          <TrustStrip items={[
            { label: "Registered vets", value: String(team.filter((m) => m.credentials.includes("DVM")).length) },
            { label: "Home visits a year", value: "1,900+" },
            { label: "Species treated", value: "7" },
            { label: "Emergency cover", value: "24/7" },
          ]} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <div>
              <Eyebrow>How the hospital works</Eyebrow>
              <h2 style={{ margin: "14px 0 18px" }}>Three rooms, <em>one standard.</em></h2>
              <div className="col" style={{ gap: 16 }}>
                {[
                  { icon: <Stethoscope size={18} />, t: "Two consultation rooms", d: "A quiet, cat-friendly room with towel-free handling and a separate dog room, so nobody waits in the same space as their predator. Appointments are scheduled, not queued." },
                  { icon: <HeartHandshake size={18} />, t: "Procedure theatre & recovery", d: "Monitored anaesthesia with pulse oximetry, sterile instrument cycles and padded recovery runs where a pet stays warm and watched, not caged in a corridor." },
                  { icon: <ShieldCheck size={18} />, t: "Pharmacy, cold chain and store", d: "Vaccines held at 2–8°C with twice-daily logs, medicines dispensed against a written prescription, and the pet mall stocked with what our own clinicians recommend." },
                ].map((item) => (
                  <div key={item.t} className="card card-pad" style={{ display: "grid", gridTemplateColumns: "42px 1fr", gap: 14 }}>
                    <span className="service-icon" style={{ marginBottom: 0 }}>{item.icon}</span>
                    <div>
                      <h3 style={{ fontSize: 18 }}>{item.t}</h3>
                      <p className="small muted" style={{ margin: "7px 0 0" }}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col" style={{ gap: 18 }}>
              <div className="card card-pad">
                <h3 style={{ fontSize: 19 }}>Principles we are judged on</h3>
                <div style={{ marginTop: 14 }}>
                  <CheckList items={[
                    "Explain the finding, the options and the cost before anything starts",
                    "Dose on a measured weight, never an estimate",
                    "Write it down — every vaccine batch, every prescription",
                    "Say when a case needs a specialist, and help arrange it",
                    "Never sell a product that will not help",
                  ]} />
                </div>
              </div>
              <div className="card card-pad" style={{ background: "linear-gradient(150deg,#f8f4ec,#fffdfa)" }}>
                <span className="row" style={{ gap: 10 }}><Building2 size={17} style={{ color: "var(--brand)" }} /><b>Fees, kept simple</b></span>
                <p className="small muted" style={{ margin: "8px 0 10px" }}>
                  Hospital consultation from {money(fees.visitClinic)}; home visits add {money(fees.visitHomeStandard)} travel ({money(fees.visitHomeEmergency)} emergency or
                  night). Medicines at cost-plus-a-fair-margin, with the invoice on request.
                </p>
                <Link href="/services" className="link-arrow">See every service and fee <ArrowRight size={14} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section band-dark">
        <div className="container">
          <SectionHead tone="light" eyebrow="The people" title={<>Vets who stay on the phone <em>after</em> the appointment.</>}
            lead="Four clinicians, one manager who keeps the pharmacy honest, and a support team that answers WhatsApp in Urdu, Punjabi and English."
            action={<Link href="/team" className="button button-outline-light">Full team pages <ArrowRight size={16} /></Link>} />
          <div className="grid cols-4" style={{ marginTop: 30 }}>
            {team.slice(0, 4).map((member) => (
              <article key={member.slug} className="card-dark" style={{ padding: 16 }}>
                <div className="figure figure-square" style={{ borderRadius: 12 }}>
                  <Image src={member.image} alt={member.name} fill sizes="22vw" className="object-cover" unoptimized />
                </div>
                <div style={{ marginTop: 14 }}>
                  <b style={{ fontSize: 15, color: "#f6f3ea" }}>{member.name}</b>
                  <p className="tiny" style={{ margin: "4px 0 0", color: "#93a9ae" }}>{member.role}</p>
                  <p className="tiny" style={{ margin: "8px 0 0", color: "#b9c8cc" }}>{member.credentials} · {member.years} yrs</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="reviews">
        <div className="container">
          <SectionHead eyebrow="In their words" title={<>Reviews we did <em>not write.</em></>}
            action={<span className="card row" style={{ padding: "10px 16px", gap: 10 }}><Users size={15} style={{ color: "var(--brand)" }} /><b style={{ fontSize: 13.5 }}>184 Google reviews</b><span className="tiny muted">4.9 average</span></span>} />
          <div className="quote-grid" style={{ marginTop: 28 }}>
            {reviews.slice(0, 6).map((r) => <ReviewCard key={r.name} review={r} />)}
          </div>
          <div className="cta-band" style={{ marginTop: 34 }}>
            <div className="cta-inner">
              <div>
                <Eyebrow tone="light"><Award size={13} /> Bring us a second opinion</Eyebrow>
                <h2 style={{ margin: "12px 0 8px", fontSize: "clamp(24px,3vw,36px)" }}>We will read the old notes properly.</h2>
                <p>Send previous records before the visit and we will prepare — many owners come to us precisely because someone else rushed them.</p>
              </div>
              <div className="cta-actions">
                <Link href="/book-vet-appointment-lahore" className="button button-brass button-lg">Book a consult <ArrowRight size={16} /></Link>
                <WhatsAppButton message="Assalam-o-Alaikum, I would like a second opinion on my pet's records." className="button button-outline-light button-lg" label="Send records on WhatsApp" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
