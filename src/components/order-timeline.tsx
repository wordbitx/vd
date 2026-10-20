import { Check, ClipboardList, Package, PackageCheck, Truck, X } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

const STEPS: { key: OrderStatus; label: string; icon: typeof ClipboardList }[] = [
  { key: "pending", label: "Order received", icon: ClipboardList },
  { key: "confirmed", label: "Confirmed", icon: Check },
  { key: "packed", label: "Packed", icon: Package },
  { key: "out-for-delivery", label: "Out for delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: PackageCheck },
];

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="inline-alert danger" role="status">
        <X size={18} /><span>This order was cancelled. If you paid in advance, our team will arrange your refund — please WhatsApp us with the order reference.</span>
      </div>
    );
  }
  const currentIndex = STEPS.findIndex((step) => step.key === status);
  return (
    <div className="status-timeline" aria-label="Order progress">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "";
        return (
          <div className={`tl-step ${state}`} key={step.key}>
            <span className="tl-dot"><Icon size={14} /></span>
            <small>{step.label}</small>
          </div>
        );
      })}
    </div>
  );
}
