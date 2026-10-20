import { db } from "@/lib/hospital-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    db().prepare("SELECT 1 AS ok").get();
    return Response.json({ ok: true, service: "Jawad Veterinary Hospital" });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
