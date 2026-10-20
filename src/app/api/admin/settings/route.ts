import { clean, isResponse, jsonError, jsonOk, readJson, requireApiRole } from "@/lib/api";
import { getSettings, updateSettings } from "@/lib/hospital-db";

export const runtime = "nodejs";

function money(value: unknown, fallback: number): number {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export async function GET() {
  const user = await requireApiRole(["admin", "vet"]);
  if (isResponse(user)) return user;
  return jsonOk({ settings: getSettings() });
}

export async function PUT(request: Request) {
  const user = await requireApiRole(["admin"]);
  if (isResponse(user)) return user;
  const body = await readJson<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid settings.");
  const current = getSettings();
  const next = {
    hospitalVisitFee: money(body.hospitalVisitFee, current.hospitalVisitFee),
    homeVisitFee: money(body.homeVisitFee, current.homeVisitFee),
    emergencyHospitalFee: money(body.emergencyHospitalFee, current.emergencyHospitalFee),
    emergencyHomeFee: money(body.emergencyHomeFee, current.emergencyHomeFee),
    deliveryFee: money(body.deliveryFee, current.deliveryFee),
    freeDeliveryAbove: money(body.freeDeliveryAbove, current.freeDeliveryAbove),
    announcement: clean(body.announcement, 220),
  };
  updateSettings(next);
  return jsonOk({ settings: next });
}
