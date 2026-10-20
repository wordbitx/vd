import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/** scrypt with a per-user salt. Format: scrypt$<saltHex>$<hashHex> */
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(normalise(password), salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [scheme, salt, hash] = (stored || "").split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const candidate = scryptSync(normalise(password), salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

const normalise = (v: string) => (v ?? "").trim().normalize("NFKC");

export function passwordIssues(password: string, confirm?: string) {
  const issues: string[] = [];
  if (password.length < 8) issues.push("Use at least 8 characters.");
  if (!/[a-z]/i.test(password)) issues.push("Include letters.");
  if (!/\d/.test(password)) issues.push("Include a number.");
  if (confirm !== undefined && password !== confirm) issues.push("The two passwords do not match.");
  return issues;
}
