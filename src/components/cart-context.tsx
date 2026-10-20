"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products } from "@/lib/site";

type CartItem = { id: string; quantity: number };
type CartContextValue = {
  items: CartItem[];
  count: number;
  ready: boolean;
  addItem: (id: string, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "jawad-vet-demo-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);
const validIds = new Set(products.map((product) => product.id));

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setItems(parsed.filter((item): item is CartItem =>
              typeof item === "object" && item !== null &&
              typeof item.id === "string" && validIds.has(item.id) &&
              typeof item.quantity === "number" && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99
            ));
          }
        }
      } catch {
        // A blocked or invalid localStorage value should never stop the shop working.
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* Storage may be disabled. */ }
  }, [items, ready]);

  const addItem = useCallback((id: string, quantity = 1) => {
    if (!validIds.has(id)) return;
    setItems((current) => {
      const found = current.find((item) => item.id === id);
      if (found) return current.map((item) => item.id === id ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item);
      return [...current, { id, quantity: Math.min(99, Math.max(1, quantity)) }];
    });
  }, []);
  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(99, quantity)) } : item));
  }, []);
  const removeItem = useCallback((id: string) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const clearCart = useCallback(() => setItems([]), []);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const value = useMemo(() => ({ items, count, ready, addItem, updateQuantity, removeItem, clearCart }), [items, count, ready, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
