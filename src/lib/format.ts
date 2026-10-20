const pkr = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

export const money = (n: number) => `Rs. ${pkr.format(Math.round(n || 0))}`;
export const moneyShort = (n: number) => (n >= 100000 ? `${(n / 1000).toFixed(0)}k` : pkr.format(Math.round(n || 0)));
export const num = (n: number) => pkr.format(Math.round(n || 0));

export function dateLabel(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")} ${d.toLocaleString("en-GB", { month: "short" })} ${d.getFullYear()}`;
}

export function dateShort(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toLocaleString("en-GB", { weekday: "short" })}, ${dateLabel(iso)}`;
}

export function dateTimeLabel(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")} ${d.toLocaleString("en-GB", { month: "short" })} ${d.getFullYear()}, ${d.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

export function ago(iso: string) {
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "";
  const mins = Math.round((Date.now() - d) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function daysUntil(iso?: string) {
  if (!iso) return null;
  const target = new Date(`${iso}T00:00:00`).getTime();
  if (Number.isNaN(target)) return null;
  return Math.ceil((target - Date.now()) / 86400000);
}

/** The clinic operates in Karachi time; a UTC date is a day behind after 7 pm. */
export const PK_TZ = "Asia/Karachi";

const pkDate = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: PK_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);

/** Today in Lahore, as YYYY-MM-DD. */
export const todayISO = () => pkDate(new Date());

export function shiftISO(days: number, from = new Date()) {
  const d = new Date(from.getTime() + days * 86400000);
  return pkDate(d);
}

export const nextISO = (days: number) => shiftISO(days);

export function addMonths(iso: string, months: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export const ageFrom = (dob?: string) => {
  if (!dob) return "";
  const d = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  const months = Math.max(0, Math.round((Date.now() - d.getTime()) / 2629800000));
  if (months < 12) return `${months} mo`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m ? `${y} yr ${m} mo` : `${y} yr`;
};

export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "JV";

export const phoneLabel = (p: string) => p.replace(/\s+/g, "");

export function slugify(input: string) {
  return input.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

export const pct = (a: number, b: number) => (b ? Math.round(((a - b) / b) * 100) : 0);

export const titleCase = (s: string) => s.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
