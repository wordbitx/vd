// Server-only authentication: scrypt password hashing + HMAC-signed session cookie.
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionSecret, getUserById } from "./hospital-db";
import type { Role, User } from "./types";

export const SESSION_COOKIE = "jvh_session";
const SESSION_DAYS = 30;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function createSessionToken(user: User): string {
  const payload = Buffer.from(
    JSON.stringify({ uid: user.id, role: user.role, exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export async function setSessionCookie(user: User) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Returns the signed-in user, or null. Safe in server components & route handlers. */
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { uid: string; exp: number };
    if (!data.uid || Date.now() > data.exp) return null;
    return getUserById(data.uid);
  } catch {
    return null;
  }
}

export async function requireUser(redirectTo = "/dashboard"): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  return user;
}

export async function requireRole(roles: Role[], redirectTo = "/admin"): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  if (!roles.includes(user.role)) redirect("/dashboard");
  return user;
}

export function isStaff(user: User | null): boolean {
  return Boolean(user && (user.role === "admin" || user.role === "vet"));
}
