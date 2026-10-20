import type { MetadataRoute } from "next";
import { siteBaseUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  // Set NEXT_PUBLIC_SITE_URL once the owner approves the deployment; until then keep demo hosts out of search.
  const approvedDomainConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
  return {
    rules: approvedDomainConfigured
      ? [
          { userAgent: "*", allow: "/", disallow: ["/admin", "/portal", "/api/", "/slip/", "/booking/", "/order/", "/checkout", "/cart"] },
          { userAgent: "GPTBot", allow: "/" },
        ]
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteBaseUrl}/sitemap.xml`,
    host: siteBaseUrl,
  };
}
