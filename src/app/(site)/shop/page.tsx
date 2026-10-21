import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/cards";
import { CategoryArt } from "@/components/category-art";
import { catalogCategories, catalogProducts } from "@/server/catalog";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Pet Mall — buy pet food, toys and care essentials in Lahore",
  "Everything your pet will love: food, toys and care essentials, hand-picked by the veterinarians at Jawad Veterinary Hospital and delivered across Lahore.",
  "/shop",
  "/images/pet-shop.jpg",
);

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [{ category }, products, categories] = await Promise.all([searchParams, catalogProducts(), catalogCategories()]);
  const active = categories.find((c) => c.slug === category) ?? null;
  const list = active ? products.filter((p) => p.categorySlug === active.slug) : products;
  const nameOf = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "Pet care";

  return (
    <>
      <section className="r-pagehero">
        <div className="r-wrap">
          <div className="r-pagehero-inner r-pagehero-single">
            <div>
              <h1>Everything Your Pet Will Love</h1>
              <p>Food, toys, care essentials and everyday favourites.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section r-section-tight" style={{ paddingTop: 14 }}>
        <div className="r-wrap">
          <h2 className="r-sec-title">Browse Categories</h2>
          <div className="r-cats">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={c.slug === active?.slug ? "/shop" : `/shop?category=${c.slug}`}
                className="r-cat"
                data-active={c.slug === active?.slug ? "true" : undefined}
              >
                <span className="r-cat-art"><CategoryArt slug={c.slug} /></span>
                <span className="r-cat-name">{c.name}</span>
                <span className="r-cat-go"><ChevronRight size={13} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 34 }}>
        <div className="r-wrap">
          <div className="r-head-row" style={{ marginBottom: 20 }}>
            <h2 className="r-sec-title" style={{ margin: 0 }}>{active ? active.name : "Trending Now"}</h2>
            {active ? (
              <Link href="/shop" className="r-link">
                Show everything <ArrowRight size={13} />
              </Link>
            ) : null}
          </div>
          {list.length ? (
            <div className="r-products">
              {list.map((product, i) => (
                <ProductCard key={product.id} product={product} categoryName={nameOf(product.categorySlug)} priority={i < 4} />
              ))}
            </div>
          ) : (
            <div className="r-empty">
              <p style={{ margin: 0 }}>Nothing in this category yet — <Link href="/shop" className="r-link">browse everything</Link>.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
