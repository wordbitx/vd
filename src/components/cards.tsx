import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, HeartPulse, Microscope, Scissors, Smile, Soup, Sparkles, Stethoscope, Syringe, type LucideIcon } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductImage } from "@/components/product-image";
import { categories, type Product, type Service, type ServiceIcon } from "@/lib/site";

const iconMap: Record<ServiceIcon, LucideIcon> = {
  stethoscope: Stethoscope, syringe: Syringe, scissors: Scissors, microscope: Microscope,
  sparkles: Sparkles, heartPulse: HeartPulse, smile: Smile, bowl: Soup,
};

export function ServiceIconView({ name, size = 23 }: { name: ServiceIcon; size?: number }) {
  const Icon = iconMap[name];
  return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />;
}

export function ServiceCard({ service, image = false }: { service: Service; image?: boolean }) {
  return (
    <article className={`service-card ${image ? "service-card-photo" : ""}`}>
      {image && <Link href={`/services/${service.slug}`} className="service-card-image" aria-label={`Explore ${service.title}`}>
        <Image src={service.image} alt={`Illustrative image for ${service.title}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
      </Link>}
      <div className="service-card-body">
        <span className="service-icon"><ServiceIconView name={service.icon} size={21} /></span>
        <h3><Link href={`/services/${service.slug}`}>{service.title}</Link></h3>
        <p>{service.summary}</p>
        <Link href={`/services/${service.slug}`} className="text-link">Learn more <ArrowUpRight size={15} /></Link>
      </div>
    </article>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const category = categories.find((item) => item.slug === product.categorySlug);
  return (
    <article className="product-card">
      <Link href={`/shop/${product.slug}`} className="product-card-photo" aria-label={`View ${product.name} details`}>
        <ProductImage product={product} />
        <span className="product-demo-tag">DEMO PRODUCT</span>
      </Link>
      <div className="product-card-info">
        <span className="product-category">{category?.shortName ?? "Pet essentials"}</span>
        <h3><Link href={`/shop/${product.slug}`}>{product.name}</Link></h3>
        <p className="product-price">Price on enquiry</p>
        <div className="product-card-bottom">
          <Link href={`/shop/${product.slug}`} className="text-link">View details <ArrowRight size={15} /></Link>
          <AddToCartButton productId={product.id} compact />
        </div>
      </div>
    </article>
  );
}
