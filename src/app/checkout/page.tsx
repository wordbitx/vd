import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CheckoutView } from "@/components/checkout-view";
import { getSettings } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Checkout", "Place your Jawad Pet Mall order — Lahore delivery, cash on delivery and instant invoice.", "/checkout");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function CheckoutPage() {
  const settings = getSettings();
  return (
    <main id="main-content">
      <div className="container breadcrumbs"><Link href="/">Home</Link><ChevronRight size={13} /><Link href="/shop">Pet Mall</Link><ChevronRight size={13} /><Link href="/cart">Cart</Link><ChevronRight size={13} /><span>Checkout</span></div>
      <section className="simple-page-section">
        <div className="container">
          <span className="eyebrow"><span className="eyebrow-line" /> ALMOST THERE</span>
          <h1>Checkout.</h1>
          <p className="page-intro">Enter your delivery details and place your order — your invoice is generated instantly.</p>
          <CheckoutView deliveryFee={settings.deliveryFee} freeAbove={settings.freeDeliveryAbove} />
        </div>
      </section>
    </main>
  );
}
