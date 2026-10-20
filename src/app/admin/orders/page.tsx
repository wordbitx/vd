import Link from "next/link";
import { Filter, Printer, Search, Truck } from "lucide-react";
import { InlineSelect } from "@/components/admin/inline-form";
import { setOrderPayment, setOrderStatus } from "@/server/actions/admin";
import { rows } from "@/server/store";
import { ago, money } from "@/lib/format";

const orderStatuses = ["pending", "packed", "dispatched", "delivered", "cancelled"];

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const [{ status = "all", q = "" }] = await Promise.all([searchParams]);
  const orders = await rows("orders");
  const needle = q.trim().toLowerCase();
  const visible = orders
    .filter((o) => (status === "all" ? true : o.status === status))
    .filter((o) => (needle ? `${o.ref} ${o.name} ${o.phone} ${o.area} ${o.items.map((i) => i.name).join(" ")}`.toLowerCase().includes(needle) : true))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const revenue = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const outstanding = orders.filter((o) => o.payment.status === "unpaid" && o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <>
      <div className="kpi-grid">
        {[
          { label: "Open orders", value: String(orders.filter((o) => ["pending", "packed", "dispatched"].includes(o.status)).length), sub: "Awaiting delivery" },
          { label: "Delivered revenue", value: money(revenue), sub: `${orders.filter((o) => o.status === "delivered").length} orders completed` },
          { label: "Cash outstanding", value: money(outstanding), sub: "Collected by riders on delivery" },
          { label: "Average basket", value: money(orders.length ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0), sub: "Across the demo data" },
        ].map((card) => (
          <div key={card.label} className="kpi">
            <span className="kpi-label">{card.label}</span>
            <div className="kpi-value">{card.value}</div>
            <span className="tiny muted">{card.sub}</span>
          </div>
        ))}
      </div>

      <section className="app-card">
        <div className="app-card-head">
          <div><h2>Pet mall orders</h2><p>Stock is decremented when the order is placed; marking delivered confirms the sale.</p></div>
        </div>
        <form className="filter-bar" action="/admin/orders" method="get">
          <div className="search"><Search size={14} /><input className="input" name="q" defaultValue={q} placeholder="Search reference, client, item…" /></div>
          <select className="select" name="status" defaultValue={status} aria-label="Filter status">
            <option value="all">All statuses</option>
            {orderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="button button-ghost button-xs" type="submit"><Filter size={13} /> Apply</button>
          <Link href="/admin/orders" className="button button-ghost button-xs">Reset</Link>
          <span className="spacer" />
          <span className="tiny muted"><Truck size={12} style={{ verticalAlign: "-2px" }} /> Same-day inside Lahore before 4 pm</span>
        </form>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Reference</th><th>Client</th><th>Items</th><th>Area</th><th>Status</th><th>Payment</th><th className="num">Total</th><th /></tr></thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id}>
                  <td><span className="table-ref">{order.ref}</span><div className="table-cell-sub">{ago(order.createdAt)}</div></td>
                  <td><span className="table-cell-title">{order.name}</span><div className="table-cell-sub">{order.phone}</div></td>
                  <td><span className="small">{order.items[0]?.name ?? "—"}</span><div className="table-cell-sub">{order.items.length} line{order.items.length === 1 ? "" : "s"} · {order.items.reduce((s, i) => s + i.qty, 0)} units</div></td>
                  <td className="small">{order.area}</td>
                  <td><InlineSelect action={setOrderStatus} name="status" value={order.status} hidden={{ id: order.id }} options={orderStatuses} label="Order status" /></td>
                  <td><InlineSelect action={setOrderPayment} name="paymentStatus" value={order.payment.status} hidden={{ id: order.id }} options={["unpaid", "paid", "refunded"]} label="Payment" /></td>
                  <td className="num">{money(order.total)}</td>
                  <td><div className="table-actions"><Link href={`/slip/${order.ref}?kind=order`} className="icon-btn" target="_blank" aria-label="Invoice"><Printer size={14} /></Link></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length ? <div style={{ padding: 26 }} className="center"><p className="small muted" style={{ margin: 0 }}>No orders match those filters.</p></div> : null}
        </div>
        <div className="table-foot"><span>{visible.length} order{visible.length === 1 ? "" : "s"} shown</span><span>Delivery fee and free-delivery threshold are editable in Clinic settings</span></div>
      </section>
    </>
  );
}
