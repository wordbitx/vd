"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Syringe, Trash2 } from "lucide-react";
import { formatDate, todayIso } from "@/lib/format";
import type { Vaccination } from "@/lib/types";

export function VaccinationManager({ petId, records, canDelete = false }: { petId: string; records: Vaccination[]; canDelete?: boolean }) {
  const router = useRouter();
  const [vaccine, setVaccine] = useState("");
  const [dateGiven, setDateGiven] = useState(todayIso());
  const [nextDue, setNextDue] = useState("");
  const [vetName, setVetName] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const today = todayIso();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!vaccine.trim() || !dateGiven) { setError("Vaccine name and date are required."); return; }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/pets/${petId}/vaccinations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vaccine: vaccine.trim(), dateGiven, nextDue, vetName: vetName.trim(), notes: notes.trim() }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not add this record.");
      setVaccine(""); setNextDue(""); setVetName(""); setNotes("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add this record.");
    } finally {
      setBusy(false);
    }
  }

  async function removeRecord(id: string) {
    await fetch(`/api/vaccinations/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      {records.length === 0 ? (
        <div className="empty-note"><Syringe size={22} /><strong>No vaccination records yet</strong>Records added by our vets at each visit will appear here, with next-due reminders.</div>
      ) : (
        <div className="table-wrap" style={{ marginBottom: 18 }}>
          <table className="data-table" style={{ minWidth: 520 }}>
            <thead><tr><th>Vaccine</th><th>Date given</th><th>Next due</th><th>Vet</th>{canDelete && <th aria-label="Actions" />}</tr></thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td><span className="cell-strong">{record.vaccine}</span>{record.notes && <span className="cell-sub">{record.notes}</span>}</td>
                  <td>{formatDate(record.dateGiven)}</td>
                  <td>
                    {record.nextDue
                      ? <span className={record.nextDue < today ? "vax-overdue" : record.nextDue <= today.replace(/\d{2}$/, (d) => String(Math.min(28, Number(d) + 30))) ? "" : ""}>{formatDate(record.nextDue)}{record.nextDue < today ? " · overdue" : ""}</span>
                      : "—"}
                  </td>
                  <td>{record.vetName || "—"}</td>
                  {canDelete && (
                    <td><div className="row-actions"><button type="button" className="icon-btn danger" onClick={() => removeRecord(record.id)} aria-label={`Delete ${record.vaccine} record`}><Trash2 size={15} /></button></div></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <form className="form-grid" onSubmit={submit} noValidate style={{ borderTop: "1px dashed #ddd0ac", paddingTop: 18 }}>
        {error && <div className="form-error-summary field-full" role="alert">{error}</div>}
        <div className="field">
          <label htmlFor="vax-name">Vaccine <span>*</span></label>
          <input id="vax-name" value={vaccine} onChange={(e) => setVaccine(e.target.value)} placeholder="e.g. Rabies, FVRCP, DA2PP" list="vax-suggestions" />
          <datalist id="vax-suggestions">
            <option value="Rabies" /><option value="DA2PP (Core — Dog)" /><option value="FVRCP (Core — Cat)" />
            <option value="Bordetella / Kennel Cough" /><option value="Deworming" /><option value="Anti-tick / Flea" />
          </datalist>
        </div>
        <div className="field">
          <label htmlFor="vax-date">Date given <span>*</span></label>
          <input id="vax-date" type="date" value={dateGiven} onChange={(e) => setDateGiven(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="vax-due">Next due</label>
          <input id="vax-due" type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="vax-vet">Administered by</label>
          <input id="vax-vet" value={vetName} onChange={(e) => setVetName(e.target.value)} placeholder="Vet or clinic name" />
        </div>
        <div className="field field-full">
          <label htmlFor="vax-notes">Notes</label>
          <input id="vax-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Batch no., reaction notes…" />
        </div>
        <div className="field-full">
          <button type="submit" className="button button-primary" disabled={busy}>
            {busy ? <Loader2 size={16} className="spin" /> : <Plus size={16} />} Add vaccination record
          </button>
        </div>
      </form>
    </div>
  );
}
