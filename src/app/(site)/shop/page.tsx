import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, PawPrint, ShoppingBag, Sparkles, Star, Truck } from "lucide-react";
import { ShopBrowser } from "@/components/shop-browser";
import { business, fees } from "@/lib/site";
import { pkrLabel } from "@/lib/format";
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
      <section className="r-pagehero">
        <div className="r-wrap">
          <div className="r-crumbs">
            <Link href="/">Home</Link><span className="sep">/</span><span>Pet Mall</span>
          </div>
          <div className="r-pagehero-inner">
            <div>
              <span className="label"><ShoppingBag size={14} /> Shop essentials</span>
              <h1>Everything Your Pet Will Love</h1>
              <p>
                Food, toys, care essentials and everyday favourites — the same shortlist we send people home with after a
                consult. Batch and expiry on every pack, and honest advice when you do not need to buy anything today.
              </p>
              <div className="r-pagehero-chips">
                <span className="r-chip r-chip-teal"><Truck size={12} /> Free Lahore delivery above {pkrLabel(fees.freeDeliveryOver)}</span>
                <span className="r-chip r-chip-teal"><Sparkles size={12} /> {pkrLabel(fees.deliveryLahore)} otherwise</span>
                <span className="r-chip r-chip-teal"><PawPrint size={12} /> Cash on delivery</span>
              </div>
            </div>
            <div className="r-pagehero-media" style={{ aspectRatio: "4 / 3.2" }}>
              <Image src="/images/pet-shop.jpg" alt="Pet store shelves stocked with food and care products" fill sizes="(max-width:900px) 92vw, 42vw" className="object-cover" priority unoptimized />
              <span className="r-media-tag">{business.shortName} pet mall · Al Kabir Town</span>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 24 }}>
        <div className="r-wrap">
          <div className="r-rulehead"><h2>Browse categories</h2></div>
          <div className="r-tiles r-tiles-4">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                className="r-tile"
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderColor: category === c.slug ? "var(--r-teal-2)" : undefined }}
              >
                <span style={{ display: "grid", gap: 2 }}>
                  <b style={{ fontSize: 13.5 }}>{c.name}</b>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--r-muted)" }}>{c.count} product{c.count === 1 ? "" : "s"}</span>
                </span>
                <ArrowRight size={15} style={{ color: "var(--r-gold)" }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {trending.length ? (
        <section className="r-section" style={{ paddingTop: 0 }}>
          <div className="r-wrap">
            <div className="r-head-row">
              <div>
                <h2 style={{ margin: 0, fontSize: 26 }}>Trending now</h2>
                <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "var(--r-muted)" }}>What Lahore is buying this week</p>
              </div>
              <Link href="/shop" className="r-btn r-btn-outline r-btn-sm">View all <ArrowRight size={14} /></Link>
            </div>
            <div className="r-products">
              {trending.map((product) => {
                const off = product.compareAt && product.compareAt > product.price ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100) : 0;
                return (
                  <article key={product.id} className="r-prod">
                    <Link href={`/shop/${product.slug}`} className="r-prod-media" aria-label={product.name}>
                      {off > 0 ? <span className="r-prod-off">−{off}%</span> : null}
                      <Image src={product.image} alt={product.name} fill sizes="(max-width:900px) 45vw, 22vw" className="object-cover" unoptimized />
                    </Link>
                    <div className="r-prod-body">
                      <span className="r-prod-cat">{categoryName(product.categorySlug)}</span>
                      <Link href={`/shop/${product.slug}`} className="r-prod-name">{product.name}</Link>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, color: "#8b9aa0" }}>
                        <Star size={11} fill="currentColor" strokeWidth={0} style={{ color: "var(--r-orange)" }} /> {product.rating.toFixed(1)}
                        <span style={{ fontWeight: 500 }}>({product.reviews})</span>
                      </span>
                      <div className="r-prod-foot">
                        <span className="r-prod-price">
                          <b>{pkrLabel(product.price)}</b>
                          {off > 0 ? <s>{pkrLabel(product.compareAt!)}</s> : null}
                        </span>
                        <Link href={`/shop/${product.slug}`} className="r-prod-cart" aria-label={`Buy ${product.name}`}>
                          <ShoppingBag size={15} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-head-row" style={{ marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 26 }}>All products</h2>
              <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "var(--r-muted)" }}>
                {products.length} products · {brands.length} brands · delivered across Lahore
              </p>
            </div>
          </div>
          <ShopBrowser products={products} categories={categories} initialCategory={category} initialQuery={q} brands={brands} />
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-tiles r-tiles-4">
            {[
              { icon: <PawPrint size={17} />, t: "Vet-approved only", d: `Chosen by ${business.shortName}'s own veterinarians.` },
              { icon: <Truck size={17} />, t: "Same-day in Lahore", d: "Ordered before 4 pm, delivered the same evening." },
              { icon: <Sparkles size={17} />, t: "Ask before you buy", d: "Send us the label on WhatsApp and we will tell you if it suits your pet." },
              { icon: <ShoppingBag size={17} />, t: "Add to any visit", d: "Prescribed items can be handed over at the appointment." },
            ].map((item) => (
              <div key={item.t} className="r-tile">
                <span className="r-tile-icon">{item.icon}</span>
                <b>{item.t}</b>
                <span>{item.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
