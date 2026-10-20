import { createHmac, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { rows } from "@/server/store";
import { verifyPassword } from "@/server/passwords";
import type { Role, SessionUser, User } from "@/lib/types";

/**
 * Stateless, signed-cookie sessions: `base64url(payload).hmac`.
 * No external auth provider, so the portal and admin panel run anywhere Next.js runs.
 */
export const SESSION_COOKIE = "jvh_session";
const MAX_AGE = 60 * 60 * 24 * 30;
const STAFF: Role[] = ["owner", "vet", "staff"];

let secretCache: string | null = null;

function secret() {
  if (secretCache) return secretCache;
  secretCache = process.env.JVH_AUTH_SECRET ?? `dev-${randomBytes(8).toString("hex")}`;
  if (process.env.NODE_ENV === "production" && !process.env.JVH_AUTH_SECRET) {
    console.warn("[auth] JVH_AUTH_SECRET is not set — sessions will not survive a restart.");
  }
  return secretCache;
}

const b64u = (buf: Buffer | string) => Buffer.from(buf).toString("base64url");
const sign = (body: string) => createHmac("sha256", secret()).update(body).digest("base64url");

export function createToken(user: Pick<User, "id" | "role">, days = 30) {
  const payload = b64u(JSON.stringify({ uid: user.id, role: user.role, exp: Date.now() + days * 86400000 }));
  return `${payload}.${sign(payload)}`;
}

export function readToken(token?: string | null): { uid: string; role: Role } | null {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  const expected = sign(payload);
  if (expected.length !== signature.length || !safeEqual(expected, signature)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { uid: string; role: Role; exp: number };
    if (!data.uid || typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return { uid: data.uid, role: data.role };
  } catch {
    return null;
  }
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  let mismatch = 0;
  for (let i = 0; i < bufA.length; i += 1) mismatch |= bufA[i] ^ bufB[i];
  return mismatch === 0;
}

export async function setSessionCookie(user: Pick<User, "id" | "role">) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function currentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const session = readToken(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const users = await rows("users");
  const user = users.find((u) => u.id === session.uid);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };
}

export async function requireUser(next = "/portal"): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireStaff(): Promise<SessionUser> {
  const user = await requireUser("/admin");
  if (!STAFF.includes(user.role)) redirect("/portal?notice=staff-only");
  return user;
}

export const isStaffRole = (role?: Role) => !!role && STAFF.includes(role);

export async function authenticate(email: string, password: string): Promise<{ ok: true; user: User } | { ok: false; message: string }> {
  const users = await rows("users");
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) return { ok: false, message: "We could not find an account with that email." };
  if (!verifyPassword(password, user.passwordHash)) return { ok: false, message: "That password does not match our records." };
  return { ok: true, user };
}

export const randomId = () => randomBytes(6).toString("hex");
