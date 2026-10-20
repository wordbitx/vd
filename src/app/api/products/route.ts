import { isResponse, jsonError, jsonOk, readJson, requireApiRole } from "@/lib/api";
import { getProductBySlug, listProducts, upsertProduct } from "@/lib/hospital-db";
import { parseProductBody } from "@/lib/parsers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return jsonOk({ products: listProducts(true) });
}

export async function POST(request: Request) {
  const user = await requireApiRole(["admin"]);
  if (isResponse(user)) return user;
  const body = await readJson<Record<string, unknown>>(request);
  const product = parseProductBody(body);
  if (typeof product === "string") return jsonError(product);
  if (getProductBySlug(product.slug)) product.slug = `${product.slug}-${Math.floor(Math.random() * 900 + 100)}`;
  upsertProduct(product);
  return jsonOk({ product }, 201);
}
