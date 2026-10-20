import type { MetadataRoute } from "next";
import { articles, products, services } from "@/lib/site";
import { siteBaseUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/services", "/shop", "/team", "/gallery", "/blog", "/contact", "/book-appointment", "/cart", "/checkout", "/privacy-policy", "/terms-and-conditions"];
  return [
    ...routes.map((path) => ({ url: `${siteBaseUrl}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.6 })),
    ...services.map((service) => ({ url: `${siteBaseUrl}/services/${service.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...products.map((product) => ({ url: `${siteBaseUrl}/shop/${product.slug}`, changeFrequency: "monthly" as const, priority: 0.4 })),
    ...articles.map((article) => ({ url: `${siteBaseUrl}/blog/${article.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
