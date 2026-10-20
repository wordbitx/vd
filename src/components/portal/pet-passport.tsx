import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Calendar, Syringe, TriangleAlert } from "lucide-react";
import { money, dateLabel } from "@/lib/format";
import type { HydratedPet } from "@/server/queries";

export function PetPassportCard({ pet, compact = false }: { pet: HydratedPet; compact?: boolean }) {
  const due = pet.nextDue;
  const overdue = due?.overdue;
  return (
    <article className="passport">
      <div className="passport-photo">
        <Image src={pet.photo || "/images/pet-dog.jpg"} alt={pet.name} width={192} height={192} className="object-cover" unoptimized />
      </div>
      <div className="col" style={{ gap: 6, minWidth: 0 }}>
        <div className="row" style={{ gap: 10 }}>
          <h3 style={{ fontSize: compact ? 20 : 24 }}>{pet.name}</h3>
          <span className="pill pill-soft" style={{ textTransform: "none", letterSpacing: 0, fontSize: 10.5 }}>{pet.species}</span>
          {due ? (
            overdue
              ? <span className="pill pill-danger"><TriangleAlert size={11} /> Vaccine overdue</span>
              : <span className="pill pill-ok"><BadgeCheck size={11} /> Vaccines current</span>
          ) : null}
        </div>
        <span className="small muted">{pet.breed} · {pet.sex} · {pet.ageLabel}{pet.weightKg ? ` · ${pet.weightKg} kg` : ""}</span>
        {!compact ? (
          <div className="passport-stats">
            <div><small>Microchip</small><b>{pet.microchip ?? "Not chipped"}</b></div>
            <div><small>Colour</small><b>{pet.colour ?? "—"}</b></div>
            <div><small>Vaccines on file</small><b>{pet.vaccines.length}</b></div>
            <div><small>Visits recorded</small><b>{pet.records.length}</b></div>
            <div><small>Allergies</small><b>{pet.allergies ?? "None reported"}</b></div>
          </div>
        ) : null}
        {due ? (
          <span className={`small ${overdue ? "field-error" : "muted"}`} style={{ fontWeight: 650 }}>
            <Syringe size={13} style={{ display: "inline", verticalAlign: "-2px", marginRight: 5 }} />
            {overdue
              ? `${due.vaccine} was due ${Math.abs(due.dueIn ?? 0)} days ago`
              : `${due.vaccine} next due ${dateLabel(due.nextDue!)} (${due.dueIn} days)`}
          </span>
        ) : null}
      </div>
      <div className="col" style={{ gap: 8, alignItems: "flex-end" }}>
        <Link href={`/portal/records?pet=${pet.id}`} className="button button-ghost button-sm">Records <ArrowRight size={13} /></Link>
        <Link href={`/book-vet-appointment-lahore?service=general-checkup`} className="button button-primary button-sm"><Calendar size={13} /> Book</Link>
        {!compact ? <span className="tiny muted">{money(0)} cost for reprints</span> : null}
      </div>
    </article>
  );
}
