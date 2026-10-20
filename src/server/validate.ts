export type FieldErrors = Record<string, string>;

export const field = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
};

export const numberField = (form: FormData, key: string, fallback = 0) => {
  const raw = field(form, key).replace(/[, ]/g, "");
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
};

export const listField = (form: FormData, key: string) =>
  form.getAll(key).filter((v): v is string => typeof v === "string" && v.length > 0);

export const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);

export const phoneValid = (v: string) => v.replace(/\D/g, "").length >= 10;

export const normalisePhone = (v: string) => {
  const digits = v.replace(/[^\d+]/g, "");
  if (digits.startsWith("0092")) return `+92 ${digits.slice(4)}`;
  if (digits.startsWith("92")) return `+92 ${digits.slice(2)}`;
  if (digits.startsWith("0")) return `+92 ${digits.slice(1)}`;
  return `+92 ${digits}`;
};

export function required(form: FormData, errors: FieldErrors, key: string, label: string, maxLength = 400) {
  const value = field(form, key);
  if (!value) errors[key] = `${label} is required.`;
  else if (value.length > maxLength) errors[key] = `${label} is too long (max ${maxLength} characters).`;
  return value;
}

export function oneOf<T extends string>(form: FormData, key: string, allowed: readonly T[], fallback: T) {
  const value = field(form, key) as T;
  return allowed.includes(value) ? value : fallback;
}

export const checkbox = (form: FormData, key: string) => form.get(key) === "on" || form.get(key) === "true" || form.get(key) === "1";

export const fail = (errors: FieldErrors, message = "Please correct the highlighted fields.") => ({ ok: false as const, errors, message });

export const done = (message: string, extra: Record<string, unknown> = {}) => ({ ok: true as const, message, ...extra });

export const parseJson = <T>(raw: string, fallback: T): T => {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
