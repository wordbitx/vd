"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { quoteOrder } from "@/lib/pricing";
import type { OrderItem } from "@/lib/types";

/** Cart lines live in localStorage; prices are always recomputed from the server catalogue. */
export type CatalogLine = { id: string; slug: string; name: string; price: number; image: string; stock: number; sizes?: string[] };
type RawLine = { id: string; qty: number; size?: string };

type CartValue = {
  ready: boolean;
  raw: RawLine[];
  items: (RawLine & OrderItem)[];
  count: number;
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  freeDeliveryGap: number;
  add: (id: string, qty?: number, size?: string) => void;
  setQty: (id: string, qty: number, size?: string) => void;
  remove: (id: string, size?: string) => void;
  clear: () => void;
  qtyOf: (id: string) => number;
};

const STORAGE_KEY = "jvh.cart.v1";
const CartContext = createContext<CartValue | null>(null);
const keyOf = (id: string, size?: string) => `${id}::${size ?? ""}`;

export function CartProvider({ catalog, deliveryFee = 250, freeOver = 5000, children }: { catalog: CatalogLine[]; deliveryFee?: number; freeOver?: number; children: ReactNode }) {
  const [raw, setRaw] = useState<RawLine[]>([]);
  const [ready, setReady] = useState(false);
  const byId = useMemo(() => new Map(catalog.map((p) => [p.id, p])), [catalog]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setRaw(
              parsed.filter(
                (line): line is RawLine =>
                  !!line && typeof line === "object" && typeof (line as RawLine).id === "string" &&
                  typeof (line as RawLine).qty === "number" && (line as RawLine).qty > 0,
              ),
            );
          }
        }
      } catch {
        /* a blocked or malformed value must never break the shop */
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      /* storage disabled */
    }
  }, [raw, ready]);

  const add = useCallback((id: string, qty = 1, size?: string) => {
    const product = byId.get(id);
    if (!product) return;
    setRaw((current) => {
      const key = keyOf(id, size);
      const found = current.find((line) => keyOf(line.id, line.size) === key);
      const cap = Math.max(1, Math.min(20, product.stock || 20));
      if (found) return current.map((line) => (keyOf(line.id, line.size) === key ? { ...line, qty: Math.min(cap, line.qty + qty) } : line));
      return [...current, { id, qty: Math.min(cap, Math.max(1, qty)), size }];
    });
  }, [byId]);

  const setQty = useCallback((id: string, qty: number, size?: string) => {
    setRaw((current) =>
      current
        .map((line) => (keyOf(line.id, line.size) === keyOf(id, size) ? { ...line, qty: Math.max(0, Math.min(20, qty)) } : line))
        .filter((line) => line.qty > 0),
    );
  }, []);

  const remove = useCallback((id: string, size?: string) => {
    setRaw((current) => current.filter((line) => keyOf(line.id, line.size) !== keyOf(id, size)));
  }, []);

  const clear = useCallback(() => setRaw([]), []);

  const items = useMemo(
    () =>
      raw.flatMap<RawLine & OrderItem>((line) => {
        const product = byId.get(line.id);
        if (!product) return [];
        return [{ ...line, productId: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image }];
      }),
    [raw, byId],
  );

  const quote = useMemo(() => quoteOrder(items, { deliveryLahore: deliveryFee, freeDeliveryOver: freeOver }), [items, deliveryFee, freeOver]);
  const value = useMemo<CartValue>(
    () => ({
      ready, raw, items, count: quote.count, subtotal: quote.subtotal, delivery: quote.delivery, discount: quote.discount,
      total: quote.total, freeDeliveryGap: quote.freeDeliveryGap, add, setQty, remove, clear,
      qtyOf: (id: string) => raw.filter((l) => l.id === id).reduce((s, l) => s + l.qty, 0),
    }),
    [ready, raw, items, quote, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
