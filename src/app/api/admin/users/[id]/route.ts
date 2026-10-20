import { hashPassword } from "@/lib/auth";
import { clean, isResponse, jsonError, jsonOk, readJson, requireApiRole } from "@/lib/api";
import { getUserById, setUserPassword, setUserRole, updateUserProfile } from "@/lib/hospital-db";
import type { Role } from "@/lib/types";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireApiRole(["admin"]);
  if (isResponse(admin)) return admin;
  const { id } = await params;
  const target = getUserById(id);
  if (!target) return jsonError("User not found.", 404);
  const body = await readJson<{ role?: string; newPassword?: string; name?: string; phone?: string; address?: string }>(request);
  if (typeof body?.role === "string" && ["customer", "vet", "admin"].includes(body.role)) {
    if (id === admin.id && body.role !== "admin") return jsonError("You cannot remove your own admin access.");
    setUserRole(id, body.role as Role);
  }
  if (typeof body?.newPassword === "string" && body.newPassword.length > 0) {
    if (body.newPassword.length < 8) return jsonError("Password must be at least 8 characters.");
    setUserPassword(id, hashPassword(body.newPassword));
  }
  if (typeof body?.name === "string" || typeof body?.phone === "string" || typeof body?.address === "string") {
    updateUserProfile(id, {
      name: clean(body?.name, 120) || target.name,
      phone: clean(body?.phone, 40) || target.phone,
      address: typeof body?.address === "string" ? clean(body.address, 400) : target.address,
    });
  }
  return jsonOk({ ok: true, user: getUserById(id) });
}
