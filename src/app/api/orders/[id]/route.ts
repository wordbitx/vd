import { isResponse, jsonError, jsonOk, readJson, requireApiRole } from "@/lib/api";
import { getOrderByRef, updateOrder } from "@/lib/hospital-db";
import type { OrderStatus } from "@/lib/types";

export const runtime = "nodejs";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "packed", "out-for-delivery", "delivered", "cancelled"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiRole(["admin", "vet"]);
  if (isResponse(user)) return user;
  const { id } = await params;
  const body = await readJson<{ ref?: string; status?: string; paymentStatus?: string }>(request);
  // `id` is the internal order id; fall back to ref lookup for convenience.
  const patch: Parameters<typeof updateOrder>[1] = {};
  if (body?.status && STATUSES.includes(body.status as OrderStatus)) patch.status = body.status as OrderStatus;
  if (body?.paymentStatus === "paid" || body?.paymentStatus === "unpaid") patch.paymentStatus = body.paymentStatus;
  if (!Object.keys(patch).length) return jsonError("Nothing to update.");
  updateOrder(id, patch);
  return jsonOk({ ok: true });
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrderByRef(id);
  if (!order) return jsonError("Order not found.", 404);
  return jsonOk({ order });
}
