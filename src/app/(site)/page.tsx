import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BadgeCheck, Calendar, CalendarCheck, CheckCircle2, Clock, HeartPulse, Mail,
  MapPin, PawPrint, Phone, ShieldCheck, ShoppingBag, Star, Stethoscope, Truck, ShoppingCart, Award, Sparkles,
} from "lucide-react";
import { ServiceGlyph, WhatsAppIcon } from "@/components/icons";
import { business, galleryItems, team } from "@/lib/site";
import { pkrLabel } from "@/lib/format";
import { catalogPosts, catalogProducts, catalogServices, catalogTestimonials } from "@/server/catalog";
import { getSettings, rows } from "@/server/store";
import { ReviewCarousel } from "@/components/review-carousel";

export const dynamic = "force-dynamic";

const REVIEW_BG = ["#4285f4", "#ea4335", "#fbbc04", "#34a853", "#7b61cc"];

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="r-review-g">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2.5 24 .5 14.6.5 6.5 5.9 2.6 13.8l7.8 6.1C12.3 13.9 17.6 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M47 24.5c0-1.6-.1-2.8-.4-4.1H24v8.4h12.8c-.3 2.1-1.6 5.2-4.6 7.3l7.6 5.9C44.5 37.6 47 31.6 47 24.5Z" />
      <path fill="#FBBC05" d="M10.4 28.1c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.8-6.1A23.5 23.5 0 0 0 .5 23.5c0 3.8.9 7.3 2.5 10.5l7.4-5.9Z" />
      <path fill="#34A853" d="M24 47c6.2 0 11.5-2 15.3-5.6l-7.6-5.9c-2 1.4-4.7 2.4-7.7 2.4-6.4 0-11.7-4.4-13.6-10.4l-7.8 6C6.5 41.1 14.6 47 24 47Z" />
    </svg>
  );
}

export default async function HomePage() {
  const [services, products, posts, reviews, settings, adoption] = await Promise.all([
    catalogServices(), catalogProducts(), catalogPosts(), catalogTestimonials(), getSettings(), rows("adoption"),
  ]);
  const vet = team[0];
  const featured = (products.filter((p) => p.featured).length ? products.filter((p) => p.featured) : products).slice(0, 4);
  const availablePets = [
    ...adoption.filter((pet) => pet.status === "available"),
    ...adoption.filter((pet) => pet.status === "reserved"),
  ].slice(0, 4);
  const latestPosts = posts.slice(0, 4);
  const bentoOrder = ["general-checkup", "vaccination", "emergency-care", "deworming", "surgical-consult", "dental", "lab-tests", "tick-flea"];
  const bySlug = new Map(services.map((service) => [service.slug, service]));
  const bento = bentoOrder.map((slug) => bySlug.get(slug)).filter((service): service is NonNullable<typeof service> => Boolean(service));
  const SHORT_TITLES: Record<string, string> = { "emergency-care": "Emergency Care", dental: "Dental Cleaning" };
  const phone = settings?.phone ?? business.phone;
  const email = settings?.email ?? business.email;

  return (
    <>
      {/* ── hero ─────────────────────────────────────────────────────── */}
      <section className="r-hero">
        <div className="r-wrap r-hero-grid">
          <div>
            <div className="r-hero-badges">
              <span className="r-hero-pill"><BadgeCheck size={13} /> Lahore&apos;s trusted veterinary hospital</span>
              <span className="r-hero-pill"><ShieldCheck size={13} /> RVMP Registered Veterinarians</span>
            </div>
            <h1>
              Professional Vet
              <span>Care,</span>
              <span>At Your Doorstep</span>
            </h1>
            <p>
              Skip the stressful clinic travel. {vet.name}{" "}brings Lahore&apos;s trusted veterinary expertise directly to
              your home — and our fully equipped hospital in Al Kabir Town is ready when your pet needs more.
            </p>
            <div className="r-hero-actions">
              <Link href="/book-vet-appointment-lahore" className="r-btn r-btn-white r-btn-lg">Book Home Visit <ArrowRight size={16} /></Link>
              <Link href="/register" className="r-btn r-btn-orange r-btn-lg"><PawPrint size={16} /> Sign Up Free</Link>
              <Link href="/login" className="r-btn r-btn-ghost-dark r-btn-lg">Log In</Link>
            </div>
            <div className="r-hero-trust">
              {["24/7 Available", "RVMP Certified", "Fully Equipped", "All Pets Welcome"].map((item) => (
                <span key={item}><CheckCircle2 size={14} /> {item}</span>
              ))}
            </div>
          </div>

          <div className="r-vetcard-wrap">
            <div className="r-vetcard">
              <span className="r-vetcard-top">Top Rated ★</span>
              <div className="r-vetcard-photo">
                <Image src={vet.image} alt={`${vet.name}, ${vet.role} at ${business.name}`} fill priority sizes="(max-width:980px) 90vw, 40vw" className="object-cover" unoptimized />
              </div>
              <div className="r-vetcard-body">
                <h3>{vet.name}</h3>
                <div className="r-vetcard-cred">{vet.credentials}</div>
                <div className="r-vetcard-role">{vet.role}</div>
                <div className="r-vetcard-chips">
                  <span className="r-chip r-chip-peach">RVMP Registered</span>
                  <span className="r-chip r-chip-peach">DVM Certified</span>
                </div>
                <a className="r-btn r-btn-green" href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon size={16} /> Consult on WhatsApp
                </a>
              </div>
            </div>

            <p className="r-passport-note">Already a patient? Access your Digital Pet Passport:</p>
            <form className="r-passport" action="/slip" method="get">
              <span className="r-passport-field">
                <PawPrint size={15} />
                <input name="ref" placeholder="Booking reference · JVH-2026-752699" aria-label="Booking reference" autoComplete="off" />
              </span>
              <button type="submit">Access</button>
            </form>
          </div>
        </div>
      </section>

      {/* ── floating stats ───────────────────────────────────────────── */}
      <div className="r-wrap r-stats-wrap">
        <div className="r-stats">
          {[
            { value: "24/7", label: "Emergency response" },
            { value: "100%", label: "Lahore coverage" },
            { value: "RVMP", label: "Certified experts" },
            { value: "Unit", label: "Fully equipped" },
          ].map((stat) => (
            <div key={stat.label} className="r-stat"><b>{stat.value}</b><span>{stat.label}</span></div>
          ))}
        </div>
      </div>

      {/* ── services bento ───────────────────────────────────────────── */}
      <section className="r-section r-section-cream">
        <div className="r-wrap">
          <div className="r-head">
            <h2>Our Veterinary Services</h2>
            <p>Comprehensive home vet care for all your pets, delivered with compassion and professional expertise.</p>
          </div>
          <div className="r-bento">
            {bento.map((service, i) => {
              const big = i === 0;
              const tone = i === 0 ? "r-svc-teal" : i === 1 || i === 2 ? "r-svc-peach" : i === 6 ? "r-svc-blue" : "";
              return (
                <article key={service.slug} className={`r-svc ${tone}${big ? " r-svc-hero" : ""}`}>
                  <span className="r-svc-icon"><ServiceGlyph icon={service.icon} size={22} /></span>
                  <h3 className="r-svc-title">{big ? service.title : SHORT_TITLES[service.slug] ?? service.shortTitle}</h3>
                  <p className="r-svc-text">{big ? service.summary : service.summary.split(".")[0] + "."}</p>
                  {big ? (
                    <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="r-svc-btn">
                      Book Checkup <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="r-svc-link">
                      Book Service <ArrowRight size={13} />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
            <Link href="/services" className="r-btn r-btn-outline">All Services &amp; Fees <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* ── pet mall ─────────────────────────────────────────────────── */}
      <section className="r-section r-section-cream">
        <div className="r-wrap">
          <div className="r-head-row">
            <div className="r-head">
              <span className="label"><ShoppingBag size={14} /> Shop Essentials</span>
              <h2 style={{ marginTop: 10 }}>Pet Mall</h2>
              <p>Explore our curated selection of premium pet food, toys, and care essentials for your furry friends.</p>
            </div>
            <Link href="/shop" className="r-btn r-btn-outline">Shop All Products <ArrowRight size={15} /></Link>
          </div>
          <div className="r-products">
            {featured.map((product) => {
              const off = product.compareAt && product.compareAt > product.price ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100) : 0;
              return (
                <article key={product.id} className="r-prod">
                  <Link href={`/shop/${product.slug}`} className="r-prod-media" aria-label={product.name}>
                    {off > 0 ? <span className="r-prod-off">−{off}%</span> : null}
                    <Image src={product.image} alt={product.name} fill sizes="(max-width:900px) 45vw, 22vw" className="object-cover" unoptimized />
                  </Link>
                  <div className="r-prod-body">
                    <span className="r-prod-cat">{product.brand}</span>
                    <Link href={`/shop/${product.slug}`} className="r-prod-name">{product.name}</Link>
                    <div className="r-prod-foot">
                      <span className="r-prod-price">
                        <b>{pkrLabel(product.price)}</b>
                        {off > 0 ? <s>{pkrLabel(product.compareAt!)}</s> : null}
                      </span>
                      <Link href={`/shop/${product.slug}`} className="r-prod-cart" aria-label={`Buy ${product.name}`}>
                        <ShoppingCart size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── why trust us ─────────────────────────────────────────────── */}
      <section className="r-section r-section-white">
        <div className="r-wrap">
          <div className="r-head">
            <h2>Why Pet Parents Trust Us</h2>
            <p>Delivering a premium, cozy clinic experience right at your doorstep.</p>
          </div>
          <div className="r-zig">
            {[
              { chip: "Advantage #1", icon: <Truck size={26} />, title: "Fully Equipped Mobile Clinic", text: "We bring the clinic to you. Our vets carry advanced diagnostic tools, emergency supplies and a full medicine inventory, ensuring we are prepared for any situation." },
              { chip: "Advantage #2", icon: <Award size={26} />, title: "RVMP Certified Expertise", text: `${vet.name} is a Doctor of Veterinary Medicine and fully registered with the Pakistan Veterinary Medical Council, guaranteeing standard-compliant, premium medical care for your pets.` },
              { chip: "Advantage #3", icon: <Clock size={26} />, title: "24/7 Rapid Emergency Response", text: "Medical emergencies don't wait for office hours. We provide rapid dispatch for critical cases anywhere in Lahore, ensuring life-saving care is there when you need it most." },
            ].map((item) => (
              <div key={item.chip} className="r-zig-row">
                <div className="r-zig-art">
                  <span className="r-blob" />
                  <span className="r-blob-icon">{item.icon}</span>
                </div>
                <div className="r-zig-body">
                  <span className="r-chip">{item.chip}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── adopt ────────────────────────────────────────────────────── */}
      <section className="r-section r-section-cream">
        <div className="r-wrap">
          <div className="r-head-row">
            <div className="r-head">
              <span className="label"><PawPrint size={14} /> Find a Friend</span>
              <h2 style={{ marginTop: 10 }}>Adopt a Pet</h2>
              <p>Give a loving animal a forever home. Meet some of our wonderful pets currently looking for their new families.</p>
            </div>
            <Link href="/adopt" className="r-btn r-btn-outline">View All Pets <ArrowRight size={15} /></Link>
          </div>
          <div className="r-products">
            {availablePets.map((pet) => (
              <article key={pet.id} className="r-adopt">
                <Link href={`/adopt/${pet.id}`} className="r-adopt-media" aria-label={`Meet ${pet.name}`}>
                  <Image src={pet.image} alt={`${pet.name}, ${pet.breed} looking for a home`} fill sizes="(max-width:900px) 45vw, 22vw" className="object-cover" unoptimized />
                  <span className="r-adopt-badges">
                    {pet.vaccinated ? <span className="r-badge r-badge-green">Vaccinated</span> : null}
                    {pet.status === "reserved" ? <span className="r-badge">Reserved</span> : null}
                  </span>
                </Link>
                <div className="r-adopt-body">
                  <span className="r-adopt-sex">{pet.sex}</span>
                  <span className="r-adopt-name">{pet.name}</span>
                  <span className="r-adopt-meta">{pet.breed} · {pet.age}</span>
                  <a
                    className="r-adopt-wa"
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
      <section className="r-section r-section-cream" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-head"><h2>Book in 3 Simple Steps</h2></div>
          <div className="r-steps">
            {[
              { n: "1", title: "Fill Booking Form", text: "Provide your pet's details, your address, and select a preferred time slot online." },
              { n: "2", title: "Confirm Appointment", text: "Our team will confirm your appointment via WhatsApp and share arrival details." },
              { n: "3", title: "Doctor Arrives", text: `${vet.name} arrives at your door fully equipped to examine and treat your pet.` },
            ].map((step) => (
              <div key={step.n} className="r-step">
                <span className="r-step-n">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── vet ──────────────────────────────────────────────────────── */}
      <section className="r-section r-section-white">
        <div className="r-wrap">
          <div className="r-vet-band">
            <div className="r-vet-inner">
              <div className="r-vet-photo">
                <Image src={vet.image} alt={`${vet.name}, ${vet.role}`} fill sizes="(max-width:860px) 90vw, 34vw" className="object-cover" unoptimized />
                <span className="r-vet-years"><b>{vet.years}+</b><small>Years exp</small></span>
              </div>
              <div className="r-vet-copy">
                <span className="label"><Stethoscope size={14} /> Lead veterinarian</span>
                <h2>Meet Your Veterinarian</h2>
                <div className="r-vet-name">{vet.name}</div>
                <div className="r-vet-role">{vet.credentials} · {vet.role}</div>
                <p className="r-vet-quote">
                  &ldquo;I founded {business.name}{" "}so that pets in Lahore could receive clinic-grade medicine without the
                  stress of a car journey. Whether we see you at the hospital or in your living room, the standard is the
                  same — unhurried, documented and honest.&rdquo;
                </p>
                <div className="r-vet-chips">
                  {["DVM Certified", "RVMP Registered", "Small Animal Specialist"].map((chip) => (
                    <span key={chip} className="r-vet-chip">{chip}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a className="r-btn r-btn-green" href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon size={15} /> Chat on WhatsApp
                  </a>
                  <Link href="/team" className="r-btn r-btn-ghost-dark">Meet the team</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── events ───────────────────────────────────────────────────── */}
      <section className="r-section r-section-white" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-head-row">
            <div className="r-head">
              <span className="label"><Calendar size={14} /> Community Updates</span>
              <h2 style={{ marginTop: 10 }}>Events &amp; Tips</h2>
              <p>Browse the latest events, daily insights, and pet health tips from our veterinary experts.</p>
            </div>
            <Link href="/pet-care-tips" className="r-btn r-btn-outline">View All Events <ArrowRight size={15} /></Link>
          </div>
          <div className="r-posts">
            {latestPosts.map((post) => (
              <article key={post.slug} className="r-post">
                <Link href={`/pet-care-tips/${post.slug}`} className="r-post-media" aria-label={post.title}>
                  <Image src={post.image} alt={post.title} fill sizes="(max-width:900px) 45vw, 22vw" className="object-cover" unoptimized />
                </Link>
                <div className="r-post-body">
                  <span className="r-post-cat">{post.category}</span>
                  <Link href={`/pet-care-tips/${post.slug}`} className="r-post-title">{post.title}</Link>
                  <div className="r-post-foot">
                    <span className="r-post-date">
                      {new Date(`${post.date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <Link href={`/pet-care-tips/${post.slug}`} className="r-post-arrow" aria-label={`Read ${post.title}`}>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── gallery ──────────────────────────────────────────────────── */}
      <section className="r-section r-section-cream">
        <div className="r-wrap">
          <div className="r-head">
            <h2>Our Work in Action</h2>
            <p>See our team delivering compassionate, professional vet care directly to pets in their local communities.</p>
          </div>
          <div className="r-gallery">
            {galleryItems.slice(0, 4).map((item) => (
              <div key={item.id} className="r-gallery-item">
                <Image src={item.src} alt={item.alt} fill sizes="(max-width:860px) 45vw, 23vw" className="object-cover" unoptimized />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
            <Link href="/gallery" className="r-link">Open the full gallery <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      {/* ── reviews ──────────────────────────────────────────────────── */}
      <section className="r-section r-section-white">
        <div className="r-wrap r-reviews">
          <div className="r-reviews-brand">
            <div className="r-reviews-logo">
              <span className="r-logo"><span>{settings?.monogram ?? business.monogram}</span></span>
              <h3>{business.shortName} —<br />Lahore&apos;s Vet Hospital</h3>
            </div>
            <span className="r-reviews-stars">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={15} fill="currentColor" strokeWidth={0} />)}
            </span>
            <span className="r-reviews-count">4.9 average · 184 Google reviews</span>
            <a className="r-btn r-btn-green r-btn-sm" href={business.mapsUrl} target="_blank" rel="noreferrer">
              Write a review
            </a>
          </div>
          <ReviewCarousel>
            {reviews.slice(0, 6).map((review, i) => (
              <article key={`${review.name}-${i}`} className="r-review">
                <div className="r-review-top">
                  <span className="r-review-avatar" style={{ background: REVIEW_BG[i % REVIEW_BG.length] }}>
                    {review.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <span>
                    <span className="r-review-name">{review.name}</span>
                    <span className="r-review-time">{["3 months ago", "2 weeks ago", "3 months ago", "2 weeks ago", "2 months ago"][i % 5]}</span>
                  </span>
                  <GoogleG />
                </div>
                <div className="r-review-stars">
                  {[1, 2, 3, 4, 5].slice(0, review.rating).map((n) => <Star key={n} size={13} fill="currentColor" strokeWidth={0} />)}
                  <CheckCircle2 size={12} className="verified" />
                </div>
                <p>{review.text}</p>
              </article>
            ))}
          </ReviewCarousel>
        </div>
      </section>

      {/* ── emergency ────────────────────────────────────────────────── */}
      <section className="r-emergency">
        <div className="r-wrap r-emergency-inner">
          <h2>Pet Emergency?</h2>
          <p>Don&apos;t wait. Our team is available 24/7 for critical cases. We respond rapidly with life-saving equipment.</p>
          <a className="r-emergency-call" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
            <span style={{ width: 18, height: 18, borderRadius: 99, background: "#fff", display: "inline-block" }} />
            Call {phone}
          </a>
          <a className="r-emergency-mail" href={`mailto:${email}`}>or email {email}</a>
        </div>
      </section>
    </>
  );
}
