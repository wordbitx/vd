import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/bodoni-moda/wght.css";
import "@fontsource-variable/newsreader/wght.css";
import "@fontsource-variable/figtree/wght.css";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/playfair-display/wght.css";
import "./samples.css";
import "./pawwell.css";

export const metadata: Metadata = {
  title: { default: "20 home page studies", template: "%s · Jawad design studies" },
  description: "Layout and typography studies for the Jawad Veterinary Hospital home page.",
  robots: { index: false, follow: false },
};

export default function SamplesLayout({ children }: { children: ReactNode }) {
  return <div className="smp-scope">{children}</div>;
}
