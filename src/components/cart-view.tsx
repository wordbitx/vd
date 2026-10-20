"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShieldCheck, Truck, X } from "lucide-react";
import { money } from "@/lib/format";
import { useCart } from "@/components/cart-context";

export function CartView({ freeOver = 5000 }: { freeOver?: number }) {
  const { items, ready, setQty, remove, subtotal, delivery, total, count, freeDeliveryGap } = useCart();

  if (!ready) {
    return <div className="empty"><p style={{ margin: 0 }}>Loading your basket…</p></div>;
  }
  if (!items.length) {
    return (
      <div className="empty">
        <Truck size={26} style={{ color: "var(--line-2)" }} />
        <h3>Your basket is empty</h3>
        <p>Pet food, skin care and vet-approved essentials from the Al Kabir Town store — delivered across Lahore.</p>
        <Link href="/shop" className="button button-primary button-sm">Browse the Pet Mall <ArrowRight size={15} /></Link>
      </div>
    );
  }

  return (
    <div className="grid" style={{ gap: 18, gridTemplateColumns: "minmax(0,1fr)", alignItems: "start" }}>
      <div className="app-card">
        <div className="app-card-body" style={{ paddingTop: 6, paddingBottom: 6 }}>
          {items.map((line) => (
            <div className="cart-line" key={`${line.id}-${line.size ?? ""}`}>
              <span className="cart-thumb">
                <Image src={line.image} alt="" width={140} height={120} className="object-cover" unoptimized />
              </span>
              <div className="col" style={{ gap: 5 }}>
                <Link href={`/shop/${line.slug}`} style={{ fontWeight: 750, fontSize: 14, letterSpacing: "-0.015em" }}>{line.name}</Link>
                <span className="tiny muted">{money(line.price)} each{line.size ? ` · ${line.size}` : ""}</span>
                <div className="row" style={{ gap: 10, marginTop: 4 }}>
                  <span className="qty">
                    <button type="button" onClick={() => setQty(line.id, line.qty - 1, line.size)} aria-label="Decrease"><Minus size={13} /></button>
                    <span>{line.qty}</span>
                    <button type="button" onClick={() => setQty(line.id, line.qty + 1, line.size)} aria-label="Increase"><Plus size={13} /></button>
                  </span>
                  <button type="button" className="link-arrow" style={{ color: "var(--muted)", fontSize: 11.5 }} onClick={() => remove(line.id, line.size)}>
                    <X size={13} /> Remove
                  </button>
                </div>
              </div>
              <b className="tnum" style={{ fontFamily: "var(--serif)", fontSize: 19, fontWeight: 500, letterSpacing: "-0.03em" }}>{money(line.price * line.qty)}</b>
            </div>
          ))}
        </div>
        <div className="app-card-foot">
          <span className="small muted">{count} item{count === 1 ? "" : "s"} · prices include GST where applicable</span>
          <span className="spacer" />
          <Link href="/shop" className="button button-ghost button-sm">Keep shopping</Link>
        </div>
      </div>

      <div className="app-card">
        <div className="app-card-body">
          {freeDeliveryGap > 0 ? (
            <div className="col" style={{ gap: 8, marginBottom: 14 }}>
              <span className="tiny" style={{ fontWeight: 750, color: "var(--muted)" }}>
                <Truck size={13} style={{ display: "inline", verticalAlign: "-2px", marginRight: 5 }} />
                Add {money(freeDeliveryGap)} more for free delivery in Lahore
              </span>
              <span className="meter"><span style={{ width: `${Math.min(100, Math.round(((freeOver - freeDeliveryGap) / freeOver) * 100))}%` }} /></span>
            </div>
          ) : (
            <p className="notice notice-ok small" style={{ marginTop: 0 }}>Free Lahore delivery unlocked.</p>
          )}
          <div className="fee-row"><span>Subtotal</span><b>{money(subtotal)}</b></div>
          <div className="fee-row"><span>Delivery (Lahore)</span><b>{delivery ? money(delivery) : "Free"}</b></div>
          <div className="fee-row fee-total"><span>Total due on delivery</span><b>{money(total)}</b></div>
          <Link href="/checkout" className="button button-primary button-block button-lg" style={{ marginTop: 16 }}>
            Checkout <ArrowRight size={16} />
          </Link>
          <p className="tiny muted center" style={{ margin: "12px 0 0" }}><ShieldCheck size={13} style={{ display: "inline", verticalAlign: "-2px" }} /> Cash on delivery, Easypaisa or bank transfer. No card details are stored.</p>
        </div>
      </div>
    </div>
  );
}
