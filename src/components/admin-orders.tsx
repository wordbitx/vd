"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, MessageCircle, Printer, Search, ShoppingBag, X } from "lucide-react";
import { ORDER_STATUS_LABELS, PAYMENT_LABELS, formatDateTime, pkr } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "packed", "out-for-delivery", "delivered", "cancelled"];

function waNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("92") ? digits : digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
}

export function AdminOrders({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Order | null>(null);
  const [busyId, setBusyId] = useState("");

  const filtered = useMemo(() => orders.filter((o) => {
    if (status && o.status !== status) return false;
    if (search) {
      const hay = `${o.ref} ${o.customerName} ${o.phone} ${o.area} ${o.city}`.toLowerCase();
      if (!hay.includes(search.trim().toLowerCase())) return false;
    }
    return true;
  }), [orders, status, search]);

  async function patch(order: Order, body: Record<string, string>) {
    setBusyId(order.id);
    await fetch(`/api/orders/${order.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusyId("");
    router.refresh();
    setDetail((current) => current && current.id === order.id ? { ...current, ...body } as Order : current);
  }

  return (
    <div>
      <div className="admin-filters no-print">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search orders</span>
          <input type="search" placeholder="Search order ref, customer, phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
        </select>
        <span className="results-count">{filtered.length} shown</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-note"><ShoppingBag size={24} /><strong>No orders match</strong>Try a different status or search term.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table" style={{ minWidth: 840 }}>
            <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th aria-label="Actions" /></tr></thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td><span className="cell-strong">{o.ref}</span><span className="cell-sub">{formatDateTime(o.createdAt)}</span></td>
                  <td><span className="cell-strong">{o.customerName}</span><span className="cell-sub">{o.phone} · {o.area || o.city}</span></td>
                  <td>{o.items.reduce((s, i) => s + i.quantity, 0)} items<span className="cell-sub">{o.items[0]?.name}{o.items.length > 1 ? ` +${o.items.length - 1} more` : ""}</span></td>
                  <td><span className="cell-strong">{pkr(o.total)}</span></td>
                  <td>
                    {PAYMENT_LABELS[o.paymentMethod]}
                    <span className="cell-sub">{o.paymentStatus === "paid" ? "Paid" : "Unpaid"}</span>
                  </td>
                  <td>
                    <select className="status-select" value={o.status} disabled={busyId === o.id} onChange={(e) => patch(o, { status: e.target.value })} aria-label={`Status for ${o.ref}`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className="row-actions">
                      <a className="icon-btn" href={`https://wa.me/${waNumber(o.phone)}?text=${encodeURIComponent(`Hello ${o.customerName}, this is Jawad Pet Mall about your order ${o.ref} (${pkr(o.total)}).`)}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${o.customerName}`} title="WhatsApp customer"><MessageCircle size={15} /></a>
                      <Link className="icon-btn" href={`/checkout/success/${o.ref}`} target="_blank" aria-label={`Invoice ${o.ref}`} title="Invoice"><Printer size={15} /></Link>
                      <button type="button" className="icon-btn" onClick={() => setDetail(o)} aria-label={`Order details ${o.ref}`} title="Details"><Eye size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detail && (
        <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-label={`Order ${detail.ref}`}>
          <div className="dialog">
            <div className="card-head-row">
              <div>
                <h2>{detail.ref}</h2>
                <p className="dialog-sub" style={{ margin: 0 }}>{formatDateTime(detail.createdAt)} · {ORDER_STATUS_LABELS[detail.status]}</p>
              </div>
              <button type="button" className="icon-btn" onClick={() => setDetail(null)} aria-label="Close"><X size={16} /></button>
            </div>
            <div className="review-list" style={{ margin: "16px 0" }}>
              <div><span>Customer</span><strong>{detail.customerName} · {detail.phone}{detail.email ? ` · ${detail.email}` : ""}</strong></div>
              <div><span>Deliver to</span><strong>{detail.address}{detail.area ? `, ${detail.area}` : ""}, {detail.city}</strong></div>
              {detail.notes && <div><span>Notes</span><strong>{detail.notes}</strong></div>}
              <div><span>Payment</span><strong>{PAYMENT_LABELS[detail.paymentMethod]} · {detail.paymentStatus}</strong></div>
            </div>
            <table className="slip-table">
              <thead><tr><th>Item</th><th>Qty</th><th>Amount</th></tr></thead>
              <tbody>
                {detail.items.map((item) => (
                  <tr key={item.productId}><td>{item.name}{item.unit ? ` (${item.unit})` : ""}</td><td>{item.quantity}</td><td>{pkr(item.unitPrice * item.quantity)}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="slip-totals">
              <div className="fee-line"><span>Subtotal</span><span>{pkr(detail.subtotal)}</span></div>
              <div className="fee-line"><span>Delivery</span><span>{detail.deliveryFee === 0 ? "FREE" : pkr(detail.deliveryFee)}</span></div>
              <div className="fee-line total"><span>Total</span><span>{pkr(detail.total)}</span></div>
            </div>
            <div className="dialog-actions">
              {detail.paymentStatus !== "paid"
                ? <button type="button" className="button button-primary" disabled={busyId === detail.id} onClick={() => patch(detail, { paymentStatus: "paid" })}>Mark payment received</button>
                : <button type="button" className="button button-outline" disabled={busyId === detail.id} onClick={() => patch(detail, { paymentStatus: "unpaid" })}>Mark unpaid</button>}
              <Link className="button button-outline" href={`/checkout/success/${detail.ref}`} target="_blank"><Printer size={15} /> Print invoice</Link>
              <span className="spacer" />
              <button type="button" className="button button-outline" onClick={() => setDetail(null)}>Close</button>
            </div>
            <p style={{ fontSize: 11, color: "#93a0a8", marginTop: 14, lineHeight: 1.6 }}>Cancelling an order automatically returns its items to stock. COD orders are marked paid on delivery.</p>
          </div>
        </div>
      )}
    </div>
  );
}
