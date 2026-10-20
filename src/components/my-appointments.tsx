"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Loader2, X } from "lucide-react";
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_TONES, formatDate, pkr, todayIso } from "@/lib/format";
import type { Appointment } from "@/lib/types";

type Tab = "upcoming" | "past" | "all";

export function MyAppointments({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [cancelling, setCancelling] = useState<Appointment | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const today = todayIso();

  const filtered = useMemo(() => {
    if (tab === "all") return appointments;
    if (tab === "upcoming") return appointments.filter((a) => ["pending", "confirmed", "checked-in"].includes(a.status) && a.date >= today);
    return appointments.filter((a) => !(["pending", "confirmed", "checked-in"].includes(a.status) && a.date >= today));
  }, [appointments, tab, today]);

  async function cancel() {
    if (!cancelling) return;
    setBusy(true);
    setError("");
    const res = await fetch(`/api/appointments/${cancelling.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) { setError(data.error ?? "Could not cancel this appointment."); return; }
    setCancelling(null);
    router.refresh();
  }

  return (
    <div>
      <div className="tab-pills no-print" role="tablist" aria-label="Appointment filter">
        {([["upcoming", "Upcoming"], ["past", "Past & closed"], ["all", "All"]] as [Tab, string][]).map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-note">
          <CalendarDays size={24} />
          <strong>{tab === "upcoming" ? "No upcoming appointments" : "Nothing here yet"}</strong>
          {tab === "upcoming" ? "Book a visit whenever your pet needs us — it takes under two minutes." : "Your appointment history will build up here over time."}
          <div style={{ marginTop: 12 }}><Link href="/book" className="button button-primary">Book a visit <ArrowRight size={15} /></Link></div>
        </div>
      ) : (
        <div className="portal-card" style={{ padding: "8px 22px" }}>
          <div className="list-rows">
            {filtered.map((appointment) => (
              <div className="list-row" key={appointment.id}>
                <span className="lr-icon"><CalendarDays size={19} /></span>
                <div style={{ minWidth: 0 }}>
                  <p className="lr-title">{appointment.petName} · {appointment.serviceTitle}{appointment.emergency ? " · Emergency" : ""}</p>
                  <p className="lr-sub">
                    Token {appointment.token} · {formatDate(appointment.date)} at {appointment.timeSlot} · {appointment.visitType === "home" ? "Home visit" : "Hospital"} · {pkr(appointment.fee)}
                  </p>
                </div>
                <div className="lr-right" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <span className={`badge ${APPOINTMENT_STATUS_TONES[appointment.status]}`}>{APPOINTMENT_STATUS_LABELS[appointment.status]}</span>
                  <Link className="mini-link" href={`/dashboard/appointments/${appointment.ref}`}>Slip</Link>
                  {["pending", "confirmed"].includes(appointment.status) && appointment.date >= today && (
                    <button type="button" className="mini-link" style={{ background: "none", border: 0, cursor: "pointer", color: "#a9241b", padding: 0 }} onClick={() => setCancelling(appointment)}>
                      <X size={12} style={{ verticalAlign: -2 }} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cancelling && (
        <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-label="Cancel appointment">
          <div className="dialog" style={{ maxWidth: 460 }}>
            <h2>Cancel this appointment?</h2>
            <p className="dialog-sub">
              {cancelling.petName} · {cancelling.serviceTitle} on {formatDate(cancelling.date)} at {cancelling.timeSlot} (Token {cancelling.token}).
              {error && <span style={{ display: "block", marginTop: 8, color: "#a9241b", fontWeight: 700 }}>{error}</span>}
            </p>
            <div className="dialog-actions">
              <button type="button" className="button button-danger-outline" onClick={cancel} disabled={busy}>{busy ? <Loader2 size={15} className="spin" /> : null} Yes, cancel booking</button>
              <span className="spacer" />
              <button type="button" className="button button-outline" onClick={() => setCancelling(null)}>Keep appointment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
