import { clean, isResponse, jsonError, jsonOk, readJson, requireApiUser } from "@/lib/api";
import { addVaccination, getPet, listVaccinations } from "@/lib/hospital-db";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser();
  if (isResponse(user)) return user;
  const { id } = await params;
  const pet = getPet(id);
  if (!pet) return jsonError("Pet not found.", 404);
  const staff = user.role === "admin" || user.role === "vet";
  if (!staff && pet.userId !== user.id) return jsonError("This pet profile belongs to another account.", 403);
  const body = await readJson<{ vaccine?: string; dateGiven?: string; nextDue?: string; vetName?: string; notes?: string }>(request);
  const vaccine = clean(body?.vaccine, 120);
  const dateGiven = clean(body?.dateGiven, 20);
  if (!vaccine || !/^\d{4}-\d{2}-\d{2}$/.test(dateGiven)) return jsonError("Vaccine name and a valid date are required.");
  const record = addVaccination(id, {
    vaccine,
    dateGiven,
    nextDue: clean(body?.nextDue, 20),
    vetName: clean(body?.vetName, 120) || (staff ? user.name : ""),
    notes: clean(body?.notes, 500),
  });
  return jsonOk({ record, records: listVaccinations(id) }, 201);
}
