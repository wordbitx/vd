"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/cards";
import { categories } from "@/lib/site";
import { sellingPrice, type StoreProduct } from "@/lib/types";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export function ShopCatalog({ products, initialCategory = "" }: { products: StoreProduct[]; initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = !category || product.categorySlug === category;
      const categoryName = categories.find((item) => item.slug === product.categorySlug)?.name ?? "";
      return matchesCategory && `${product.name} ${categoryName} ${product.description}`.toLowerCase().includes(query.trim().toLowerCase());
    });
    switch (sort) {
      case "price-asc": return [...result].sort((a, b) => sellingPrice(a) - sellingPrice(b));
      case "price-desc": return [...result].sort((a, b) => sellingPrice(b) - sellingPrice(a));
      case "name": return [...result].sort((a, b) => a.name.localeCompare(b.name));
      default: return result;
    }
  }, [products, category, query, sort]);

  const selectCategory = (slug: string) => {
    setCategory(slug);
    window.history.replaceState(null, "", slug ? `/shop?category=${encodeURIComponent(slug)}` : "/shop");
  };
  const current = categories.find((item) => item.slug === category);

  return (
    <div className="shop-catalog-layout">
      <aside className="shop-sidebar">
        <div className="shop-sidebar-title"><SlidersHorizontal size={17} /><span>Shop by category</span></div>
        <button type="button" className={!category ? "category-active" : ""} onClick={() => selectCategory("")} aria-pressed={!category}>All products <span>{products.length}</span></button>
        {categories.map((item) => {
          const count = products.filter((product) => product.categorySlug === item.slug).length;
          if (count === 0) return null;
          return (
            <button type="button" key={item.slug} className={category === item.slug ? "category-active" : ""} onClick={() => selectCategory(item.slug)} aria-pressed={category === item.slug}>
              {item.name}<span>{count}</span>
            </button>
          );
        })}
      </aside>
      <div className="shop-results">
        <div className="shop-toolbar">
          <label className="search-field">
            <Search size={19} aria-hidden="true" />
            <span className="sr-only">Search products</span>
            <input type="search" placeholder="Search food, toys, grooming…" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label className="sort-field">
            Sort
            <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} aria-label="Sort products">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
          <span className="results-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "product" : "products"}</span>
        </div>
        <div className="shop-current-heading">
          <div>
            <span className="eyebrow"><span className="eyebrow-line" /> THE COLLECTION</span>
            <h2>{current ? current.name : "All pet essentials"}</h2>
          </div>
          {category && <button type="button" className="clear-filter" onClick={() => selectCategory("")}><RotateCcw size={14} /> Clear category</button>}
        </div>
        {filtered.length ? (
          <div className="product-grid shop-results-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        ) : (
          <div className="empty-state">
            <Search size={27} />
            <h3>No matching products</h3>
            <p>Try another search term, or browse all categories.</p>
            <button type="button" className="button button-primary" onClick={() => { setQuery(""); selectCategory(""); }}>Show all products</button>
          </div>
        )}
      </div>
    </div>
  );
}
