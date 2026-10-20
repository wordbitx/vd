import {
  categories, galleryItems as marketingGallery, products as marketingProducts,
  services as marketingServices, team, testimonials,
  type Product, type Service,
} from "@/lib/site";
import { rows } from "@/server/store";
import type { ProductRow, ServiceRow } from "@/lib/types";

/**
 * Store rows (editable in Admin) merged over the marketing content in src/lib/site.ts,
 * so prices can change live without losing long-form copy, FAQs and imagery.
 */
export type ServiceCard = ServiceRow & Omit<Service, "slug" | "title" | "shortTitle" | "summary" | "icon" | "image" | "price" | "duration">;

export async function catalogServices(opts: { includeInactive?: boolean } = {}) {
  const [storeRows] = await Promise.all([rows("services")]);
  const merged: ServiceCard[] = marketingServices.map((marketing) => {
    const row = storeRows.find((r) => r.slug === marketing.slug);
    return { ...marketing, ...(row ?? {}) } as ServiceCard;
  });
  // Anything created in the admin panel with no marketing entry still shows up.
  for (const row of storeRows) {
    if (!merged.some((s) => s.slug === row.slug)) merged.push({ ...row, overview: row.summary, includes: [], suitable: "", preparation: "" } as ServiceCard);
  }
  return opts.includeInactive ? merged : merged.filter((s) => s.active);
}

export type ProductCard = ProductRow & Pick<Product, "tags" | "featured">;

export async function catalogProducts(opts: { includeInactive?: boolean } = {}) {
  const storeRows = await rows("products");
  const merged: ProductCard[] = (storeRows.length ? storeRows : marketingProducts).map((row) => {
    const marketing = marketingProducts.find((p) => p.id === row.id);
    return { ...(marketing ?? {}), ...row } as ProductCard;
  });
  return opts.includeInactive ? merged : merged.filter((p) => p.active);
}

export async function productBySlug(slug: string) {
  return (await catalogProducts({ includeInactive: true })).find((p) => p.slug === slug) ?? null;
}

export async function serviceBySlug(slug: string) {
  return (await catalogServices({ includeInactive: true })).find((s) => s.slug === slug) ?? null;
}

export async function productById(id: string) {
  return (await catalogProducts({ includeInactive: true })).find((p) => p.id === id) ?? null;
}

export const catalogCategories = async () => {
  const products = await catalogProducts();
  return categories
    .map((c) => ({ ...c, count: products.filter((p) => p.categorySlug === c.slug).length }))
    .filter((c) => c.count > 0);
};

export async function catalogPosts(opts: { includeDrafts?: boolean } = {}) {
  const storePosts = await rows("posts");
  if (!storePosts.length) return [];
  const list = storePosts.slice().sort((a, b) => b.date.localeCompare(a.date));
  return opts.includeDrafts ? list : list.filter((p) => p.status === "published");
}

export const catalogGallery = async () => {
  const items = marketingGallery;
  return items.map((item, i) => ({ ...item, index: i + 1 }));
};

export const catalogTeam = () => Promise.resolve(team);
export const catalogTestimonials = async () => {
  const reviews = await rows("reviews");
  const published = reviews.filter((r) => r.status === "published");
  if (!published.length) return testimonials.map((t) => ({ ...t, area: t.area }));
  return published.map((r) => ({ name: r.author, area: r.area, text: r.text, service: r.service, rating: r.rating }));
};
