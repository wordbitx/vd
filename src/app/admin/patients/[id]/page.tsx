import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Syringe } from "lucide-react";
import { PortalHead } from "@/components/portal-shell";
import { Barcode } from "@/components/booking-slip";
import { PetAvatar } from "@/components/pet-manager";
import { PrintButton } from "@/components/slip-actions";
import { VaccinationManager } from "@/components/vaccination-form";
import { requireRole } from "@/lib/auth";
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_TONES, formatDate, petAgeFromDob } from "@/lib/format";
import { getPet, getUserById, listAppointmentsForPet, listVaccinations } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Patient Passport · Admin", "Patient record and vaccination card.", "/admin/patients");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminPatientPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["admin", "vet"], "/admin/patients");
  const { id } = await params;
  const pet = getPet(id);
  if (!pet) notFound();
  const owner = getUserById(pet.userId);
  const vaccinations = listVaccinations(pet.id);
  const visits = listAppointmentsForPet(pet.id);

  return (
    <div>
      <PortalHead eyebrow="Patient Record" title={`${pet.name} · ${pet.passportId}`} description={owner ? `Owner: ${owner.name} · ${owner.phone} · ${owner.email}` : undefined}>
        <Link href="/admin/patients" className="button button-outline"><ArrowLeft size={15} /> All patients</Link>
      </PortalHead>

      <div className="slip-actions no-print" style={{ marginBottom: 16 }}>
        <PrintButton label="Print passport" />
      </div>

      <div className="passport-card">
        <div className="passport-head">
          <PetAvatar species={pet.species} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ margin: 0, fontFamily: "var(--display)", fontSize: 26, color: "var(--forest)" }}>{pet.name}</p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#7a868e" }}>
              {pet.species}{pet.breed ? ` · ${pet.breed}` : ""}{pet.gender ? ` · ${pet.gender}` : ""}{petAgeFromDob(pet) ? ` · ${petAgeFromDob(pet)}` : ""}{pet.weightKg ? ` · ${pet.weightKg} kg` : ""}
            </p>
            {pet.notes && <p style={{ margin: "8px 0 0", fontSize: 12, lineHeight: 1.7, color: "#5f6b73" }}>{pet.notes}</p>}
          </div>
          <div style={{ width: 190 }}>
            <Barcode value={pet.passportId} />
          </div>
        </div>
        <div className="passport-grid">
          <span><small>Guardian</small><strong>{owner?.name ?? "—"}</strong></span>
          <span><small>Contact</small><strong>{owner?.phone || "—"}</strong></span>
          <span><small>Date of birth</small><strong>{pet.dob ? (/^\d{4}-\d{2}-\d{2}$/.test(pet.dob) ? formatDate(pet.dob) : pet.dob) : "Not recorded"}</strong></span>
          <span><small>Registered</small><strong>{formatDate(pet.createdAt.slice(0, 10))}</strong></span>
        </div>
      </div>

      <div className="portal-card">
        <div className="card-head-row"><h2><Syringe size={17} style={{ verticalAlign: -3, color: "var(--brass)" }} /> Vaccination record</h2></div>
        <VaccinationManager petId={pet.id} records={vaccinations} canDelete />
      </div>

      <div className="portal-card">
        <div className="card-head-row"><h2><CalendarDays size={17} style={{ verticalAlign: -3, color: "var(--brass)" }} /> Visit history</h2></div>
        {visits.length ? (
          <div className="list-rows">
            {visits.map((visit) => (
              <div className="list-row" key={visit.id}>
                <span className="lr-icon"><CalendarDays size={18} /></span>
                <div style={{ minWidth: 0 }}>
                  <p className="lr-title">{visit.serviceTitle} · {visit.ref}</p>
                  <p className="lr-sub">{formatDate(visit.date)} · {visit.timeSlot}{visit.doctorName ? ` · ${visit.doctorName}` : ""}</p>
                  {visit.vetNotes && <p style={{ fontSize: 12, lineHeight: 1.7, margin: "6px 0 0", color: "#3d4c5a", whiteSpace: "pre-line" }}>{visit.vetNotes}</p>}
                </div>
                <div className="lr-right" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className={`badge ${APPOINTMENT_STATUS_TONES[visit.status]}`}>{APPOINTMENT_STATUS_LABELS[visit.status]}</span>
                  <Link href={`/book/slip/${visit.ref}`} target="_blank" className="mini-link">Slip</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="card-sub" style={{ margin: 0 }}>No visits recorded for {pet.name} yet. Visits booked with this pet selected will appear here with your notes.</p>
        )}
      </div>
    </div>
  );
}
