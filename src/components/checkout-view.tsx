"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, CreditCard, Lock, Truck, Wallet } from "lucide-react";
import { money } from "@/lib/format";
import { useCart } from "@/components/cart-context";
import { createOrder, type CheckoutResult } from "@/server/actions/shop";
import { business } from "@/lib/site";

export function CheckoutView({
  settings, promos,
}: {
  settings: { deliveryLahore: number; freeDeliveryOver: number; paymentInstructions: string };
  promos: { code: string; label: string; percent: number; minSubtotal: number }[];
}) {
  const { items, subtotal, delivery, total, discount, ready, clear } = useCart();
  const [state, formAction, pending] = useActionState<CheckoutResult | null, FormData>(createOrder, null);
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState<{ code: string; percent: number } | null>(null);
  const [pay, setPay] = useState<"cod" | "transfer" | "easypaisa">("cod");
  const errors = state?.errors ?? {};

  useEffect(() => {
    if (state?.ok) clear();
  }, [state, clear]);

  const matchedPromo = promos.find((p) => p.code.toUpperCase() === promo.trim().toUpperCase());
  const promoWorks = !!matchedPromo && subtotal - (applied?.percent ? Math.round((subtotal * applied.percent) / 100) : 0) >= matchedPromo.minSubtotal;
  const liveDiscount = applied ? Math.round((subtotal * applied.percent) / 100) : 0;
  const payable = Math.max(0, subtotal - liveDiscount);
  const liveDelivery = payable >= settings.freeDeliveryOver || payable === 0 ? 0 : settings.deliveryLahore;
  const liveTotal = payable + liveDelivery;

  return (
    <div className="work-grid">
      <form action={formAction} className="app-card" noValidate>
        <div className="app-card-head">
          <div>
            <h2>Where should the rider come?</h2>
            <p>Delivery inside Lahore is {money(settings.deliveryLahore)} — free above {money(settings.freeDeliveryOver)}.</p>
          </div>
        </div>
        <div className="app-card-body">
          <input type="hidden" name="items" value={JSON.stringify(items.map((i) => ({ id: i.id, qty: i.qty, size: i.size })))} readOnly />
          {errors.items ? <p className="notice notice-error">{errors.items}</p> : null}
          <div className="form-grid">
            <Field name="name" label="Full name" error={errors.name} required placeholder="Areeba Khan" />
            <Field name="phone" label="Mobile number" error={errors.phone} required placeholder="+92 300 1234567" type="tel" />
            <Field name="email" label="Email (optional)" error={errors.email} placeholder="you@example.com" type="email" />
            <Field name="area" label="Area" placeholder="Johar Town" />
          </div>
          <div style={{ marginTop: 16 }}>
            <Field name="address" label="Delivery address" error={errors.address} required placeholder="House / flat, street, landmark, area, Lahore" rows={3} textarea />
          </div>
          <div style={{ marginTop: 16 }}>
            <Field name="notes" label="Note for the rider (optional)" placeholder="Gate code, best time, nervous dog…" rows={2} textarea />
          </div>

          <h3 style={{ margin: "26px 0 10px", fontSize: 18 }}>Payment</h3>
          <div className="choice-grid">
            {[
              { value: "cod" as const, label: "Cash on delivery", hint: "Pay the rider when the order arrives", icon: <Wallet size={17} /> },
              { value: "transfer" as const, label: "Bank transfer", hint: "Meezan Bank — details on your confirmation", icon: <BadgeCheck size={17} /> },
              { value: "easypaisa" as const, label: "Easypaisa / JazzCash", hint: "Send the TID on WhatsApp after ordering", icon: <CreditCard size={17} /> },
            ].map((option) => (
              <label key={option.value} className="choice" data-checked={pay === option.value ? "true" : "false"} onClick={() => setPay(option.value)}>
                <input type="radio" name="payment" value={option.value} checked={pay === option.value} onChange={() => setPay(option.value)} />
                <span className="row" style={{ gap: 11 }}>
                  <span className="service-icon" style={{ width: 34, height: 34, marginBottom: 0 }}>{option.icon}</span>
                  <span className="col" style={{ gap: 2 }}><b>{option.label}</b><small>{option.hint}</small></span>
                </span>
              </label>
            ))}
          </div>

          <h3 style={{ margin: "26px 0 10px", fontSize: 18 }}>Promo code</h3>
          <div className="row" style={{ gap: 10 }}>
            <input className="input" style={{ maxWidth: 220 }} name="promo" value={promo} onChange={(e) => setPromo(e.target.value.toUpperCase())} placeholder="NEWPET10" />
            <button
              type="button" className="button button-ghost button-sm"
              onClick={() => setApplied(matchedPromo && subtotal >= matchedPromo.minSubtotal ? { code: matchedPromo.code, percent: matchedPromo.percent } : null)}
            >
              Apply
            </button>
            {applied ? <span className="pill pill-ok"><Lock size={12} /> {applied.code} applied</span> : null}
            {!applied && matchedPromo && subtotal < matchedPromo.minSubtotal ? <span className="tiny muted">Needs {money(matchedPromo.minSubtotal)} subtotal</span> : null}
          </div>
          {promoWorks && !applied ? (
            <p className="small" style={{ margin: "10px 0 0", color: "var(--ok)" }}>{matchedPromo?.label} — press Apply to use it.</p>
          ) : null}
        </div>
        <div className="app-card-foot">
          <Link href="/cart" className="button button-ghost button-sm"><ArrowLeft size={15} /> Back to basket</Link>
          <span className="spacer" />
          <span className="tiny muted">{state?.message ? <span className={state.ok ? "" : "field-error"}>{state.message}</span> : `Delivered by ${business.shortName} riders`}</span>
          <button className="button button-primary button-lg" type="submit" disabled={pending || !items.length}>
            {pending ? "Placing order…" : `Place order · ${money(liveTotal)}`}
          </button>
        </div>
      </form>

      <aside className="sticky-checkout">
        <div className="app-card">
          <div className="app-card-head"><h3 style={{ fontSize: 16 }}>Order summary</h3><span className="spacer" /><Link href="/cart" className="link-arrow" style={{ fontSize: 11.5 }}>Edit <Truck size={13} /></Link></div>
          <div className="app-card-body">
            {!ready ? <p className="muted small">Loading…</p> : items.length === 0 ? <p className="muted small">Your basket is empty.</p> : (
              <div className="list-plain" style={{ marginBottom: 14 }}>
                {items.map((line) => (
                  <div key={`${line.id}-${line.size ?? ""}`}>
                    <span className="tiny muted tnum" style={{ minWidth: 22 }}>{line.qty}×</span>
                    <span className="small" style={{ flex: 1, fontWeight: 650 }}>{line.name}</span>
                    <b className="small tnum">{money(line.price * line.qty)}</b>
                  </div>
                ))}
              </div>
            )}
            <div className="fee-row"><span>Subtotal</span><b>{money(subtotal)}</b></div>
            <div className="fee-row"><span>Promo discount</span><b>{liveDiscount ? `− ${money(liveDiscount)}` : money(discount)}</b></div>
            <div className="fee-row"><span>Delivery</span><b>{liveDelivery ? money(liveDelivery) : "Free"}</b></div>
            <div className="fee-row fee-total"><span>Total</span><b>{money(liveTotal)}</b></div>
          </div>
        </div>
        <div className="note" style={{ marginTop: 14 }}><Truck size={16} /> Orders confirmed before 4 pm are delivered the same day inside Lahore; later orders go out next morning.</div>
      </aside>
    </div>
  );
}

function Field({ name, label, error, required, placeholder, type = "text", rows, textarea }: { name: string; label: string; error?: string; required?: boolean; placeholder?: string; type?: string; rows?: number; textarea?: boolean }) {
  return (
    <div className="field">
      <label htmlFor={`co-${name}`}>{label}{required ? " *" : ""}</label>
      {textarea ? (
        <textarea id={`co-${name}`} name={name} className={`textarea${error ? " input-error" : ""}`} rows={rows ?? 3} placeholder={placeholder} defaultValue="" />
      ) : (
        <input id={`co-${name}`} name={name} type={type} className={`input${error ? " input-error" : ""}`} placeholder={placeholder} defaultValue="" />
      )}
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  );
}
