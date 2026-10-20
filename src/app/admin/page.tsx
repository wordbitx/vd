import Link from "next/link";
import { AlertTriangle, ArrowRight, Calendar, Check, CircleDollarSign, Clock, Package, Plus, ShoppingBag, Star, Stethoscope, TrendingDown, TrendingUp, Users } from "lucide-react";
import { BookingLine, Donut, RevenueChart } from "@/components/admin/chart";
import { InlineSelect } from "@/components/admin/inline-form";
import { Eyebrow } from "@/components/ui";
import { setAppointmentStatus } from "@/server/actions/admin";
import { adminStats } from "@/server/queries";
import { money, dateShort, ago, dateLabel } from "@/lib/format";
import { business } from "@/lib/site";

export default async function AdminOverview() {
  const stats = await adminStats();
  const { kpis, schedule, overdueVaccines, audit, settings } = stats;

  const cards = [
    { label: "Revenue this month", value: money(kpis.monthRevenue), delta: kpis.revenueDelta, sub: "Completed visits + delivered orders", icon: <CircleDollarSign size={15} />, dark: true },
    { label: "Upcoming visits", value: String(kpis.upcomingCount), sub: `${kpis.urgent} emergency case${kpis.urgent === 1 ? "" : "s"} in the queue`, icon: <Calendar size={15} /> },
    { label: "Orders to fulfil", value: String(kpis.ordersPending), sub: `${kpis.unpaidCount} completed visit${kpis.unpaidCount === 1 ? "" : "s"} unpaid`, icon: <ShoppingBag size={15} /> },
    { label: "Clients", value: String(kpis.customers), sub: `${kpis.newCustomers30} new in the last 30 days · ${kpis.pets} pets`, icon: <Users size={15} /> },
  ];

  return (
    <>
      <div className="kpi-grid">
        {cards.map((card) => (
          <div key={card.label} className={`kpi${card.dark ? " kpi-dark" : ""}`}>
            <span className="kpi-label">{card.icon} {card.label}</span>
            <div className="kpi-value">{card.value}</div>
            {card.delta !== undefined && card.delta !== null ? (
              <span className={`kpi-delta${card.delta < 0 ? " kpi-delta-down" : ""}`}>
                {card.delta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {Math.abs(card.delta)}% vs last month
              </span>
            ) : (
              <span className="kpi-delta kpi-delta-flat">{card.sub}</span>
            )}
            {card.delta !== undefined && card.delta !== null ? <span className="tiny muted" style={{ display: "block", marginTop: 3 }}>{card.sub}</span> : null}
          </div>
        ))}
      </div>

      <div className="work-grid">
        <div className="col" style={{ gap: 18 }}>
          <section className="app-card">
            <div className="app-card-head">
              <div><h2>Revenue · last 14 days</h2><p>Completed visits only — orders appear once delivered.</p></div>
              <span className="spacer" />
              <span className="pill pill-soft">{money(stats.series.reduce((s, d) => s + d.revenue, 0))} total</span>
            </div>
            <div className="app-card-body">
              <RevenueChart series={stats.series} />
            </div>
            <div className="app-card-foot">
              <span className="small muted">Home visits are {kpis.homeShare}% of all bookings this quarter.</span>
              <span className="spacer" />
              <Link href="/admin/appointments" className="link-arrow">Open the board <ArrowRight size={13} /></Link>
            </div>
          </section>

          <section className="app-card">
            <div className="app-card-head">
              <div><h2>Today’s schedule</h2><p>{dateLabel(stats.today)} · {schedule.length} visit{schedule.length === 1 ? "" : "s"} on the book</p></div>
              <span className="spacer" />
              <Link href="/admin/today" className="button button-ghost button-xs">Full board</Link>
            </div>
            {schedule.length ? (
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Time</th><th>Patient / service</th><th>Vet</th><th>Status</th><th className="num">Fee</th></tr></thead>
                  <tbody>
                    {schedule.map((appointment) => (
                      <tr key={appointment.id}>
                        <td><b className="small">{appointment.slotLabel}</b><div className="table-cell-sub">{appointment.slotWindow}</div></td>
                        <td>
                          <span className="table-cell-title">{appointment.petName} · {appointment.serviceTitle}</span>
                          <div className="table-cell-sub">{appointment.mode === "home" ? `Home · ${appointment.area}` : "Hospital"} · {appointment.guestName}</div>
                        </td>
                        <td className="small">{appointment.vetName ?? "—"}</td>
                        <td><InlineSelect action={setAppointmentStatus} name="status" value={appointment.status} hidden={{ id: appointment.id }} options={["pending", "confirmed", "dispatched", "in_progress", "completed", "cancelled", "no_show"]} label="Appointment status" /></td>
                        <td className="num">{money(appointment.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="app-card-body"><p className="small muted" style={{ margin: 0 }}>Nothing on the book today. <Link href="/admin/appointments" style={{ textDecoration: "underline" }}>Create a walk-in booking</Link>.</p></div>
            )}
          </section>

          <section className="app-card">
            <div className="app-card-head"><div><h2>Needs attention</h2><p>Sorted by what loses the clinic money or goodwill first.</p></div></div>
            <div className="app-card-body col" style={{ gap: 10 }}>
              {[
                { icon: <Calendar size={15} />, label: "Bookings awaiting confirmation", value: kpis.pendingCount, href: "/admin/appointments?status=pending", cta: "Confirm" },
                { icon: <CircleDollarSign size={15} />, label: "Completed visits unpaid", value: kpis.unpaidCount, href: "/admin/appointments?status=completed", cta: "Reconcile" },
                { icon: <Stethoscope size={15} />, label: "Vaccines overdue across the client base", value: overdueVaccines.length, href: "/admin/customers", cta: "Call owners" },
                { icon: <Package size={15} />, label: "Products at or below 15 in stock", value: kpis.lowStock.length, href: "/admin/products", cta: "Restock" },
                { icon: <Star size={15} />, label: "Portal messages unanswered", value: kpis.openMessages, href: "/admin/messages", cta: "Reply" },
              ].filter((row) => row.value > 0).map((row) => (
                <div key={row.label} className="row" style={{ gap: 12, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
                  <span className="icon-btn" style={{ color: "var(--warn)", borderColor: "rgba(155,107,13,.3)" }}>{row.icon}</span>
                  <span className="col" style={{ gap: 1, flex: 1 }}>
                    <b className="small">{row.label}</b>
                    <span className="tiny muted">{row.value} to action</span>
                  </span>
                  <Link href={row.href} className="button button-ghost button-xs">{row.cta} <ArrowRight size={12} /></Link>
                </div>
              ))}
              {!kpis.pendingCount && !kpis.unpaidCount && !overdueVaccines.length && !kpis.lowStock.length && !kpis.openMessages ? (
                <div className="row" style={{ gap: 10 }}><span className="icon-btn" style={{ color: "var(--ok)" }}><Check size={15} /></span><span className="small">Everything is clear. Good week so far.</span></div>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="side-stack">
          <section className="app-card">
            <div className="app-card-head"><div><h2>Service mix</h2><p>All bookings in the demo database.</p></div></div>
            <div className="app-card-body"><Donut slices={stats.serviceMix.map((s) => ({ label: s.label.replace(/ &.*/, ""), value: s.value }))} /></div>
          </section>

          <section className="app-card">
            <div className="app-card-head"><div><h2>Bookings trend</h2><p>Last 14 days</p></div><span className="spacer" /><span className="tiny muted">{stats.series.reduce((s, d) => s + d.bookings, 0)} bookings</span></div>
            <div className="app-card-body"><BookingLine series={stats.series} /></div>
          </section>

          <section className="app-card">
            <div className="app-card-head"><div><h2>Vaccine reminders due</h2><p>Call or WhatsApp before the owner drifts.</p></div></div>
            <div className="app-card-body col" style={{ gap: 10 }}>
              {overdueVaccines.length ? overdueVaccines.map((item) => (
                <div key={item.id} className="row" style={{ gap: 10, paddingBottom: 9, borderBottom: "1px solid var(--line)" }}>
                  <span className="pill pill-danger" style={{ fontSize: 9 }}>{Math.abs(item.dueIn ?? 0)}d late</span>
                  <span className="col" style={{ gap: 0, flex: 1 }}>
                    <b className="small">{item.pet?.name ?? "Unknown pet"}</b>
                    <span className="tiny muted">{item.vaccine}</span>
                  </span>
                  <Link href={`/admin/customers`} className="icon-btn" aria-label="Open client"><ArrowRight size={13} /></Link>
                </div>
              )) : <p className="small muted" style={{ margin: 0 }}>No overdue vaccines. The reminder list is clean.</p>}
              <Link href="/admin/messages" className="button button-ghost button-xs" style={{ alignSelf: "start" }}>Send a reminder batch</Link>
            </div>
          </section>

          <section className="app-card">
            <div className="app-card-head"><div><h2>Recent activity</h2><p>Every change is logged with a name.</p></div></div>
            <div className="app-card-body col" style={{ gap: 0 }}>
              {audit.map((entry) => (
                <div key={entry.id} className="timeline-item" data-done="true" style={{ paddingBottom: 12 }}>
                  <span className="timeline-dot" />
                  <div>
                    <b className="small">{entry.action} · {entry.target}</b>
                    <small>{entry.actor} · {ago(entry.at)}{entry.detail ? ` · ${entry.detail}` : ""}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="app-card card-pad" style={{ background: "linear-gradient(150deg,#f8f4ec,#fffdfa)" }}>
            <Eyebrow>Quick actions</Eyebrow>
            <div className="col" style={{ gap: 8, marginTop: 10 }}>
              <Link href="/admin/appointments" className="button button-dark button-sm"><Plus size={14} /> Book for a client</Link>
              <Link href="/admin/products" className="button button-ghost button-sm"><Package size={14} /> Adjust stock</Link>
              <Link href="/admin/settings" className="button button-ghost button-sm"><Clock size={14} /> Update fees &amp; hours</Link>
            </div>
            <p className="tiny muted" style={{ margin: "12px 0 0" }}>
              <AlertTriangle size={11} style={{ verticalAlign: "-2px" }} /> Data lives in <code>.data/</code> on this server. Export before deploying anywhere real.
            </p>
          </section>
        </aside>
      </div>

      <section className="app-card card-pad">
        <div className="row-between" style={{ gap: 16 }}>
          <div>
            <Eyebrow>Next up</Eyebrow>
            <h3 style={{ margin: "10px 0 4px", fontSize: 19 }}>{stats.upcoming.length} confirmed visit{stats.upcoming.length === 1 ? "" : "s"} in the next few days</h3>
            <p className="small muted" style={{ margin: 0 }}>{stats.upcoming.slice(0, 3).map((a) => `${a.petName} · ${dateShort(a.date)}`).join("  ·  ") || "Nothing scheduled yet."}</p>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <Link href="/admin/today" className="button button-ghost button-sm">Today’s board</Link>
            <a href={`https://wa.me/${(settings.whatsapp || business.whatsappNumber).replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="button button-primary button-sm">WhatsApp desk</a>
          </div>
        </div>
      </section>
    </>
  );
}
