import { isResponse, jsonError, jsonOk, readJson, requireApiUser } from "@/lib/api";
import { createPet, listAllPets, listPetsByUser } from "@/lib/hospital-db";
import { parsePetBody } from "@/lib/parsers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await requireApiUser();
  if (isResponse(user)) return user;
  const body = await readJson<Record<string, unknown>>(request);
  const input = parsePetBody(body);
  if (!input) return jsonError("Please enter your pet's name and species.");
  // Staff may register a pet on behalf of a customer by passing userId.
  const ownerId = (user.role === "admin" || user.role === "vet") && typeof body?.userId === "string" ? body.userId : user.id;
  const pet = createPet(ownerId, input);
  return jsonOk({ pet }, 201);
}

export async function GET() {
  const user = await requireApiUser();
  if (isResponse(user)) return user;
  if (user.role === "admin" || user.role === "vet") return jsonOk({ pets: listAllPets() });
  return jsonOk({ pets: listPetsByUser(user.id) });
}
