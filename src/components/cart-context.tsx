"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ProductImageKind } from "@/lib/types";

export type CartSnapshot = {
  id: string;
  slug: string;
  name: string;
  unit: string;
  price: number; // selling price snapshot (re-validated server-side at checkout)
  imageKind: ProductImageKind;
  imageUrl: string;
  categorySlug: string;
};

export type CartItem = CartSnapshot & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  addItem: (product: CartSnapshot, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "jawad-vet-cart-v2";
const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" && typeof item.slug === "string" && typeof item.name === "string" &&
    typeof item.price === "number" && typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (Array.isArray(parsed)) setItems(parsed.filter(isCartItem));
        }
      } catch {
        // Corrupt storage — start with an empty cart.
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full/blocked — cart still works in memory.
    }
  }, [items, ready]);

  const addItem = useCallback((product: CartSnapshot, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, ...product, quantity: Math.min(99, item.quantity + quantity) } : item);
      }
      return [...current, { ...product, quantity: Math.min(99, Math.max(1, quantity)) }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => quantity <= 0
      ? current.filter((item) => item.id !== id)
      : current.map((item) => item.id === id ? { ...item, quantity: Math.min(99, quantity) } : item));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    ready,
    addItem, updateQuantity, removeItem, clearCart,
  }), [items, ready, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
