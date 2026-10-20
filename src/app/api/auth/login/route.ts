import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { clean, jsonError, jsonOk, readJson } from "@/lib/api";
import { getUserByEmail } from "@/lib/hospital-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await readJson<{ email?: string; password?: string }>(request);
  const email = clean(body?.email, 160).toLowerCase();
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) return jsonError("Email and password are required.");
  const found = getUserByEmail(email);
  if (!found || !verifyPassword(password, found.passwordHash)) {
    return jsonError("Incorrect email or password. Please try again.", 401);
  }
  const { passwordHash: _ignored, ...user } = found;
  await setSessionCookie(user);
  return jsonOk({ user });
}
