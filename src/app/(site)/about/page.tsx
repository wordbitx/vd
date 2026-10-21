import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight, Award, Building2, Compass, Heart, HeartHandshake, Leaf, MapPin, ShieldCheck,
  Sparkles, Stethoscope, Target, Users,
} from "lucide-react";
import { ReviewCard, TrustStrip } from "@/components/cards";
import { WhatsAppIcon } from "@/components/icons";
import { business, fees, team } from "@/lib/site";
import { pkrLabel } from "@/lib/format";
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
      <section className="r-pagehero">
        <div className="r-wrap">
          <div className="r-crumbs">
            <Link href="/">Home</Link><span className="sep">/</span><span>About</span>
          </div>
          <div className="r-pagehero-inner">
            <div>
              <span className="label"><Building2 size={14} /> About us · since {business.established}</span>
              <h1>Professional Veterinary Care, Delivered to Your Doorstep Across Lahore.</h1>
              <p>
                {business.name} is a neighbourhood veterinary hospital and mobile vet team in Al Kabir Town. We bring
                professional animal healthcare directly to your doorstep — and when a case needs surgery, imaging or a
                night on fluids, our own hospital is ready for it.
              </p>
              <div className="r-pagehero-chips">
                <span className="r-chip r-chip-teal"><ShieldCheck size={12} /> RVMP registered</span>
                <span className="r-chip r-chip-teal"><MapPin size={12} /> Al Kabir Town, Lahore</span>
                <span className="r-chip r-chip-teal"><Users size={12} /> {team.length} clinicians &amp; staff</span>
              </div>
              <div className="r-pagehero-actions">
                <Link href="/book-vet-appointment-lahore" className="r-btn r-btn-teal r-btn-lg">Book a visit <ArrowRight size={15} /></Link>
                <Link href="/team" className="r-btn r-btn-outline r-btn-lg">Meet the team</Link>
              </div>
            </div>
            <div className="r-pagehero-media" style={{ aspectRatio: "4 / 3.3" }}>
              <Image src="/images/clinic-interior.jpg" alt="The waiting area at Jawad Veterinary Hospital" fill sizes="(max-width:900px) 92vw, 42vw" className="object-cover" priority unoptimized />
              <span className="r-media-tag">Town Gate 3, Main Raiwind Road</span>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 26 }}>
        <div className="r-wrap">
          <TrustStrip items={[
            { label: "Registered vets", value: String(team.filter((m) => m.credentials.includes("DVM")).length) },
            { label: "Home visits a year", value: "1,900+" },
            { label: "Species treated", value: "7" },
            { label: "Emergency cover", value: "24/7" },
          ]} />
        </div>
      </section>

      {/* vision + journey */}
      <section className="r-section" style={{ paddingTop: 34 }}>
        <div className="r-wrap">
          <div className="r-grid-2" style={{ gap: 20, alignItems: "stretch" }}>
            <div className="r-panel">
              <span className="r-kicker"><Compass size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />Our vision</span>
              <h2 style={{ margin: "10px 0 12px", fontSize: 28 }}>Redefining accessible pet care</h2>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "var(--r-muted)" }}>
                Stress-free, high-quality veterinary services at your doorstep — so animals do not have to travel to a
                clinic where they may be exposed to infectious disease. We want professional care to be convenient, safe
                and accessible for every pet in Lahore, and for the standard inside our hospital to be worth the journey
                when a pet does need to come in.
              </p>
              <ul className="r-checks" style={{ marginTop: 18 }}>
                <li>One clinician from examination through discharge note</li>
                <li>Every fee, including travel, disclosed before treatment</li>
                <li>Records the owner keeps, in a portal that outlives the visit</li>
              </ul>
            </div>
            <div className="r-panel-dark">
              <span className="r-kicker" style={{ color: "#e7b39a" }}><Sparkles size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />Our journey</span>
              <h2 style={{ margin: "10px 0 12px", fontSize: 28 }}>From a two-room clinic to a hospital with a mobile team</h2>
              <p style={{ margin: "0 0 12px", fontSize: 13.5, lineHeight: 1.75 }}>
                {business.name} started on Raiwind Road with one rule: never let a frightened animal be handled roughly, and
                never let an owner leave without understanding the plan. Seven years later that rule still runs the place —
                it just has a theatre, a pharmacy, a cold chain and a delivery bike now.
              </p>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.75 }}>
                The home-visit service grew out of necessity: senior dogs, anxious cats and litters too young to travel. It
                is now half our clinical work, and the reason many families in south Lahore can get care at all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="r-section r-section-white">
        <div className="r-wrap">
          <div className="r-head">
            <span className="label"><Heart size={14} /> Our values</span>
            <h2 style={{ marginTop: 10 }}>Guiding everything we do</h2>
            <p>Six commitments that decide how we treat an animal, price a treatment and answer a difficult question.</p>
          </div>
          <div className="r-tiles">
            {[
              { icon: <HeartHandshake size={19} />, t: "Compassion", d: "Every pet is handled with love, patience and respect — including the ones that bite out of fear." },
              { icon: <Users size={19} />, t: "Customer care", d: "A phone that is answered, a WhatsApp that is replied to, and a front desk that knows your pet's name." },
              { icon: <Leaf size={19} />, t: "Stress-free service", d: "Home visits where the animal is calm, and a hospital with separate quiet space for cats." },
              { icon: <Award size={19} />, t: "Professional excellence", d: "Evidence-based medicine, documented doses and continuing education for every clinician." },
              { icon: <ShieldCheck size={19} />, t: "Trust & transparency", d: "Itemised quotes, no surprise line items, and records you can download whenever you want them." },
              { icon: <Target size={19} />, t: "Animal welfare", d: "If a treatment is not in the animal's interest, we say so — even when it costs us the invoice." },
            ].map((value) => (
              <div key={value.t} className="r-tile">
                <span className="r-tile-icon">{value.icon}</span>
                <b>{value.t}</b>
                <span>{value.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how the hospital works */}
      <section className="r-section">
        <div className="r-wrap">
          <div className="r-rulehead"><h2>How the hospital works</h2></div>
          <div className="r-grid-2" style={{ alignItems: "start", gap: 24 }}>
            <div style={{ display: "grid", gap: 14 }}>
              {[
                { icon: <Stethoscope size={18} />, t: "Two consultation rooms", d: "A quiet, cat-friendly room with towel-free handling and a separate dog room, so nobody waits in the same space as their predator. Appointments are scheduled, not queued." },
                { icon: <HeartHandshake size={18} />, t: "Procedure theatre & recovery", d: "Monitored anaesthesia with pulse oximetry, sterile instrument cycles and padded recovery runs where a pet stays warm and watched, not caged in a corridor." },
                { icon: <ShieldCheck size={18} />, t: "Pharmacy, cold chain and store", d: "Vaccines held at 2–8°C with twice-daily logs, medicines dispensed against a written prescription, and the pet mall stocked with what our own clinicians recommend." },
              ].map((item) => (
                <div key={item.t} className="r-flow-item">
                  <span className="r-flow-n"><span style={{ display: "grid", placeItems: "center", color: "var(--r-teal-2)" }}>{item.icon}</span></span>
                  <div>
                    <b>{item.t}</b>
                    <p>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              <div className="r-panel">
                <span className="r-kicker">Principles we are judged on</span>
                <ul className="r-checks" style={{ marginTop: 14 }}>
                  {[
                    "Explain the finding, the options and the cost before anything starts",
                    "Dose on a measured weight, never an estimate",
                    "Write it down — every vaccine batch, every prescription",
                    "Say when a case needs a specialist, and help arrange it",
                    "Never sell a product that will not help",
                  ].map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="r-panel" style={{ background: "linear-gradient(150deg, var(--r-cream-2), #fff)" }}>
                <span className="r-kicker">Fees, kept simple</span>
                <p style={{ margin: "10px 0 12px", fontSize: 13, lineHeight: 1.7, color: "var(--r-muted)" }}>
                  Hospital consultation from {pkrLabel(fees.visitClinic)}; home visits add {pkrLabel(fees.visitHomeStandard)} travel
                  ({pkrLabel(fees.visitHomeEmergency)} emergency or night). Medicines at a fair margin, with the invoice on request.
                </p>
                <Link href="/services" className="r-link">See every service and fee <ArrowRight size={14} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* team strip */}
      <section className="r-section r-section-white" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-head-row">
            <div className="r-head">
              <span className="label"><Users size={14} /> The people</span>
              <h2 style={{ marginTop: 10 }}>Vets who stay on the phone after the appointment</h2>
              <p>Four clinicians, one manager who keeps the pharmacy honest, and a support team that answers WhatsApp in Urdu, Punjabi and English.</p>
            </div>
            <Link href="/team" className="r-btn r-btn-outline">Full team pages <ArrowRight size={15} /></Link>
          </div>
          <div className="r-cards r-cards-4">
            {team.slice(0, 4).map((member) => (
              <article key={member.slug} className="r-member">
                <div className="r-member-media">
                  <Image src={member.image} alt={member.name} fill sizes="(max-width:900px) 45vw, 22vw" className="object-cover" unoptimized />
                </div>
                <div className="r-member-body">
                  <span className="r-member-role">{member.role}</span>
                  <h3>{member.name}</h3>
                  <span className="r-member-meta">{member.credentials} · {member.years} yrs</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* reviews */}
      <section className="r-section" id="reviews">
        <div className="r-wrap">
          <div className="r-head-row">
            <div className="r-head">
              <span className="label"><Award size={14} /> In their words</span>
              <h2 style={{ marginTop: 10 }}>Reviews we did not write</h2>
              <p>Collected on Google, published here without edits — the good and the blunt.</p>
            </div>
            <span className="r-chip r-chip-peach"><Users size={12} /> 184 Google reviews · 4.9 average</span>
          </div>
          <div className="r-cards">
            {reviews.slice(0, 6).map((r) => <ReviewCard key={r.name} review={r} />)}
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-band">
            <div>
              <span className="label" style={{ color: "#e7b39a" }}><Award size={13} /> Bring us a second opinion</span>
              <h2>We will read the old notes properly.</h2>
              <p>Send previous records before the visit and we will prepare — many owners come to us precisely because someone else rushed them.</p>
            </div>
            <div className="r-band-actions">
              <Link href="/book-vet-appointment-lahore" className="r-btn r-btn-orange r-btn-lg">Book a consult <ArrowRight size={15} /></Link>
              <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="r-btn r-btn-ghost-dark r-btn-lg">
                <WhatsAppIcon size={15} /> Send records
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
