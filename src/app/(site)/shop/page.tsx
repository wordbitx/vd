import Link from "next/link";
import type { Metadata } from "next";
import { Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
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

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "name", label: "Name A–Z" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const [{ category, q, sort }, products, categories] = await Promise.all([
    searchParams,
    catalogProducts(),
    catalogCategories(),
  ]);

  const active = categories.find((c) => c.slug === category) ?? null;
  const nameOf = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "Pet care";
  const term = (q ?? "").trim();
  const sortKey = SORTS.some((s) => s.key === sort) ? (sort as string) : "featured";

  let list = products;
  if (active) list = list.filter((p) => p.categorySlug === active.slug);
  if (term) {
    const needle = term.toLowerCase();
    list = list.filter((p) =>
      [p.name, p.brand, nameOf(p.categorySlug)].some((field) => field.toLowerCase().includes(needle)),
    );
  }
  list = [...list].sort((a, b) => {
    if (sortKey === "price-asc") return a.price - b.price;
    if (sortKey === "price-desc") return b.price - a.price;
    if (sortKey === "name") return a.name.localeCompare(b.name);
    return Number(!!b.featured) - Number(!!a.featured) || b.rating - a.rating;
  });

  const heading = term ? `Results for “${term}”` : active ? active.name : "Trending Now";
  const filtered = Boolean(active || term || sortKey !== "featured");

  return (
    <>
      {/* the reference opens with a full-width teal banner: search on top, headline bottom-left, bag watermark right */}
      <section className="r-shop-hero-wrap">
        <div className="r-wrap">
          <div className="r-shop-hero">
            <form className="r-shop-search" action="/shop" method="get" role="search">
              <Search size={19} aria-hidden="true" />
              <input
                type="search"
                name="q"
                defaultValue={term}
                placeholder="Search products and brands"
                aria-label="Search products and brands"
                autoComplete="off"
              />
              {active ? <input type="hidden" name="category" value={active.slug} /> : null}
              {sortKey !== "featured" ? <input type="hidden" name="sort" value={sortKey} /> : null}
              <button type="submit" className="r-shop-search-btn">Search</button>
            </form>

            <ShoppingBag className="r-shop-watermark" size={260} strokeWidth={0.9} aria-hidden="true" />

            <div className="r-shop-hero-copy">
              <h1>Everything Your Pet Will Love</h1>
              <p>Food, toys, care essentials and everyday favorites.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="r-shop-cats-wrap">
        <div className="r-wrap">
          <h2 className="r-shop-h2">Browse Categories</h2>
          <div className="r-catrow">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={
                  c.slug === active?.slug
                    ? `/shop${term ? `?q=${encodeURIComponent(term)}` : ""}`
                    : `/shop?category=${c.slug}${term ? `&q=${encodeURIComponent(term)}` : ""}`
                }
                className="r-catrow-item"
                data-active={c.slug === active?.slug ? "true" : undefined}
              >
                <CategoryArt slug={c.slug} className="r-catrow-art" />
                <span className="r-catrow-name">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="r-shop-list-wrap">
        <div className="r-wrap">
          <div className="r-shop-head">
            <h2 className="r-shop-h2" style={{ margin: 0 }}>{heading}</h2>

            <details className="r-shop-filter">
              <summary aria-label="Filter and sort products">
                <SlidersHorizontal size={17} />
                <span>Filter</span>
              </summary>
              <form className="r-shop-filter-panel" action="/shop" method="get">
                <label>
                  <span>Category</span>
                  <select name="category" defaultValue={active?.slug ?? ""}>
                    <option value="">All categories</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Sort by</span>
                  <select name="sort" defaultValue={sortKey}>
                    {SORTS.map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </label>
                {term ? <input type="hidden" name="q" value={term} /> : null}
                <div className="r-shop-filter-actions">
                  <Link href="/shop" className="r-btn r-btn-outline r-btn-sm">Reset</Link>
                  <button type="submit" className="r-btn r-btn-teal r-btn-sm">Apply</button>
                </div>
              </form>
            </details>
          </div>

          {list.length ? (
            <div className="r-products">
              {list.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={nameOf(product.categorySlug)}
                  priority={i < 4}
                />
              ))}
            </div>
          ) : (
            <div className="r-empty">
              <p style={{ margin: "0 0 10px" }}>Nothing matches “{term}”.</p>
              <Link href="/shop" className="r-btn r-btn-teal r-btn-sm">Show everything</Link>
            </div>
          )}

          {filtered ? (
            <div className="r-shop-reset">
              <Link href="/shop" className="r-link">Clear filters</Link>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
