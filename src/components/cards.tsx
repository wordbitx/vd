import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock3, HeartPulse, MapPin, MessageCircle, Microscope, Scissors, Smile, Soup, Sparkles, Stethoscope, Syringe, type LucideIcon } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductImage } from "@/components/product-image";
import { bookingServiceBySlug } from "@/lib/catalog";
import { pkr } from "@/lib/format";
import { categories, whatsappUrl, type Service, type ServiceIcon } from "@/lib/site";
import { discountPercent, sellingPrice, type Adoption, type StoreProduct } from "@/lib/types";
import type { CartSnapshot } from "@/components/cart-context";

const iconMap: Record<ServiceIcon, LucideIcon> = {
  stethoscope: Stethoscope, syringe: Syringe, scissors: Scissors, microscope: Microscope,
  sparkles: Sparkles, heartPulse: HeartPulse, smile: Smile, bowl: Soup,
};

export function ServiceIconView({ name, size = 23 }: { name: ServiceIcon; size?: number }) {
  const Icon = iconMap[name];
  return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />;
}

export function ServiceCard({ service, image = false, bookable = true }: { service: Service; image?: boolean; bookable?: boolean }) {
  const meta = bookingServiceBySlug(service.slug);
  return (
    <article className={`service-card ${image ? "service-card-photo" : ""}`}>
      {image && (
        <Link href={`/services/${service.slug}`} className="service-card-image" aria-label={`Explore ${service.title}`}>
          <Image src={service.image} alt={`Illustrative image for ${service.title}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
        </Link>
      )}
      <div className="service-card-body">
        <span className="service-icon"><ServiceIconView name={service.icon} size={21} /></span>
        <h3><Link href={`/services/${service.slug}`}>{service.title}</Link></h3>
        <p>{service.summary}</p>
        {meta && (
          <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 800, color: "#7c5f26", minHeight: 0, marginBottom: 12 }}>
            <Clock3 size={13} /> {meta.duration}{meta.feeFrom > 0 ? ` · from ${pkr(meta.feeFrom)}` : ""}
          </p>
        )}
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <Link href={`/services/${service.slug}`} className="text-link">Learn more <ArrowUpRight size={15} /></Link>
          {bookable && meta && (
            <Link href={`/book?service=${service.slug}`} className="text-link" style={{ color: "#0a2540" }}><CalendarDays size={14} /> Book now</Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function toCartSnapshot(product: StoreProduct): CartSnapshot {
  return {
    id: product.id, slug: product.slug, name: product.name, unit: product.unit,
    price: sellingPrice(product), imageKind: product.imageKind, imageUrl: product.imageUrl,
    categorySlug: product.categorySlug,
  };
}

export function ProductCard({ product }: { product: StoreProduct }) {
  const category = categories.find((item) => item.slug === product.categorySlug);
  const discount = discountPercent(product);
  const out = product.stock <= 0;
  return (
    <article className="product-card">
      <Link href={`/shop/${product.slug}`} className="product-card-photo" aria-label={`View ${product.name} details`}>
        <ProductImage product={product} />
        {discount > 0 && <span className="sale-badge">-{discount}%</span>}
        {out && <span className="product-demo-tag" style={{ background: "#b3261e", color: "#fff" }}>OUT OF STOCK</span>}
      </Link>
      <div className="product-card-info">
        <span className="product-category">{category?.shortName ?? "Pet essentials"}{product.unit ? ` · ${product.unit}` : ""}</span>
        <h3><Link href={`/shop/${product.slug}`}>{product.name}</Link></h3>
        <p className="product-price">
          <span className="price-now">{pkr(sellingPrice(product))}</span>
          {discount > 0 && <span className="price-was">{pkr(product.price)}</span>}
        </p>
        <div className="product-card-bottom">
          <Link href={`/shop/${product.slug}`} className="text-link">Details <ArrowRight size={15} /></Link>
          <AddToCartButton product={toCartSnapshot(product)} compact disabled={out} />
        </div>
      </div>
    </article>
  );
}

export function AdoptCard({ pet }: { pet: Adoption }) {
  const whatsapp = `https://wa.me/${pet.contactPhone}?text=${encodeURIComponent(`Hello, I saw ${pet.name} (${pet.breed || pet.species}) on Jawad Veterinary Hospital's adoption board and I would love to adopt. Could you please share more details?`)}`;
  return (
    <article className="adopt-card">
      <Link href={`/adopt/${pet.id}`} className="adopt-photo" aria-label={`Meet ${pet.name}`}>
        <Image src={pet.image} alt={`${pet.name}, a ${pet.breed || pet.species} looking for a home`} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" />
        <span className="adopt-badges">
          {pet.vaccinated && <span className="badge-vax">Vaccinated</span>}
          <span>{pet.gender}</span>
        </span>
      </Link>
      <div className="adopt-body">
        <h3><Link href={`/adopt/${pet.id}`}>{pet.name}</Link></h3>
        <p className="adopt-meta"><b>{pet.breed || pet.species}</b> · {pet.ageGroup}{pet.ageText ? ` · ${pet.ageText}` : ""}</p>
        <p>{pet.description}</p>
        <p className="adopt-meta" style={{ display: "flex", alignItems: "center", gap: 5 }}><MapPin size={12} /> {pet.area}, Lahore</p>
        <div className="adopt-actions">
          <Link href={`/adopt/${pet.id}`} className="button button-outline">Meet {pet.name}</Link>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="button button-whatsapp"><MessageCircle size={16} /> WhatsApp</a>
        </div>
      </div>
    </article>
  );
}

export function whatsappPetUrl(pet: Adoption): string {
  return whatsappUrl(`Hello Jawad Veterinary Hospital, I am interested in adopting ${pet.name} (${pet.breed || pet.species}, ${pet.ageText || pet.ageGroup}) listed on your adoption board.`);
}
