import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CartView } from "@/components/cart-view";
import { getSettings } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Your Cart", "Review items in your Jawad Pet Mall cart and check out with Lahore-wide delivery.", "/cart");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function CartPage() {
  const settings = getSettings();
  return (
    <main id="main-content">
      <div className="container breadcrumbs"><Link href="/">Home</Link><ChevronRight size={13} /><Link href="/shop">Pet Mall</Link><ChevronRight size={13} /><span>Cart</span></div>
      <section className="simple-page-section">
        <div className="container">
          <span className="eyebrow"><span className="eyebrow-line" /> Jawad PET MALL</span>
          <h1>Your cart.</h1>
          <p className="page-intro">Review your items, then check out in a minute — pay cash on delivery, Easypaisa, JazzCash or bank transfer.</p>
          <CartView deliveryFee={settings.deliveryFee} freeAbove={settings.freeDeliveryAbove} />
        </div>
      </section>
    </main>
  );
}
