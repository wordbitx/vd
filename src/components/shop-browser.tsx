"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/cards";

type Row = Parameters<typeof ProductCard>[0]["product"];

export function ShopBrowser({
  products, categories, initialCategory, initialQuery, brands,
}: { products: Row[]; categories: { slug: string; name: string }[]; initialCategory?: string; initialQuery?: string; brands: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState(initialQuery ?? "");
  const [sort, setSort] = useState<string>("featured");
  const [brand, setBrand] = useState<string>("");
  const [max, setMax] = useState<number>(0);
  const category = initialCategory ?? "";

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category && p.categorySlug !== category) return false;
      if (brand && p.brand !== brand) return false;
      if (max && p.price > max) return false;
      if (!needle) return true;
      return `${p.name} ${p.brand} ${p.categorySlug}`.toLowerCase().includes(needle);
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "featured") list = [...list].sort((a, b) => Number(Boolean((b as { featured?: boolean }).featured)) - Number(Boolean((a as { featured?: boolean }).featured)));
    return list;
  }, [products, category, brand, query, sort, max]);

  const pick = (slug: string) => {
    const next = new URLSearchParams(params.toString());
    if (slug) next.set("category", slug);
    else next.delete("category");
    router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false });
  };

  return (
    <div className="grid" style={{ gap: 22 }}>
      <div className="app-card card-pad" style={{ display: "grid", gap: 14 }}>
        <div className="row-between" style={{ gap: 14 }}>
          <div className="chip-row">
            <button type="button" className="chip" data-active={!category ? "true" : undefined} onClick={() => pick("")}>All products</button>
            {categories.map((c) => (
              <button key={c.slug} type="button" className="chip" data-active={category === c.slug ? "true" : undefined} onClick={() => pick(c.slug)}>{c.name}</button>
            ))}
          </div>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <div className="search">
            <Search size={15} />
            <input className="input" placeholder="Search food, shampoo, toys…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search products" />
          </div>
          <select className="select" style={{ maxWidth: 190 }} value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Filter by brand">
            <option value="">All brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select className="select" style={{ maxWidth: 200 }} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            <option value="featured">Sort: recommended</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Best rated</option>
          </select>
          <label className="row" style={{ gap: 8, fontSize: 12.5, fontWeight: 700, color: "var(--muted)" }}>
            <SlidersHorizontal size={15} />
            Under
            <select className="select" style={{ minWidth: 120 }} value={max} onChange={(e) => setMax(Number(e.target.value))} aria-label="Maximum price">
              <option value={0}>Any price</option>
              <option value={2000}>Rs. 2,000</option>
              <option value={4000}>Rs. 4,000</option>
              <option value={7000}>Rs. 7,000</option>
            </select>
          </label>
          <span className="spacer" />
          <span className="small muted">{visible.length} of {products.length} products</span>
        </div>
      </div>

      {visible.length ? (
        <div className="product-grid">
          {visible.map((product, i) => <ProductCard key={product.id} product={{ ...product }} priority={i < 4} />)}
        </div>
      ) : (
        <div className="empty">
          <Search size={24} style={{ color: "var(--line-2)" }} />
          <h3>Nothing matches that yet</h3>
          <p>Try another category or clear the search. If the shop does not stock it, we can often order it in — ask on WhatsApp.</p>
          <button type="button" className="button button-ghost button-sm" onClick={() => { setQuery(""); setBrand(""); setMax(0); pick(""); }}>Reset filters</button>
        </div>
      )}
    </div>
  );
}
