import Link from "next/link";
import { ArrowRight, PawPrint } from "lucide-react";
import { PortalHead } from "@/components/portal-shell";
import { PetAvatar } from "@/components/pet-manager";
import { requireRole } from "@/lib/auth";
import { formatDate, petAgeFromDob } from "@/lib/format";
import { getUserById, listAllPets } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Patients & Passports · Admin", "All registered patients and their Digital Pet Passports.", "/admin/patients");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminPatientsPage() {
  await requireRole(["admin", "vet"], "/admin/patients");
  const pets = listAllPets();
  const rows = pets.map((pet) => ({ pet, owner: getUserById(pet.userId) }));
  return (
    <div>
      <PortalHead
        eyebrow="Medical Records"
        title="Patients & passports"
        description="Every pet registered with Jawad Veterinary Hospital. Open a passport to view vaccinations and complete visit history."
      />
      {rows.length === 0 ? (
        <div className="empty-note"><PawPrint size={24} /><strong>No registered patients yet</strong>Passports appear when customers add pets from their portal.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table" style={{ minWidth: 780 }}>
            <thead><tr><th>Patient</th><th>Passport</th><th>Owner</th><th>Age</th><th>Registered</th><th aria-label="Open" /></tr></thead>
            <tbody>
              {rows.map(({ pet, owner }) => (
                <tr key={pet.id}>
                  <td>
                    <span style={{ display: "flex", gap: 11, alignItems: "center" }}>
                      <PetAvatar species={pet.species} />
                      <span><span className="cell-strong">{pet.name}</span><span className="cell-sub">{pet.species}{pet.breed ? ` · ${pet.breed}` : ""}{pet.gender ? ` · ${pet.gender}` : ""}</span></span>
                    </span>
                  </td>
                  <td><span className="badge tone-gold">{pet.passportId}</span></td>
                  <td>{owner ? <>{owner.name}<span className="cell-sub">{owner.phone}</span></> : "—"}</td>
                  <td>{petAgeFromDob(pet) || "—"}</td>
                  <td>{formatDate(pet.createdAt.slice(0, 10))}</td>
                  <td><Link href={`/admin/patients/${pet.id}`} className="mini-link">Open passport <ArrowRight size={12} style={{ verticalAlign: -2 }} /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
