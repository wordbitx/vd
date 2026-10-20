import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Package, Truck } from "lucide-react";
import { OrderSlip, SlipActions } from "@/components/slip";
import { Breadcrumbs, Eyebrow } from "@/components/ui";
import { findOrderByRef } from "@/server/queries";
import { business } from "@/lib/site";
import { noIndex } from "@/lib/metadata";

export const metadata: Metadata = { title: "Order confirmed", ...noIndex };

const steps = [
  { key: "pending", label: "Order placed", note: "Payment is collected on delivery unless you paid by transfer." },
  { key: "packed", label: "Packed at the store", note: "Items picked from the Al Kabir Town shelf and sealed." },
  { key: "dispatched", label: "Out for delivery", note: "The rider calls you on the way." },
  { key: "delivered", label: "Delivered", note: "Receipt attached to your portal." },
];

export default async function OrderConfirmation({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const order = await findOrderByRef(ref);
  if (!order) redirect("/slip");
  const activeIndex = steps.findIndex((s) => s.key === order.status);
  const message = `Reference ${order.ref}: ${order.items.length} item(s), Rs. ${order.total} — ${order.area}.`;

  return (
    <section className="section-tight" style={{ paddingTop: 20, paddingBottom: 56 }}>
      <div className="container">
        <Breadcrumbs items={[{ label: "Pet Mall", href: "/shop" }, { label: order.ref }]} />
        <div className="grid" style={{ gridTemplateColumns: "minmax(0,1.1fr) minmax(0,420px)", gap: 34, alignItems: "start" }}>
          <div className="col" style={{ gap: 20 }}>
            <div className="card card-pad" style={{ borderColor: "rgba(44,114,87,.3)", background: "linear-gradient(150deg,#eef6f0,#fffdfa)" }}>
              <span className="row" style={{ gap: 10, marginBottom: 10 }}>
                <span className="avatar" style={{ background: "var(--ok)", color: "#fff" }}><Check size={15} strokeWidth={3} /></span>
                <Eyebrow>Order confirmed</Eyebrow>
              </span>
              <h1 style={{ fontSize: "clamp(26px,3.4vw,40px)", margin: "0 0 10px" }}>
                {order.items.reduce((s, i) => s + i.qty, 0)} item{order.items.length === 1 ? "" : "s"} heading to <em>{order.area}.</em></h1>
              <p className="muted small" style={{ margin: 0 }}>
                Orders confirmed before 4 pm go out the same evening. The rider calls {order.phone} on approach — keep a phone handy, and
                have {order.payment.method === "cod" ? "the amount ready in cash" : "your transfer receipt handy"} for handover.
              </p>
            </div>

            <div className="app-card">
              <div className="app-card-head"><h3 style={{ fontSize: 16 }}><Truck size={15} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />Delivery progress</h3></div>
              <div className="app-card-body">
                <div className="timeline">
                  {steps.map((step, i) => {
                    const reached = order.status === "cancelled" ? false : i <= activeIndex;
                    return (
                      <div className="timeline-item" key={step.key} data-done={reached ? "true" : "false"}>
                        <span className="timeline-dot" />
                        <div>
                          <b>{step.label}</b>
                          <small>{step.note}</small>
                        </div>
                        {reached && i === activeIndex ? <span className="spacer" /> : null}
                        {i === activeIndex ? <span className="pill pill-brass" style={{ alignSelf: "center" }}>Current</span> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="app-card-foot">
                <span className="small muted">Questions about this order?</span>
                <span className="spacer" />
                <Link href="/portal/orders" className="button button-ghost button-sm">Open in portal <ArrowRight size={14} /></Link>
              </div>
            </div>

            <div className="note"><Package size={16} /><span>Something wrong with an item? Message us from the portal within 7 days with the packaging intact and we will replace or refund it — no argument.</span></div>
            <div className="row" style={{ gap: 10 }}>
              <Link href="/shop" className="button button-primary button-sm">Keep shopping <ArrowRight size={14} /></Link>
              <Link href={`/slip/${order.ref}?kind=order`} className="button button-ghost button-sm">Print confirmation</Link>
              <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="button button-ghost button-sm">Call {business.phone}</a>
            </div>
          </div>

          <div className="col" style={{ gap: 14, position: "sticky", top: 96 }}>
            <OrderSlip order={order} />
            <SlipActions refCode={order.ref} message={message} />
          </div>
        </div>
      </div>
    </section>
  );
}
