"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { ProductImage } from "@/components/product-image";
import { pkr } from "@/lib/format";

export function CartView({ deliveryFee = 250, freeAbove = 5000 }: { deliveryFee?: number; freeAbove?: number }) {
  const { items, subtotal, ready, updateQuantity, removeItem, clearCart } = useCart();
  if (!ready) return <div className="loading-state" role="status">Loading your cart…</div>;
  if (!items.length) {
    return (
      <div className="empty-state cart-empty">
        <ShoppingBag size={31} />
        <h2>Your cart is feeling light.</h2>
        <p>Add something your pet will love from the Pet Mall — food, toys, grooming and more, delivered across Lahore.</p>
        <Link href="/shop" className="button button-primary">Browse the Pet Mall <ArrowRight size={17} /></Link>
      </div>
    );
  }
  const delivery = subtotal >= freeAbove ? 0 : deliveryFee;
  const awayFromFree = Math.max(0, freeAbove - subtotal);

  return (
    <div className="cart-layout">
      <div className="cart-items">
        <div className="cart-items-heading">
          <h2>{items.length} {items.length === 1 ? "product" : "products"} <span>· {items.reduce((sum, item) => sum + item.quantity, 0)} items</span></h2>
          <button type="button" onClick={clearCart}>Clear cart</button>
        </div>
        {items.map((item) => (
          <div className="cart-item" key={item.id}>
            <Link href={`/shop/${item.slug}`} className="cart-item-image" aria-label={item.name}>
              <ProductImage product={item} />
            </Link>
            <div className="cart-item-main">
              <h3><Link href={`/shop/${item.slug}`}>{item.name}</Link></h3>
              <p>{item.unit ? `${item.unit} · ` : ""}{pkr(item.price)} each</p>
              <div className="cart-item-controls">
                <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity" disabled={item.quantity <= 1}><Minus size={15} /></button>
                  <span aria-live="polite">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity" disabled={item.quantity >= 99}><Plus size={15} /></button>
                </div>
                <strong style={{ color: "#0a2540", fontSize: 15 }}>{pkr(item.price * item.quantity)}</strong>
                <button type="button" className="remove-item" onClick={() => removeItem(item.id)}><Trash2 size={14} /> Remove</button>
              </div>
            </div>
          </div>
        ))}
        <Link href="/shop" className="back-link"><ArrowLeft size={16} /> Continue shopping</Link>
      </div>
      <aside className="cart-summary">
        <span className="eyebrow">ORDER SUMMARY</span>
        <h2>{pkr(subtotal + delivery)}</h2>
        <div className="cart-summary-row"><span>Subtotal</span><strong>{pkr(subtotal)}</strong></div>
        <div className="cart-summary-row"><span>Delivery (Lahore)</span><strong>{delivery === 0 ? "FREE" : pkr(delivery)}</strong></div>
        <p>
          <Truck size={14} style={{ verticalAlign: -2, marginRight: 5 }} />
          {awayFromFree > 0
            ? `Add ${pkr(awayFromFree)} more for free delivery.`
            : "You've unlocked free delivery!"}{" "}
          Pay cash on delivery, Easypaisa, JazzCash or bank transfer.
        </p>
        <Link href="/checkout" className="button button-gold">Proceed to checkout <ArrowRight size={16} /></Link>
        <small>Final prices &amp; stock are confirmed when your order is placed. You&apos;ll receive a printable invoice instantly.</small>
      </aside>
    </div>
  );
}
