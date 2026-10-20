"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import { money } from "@/lib/format";
import { useCart } from "@/components/cart-context";

export function ProductBuyPanel({ product }: { product: { id: string; slug: string; price: number; stock: number; sizes?: string[] } }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string | undefined>(product.sizes?.[0]);
  const [added, setAdded] = useState(false);
  const cap = Math.max(1, Math.min(20, product.stock || 1));

  return (
    <div className="col" style={{ gap: 14, marginTop: 14 }}>
      {product.sizes?.length ? (
        <div className="col" style={{ gap: 7 }}>
          <span className="label">Choose size</span>
          <div className="chip-row">
            {product.sizes.map((option) => (
              <button key={option} type="button" className="chip" data-active={size === option ? "true" : undefined} onClick={() => setSize(option)}>{option}</button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="row-between" style={{ gap: 14 }}>
        <span className="qty">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={14} /></button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(cap, q + 1))} aria-label="Increase quantity"><Plus size={14} /></button>
        </span>
        <span className="price"><small>Total</small><b>{money(product.price * qty)}</b></span>
        <button
          type="button"
          className="button button-primary button-lg"
          disabled={product.stock <= 0}
          onClick={() => {
            add(product.id, qty, size);
            setAdded(true);
            window.setTimeout(() => {
              setAdded(false);
              router.push("/checkout");
            }, 550);
          }}
        >
          {added ? <Check size={16} /> : null} {product.stock <= 0 ? "Sold out" : added ? "Added" : "Buy now"} {!added && product.stock > 0 ? <ArrowRight size={16} /> : null}
        </button>
      </div>
      {product.stock > 0 && product.stock <= 6 ? <p className="tiny" style={{ color: "var(--warn)", margin: 0, fontWeight: 750 }}>Low stock — only {product.stock} left in the Al Kabir Town storeroom.</p> : null}
    </div>
  );
}
