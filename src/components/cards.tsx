import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock, MapPin, Star } from "lucide-react";
import { pkrLabel } from "@/lib/format";
import { business } from "@/lib/site";
import { ServiceGlyph, WhatsAppIcon } from "@/components/icons";
import type { PostRow } from "@/lib/types";
import AddToCart from "@/components/add-to-cart";

export function ServiceCard({
  service, href,
}: {
  service: { slug: string; shortTitle?: string; title: string; summary: string; icon: string; duration: string };
  href?: string;
}) {
  return (
    <article className="r-svc2">
      <div className="r-svc2-top">
        <span className="r-svc2-icon"><ServiceGlyph icon={service.icon} size={20} /></span>
        <h3>{service.shortTitle ?? service.title}</h3>
      </div>
      <p>{service.summary}</p>
      <div className="r-svc2-foot">
        <span className="r-svc2-duration">
          <Clock size={12} /> Typical Duration: {service.duration}
        </span>
        <div className="r-svc2-actions">
          <Link href={href ?? `/services/${service.slug}`} className="r-svc2-more">
            Learn More <ArrowRight size={12} />
          </Link>
          <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="r-svc2-book">
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ProductCard({ product, priority = false, categoryName }: { product: { id: string; slug: string; name: string; brand: string; price: number; compareAt?: number; image: string; rating: number; reviews: number; badge?: string; categorySlug: string; stock: number }; priority?: boolean; categoryName?: string }) {
  const off = product.compareAt && product.compareAt > product.price ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100) : 0;
  return (
    <article className="r-prod">
      <Link href={`/shop/${product.slug}`} className="r-prod-media" aria-label={product.name}>
        {off > 0 ? <span className="r-prod-off">−{off}%</span> : null}
        <Image src={product.image} alt={product.name} fill sizes="(max-width:720px) 50vw,(max-width:1180px) 33vw,25vw" className="object-cover" priority={priority} unoptimized />
      </Link>
      <div className="r-prod-body">
        {categoryName ? <span className="r-prod-cat">{categoryName}</span> : null}
        <Link href={`/shop/${product.slug}`} className="r-prod-name">{product.name}</Link>
        <div className="r-prod-foot">
          <span className="r-prod-price">
            <b>{pkrLabel(product.price)}</b>
            {off > 0 ? <s>{pkrLabel(product.compareAt!)}</s> : null}
          </span>
          <AddToCart id={product.id} disabled={product.stock <= 0} label="" className="r-prod-cart" />
        </div>
      </div>
    </article>
  );
}

export function PostCard({ post }: { post: PostRow | { slug: string; title: string; excerpt: string; image: string; category: string; date: string; readTime: string }; index?: number }) {
  return (
    <article className="r-post">
      <Link href={`/pet-care-tips/${post.slug}`} className="r-post-media" aria-label={post.title}>
        <Image src={post.image} alt={post.title} fill sizes="(max-width:900px) 100vw,33vw" className="object-cover" unoptimized />
      </Link>
      <div className="r-post-body">
        <span className="r-post-cat">{post.category}</span>
        <Link href={`/pet-care-tips/${post.slug}`} className="r-post-title">{post.title}</Link>
        <div className="r-post-foot">
          <span className="r-post-date">
            {new Date(`${post.date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          <Link href={`/pet-care-tips/${post.slug}`} className="r-post-go" aria-label={post.title}>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function TeamCard({ member }: { member: { slug: string; name: string; role: string; credentials: string; image: string; focus: string[]; years: number } }) {
  return (
    <article id={member.slug} className="r-member">
      <div className="r-member-media">
        <Image src={member.image} alt={member.name} fill sizes="(max-width:900px) 100vw,33vw" className="object-cover" unoptimized />
        <span className="r-member-years">{member.years}+ yrs</span>
      </div>
      <div className="r-member-body">
        <span className="r-member-role">{member.role}</span>
        <h3>{member.name}</h3>
        <span className="r-member-meta">{member.credentials}</span>
        <div className="r-member-tags">
          {member.focus.map((f) => <span key={f} className="r-chip r-chip-teal" style={{ fontSize: 9.5 }}>{f}</span>)}
        </div>
        <Link href={`/team#${member.slug}`} className="r-link">Profile <ArrowRight size={13} /></Link>
      </div>
    </article>
  );
}

export function AdoptionCard({ pet }: { pet: { id: string; name: string; species: string; breed: string; age: string; sex: string; status: string; image: string; story: string; vaccinated: boolean; dewormed: boolean; traits: string[] } }) {
  return (
    <article className="r-adopt">
      <Link href={`/adopt/${pet.id}`} className="r-adopt-media" aria-label={`Meet ${pet.name}`}>
        <Image src={pet.image} alt={pet.name} fill sizes="(max-width:900px) 45vw,25vw" className="object-cover" unoptimized />
        <span className="r-adopt-flags">
          {pet.vaccinated ? <span className="r-badge r-badge-green">Vaccinated</span> : null}
          <span className="r-adopt-sex">{pet.sex}</span>
          {pet.status === "reserved" ? <span className="r-badge">Reserved</span> : null}
        </span>
      </Link>
      <div className="r-adopt-body">
        <Link href={`/adopt/${pet.id}`} className="r-adopt-name">{pet.name}</Link>
        <span className="r-adopt-meta">{pet.breed.toLowerCase()} · {pet.age}</span>
        <a
          className="r-adopt-wa"
          href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(`Assalam-o-Alaikum, I am interested in adopting ${pet.name}.`)}`}
          target="_blank" rel="noopener noreferrer"
        >
          <WhatsAppIcon size={13} /> WhatsApp
        </a>
      </div>
    </article>
  );
}

export function ReviewCard({ review }: { review: { name: string; area: string; text: string; service: string; rating: number } }) {
  return (
    <article className="r-review">
      <div className="r-review-top">
        <span className="r-review-avatar" style={{ background: "var(--r-teal-2)" }}>
          {review.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
        </span>
        <span>
          <span className="r-review-name">{review.name}</span>
          <span className="r-review-time">{review.area} · {review.service}</span>
        </span>
      </div>
      <div className="r-review-stars">
        {[1, 2, 3, 4, 5].slice(0, review.rating).map((n) => <Star key={n} size={12} fill="currentColor" strokeWidth={0} />)}
      </div>
      <p>{review.text}</p>
    </article>
  );
}

export function EventCard({ event }: { event: { id: string; title: string; date: string; place: string; detail: string; cta: string }; index?: number }) {
  const d = new Date(`${event.date}T00:00:00`);
  return (
    <article className="r-flow-item" style={{ alignItems: "start" }}>
      <span className="r-flow-n" style={{ display: "grid", textAlign: "center", lineHeight: 1 }}>
        <span>
          <span style={{ display: "block", fontSize: 16 }}>{d.getDate()}</span>
          <span style={{ display: "block", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 800 }}>{d.toLocaleDateString("en-GB", { month: "short" })}</span>
        </span>
      </span>
      <div>
        <b>{event.title}</b>
        <p>{event.detail}</p>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, fontSize: 10.5, fontWeight: 700, color: "var(--r-muted)" }}>
          <MapPin size={12} /> {event.place}
        </span>
      </div>
    </article>
  );
}

export function TrustStrip({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="r-stats" style={{ boxShadow: "var(--r-card-shadow)" }}>
      {items.map((item) => (
        <div key={item.label} className="r-stat">
          <b>{item.value}</b>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ClinicBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--r-muted)", fontWeight: 700 }}>
      <span className="r-chip r-chip-teal">{business.monogram}</span>
      <span>Serving Lahore since {business.established}</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--r-green)" }}><Check size={12} /> RVMP registered</span>
    </div>
  );
}
