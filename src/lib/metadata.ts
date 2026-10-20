import type { Metadata } from "next";

/** Uses the deployment URL when configured so canonical/OG links are never invented for the demo. */
export const siteBaseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export function pageMetadata(title: string, description: string, path: string, image = "/images/hero-care.jpg"): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Jawad Veterinary Hospital`,
      description,
      url: path,
      siteName: "Jawad Veterinary Hospital",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: "Jawad Veterinary Hospital, Lahore" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export const noIndex: Metadata = { robots: { index: false, follow: true } };
