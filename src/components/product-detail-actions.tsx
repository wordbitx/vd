"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, MessageCircle, Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { toCartSnapshot } from "@/components/cards";
import { whatsappUrl } from "@/lib/site";
import type { StoreProduct } from "@/lib/types";

export function ProductDetailActions({ product }: { product: StoreProduct }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const out = product.stock <= 0;
  const max = Math.max(1, Math.min(99, product.stock));

  const add = () => {
    addItem(toCartSnapshot(product), quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  };
  const buyNow = () => {
    addItem(toCartSnapshot(product), quantity);
    router.push("/checkout");
  };

  return (
    <div className="product-purchase">
      <div className="purchase-row">
        <div className="quantity-control" aria-label="Quantity">
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity" disabled={quantity <= 1 || out}><Minus size={16} /></button>
          <span aria-live="polite">{quantity}</span>
          <button type="button" onClick={() => setQuantity((value) => Math.min(max, value + 1))} aria-label="Increase quantity" disabled={quantity >= max || out}><Plus size={16} /></button>
        </div>
        <button type="button" className="button button-primary" onClick={add} disabled={out}>
          {added ? <Check size={17} /> : <ShoppingBag size={17} />}
          {out ? "Out of stock" : added ? "Added to cart" : "Add to Cart"}
        </button>
        <button type="button" className="button button-gold" onClick={buyNow} disabled={out}><Zap size={16} /> Buy Now</button>
      </div>
      {added && <Link href="/cart" className="product-cart-link">View your cart <ArrowRight size={16} /></Link>}
      <a href={whatsappUrl(`Hello Jawad Pet Mall, I have a question about "${product.name}" (${product.unit}).`)} target="_blank" rel="noopener noreferrer" className="button button-outline product-whatsapp">
        <MessageCircle size={17} /> Ask about this item on WhatsApp
      </a>
      <p>Pay cash on delivery, Easypaisa, JazzCash or bank transfer at checkout. Prices include all taxes.</p>
    </div>
  );
}
