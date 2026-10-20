import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check, ShieldCheck, Star, Truck } from "lucide-react";
import { Breadcrumbs, CheckList, Divider, Eyebrow, SectionHead, WhatsAppButton } from "@/components/ui";
import { ProductCard } from "@/components/cards";
import { AddToCart } from "@/components/add-to-cart";
import { ProductBuyPanel } from "@/components/product-buy-panel";
import { categoryName, business } from "@/lib/site";
import { money } from "@/lib/format";
import { catalogProducts, productBySlug } from "@/server/catalog";
import { pageMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await productBySlug(slug);
  if (!product) return { title: "Product not found" };
  return pageMetadata(product.name, product.description, `/shop/${product.slug}`, product.image);
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const [product, products] = await Promise.all([productBySlug(slug), catalogProducts()]);
  if (!product) notFound();
  const related = products.filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug).slice(0, 4);
  const off = product.compareAt && product.compareAt > product.price ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100) : 0;

  return (
    <>
      <section className="section-tight" style={{ paddingTop: 22 }}>
        <div className="container">
          <Breadcrumbs items={[{ label: "Pet Mall", href: "/shop" }, { label: categoryName(product.categorySlug) }, { label: product.name }]} />
          <div className="grid" style={{ gridTemplateColumns: "1.02fr 1fr", gap: 40, alignItems: "start" }}>
            <div>
              <div className="figure figure-square" style={{ borderRadius: 24, boxShadow: "var(--shadow)" }}>
                <Image src={product.image} alt={product.name} fill sizes="48vw" className="object-cover" priority unoptimized />
                {off ? <span className="product-badge product-badge-sale" style={{ top: 16, left: 16 }}>−{off}%</span> : null}
              </div>
              {product.stock > 0 ? (
                <p className="small" style={{ color: "var(--ok)", margin: "14px 0 0", fontWeight: 750 }}>
                  <Check size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {product.stock} in stock at Al Kabir Town — reserved for you at checkout
                </p>
              ) : (
                <p className="small" style={{ color: "var(--danger)", margin: "14px 0 0", fontWeight: 750 }}>Sold out for now — ask us about the next delivery.</p>
              )}
            </div>

            <div className="col" style={{ gap: 18 }}>
              <div>
                <Eyebrow>{product.brand} · {categoryName(product.categorySlug)}</Eyebrow>
                <h1 style={{ margin: "14px 0 10px", fontSize: "clamp(28px,3.4vw,42px)" }}>{product.name}</h1>
                <div className="row" style={{ gap: 14 }}>
                  <span className="stars">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill={i <= Math.round(product.rating) ? "var(--brass-2)" : "none"} strokeWidth={i <= Math.round(product.rating) ? 0 : 1.4} />)}
                    <b>{product.rating.toFixed(1)} · {product.reviews} reviews</b>
                  </span>
                  {product.badge ? <span className="pill pill-brass">{product.badge}</span> : null}
                </div>
              </div>
              <p className="lead" style={{ margin: 0, fontSize: 15.5 }}>{product.description}</p>
              <div className="card card-pad" style={{ background: "linear-gradient(150deg,#f8f4ec,#fffdfa)" }}>
                <div className="row-between" style={{ gap: 18 }}>
                  <span className="price"><small>Price in Pakistan Rupees</small><b style={{ fontSize: 32 }}>{money(product.price)}</b>{product.compareAt ? <s>{money(product.compareAt)}</s> : null}</span>
                  <span className="tiny muted" style={{ textAlign: "right", maxWidth: 190 }}>Inclusive of taxes where applicable. Invoice issued from the clinic.</span>
                </div>
                <Divider />
                <ProductBuyPanel product={product} />
                <div className="row" style={{ gap: 10, marginTop: 14 }}>
                  <AddToCart id={product.id} disabled={product.stock <= 0} label="Add to basket" />
                  <Link href="/checkout" className="button button-ghost button-sm">Go to checkout <ArrowRight size={14} /></Link>
                </div>
              </div>
              <CheckList items={product.highlights} />
              <div className="grid cols-2" style={{ gap: 12 }}>
                <span className="note"><Truck size={16} /> Same-day delivery inside Lahore for orders confirmed before 4 pm; {money(250)} otherwise free above {money(5000)}.</span>
                <span className="note note-brass"><ShieldCheck size={16} /> Prescription items are dispensed by the clinic and may need a veterinarian’s sign-off.</span>
              </div>
              <WhatsAppButton message={`Assalam-o-Alaikum, is “${product.name}” suitable for my pet?`} className="button button-ghost button-sm" label="Ask if this suits my pet" />
            </div>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="section band">
          <div className="container">
            <SectionHead eyebrow="Same shelf" title={<>Others in {categoryName(product.categorySlug).toLowerCase()}</>} action={<Link href="/shop" className="button button-ghost button-sm">All products <ArrowRight size={15} /></Link>} />
            <div className="product-grid" style={{ marginTop: 26 }}>
              {related.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-tight" style={{ paddingBottom: 46 }}>
        <div className="container">
          <div className="cta-band">
            <div className="cta-inner">
              <div>
                <Eyebrow tone="light">Feeding advice, included</Eyebrow>
                <h2 style={{ margin: "12px 0 8px", fontSize: "clamp(24px,3vw,36px)" }}>Buy the food, get the plan.</h2>
                <p>Every nutrition purchase comes with portion guidance from our team — and a follow-up weight check at the next visit is free for pets under two.</p>
              </div>
              <div className="cta-actions">
                <Link href="/book-vet-appointment-lahore?service=nutrition" className="button button-brass button-lg">Book a nutrition consult <ArrowRight size={16} /></Link>
                <Link href={`tel:${business.phone.replace(/\s/g, "")}`} className="button button-outline-light button-lg">Call the shop</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
