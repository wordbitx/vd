import { PortalHead } from "@/components/portal-shell";
import { PetsManager } from "@/components/pet-manager";
import { requireUser } from "@/lib/auth";
import { listPetsByUser } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("My Pets & Digital Passports", "Manage your pets and their Digital Pet Passports at Jawad Veterinary Hospital.", "/dashboard/pets");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function MyPetsPage() {
  const user = await requireUser("/dashboard/pets");
  const pets = listPetsByUser(user.id);
  return (
    <div>
      <PortalHead
        eyebrow="Digital Pet Passports"
        title="My pets"
        description="Each pet gets a free Digital Pet Passport — profile, vaccination history with next-due dates and complete visit history."
      />
      <PetsManager pets={pets} />
    </div>
  );
}
