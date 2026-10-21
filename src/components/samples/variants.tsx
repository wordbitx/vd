import Image from "next/image";
import {
  ArrowRight, ArrowUpRight, Calendar, Check, Clock, Heart, MapPin, PawPrint,
  Phone, Search, ShieldCheck, ShoppingBag, Sparkles, Star, Stethoscope, Truck,
} from "lucide-react";
import { ADOPTS, CAT_IMG, HERO_IMG, PRODUCTS, REVIEWS, SERVICES, STATS, VET_IMG, CLINIC_IMG, DOG_IMG } from "./data";
import { PawWellGreen, PawWellIvory, PawWellSlate, PawWellSage } from "./pawwell";

/* ── shared primitives ───────────────────────────────────────────────── */

function Ph({ src, alt = "", className = "", priority = false }: { src: string; alt?: string; className?: string; priority?: boolean }) {
  return (
    <span className={`smp-ph ${className}`}>
      <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 50vw" className="smp-ph-img" priority={priority} unoptimized />
    </span>
  );
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="smp-stars" aria-label={`${n} out of 5`}>
      {Array.from({ length: n }).map((_, i) => <Star key={i} size={11} fill="currentColor" strokeWidth={0} />)}
    </span>
  );
}

function Foot() {
  return (
    <footer className="smp-foot">
      <div className="smp-foot-in">
        <span className="smp-brand"><PawPrint size={14} /> Jawad Veterinary Hospital</span>
        <span className="smp-foot-meta">Al Kabir Town, Lahore · 0307-8517122</span>
      </div>
    </footer>
  );
}

function Tail() {
  return (
    <section className="smp-tail">
      <div className="smp-tail-in">
        <div className="smp-tail-copy">
          <span className="smp-kicker">Ready when you are</span>
          <h2>A calmer visit starts here.</h2>
          <p>Home visits across Lahore and a fully equipped hospital in Al Kabir Town — same-day slots, seven days a week.</p>
        </div>
        <div className="smp-tail-actions">
          <a className="smp-btn">Book a home visit <ArrowRight size={14} /></a>
          <a className="smp-btn-2"><Phone size={13} /> 0307-8517122</a>
        </div>
      </div>
      <div className="smp-tail-reviews">
        {REVIEWS.map((r) => (
          <figure key={r.name}>
            <Stars />
            <blockquote>“{r.text}”</blockquote>
            <figcaption>{r.name} · {r.tag}</figcaption>
          </figure>
        ))}
      </div>
      <ul className="smp-tail-strip">
        {["24/7 emergency line", "RVMP-registered vets", "Free follow-up visit", "Cash, Easypaisa or transfer"].map((t) => (
          <li key={t}><Check size={12} /> {t}</li>
        ))}
      </ul>
    </section>
  );
}

const ICONS = [Stethoscope, ShieldCheck, Sparkles, Heart, Phone, Truck];

function ServiceIcon({ i }: { i: number }) {
  const I = ICONS[i % ICONS.length];
  return <I size={18} />;
}

/* ══ 01 · AURORA SPLIT ═════════════════════════════════════════════════ */
export function AuroraSplit() {
  return (
    <div className="smp smp--aurora">
      <header className="smp-nav">
        <span className="smp-brand"><PawPrint size={15} /> Jawad</span>
        <nav>{["Services", "Team", "Pet Mall", "Adopt"].map((l) => <a key={l}>{l}</a>)}</nav>
        <div className="smp-nav-cta"><a className="smp-ghost">Log in</a><a className="smp-btn">Book a visit</a></div>
      </header>

      <section className="smp-hero">
        <div className="smp-hero-copy">
          <span className="smp-eyebrow"><i /> Lahore · Est. 2026</span>
          <h1>Professional Vet Care,<span> At Your Doorstep</span></h1>
          <p>Clinic-grade care in your own home, backed by a fully equipped hospital in Al Kabir Town.</p>
          <div className="smp-actions">
            <a className="smp-btn">Book a home visit <ArrowRight size={14} /></a>
            <a className="smp-btn-2">Speak to a vet</a>
          </div>
          <ul className="smp-trust">
            {["24/7 emergency", "RVMP certified", "All pets welcome"].map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
        <div className="smp-hero-card">
          <Ph src={VET_IMG} alt="Dr. Jawad Hussain" priority />
          <div className="smp-hero-card-b">
            <span className="smp-kicker">Top rated</span>
            <b>Dr. Jawad Hussain</b>
            <small>DVM (RVMP) · Lead Veterinarian</small>
            <Stars />
          </div>
        </div>
      </section>

      <section className="smp-band">
        <div className="smp-band-head"><h2>Our services</h2><a>View all <ArrowRight size={13} /></a></div>
        <div className="smp-grid-3">
          {SERVICES.slice(0, 3).map((s, i) => (
            <article key={s.name} className="smp-card">
              <span className="smp-ico"><ServiceIcon i={i} /></span>
              <h3>{s.name}</h3>
              <p>{s.blurb}</p>
              <span className="smp-meta"><Clock size={11} /> {s.duration}</span>
            </article>
          ))}
        </div>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 02 · GRAND EDITORIAL ══════════════════════════════════════════════ */
export function GrandEditorial() {
  return (
    <div className="smp smp--editorial">
      <header className="smp-nav smp-nav-center">
        <nav><a>Services</a><a>Team</a></nav>
        <span className="smp-brand"><PawPrint size={15} /> Jawad</span>
        <nav><a>Pet Mall</a><a>Contact</a></nav>
      </header>

      <section className="smp-cover">
        <Ph src={HERO_IMG} className="smp-cover-bg" priority />
        <div className="smp-cover-veil" />
        <div className="smp-cover-in">
          <span className="smp-eyebrow"><i /> Veterinary hospital, Lahore</span>
          <h1>Care that comes<br /><em>to your door.</em></h1>
          <p>Home visits, surgery aftercare and a fully equipped hospital — one team, one record, no travel stress.</p>
          <div className="smp-actions smp-actions-center">
            <a className="smp-btn">Book an appointment</a>
            <a className="smp-btn-ghost">Explore services <ArrowUpRight size={13} /></a>
          </div>
        </div>
      </section>

      <section className="smp-band smp-band-cream">
        <div className="smp-split">
          <div>
            <span className="smp-kicker">Why parents call us</span>
            <h2>Clinic standards, without the clinic.</h2>
            <p className="smp-lead">Every visit starts with a full examination and ends with a written plan — no rush, no upselling.</p>
          </div>
          <ul className="smp-list">
            {["RVMP-registered veterinarians", "Same-day home appointments", "Digital records and a client portal", "Transparent, itemised pricing"].map((t) => (
              <li key={t}><Check size={14} /> {t}</li>
            ))}
          </ul>
        </div>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 03 · MIDNIGHT LUXE ════════════════════════════════════════════════ */
export function MidnightLuxe() {
  return (
    <div className="smp smp--midnight">
      <header className="smp-nav">
        <span className="smp-brand"><PawPrint size={15} /> JAWAD</span>
        <nav>{["Services", "Hospital", "Shop"].map((l) => <a key={l}>{l}</a>)}</nav>
        <a className="smp-btn smp-btn-line">Emergency · 24/7</a>
      </header>

      <section className="smp-hero smp-hero-mid">
        <div className="smp-hero-copy">
          <span className="smp-eyebrow">Est. 2026 — Al Kabir Town</span>
          <h1>Veterinary<br />excellence,<br /><em>quietly delivered.</em></h1>
          <p>A small team of clinicians who still make house calls. Discreet, unhurried, and available at hours that suit you.</p>
          <div className="smp-actions">
            <a className="smp-btn">Request a visit</a>
            <a className="smp-link">Our approach <ArrowRight size={13} /></a>
          </div>
        </div>
        <div className="smp-mid-card">
          <span className="smp-kicker">Tonight</span>
          <b>Emergency line open</b>
          <p>One call, one clinician, and a plan within minutes.</p>
          <div className="smp-mid-rule" />
          <span className="smp-meta">0307-8517122 · 24 hours</span>
        </div>
      </section>

      <section className="smp-band smp-band-dark">
        <div className="smp-band-head"><h2>Selected services</h2><a>All services <ArrowRight size={13} /></a></div>
        <div className="smp-rows">
          {SERVICES.slice(0, 4).map((s, i) => (
            <a key={s.name} className="smp-row">
              <span className="smp-row-n">0{i + 1}</span>
              <span className="smp-row-t">{s.name}</span>
              <span className="smp-row-d">{s.blurb}</span>
              <ArrowUpRight size={15} />
            </a>
          ))}
        </div>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 04 · CLINICAL CALM ════════════════════════════════════════════════ */
export function ClinicalCalm() {
  return (
    <div className="smp smp--calm">
      <header className="smp-nav">
        <span className="smp-brand"><PawPrint size={15} /> Jawad Veterinary</span>
        <nav>{["Services", "Team", "Pet Mall", "Contact"].map((l) => <a key={l}>{l}</a>)}</nav>
        <div className="smp-nav-cta"><a className="smp-ghost"><Phone size={13} /> 0307-8517122</a><a className="smp-btn">Book now</a></div>
      </header>

      <section className="smp-hero smp-hero-calm">
        <div className="smp-hero-copy">
          <span className="smp-badge-soft"><ShieldCheck size={13} /> RVMP registered clinic</span>
          <h1>Good medicine,<br />calmly delivered.</h1>
          <p>Home visits across Lahore and a fully equipped hospital in Al Kabir Town. Clear advice, fair pricing, no pressure.</p>
          <div className="smp-actions">
            <a className="smp-btn">Book an appointment</a>
            <a className="smp-btn-2"><Phone size={14} /> Call the clinic</a>
          </div>
        </div>
        <Ph src={CLINIC_IMG} className="smp-hero-img" priority />
      </section>

      <div className="smp-bookbar">
        <div><span>Service</span><b>General checkup</b></div>
        <div><span>Where</span><b>At my home</b></div>
        <div><span>When</span><b>Tomorrow, 10:00</b></div>
        <a className="smp-btn">Check availability</a>
      </div>

      <section className="smp-band">
        <div className="smp-band-head"><h2>What we treat</h2></div>
        <div className="smp-grid-3">
          {SERVICES.slice(0, 6).map((s, i) => (
            <article key={s.name} className="smp-card smp-card-calm">
              <span className="smp-ico"><ServiceIcon i={i} /></span>
              <h3>{s.name}</h3><p>{s.blurb}</p>
            </article>
          ))}
        </div>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 05 · BENTO CLINIC ═════════════════════════════════════════════════ */
export function BentoClinic() {
  return (
    <div className="smp smp--bento">
      <header className="smp-nav">
        <span className="smp-brand"><PawPrint size={15} /> Jawad</span>
        <nav>{["Services", "Team", "Adopt"].map((l) => <a key={l}>{l}</a>)}</nav>
        <a className="smp-btn">Book a visit</a>
      </header>

      <section className="smp-bento-hero">
        <div className="smp-bento-copy">
          <span className="smp-eyebrow"><i /> Lahore</span>
          <h1>Every kind of care, under one roof.</h1>
          <p>Preventive medicine, surgery, dentistry and emergencies — at home or at the hospital.</p>
        </div>
        <div className="smp-bento">
          <article className="smp-tile smp-tile-a">
            <span className="smp-kicker">Most booked</span>
            <h3>General Checkup &amp; Wellness</h3>
            <p>A full nose-to-tail examination with a written plan you can actually follow.</p>
            <a className="smp-btn">Book this</a>
          </article>
          <article className="smp-tile smp-tile-b"><ServiceIcon i={1} /><b>Vaccination</b><small>20–30 min</small></article>
          <article className="smp-tile smp-tile-c"><ServiceIcon i={2} /><b>Deworming</b><small>20 min</small></article>
          <article className="smp-tile smp-tile-d"><ServiceIcon i={4} /><b>Emergency</b><small>24/7</small></article>
          <article className="smp-tile smp-tile-e"><ServiceIcon i={3} /><b>Dental</b><small>30–45 min</small></article>
          <article className="smp-tile smp-tile-f"><ServiceIcon i={5} /><b>Lab tests</b><small>At home</small></article>
        </div>
      </section>

      <section className="smp-band">
        <div className="smp-band-head"><h2>Everything else, in one place</h2></div>
        <div className="smp-grid-4">
          {STATS.map((s) => <div key={s.l} className="smp-stat"><b>{s.v}</b><span>{s.l}</span></div>)}
        </div>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 06 · BOOKING FIRST ════════════════════════════════════════════════ */
export function BookingFirst() {
  return (
    <div className="smp smp--booking">
      <header className="smp-nav">
        <span className="smp-brand"><PawPrint size={15} /> Jawad</span>
        <nav>{["Services", "Team", "Pet Mall"].map((l) => <a key={l}>{l}</a>)}</nav>
        <a className="smp-ghost">0307-8517122</a>
      </header>

      <section className="smp-hero smp-hero-book">
        <div className="smp-hero-copy">
          <span className="smp-eyebrow"><i /> Booking takes 60 seconds</span>
          <h1>A vet at your door,<br /><em>today.</em></h1>
          <p>Choose a service and a slot. We confirm on WhatsApp, and your clinician arrives with everything needed.</p>
          <ul className="smp-trust"><li>24/7 emergency</li><li>Fixed visit fee</li><li>Free follow-up</li></ul>
        </div>

        <div className="smp-wizard">
          <div className="smp-wizard-top"><span className="smp-kicker">Book a visit</span><span className="smp-wizard-step">1 / 3</span></div>
          <label className="smp-field"><span>Service</span><b>General checkup</b></label>
          <div className="smp-two">
            <label className="smp-field"><span>Date</span><b>22 Oct</b></label>
            <label className="smp-field"><span>Time</span><b>10:00</b></label>
          </div>
          <label className="smp-field"><span>Area</span><b>Al Kabir Town</b></label>
          <a className="smp-btn smp-btn-wide">Continue <ArrowRight size={14} /></a>
          <small className="smp-fine">No payment now · free cancellation</small>
        </div>
      </section>

      <section className="smp-band">
        <div className="smp-grid-3">
          {["Tell us where", "Pick a time", "We arrive"].map((t, i) => (
            <div key={t} className="smp-step"><span>0{i + 1}</span><b>{t}</b><p>{["Address and area, in two taps.", "Same-day slots, seven days a week.", "Clinician calls before arriving."][i]}</p></div>
          ))}
        </div>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 07 · MAGAZINE SPREAD ══════════════════════════════════════════════ */
export function MagazineSpread() {
  return (
    <div className="smp smp--magazine">
      <header className="smp-masthead">
        <span className="smp-mast-date">Wednesday, 21 October 2026 · Lahore</span>
        <span className="smp-mast-title">The Doorstep</span>
        <span className="smp-mast-date smp-right">Published by Jawad Veterinary Hospital</span>
      </header>
      <nav className="smp-mast-nav">{["Services", "Hospital", "Pet Care", "Adoption", "Contact"].map((l) => <a key={l}>{l}</a>)}</nav>

      <section className="smp-front">
        <div className="smp-front-lead">
          <span className="smp-kicker">The lead story</span>
          <h1>House calls are back — and pets are calmer for it.</h1>
          <p className="smp-standfirst">Inside a Lahore practice that traded waiting rooms for living rooms, and what it means for animals who hate the car.</p>
          <div className="smp-byline"><b>Dr. Jawad Hussain</b><span>·</span><i>5 min read</i></div>
        </div>
        <Ph src={DOG_IMG} className="smp-front-img" priority />
        <aside className="smp-front-side">
          <span className="smp-kicker">Also inside</span>
          <a><b>Vaccination, explained</b><small>Which jabs, and when</small></a>
          <a><b>Dental disease in cats</b><small>The quiet majority</small></a>
          <a><b>Adopting in Lahore</b><small>Four cats looking</small></a>
        </aside>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 08 · WARM BOUTIQUE ════════════════════════════════════════════════ */
export function WarmBoutique() {
  return (
    <div className="smp smp--boutique">
      <header className="smp-nav">
        <span className="smp-brand"><PawPrint size={15} /> Jawad</span>
        <nav>{["Services", "Team", "Pet Mall", "Adopt"].map((l) => <a key={l}>{l}</a>)}</nav>
        <a className="smp-btn smp-btn-round">Book a visit</a>
      </header>

      <section className="smp-hero smp-hero-boutique">
        <div className="smp-blob" aria-hidden="true" />
        <div className="smp-hero-copy">
          <span className="smp-badge-soft">Neighbourhood practice since 2019</span>
          <h1>Good care feels<br /><em>like home.</em></h1>
          <p>We come to you — with the same warmth, patience and thoroughness we would give our own pets.</p>
          <div className="smp-actions">
            <a className="smp-btn">Book a home visit</a>
            <a className="smp-btn-2">WhatsApp us</a>
          </div>
        </div>
        <div className="smp-boutique-art">
          <Ph src={CAT_IMG} className="smp-round" priority />
          <span className="smp-float-card"><Heart size={13} /> 2,400+ visits made</span>
        </div>
      </section>

      <section className="smp-band">
        <div className="smp-band-head smp-center"><h2>How we can help</h2><p className="smp-lead">Gentle, unhurried care for dogs, cats and small pets.</p></div>
        <div className="smp-grid-3">
          {SERVICES.slice(0, 3).map((s, i) => (
            <article key={s.name} className="smp-card smp-card-soft">
              <span className="smp-ico smp-ico-round"><ServiceIcon i={i} /></span>
              <h3>{s.name}</h3><p>{s.blurb}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="smp-band smp-band-peach">
        <div className="smp-quote">
          <Stars />
          <p>“They sat on the floor with my nervous cat until she came out from under the bed. That is the whole review.”</p>
          <cite>Hinnana Iqbal · DHA</cite>
        </div>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 09 · SWISS GRID ═══════════════════════════════════════════════════ */
export function SwissGrid() {
  return (
    <div className="smp smp--swiss">
      <header className="smp-nav smp-nav-swiss">
        <span className="smp-brand"><span className="smp-sq" /> JAWAD / VET</span>
        <nav>{["01 Services", "02 Team", "03 Shop", "04 Contact"].map((l) => <a key={l}>{l}</a>)}</nav>
      </header>

      <section className="smp-swiss-hero">
        <div className="smp-swiss-num">01</div>
        <h1>Veterinary care<br />in Lahore.</h1>
        <div className="smp-swiss-meta">
          <div><span>Home visits</span><b>Seven days</b></div>
          <div><span>Emergency</span><b>24 hours</b></div>
          <div><span>Registration</span><b>RVMP</b></div>
        </div>
        <div className="smp-swiss-rule" />
        <div className="smp-swiss-body">
          <p>Preventive medicine, surgery aftercare, dentistry and diagnostics. At our Al Kabir Town hospital, or in your home anywhere in the city.</p>
          <a className="smp-btn smp-btn-square">Book now <ArrowRight size={13} /></a>
        </div>
      </section>

      <section className="smp-swiss-list">
        {SERVICES.slice(0, 5).map((s, i) => (
          <a key={s.name} className="smp-swiss-row">
            <span>0{i + 1}</span><b>{s.name}</b><span className="smp-swiss-dur">{s.duration}</span><ArrowUpRight size={14} />
          </a>
        ))}
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 10 · IMMERSIVE OVERLAY ════════════════════════════════════════════ */
export function ImmersiveOverlay() {
  return (
    <div className="smp smp--immersive">
      <header className="smp-nav smp-nav-abs">
        <span className="smp-brand"><PawPrint size={15} /> Jawad</span>
        <nav>{["Services", "Team", "Pet Mall", "Adopt"].map((l) => <a key={l}>{l}</a>)}</nav>
        <a className="smp-btn smp-btn-glass">Book now</a>
      </header>

      <section className="smp-full">
        <Ph src={HERO_IMG} className="smp-full-bg" priority />
        <div className="smp-full-veil" />
        <div className="smp-full-copy">
          <span className="smp-eyebrow"><i /> Veterinary hospital · Lahore</span>
          <h1>They stay home.<br />We bring the clinic.</h1>
          <div className="smp-actions">
            <a className="smp-btn">Book a visit <ArrowRight size={14} /></a>
            <a className="smp-btn smp-btn-glass">Call 0307-8517122</a>
          </div>
        </div>
        <div className="smp-glass-rail">
          {STATS.map((s) => <div key={s.l}><b>{s.v}</b><span>{s.l}</span></div>)}
        </div>
      </section>

      <section className="smp-band smp-band-immersive">
        <div className="smp-split">
          <div><span className="smp-kicker">The difference</span><h2>No car. No waiting room. No strangers.</h2></div>
          <ul className="smp-list">
            {["The same clinician, start to finish", "Everything brought to you", "Written notes after every visit"].map((t) => <li key={t}><Check size={14} /> {t}</li>)}
          </ul>
        </div>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 11 · SIDEBAR APP ══════════════════════════════════════════════════ */
export function SidebarApp() {
  const items = [
    { icon: PawPrint, label: "Overview" },
    { icon: Calendar, label: "Appointments" },
    { icon: Stethoscope, label: "Services" },
    { icon: ShoppingBag, label: "Pet Mall" },
    { icon: Heart, label: "Adoption" },
    { icon: Phone, label: "Emergency" },
  ];
  return (
    <div className="smp smp--app">
      <aside className="smp-side">
        <span className="smp-brand"><PawPrint size={16} /> Jawad</span>
        <nav>
          {items.map((it, i) => (
            <a key={it.label} className={i === 0 ? "is-active" : undefined}><it.icon size={15} /> {it.label}</a>
          ))}
        </nav>
        <div className="smp-side-card">
          <b>Need a vet now?</b>
          <p>Our line is open all night.</p>
          <a className="smp-btn smp-btn-wide">Call now</a>
        </div>
      </aside>

      <main className="smp-main">
        <header className="smp-app-head">
          <div>
            <span className="smp-kicker">Dashboard</span>
            <h1>Good evening, Ayesha.</h1>
            <p>Coco is due for a booster in 9 days.</p>
          </div>
          <div className="smp-app-actions">
            <span className="smp-avatar">A</span>
            <a className="smp-btn">Book a visit</a>
          </div>
        </header>

        <div className="smp-app-grid">
          <article className="smp-app-card smp-app-card-wide">
            <span className="smp-kicker">Next appointment</span>
            <div className="smp-app-row">
              <div><b>Vaccination · Coco</b><small>Sat 24 Oct, 11:30 · at your home</small></div>
              <a className="smp-link">Reschedule</a>
            </div>
            <div className="smp-progress"><i style={{ width: "72%" }} /></div>
            <small className="smp-fine">Booster course 2 of 3 complete</small>
          </article>
          <article className="smp-app-card">
            <span className="smp-kicker">Quick book</span>
            <div className="smp-chips">{["Checkup", "Vaccine", "Deworming", "Dental"].map((c) => <a key={c}>{c}</a>)}</div>
          </article>
          <article className="smp-app-card">
            <span className="smp-kicker">Records</span>
            <b>3 visits this year</b>
            <small className="smp-fine">Download the full history as a PDF.</small>
          </article>
        </div>

        <section className="smp-app-section">
          <div className="smp-app-section-head">
            <b>Recommended for Coco</b>
            <a className="smp-link">Open Pet Mall</a>
          </div>
          <div className="smp-app-prods">
            {PRODUCTS.slice(0, 3).map((p) => (
              <article key={p.name} className="smp-app-prod">
                <Ph src={p.image} alt={p.name} />
                <div><b>{p.name}</b><small>{p.cat}</small></div>
                <span>{p.price}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="smp-app-section">
          <div className="smp-app-section-head">
            <b>Hospital in Al Kabir Town</b>
            <a className="smp-link">Get directions</a>
          </div>
          <div className="smp-app-row" style={{ padding: "14px 16px", background: "#fff", border: "1px solid #e3e8e6", borderRadius: 12 }}>
            <div>
              <b>Open today until 11:00 pm</b>
              <small>Mon–Fri 10:00–23:00 · Sat–Sun 10:00–23:30</small>
            </div>
            <a className="smp-link">Call 0307-8517122</a>
          </div>
        </section>
      </main>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 12 · DUOTONE POSTER ═══════════════════════════════════════════════ */
export function DuotonePoster() {
  return (
    <div className="smp smp--duotone">
      <header className="smp-nav smp-nav-invert">
        <span className="smp-brand"><PawPrint size={15} /> JAWAD</span>
        <nav>{["Services", "Team", "Shop"].map((l) => <a key={l}>{l}</a>)}</nav>
        <a className="smp-btn smp-btn-flat">Book now</a>
      </header>

      <section className="smp-poster">
        <div className="smp-poster-copy">
          <h1>VET<br />CARE<span>,</span><br /><em>ON CALL.</em></h1>
          <p>Lahore · 24/7 · at your door</p>
          <a className="smp-btn smp-btn-flat">Book a visit <ArrowRight size={15} /></a>
        </div>
        <div className="smp-poster-art">
          <Ph src={DOG_IMG} className="smp-poster-img" priority />
          <span className="smp-poster-tag">Est. 2026</span>
        </div>
      </section>

      <section className="smp-strip">
        {["Home visits", "Emergency 24/7", "Surgery aftercare", "Vaccination", "Dentistry"].map((t) => (
          <span key={t}>{t} <i>✳</i></span>
        ))}
      </section>

      <section className="smp-band">
        <div className="smp-grid-3">
          {SERVICES.slice(0, 3).map((s, i) => (
            <article key={s.name} className="smp-card smp-card-flat">
              <span className="smp-big-n">0{i + 1}</span>
              <h3>{s.name}</h3><p>{s.blurb}</p>
            </article>
          ))}
        </div>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 13 · PET-FIRST ════════════════════════════════════════════════════ */
export function PetFirst() {
  return (
    <div className="smp smp--pets">
      <header className="smp-nav">
        <span className="smp-brand"><PawPrint size={15} /> Jawad</span>
        <nav>{["Adopt", "Services", "Team", "Pet Mall"].map((l) => <a key={l}>{l}</a>)}</nav>
        <a className="smp-btn">Book a visit</a>
      </header>

      <section className="smp-pets-hero">
        <div className="smp-pets-copy">
          <span className="smp-badge-soft"><Heart size={12} /> Adoption programme</span>
          <h1>Someone here is<br />waiting for you.</h1>
          <p>Every cat and dog on our list is examined, vaccinated and dewormed before they meet you — and we cover the first follow-up.</p>
          <div className="smp-actions"><a className="smp-btn">Meet the pets</a><a className="smp-btn-2">Post a pet</a></div>
        </div>
        <div className="smp-pets-cards">
          {ADOPTS.slice(0, 2).map((p) => (
            <article key={p.name} className="smp-pet">
              <Ph src={p.image} alt={p.name} priority />
              <div><b>{p.name}</b><small>{p.meta}</small><span className="smp-pet-tag">Vaccinated</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="smp-band">
        <div className="smp-band-head"><h2>And the everyday care, too</h2><a>All services <ArrowRight size={13} /></a></div>
        <div className="smp-grid-4">
          {SERVICES.slice(0, 4).map((s, i) => (
            <article key={s.name} className="smp-mini"><ServiceIcon i={i} /><b>{s.name}</b><small>{s.duration}</small></article>
          ))}
        </div>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 14 · MALL-FIRST ═══════════════════════════════════════════════════ */
export function MallFirst() {
  return (
    <div className="smp smp--mall">
      <header className="smp-nav">
        <span className="smp-brand"><PawPrint size={15} /> Jawad</span>
        <nav>{["Pet Mall", "Services", "Team", "Adopt"].map((l) => <a key={l}>{l}</a>)}</nav>
        <div className="smp-nav-cta"><a className="smp-ghost"><Search size={14} /></a><a className="smp-btn"><ShoppingBag size={13} /> Cart · 2</a></div>
      </header>

      <section className="smp-mall-hero">
        <div className="smp-mall-top">
          <div>
            <span className="smp-kicker">Pet Mall</span>
            <h1>Everything your pet will love.</h1>
            <p>Food, toys and care essentials — hand-picked by our vets, delivered across Lahore.</p>
          </div>
          <form className="smp-mall-search"><Search size={15} /><input placeholder="Search products and brands" aria-label="Search products" /><button type="button">Go</button></form>
        </div>
        <div className="smp-chips smp-chips-lg">
          {["All", "Dog Food", "Cat Food", "Treats", "Toys", "Grooming", "Health"].map((c, i) => <a key={c} className={i === 0 ? "is-active" : undefined}>{c}</a>)}
        </div>
        <div className="smp-grid-4">
          {PRODUCTS.map((p) => (
            <article key={p.name} className="smp-prod">
              <span className="smp-prod-media">
                <Ph src={p.image} alt={p.name} />
                {p.off > 0 ? <span className="smp-prod-off">−{p.off}%</span> : null}
              </span>
              <span className="smp-prod-cat">{p.cat}</span>
              <b>{p.name}</b>
              <div className="smp-prod-foot">
                <span className="smp-price">{p.price}{p.was ? <s>{p.was}</s> : null}</span>
                <a className="smp-cart"><ShoppingBag size={13} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="smp-band smp-band-cream">
        <div className="smp-split smp-split-tight">
          <div><span className="smp-kicker">Free delivery</span><h2>Over PKR 5,000, we deliver on us.</h2></div>
          <p className="smp-lead">Same-day inside Lahore. Cold-chain items travel in insulated boxes.</p>
        </div>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 15 · COVER STORY ══════════════════════════════════════════════════ */
export function CoverStory() {
  return (
    <div className="smp smp--cover">
      <header className="smp-nav smp-nav-cover">
        <span className="smp-brand">JAWAD</span>
        <nav>{["Services", "Hospital", "Journal", "Contact"].map((l) => <a key={l}>{l}</a>)}</nav>
        <span className="smp-cover-issue">Issue 04</span>
      </header>

      <section className="smp-magcover">
        <div className="smp-magcover-side">
          <span className="smp-kicker">The cover story</span>
          <h1>A quieter<br />kind of<br /><em>veterinary.</em></h1>
          <p>Meet the team that decided the clinic should come to the pet.</p>
          <a className="smp-link">Read the story <ArrowRight size={13} /></a>
        </div>
        <div className="smp-magcover-art">
          <Ph src={VET_IMG} className="smp-cover-photo" priority />
          <span className="smp-cover-line">“The animal sets the pace. We just follow it.”</span>
        </div>
        <ul className="smp-cover-lines">
          <li><b>24/7</b><span>emergency line</span></li>
          <li><b>7 yrs</b><span>in Lahore</span></li>
          <li><b>2.4k</b><span>visits made</span></li>
        </ul>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 16 · GLASS MODERN ═════════════════════════════════════════════════ */
export function GlassModern() {
  return (
    <div className="smp smp--glass">
      <div className="smp-mesh" aria-hidden="true" />
      <header className="smp-nav smp-nav-glass">
        <span className="smp-brand"><PawPrint size={15} /> Jawad</span>
        <nav>{["Services", "Team", "Pet Mall"].map((l) => <a key={l}>{l}</a>)}</nav>
        <a className="smp-btn smp-btn-glass">Book a visit</a>
      </header>

      <section className="smp-glass-hero">
        <div className="smp-glass-copy">
          <span className="smp-glass-pill">● Now accepting new patients</span>
          <h1>Modern veterinary care, wherever you are.</h1>
          <p>Live booking, digital records and a clinician who actually calls you back.</p>
          <div className="smp-actions"><a className="smp-btn">Get started</a><a className="smp-btn smp-btn-glass">See pricing</a></div>
        </div>
        <div className="smp-glass-panel">
          <span className="smp-kicker">Today</span>
          <div className="smp-glass-rows">
            {SERVICES.slice(0, 3).map((s, i) => (
              <div key={s.name} className="smp-glass-row"><span className="smp-ico smp-ico-glass"><ServiceIcon i={i} /></span><div><b>{s.name}</b><small>{s.duration}</small></div><ArrowRight size={14} /></div>
            ))}
          </div>
          <a className="smp-btn smp-btn-wide">Book any service</a>
        </div>
      </section>

      <section className="smp-glass-band">
        {STATS.map((s) => <div key={s.l} className="smp-glass-stat"><b>{s.v}</b><span>{s.l}</span></div>)}
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 17 · HERITAGE CREST ═══════════════════════════════════════════════ */
export function HeritageCrest() {
  return (
    <div className="smp smp--heritage">
      <header className="smp-heritage-head">
        <nav>{["Services", "Hospital", "Team"].map((l) => <a key={l}>{l}</a>)}</nav>
        <div className="smp-crest">
          <span className="smp-crest-mark">J</span>
          <b>Jawad Veterinary Hospital</b>
          <small>Al Kabir Town · Lahore · Est. 2026</small>
        </div>
        <nav>{["Pet Mall", "Adopt", "Contact"].map((l) => <a key={l}>{l}</a>)}</nav>
      </header>

      <section className="smp-heritage-hero">
        <div className="smp-heritage-frame">
          <span className="smp-kicker">Under the care of</span>
          <h1>A practice built on<br /><em>house calls.</em></h1>
          <div className="smp-orn" aria-hidden="true">✦</div>
          <p>Two generations of veterinarians, one conviction: an animal is calmer at home, and a calmer animal is easier to treat.</p>
          <div className="smp-actions smp-actions-center">
            <a className="smp-btn">Request a visit</a>
            <a className="smp-btn-2">Read our charter</a>
          </div>
        </div>
      </section>

      <section className="smp-band smp-band-heritage">
        <div className="smp-grid-3">
          {SERVICES.slice(0, 3).map((s, i) => (
            <article key={s.name} className="smp-heritage-card">
              <span className="smp-heritage-ico"><ServiceIcon i={i} /></span>
              <h3>{s.name}</h3>
              <p>{s.blurb}</p>
              <span className="smp-heritage-rule" />
              <a className="smp-link">Enquire <ArrowRight size={12} /></a>
            </article>
          ))}
        </div>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 18 · NEO BRUTAL ═══════════════════════════════════════════════════ */
export function NeoBrutal() {
  return (
    <div className="smp smp--brutal">
      <header className="smp-brutal-nav">
        <span className="smp-brand"><PawPrint size={16} /> JAWAD VET</span>
        <nav>{["Services", "Team", "Shop", "Adopt"].map((l) => <a key={l}>{l}</a>)}</nav>
        <a className="smp-brutal-btn">BOOK NOW</a>
      </header>

      <section className="smp-brutal-hero">
        <div className="smp-brutal-copy">
          <span className="smp-brutal-tag">LAHORE · 24/7</span>
          <h1>YOUR PET.<br />OUR PROBLEM.<br /><span>SOLVED.</span></h1>
          <p>Real vets. Real house calls. No waiting room, no drama.</p>
          <div className="smp-actions"><a className="smp-brutal-btn">BOOK A VISIT</a><a className="smp-brutal-btn smp-brutal-btn-2">WHATSAPP</a></div>
        </div>
        <div className="smp-brutal-art">
          <Ph src={DOG_IMG} className="smp-brutal-img" priority />
          <span className="smp-brutal-sticker">4.9 ★</span>
        </div>
      </section>

      <section className="smp-brutal-grid">
        {SERVICES.slice(0, 4).map((s, i) => (
          <article key={s.name} className={`smp-brutal-card smp-brutal-c${i}`}>
            <span className="smp-brutal-n">0{i + 1}</span>
            <b>{s.name}</b><p>{s.blurb}</p>
          </article>
        ))}
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 19 · SOFT GRADIENT ════════════════════════════════════════════════ */
export function SoftGradient() {
  return (
    <div className="smp smp--soft">
      <div className="smp-soft-mesh" aria-hidden="true" />
      <header className="smp-nav">
        <span className="smp-brand"><PawPrint size={15} /> Jawad</span>
        <nav>{["Services", "Team", "Pet Mall", "Adopt"].map((l) => <a key={l}>{l}</a>)}</nav>
        <a className="smp-btn smp-btn-pill">Book a visit</a>
      </header>

      <section className="smp-soft-hero">
        <div className="smp-soft-copy">
          <span className="smp-badge-soft">Trusted by 2,400 pet parents</span>
          <h1>Care that fits<br />around your life.</h1>
          <p>Book in a minute, get a real clinician, and keep every record in one calm place.</p>
          <div className="smp-actions"><a className="smp-btn smp-btn-pill">Book a visit</a><a className="smp-btn-2 smp-btn-pill-2">Talk to us</a></div>
          <div className="smp-soft-proof"><Stars /> <span>4.9 from 380 reviews</span></div>
        </div>
        <div className="smp-soft-art">
          <Ph src={CAT_IMG} className="smp-soft-img" priority />
          <div className="smp-soft-float"><Check size={13} /><div><b>Vaccinated</b><small>Next due 12 Nov</small></div></div>
        </div>
      </section>

      <section className="smp-soft-cards">
        {SERVICES.slice(0, 3).map((s, i) => (
          <article key={s.name} className="smp-soft-card">
            <span className="smp-ico smp-ico-round"><ServiceIcon i={i} /></span>
            <h3>{s.name}</h3><p>{s.blurb}</p>
            <a className="smp-link">Learn more <ArrowRight size={12} /></a>
          </article>
        ))}
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

/* ══ 20 · SPLIT STATS ══════════════════════════════════════════════════ */
export function SplitStats() {
  return (
    <div className="smp smp--split">
      <header className="smp-nav">
        <span className="smp-brand"><PawPrint size={15} /> Jawad</span>
        <nav>{["Services", "Team", "Pet Mall", "Contact"].map((l) => <a key={l}>{l}</a>)}</nav>
        <a className="smp-btn">Book now</a>
      </header>

      <section className="smp-split-hero">
        <div className="smp-split-copy">
          <span className="smp-eyebrow"><i /> Independent practice · Lahore</span>
          <h1>Vet care without<br /><em>the guesswork.</em></h1>
          <p>Fixed fees, written plans, and the same clinician every visit. Eleven numbers we are happy to publish.</p>
          <div className="smp-actions"><a className="smp-btn">Book a visit</a><a className="smp-btn-2"><MapPin size={13} /> Al Kabir Town</a></div>
        </div>
        <div className="smp-figures">
          <div className="smp-figures-head"><span>By the numbers</span><span className="smp-live">● Live</span></div>
          {STATS.map((s) => (
            <div key={s.l} className="smp-figure"><b>{s.v}</b><span>{s.l}</span></div>
          ))}
          <div className="smp-figure smp-figure-soft"><b>PKR 2,500</b><span>Home visit, all-in</span></div>
        </div>
      </section>

      <section className="smp-band">
        <div className="smp-band-head"><h2>Reviews</h2><a>All reviews <ArrowRight size={13} /></a></div>
        <div className="smp-grid-3">
          {REVIEWS.map((r) => (
            <article key={r.name} className="smp-review">
              <Stars /><p>{r.text}</p><div><b>{r.name}</b><small>{r.tag}</small></div>
            </article>
          ))}
        </div>
      </section>
      <Tail />
      <Foot />
    </div>
  );
}

export const VARIANT_MAP = {
  "aurora-split": AuroraSplit,
  "grand-editorial": GrandEditorial,
  "midnight-luxe": MidnightLuxe,
  "clinical-calm": ClinicalCalm,
  "bento-clinic": BentoClinic,
  "booking-first": BookingFirst,
  "magazine-spread": MagazineSpread,
  "warm-boutique": WarmBoutique,
  "swiss-grid": SwissGrid,
  "immersive-overlay": ImmersiveOverlay,
  "sidebar-app": SidebarApp,
  "duotone-poster": DuotonePoster,
  "pet-first": PetFirst,
  "mall-first": MallFirst,
  "cover-story": CoverStory,
  "glass-modern": GlassModern,
  "heritage-crest": HeritageCrest,
  "neo-brutal": NeoBrutal,
  "soft-gradient": SoftGradient,
  "split-stats": SplitStats,
  "pawwell-green": PawWellGreen,
  "pawwell-ivory": PawWellIvory,
  "pawwell-slate": PawWellSlate,
  "pawwell-sage": PawWellSage,
} as const;

export type VariantSlug = keyof typeof VARIANT_MAP;
