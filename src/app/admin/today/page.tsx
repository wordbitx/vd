import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone, Printer, User } from "lucide-react";
import { InlineSelect } from "@/components/admin/inline-form";
import { setAppointmentStatus } from "@/server/actions/admin";
import { adminStats } from "@/server/queries";
import { money, dateLabel } from "@/lib/format";

const groups = ["morning", "midday", "evening", "night", "any"] as const;
const groupLabels: Record<string, string> = { morning: "Morning · 10 am – 2 pm", midday: "Midday · 2 pm – 6 pm", evening: "Evening · 6 pm – 10 pm", night: "Night · 10 pm – 2 am", any: "Any time" };

export default async function TodayBoard() {
  const stats = await adminStats();
  const today = stats.schedule;
  const total = today.reduce((sum, a) => sum + a.total, 0);
  const collected = today.filter((a) => a.payment.status === "paid").reduce((sum, a) => sum + a.total, 0);

  return (
    <>
      <div className="kpi-grid">
        {[
          { label: "Visits on the book", value: String(today.length), sub: dateLabel(stats.today) },
          { label: "Home vs hospital", value: `${today.filter((a) => a.mode === "home").length} / ${today.filter((a) => a.mode === "clinic").length}`, sub: "Split for today" },
          { label: "Expected revenue", value: money(total), sub: `${money(collected)} already settled` },
          { label: "Unconfirmed", value: String(today.filter((a) => a.status === "pending").length), sub: "Call before dispatch" },
        ].map((card) => (
          <div key={card.label} className="kpi">
            <span className="kpi-label">{card.label}</span>
            <div className="kpi-value">{card.value}</div>
            <span className="tiny muted">{card.sub}</span>
          </div>
        ))}
      </div>

      {groups.map((group) => {
        const list = today.filter((a) => a.slotId === group);
        if (!list.length) return null;
        return (
          <section key={group} className="app-card">
            <div className="app-card-head">
              <div><h2><Clock size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />{groupLabels[group]}</h2><p>{list.length} visit{list.length === 1 ? "" : "s"}</p></div>
            </div>
            <div className="app-card-body grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}>
              {list.map((appointment) => (
                <article key={appointment.id} className="card card-pad" style={{ display: "grid", gap: 10, borderLeft: `3px solid ${appointment.urgency === "emergency" ? "var(--danger)" : appointment.mode === "home" ? "var(--brass)" : "var(--brand)"}` }}>
                  <div className="row-between" style={{ gap: 10 }}>
                    <div>
                      <b style={{ fontSize: 15, letterSpacing: "-0.02em" }}>{appointment.petName}</b>
                      <div className="tiny muted">{appointment.species} · {appointment.breed} · {appointment.petAge ?? "age n/a"}</div>
                    </div>
                    <span className={`status status-${appointment.status}`}>{appointment.status.replace(/_/g, " ")}</span>
                  </div>
                  <div className="col" style={{ gap: 3 }}>
                    <span className="small"><b>{appointment.serviceTitle}</b> · {money(appointment.total)}</span>
                    <span className="tiny muted"><MapPin size={11} style={{ verticalAlign: "-2px" }} /> {appointment.mode === "home" ? appointment.address : "Hospital, Al Kabir Town"}</span>
                    <span className="tiny muted"><Phone size={11} style={{ verticalAlign: "-2px" }} /> {appointment.guestPhone} · {appointment.guestName}</span>
                    {appointment.symptoms ? <span className="tiny" style={{ color: "var(--ink-2)" }}>“{appointment.symptoms}”</span> : null}
                  </div>
                  <div className="row" style={{ gap: 7, paddingTop: 8, borderTop: "1px dashed var(--line-2)" }}>
                    <InlineSelect action={setAppointmentStatus} name="status" value={appointment.status} hidden={{ id: appointment.id }} options={["pending", "confirmed", "dispatched", "in_progress", "completed", "cancelled", "no_show"]} label="Status" />
                    <span className="spacer" />
                    <Link href={`/slip/${appointment.ref}`} className="icon-btn" aria-label="Print slip" target="_blank"><Printer size={14} /></Link>
                    <a href={`tel:${appointment.guestPhone.replace(/\s/g, "")}`} className="icon-btn" aria-label="Call owner"><Phone size={14} /></a>
                    <Link href={`/admin/appointments?q=${appointment.ref}`} className="icon-btn" aria-label="Open booking"><ArrowRight size={14} /></Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {!today.length ? (
        <section className="app-card card-pad">
          <div className="empty">
            <User size={24} style={{ color: "var(--line-2)" }} />
            <h3>No visits booked for today</h3>
            <p>Create a walk-in or send a reminder to clients whose vaccines are due.</p>
            <Link href="/admin/appointments" className="button button-primary button-sm">Create a booking</Link>
          </div>
        </section>
      ) : null}

      <section className="app-card card-pad">
        <div className="row-between" style={{ gap: 14 }}>
          <div>
            <h3 style={{ fontSize: 18 }}>Dispatch checklist</h3>
            <p className="small muted" style={{ margin: "4px 0 0" }}>Before the mobile kit leaves: oxygen cylinder, IV fluids, vaccine cooler logged, printed slips for the home visits, and the card machine.</p>
          </div>
          <Link href="/admin/settings" className="button button-ghost button-sm">Edit clinic settings <ArrowRight size={14} /></Link>
        </div>
      </section>
    </>
  );
}
