import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarPlus, PawPrint } from "lucide-react";
import { Barcode } from "@/components/booking-slip";
import { PrintButton } from "@/components/slip-actions";
import { PetAvatar, PetForm } from "@/components/pet-manager";
import { VaccinationManager } from "@/components/vaccination-form";
import { requireUser } from "@/lib/auth";
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_TONES, formatDate, petAgeFromDob } from "@/lib/format";
import { getPet, listAppointmentsForPet, listVaccinations } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Digital Pet Passport", "Your pet's Digital Passport — profile, vaccinations and visit history.", "/dashboard/pets");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function PetPassportPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("/dashboard/pets");
  const { id } = await params;
  const pet = getPet(id);
  if (!pet || pet.userId !== user.id) notFound();
  const vaccinations = listVaccinations(pet.id);
  const visits = listAppointmentsForPet(pet.id);

  return (
    <div>
      <p className="no-print" style={{ marginBottom: 16 }}>
        <Link href="/dashboard/pets" className="back-link"><ArrowLeft size={16} /> All my pets</Link>
      </p>

      <div className="passport print-sheet">
        <div className="passport-head">
          <span className="pp-logo"><PawPrint size={24} /></span>
          <div>
            <small>Jawad Veterinary Hospital · Lahore</small>
            <strong>Digital Pet Passport</strong>
          </div>
          <div className="pp-id">
            <small>Passport No.</small>
            <strong>{pet.passportId}</strong>
          </div>
        </div>
        <div className="passport-body">
          <div className="passport-pet">
            <span className="pet-avatar"><PetAvatar species={pet.species} size={36} /></span>
            <div>
              <h3>{pet.name}</h3>
              <p>{pet.species}{pet.breed ? ` · ${pet.breed}` : ""}{pet.gender ? ` · ${pet.gender}` : ""}</p>
            </div>
          </div>
          <div className="passport-facts">
            <div><span>Age</span><strong>{petAgeFromDob(pet)}</strong></div>
            <div><span>Weight</span><strong>{pet.weightKg ? `${pet.weightKg} kg` : "—"}</strong></div>
            <div><span>Colour</span><strong>{pet.color || "—"}</strong></div>
            <div><span>Microchip</span><strong>{pet.microchip || "—"}</strong></div>
            <div><span>Owner</span><strong>{user.name}</strong></div>
            <div><span>Registered</span><strong>{formatDate(pet.createdAt.slice(0, 10))}</strong></div>
            <div><span>Vaccinations</span><strong>{vaccinations.length} recorded</strong></div>
            <div><span>Visits</span><strong>{visits.length}</strong></div>
          </div>
        </div>
        <div style={{ marginTop: 20, position: "relative", zIndex: 1, color: "#f3e7c8" }}>
          <Barcode value={pet.passportId} height={36} />
        </div>
        {pet.notes && <p style={{ margin: "14px 0 0", fontSize: 11.5, color: "#aebfd1", lineHeight: 1.7, position: "relative", zIndex: 1 }}><strong style={{ color: "#e9c766" }}>Notes:</strong> {pet.notes}</p>}
      </div>

      <div className="no-print" style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0 22px" }}>
        <Link href={`/book?pet=${pet.id}`} className="button button-gold"><CalendarPlus size={16} /> Book a visit for {pet.name}</Link>
        <PrintButton label="Print passport" />
      </div>

      <div className="portal-card">
        <h2>Vaccination records</h2>
        <p className="card-sub">Official entries are added by our veterinary team after each visit. You may also note vaccinations given elsewhere — bring the card on your next visit so we can verify it.</p>
        <VaccinationManager petId={pet.id} records={vaccinations} />
      </div>

      <div className="portal-card">
        <h2>Visit history</h2>
        <p className="card-sub">Every appointment booked for {pet.name}, with slips and vet notes.</p>
        {visits.length ? (
          <div className="list-rows">
            {visits.map((visit) => (
              <Link key={visit.id} href={`/dashboard/appointments/${visit.ref}`}>
                <span className="lr-icon"><CalendarPlus size={18} /></span>
                <div>
                  <p className="lr-title">{visit.serviceTitle}{visit.emergency ? " · Emergency" : ""}</p>
                  <p className="lr-sub">{formatDate(visit.date)} · {visit.timeSlot} · Token {visit.token}{visit.doctorName ? ` · ${visit.doctorName}` : ""}</p>
                </div>
                <div className="lr-right"><span className={`badge ${APPOINTMENT_STATUS_TONES[visit.status]}`}>{APPOINTMENT_STATUS_LABELS[visit.status]}</span></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-note"><CalendarPlus size={22} /><strong>No visits yet</strong>{pet.name}&apos;s appointments and vet notes will appear here after the first visit.</div>
        )}
      </div>

      <div className="portal-card no-print">
        <h2>Edit {pet.name}&apos;s profile</h2>
        <p className="card-sub">Keep weight, age and notes up to date so our vets come prepared.</p>
        <PetForm pet={pet} />
      </div>
    </div>
  );
}
