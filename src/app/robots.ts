import type { MetadataRoute } from "next";
import { siteBaseUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  // Keep unapproved demo deployments out of search. Set NEXT_PUBLIC_SITE_URL after owner approval.
  const approvedDomainConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
  return { rules: { userAgent: "*", allow: approvedDomainConfigured ? "/" : undefined, disallow: approvedDomainConfigured ? "/api/" : "/" }, sitemap: `${siteBaseUrl}/sitemap.xml` };
}
