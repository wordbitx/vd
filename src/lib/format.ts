// Formatting and small domain helpers (client-safe).
import type { AppointmentStatus, OrderStatus, PaymentMethod } from "./types";

export function pkr(value: number): string {
  return `Rs ${Math.round(value).toLocaleString("en-PK")}`;
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export function todayIso(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Bookable time slots (hospital reported hours 8:00 AM – 11:30 PM). */
export const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 9; h <= 22; h++) {
    for (const m of [0, 30]) {
      if (h === 22 && m === 30) break;
      const hour12 = h > 12 ? h - 12 : h;
      slots.push(`${hour12}:${m === 0 ? "00" : "30"} ${h >= 12 ? "PM" : "AM"}`);
    }
  }
  return slots;
})();

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Pending confirmation",
  confirmed: "Confirmed",
  "checked-in": "Checked in",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No-show",
};

export const APPOINTMENT_STATUS_TONES: Record<AppointmentStatus, string> = {
  pending: "tone-amber",
  confirmed: "tone-blue",
  "checked-in": "tone-violet",
  completed: "tone-green",
  cancelled: "tone-red",
  "no-show": "tone-grey",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Order received",
  confirmed: "Confirmed",
  packed: "Packed",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_TONES: Record<OrderStatus, string> = {
  pending: "tone-amber",
  confirmed: "tone-blue",
  packed: "tone-violet",
  "out-for-delivery": "tone-violet",
  delivered: "tone-green",
  cancelled: "tone-red",
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  easypaisa: "Easypaisa",
  jazzcash: "JazzCash",
  bank: "Bank Transfer",
};

export function petAgeFromDob(pet: { dob: string }): string {
  if (!pet.dob) return "—";
  // Accept free-text ages like "2 years" as-is if not an ISO date.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pet.dob)) return pet.dob;
  const dob = new Date(`${pet.dob}T00:00:00`);
  const now = new Date();
  let months = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
  if (now.getDate() < dob.getDate()) months -= 1;
  if (months < 0) return "—";
  if (months < 1) return "Under 1 month";
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest ? `${years}y ${rest}m` : `${years} year${years === 1 ? "" : "s"}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/** Deterministic decorative barcode bars from a reference string (for slips/passports). */
export function barcodeBars(ref: string, count = 42): number[] {
  const bars: number[] = [];
  let seed = 7;
  for (const ch of ref) seed = (seed * 31 + ch.charCodeAt(0)) % 9973;
  for (let i = 0; i < count; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    bars.push(1 + (seed % 4));
  }
  return bars;
}
