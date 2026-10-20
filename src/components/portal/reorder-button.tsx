"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { reorderOrder } from "@/server/actions/shop";

export function ReorderButton({ orderId }: { orderId: string }) {
  const { add } = useCart();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      className="button button-ghost button-xs"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const result = await reorderOrder(orderId);
          if (result.ok && result.items) {
            for (const item of result.items) add(item.id, item.qty, item.size);
            setDone(true);
            router.push("/cart");
          }
        })
      }
    >
      {done ? <Check size={13} /> : <RotateCcw size={13} />} {pending ? "Adding…" : done ? "Added" : "Reorder"}
    </button>
  );
}
