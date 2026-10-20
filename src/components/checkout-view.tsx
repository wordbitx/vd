"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Banknote, Building2, Loader2, ShieldCheck, ShoppingBag, Smartphone } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { lahoreAreas } from "@/lib/catalog";
import { pkr } from "@/lib/format";
import type { Order, PaymentMethod, User } from "@/lib/types";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string; icon: typeof Banknote }[] = [
  { value: "cod", label: "Cash on Delivery", hint: "Pay when your order arrives", icon: Banknote },
  { value: "easypaisa", label: "Easypaisa", hint: "We'll WhatsApp our account number", icon: Smartphone },
  { value: "jazzcash", label: "JazzCash", hint: "We'll WhatsApp our account number", icon: Smartphone },
  { value: "bank", label: "Bank Transfer", hint: "Account details shared on WhatsApp", icon: Building2 },
];

export function CheckoutView({ deliveryFee = 250, freeAbove = 5000 }: { deliveryFee?: number; freeAbove?: number }) {
  const router = useRouter();
  const { items, subtotal, ready, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Lahore");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { user: User | null }) => {
        if (data.user) {
          setSignedIn(true);
          setName((value) => value || data.user!.name);
          setPhone((value) => value || data.user!.phone);
          setEmail((value) => value || data.user!.email);
          setAddress((value) => value || data.user!.address);
        }
      })
      .catch(() => undefined);
  }, []);

  if (!ready) return <div className="loading-state" role="status">Loading checkout…</div>;
  if (!items.length) {
    return (
      <div className="empty-state cart-empty">
        <ShoppingBag size={31} />
        <h2>Your cart is empty.</h2>
        <p>Add a product from the Pet Mall first, then return here to place your order.</p>
        <Link href="/shop" className="button button-primary">Browse products <ArrowRight size={17} /></Link>
      </div>
    );
  }

  const delivery = subtotal >= freeAbove ? 0 : deliveryFee;
  const total = subtotal + delivery;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Please enter your full name.";
    if (phone.replace(/\D/g, "").length < 10) next.phone = "Please enter a valid mobile number.";
    if (address.trim().length < 10) next.address = "Please enter your complete delivery address.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPlacing(true);
    setFormError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(), phone: phone.trim(), email: email.trim(),
          address: address.trim(), area, city: city.trim() || "Lahore", notes: notes.trim(),
          paymentMethod,
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        }),
      });
      const data = (await res.json()) as { order?: Order; error?: string };
      if (!res.ok || !data.order) throw new Error(data.error ?? "Could not place your order. Please try again.");
      clearCart();
      router.push(`/checkout/success/${data.order.ref}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not place your order. Please try again or WhatsApp us.");
      setPlacing(false);
    }
  }

  return (
    <div className="checkout-layout">
      <div className="checkout-main">
        <span className="eyebrow"><span className="eyebrow-line" /> DELIVERY DETAILS</span>
        <h2 style={{ fontSize: 24, marginTop: 10 }}>Where should we deliver?</h2>
        <p className="form-intro">
          {signedIn
            ? "You're signed in — this order will be saved to your portal for easy tracking."
            : <>Checking out as guest. <Link href="/login?redirectTo=/checkout" style={{ fontWeight: 800, color: "#9d7c43", textDecoration: "underline" }}>Log in</Link> to track this order in your portal.</>}
        </p>
        {formError && <div className="form-error-summary" role="alert" style={{ marginBottom: 16 }}>{formError}</div>}
        <form className="form-grid" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="co-name">Full name <span>*</span></label>
            <input id="co-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your full name" aria-invalid={Boolean(errors.name)} />
            {errors.name && <small className="field-error">{errors.name}</small>}
          </div>
          <div className="field">
            <label htmlFor="co-phone">Mobile / WhatsApp <span>*</span></label>
            <input id="co-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="0300 1234567" aria-invalid={Boolean(errors.phone)} />
            {errors.phone && <small className="field-error">{errors.phone}</small>}
          </div>
          <div className="field field-full">
            <label htmlFor="co-email">Email address <span className="optional">Optional</span></label>
            <input id="co-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
          </div>
          <div className="field field-full">
            <label htmlFor="co-address">Complete address <span>*</span></label>
            <textarea id="co-address" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" placeholder="House, street, block, nearest landmark" aria-invalid={Boolean(errors.address)} />
            {errors.address && <small className="field-error">{errors.address}</small>}
          </div>
          <div className="field">
            <label htmlFor="co-area">Area</label>
            <select id="co-area" value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="">Select area</option>
              {lahoreAreas.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="co-city">City</label>
            <input id="co-city" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
          </div>
          <div className="field field-full">
            <label>Payment method <span>*</span></label>
            <div className="service-chips" role="radiogroup" aria-label="Payment method">
              {PAYMENT_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button type="button" key={option.value} role="radio" aria-checked={paymentMethod === option.value} className={`service-chip ${paymentMethod === option.value ? "selected" : ""}`} onClick={() => setPaymentMethod(option.value)}>
                    <span className="sc-icon"><Icon size={19} /></span>
                    <span><strong>{option.label}</strong><small>{option.hint}</small></span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="field field-full">
            <label htmlFor="co-notes">Delivery notes <span className="optional">Optional</span></label>
            <textarea id="co-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Rider instructions, preferred time…" />
          </div>
          <div className="field-full" style={{ display: "flex", gap: 11, flexWrap: "wrap", alignItems: "center" }}>
            <button type="submit" className="button button-gold button-large" disabled={placing}>
              {placing ? <Loader2 size={17} className="spin" /> : <ShieldCheck size={17} />}
              {placing ? "Placing order…" : `Place order · ${pkr(total)}`}
            </button>
            <span style={{ fontSize: 11, color: "#7a868e", lineHeight: 1.6 }}>
              {paymentMethod === "cod" ? "Pay in cash when your order arrives." : "Our team will WhatsApp payment details to confirm your order."}
            </span>
          </div>
        </form>
      </div>
      <aside className="cart-summary checkout-summary">
        <span className="eyebrow">YOUR ORDER</span>
        <h2>{items.reduce((sum, item) => sum + item.quantity, 0)} items</h2>
        {items.map((item) => (
          <div className="checkout-item" key={item.id}>
            <span>{item.name} <small>× {item.quantity}</small></span>
            <strong>{pkr(item.price * item.quantity)}</strong>
          </div>
        ))}
        <div className="cart-summary-row"><span>Subtotal</span><strong>{pkr(subtotal)}</strong></div>
        <div className="cart-summary-row"><span>Delivery</span><strong>{delivery === 0 ? "FREE" : pkr(delivery)}</strong></div>
        <div className="cart-summary-row" style={{ borderBottom: 0 }}><span><strong style={{ fontSize: 13 }}>Total</strong></span><strong style={{ fontSize: 16 }}>{pkr(total)}</strong></div>
        <p>Your printable invoice is generated instantly when the order is placed. We&apos;ll call or WhatsApp to confirm delivery timing.</p>
        <Link href="/cart" className="back-link"><ArrowLeft size={16} /> Edit cart</Link>
      </aside>
    </div>
  );
}
