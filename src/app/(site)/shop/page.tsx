import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { Breadcrumbs, Eyebrow, SectionHead } from "@/components/ui";
import { ProductCard } from "@/components/cards";
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
  const trending = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <section className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: "Pet Mall" }]} />
          <div className="split">
            <div>
              <Eyebrow>Stocked by the clinic</Eyebrow>
              <h1 style={{ margin: "16px 0 18px", fontSize: "clamp(34px,4.8vw,58px)" }}>
                Everything your pet will <em>actually use.</em></h1>
              <p className="lead">
                Food, therapeutic diets, skin ranges, enrichment and travel gear — the same shortlist we send people home with after a
                consult. Batch and expiry on every pack, and honest advice when you do not need to buy anything today.
              </p>
              <div className="row" style={{ gap: 10, marginTop: 22 }}>
                <span className="pill pill-ok"><Truck size={13} /> Free Lahore delivery above {money(fees.freeDeliveryOver)}</span>
                <span className="pill pill-soft">{money(fees.deliveryLahore)} otherwise</span>
                <span className="pill pill-soft">Cash on delivery</span>
              </div>
            </div>
            <div className="figure figure-wide" style={{ boxShadow: "var(--shadow)" }}>
              <Image src="/images/pet-shop.jpg" alt="Pet store shelves stocked with food and care products" fill sizes="45vw" className="object-cover" priority unoptimized />
              <span className="figure-tag">{business.shortName} pet mall</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 26 }}>
        <div className="container">
          <div className="row" style={{ gap: 10 }}>
            {categories.map((c) => (
              <Link key={c.slug} href={`/shop?category=${c.slug}`} className="chip" data-active={category === c.slug ? "true" : undefined}>
                {c.name} <span className="tiny muted">{c.count}</span>
              </Link>
            ))}
            <span className="spacer" />
            <Link href="/cart" className="button button-ghost button-sm"><ShoppingBag size={15} /> Basket</Link>
          </div>
        </div>
      </section>

      {trending.length ? (
        <section className="section-tight" style={{ paddingTop: 34 }}>
          <div className="container">
            <SectionHead
              eyebrow="Trending this month"
              title={<>What Lahore is <em>buying right now.</em></>}
              action={<Link href="/shop" className="button button-ghost button-sm">View all <ArrowRight size={15} /></Link>}
            />
            <div className="product-grid" style={{ marginTop: 26 }}>
              {trending.map((product, i) => <ProductCard key={product.id} product={product} priority={i < 2} />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <ShopBrowser products={products} categories={categories} initialCategory={category} initialQuery={q} brands={brands} />
        </div>
      </section>

      <section className="section band">
        <div className="container">
          <div className="grid cols-4" style={{ gap: 14 }}>
            {[
              { icon: <Sparkles size={18} />, t: "Vet-approved only", d: "If we would not feed it to our own pets, it is not on the shelf." },
              { icon: <Truck size={18} />, t: "Same-day in Lahore", d: "Ordered before 4 pm, delivered the same evening." },
              { icon: <ArrowRight size={18} />, t: "Ask before you buy", d: "Send us the label on WhatsApp and we will tell you if it suits your pet." },
              { icon: <ShoppingBag size={18} />, t: "Add to any visit", d: "Prescribed items can be handed over at the appointment." },
            ].map((item) => (
              <div key={item.t} className="card card-pad" style={{ display: "grid", gap: 8 }}>
                <span className="service-icon" style={{ width: 36, height: 36, marginBottom: 0 }}>{item.icon}</span>
                <b style={{ fontSize: 14.5 }}>{item.t}</b>
                <span className="small muted">{item.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
