import type { MetadataRoute } from "next";
import { listAdoptions, listProducts } from "@/lib/hospital-db";
import { siteBaseUrl } from "@/lib/metadata";
import { articles, services } from "@/lib/site";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/book", priority: 0.9, changeFrequency: "monthly" },
    { path: "/shop", priority: 0.9, changeFrequency: "weekly" },
    { path: "/adopt", priority: 0.8, changeFrequency: "weekly" },
    { path: "/services", priority: 0.8, changeFrequency: "monthly" },
    { path: "/fees", priority: 0.7, changeFrequency: "monthly" },
    { path: "/faqs", priority: 0.6, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/team", priority: 0.6, changeFrequency: "monthly" },
    { path: "/gallery", priority: 0.5, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/login", priority: 0.4, changeFrequency: "yearly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" },
  ];
  return [
    ...routes.map((route) => ({ url: `${siteBaseUrl}${route.path}`, changeFrequency: route.changeFrequency, priority: route.priority })),
    ...services.map((service) => ({ url: `${siteBaseUrl}/services/${service.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...listProducts(true).map((product) => ({ url: `${siteBaseUrl}/shop/${product.slug}`, changeFrequency: "weekly" as const, priority: 0.5 })),
    ...listAdoptions(["available"]).map((pet) => ({ url: `${siteBaseUrl}/adopt/${pet.id}`, changeFrequency: "weekly" as const, priority: 0.5 })),
    ...articles.map((article) => ({ url: `${siteBaseUrl}/blog/${article.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
