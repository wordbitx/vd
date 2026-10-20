import { isResponse, jsonOk, readJson, requireApiRole } from "@/lib/api";
import { deleteMessage, setMessageRead } from "@/lib/hospital-db";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiRole(["admin", "vet"]);
  if (isResponse(user)) return user;
  const { id } = await params;
  const body = await readJson<{ read?: boolean }>(request);
  setMessageRead(id, body?.read !== false);
  return jsonOk({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiRole(["admin", "vet"]);
  if (isResponse(user)) return user;
  const { id } = await params;
  deleteMessage(id);
  return jsonOk({ ok: true });
}
