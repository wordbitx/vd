import { hashPassword, verifyPassword } from "@/lib/auth";
import { clean, isResponse, jsonError, jsonOk, readJson, requireApiUser, validPhone } from "@/lib/api";
import { getUserByEmail, setUserPassword, updateUserProfile } from "@/lib/hospital-db";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const user = await requireApiUser();
  if (isResponse(user)) return user;
  const body = await readJson<{ name?: string; phone?: string; address?: string; currentPassword?: string; newPassword?: string }>(request);
  if (typeof body?.newPassword === "string" && body.newPassword.length > 0) {
    const found = getUserByEmail(user.email);
    if (!found || !verifyPassword(body.currentPassword ?? "", found.passwordHash)) {
      return jsonError("Your current password is incorrect.", 401);
    }
    if (body.newPassword.length < 8) return jsonError("New password must be at least 8 characters.");
    setUserPassword(user.id, hashPassword(body.newPassword));
    return jsonOk({ ok: true, passwordChanged: true });
  }
  const name = clean(body?.name, 120);
  const phone = clean(body?.phone, 40);
  const address = clean(body?.address, 400);
  if (name.length < 2) return jsonError("Please enter your full name.");
  if (!validPhone(phone)) return jsonError("Please enter a valid mobile number.");
  updateUserProfile(user.id, { name, phone, address });
  return jsonOk({ ok: true });
}
