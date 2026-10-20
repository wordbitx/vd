import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, Eyebrow } from "@/components/ui";
import { CartView } from "@/components/cart-view";
import { getSettings } from "@/server/store";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("Your basket", "Review pet mall items before checkout — cash on delivery or bank transfer across Lahore.", "/cart", "/images/pet-shop.jpg");

export default async function CartPage() {
  const settings = await getSettings();
  return (
    <section className="section-tight" style={{ paddingTop: 22 }}>
      <div className="container">
        <Breadcrumbs items={[{ label: "Pet Mall", href: "/shop" }, { label: "Basket" }]} />
        <div className="row-between" style={{ marginBottom: 22 }}>
          <div>
            <Eyebrow>Your basket</Eyebrow>
            <h1 style={{ margin: "12px 0 6px", fontSize: "clamp(30px,4vw,48px)" }}>Ready when you are.</h1>
            <p className="muted" style={{ margin: 0 }}>Prices are confirmed at checkout. Delivery inside Lahore is same-day before 4 pm.</p>
          </div>
          <Link href="/shop" className="button button-ghost button-sm">Add more items <ArrowRight size={15} /></Link>
        </div>
        <CartView freeOver={settings.freeDeliveryOver} />
      </div>
    </section>
  );
}
