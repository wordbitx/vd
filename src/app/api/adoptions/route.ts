import { clean, isResponse, jsonError, jsonOk, readJson, requireApiUser } from "@/lib/api";
import { createAdoption, listAdoptions } from "@/lib/hospital-db";
import type { Adoption, PetSpecies } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SPECIES: PetSpecies[] = ["Dog", "Cat", "Bird", "Rabbit", "Other"];
const GROUPS: Adoption["ageGroup"][] = ["Puppy/Kitten", "Young", "Adult", "Senior"];
// Curated photos used when a poster doesn't provide an image URL.
const FALLBACK_IMAGES: Record<string, string> = {
  Cat: "/images/pets/Coco.jpg",
  Dog: "/images/pets/bruno.jpg",
  Rabbit: "/images/pets/oreo.jpg",
  Bird: "/images/pets/Coco.jpg",
  Other: "/images/pets/Coco.jpg",
};

export async function GET() {
  return jsonOk({ adoptions: listAdoptions(["available"]) });
}

export async function POST(request: Request) {
  const user = await requireApiUser();
  if (isResponse(user)) return user;
  const body = await readJson<Record<string, unknown>>(request);
  const name = clean(body?.name, 80);
  const species = SPECIES.includes(body?.species as PetSpecies) ? (body!.species as PetSpecies) : null;
  const description = clean(body?.description, 1200);
  const contactPhoneRaw = clean(body?.contactPhone, 40) || user.phone;
  if (!name || !species) return jsonError("Please add the pet's name and species.");
  if (description.length < 20) return jsonError("Please write a short description (at least 20 characters) to help this pet find a home.");
  const digits = contactPhoneRaw.replace(/\D/g, "");
  const contactPhone = digits.startsWith("92") ? digits : digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
  const staff = user.role === "admin" || user.role === "vet";
  const image = clean(body?.image, 500) || FALLBACK_IMAGES[species];
  const adoption = createAdoption({
    name,
    species,
    breed: clean(body?.breed, 80),
    gender: body?.gender === "Male" ? "Male" : "Female",
    ageGroup: GROUPS.includes(body?.ageGroup as Adoption["ageGroup"]) ? (body!.ageGroup as Adoption["ageGroup"]) : "Young",
    ageText: clean(body?.ageText, 40),
    vaccinated: body?.vaccinated === true,
    dewormed: body?.dewormed === true,
    litterTrained: body?.litterTrained === true,
    description,
    image,
    area: clean(body?.area, 80) || "Lahore",
    contactPhone,
    postedByUserId: user.id,
    status: staff ? "available" : "pending",
  });
  return jsonOk({ adoption }, 201);
}
