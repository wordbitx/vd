import { isResponse, jsonOk, requireApiRole } from "@/lib/api";
import { deleteVaccination } from "@/lib/hospital-db";

export const runtime = "nodejs";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiRole(["admin", "vet"]);
  if (isResponse(user)) return user;
  const { id } = await params;
  deleteVaccination(id);
  return jsonOk({ ok: true });
}
