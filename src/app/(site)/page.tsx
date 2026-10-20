import Image from "next/image";
import Link from "next/link";
import {
  Activity, ArrowRight, BadgeCheck, Calendar, Check, Clock, FileText, HeartHandshake, Home, MapPin, Phone,
  ShieldCheck, Star, Stethoscope, Syringe, Truck, Users,
} from "lucide-react";
import {
  AdoptionCard, EventCard, PostCard, ProductCard, ReviewCard, ServiceCard, TrustStrip,
} from "@/components/cards";
import { Breadcrumbs, CheckList, Eyebrow, EmergencyStrip, SectionHead, WhatsAppButton } from "@/components/ui";
import { business, events, faqs, fees, timeSlots } from "@/lib/site";
import { money, shiftISO, todayISO } from "@/lib/format";
import { catalogProducts, catalogPosts, catalogServices, catalogTestimonials } from "@/server/catalog";
import { getSettings, rows } from "@/server/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [services, products, posts, reviews, settings, adoption] = await Promise.all([
    catalogServices(), catalogProducts(), catalogPosts(), catalogTestimonials(), getSettings(), rows("adoption"),
  ]);
  // Server component on a dynamic route: these run once per request, never during a client render.
  const today = todayISO();
  const tomorrowISO = shiftISO(1);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const heroProducts = (featuredProducts.length >= 4 ? featuredProducts : products).slice(0, 4);
  const availablePets = adoption.filter((pet) => pet.status === "available").slice(0, 3);

  return (
    <>
      {/* ── hero ──────────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="row" style={{ gap: 10 }}>
              <span className="pill pill-brass"><BadgeCheck size={13} /> RVMP-registered vets</span>
              <span className="pill pill-soft">Home visits across Lahore · 24/7</span>
            </div>
            <h1 style={{ margin: "20px 0 18px" }}>
              Unhurried veterinary care — <em>at the hospital, or at your door.</em>
            </h1>
            <p className="lead" style={{ maxWidth: "56ch" }}>
              Jawad Veterinary Hospital brings clinic-grade medicine to Al Kabir Town and to living rooms across Lahore:
              consultations, vaccination, dentistry, lab work and surgery aftercare — with every record kept in your own
              online portal, and a pet mall stocked by the same vets who treat your pet.
            </p>
            <div className="hero-actions">
              <Link href="/book-vet-appointment-lahore" className="button button-primary button-lg">
                Book an appointment <ArrowRight size={17} />
              </Link>
              <Link href="/portal" className="button button-ghost button-lg">
                <Users size={17} /> Open my portal
              </Link>
            </div>
            <div className="hero-trust">
              {[
                { icon: <ShieldCheck size={15} />, label: "Cold-chain vaccines, batch logged" },
                { icon: <Home size={15} />, label: "Fully equipped mobile kit" },
                { icon: <FileText size={15} />, label: "Printable booking slip" },
                { icon: <Clock size={15} />, label: "Confirmed in ~20 min" },
              ].map((item) => (
                <span key={item.label} className="trust-item">{item.icon} {item.label}</span>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-badge"><span>For every<br />paw<br />in Lahore</span></div>
            <div className="hero-photo">
              <Image src="/images/hero-care.jpg" alt="Veterinarian examining a dog while a cat rests nearby in a calm consulting room" fill priority sizes="(max-width:980px) 100vw,48vw" className="object-cover" unoptimized />
            </div>
            <div className="hero-float hero-float-1">
              <span className="hero-float-icon"><HeartHandshake size={19} /></span>
              <span><b>4.9 average</b><small>from 180+ Lahore pet parents</small></span>
            </div>
            <div className="hero-float hero-float-2">
              <span className="hero-float-icon" style={{ background: "var(--brass)", color: "#23180a" }}><Syringe size={18} /></span>
              <span><b>Next slot today</b><small>Evening · 6:00–10:00 pm</small></span>
            </div>
            <div className="hero-slip">
              <div className="slip" style={{ maxWidth: "none", transform: "rotate(-2.2deg)", boxShadow: "0 30px 60px -20px rgba(7,26,32,.4)" }}>
                <header className="slip-head" style={{ padding: "16px 18px 14px" }}>
                  <span className="slip-label">Booking reference</span>
                  <h2 className="slip-ref" style={{ fontSize: 26 }}>JVH-{new Date().getFullYear()}-752699</h2>
                  <span className="slip-sub">Morning (10:00 AM – 02:00 PM) · Deworming</span>
                </header>
                <div className="slip-total" style={{ padding: "12px 18px 14px" }}>
                  <span>Total due</span><b>{money(4500)}</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* quick book */}
        <div className="container quick-book">
          <form className="quick-book-form" action="/book-vet-appointment-lahore" method="get">
            <label>
              What does your pet need?
              <select name="service" className="select" defaultValue={services[0]?.slug ?? ""}>
                {services.map((service) => <option key={service.slug} value={service.slug}>{service.title} · from {money(service.price)}</option>)}
              </select>
            </label>
            <label>
              Species
              <select name="species" className="select" defaultValue="Dog">
                {["Dog", "Cat", "Rabbit", "Bird", "Reptile", "Other"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>
              Preferred day
              <input type="date" name="date" className="input" defaultValue={tomorrowISO} min={today} />
            </label>
            <label>
              Time window
              <select name="slot" className="select" defaultValue={timeSlots[2].id}>
                {timeSlots.map((slot) => <option key={slot.id} value={slot.id}>{slot.label}</option>)}
              </select>
            </label>
            <button className="button button-primary button-lg" type="submit">Check availability <ArrowRight size={16} /></button>
          </form>
        </div>
      </section>

      {/* ── trust marquee ──────────────────────────────────── */}
      <section className="band-dark" style={{ overflow: "hidden" }}>
        <div className="marquee">
          <div className="marquee-track">
            {[
              "24/7 emergency dispatch", "RVMP registered", "Cold-chain vaccines", "Home visits all over Lahore",
              "In-house lab courier", "Digital Pet Passport", "Pharmacy stocked daily", "Feline-friendly handling",
              "Printable booking slip", "No surprise bills",
            ].concat([
              "24/7 emergency dispatch", "RVMP registered", "Cold-chain vaccines", "Home visits all over Lahore",
              "In-house lab courier", "Digital Pet Passport", "Pharmacy stocked daily", "Feline-friendly handling",
              "Printable booking slip", "No surprise bills",
            ]).map((label, i) => <span key={`${label}-${i}`}>{label}</span>)}
          </div>
        </div>
      </section>

      {/* ── services ──────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Veterinary services"
            title={<>Everything your pet needs, <em>in one calm visit.</em></>}
            lead="Book a home visit or attend the hospital. Fees are the professional fee only — travel, medicines and lab work are always itemised before anything starts."
            action={<Link href="/services" className="button button-ghost">All services &amp; fees <ArrowRight size={16} /></Link>}
          />
          <div className="service-grid" style={{ marginTop: 34 }}>
            {services.slice(0, 6).map((service) => <ServiceCard key={service.slug} service={service} />)}
          </div>
          <div className="row" style={{ gap: 10, marginTop: 24, justifyContent: "center" }}>
            <Link href="/book-vet-appointment-lahore" className="button button-primary">Book this visit <ArrowRight size={16} /></Link>
            <WhatsAppButton message="Assalam-o-Alaikum, I would like to ask which service my pet needs." label="Ask a veterinarian first" className="button button-ghost" />
          </div>
        </div>
      </section>

      {/* ── how it works ───────────────────────────────────── */}
      <section className="section band-dark">
        <div className="container">
          <SectionHead
            tone="light" align="center"
            eyebrow="How it works"
            title={<>Four steps, <em>no queues.</em></>}
            lead="Online booking that behaves like a good front desk: it asks the right questions, shows the fee, and leaves a printable reference you can share at the door."
          />
          <div className="steps" style={{ marginTop: 40, gridTemplateColumns: "repeat(4,1fr)" }}>
            {[
              { n: "01", t: "Tell us about your pet", d: "Species, age, symptoms and the service you need. Two minutes, and a draft is saved if you get interrupted." },
              { n: "02", t: "Pick a window", d: "Morning to night slots, home visit or hospital. Emergencies are flagged for priority dispatch." },
              { n: "03", t: "Get the slip & WhatsApp", d: "A barcode reference appears instantly. Print it, save it as a PDF, or send it to the clinic." },
              { n: "04", t: "Care, then records", d: "The visit, prescription and next due date land in your Digital Pet Passport for good." },
            ].map((step, i) => (
              <div key={step.n} className="step">
                <span className="step-n">{step.n}</span>
                <h3>{step.t}</h3>
                <p>{step.d}</p>
                {i < 3 ? <span className="step-line" /> : null}
              </div>
            ))}
          </div>
          <div className="row" style={{ justifyContent: "center", marginTop: 34, gap: 12 }}>
            <Link href="/book-vet-appointment-lahore" className="button button-brass button-lg">Start a booking <ArrowRight size={16} /></Link>
            <Link href="/portal" className="button button-outline-light button-lg">See the client portal</Link>
          </div>
        </div>
      </section>

      {/* ── two pillars ────────────────────────────────────── */}
      <section className="section">
        <div className="container grid cols-2" style={{ gap: 22 }}>
          <article className="card" style={{ overflow: "hidden", display: "grid" }}>
            <div className="figure" style={{ aspectRatio: "16/10", borderRadius: 0 }}>
              <Image src="/images/consultation.jpg" alt="Veterinarian consulting with a small dog on the examination table" fill sizes="(max-width:900px) 100vw,50vw" className="object-cover" unoptimized />
              <span className="figure-ribbon">01 · Hospital &amp; mobile clinic</span>
            </div>
            <div className="card-pad">
              <h3>Clinic-grade medicine, <em style={{ color: "var(--brass)" }}>without the cage smell.</em></h3>
              <p className="muted small">Examination theatre, minor procedure room, an in-house pharmacy and a cold chain we log twice a day. When a case needs imaging or a specialist, we say so and coordinate the referral.</p>
              <CheckList items={["Consultations from " + money(fees.visitClinic), "Home visits from " + money(fees.visitHomeStandard) + " travel + service fee", "Emergency dispatch across Lahore, 24/7"]} />
              <Link href="/services" className="link-arrow" style={{ marginTop: 16 }}>Explore veterinary services <ArrowRight size={14} /></Link>
            </div>
          </article>
          <article className="card" style={{ overflow: "hidden", display: "grid" }}>
            <div className="figure" style={{ aspectRatio: "16/10", borderRadius: 0 }}>
              <Image src="/images/pet-shop.jpg" alt="Boutique pet store shelves with food, toys and care essentials" fill sizes="(max-width:900px) 100vw,50vw" className="object-cover" unoptimized />
              <span className="figure-ribbon">02 · Pet mall &amp; pharmacy</span>
            </div>
            <div className="card-pad">
              <h3>Pet food and essentials, <em style={{ color: "var(--brass)" }}>chosen by vets.</em></h3>
              <p className="muted small">We stock what we recommend: life-stage nutrition, therapeutic diets, skin-care ranges, enrichment and carriers. Batch and expiry on every bag, and honest advice when you do not need to buy something.</p>
              <CheckList items={["Same-day delivery inside Lahore", "Free delivery above " + money(fees.freeDeliveryOver), "Prescription items dispensed by the clinic"]} />
              <Link href="/shop" className="link-arrow" style={{ marginTop: 16 }}>Browse the pet mall <ArrowRight size={14} /></Link>
            </div>
          </article>
        </div>
      </section>

      {/* ── stats ─────────────────────────────────────────── */}
      <section className="section-tight">
        <div className="container">
          <TrustStrip items={[
            { label: "Pets under our care", value: "4,180" },
            { label: "Home visits completed", value: "2,640" },
            { label: "Avg. booking reply", value: "19 min" },
            { label: "Years in Al Kabir Town", value: "7" },
          ]} />
        </div>
      </section>

      {/* ── pet mall ──────────────────────────────────────── */}
      <section className="section band">
        <div className="container">
          <div className="split">
            <div>
              <SectionHead
                eyebrow="The pet mall"
                title={<>Trending in store <em>this month.</em></>}
                lead="Order online for same-day delivery in Lahore, or add it to your visit so the veterinarian can approve it first."
              />
              <div className="product-grid" style={{ marginTop: 28, gridTemplateColumns: "repeat(2,1fr)" }}>
                {heroProducts.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
              <div className="row" style={{ gap: 10, marginTop: 22 }}>
                <Link href="/shop" className="button button-primary">Open the pet mall <ArrowRight size={16} /></Link>
                <Link href="/cart" className="button button-ghost"><Truck size={16} /> My basket</Link>
              </div>
            </div>
            <div className="figure figure-tall figure-frame" style={{ position: "sticky", top: 100 }}>
              <Image src="/images/pharmacy.jpg" alt="Veterinary pharmacy shelves with medicines and pet food" fill sizes="(max-width:900px) 100vw,40vw" className="object-cover" unoptimized />
              <span className="figure-tag" style={{ bottom: 26, left: 26 }}>Stocked by the<br />same team that prescribes.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── portal promo ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="split">
            <div className="card card-pad" style={{ background: "linear-gradient(150deg,#fffdfa,#f6f2e8)", position: "relative", overflow: "hidden" }}>
              <div className="row-between">
                <span className="pill"><Activity size={13} /> Digital Pet Passport</span>
                <span className="tiny muted">Portal preview</span>
              </div>
              <h3 style={{ marginTop: 16, fontSize: 24 }}>Every record, in one place — <em>yours.</em></h3>
              <div className="list-plain" style={{ marginTop: 12 }}>
                {[
                  { t: "Scottie · Golden Retriever", s: "Rabies booster due in 45 days", badge: "On track" },
                  { t: "Mochi · Persian cat", s: "FVRCP overdue — book a slot", badge: "Action", warn: true },
                  { t: "Home visit · Deworming", s: "Confirmed, Dr. Jawad · 21 Oct, morning", badge: "Confirmed" },
                  { t: "Pet Mall order", s: "Out for delivery · Rs. 4,650", badge: "On the way" },
                ].map((line) => (
                  <div key={line.t}>
                    <span className={`pill ${line.warn ? "pill-warn" : "pill-ok"}`} style={{ minWidth: 84, justifyContent: "center" }}>{line.badge}</span>
                    <span className="col" style={{ gap: 1, flex: 1 }}>
                      <b style={{ fontSize: 13.5 }}>{line.t}</b>
                      <small className="muted" style={{ fontWeight: 500 }}>{line.s}</small>
                    </span>
                  </div>
                ))}
              </div>
              <div className="row" style={{ gap: 10, marginTop: 18 }}>
                <Link href="/login" className="button button-dark button-sm">Sign in to my portal</Link>
                <Link href="/register" className="button button-ghost button-sm">Create an account</Link>
              </div>
            </div>
            <div>
              <SectionHead
                eyebrow="Client portal &amp; admin console"
                title={<>A portal your pets would approve of, <em>if they could read.</em></>}
                lead="Booking slips, prescriptions, vaccine cards, order tracking and reschedule requests in one login. Behind it, the clinic runs the same system: appointment board, stock, pricing, staff rota and content — no spreadsheets, no phone tag."
              />
              <div className="grid cols-2" style={{ marginTop: 22, gap: 12 }}>
                {[
                  { icon: <FileText size={17} />, t: "Printable slip", d: "Barcode reference for every booking and order." },
                  { icon: <Calendar size={17} />, t: "Reschedule &amp; cancel", d: "Request a new window from the portal, any hour." },
                  { icon: <ShieldCheck size={17} />, t: "Verified records", d: "Batch numbers and vet sign-off on every vaccine." },
                  { icon: <Stethoscope size={17} />, t: "Message the clinic", d: "A veterinarian replies inside one working day." },
                ].map((item) => (
                  <div key={item.t} className="card card-pad" style={{ display: "grid", gap: 8 }}>
                    <span className="service-icon" style={{ width: 36, height: 36, marginBottom: 2 }}>{item.icon}</span>
                    <b style={{ fontSize: 14.5 }}>{item.t}</b>
                    <span className="small muted">{item.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── why trust us ──────────────────────────────────── */}
      <section className="section band-sage">
        <div className="container">
          <SectionHead eyebrow="Why pet parents stay" title={<>The difference is in <em>the details.</em></>} align="center" />
          <div className="feature-grid" style={{ marginTop: 34 }}>
            {[
              { icon: <ShieldCheck size={19} />, t: "Weight-accurate dosing", d: "Every dewormer, antibiotic and anaesthetic is dosed on a recorded weight — not a guess from breed." },
              { icon: <Activity size={19} />, t: "Records that outlive memory", d: "Vaccine batch, expiry, next due date and the veterinarian's notes, filed against your pet, exportable any time." },
              { icon: <Clock size={19} />, t: "Time actually spent", d: "Consultations are scheduled, not queued. Fifteen unhurried minutes beats an hour in a waiting room." },
              { icon: <MapPin size={19} />, t: "South Lahore, properly", d: "Al Kabir Town to Bahria, Johar, DHA and Gulberg — routes planned so the vet arrives inside your window." },
              { icon: <HeartHandshake size={19} />, t: "Feline-friendly handling", d: "Separate cat room, towel-free restraint where possible, and pheromone-wiped surfaces." },
              { icon: <BadgeCheck size={19} />, t: "Honest referrals", d: "When a case needs imaging or a specialist, we tell you and arrange it — we do not improvise." },
            ].map((f) => (
              <article key={f.t} className="feature">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── reviews ───────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Lahore reviews"
            title={<>What pet parents say <em>afterwards.</em></>}
            action={
              <span className="card row" style={{ padding: "10px 16px", gap: 12 }}>
                <span className="row" style={{ gap: 3 }}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={15} fill="var(--brass-2)" stroke="none" />)}</span>
                <b style={{ fontSize: 14 }}>4.9</b>
                <span className="tiny muted">Google · 184 reviews</span>
              </span>
            }
          />
          <div className="quote-grid" style={{ marginTop: 30 }}>
            {reviews.slice(0, 3).map((review) => <ReviewCard key={review.name} review={review} />)}
          </div>
          <div className="row" style={{ justifyContent: "center", marginTop: 24 }}>
            <Link href="/about#reviews" className="button button-ghost">Read more stories <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ── adopt + events ─────────────────────────────────── */}
      <section className="section band">
        <div className="container grid" style={{ gap: 44 }}>
          <div>
            <SectionHead
              eyebrow="Adoption desk"
              title={<>Waiting for a home, <em>vet-checked first.</em></>}
              lead="Every animal is examined, dewormed and vaccinated by our team before listing, with a year of follow-up care included."
              action={<Link href="/adopt" className="button button-ghost">Meet them all <ArrowRight size={16} /></Link>}
            />
            {availablePets.length ? (
              <div className="grid cols-3" style={{ marginTop: 26 }}>
                {availablePets.map((pet) => <AdoptionCard key={pet.id} pet={pet} />)}
              </div>
            ) : null}
          </div>
          <div className="grid cols-2">
            <div>
              <Eyebrow>Events &amp; clinics</Eyebrow>
              <h3 style={{ margin: "12px 0 18px", fontSize: 26 }}>{events[0].title}</h3>
              <div className="grid" style={{ gap: 12 }}>
                {events.slice(0, 2).map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
              </div>
              <Link href="/pet-care-tips" className="link-arrow" style={{ marginTop: 16 }}>All events &amp; tips <ArrowRight size={14} /></Link>
            </div>
            <div>
              <Eyebrow>Vet-written guides</Eyebrow>
              <div style={{ marginTop: 12 }}>{posts[1] ? <PostCard post={posts[1]} /> : null}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── faq ───────────────────────────────────────────── */}
      <section className="section">
        <div className="container grid cols-2" style={{ gap: 40, alignItems: "start" }}>
          <div>
            <SectionHead eyebrow="Before you book" title={<>Questions we get <em>every week.</em></>} lead="If something is not covered here, a veterinarian will answer it on WhatsApp — no charge for advice." />
            <div className="card card-pad" style={{ marginTop: 22, display: "grid", gap: 12 }}>
              <span className="row" style={{ gap: 10 }}><Phone size={17} style={{ color: "var(--brand)" }} /><b>{business.phone}</b></span>
              <span className="row" style={{ gap: 10 }}><MapPin size={17} style={{ color: "var(--brand)" }} /><span className="small">{business.address}</span></span>
              <span className="row" style={{ gap: 10 }}><Check size={17} style={{ color: "var(--ok)" }} /><span className="small">{business.hours[0].day}: {business.hours[0].hours}</span></span>
              <WhatsAppButton message="Assalam-o-Alaikum, I have a question about my pet." label="Ask on WhatsApp" className="button button-brass button-sm" />
            </div>
          </div>
          <div className="faq">
            {faqs.slice(0, 6).map((faq, i) => (
              <details key={faq.q} open={i === 0}>
                <summary>{faq.q}</summary>
                <div className="faq-body"><p>{faq.a}</p></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── emergency + cta ───────────────────────────────── */}
      <section className="section-tight">
        <div className="container grid" style={{ gap: 18 }}>
          <EmergencyStrip settings={settings} />
          <div className="cta-band">
            <div className="cta-inner">
              <div>
                <Eyebrow tone="light">Ready when you are</Eyebrow>
                <h2 style={{ margin: "14px 0 10px", fontSize: "clamp(26px,3.4vw,42px)" }}>Book a veterinarian for today.</h2>
                <p>Choose a window, see the fee, get a printable slip. A veterinarian confirms every request — and if it can wait until morning, we will tell you that too.</p>
              </div>
              <div className="cta-actions" style={{ flexDirection: "column", alignItems: "stretch" }}>
                <Link href="/book-vet-appointment-lahore" className="button button-brass button-lg">Book an appointment <ArrowRight size={17} /></Link>
                <Link href="/contact-vet-lahore" className="button button-outline-light button-lg">Talk to the front desk</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
