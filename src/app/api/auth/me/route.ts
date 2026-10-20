import { getCurrentUser } from "@/lib/auth";
import { jsonOk } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  return jsonOk({ user });
}
