import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BadgeCheck, CalendarCheck, Check, Clock, HeartPulse, Mail, MapPin, PawPrint,
  Phone, ShieldCheck, Smartphone, Star, Stethoscope, Truck, UserRound, Activity,
} from "lucide-react";
import { ServiceGlyph, WhatsAppIcon } from "@/components/icons";
import { business, galleryItems, team } from "@/lib/site";
import { money } from "@/lib/format";
import { catalogCategories, catalogPosts, catalogProducts, catalogServices, catalogTestimonials } from "@/server/catalog";
import { getSettings, rows } from "@/server/store";

export const dynamic = "force-dynamic";

const REVIEW_COLORS = ["#4285f4", "#ea4335", "#fbbc04", "#34a853", "#7b61ff"];

export default async function HomePage() {
  const [services, products, posts, reviews, settings, adoption, categories] = await Promise.all([
    catalogServices(), catalogProducts(), catalogPosts(), catalogTestimonials(), getSettings(), rows("adoption"), catalogCategories(),
  ]);
  const vet = team[0];
  const featured = (products.filter((p) => p.featured).length ? products.filter((p) => p.featured) : products).slice(0, 4);
  const availablePets = [
    ...adoption.filter((pet) => pet.status === "available"),
    ...adoption.filter((pet) => pet.status === "reserved"),
  ].slice(0, 4);
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "Pet care";
  const heroServices = services.slice(0, 8);
  const latestPosts = posts.slice(0, 4);

  return (
    <>
      {/* ── hero ─────────────────────────────────────────────────────── */}
      <section className="v-hero">
        <div className="v-wrap v-hero-grid">
          <div>
            <div className="v-hero-badges">
              <span className="v-eyebrow"><BadgeCheck size={13} /> Al Kabir Town&apos;s trusted vet hospital</span>
              <span className="v-eyebrow v-eyebrow-brass"><ShieldCheck size={13} /> RVMP registered veterinarians</span>
            </div>
            <h1>
              Professional Vet Care,
              <span>At Your Doorstep</span>
            </h1>
            <p>
              Skip the stressful clinic travel. {business.shortName}&apos;s veterinarians bring Lahore&apos;s trusted
              veterinary expertise to your home — and when your pet needs more, our fully equipped hospital in Al Kabir
              Town is ready for them.
            </p>
            <div className="v-hero-actions">
              <Link href="/book-vet-appointment-lahore" className="button button-primary button-lg">
                <CalendarCheck size={17} /> Book Home Visit
              </Link>
              <Link href="/register" className="button button-ghost button-lg">
                <PawPrint size={16} /> Sign Up Free
              </Link>
              <Link href="/login" className="v-hero-login"><UserRound size={15} /> Log In</Link>
            </div>
            <div className="v-trust">
              {["24/7 available", "RVMP certified", "Fully equipped", "All pets welcome", "Top rated"].map((item) => (
                <span key={item}><Check size={13} /> {item}</span>
              ))}
            </div>
            <div className="v-passport">
              <span className="v-passport-icon"><Smartphone size={17} /></span>
              <p>Already a patient? Access your <b>Digital Pet Passport</b> — records, vaccines, orders and slips in one place.</p>
              <Link href="/portal">Access</Link>
            </div>
          </div>

          <div className="v-hero-visual">
            <div className="v-hero-photo">
              <Image src={vet.image} alt={`${vet.name}, ${vet.role} at ${business.name}`} fill priority sizes="(max-width:980px) 92vw, 44vw" className="object-cover" unoptimized />
            </div>
            <span className="v-hero-chip v-hero-chip-1"><HeartPulse size={14} /> Emergency response in 30 min</span>
            <span className="v-hero-chip v-hero-chip-2"><ShieldCheck size={14} /> DVM · RVMP certified</span>
            <span className="v-hero-badge-years"><span><b>{vet.years}+</b><small>Years exp</small></span></span>
            <div className="v-hero-vet">
              <span className="v-hero-vet-icon"><Stethoscope size={18} /></span>
              <span>
                <b>{vet.name}</b>
                <small>{vet.credentials} · {vet.role}</small>
              </span>
              <a className="vs-book" href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={14} /> Consult
              </a>
            </div>
          </div>
        </div>

        <div className="v-stats">
          <div className="v-wrap v-stats-grid">
            {[
              { value: "24/7", label: "Emergency response" },
              { value: "100%", label: "Lahore coverage" },
              { value: "RVMP", label: "Certified experts" },
              { value: "Unit", label: "Fully equipped team" },
            ].map((stat) => (
              <div key={stat.label} className="v-stat"><b>{stat.value}</b><span>{stat.label}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* ── app / passport band ──────────────────────────────────────── */}
      <div className="v-wrap v-appband">
        <div className="v-appcard">
          <span className="v-appcard-icon"><PawPrint size={24} /></span>
          <div>
            <b>{business.shortName} Care</b>
            <small>Book a vet, track a visit and open your pet&apos;s passport in seconds.</small>
          </div>
          <span className="v-appcard-stars" aria-label="Rated five stars">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={13} fill="currentColor" strokeWidth={0} />)}
            <span className="v-appcard-badge">FREE</span>
          </span>
          <Link href="/portal" className="vs-book">Get</Link>
        </div>
      </div>

      {/* ── services ─────────────────────────────────────────────────── */}
      <section className="v-section">
        <div className="v-wrap">
          <div className="v-head">
            <span className="v-eyebrow">Our veterinary services</span>
            <h2>Our Veterinary Services</h2>
            <p>
              Clinic-grade home vet care for all your pets, delivered with compassion and professional expertise —
              or at our Al Kabir Town hospital when a case needs the full theatre.
            </p>
          </div>
          <div className="v-grid v-cols-4">
            {heroServices.map((service) => (
              <article key={service.slug} className="v-card v-card-hover v-service">
                <span className="v-icon-tile"><ServiceGlyph icon={service.icon} size={21} /></span>
                <h3>{service.shortTitle}</h3>
                <p>{service.summary}</p>
                <div className="v-service-meta">
                  <span className="v-price"><small>From</small><b>{money(service.price)}</b></span>
                  <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="v-service-link">
                    Book Service <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
            <Link href="/services" className="button button-ghost">All services &amp; fees <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* ── pet mall ─────────────────────────────────────────────────── */}
      <section className="v-section v-section-soft">
        <div className="v-wrap">
          <div className="v-head-row">
            <div className="v-head v-head-left">
              <span className="v-eyebrow v-eyebrow-brass">Shop essentials</span>
              <h2>Pet Mall</h2>
              <p>Explore our curated selection of premium pet food, toys, and care essentials for your furry friends — shortlisted by the same vets who treat them.</p>
            </div>
            <Link href="/shop" className="button button-ghost">Shop All Products <ArrowRight size={15} /></Link>
          </div>
          <div className="v-grid v-cols-4">
            {featured.map((product) => {
              const off = product.compareAt && product.compareAt > product.price ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100) : 0;
              return (
                <article key={product.id} className="v-card v-card-hover v-product">
                  <Link href={`/shop/${product.slug}`} className="v-product-media" aria-label={product.name}>
                    {off > 0 ? <span className="v-product-off">−{off}%</span> : null}
                    <Image src={product.image} alt={product.name} fill sizes="(max-width:900px) 45vw, 22vw" className="object-cover" unoptimized />
                  </Link>
                  <div className="v-product-body">
                    <span className="v-product-cat">{categoryName(product.categorySlug)}</span>
                    <Link href={`/shop/${product.slug}`} className="v-product-name">{product.name}</Link>
                    <span className="v-product-stars"><Star size={11} fill="currentColor" strokeWidth={0} /> {product.rating.toFixed(1)} <span style={{ fontWeight: 500 }}>({product.reviews})</span></span>
                    <div className="v-product-price">
                      <b>{money(product.price)}</b>
                      {off > 0 ? <s>{money(product.compareAt!)}</s> : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
            <Link href="/shop" className="button button-primary">Shop All Products <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* ── why trust us ─────────────────────────────────────────────── */}
      <section className="v-section">
        <div className="v-wrap">
          <div className="v-head">
            <span className="v-eyebrow">Why pet parents trust us</span>
            <h2>Why Pet Parents Trust Us</h2>
            <p>Delivering a premium, cosy clinic experience right at your doorstep — and a hospital that stands behind every diagnosis.</p>
          </div>
          <div className="v-grid v-cols-3">
            {[
              { no: "Advantage #1", icon: <Truck size={20} />, title: "Fully equipped mobile clinic", text: "We bring the clinic to you. Our vets carry diagnostic tools, emergency supplies and a full medicine inventory, so any home visit is prepared for the unexpected." },
              { no: "Advantage #2", icon: <ShieldCheck size={20} />, title: "RVMP certified expertise", text: `${vet.name} holds a Doctor of Veterinary Medicine degree and is registered with the Pakistan Veterinary Medical Council — standard-compliant, premium medical care for your pets.` },
              { no: "Advantage #3", icon: <HeartPulse size={20} />, title: "24/7 rapid emergency response", text: "Medical emergencies do not wait for office hours. We dispatch rapidly for critical cases anywhere in Lahore, and our theatre is ready when you arrive." },
            ].map((item) => (
              <article key={item.no} className="v-card v-advantage">
                <span className="v-advantage-no">{item.no}</span>
                <span className="v-icon-tile">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── adopt ────────────────────────────────────────────────────── */}
      <section className="v-section v-section-soft">
        <div className="v-wrap">
          <div className="v-head-row">
            <div className="v-head v-head-left">
              <span className="v-eyebrow">Find a friend</span>
              <h2>Adopt a Pet</h2>
              <p>Give a loving animal a forever home. Meet some of our wonderful pets currently looking for their new families — every one vet-checked before listing.</p>
            </div>
            <Link href="/adopt" className="button button-ghost">View All Pets <ArrowRight size={15} /></Link>
          </div>
          <div className="v-grid v-cols-4">
            {availablePets.map((pet) => (
              <article key={pet.id} className="v-card v-card-hover v-adopt">
                <Link href={`/adopt/${pet.id}`} className="v-adopt-media" aria-label={`Meet ${pet.name}`}>
                  <Image src={pet.image} alt={`${pet.name}, ${pet.breed} looking for a home`} fill sizes="(max-width:900px) 45vw, 22vw" className="object-cover" unoptimized />
                  <span className="v-adopt-badges">
                    {pet.vaccinated ? <span className="v-adopt-badge v-adopt-badge-ok">Vaccinated</span> : null}
                    <span className="v-adopt-badge">{pet.sex}</span>
                    {pet.status === "reserved" ? <span className="v-adopt-badge" style={{ background: "#f7ecd8", color: "#7a5617" }}>Reserved</span> : null}
                  </span>
                </Link>
                <div className="v-adopt-body">
                  <h3>{pet.name}</h3>
                  <p>{pet.breed} · {pet.age}</p>
                  <a
                    className="v-service-link"
                    href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(`Assalam-o-Alaikum, I am interested in adopting ${pet.name}.`)}`}
                    target="_blank" rel="noopener noreferrer"
                  >
                    <WhatsAppIcon size={13} /> WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── steps ────────────────────────────────────────────────────── */}
      <section className="v-section">
        <div className="v-wrap">
          <div className="v-head">
            <span className="v-eyebrow">Simple as it should be</span>
            <h2>Book in 3 Simple Steps</h2>
            <p>Online booking that asks the right questions, shows the fee before you commit, and leaves a printable reference you can share at the door.</p>
          </div>
          <div className="v-steps">
            {[
              { n: "1", title: "Fill Booking Form", text: "Share your pet's details, your address and a preferred time slot online. It takes about two minutes." },
              { n: "2", title: "Confirm Appointment", text: "Our team confirms your appointment on WhatsApp and shares the exact arrival window with you." },
              { n: "3", title: "Doctor Arrives", text: `${vet.name} arrives at your door fully equipped to examine, treat and record the visit in your portal.` },
            ].map((step) => (
              <div key={step.n} className="v-step">
                <span className="v-step-n">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <Link href="/book-vet-appointment-lahore" className="button button-primary button-lg">Start a booking <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ── meet the vet ─────────────────────────────────────────────── */}
      <section className="v-section v-section-soft">
        <div className="v-wrap v-vet">
          <div className="v-vet-photo">
            <Image src={vet.image} alt={`${vet.name}, ${vet.role}`} fill sizes="(max-width:900px) 90vw, 36vw" className="object-cover" unoptimized />
            <span className="v-vet-years"><b>{vet.years}+</b><small>Years exp</small></span>
          </div>
          <div>
            <span className="v-eyebrow">Meet your veterinarian</span>
            <h2>Meet Your Veterinarian</h2>
            <div className="v-vet-name" style={{ marginTop: 10 }}>{vet.name}</div>
            <div className="v-vet-role">{vet.credentials} · {vet.role}</div>
            <div className="v-vet-role">{business.name}, Al Kabir Town · Lahore</div>
            <blockquote className="v-vet-quote">
              &ldquo;I founded {business.name}{" "}so that pets in Lahore could receive clinic-grade medicine without the stress of
              a car journey. Whether we see you at the hospital or in your living room, the standard is the same — unhurried,
              documented and honest.&rdquo;
            </blockquote>
            <div className="v-vet-chips">
              {["DVM certified", "RVMP registered", "Small animal specialist", "Surgery & dentistry"].map((chip) => (
                <span key={chip} className="v-vet-chip">{chip}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="button button-primary" href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={15} /> Chat on WhatsApp
              </a>
              <Link href="/team" className="button button-ghost">Meet the whole team</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── events & tips ────────────────────────────────────────────── */}
      <section className="v-section">
        <div className="v-wrap">
          <div className="v-head-row">
            <div className="v-head v-head-left">
              <span className="v-eyebrow">Community updates</span>
              <h2>Events &amp; Tips</h2>
              <p>Browse the latest events, daily insights and pet health tips from our veterinary experts.</p>
            </div>
            <Link href="/pet-care-tips" className="button button-ghost">View All Events <ArrowRight size={15} /></Link>
          </div>
          <div className="v-grid v-cols-4">
            {latestPosts.map((post) => (
              <article key={post.slug} className="v-card v-card-hover v-post">
                <Link href={`/pet-care-tips/${post.slug}`} className="v-post-media" aria-label={post.title}>
                  <Image src={post.image} alt={post.title} fill sizes="(max-width:900px) 45vw, 22vw" className="object-cover" unoptimized />
                  <span className="v-post-cat">{post.category}</span>
                </Link>
                <div className="v-post-body">
                  <h3><Link href={`/pet-care-tips/${post.slug}`}>{post.title}</Link></h3>
                  <span className="v-post-date">
                    {new Date(`${post.date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── gallery ──────────────────────────────────────────────────── */}
      <section className="v-section v-section-soft">
        <div className="v-wrap">
          <div className="v-head">
            <span className="v-eyebrow">Our work in action</span>
            <h2>Our Work in Action</h2>
            <p>Compassionate, professional veterinary care — at the hospital and in living rooms across Lahore.</p>
          </div>
          <div className="v-gallery">
            {galleryItems.slice(0, 4).map((item) => (
              <div key={item.id} className="v-gallery-item">
                <Image src={item.src} alt={item.alt} fill sizes="(max-width:900px) 45vw, 23vw" className="object-cover" unoptimized />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 34 }}>
            <Link href="/gallery" className="link-arrow" style={{ color: "var(--v-brand)" }}>Open the full gallery <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      {/* ── reviews ──────────────────────────────────────────────────── */}
      <section className="v-section">
        <div className="v-wrap">
          <div className="v-head-row">
            <div className="v-head v-head-left">
              <span className="v-eyebrow">Google reviews</span>
              <h2>What pet parents say</h2>
              <p>Real reviews from families across Lahore — collected on Google, published here without edits.</p>
            </div>
            <span className="v-card v-google-card">
              <span style={{ display: "inline-flex", gap: 2, color: "var(--v-brass-2)" }}>
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
              </span>
              <b>4.9</b>
              <small>Google · 184 reviews</small>
            </span>
          </div>
          <div className="v-reviews">
            {reviews.slice(0, 5).map((review, i) => (
              <article key={`${review.name}-${i}`} className="v-card v-review">
                <div className="v-review-top">
                  <span className="v-review-avatar" style={{ background: REVIEW_COLORS[i % REVIEW_COLORS.length] }}>
                    {review.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <span>
                    <span className="v-review-name">{review.name}</span>
                    <span className="v-review-time">{review.area} · {review.service}</span>
                  </span>
                  <span className="v-review-google">G</span>
                </div>
                <div className="v-review-stars">
                  {[1, 2, 3, 4, 5].slice(0, review.rating).map((n) => <Star key={n} size={12} fill="currentColor" strokeWidth={0} />)}
                </div>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Link href="/about#reviews" className="button button-ghost">Read more stories <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* ── emergency ────────────────────────────────────────────────── */}
      <section className="v-section" style={{ paddingTop: 0 }}>
        <div className="v-wrap">
          <div className="v-emergency">
            <div>
              <span className="v-eyebrow v-eyebrow-brass">24/7 critical care</span>
              <h2>Pet Emergency?</h2>
              <p>
                Don&apos;t wait. Our team is available 24/7 for critical cases, and we respond rapidly with life-saving
                equipment and a hospital theatre on standby. If your pet is in distress, call — do not fill a form.
              </p>
            </div>
            <div className="v-emergency-actions">
              <a className="v-emergency-call" href={`tel:${(settings?.phone ?? business.phone).replace(/[^\d+]/g, "")}`}>
                <Phone size={16} /> Call {settings?.phone ?? business.phone}
              </a>
              <a className="v-emergency-mail" href={`mailto:${settings?.email ?? business.email}`}>
                <Mail size={14} /> {settings?.email ?? business.email}
              </a>
              <a className="v-emergency-mail" href={business.mapsUrl} target="_blank" rel="noreferrer">
                <MapPin size={14} /> Al Kabir Town, Main Raiwind Road
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── closing cta ──────────────────────────────────────────────── */}
      <section className="v-section" style={{ paddingTop: 0, paddingBottom: 64 }}>
        <div className="v-wrap">
          <div className="v-cta">
            <span className="v-eyebrow">Ready when you are</span>
            <h2>Book a veterinarian for today</h2>
            <p>Choose a window, see the fee, get a printable booking slip. A veterinarian confirms every request — and if it can wait until morning, we will tell you that too.</p>
            <div className="v-cta-actions">
              <Link href="/book-vet-appointment-lahore" className="button button-primary button-lg"><CalendarCheck size={17} /> Book an appointment</Link>
              <Link href="/contact-vet-lahore" className="button button-ghost button-lg"><Clock size={16} /> Talk to the front desk</Link>
            </div>
            <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap", marginTop: 22, fontSize: 11.5, fontWeight: 700, color: "var(--v-muted)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Activity size={13} /> Same-day home visits</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ShieldCheck size={13} /> RVMP registered vets</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Smartphone size={13} /> Printable slip &amp; portal</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
