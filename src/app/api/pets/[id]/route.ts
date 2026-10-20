import { isResponse, jsonError, jsonOk, readJson, requireApiUser } from "@/lib/api";
import { deletePet, getPet, updatePet } from "@/lib/hospital-db";
import { parsePetBody } from "@/lib/parsers";

export const runtime = "nodejs";

async function loadOwnedPet(id: string) {
  const user = await requireApiUser();
  if (isResponse(user)) return user;
  const pet = getPet(id);
  if (!pet) return jsonError("Pet not found.", 404);
  const staff = user.role === "admin" || user.role === "vet";
  if (!staff && pet.userId !== user.id) return jsonError("This pet profile belongs to another account.", 403);
  return pet;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pet = await loadOwnedPet(id);
  if (pet instanceof Response) return pet;
  const body = await readJson<Record<string, unknown>>(request);
  const input = parsePetBody(body);
  if (!input) return jsonError("Please enter your pet's name and species.");
  updatePet(id, input);
  return jsonOk({ ok: true, pet: getPet(id) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pet = await loadOwnedPet(id);
  if (pet instanceof Response) return pet;
  deletePet(id);
  return jsonOk({ ok: true });
}
