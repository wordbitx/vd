"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { products, whatsappUrl } from "@/lib/site";

type Review = { name: string; phone: string; note: string };

export function CheckoutView() {
  const { items, ready } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [review, setReview] = useState<Review | null>(null);
  const entries = items.map((item) => ({ item, product: products.find((product) => product.id === item.id) })).filter((entry): entry is { item: typeof items[number]; product: typeof products[number] } => Boolean(entry.product));
  if (!ready) return <div className="loading-state" role="status">Loading your enquiry...</div>;
  if (!entries.length) return <div className="empty-state cart-empty"><ShoppingBag size={31} /><h2>There’s nothing to enquire about yet.</h2><p>Add a product to your demo cart first, then return here to review your enquiry.</p><Link href="/shop" className="button button-primary">Browse products <ArrowRight size={17} /></Link></div>;
  const message = review ? `Hello Jawad Veterinary Hospital, I would like to enquire about these pet shop items:\n${entries.map(({ item, product }) => `• ${product.name} × ${item.quantity}`).join("\n")}\n\nName: ${review.name}\nPhone: ${review.phone}${review.note ? `\nNotes: ${review.note}` : ""}\n\nPlease confirm availability and prices. I understand this is an enquiry, not a confirmed order.` : "";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) nextErrors.name = "Please enter your name.";
    if (!phone.trim()) nextErrors.phone = "Please enter a phone number.";
    else if (phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Please enter a valid phone number (at least 10 digits).";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setReview({ name: name.trim(), phone: phone.trim(), note: note.trim() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return <div className="checkout-layout"><div className="checkout-main">{review ? <div className="review-panel" role="status"><span className="success-icon"><Check size={27} /></span><span className="eyebrow">READY FOR YOUR REVIEW</span><h2>Your enquiry is prepared — not sent yet.</h2><p>Please check the items and your details below. If everything looks right, open WhatsApp to send your message to the verified hospital number. The hospital must confirm price, stock and any order details.</p><div className="review-message"><h3>Message preview</h3><pre>{message}</pre></div><a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="button button-primary"><MessageCircle size={18} /> Open WhatsApp to send <ArrowRight size={16} /></a><button type="button" className="back-link review-edit" onClick={() => setReview(null)}><ArrowLeft size={16} /> Edit details</button></div> : <><span className="eyebrow"><span className="eyebrow-line" /> STEP 01 OF 02</span><h2>Tell us who’s enquiring.</h2><p className="form-intro">We’ll prepare a message for you to review. This demo does not submit your details to a server or place an order.</p><form className="form-grid" onSubmit={submit} noValidate><div className="field"><label htmlFor="order-name">Your name <span>*</span></label><input id="order-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "order-name-error" : undefined} placeholder="Your full name" />{errors.name && <small id="order-name-error" className="field-error">{errors.name}</small>}</div><div className="field"><label htmlFor="order-phone">Phone number <span>*</span></label><input id="order-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "order-phone-error" : undefined} placeholder="e.g. 0300 1234567" />{errors.phone && <small id="order-phone-error" className="field-error">{errors.phone}</small>}</div><div className="field field-full"><label htmlFor="order-note">Anything we should know? <span className="optional">Optional</span></label><textarea id="order-note" value={note} onChange={(event) => setNote(event.target.value)} rows={4} placeholder="Questions about size, type, or collection..." /></div><div className="field-full"><button type="submit" className="button button-primary">Review enquiry <ArrowRight size={17} /></button></div></form></>}</div><aside className="cart-summary checkout-summary"><span className="eyebrow">YOUR DEMO BASKET</span><h2>{entries.length} {entries.length === 1 ? "product" : "products"}</h2>{entries.map(({ item, product }) => <div className="checkout-item" key={product.id}><span>{product.name} <small>× {item.quantity}</small></span><strong>On enquiry</strong></div>)}<p>Actual prices and availability are not connected to this preview. No payment will be collected here.</p><Link href="/cart" className="back-link"><ArrowLeft size={16} /> Edit cart</Link></aside></div>;
}
