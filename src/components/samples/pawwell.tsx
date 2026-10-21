import Image from "next/image";
import {
  ArrowRight, ArrowUpRight, CalendarCheck, ChevronLeft, ChevronRight, Clock,
  Heart, Leaf, Mail, MapPin, Microscope, PawPrint, Phone, Pill,
  Play, Scissors, Search, ShieldCheck, ShoppingBag, Sparkles, Stethoscope, Syringe,
  User,
} from "lucide-react";
import { REVIEWS, STATS, VET_IMG } from "./data";

/* ── content for the full-page concept ───────────────────────────────── */

const NAV = ["Home", "Services", "Pet Mall", "About", "Pet Care", "Contact"];

const TRUST = [
  { icon: Stethoscope, a: "Experienced Vets", b: "& Staff" },
  { icon: Sparkles, a: "Modern Facilities", b: "& Equipment" },
  { icon: Phone, a: "24/7 Emergency", b: "Support" },
];

const SERVICES = [
  { icon: Stethoscope, name: "General Checkups & Preventive Care" },
  { icon: Syringe, name: "Vaccinations" },
  { icon: ShieldCheck, name: "Surgery & Advanced Care" },
  { icon: Sparkles, name: "Dental Care" },
  { icon: Phone, name: "Emergency Care" },
  { icon: Heart, name: "Nutrition & Weight Management" },
  { icon: Microscope, name: "Diagnostics & Lab Tests" },
  { icon: Scissors, name: "Grooming & Hygiene" },
  { icon: PawPrint, name: "Microchipping" },
  { icon: Pill, name: "Pet Pharmacy" },
];

const WHY = [
  { icon: Heart, t: "Personalised Care Plans", d: "For every pet's unique needs" },
  { icon: Stethoscope, t: "Compassionate & Skilled Team", d: "Experienced professionals who care" },
  { icon: ShieldCheck, t: "Modern & Safe Facilities", d: "Equipped with the latest technology" },
  { icon: CalendarCheck, t: "Convenient & Flexible Booking", d: "Online and phone appointments" },
];

const CATEGORIES = [
  { label: "Dog Food", img: "/images/categories/dog-food.png" },
  { label: "Cat Food", img: "/images/categories/cat-food.png" },
  { label: "Treats", img: "/images/categories/treats-chews.png" },
  { label: "Toys", img: "/images/categories/toys-enrichment.png" },
  { label: "Accessories", img: "/images/categories/collars-leashes.png" },
  { label: "Health & Wellness", img: "/images/categories/supplements.png" },
  { label: "Grooming", img: "/images/categories/grooming-care.png" },
];

const POSTS = [
  { cat: "Pet Care", title: "Top 10 Tips for a Healthy Dog", img: "/images/pet-dog.jpg" },
  { cat: "Nutrition", title: "Best Foods for Your Cat's Health", img: "/images/pet-cat.jpg" },
  { cat: "Health", title: "Signs Your Pet Needs a Vet Visit", img: "/images/consultation.jpg" },
  { cat: "Training", title: "Basic Training Tips for Puppies", img: "/images/nutrition.jpg" },
];

const FOOT_SERVICES = ["General Checkups", "Vaccinations", "Surgery & Advanced Care", "Dental Care", "Emergency Care"];

/* ── primitives ──────────────────────────────────────────────────────── */

function Pic({ src, alt = "", className = "", priority = false }: { src: string; alt?: string; className?: string; priority?: boolean }) {
  return (
    <span className={`pw-pic ${className}`}>
      <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 50vw" className="pw-pic-img" priority={priority} unoptimized />
    </span>
  );
}

function Stars() {
  return (
    <span className="pw-stars" aria-label="5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => <Sparkles key={i} size={11} fill="currentColor" strokeWidth={0} />)}
    </span>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`pw-logo${light ? " pw-logo-light" : ""}`}>
      <PawPrint size={26} strokeWidth={2.2} />
      <span>
        <b>Jawad</b>
        <small>Veterinary Hospital &amp; Pet Care</small>
      </span>
    </span>
  );
}

/* ── the page ────────────────────────────────────────────────────────── */

export function PawWell({ tone }: { tone: "green" | "ivory" | "slate" | "sage" }) {
  return (
    <div className={`pw pw--${tone}`}>
      <header className="pw-head">
        <div className="pw-wrap pw-head-in">
          <a className="pw-logo-link"><Logo /></a>
          <nav className="pw-nav">
            {NAV.map((l) => <a key={l} className={l === "Home" ? "is-active" : undefined}>{l}</a>)}
          </nav>
          <div className="pw-tools">
            <button type="button" className="pw-icon-btn" aria-label="Search"><Search size={18} /></button>
            <button type="button" className="pw-icon-btn" aria-label="Account"><User size={18} /></button>
            <button type="button" className="pw-icon-btn pw-cart" aria-label="Cart, 0 items">
              <ShoppingBag size={18} /><i>0</i>
            </button>
            <a className="pw-btn pw-btn-sm">Book Appointment</a>
          </div>
        </div>
      </header>

      <section className="pw-hero">
        <div className="pw-hero-copy">
          <span className="pw-eyebrow">Complete care for your beloved pets</span>
          <h1>Healthier Pets<br />Happier Lives</h1>
          <p>
            Expert veterinary care, a vet-approved pet mall and 24/7 emergency support — in Al Kabir Town and at your
            doorstep across Lahore. Because they are not just pets, they are family.
          </p>
          <div className="pw-hero-cta">
            <a className="pw-btn">Book an Appointment <ArrowRight size={15} /></a>
            <a className="pw-btn pw-btn-outline">Explore Our Services</a>
          </div>
          <ul className="pw-trust">
            {TRUST.map(({ icon: I, a, b }) => (
              <li key={a}><span className="pw-trust-ico"><I size={19} /></span><span><b>{a}</b><small>{b}</small></span></li>
            ))}
          </ul>
        </div>
        <div className="pw-hero-media">
          <Pic src="/images/hero-care.jpg" alt="Veterinarian with a golden retriever and a cat" priority />
          <span className="pw-hero-script" aria-hidden="true">Healthy<br />Pets<br />Happy<br />Homes</span>
        </div>
      </section>

      <section className="pw-sec">
        <div className="pw-wrap pw-services">
          <div className="pw-services-copy">
            <span className="pw-eyebrow">Veterinary Services</span>
            <h2>Our Services</h2>
            <p>
              From routine checkups to advanced treatments, we offer a full range of veterinary services to keep your
              pets healthy at every stage of life.
            </p>
            <a className="pw-btn">View All Services <ArrowRight size={15} /></a>
          </div>
          <div className="pw-svc-grid">
            {SERVICES.map(({ icon: I, name }) => (
              <a key={name} className="pw-svc">
                <span className="pw-svc-ico"><I size={20} /></span>
                <b>{name}</b>
                <span className="pw-svc-arrow"><ArrowRight size={14} /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="pw-sec pw-sec-flush">
        <div className="pw-wrap pw-promo">
          <article className="pw-shop">
            <div className="pw-shop-copy">
              <h3>Shop for Your Pet</h3>
              <p>Premium food, treats, toys and more — delivered across Lahore with care.</p>
              <a className="pw-btn">Shop Now <ArrowRight size={15} /></a>
            </div>
            <Pic src="/images/pet-shop.jpg" alt="Pet food and supplies" className="pw-shop-art" />
          </article>

          <aside className="pw-why">
            <h3>Why Choose Us?</h3>
            <div className="pw-why-body">
              <ul>
                {WHY.map(({ icon: I, t, d }) => (
                  <li key={t}>
                    <span className="pw-why-ico"><I size={18} /></span>
                    <div><b>{t}</b><small>{d}</small></div>
                  </li>
                ))}
              </ul>
              <div className="pw-stamp">
                <Heart size={16} fill="currentColor" strokeWidth={0} />
                <span>Because<br />they deserve<br />the best</span>
              </div>
            </div>
            <PawPrint className="pw-why-paw" size={130} strokeWidth={1} aria-hidden="true" />
          </aside>
        </div>
      </section>

      <section className="pw-sec pw-about-band">
        <div className="pw-wrap pw-about">
          <div className="pw-about-media">
            <Pic src={VET_IMG} alt="Veterinarian examining a cat" />
            <span className="pw-play" aria-hidden="true"><Play size={16} fill="currentColor" strokeWidth={0} /></span>
          </div>
          <div className="pw-about-copy">
            <span className="pw-eyebrow">About Us</span>
            <h2>A Trusted Partner<br />in Pet Health</h2>
            <p>
              At Jawad Veterinary Hospital, we believe every pet deserves the best care. Our team of experienced
              veterinarians and support staff are dedicated to providing compassionate, professional and personalised
              care for your furry friends.
            </p>
            <a className="pw-btn">Learn More <ArrowRight size={15} /></a>
          </div>
          <ul className="pw-stats">
            {STATS.map((s) => (
              <li key={s.l}>
                <span className="pw-stat-ico"><PawPrint size={18} /></span>
                <div><b>{s.v}</b><small>{s.l}</small></div>
              </li>
            ))}
          </ul>
          <Leaf className="pw-about-leaf" size={120} strokeWidth={0.9} aria-hidden="true" />
        </div>
      </section>

      <section className="pw-sec">
        <div className="pw-wrap">
          <div className="pw-sec-head">
            <div>
              <h2>Shop by Category</h2>
              <p>Everything your pet needs, in one place.</p>
            </div>
            <a className="pw-link">View All Products <ArrowRight size={14} /></a>
          </div>
          <div className="pw-cats">
            {CATEGORIES.map((c) => (
              <a key={c.label} className="pw-cat">
                <span className="pw-cat-media"><Pic src={c.img} alt={c.label} /></span>
                <span className="pw-cat-foot"><b>{c.label}</b><ArrowUpRight size={14} /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="pw-quotes">
        <div className="pw-wrap pw-quotes-in">
          <div className="pw-quotes-copy">
            <h2>What Clients Say</h2>
            <p>Real stories from happy pet parents.</p>
            <div className="pw-arrows">
              <button type="button" aria-label="Previous review"><ChevronLeft size={16} /></button>
              <button type="button" aria-label="Next review"><ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="pw-quotes-grid">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="pw-quote">
                <header>
                  <span className="pw-avatar">{r.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                  <div><b>{r.name}</b><small>{r.tag} parent</small></div>
                </header>
                <blockquote>“{r.text}”</blockquote>
                <Stars />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="pw-sec">
        <div className="pw-wrap">
          <div className="pw-sec-head">
            <div>
              <h2>Latest from Our Blog</h2>
              <p>Tips, advice and stories for pet parents.</p>
            </div>
            <a className="pw-link">View All Articles <ArrowRight size={14} /></a>
          </div>
          <div className="pw-blog">
            {POSTS.map((p) => (
              <a key={p.title} className="pw-post">
                <span className="pw-post-media">
                  <Pic src={p.img} alt={p.title} />
                  <i>{p.cat}</i>
                </span>
                <b>{p.title}</b>
                <span className="pw-post-more">Read More <ArrowRight size={13} /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="pw-foot">
        <div className="pw-wrap pw-foot-grid">
          <div className="pw-foot-brand">
            <Logo light />
            <p>Compassionate veterinary care for the pets of Lahore — at home, at the hospital, and everywhere in between.</p>
          </div>
          <div className="pw-foot-col">
            <b>Quick Links</b>
            <a>Home</a><a>Services</a><a>Pet Mall</a><a>About</a><a>Pet Care</a><a>Contact</a>
          </div>
          <div className="pw-foot-col">
            <b>Services</b>
            {FOOT_SERVICES.map((s) => <a key={s}>{s}</a>)}
            <a className="pw-foot-more">More Services <ArrowRight size={12} /></a>
          </div>
          <div className="pw-foot-col">
            <b>Contact Us</b>
            <span className="pw-foot-line"><MapPin size={14} /> Al Kabir Town, Lahore</span>
            <span className="pw-foot-line"><Phone size={14} /> +92 307 8517122</span>
            <span className="pw-foot-line"><Mail size={14} /> contact@jawadvet.pk</span>
            <span className="pw-foot-line"><Clock size={14} /> Mon–Sun, 9:00 AM – 9:00 PM</span>
          </div>
          <div className="pw-foot-col">
            <b>Stay Connected</b>
            <div className="pw-social">
              <a aria-label="Instagram">IG</a>
              <a aria-label="Facebook">FB</a>
              <a aria-label="YouTube">YT</a>
            </div>
            <span className="pw-news">
              <input type="email" placeholder="Your email address" aria-label="Your email address" />
              <button type="button" aria-label="Subscribe"><ArrowRight size={14} /></button>
            </span>
          </div>
        </div>
        <span className="pw-foot-script" aria-hidden="true">Pets<br />Make Life<br />Better</span>
        <div className="pw-wrap pw-foot-bottom">
          <small>© 2026 Jawad Veterinary Hospital. All rights reserved.</small>
          <nav>
            <a>Privacy Policy</a><a>Terms of Service</a><a>Cancellation Policy</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export function PawWellGreen() { return <PawWell tone="green" />; }
export function PawWellIvory() { return <PawWell tone="ivory" />; }
export function PawWellSlate() { return <PawWell tone="slate" />; }
export function PawWellSage() { return <PawWell tone="sage" />; }
