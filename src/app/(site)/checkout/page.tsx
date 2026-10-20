import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Breadcrumbs, Eyebrow } from "@/components/ui";
import { CheckoutView } from "@/components/checkout-view";
import { currentUser } from "@/server/auth";
import { getSettings, rows } from "@/server/store";
import { noIndex } from "@/lib/metadata";

export const metadata: Metadata = { title: "Checkout", description: "Complete your Pet Mall order — cash on delivery, Easypaisa or bank transfer.", ...noIndex };

export default async function CheckoutPage() {
  const [settings, user, promos] = await Promise.all([getSettings(), currentUser().catch(() => null), rows("promos")]);

  return (
    <section className="section-tight" style={{ paddingTop: 22 }}>
      <div className="container">
        <Breadcrumbs items={[{ label: "Pet Mall", href: "/shop" }, { label: "Basket", href: "/cart" }, { label: "Checkout" }]} />
        <div className="row-between" style={{ marginBottom: 20 }}>
          <div>
            <Eyebrow>Checkout</Eyebrow>
            <h1 style={{ margin: "12px 0 6px", fontSize: "clamp(28px,3.6vw,44px)" }}>Where should it go?</h1>
            <p className="muted small" style={{ margin: 0 }}>
              {user ? `Signing out? Your basket is saved on this device only — items are not held until the order is placed.` : "No account needed. Create one afterwards to track the delivery and keep receipts."}
            </p>
          </div>
          <span className="pill pill-soft"><ShieldCheck size={13} /> No card details stored</span>
        </div>
        <CheckoutView settings={settings} promos={promos.filter((p) => p.active)} />
        <p className="tiny muted center" style={{ marginTop: 26 }}>
          By placing an order you agree to our <Link href="/terms-and-conditions" style={{ textDecoration: "underline" }}>terms</Link>. Refunds for
          unopened, in-date stock within 7 days — see the policy on your confirmation.
        </p>
      </div>
    </section>
  );
}
