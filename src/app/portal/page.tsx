import Link from "next/link";
import { ArrowRight, Calendar, Check, Clock, FileText, HeartPulse, MessageCircle, PawPrint, Printer, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { Empty, Eyebrow, WhatsAppButton } from "@/components/ui";
import { money, dateShort, dateLabel, daysUntil, ago } from "@/lib/format";
import { portalSummary } from "@/server/queries";
import { requireUser } from "@/server/auth";
import { rows } from "@/server/store";
import { business, whatsappUrl } from "@/lib/site";
import { PetPassportCard } from "@/components/portal/pet-passport";

export default async function PortalOverview() {
  const user = await requireUser();
  const [summary, messages] = await Promise.all([portalSummary(user.id), rows("messages")]);
  const next = summary.appointments;
  const myMessages = messages.filter((m) => m.userId === user.id).slice(0, 3);
  const nextVaccine = summary.allPets.flatMap((pet) => pet.nextDue ? [{ pet, due: pet.nextDue }] : []).sort((a, b) => (a.due.dueIn ?? 0) - (b.due.dueIn ?? 0))[0];

  const kpis = [
    { label: "Next visit", value: next ? dateLabel(next.date).split(" ").slice(0, 2).join(" ") : "None", sub: next ? `${next.slotLabel} · ${next.serviceTitle}` : "Book when you need us", icon: <Calendar size={15} /> },
    { label: "Visits completed", value: String(summary.visits), sub: "Across your household", icon: <Check size={15} /> },
    { label: "Outstanding", value: money(summary.unpaid), sub: summary.unpaid ? "Payable at the visit" : "Nothing owed", icon: <FileText size={15} /> },
    { label: "Lifetime with the clinic", value: money(summary.spend), sub: `Across ${summary.orders} order${summary.orders === 1 ? "" : "s"} & visits`, icon: <Sparkles size={15} /> },
  ];

  return (
    <>
      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi">
            <span className="kpi-label">{kpi.icon} {kpi.label}</span>
            <div className="kpi-value">{kpi.value}</div>
            <span className="tiny muted">{kpi.sub}</span>
          </div>
        ))}
      </div>

      <div className="work-grid">
        <div className="col" style={{ gap: 18 }}>
          <section className="app-card">
            <div className="app-card-head">
              <div>
                <h2>Next appointment</h2>
                <p>{next ? "Everything is confirmed — the slip is ready if you need it." : "Nothing booked. Same-day slots are usually available."}</p>
              </div>
              <span className="spacer" />
              {next ? <span className={`status status-${next.status}`}>{next.status.replace(/_/g, " ")}</span> : null}
            </div>
            <div className="app-card-body">
              {next ? (
                <div className="col" style={{ gap: 16 }}>
                  <div className="row" style={{ gap: 16, flexWrap: "wrap" }}>
                    <span className="service-icon" style={{ marginBottom: 0 }}><PawPrint size={20} /></span>
                    <div className="col" style={{ gap: 2, flex: 1, minWidth: 180 }}>
                      <b style={{ fontSize: 16, letterSpacing: "-0.02em" }}>{next.serviceTitle}</b>
                      <span className="small muted">{next.petName} · {next.mode === "home" ? "Home visit" : "Hospital"} · {next.area}</span>
                    </div>
                    <div className="col" style={{ gap: 2, alignItems: "flex-end" }}>
                      <b style={{ fontSize: 14.5 }}>{dateShort(next.date)}</b>
                      <span className="small muted"><Clock size={12} style={{ verticalAlign: "-2px" }} /> {next.slotLabel} · {next.slotWindow}</span>
                    </div>
                    <span className="price"><small>Total due</small><b>{money(next.total)}</b></span>
                  </div>
                  <div className="row" style={{ gap: 9, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                    <Link href={`/slip/${next.ref}`} className="button button-dark button-sm"><Printer size={14} /> Open slip</Link>
                    <Link href="/portal/appointments" className="button button-ghost button-sm">Manage visit</Link>
                    <WhatsAppButton message={`Assalam-o-Alaikum, regarding booking ${next.ref} for ${next.petName}.`} label="Message the clinic" className="button button-ghost button-sm" />
                    <span className="spacer" />
                    <span className="table-ref">{next.ref}</span>
                  </div>
                </div>
              ) : (
                <Empty title="No visits booked" href="/book-vet-appointment-lahore" hrefLabel="Book a vet" icon={<Calendar size={24} />}>
                  Vaccinations, checkups and home visits can usually be arranged the same day.
                </Empty>
              )}
            </div>
          </section>

          <section className="app-card">
            <div className="app-card-head">
              <div><h2>Digital pet passports</h2><p>Records the clinic keeps for you — yours to reprint at any time.</p></div>
              <span className="spacer" />
              <Link href="/portal/pets" className="link-arrow">Manage <ArrowRight size={14} /></Link>
            </div>
            <div className="app-card-body col" style={{ gap: 12 }}>
              {summary.allPets.length ? summary.allPets.map((pet) => <PetPassportCard key={pet.id} pet={pet} compact />) : (
                <Empty title="No pets yet" href="/portal/pets" hrefLabel="Add your first pet" icon={<PawPrint size={24} />}>Add a pet to unlock vaccination reminders and printable records.</Empty>
              )}
            </div>
          </section>

          <section className="app-card">
            <div className="app-card-head">
              <div><h2>Recent orders</h2><p>Pet mall deliveries and their current status.</p></div>
              <span className="spacer" />
              <Link href="/portal/orders" className="link-arrow">All orders <ArrowRight size={14} /></Link>
            </div>
            <div className="table-wrap">
              {summary.allOrders.length ? (
                <table className="table">
                  <thead><tr><th>Reference</th><th>Items</th><th>Total</th><th>Status</th><th /></tr></thead>
                  <tbody>
                    {summary.allOrders.slice(0, 4).map((order) => (
                      <tr key={order.id}>
                        <td><span className="table-ref">{order.ref}</span><div className="table-cell-sub">{ago(order.createdAt)}</div></td>
                        <td><span className="table-cell-title">{order.items[0]?.name ?? "—"}</span><div className="table-cell-sub">{order.items.length} line{order.items.length === 1 ? "" : "s"} {order.items.length > 1 ? `· +${order.items.length - 1}` : ""}</div></td>
                        <td className="num">{money(order.total)}</td>
                        <td><span className={`status status-${order.status}`}>{order.status.replace(/_/g, " ")}</span></td>
                        <td className="num"><Link href="/portal/orders" className="icon-btn" aria-label="View order"><ArrowRight size={14} /></Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <div style={{ padding: 18 }}><Empty title="No orders yet" href="/shop" hrefLabel="Visit the pet mall" icon={<ShoppingBag size={22} />}>Food, grooming and essentials delivered across Lahore.</Empty></div>}
            </div>
          </section>
        </div>

        <aside className="side-stack">
          <section className="app-card">
            <div className="app-card-head"><h3 style={{ fontSize: 15 }}><HeartPulse size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6, color: "var(--brass)" }} />Care reminders</h3></div>
            <div className="app-card-body col" style={{ gap: 12 }}>
              {nextVaccine ? (
                <div className="note note-brass" style={{ display: "grid", gap: 6 }}>
                  <b style={{ fontSize: 13 }}>{nextVaccine.pet.name} · {nextVaccine.due.vaccine}</b>
                  <span className="small">
                    {(nextVaccine.due.dueIn ?? 0) < 0
                      ? `Overdue by ${Math.abs(nextVaccine.due.dueIn ?? 0)} days — book a booster.`
                      : `Due in ${nextVaccine.due.dueIn} days (${dateLabel(nextVaccine.due.nextDue!)}).`}
                  </span>
                  <Link href="/book-vet-appointment-lahore?service=vaccination" className="button button-dark button-xs" style={{ justifySelf: "start" }}>Book booster</Link>
                </div>
              ) : (
                <p className="small muted" style={{ margin: 0 }}>No vaccine due dates recorded. Add a pet passport and we will track them for you.</p>
              )}
              {summary.allPets.some((p) => p.nextDue?.overdue) ? <p className="tiny" style={{ color: "var(--danger)", margin: 0, fontWeight: 750 }}>Your portal shows an overdue vaccine — the clinic has been notified.</p> : null}
              <div className="hairline-top">
                <span className="field-label tiny" style={{ fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-2)" }}>Quick links</span>
                <div className="quicklink-row" style={{ marginTop: 8 }}>
                  <Link href="/book-vet-appointment-lahore" className="chip">Book a visit</Link>
                  <Link href="/portal/records" className="chip">Vaccine card</Link>
                  <Link href="/shop" className="chip">Reorder food</Link>
                </div>
              </div>
            </div>
          </section>

          <section className="app-card">
            <div className="app-card-head"><h3 style={{ fontSize: 15 }}><MessageCircle size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6, color: "var(--brass)" }} />Clinic messages</h3><span className="spacer" /><Link href="/portal/messages" className="link-arrow" style={{ fontSize: 11.5 }}>Open <ArrowRight size={13} /></Link></div>
            <div className="app-card-body col" style={{ gap: 12 }}>
              {myMessages.length ? myMessages.map((message) => (
                <div key={message.id} className="col" style={{ gap: 4, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
                  <div className="row-between" style={{ gap: 10 }}>
                    <b style={{ fontSize: 13 }}>{message.subject}</b>
                    {message.reply ? <span className="pill pill-ok" style={{ fontSize: 9 }}>Replied</span> : <span className="pill pill-warn" style={{ fontSize: 9 }}>Awaiting</span>}
                  </div>
                  <span className="tiny muted">{ago(message.at)}</span>
                </div>
              )) : <p className="small muted" style={{ margin: 0 }}>No messages yet. Ask a question and a veterinarian answers within one working day.</p>}
              <Link href="/portal/messages" className="button button-ghost button-sm">Ask the clinic</Link>
            </div>
          </section>

          <section className="card card-pad" style={{ display: "grid", gap: 10, background: "linear-gradient(150deg,#f8f4ec,#fffdfa)" }}>
            <Eyebrow>Delivery</Eyebrow>
            <b style={{ fontSize: 14 }}><Truck size={14} style={{ verticalAlign: "-2px" }} /> Free delivery above {money(5000)}</b>
            <span className="small muted">Orders before 4 pm arrive the same evening in Lahore. {business.phone} for anything urgent.</span>
            <a className="link-arrow" href={whatsappUrl("Assalam-o-Alaikum, a question about my order.")} target="_blank" rel="noreferrer">WhatsApp the store <ArrowRight size={14} /></a>
          </section>
        </aside>
      </div>
    </>
  );
}
