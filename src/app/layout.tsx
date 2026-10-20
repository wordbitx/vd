import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { business } from "@/lib/site";
import { siteBaseUrl } from "@/lib/metadata";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import "./interior.css";
import "./premium.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", fallback: ["Arial", "sans-serif"] });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", style: ["normal", "italic"], axes: ["opsz"], fallback: ["Georgia", "serif"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl),
  robots: process.env.NEXT_PUBLIC_SITE_URL ? { index: true, follow: true } : { index: false, follow: false },
  title: { default: "Jawad Veterinary Hospital | Veterinary Care & Pet Shop in Lahore", template: "%s | Jawad Veterinary Hospital" },
  description: "Explore veterinary care options and pet essentials at Jawad Veterinary Hospital in Al Kabir Town, Lahore. Contact the team to plan your pet’s visit.",
  openGraph: { siteName: business.name, type: "website", locale: "en_PK" },
  twitter: { card: "summary_large_image" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "VeterinaryCare",
  "@id": `${siteBaseUrl}/#hospital`,
  name: business.name,
  url: siteBaseUrl,
  telephone: business.phone,
  description: "Veterinary hospital and pet supply store in Al Kabir Town, Lahore, Pakistan.",
  address: { "@type": "PostalAddress", streetAddress: "Al Kabir Town, Town Gate 3, Main Raiwind Road", addressLocality: "Lahore", addressRegion: "Punjab", postalCode: "54000", addressCountry: "PK" },
  hasMap: business.mapsUrl,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${fraunces.variable}`}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <CartProvider><SiteHeader />{children}<SiteFooter /></CartProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
