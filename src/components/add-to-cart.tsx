"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/components/cart-context";

export function AddToCart({ id, disabled = false, size, label = "Add", className = "button button-primary button-sm" }: { id: string; disabled?: boolean; size?: string; label?: string; className?: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={() => {
        add(id, 1, size);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? <Check size={15} /> : <Plus size={15} />} {added ? "In basket" : disabled ? "Sold out" : label}
    </button>
  );
}

export default AddToCart;
