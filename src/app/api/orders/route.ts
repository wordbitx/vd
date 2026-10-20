import { getCurrentUser } from "@/lib/auth";
import { clean, jsonError, jsonOk, readJson, validPhone } from "@/lib/api";
import { createOrder, listOrders, listOrdersByUser } from "@/lib/hospital-db";
import type { PaymentMethod } from "@/lib/types";

export const runtime = "nodejs";

type OrderBody = {
  customerName?: string; phone?: string; email?: string;
  address?: string; city?: string; area?: string; notes?: string;
  paymentMethod?: string; items?: { productId?: string; quantity?: number }[];
};

const METHODS: PaymentMethod[] = ["cod", "easypaisa", "jazzcash", "bank"];

export async function POST(request: Request) {
  const body = await readJson<OrderBody>(request);
  const user = await getCurrentUser();
  const customerName = clean(body?.customerName, 120) || user?.name || "";
  const phone = clean(body?.phone, 40) || user?.phone || "";
  const email = clean(body?.email, 160) || user?.email || "";
  const address = clean(body?.address, 400);
  const city = clean(body?.city, 60) || "Lahore";
  const area = clean(body?.area, 80);
  const notes = clean(body?.notes, 600);
  const paymentMethod = METHODS.includes(body?.paymentMethod as PaymentMethod) ? (body!.paymentMethod as PaymentMethod) : "cod";
  const items = (Array.isArray(body?.items) ? body.items : [])
    .filter((item) => typeof item?.productId === "string" && Number.isInteger(item?.quantity) && (item.quantity as number) > 0 && (item.quantity as number) <= 99)
    .map((item) => ({ productId: item.productId as string, quantity: item.quantity as number }));

  if (customerName.length < 2) return jsonError("Please enter your full name.");
  if (!validPhone(phone)) return jsonError("Please enter a valid mobile number for delivery.");
  if (address.length < 10) return jsonError("Please enter your complete delivery address.");
  if (!items.length) return jsonError("Your cart is empty.");

  const result = createOrder({ userId: user?.id ?? null, customerName, phone, email, address, city, area, notes, paymentMethod, items });
  if ("error" in result) return jsonError(result.error, 409);
  return jsonOk({ order: result.order }, 201);
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Please log in to view orders.", 401);
  const url = new URL(request.url);
  if (user.role === "admin" || user.role === "vet") {
    return jsonOk({ orders: listOrders({ status: url.searchParams.get("status") ?? undefined, search: url.searchParams.get("search") ?? undefined }) });
  }
  return jsonOk({ orders: listOrdersByUser(user.id) });
}
