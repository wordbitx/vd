import { isResponse, jsonError, jsonOk, readJson, requireApiUser } from "@/lib/api";
import { deleteAdoption, getAdoption, setAdoptionStatus } from "@/lib/hospital-db";
import type { AdoptionStatus } from "@/lib/types";

export const runtime = "nodejs";

const STATUSES: AdoptionStatus[] = ["pending", "available", "adopted", "rejected"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser();
  if (isResponse(user)) return user;
  const { id } = await params;
  const adoption = getAdoption(id);
  if (!adoption) return jsonError("Listing not found.", 404);
  const body = await readJson<{ status?: string }>(request);
  const status = STATUSES.includes(body?.status as AdoptionStatus) ? (body!.status as AdoptionStatus) : null;
  if (!status) return jsonError("Invalid status.");
  const staff = user.role === "admin" || user.role === "vet";
  const owner = adoption.postedByUserId === user.id;
  if (!staff && !(owner && (status === "adopted" || status === "pending"))) {
    return jsonError("You cannot change this listing's status.", 403);
  }
  setAdoptionStatus(id, status);
  return jsonOk({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser();
  if (isResponse(user)) return user;
  const { id } = await params;
  const adoption = getAdoption(id);
  if (!adoption) return jsonError("Listing not found.", 404);
  const staff = user.role === "admin" || user.role === "vet";
  if (!staff && adoption.postedByUserId !== user.id) return jsonError("You cannot delete this listing.", 403);
  deleteAdoption(id);
  return jsonOk({ ok: true });
}
