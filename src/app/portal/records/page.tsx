import Link from "next/link";
import { ArrowRight, CalendarClock, FileText, Plus, Printer, ShieldCheck, Syringe } from "lucide-react";
import { DialogForm } from "@/components/forms";
import { Empty, Eyebrow, WhatsAppButton } from "@/components/ui";
import { addVaccineRecord } from "@/server/actions/account";
import { petsForUser } from "@/server/queries";
import { requireUser } from "@/server/auth";
import { dateLabel, daysUntil, todayISO } from "@/lib/format";

export default async function PortalRecords({ searchParams }: { searchParams: Promise<{ pet?: string }> }) {
  const [{ pet: selected }, user] = await Promise.all([searchParams, requireUser()]);
  const pets = await petsForUser(user.id);
  const active = pets.find((p) => p.id === selected) ?? pets[0] ?? null;

  return (
    <>
      <section className="app-card">
        <div className="app-card-head">
          <div><h2>Records &amp; vaccines</h2><p>The clinical file the hospital holds for your pets — batch numbers included.</p></div>
          <span className="spacer" />
          <WhatsAppButton message="Assalam-o-Alaikum, I need a signed copy of my pet's vaccination record." label="Request a signed copy" className="button button-ghost button-sm" />
        </div>
        {pets.length > 1 ? (
          <div className="filter-bar">
            {pets.map((pet) => (
              <Link key={pet.id} href={`/portal/records?pet=${pet.id}`} className="chip" data-active={active?.id === pet.id ? "true" : undefined}>
                {pet.name} · {pet.species}
              </Link>
            ))}
          </div>
        ) : null}
        <div className="app-card-body col" style={{ gap: 18 }}>
          {!active ? (
            <Empty title="No pet records yet" href="/portal/pets" hrefLabel="Add a pet" icon={<FileText size={24} />}>Once a pet is on your account, every vaccine and consult note lands here.</Empty>
          ) : (
            <>
              <div className="row-between" style={{ gap: 16 }}>
                <div>
                  <Eyebrow>{active.name} · {active.breed}</Eyebrow>
                  <h3 style={{ margin: "10px 0 4px", fontSize: 24 }}>Vaccination card</h3>
                  <p className="small muted" style={{ margin: 0 }}>{active.vaccines.length} dose{active.vaccines.length === 1 ? "" : "s"} on file · weight {active.weightKg ?? "—"} kg · {active.ageLabel}</p>
                </div>
                <DialogForm
                  action={addVaccineRecord}
                  title={`Log a vaccine for ${active.name}`}
                  description="Recorded by you, verified by the clinic at the next visit."
                  trigger={<button type="button" className="button button-primary button-sm"><Plus size={14} /> Add a record</button>}
                  fields={[
                    { name: "petId", label: "petId", type: "hidden", defaultValue: active.id },
                    { name: "vaccine", label: "Vaccine", required: true, placeholder: "Rabies (Nobivac Rabies)" },
                    { name: "givenOn", label: "Given on", type: "date", required: true, defaultValue: todayISO() },
                    { name: "nextDue", label: "Next due (defaults to +12 months)", type: "date" },
                    { name: "batch", label: "Batch number", placeholder: "RB-4471" },
                    { name: "vet", label: "Given by", placeholder: "Dr. Jawad Hussain / another clinic" },
                    { name: "note", label: "Note", type: "textarea", rows: 2, span: 2 },
                  ]}
                  submitLabel="Save record"
                />
              </div>

              {active.vaccines.length ? (
                <div className="table-wrap">
                  <table className="table">
                    <thead><tr><th>Vaccine</th><th>Given</th><th>Next due</th><th>Batch</th><th>Veterinarian</th><th>Status</th></tr></thead>
                    <tbody>
                      {active.vaccines.map((vaccine) => {
                        const due = daysUntil(vaccine.nextDue);
                        return (
                          <tr key={vaccine.id}>
                            <td><span className="table-cell-title">{vaccine.vaccine}</span>{vaccine.note ? <div className="table-cell-sub">{vaccine.note}</div> : null}</td>
                            <td className="tnum">{dateLabel(vaccine.givenOn)}</td>
                            <td className="tnum">{vaccine.nextDue ? dateLabel(vaccine.nextDue) : "—"}</td>
                            <td><span className="table-ref">{vaccine.batch ?? "—"}</span></td>
                            <td className="small">{vaccine.vet}</td>
                            <td>
                              {due === null ? <span className="status status-draft">No due date</span>
                                : due < 0 ? <span className="status status-cancelled">Overdue</span>
                                : due < 30 ? <span className="status status-pending">Due in {due}d</span>
                                : <span className="status status-completed">Current</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="note note-brass"><Syringe size={16} /><span>No vaccines recorded yet. If {active.name} was vaccinated elsewhere, add the record — we will verify the batch at the next visit.</span></div>
              )}

              <div>
                <div className="row-between" style={{ marginBottom: 12 }}>
                  <h3 style={{ fontSize: 20 }}>Consult notes &amp; prescriptions</h3>
                  <span className="pill pill-soft"><ShieldCheck size={12} /> Written by the treating vet</span>
                </div>
                {active.records.length ? (
                  <div className="col" style={{ gap: 10 }}>
                    {active.records.map((record) => (
                      <article key={record.id} className="card card-pad" style={{ display: "grid", gap: 8 }}>
                        <div className="row-between" style={{ gap: 12 }}>
                          <div className="row" style={{ gap: 10 }}>
                            <span className="pill pill-brass" style={{ fontSize: 9.5 }}>{record.type}</span>
                            <b style={{ fontSize: 14.5 }}>{record.title}</b>
                          </div>
                          <span className="tiny muted tnum">{dateLabel(record.date)} · {record.vet}</span>
                        </div>
                        <p className="small" style={{ margin: 0, color: "var(--ink-2)" }}>{record.summary}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="small muted">No consult notes yet for {active.name}.</p>
                )}
              </div>

              <div className="row" style={{ gap: 9, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                <Link href={`/book-vet-appointment-lahore?service=vaccination`} className="button button-primary button-sm"><CalendarClock size={14} /> Book next booster</Link>
                <Link href="/portal/messages" className="button button-ghost button-sm">Ask about a result</Link>
                <span className="spacer" />
                <span className="tiny muted">Need a printout? Every record opens from the slip printer at the desk.</span>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="app-card card-pad" style={{ background: "linear-gradient(150deg,#f8f4ec,#fffdfa)" }}>
        <div className="row-between" style={{ gap: 16 }}>
          <div>
            <Eyebrow>Travel, boarding &amp; second opinions</Eyebrow>
            <h3 style={{ margin: "10px 0 6px", fontSize: 20 }}>Stamped copies, prepared for you.</h3>
            <p className="small muted" style={{ margin: 0, maxWidth: "64ch" }}>
              Airlines, boarding kennels and other clinics often want a signed vaccination record within 72 hours. Ask in messages and
              the clinic prepares a stamped PDF — free for clients.
            </p>
          </div>
          <div className="row" style={{ gap: 9 }}>
            <Link href="/portal/messages" className="button button-dark button-sm">Request a copy <ArrowRight size={14} /></Link>
            <Link href="/gallery" className="button button-ghost button-sm"><Printer size={14} /> See the facility</Link>
          </div>
        </div>
      </section>
    </>
  );
}
