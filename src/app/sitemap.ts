import type { MetadataRoute } from "next";
import { articles, products, services } from "@/lib/site";
import { siteBaseUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/book-vet-appointment-lahore", priority: 0.95, freq: "weekly" },
    { path: "/services", priority: 0.9, freq: "monthly" },
    { path: "/shop", priority: 0.85, freq: "weekly" },
    { path: "/about", priority: 0.7, freq: "monthly" },
    { path: "/team", priority: 0.7, freq: "monthly" },
    { path: "/gallery", priority: 0.6, freq: "monthly" },
    { path: "/pet-care-tips", priority: 0.7, freq: "weekly" },
    { path: "/adopt", priority: 0.7, freq: "weekly" },
    { path: "/contact-vet-lahore", priority: 0.75, freq: "monthly" },
    { path: "/login", priority: 0.4, freq: "yearly" },
    { path: "/register", priority: 0.4, freq: "yearly" },
    { path: "/slip", priority: 0.3, freq: "yearly" },
    { path: "/privacy-policy", priority: 0.3, freq: "yearly" },
    { path: "/terms-and-conditions", priority: 0.3, freq: "yearly" },
  ];

  return [
    ...routes.map((route) => ({
      url: `${siteBaseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.freq,
      priority: route.priority,
    })),
    ...services.map((service) => ({
      url: `${siteBaseUrl}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: `${siteBaseUrl}/shop/${product.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...articles.map((article) => ({
      url: `${siteBaseUrl}/pet-care-tips/${article.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
