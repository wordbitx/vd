import { isResponse, jsonError, jsonOk, readJson, requireApiRole } from "@/lib/api";
import { deleteProduct, getProductById, upsertProduct } from "@/lib/hospital-db";
import { parseProductBody } from "@/lib/parsers";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiRole(["admin"]);
  if (isResponse(user)) return user;
  const { id } = await params;
  if (!getProductById(id)) return jsonError("Product not found.", 404);
  const body = await readJson<Record<string, unknown>>(request);
  const product = parseProductBody(body, id);
  if (typeof product === "string") return jsonError(product);
  upsertProduct(product);
  return jsonOk({ product });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiRole(["admin"]);
  if (isResponse(user)) return user;
  const { id } = await params;
  deleteProduct(id);
  return jsonOk({ ok: true });
}
