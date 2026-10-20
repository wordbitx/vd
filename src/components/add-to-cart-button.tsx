"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart, type CartSnapshot } from "@/components/cart-context";

export function AddToCartButton({ product, className = "", compact = false, disabled = false }: { product: CartSnapshot; className?: string; compact?: boolean; disabled?: boolean }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 2200);
    return () => window.clearTimeout(timer);
  }, [added]);
  return (
    <button
      type="button"
      className={`add-cart-button ${compact ? "add-cart-compact" : ""} ${className}`}
      onClick={() => { addItem(product); setAdded(true); }}
      disabled={disabled}
      aria-label={disabled ? `${product.name} is out of stock` : added ? "Added to cart" : `Add ${product.name} to cart`}
    >
      {added ? <Check size={16} strokeWidth={2.4} /> : <Plus size={16} strokeWidth={2.4} />}
      {!compact && <span>{disabled ? "Out of stock" : added ? "Added to cart" : "Add to cart"}</span>}
    </button>
  );
}
