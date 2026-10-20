import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Check, Clock, MapPin, Star } from "lucide-react";
import { money } from "@/lib/format";
import { business } from "@/lib/site";
import { ServiceGlyph } from "@/components/icons";
import type { PostRow } from "@/lib/types";
import AddToCart from "@/components/add-to-cart";

export function ServiceCard({ service, href, cta = "Book this service" }: { service: { slug: string; title: string; summary: string; icon: string; price: number; duration: string; homeAvailable?: boolean }; href?: string; cta?: string }) {
  return (
    <article className="service-card">
      <div>
        <span className="service-icon"><ServiceGlyph icon={service.icon} /></span>
        <h3>{service.title}</h3>
        <p>{service.summary}</p>
      </div>
      <div>
        <div className="service-meta">
          <span className="price"><small>Professional fee from</small><b>{money(service.price)}</b></span>
          <span className="row" style={{ gap: 12, color: "var(--muted)", fontSize: 11.5, fontWeight: 700 }}>
            <span className="row" style={{ gap: 5 }}><Clock size={13} /> {service.duration}</span>
          </span>
        </div>
        <div className="service-actions" style={{ marginTop: 14 }}>
          <Link href={href ?? `/services/${service.slug}`} className="button button-ghost button-sm" style={{ flex: 1 }}>Details</Link>
          <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="button button-primary button-sm" style={{ flex: 1 }}>{cta} <ArrowRight size={14} /></Link>
        </div>
      </div>
    </article>
  );
}

export function ProductCard({ product, priority = false }: { product: { id: string; slug: string; name: string; brand: string; price: number; compareAt?: number; image: string; rating: number; reviews: number; badge?: string; categorySlug: string; stock: number }; priority?: boolean }) {
  const off = product.compareAt && product.compareAt > product.price ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100) : 0;
  return (
    <article className="product-card">
      <Link href={`/shop/${product.slug}`} className="product-media" aria-label={product.name}>
        {off > 0 ? <span className="product-badge product-badge-sale">−{off}%</span> : product.badge ? <span className="product-badge">{product.badge}</span> : null}
        <Image src={product.image} alt={product.name} fill sizes="(max-width:720px) 50vw,(max-width:1180px) 33vw,25vw" className="object-cover" priority={priority} unoptimized />
      </Link>
      <div className="product-body">
        <span className="product-cat">{product.brand}</span>
        <Link href={`/shop/${product.slug}`} className="product-name">{product.name}</Link>
        <span className="stars">
          <Star size={12} fill="currentColor" strokeWidth={0} /> {product.rating.toFixed(1)} <b>({product.reviews})</b>
        </span>
        <div className="product-foot">
          <span className="price">
            <b>{money(product.price)}</b>
            {product.compareAt && product.compareAt > product.price ? <s>{money(product.compareAt)}</s> : null}
          </span>
          <ProductActions product={product} />
        </div>
        {product.stock <= 0 ? <span className="tiny" style={{ color: "var(--danger)", fontWeight: 800 }}>Out of stock — ask us about the next delivery</span> : product.stock <= 6 ? <span className="tiny" style={{ color: "var(--warn)", fontWeight: 700 }}>Only {product.stock} left in store</span> : null}
      </div>
    </article>
  );
}

function ProductActions({ product }: { product: { id: string; slug: string; stock: number } }) {
  return (
    <div className="row" style={{ gap: 6 }}>
      <Link href={`/shop/${product.slug}`} className="icon-btn" aria-label="View product"><ArrowRight size={15} /></Link>
      <AddToCart id={product.id} disabled={product.stock <= 0} />
    </div>
  );
}

export function PostCard({ post, index = 0 }: { post: PostRow | { slug: string; title: string; excerpt: string; image: string; category: string; date: string; readTime: string }; index?: number }) {
  return (
    <article className="card card-hover" style={{ overflow: "hidden", display: "grid", gridTemplateRows: "auto 1fr" }}>
      <Link href={`/pet-care-tips/${post.slug}`} className="figure figure-wide" style={{ borderRadius: 0 }}>
        <Image src={post.image} alt={post.title} fill sizes="(max-width:900px) 100vw,33vw" className="object-cover" unoptimized />
        <span className="figure-ribbon">{post.category}</span>
      </Link>
      <div className="card-pad" style={{ display: "grid", gap: 10, alignContent: "start" }}>
        <div className="row" style={{ gap: 12, color: "var(--muted-2)", fontSize: 11.5, fontWeight: 700 }}>
          <span className="row" style={{ gap: 5 }}><Calendar size={13} /> {new Date(`${post.date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
        <h3 style={{ fontSize: 21 }}><Link href={`/pet-care-tips/${post.slug}`}>{post.title}</Link></h3>
        <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>{post.excerpt}</p>
        <Link href={`/pet-care-tips/${post.slug}`} className="link-arrow" style={{ marginTop: 4 }}>Read the guide <ArrowRight size={14} /></Link>
      </div>
    </article>
  );
}

export function TeamCard({ member }: { member: { slug: string; name: string; role: string; credentials: string; image: string; focus: string[]; years: number } }) {
  return (
    <article className="card card-hover" style={{ overflow: "hidden" }}>
      <div className="figure figure-ratio">
        <Image src={member.image} alt={member.name} fill sizes="(max-width:900px) 100vw,33vw" className="object-cover" unoptimized />
        <span className="figure-ribbon">{member.years}+ yrs</span>
      </div>
      <div className="card-pad" style={{ display: "grid", gap: 10 }}>
        <div>
          <h3 style={{ fontSize: 21 }}>{member.name}</h3>
          <p className="muted" style={{ margin: "5px 0 0", fontSize: 13 }}>{member.role} · {member.credentials}</p>
        </div>
        <div className="row" style={{ gap: 7 }}>
          {member.focus.map((f) => <span key={f} className="pill pill-soft" style={{ textTransform: "none", letterSpacing: 0, fontWeight: 650, fontSize: 11 }}>{f}</span>)}
        </div>
        <Link href={`/team#${member.slug}`} className="link-arrow">Profile <ArrowRight size={14} /></Link>
      </div>
    </article>
  );
}

export function AdoptionCard({ pet }: { pet: { id: string; name: string; species: string; breed: string; age: string; sex: string; status: string; image: string; story: string; vaccinated: boolean; dewormed: boolean; traits: string[] } }) {
  return (
    <article className="card card-hover" style={{ overflow: "hidden" }}>
      <div className="figure figure-tall">
        <Image src={pet.image} alt={pet.name} fill sizes="(max-width:900px) 100vw,33vw" className="object-cover" unoptimized />
        <span className={`figure-ribbon${pet.status === "adopted" ? "" : ""}`}>{pet.status === "available" ? "Looking for a home" : pet.status === "reserved" ? "Reserved" : "Adopted"}</span>
      </div>
      <div className="card-pad" style={{ display: "grid", gap: 11 }}>
        <div className="row-between" style={{ gap: 10 }}>
          <h3 style={{ fontSize: 22 }}>{pet.name}</h3>
          <span className="row" style={{ gap: 6, fontSize: 11.5, color: "var(--muted)", fontWeight: 700 }}>
            {pet.vaccinated ? <span className="row" style={{ gap: 4, color: "var(--ok)" }}><Check size={12} /> Vaccinated</span> : null}
          </span>
        </div>
        <p className="muted small" style={{ margin: 0 }}>{pet.species} · {pet.breed} · {pet.age} · {pet.sex}</p>
        <p className="small" style={{ margin: 0, color: "var(--ink-2)" }}>{pet.story.length > 150 ? `${pet.story.slice(0, 150)}…` : pet.story}</p>
        <Link href={`/adopt/${pet.id}`} className="button button-ghost button-sm">Meet {pet.name} <ArrowRight size={14} /></Link>
      </div>
    </article>
  );
}

export function ReviewCard({ review }: { review: { name: string; area: string; text: string; service: string; rating: number } }) {
  return (
    <article className="quote">
      <span className="quote-mark">“</span>
      <p>{review.text}</p>
      <div className="quote-foot">
        <span className="avatar">{review.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
        <div>
          <b>{review.name}</b>
          <small>{review.area} · {review.service}</small>
        </div>
        <span className="spacer" />
        <span className="stars">{[1, 2, 3, 4, 5].slice(0, review.rating).map((i) => <Star key={i} size={12} fill="currentColor" strokeWidth={0} />)}</span>
      </div>
    </article>
  );
}

export function EventCard({ event, index }: { event: { id: string; title: string; date: string; place: string; detail: string; cta: string }; index: number }) {
  const d = new Date(`${event.date}T00:00:00`);
  return (
    <article className="card card-hover card-pad" style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ textAlign: "center", borderRadius: 14, background: "var(--brand-tint)", color: "var(--brand)", padding: "10px 6px", gridColumn: index % 2 ? "2" : "1" }}>
        <div style={{ fontFamily: "var(--serif)", fontSize: 26, lineHeight: 1, letterSpacing: "-0.04em" }}>{d.getDate()}</div>
        <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>{d.toLocaleDateString("en-GB", { month: "short" })}</div>
      </div>
      <div className="col" style={{ gap: 8 }}>
        <h3 style={{ fontSize: 19 }}>{event.title}</h3>
        <p className="muted small" style={{ margin: 0 }}>{event.detail}</p>
        <span className="row" style={{ gap: 12, fontSize: 11.5, color: "var(--muted)", fontWeight: 700 }}>
          <span className="row" style={{ gap: 5 }}><MapPin size={13} /> {event.place}</span>
        </span>
      </div>
    </article>
  );
}

export function TrustStrip({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="stat-strip">
      {items.map((item) => (
        <div key={item.label} className="stat">
          <b>{item.value}</b>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ClinicBadge() {
  return (
    <div className="row" style={{ gap: 10, fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>
      <span className="pill pill-brass">{business.monogram}</span>
      <span>Serving Lahore since {business.established}</span>
    </div>
  );
}
