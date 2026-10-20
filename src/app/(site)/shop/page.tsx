import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Sparkles, Star, Truck } from "lucide-react";
import { ShopBrowser } from "@/components/shop-browser";
import { business, fees } from "@/lib/site";
import { money } from "@/lib/format";
import { catalogCategories, catalogProducts } from "@/server/catalog";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Pet Mall — dog & cat food, grooming and essentials in Lahore",
  "Vet-selected pet food, therapeutic diets, skin care, enrichment and travel gear, stocked at Al Kabir Town with same-day delivery across Lahore.",
  "/shop",
  "/images/pet-shop.jpg",
);

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const [{ category, q }, products, categories] = await Promise.all([searchParams, catalogProducts(), catalogCategories()]);
  const brands = [...new Set(products.map((p) => p.brand))].sort();
  const trending = (products.filter((p) => p.featured).length ? products.filter((p) => p.featured) : products).slice(0, 4);
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "Pet care";

  return (
    <>
      <section className="v-section" style={{ paddingBottom: 0 }}>
        <div className="v-wrap">
          <span className="v-eyebrow">The pet mall</span>
          <h1 style={{ margin: "14px 0 12px", maxWidth: 760 }}>Everything Your Pet Will Love</h1>
          <p className="lead" style={{ maxWidth: 700 }}>
            Food, toys, care essentials and everyday favourites — the same shortlist we send people home with after a
            consult. Batch and expiry on every pack, and honest advice when you do not need to buy anything today.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
            <span className="v-eyebrow"><Truck size={13} /> Free Lahore delivery above {money(fees.freeDeliveryOver)}</span>
            <span className="v-eyebrow"><Sparkles size={13} /> {money(fees.deliveryLahore)} otherwise</span>
            <span className="v-eyebrow">Cash on delivery</span>
          </div>
        </div>
      </section>

      <section className="v-section" style={{ paddingBottom: 0 }}>
        <div className="v-wrap">
          <h2 style={{ fontSize: 24, marginBottom: 16 }}>Browse Categories</h2>
          <div className="v-grid v-cols-4">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                className="v-card v-card-hover"
                style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, borderColor: category === c.slug ? "var(--v-brand)" : undefined }}
              >
                <span style={{ display: "grid", gap: 2 }}>
                  <b style={{ fontSize: 13.5, fontWeight: 800, color: "var(--v-ink)" }}>{c.name}</b>
                  <small style={{ fontSize: 10.5, color: "var(--v-muted)", fontWeight: 700 }}>{c.count} product{c.count === 1 ? "" : "s"}</small>
                </span>
                <ArrowRight size={15} style={{ color: "var(--v-brass)" }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {trending.length ? (
        <section className="v-section">
          <div className="v-wrap">
            <div className="v-head-row">
              <h2 style={{ fontSize: 26, margin: 0 }}>Trending Now</h2>
              <Link href="/shop" className="button button-ghost button-sm">View all <ArrowRight size={14} /></Link>
            </div>
            <div className="v-grid v-cols-4">
              {trending.map((product) => {
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
          </div>
        </section>
      ) : null}

      <section className="v-section" style={{ paddingTop: 0 }}>
        <div className="v-wrap">
          <div className="v-head-row">
            <div>
              <h2 style={{ fontSize: 26, margin: 0 }}>All Products</h2>
              <p style={{ margin: "6px 0 0", color: "var(--v-muted)", fontSize: 13.5 }}>Search, filter and add to basket — delivered across Lahore.</p>
            </div>
            <span className="small muted">{products.length} products · {brands.length} brands</span>
          </div>
          <ShopBrowser products={products} categories={categories} initialCategory={category} initialQuery={q} brands={brands} />
        </div>
      </section>

      <section className="v-section" style={{ paddingTop: 0 }}>
        <div className="v-wrap">
          <div className="v-grid v-cols-4">
            {[
              { t: "Vet-approved only", d: `Chosen by ${business.shortName}'s own veterinarians.` },
              { t: "Same-day in Lahore", d: "Ordered before 4 pm, delivered the same evening." },
              { t: "Ask before you buy", d: "Send us the label on WhatsApp and we will tell you if it suits your pet." },
              { t: "Add to any visit", d: "Prescribed items can be handed over at the appointment." },
            ].map((item) => (
              <div key={item.t} className="v-card" style={{ padding: 16, display: "grid", gap: 4 }}>
                <b style={{ fontSize: 13.5, color: "var(--v-ink)" }}>{item.t}</b>
                <span style={{ fontSize: 12, color: "var(--v-muted)", lineHeight: 1.55 }}>{item.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
