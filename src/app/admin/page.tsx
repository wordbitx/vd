import Link from "next/link";
import { ArrowRight, CalendarDays, Inbox, Package, PawPrint, ShoppingBag, Siren, TrendingUp, Users } from "lucide-react";
import { PortalHead } from "@/components/portal-shell";
import { requireRole } from "@/lib/auth";
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_TONES, ORDER_STATUS_LABELS, ORDER_STATUS_TONES, formatDate, pkr, todayIso } from "@/lib/format";
import { adminStats, listAppointments, listOrders } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Admin Dashboard", "Jawad Veterinary Hospital admin panel.", "/admin");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminHomePage() {
  const user = await requireRole(["admin", "vet"], "/admin");
  const stats = adminStats();
  const today = todayIso();
  const todaysQueue = listAppointments({ date: today }).sort((a, b) => a.token - b.token);
  const recentOrders = listOrders().slice(0, 5);
  const pendingBookings = listAppointments({ status: "pending" }).slice(0, 5);

  return (
    <div>
      <PortalHead
        eyebrow="Hospital Control Room"
        title={`Good day, ${user.name.split(" ")[0]}.`}
        description={`Today is ${formatDate(today)}. Here's everything happening at Jawad Veterinary Hospital.`}
      >
        <Link href="/admin/appointments" className="button button-gold"><CalendarDays size={16} /> Today&apos;s queue</Link>
      </PortalHead>

      <div className="stat-cards">
        <div className="stat-card"><span className="stat-icon"><CalendarDays size={19} /></span><strong>{stats.todaysAppointments}</strong><small>Appointments today</small></div>
        <div className={`stat-card ${stats.pendingAppointments > 0 ? "alert" : ""}`}><span className="stat-icon"><Siren size={19} /></span><strong>{stats.pendingAppointments}</strong><small>Bookings to confirm</small></div>
        <div className={`stat-card ${stats.pendingOrders > 0 ? "alert" : ""}`}><span className="stat-icon"><ShoppingBag size={19} /></span><strong>{stats.pendingOrders}</strong><small>New Pet Mall orders</small></div>
        <div className="stat-card"><span className="stat-icon"><TrendingUp size={19} /></span><strong>{pkr(stats.deliveredRevenue)}</strong><small>Delivered order revenue</small></div>
      </div>
      <div className="stat-cards">
        <div className="stat-card"><span className="stat-icon"><Users size={19} /></span><strong>{stats.customers}</strong><small>Registered customers</small></div>
        <div className="stat-card"><span className="stat-icon"><PawPrint size={19} /></span><strong>{stats.petsRegistered}</strong><small>Pet passports issued</small></div>
        <div className={`stat-card ${stats.lowStock > 0 ? "alert" : ""}`}><span className="stat-icon"><Package size={19} /></span><strong>{stats.lowStock}</strong><small>Products low on stock (≤5)</small></div>
        <div className={`stat-card ${stats.unreadMessages + stats.pendingAdoptions > 0 ? "alert" : ""}`}><span className="stat-icon"><Inbox size={19} /></span><strong>{stats.unreadMessages + stats.pendingAdoptions}</strong><small>Messages &amp; adoptions waiting</small></div>
      </div>

      <div className="portal-card">
        <div className="card-head-row"><h2>Today&apos;s token queue</h2><Link href="/admin/appointments" className="mini-link">Manage appointments <ArrowRight size={12} style={{ verticalAlign: -2 }} /></Link></div>
        {todaysQueue.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Token</th><th>Pet &amp; owner</th><th>Service</th><th>Time</th><th>Visit</th><th>Status</th></tr></thead>
              <tbody>
                {todaysQueue.map((a) => (
                  <tr key={a.id}>
                    <td><span className="cell-strong" style={{ fontFamily: "var(--display)", fontSize: 18 }}>{a.token}</span></td>
                    <td><span className="cell-strong">{a.petName}</span><span className="cell-sub">{a.ownerName} · {a.ownerPhone}</span></td>
                    <td>{a.serviceTitle}{a.emergency ? " · Emergency" : ""}</td>
                    <td>{a.timeSlot}</td>
                    <td>{a.visitType === "home" ? `Home · ${a.area || "Lahore"}` : "Hospital"}</td>
                    <td><span className={`badge ${APPOINTMENT_STATUS_TONES[a.status]}`}>{APPOINTMENT_STATUS_LABELS[a.status]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-note"><CalendarDays size={22} /><strong>No appointments today yet</strong>New online bookings will appear here with token numbers.</div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
        <div className="portal-card">
          <div className="card-head-row"><h2>Awaiting confirmation</h2><Link href="/admin/appointments?status=pending" className="mini-link">Review <ArrowRight size={12} style={{ verticalAlign: -2 }} /></Link></div>
          {pendingBookings.length ? (
            <div className="list-rows">
              {pendingBookings.map((a) => (
                <div className="list-row" key={a.id}>
                  <span className="lr-icon"><CalendarDays size={18} /></span>
                  <div style={{ minWidth: 0 }}>
                    <p className="lr-title">{a.petName} · {a.serviceTitle}</p>
                    <p className="lr-sub">{formatDate(a.date)} · {a.timeSlot} · {a.ownerName}</p>
                  </div>
                  <div className="lr-right"><span className="badge tone-amber">Pending</span></div>
                </div>
              ))}
            </div>
          ) : <p className="card-sub" style={{ margin: 0 }}>All caught up — no bookings waiting for confirmation.</p>}
        </div>
        <div className="portal-card">
          <div className="card-head-row"><h2>Latest Pet Mall orders</h2><Link href="/admin/orders" className="mini-link">Manage orders <ArrowRight size={12} style={{ verticalAlign: -2 }} /></Link></div>
          {recentOrders.length ? (
            <div className="list-rows">
              {recentOrders.map((o) => (
                <div className="list-row" key={o.id}>
                  <span className="lr-icon"><ShoppingBag size={18} /></span>
                  <div style={{ minWidth: 0 }}>
                    <p className="lr-title">{o.ref} · {pkr(o.total)}</p>
                    <p className="lr-sub">{o.customerName} · {o.items.reduce((s, i) => s + i.quantity, 0)} items</p>
                  </div>
                  <div className="lr-right"><span className={`badge ${ORDER_STATUS_TONES[o.status]}`}>{ORDER_STATUS_LABELS[o.status]}</span></div>
                </div>
              ))}
            </div>
          ) : <p className="card-sub" style={{ margin: 0 }}>No orders yet.</p>}
        </div>
      </div>
    </div>
  );
}
