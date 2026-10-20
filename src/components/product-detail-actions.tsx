"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { whatsappUrl, type Product } from "@/lib/site";

export function ProductDetailActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  return <div className="product-purchase"><div className="purchase-row"><div className="quantity-control" aria-label="Quantity"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity" disabled={quantity <= 1}><Minus size={16} /></button><span aria-live="polite">{quantity}</span><button type="button" onClick={() => setQuantity((value) => Math.min(99, value + 1))} aria-label="Increase quantity" disabled={quantity >= 99}><Plus size={16} /></button></div><button type="button" className="button button-primary" onClick={() => { addItem(product.id, quantity); setAdded(true); }}>{added ? <Check size={17} /> : <ShoppingBag size={17} />}{added ? "Added to demo cart" : "Add to demo cart"}</button></div>{added && <Link href="/cart" className="product-cart-link">View your cart <ArrowRight size={16} /></Link>}<a href={whatsappUrl(`Hello Jawad Veterinary Hospital, I would like to enquire about ${product.name}. Could you please confirm availability and price?`)} target="_blank" rel="noopener noreferrer" className="button button-outline product-whatsapp"><MessageCircle size={17} /> Enquire about this item on WhatsApp</a><p>No online payment or live stock is connected to this preview. Adding an item does not reserve it.</p></div>;
}
