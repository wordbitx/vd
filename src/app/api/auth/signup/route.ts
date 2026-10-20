import { hashPassword, setSessionCookie } from "@/lib/auth";
import { clean, jsonError, jsonOk, readJson, validEmail, validPhone } from "@/lib/api";
import { createUser, getUserByEmail } from "@/lib/hospital-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await readJson<{ name?: string; email?: string; phone?: string; password?: string }>(request);
  const name = clean(body?.name, 120);
  const email = clean(body?.email, 160).toLowerCase();
  const phone = clean(body?.phone, 40);
  const password = typeof body?.password === "string" ? body.password : "";
  if (name.length < 2) return jsonError("Please enter your full name.");
  if (!validEmail(email)) return jsonError("Please enter a valid email address.");
  if (!validPhone(phone)) return jsonError("Please enter a valid mobile number (e.g. 0300 1234567).");
  if (password.length < 8) return jsonError("Password must be at least 8 characters.");
  if (getUserByEmail(email)) return jsonError("An account with this email already exists. Please log in.", 409);
  const user = createUser({ name, email, phone, passwordHash: hashPassword(password) });
  await setSessionCookie(user);
  return jsonOk({ user }, 201);
}
