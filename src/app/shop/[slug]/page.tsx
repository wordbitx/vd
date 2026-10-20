import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck, Check, ChevronRight, Truck } from "lucide-react";
import { ProductCard } from "@/components/cards";
import { ProductImage } from "@/components/product-image";
import { ProductDetailActions } from "@/components/product-detail-actions";
import { pkr } from "@/lib/format";
import { getProductBySlug, getSettings, listProducts } from "@/lib/hospital-db";
import { categories } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import { discountPercent, sellingPrice } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return product
    ? pageMetadata(`Buy ${product.name} Online in Pakistan`, `${product.name} (${product.unit}) — ${pkr(sellingPrice(product))} at the Jawad Pet Mall, Lahore. Lahore delivery with cash on delivery.`, `/shop/${slug}`, "/images/pet-shop.jpg")
    : {};
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || !product.active) notFound();
  const settings = getSettings();
  const category = categories.find((item) => item.slug === product.categorySlug);
  const all = listProducts(true);
  const related = all.filter((item) => item.id !== product.id && item.categorySlug === product.categorySlug)
    .concat(all.filter((item) => item.id !== product.id && item.categorySlug !== product.categorySlug))
    .slice(0, 4);
  const discount = discountPercent(product);
  const stockLabel = product.stock <= 0
    ? <span className="stock-note out">Out of stock</span>
    : product.stock <= 5
      ? <span className="stock-note low">Only {product.stock} left — order soon</span>
      : <span className="stock-note in">In stock · ready to deliver</span>;

  return (
    <main id="main-content">
      <div className="container breadcrumbs">
        <Link href="/">Home</Link><ChevronRight size={13} />
        <Link href="/shop">Pet Mall</Link><ChevronRight size={13} />
        {category && <><Link href={`/shop?category=${category.slug}`}>{category.name}</Link><ChevronRight size={13} /></>}
        <span>{product.name}</span>
      </div>
      <section className="product-detail-section">
        <div className="container product-detail-grid">
          <div className="product-detail-visual">
            <ProductImage product={product} />
            {discount > 0 && <span className="sale-badge">SAVE {discount}%</span>}
          </div>
          <div className="product-detail-copy">
            <span className="eyebrow"><span className="eyebrow-line" /> {category?.name ?? "PET ESSENTIALS"}</span>
            <h1>{product.name}</h1>
            <div className="price-detail">
              <span className="price-now">{pkr(sellingPrice(product))}</span>
              {discount > 0 && <><span className="price-was">{pkr(product.price)}</span><span className="price-save">You save {pkr(product.price - sellingPrice(product))}</span></>}
            </div>
            <p style={{ margin: "2px 0 10px" }}>{stockLabel}{product.unit ? <span style={{ color: "#93a0a8", fontSize: 11, fontWeight: 700 }}> · {product.unit}</span> : null}</p>
            <p className="product-detail-description">{product.description}</p>
            <ProductDetailActions product={product} />
            <div className="shop-trust-cards">
              <div>
                <Truck size={21} />
                <h3>Lahore-Wide Delivery</h3>
                <p>Fast, careful delivery across Lahore — {pkr(settings.deliveryFee)} flat, free above {pkr(settings.freeDeliveryAbove)}. Nationwide on request.</p>
              </div>
              <div>
                <BadgeCheck size={21} />
                <h3>Vet-Approved Quality</h3>
                <p>Every Jawad Pet Mall product is selected and approved by our hospital team for your pet&apos;s safety.</p>
              </div>
            </div>
            <div className="product-highlights">
              <h2>Product details</h2>
              <ul>{product.highlights.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul>
            </div>
            <Link href="/shop" className="back-link"><ArrowLeft size={16} /> Back to all products</Link>
          </div>
        </div>
      </section>
      <section className="related-section">
        <div className="container">
          <div className="section-header compact">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> YOU MAY ALSO LIKE</span>
              <h2>More for their everyday.</h2>
            </div>
            <Link href="/shop" className="text-link">All products <ArrowRight size={16} /></Link>
          </div>
          <div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </div>
      </section>
    </main>
  );
}
