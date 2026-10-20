import type { MetadataRoute } from "next";
import { siteBaseUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/dashboard/", "/book/slip/", "/checkout/", "/cart"],
    },
    sitemap: `${siteBaseUrl}/sitemap.xml`,
  };
}
