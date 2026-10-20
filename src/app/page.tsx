import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarDays, ChevronRight, Clock3, Heart, HeartHandshake, MapPin, MessageCircle, PawPrint, Phone, ShieldCheck, ShoppingBag, Siren, Smartphone, Sparkles, Star, Stethoscope, Syringe } from "lucide-react";
import { AdoptCard, ProductCard, ServiceCard, ServiceIconView } from "@/components/cards";
import { DemoNotice } from "@/components/page-parts";
import { lahoreAreas, testimonials } from "@/lib/catalog";
import { getSettings, listAdoptions, listProducts } from "@/lib/hospital-db";
import { articles, business, categories, services, whatsappUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Jawad Veterinary Hospital | Vet Care, Pet Mall & Home Visits in Lahore",
  "Premium veterinary hospital in Al Kabir Town, Lahore. Book online in 2 minutes with an instant booking slip, shop the Pet Mall, keep a Digital Pet Passport and book Lahore home visits.",
  "/",
);

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const AVATAR_COLORS = ["#14509e", "#9d7c43", "#146c3f", "#5b3ea8", "#a9241b"];

export default function HomePage() {
  const settings = getSettings();
  const featuredProducts = listProducts(true).filter((product) => product.featured).slice(0, 8);
  const adoptionPets = listAdoptions(["available"]).slice(0, 4);

  return (
    <main id="main-content">
      {settings.announcement && <p className="announcement">{settings.announcement}</p>}

      {/* ------------------------------ HERO ------------------------------ */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="eyebrow-paw"><PawPrint size={14} fill="currentColor" strokeWidth={1.5} /></span>
              LAHORE&apos;S PREMIUM VETERINARY HOSPITAL
            </div>
            <h1>Exceptional vet care for your <em>beloved pets.</em></h1>
            <p className="hero-description">
              From routine checkups and vaccinations to surgery, grooming and gentle home visits across Lahore —
              Jawad Veterinary Hospital brings hospital-grade care and a complete Pet Mall together under one roof in Al Kabir Town.
            </p>
            <div className="hero-actions">
              <Link href="/book" className="button button-gold button-large"><CalendarDays size={18} /> Book a Visit <ArrowRight size={16} /></Link>
              <Link href="/login?mode=signup" className="button button-outline button-large"><PawPrint size={17} /> Sign Up Free</Link>
              <Link href="/login" className="button button-outline button-large">Log In</Link>
            </div>
            <div className="hero-badges" aria-label="Hospital highlights">
              <span><Clock3 size={13} /> Open Daily 8 AM – 11:30 PM</span>
              <span><ShieldCheck size={13} /> Expert Veterinarians</span>
              <span><Stethoscope size={13} /> Fully Equipped Hospital</span>
              <span><Heart size={13} /> All Pets Welcome</span>
            </div>
            <div className="passport-access">
              <span><Smartphone size={21} /></span>
              <p><strong>Already a patient?</strong>Access your free Digital Pet Passport — vaccinations, visit history &amp; reports.</p>
              <Link href="/dashboard/pets" className="button button-primary">Access <ArrowRight size={15} /></Link>
            </div>
          </div>

          <div className="hero-visual">
            <Image src="/images/hero-vet.jpg" alt="Veterinarian gently examining a golden retriever inside the Jawad Veterinary Hospital clinic" fill priority sizes="(max-width: 900px) 100vw, 52vw" className="hero-image" />
            <div className="hero-rated"><Star size={13} fill="#e9c766" color="#e9c766" /> TOP RATED IN LAHORE</div>
            <div className="hero-doctor-card">
              <span className="hero-doctor-photo"><Image src="/images/care-consultation.jpg" alt="Dr. Jawad, lead veterinarian (illustrative)" fill sizes="58px" className="object-cover" /></span>
              <div>
                <h3>Dr. Jawad</h3>
                <p>Lead Veterinarian &amp; Medical Director</p>
                <span className="hero-doctor-tags"><span>DVM</span><span>Small Animal Specialist</span></span>
              </div>
              <a className="hero-doctor-wa" href={whatsappUrl("Hello Jawad Veterinary Hospital, I would like to consult about my pet.")} target="_blank" rel="noopener noreferrer" aria-label="Consult on WhatsApp"><MessageCircle size={19} /></a>
            </div>
            <span className="hero-image-note">Illustrative imagery</span>
          </div>
        </div>

        <div className="container" style={{ paddingBottom: 42 }}>
          <div className="stats-strip">
            <div><strong>7 <em>days</em></strong><small>Open every week</small></div>
            <div><strong>100<em>%</em></strong><small>Lahore home-visit coverage</small></div>
            <div><strong>8<em>+</em></strong><small>Specialist services</small></div>
            <div><strong>Free</strong><small>Digital Pet Passport</small></div>
          </div>
          <div className="portal-promo">
            <span className="pp-icon"><Smartphone size={27} /></span>
            <div>
              <h3>The Jawad Pet Parent Portal</h3>
              <p>Book in seconds, download your token slip, track Pet Mall orders and keep every vaccine record in your pet&apos;s Digital Passport.</p>
            </div>
            <Link href="/login?mode=signup" className="button button-gold">Create free account <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      <div className="marquee-strip" aria-hidden="true"><div className="marquee-track">
        <span>Consultations <i>◆</i> Vaccination <i>◆</i> Surgery <i>◆</i> Diagnostics &amp; Lab <i>◆</i> Dental <i>◆</i> Grooming <i>◆</i> Home Visits <i>◆</i> Pet Mall <i>◆</i> Al Kabir Town, Lahore <i>◆</i></span>
        <span>Consultations <i>◆</i> Vaccination <i>◆</i> Surgery <i>◆</i> Diagnostics &amp; Lab <i>◆</i> Dental <i>◆</i> Grooming <i>◆</i> Home Visits <i>◆</i> Pet Mall <i>◆</i> Al Kabir Town, Lahore <i>◆</i></span>
      </div></div>

      {/* ---------------------------- SERVICES ---------------------------- */}
      <section className="section care-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> OUR VETERINARY SERVICES</span>
              <h2>Complete care for every <em>stage of life.</em></h2>
              <p>Comprehensive veterinary care for dogs, cats, birds, rabbits and more — at our Al Kabir Town hospital or at your home anywhere in Lahore.</p>
            </div>
            <Link href="/services" className="button button-outline">View all services <ArrowRight size={17} /></Link>
          </div>
          <div className="service-photo-grid">
            {services.map((service) => <ServiceCard key={service.slug} service={service} image />)}
          </div>
        </div>
      </section>

      {/* ----------------------------- PET MALL ----------------------------- */}
      <section className="shop-section">
        <div className="container">
          <div className="shop-intro">
            <div className="shop-intro-copy">
              <span className="eyebrow"><span className="eyebrow-line" /> SHOP ESSENTIALS</span>
              <h2>The Jawad <em>Pet Mall.</em></h2>
              <p>Premium food, toys, grooming and everyday essentials — order online for Lahore-wide delivery, or pick up at the hospital. Cash on delivery, Easypaisa, JazzCash &amp; bank transfer accepted.</p>
              <Link href="/shop" className="button button-gold">Shop all products <ArrowRight size={17} /></Link>
            </div>
            <div className="shop-intro-image">
              <Image src="/images/pet-shop.jpg" alt="Inside the Jawad Pet Mall boutique" fill sizes="(max-width: 900px) 100vw, 46vw" className="object-cover" />
              <span className="image-disclaimer">Illustrative shop image</span>
            </div>
          </div>
          <div className="category-shortcuts">
            {[categories[0], categories[1], categories[6], categories[10], categories[8], categories[4]].map((category) => (
              <Link key={category.slug} href={`/shop?category=${category.slug}`}>{category.shortName}<ChevronRight size={14} /></Link>
            ))}
          </div>
          <div className="product-grid home-product-grid">
            {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <Link href="/shop" className="button button-outline"><ShoppingBag size={16} /> Browse the full Pet Mall <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ------------------------------ WHY US ------------------------------ */}
      <section className="why-section">
        <div className="container">
          <div className="why-heading">
            <span className="eyebrow eyebrow-light">WHY PET PARENTS TRUST US</span>
            <h2>A premium hospital experience,<br />built around your pet.</h2>
          </div>
          <div className="why-grid">
            <div>
              <span className="advantage-index"><i>01</i> Advantage</span>
              <h3>Fully Equipped Hospital</h3>
              <p>Consultation, diagnostics, surgery support, dental and grooming facilities in one calm, spotless space — prepared for routine care and urgent cases alike.</p>
            </div>
            <div>
              <span className="advantage-index"><i>02</i> Advantage</span>
              <h3>Care + Pet Mall, One Roof</h3>
              <p>Finish your visit with the exact food, medicine and essentials your vet recommends — no second trip across the city, in-store or delivered to your door.</p>
            </div>
            <div>
              <span className="advantage-index"><i>03</i> Advantage</span>
              <h3>Home Visits Across Lahore</h3>
              <p>Anxious pet or busy schedule? Our mobile team brings checkups, vaccination and follow-up care to your home — booked online in two minutes.</p>
            </div>
            <div>
              <span className="advantage-index"><i>04</i> Advantage</span>
              <h3>Digital Pet Passport</h3>
              <p>Every patient&apos;s vaccinations, visits and prescriptions live in your free online passport — track bookings, slips and orders from one portal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------- ADOPT ------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> FIND A FRIEND</span>
              <h2>Adopt a <em>pet.</em></h2>
              <p>Give a loving animal a forever home. Every listing is reviewed by our team, and most pets come vaccinated and dewormed.</p>
            </div>
            <Link href="/adopt" className="button button-outline">View all pets <ArrowRight size={17} /></Link>
          </div>
          <div className="adopt-grid">
            {adoptionPets.map((pet) => <AdoptCard key={pet.id} pet={pet} />)}
          </div>
        </div>
      </section>

      {/* --------------------------- HOW IT WORKS --------------------------- */}
      <section className="section section-ivory">
        <div className="container">
          <div className="section-header compact">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> EFFORTLESS BOOKING</span>
              <h2>Book in 3 <em>simple steps.</em></h2>
            </div>
            <Link href="/book" className="button button-gold"><CalendarDays size={16} /> Start booking <ArrowRight size={16} /></Link>
          </div>
          <div className="how-steps">
            <div className="how-step">
              <span className="step-num">1</span>
              <h3>Fill the booking form</h3>
              <p>Share your pet&apos;s details, choose a service, and pick a hospital or home visit at a time that suits you.</p>
            </div>
            <div className="how-step">
              <span className="step-num">2</span>
              <h3>Get your booking slip</h3>
              <p>Instantly receive a booking slip with your token number — print it or keep it on your phone. We also confirm on WhatsApp.</p>
            </div>
            <div className="how-step">
              <span className="step-num">3</span>
              <h3>Meet your veterinarian</h3>
              <p>Walk in with your token, or welcome our vet at your door — fully equipped to examine and treat your pet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- MEET THE VET ---------------------------- */}
      <section className="section">
        <div className="container meet-vet-grid">
          <div className="vet-photo-wrap">
            <Image src="/images/team-at-work.jpg" alt="The Jawad Veterinary Hospital team caring for a patient (illustrative photograph)" fill sizes="(max-width: 900px) 100vw, 42vw" className="object-cover" />
            <span className="image-disclaimer">Illustrative portrait</span>
            <div className="exp-badge"><strong>Since</strong><small>Serving Lahore families</small></div>
          </div>
          <div>
            <span className="eyebrow"><span className="eyebrow-line" /> MEET YOUR VETERINARIAN</span>
            <h2 style={{ fontSize: "clamp(34px,3.4vw,48px)", margin: "13px 0 6px" }}>Dr. Jawad</h2>
            <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".06em", color: "#7c5f26", margin: 0 }}>DOCTOR OF VETERINARY MEDICINE · LEAD VETERINARIAN &amp; MEDICAL DIRECTOR</p>
            <blockquote className="vet-quote">
              &ldquo;We built Jawad Veterinary Hospital so no pet in Lahore has to wait in pain or fear for good care. Whether you walk into our hospital or we come to your home, your pet is treated like our own family.&rdquo;
            </blockquote>
            <div className="cred-chips">
              <span><BadgeCheck size={14} /> DVM Qualified</span>
              <span><Syringe size={14} /> Preventive Medicine</span>
              <span><Stethoscope size={14} /> Small Animal Specialist</span>
              <span><HeartHandshake size={14} /> Gentle Handling</span>
            </div>
            <div style={{ display: "flex", gap: 11, flexWrap: "wrap" }}>
              <Link href="/book" className="button button-primary"><CalendarDays size={16} /> Book with Dr. Jawad</Link>
              <a href={whatsappUrl("Hello Dr. Jawad, I would like advice about my pet.")} target="_blank" rel="noopener noreferrer" className="button button-whatsapp"><MessageCircle size={16} /> Chat on WhatsApp</a>
            </div>
            <p style={{ fontSize: 10.5, color: "#93a0a8", marginTop: 18, lineHeight: 1.65 }}>
              Portrait and profile are presented for this website — the hospital will confirm the official photograph, credentials and biography at launch.
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------- EVENTS & TIPS --------------------------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header compact">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> COMMUNITY UPDATES</span>
              <h2>Events &amp; <em>tips.</em></h2>
              <p>Pet-health guidance and know-how from our veterinary team.</p>
            </div>
            <Link href="/blog" className="button button-outline">View all articles <ArrowRight size={17} /></Link>
          </div>
          <div className="article-grid">
            {articles.slice(0, 3).map((article) => (
              <article className="article-card" key={article.slug}>
                <Link href={`/blog/${article.slug}`} className="article-image">
                  <Image src={article.image} alt={`Illustrative image for ${article.title}`} fill sizes="(max-width: 700px) 100vw, 33vw" className="object-cover" />
                </Link>
                <div className="article-card-body">
                  <span className="article-meta">{article.category} <span>·</span> {article.readTime}</span>
                  <h3><Link href={`/blog/${article.slug}`}>{article.title}</Link></h3>
                  <p>{article.excerpt}</p>
                  <Link href={`/blog/${article.slug}`} className="text-link">Read article <ArrowRight size={16} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ GALLERY ------------------------------ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header compact">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> OUR WORK IN ACTION</span>
              <h2>Inside the <em>hospital.</em></h2>
            </div>
            <Link href="/gallery" className="button button-outline">Explore gallery <ArrowUpRight size={16} /></Link>
          </div>
          <div className="gallery-strip">
            {[
              { src: "/images/care-consultation.jpg", caption: "Gentle, unhurried consultations" },
              { src: "/images/care-cat.jpg", caption: "Feline-friendly examinations" },
              { src: "/images/service-grooming.jpg", caption: "Spa-style grooming studio" },
              { src: "/images/team-at-work.jpg", caption: "A team that loves what it does" },
            ].map((item) => (
              <Link href="/gallery" className="gallery-strip-item" key={item.src}>
                <Image src={item.src} alt={item.caption} fill sizes="(max-width: 700px) 50vw, 25vw" className="object-cover" />
                <span>{item.caption}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ REVIEWS ------------------------------ */}
      <section className="section section-ivory">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> PET PARENTS LOVE US</span>
              <h2>Jawad Veterinary Hospital — <em>Lahore&apos;s trusted pet care.</em></h2>
            </div>
            <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="button button-outline">Write a review <ArrowUpRight size={16} /></a>
          </div>
          <div className="reviews-grid">
            {testimonials.map((review, index) => (
              <article className="review-card" key={review.name}>
                <div className="review-head">
                  <span className="review-avatar" style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }} aria-hidden="true">
                    {review.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </span>
                  <div>
                    <strong>{review.name}</strong>
                    <small>{review.area} · {review.when}</small>
                  </div>
                  <span className="review-g" aria-hidden="true"><i>G</i></span>
                </div>
                <span className="stars" aria-label={`${review.rating} out of 5 stars`}>★★★★★</span>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
          <DemoNotice>Testimonials shown are sample content for this website presentation. The hospital&apos;s live Google reviews will be connected here before launch.</DemoNotice>
        </div>
      </section>

      {/* ------------------------------- AREAS ------------------------------- */}
      <section className="section" style={{ paddingBottom: 70 }}>
        <div className="container">
          <div className="section-header compact">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> HOME VISITS &amp; DELIVERY</span>
              <h2>Serving all of <em>Lahore.</em></h2>
              <p>Based in Al Kabir Town on Main Raiwind Road — our home-visit team and Pet Mall riders cover:</p>
            </div>
          </div>
          <div className="areas-strip">
            {lahoreAreas.slice(0, -1).map((area) => (
              <span key={area}><MapPin size={12} /> {area}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- EMERGENCY ----------------------------- */}
      <section style={{ paddingBottom: 84 }}>
        <div className="container">
          <div className="emergency-band">
            <span className="eb-icon"><Siren size={30} /></span>
            <div>
              <h2>Pet emergency?</h2>
              <p>Don&apos;t wait for an online reply. Call us now and we will guide you immediately — and if your pet needs urgent treatment, head straight to the hospital while someone calls ahead.</p>
            </div>
            <div className="eb-actions">
              <a href={business.phoneHref} className="button button-call"><Phone size={16} /> Call {business.phone}</a>
              <a href={`mailto:${business.email}`} className="button button-outline-light">or email {business.email}</a>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
            <Link href="/fees" className="text-link">Transparent fees — no hidden charges <ArrowRight size={15} /></Link>
            <span aria-hidden="true" style={{ color: "#c9bb92" }}>·</span>
            <Link href="/faqs" className="text-link">Questions? Read our FAQs <ArrowRight size={15} /></Link>
            <span aria-hidden="true" style={{ color: "#c9bb92" }}>·</span>
            <Link href="/services/urgent-veterinary-assessment" className="text-link"><Sparkles size={14} /> Urgent care guidance</Link>
            <span aria-hidden="true" style={{ color: "#c9bb92" }}>·</span>
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 12, fontWeight: 800, color: "#0a2540" }}><ServiceIconView name="stethoscope" size={15} /> Open today till 11:30 PM</span>
          </div>
        </div>
      </section>
    </main>
  );
}
