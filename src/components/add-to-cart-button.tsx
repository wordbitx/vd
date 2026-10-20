"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/components/cart-context";

export function AddToCartButton({ productId, className = "", compact = false }: { productId: string; className?: string; compact?: boolean }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 2200);
    return () => window.clearTimeout(timer);
  }, [added]);
  return (
    <button type="button" className={`add-cart-button ${compact ? "add-cart-compact" : ""} ${className}`} onClick={() => { addItem(productId); setAdded(true); }} aria-label={added ? "Added to demo cart" : "Add to demo cart"}>
      {added ? <Check size={16} strokeWidth={2.4} /> : <Plus size={16} strokeWidth={2.4} />}
      {!compact && <span>{added ? "Added to cart" : "Add to cart"}</span>}
    </button>
  );
}
