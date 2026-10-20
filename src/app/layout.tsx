import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart-context";
import { business } from "@/lib/site";
import { siteBaseUrl } from "@/lib/metadata";
import { catalogProducts } from "@/server/catalog";
import { getSettings } from "@/server/store";
import "./globals.css";
import "./portal.css";
import "./slip.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl),
  title: {
    default: "Jawad Veterinary Hospital — veterinary care, home visits & pet mall in Lahore",
    template: "%s | Jawad Veterinary Hospital",
  },
  description:
    "Veterinary hospital, 24/7 home visits and a pet mall in Al Kabir Town, Lahore. Consultations, vaccination, dentistry, surgery aftercare, lab tests and online booking with a printable slip and a client portal.",
  keywords: ["veterinary hospital Lahore", "home vet visit Lahore", "pet vaccination Lahore", "pet shop Al Kabir Town", "emergency vet Lahore", "Raiwind Road vet"],
  authors: [{ name: business.name }],
  creator: business.name,
  openGraph: {
    siteName: business.name,
    type: "website",
    locale: "en_PK",
    url: siteBaseUrl,
    title: "Jawad Veterinary Hospital — Lahore",
    description: "Clinic-grade veterinary care at the hospital or your doorstep in Lahore, plus a vet-approved pet mall and an online client portal.",
    images: [{ url: "/images/hero-care.jpg", width: 1200, height: 630, alt: "Veterinarian examining a dog and cat at Jawad Veterinary Hospital, Lahore" }],
  },
  twitter: { card: "summary_large_image", title: "Jawad Veterinary Hospital — Lahore", description: "Home visits, hospital care and a pet mall in Al Kabir Town, Lahore.", images: ["/images/hero-care.jpg"] },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
  formatDetection: { address: false, telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ea" },
    { media: "(prefers-color-scheme: dark)", color: "#071a20" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const products = await catalogProducts().catch(() => []);
  const settings = await getSettings().catch(() => undefined);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VeterinaryCare",
    "@id": `${siteBaseUrl}/#hospital`,
    name: business.name,
    url: siteBaseUrl,
    telephone: business.phone,
    email: business.email,
    description: "Veterinary hospital, home-visit service and pet mall in Al Kabir Town, Lahore.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Al Kabir Town, Town Gate 3, Main Raiwind Road",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      postalCode: "54000",
      addressCountry: "PK",
    },
    geo: { "@type": "GeoCoordinates", latitude: 31.3375, longitude: 74.2045 },
    hasMap: business.mapsUrl,
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "10:00", closes: "23:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday"], opens: "10:00", closes: "23:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday"], opens: "10:00", closes: "23:30" },
    ],
    priceRange: "Rs. 1,000 – Rs. 12,000",
    paymentAccepted: "Cash, Bank transfer, Easypaisa",
    areaServed: { "@type": "City", name: "Lahore" },
    sameAs: [business.mapsUrl],
    potentialAction: {
      "@type": "ReserveAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteBaseUrl}/book-vet-appointment-lahore`, actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"] },
    },
  };

  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <CartProvider
          catalog={products.map((p) => ({ id: p.id, slug: p.slug, name: p.name, price: p.price, image: p.image, stock: p.stock, sizes: p.sizes }))}
          deliveryFee={settings?.deliveryLahore}
          freeOver={settings?.freeDeliveryOver}
        >
          {children}
        </CartProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
