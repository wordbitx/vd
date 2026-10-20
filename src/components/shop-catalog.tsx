"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/cards";
import { categories, products } from "@/lib/site";

export function ShopCatalog({ initialCategory = "" }: { initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => products.filter((product) => {
    const matchesCategory = !category || product.categorySlug === category;
    const categoryName = categories.find((item) => item.slug === product.categorySlug)?.name ?? "";
    return matchesCategory && `${product.name} ${categoryName} ${product.description}`.toLowerCase().includes(query.trim().toLowerCase());
  }), [category, query]);
  const selectCategory = (slug: string) => {
    setCategory(slug);
    window.history.replaceState(null, "", slug ? `/shop?category=${encodeURIComponent(slug)}` : "/shop");
  };
  const current = categories.find((item) => item.slug === category);
  return <div className="shop-catalog-layout">
    <aside className="shop-sidebar"><div className="shop-sidebar-title"><SlidersHorizontal size={17} /><span>Shop by category</span></div><button type="button" className={!category ? "category-active" : ""} onClick={() => selectCategory("")} aria-pressed={!category}>All products <span>{products.length}</span></button>{categories.map((item) => <button type="button" key={item.slug} className={category === item.slug ? "category-active" : ""} onClick={() => selectCategory(item.slug)} aria-pressed={category === item.slug}>{item.name}<span>{products.filter((product) => product.categorySlug === item.slug).length}</span></button>)}</aside>
    <div className="shop-results"><div className="shop-toolbar"><label className="search-field"><Search size={19} aria-hidden="true" /><span className="sr-only">Search products</span><input type="search" placeholder="Search pet essentials..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><span className="results-count" aria-live="polite">{filtered.length} demo {filtered.length === 1 ? "product" : "products"}</span></div><div className="shop-current-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> THE COLLECTION</span><h2>{current ? current.name : "All pet essentials"}</h2></div>{category && <button type="button" className="clear-filter" onClick={() => selectCategory("")}><RotateCcw size={14} /> Clear category</button>}</div>
      {filtered.length ? <div className="product-grid shop-results-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><Search size={27} /><h3>No matching demo products</h3><p>Try another term or browse all categories. The real shop catalogue will be added after confirmation.</p><button type="button" className="button button-primary" onClick={() => { setQuery(""); selectCategory(""); }}>Show all products</button></div>}
    </div>
  </div>;
}
