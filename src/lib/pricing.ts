import { fees, timeSlots } from "@/lib/site";
import type { FeeLine, OrderItem, Settings } from "@/lib/types";

export const ADDONS: { id: string; label: string; hint: string; amount: number }[] = [
  { id: "lab-kit", label: "Lab sample collection kit", hint: "Blood / urine drawn on the spot and couriered to the lab", amount: fees.addOnLabKit },
  { id: "follow-up", label: "Follow-up visit within 7 days", hint: "Recheck, dressing change or suture removal", amount: fees.addOnFollowUp },
  { id: "nebulisation", label: "Nebulisation session", hint: "For respiratory distress or kennel cough", amount: fees.addOnNebulisation },
];

export type QuoteInput = {
  servicePrice: number;
  mode: "home" | "clinic";
  urgency: "standard" | "emergency";
  slotId?: string;
  addOns?: string[];
  settings?: Pick<Settings, "visitHomeStandard" | "visitHomeEmergency" | "visitClinic" | "nightSurcharge" | "taxPercent">;
  credit?: number;
};

/** Line-item quote for a visit. Every charge is shown before the client confirms. */
export function quoteAppointment({ servicePrice, mode, urgency, slotId, addOns = [], settings, credit = 0 }: QuoteInput) {
  const s = { ...fees, ...settings };
  const lines: FeeLine[] = [{ label: "Professional fee", amount: servicePrice, kind: "charge" }];

  if (mode === "home") {
    lines.push({
      label: urgency === "emergency" ? "Home visit — emergency dispatch" : "Home visit charge within Lahore",
      amount: urgency === "emergency" ? s.visitHomeEmergency : s.visitHomeStandard,
      kind: "charge",
    });
    if (slotId === "night") lines.push({ label: "Night slot surcharge", amount: s.nightSurcharge, kind: "charge" });
  } else {
    lines.push({ label: "Hospital consultation (Al Kabir Town)", amount: s.visitClinic, kind: "charge" });
  }

  for (const id of addOns) {
    const addon = ADDONS.find((a) => a.id === id);
    if (addon) lines.push({ label: addon.label, amount: addon.amount, kind: "charge" });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);
  const tax = Math.round((subtotal * (s.taxPercent || 0)) / 100);
  if (tax) lines.push({ label: `Withholding / GST ${s.taxPercent}%`, amount: tax, kind: "charge" });
  if (credit) lines.push({ label: "Portal credit applied", amount: -credit, kind: "credit" });
  const total = Math.max(0, subtotal + tax - credit);
  const travel = mode === "home" ? (urgency === "emergency" ? s.visitHomeEmergency : s.visitHomeStandard) : 0;

  return {
    lines,
    subtotal,
    tax,
    credit,
    total,
    travel,
    slot: timeSlots.find((t) => t.id === slotId) ?? timeSlots[timeSlots.length - 1],
    breakdown: lines.map((l) => ({ ...l, amount: Math.abs(l.amount), negative: l.amount < 0 })),
  };
}

export function quoteOrder(items: OrderItem[], settings?: Partial<Pick<Settings, "deliveryLahore" | "freeDeliveryOver">>, promo?: { percent: number; minSubtotal: number } | null) {
  const s = { ...fees, ...settings };
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  let discount = promo && subtotal >= promo.minSubtotal ? Math.round((subtotal * promo.percent) / 100) : 0;
  if (promo && discount && subtotal < promo.minSubtotal) discount = 0;
  const payable = subtotal - discount;
  const delivery = payable >= s.freeDeliveryOver || payable === 0 ? 0 : s.deliveryLahore;
  return { items, count, subtotal, discount, delivery, total: Math.max(0, payable + delivery), freeDeliveryGap: Math.max(0, s.freeDeliveryOver - payable) };
}

export const slotWindow = (id: string) => timeSlots.find((t) => t.id === id)?.window ?? "We call to confirm";
export const slotLabel = (id: string) => timeSlots.find((t) => t.id === id)?.label ?? "Any time";
