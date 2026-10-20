import type { Metadata } from "next";

// Use the deployment URL when available; never invent an official business domain for this demo.
export const siteBaseUrl = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")).replace(/\/$/, "");

export function pageMetadata(title: string, description: string, path: string, image = "/images/hero-vet.jpg"): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | Jawad Veterinary Hospital`, description, url: path, siteName: "Jawad Veterinary Hospital", type: "website", images: [{ url: image, alt: "Illustrative pet care imagery for Jawad Veterinary Hospital website preview" }] },
    twitter: { card: "summary_large_image", title: `${title} | Jawad Veterinary Hospital`, description, images: [image] },
  };
}
