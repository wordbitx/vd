"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Eye, Loader2, MessageCircle, Printer, Save, Search, X } from "lucide-react";
import { APPOINTMENT_STATUS_LABELS, TIME_SLOTS, formatDate, formatDateTime, pkr, todayIso } from "@/lib/format";
import type { Appointment, AppointmentStatus } from "@/lib/types";

const STATUSES: AppointmentStatus[] = ["pending", "confirmed", "checked-in", "completed", "cancelled", "no-show"];

function waNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("92") ? digits : digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
}

export function AdminAppointments({ appointments, focusUserName }: { appointments: Appointment[]; focusUserName?: string }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Appointment | null>(null);
  const [busyId, setBusyId] = useState("");

  const filtered = useMemo(() => appointments.filter((a) => {
    if (date && a.date !== date) return false;
    if (status && a.status !== status) return false;
    if (search) {
      const hay = `${a.ref} ${a.ownerName} ${a.ownerPhone} ${a.petName} ${a.serviceTitle}`.toLowerCase();
      if (!hay.includes(search.trim().toLowerCase())) return false;
    }
    return true;
  }), [appointments, date, status, search]);

  async function patch(id: string, body: Record<string, string>) {
    setBusyId(id);
    await fetch(`/api/appointments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusyId("");
    router.refresh();
  }

  return (
    <div>
      <div className="admin-filters no-print">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search appointments</span>
          <input type="search" placeholder="Search ref, owner, phone, pet…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Filter by date" />
        {date !== todayIso() && <button type="button" className="button button-outline" style={{ minHeight: 40 }} onClick={() => setDate(todayIso())}>Today</button>}
        {date && <button type="button" className="button button-outline" style={{ minHeight: 40 }} onClick={() => setDate("")}>All dates</button>}
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{APPOINTMENT_STATUS_LABELS[s]}</option>)}
        </select>
        <span className="results-count">{filtered.length} shown</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-note"><CalendarDays size={24} /><strong>No appointments match</strong>Try a different date or search term.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table" style={{ minWidth: 860 }}>
            <thead>
              <tr><th>Token / Ref</th><th>Pet &amp; owner</th><th>Service</th><th>Schedule</th><th>Visit</th><th>Fee</th><th>Status</th><th aria-label="Actions" /></tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} style={a.emergency && ["pending", "confirmed"].includes(a.status) ? { background: "#fff7f6" } : undefined}>
                  <td>
                    <span className="cell-strong" style={{ fontFamily: "var(--display)", fontSize: 17 }}>{a.token}</span>
                    <span className="cell-sub">{a.ref}</span>
                  </td>
                  <td>
                    <span className="cell-strong">{a.petName} · {a.petType}{a.petBreed ? ` (${a.petBreed})` : ""}</span>
                    <span className="cell-sub">{a.ownerName} · {a.ownerPhone}</span>
                  </td>
                  <td>{a.serviceTitle}{a.emergency && <span className="badge tone-red" style={{ marginLeft: 6 }}>Emergency</span>}</td>
                  <td>{formatDate(a.date)}<span className="cell-sub">{a.timeSlot}</span></td>
                  <td>{a.visitType === "home" ? "Home" : "Hospital"}{a.area ? <span className="cell-sub">{a.area}</span> : null}</td>
                  <td>{pkr(a.fee)}</td>
                  <td>
                    <select className="status-select" value={a.status} disabled={busyId === a.id} onChange={(e) => patch(a.id, { status: e.target.value })} aria-label={`Status for ${a.ref}`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{APPOINTMENT_STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className="row-actions">
                      <a className="icon-btn" href={`https://wa.me/${waNumber(a.ownerPhone)}?text=${encodeURIComponent(`Hello ${a.ownerName}, this is Jawad Veterinary Hospital regarding ${a.petName}'s ${a.serviceTitle} booking (${a.ref}) on ${formatDate(a.date)} at ${a.timeSlot}.`)}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${a.ownerName}`} title="WhatsApp customer"><MessageCircle size={15} /></a>
                      <Link className="icon-btn" href={`/book/slip/${a.ref}`} target="_blank" aria-label={`Print slip ${a.ref}`} title="Booking slip"><Printer size={15} /></Link>
                      <button type="button" className="icon-btn" onClick={() => setDetail(a)} aria-label={`Manage ${a.ref}`} title="Manage visit"><Eye size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detail && <AppointmentDetail key={`${detail.id}-${detail.status}`} appointment={detail} doctorSuggestions={focusUserName ? [focusUserName] : []} onClose={() => setDetail(null)} />}
    </div>
  );
}

function AppointmentDetail({ appointment: a, doctorSuggestions, onClose }: { appointment: Appointment; doctorSuggestions: string[]; onClose: () => void }) {
  const router = useRouter();
  const [doctorName, setDoctorName] = useState(a.doctorName);
  const [vetNotes, setVetNotes] = useState(a.vetNotes);
  const [followUpDate, setFollowUpDate] = useState(a.followUpDate);
  const [date, setDate] = useState(a.date);
  const [timeSlot, setTimeSlot] = useState(a.timeSlot);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    await fetch(`/api/appointments/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorName, vetNotes, followUpDate, date, timeSlot }),
    });
    setBusy(false);
    setSaved(true);
    router.refresh();
    window.setTimeout(onClose, 600);
  }

  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-label={`Manage appointment ${a.ref}`}>
      <div className="dialog">
        <div className="card-head-row">
          <div>
            <h2>{a.petName} · Token {a.token}</h2>
            <p className="dialog-sub" style={{ margin: 0 }}>{a.ref} · Booked {formatDateTime(a.createdAt)} · {APPOINTMENT_STATUS_LABELS[a.status]}</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>

        <div className="review-list" style={{ margin: "16px 0 18px" }}>
          <div><span>Owner</span><strong>{a.ownerName} · {a.ownerPhone}{a.ownerEmail ? ` · ${a.ownerEmail}` : ""}</strong></div>
          <div><span>Pet</span><strong>{a.petName} · {a.petType}{a.petBreed ? ` (${a.petBreed})` : ""}{a.petAge ? ` · ${a.petAge}` : ""}</strong></div>
          <div><span>Service</span><strong>{a.serviceTitle}{a.emergency ? " · EMERGENCY" : ""} · {a.visitType === "home" ? "Home visit" : "Hospital visit"}</strong></div>
          {a.visitType === "home" && <div><span>Address</span><strong>{a.address}{a.area ? `, ${a.area}` : ""}</strong></div>}
          {a.symptoms && <div><span>Symptoms</span><strong>{a.symptoms}</strong></div>}
          <div><span>Visiting charges</span><strong>{pkr(a.fee)}</strong></div>
        </div>

        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="adm-doc">Assigned veterinarian</label>
            <input id="adm-doc" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="e.g. Dr. Jawad" list="doctor-suggestions" />
            <datalist id="doctor-suggestions">
              <option value="Dr. Jawad" />
              {doctorSuggestions.map((name) => <option key={name} value={name} />)}
            </datalist>
          </div>
          <div className="field">
            <label htmlFor="adm-follow">Follow-up date</label>
            <input id="adm-follow" type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="adm-date">Reschedule date</label>
            <input id="adm-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="adm-slot">Time slot</label>
            <select id="adm-slot" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
              <option value="As soon as possible">As soon as possible</option>
              {TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
            </select>
          </div>
          <div className="field field-full">
            <label htmlFor="adm-notes">Vet notes / diagnosis / prescription</label>
            <textarea id="adm-notes" rows={5} value={vetNotes} onChange={(e) => setVetNotes(e.target.value)} placeholder={"Findings, treatment given, medicines with dosage, home-care instructions…\nThese notes appear on the customer's slip and in the pet's Digital Passport."} />
          </div>
          <div className="dialog-actions field-full" style={{ marginTop: 2 }}>
            <button type="submit" className="button button-primary" disabled={busy}>
              {busy ? <Loader2 size={16} className="spin" /> : <Save size={16} />} {saved ? "Saved!" : "Save visit record"}
            </button>
            <Link className="button button-outline" href={`/book/slip/${a.ref}`} target="_blank"><Printer size={15} /> Print slip</Link>
            <span className="spacer" />
            <button type="button" className="button button-outline" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}
