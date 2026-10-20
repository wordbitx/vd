import { PawPrint } from "lucide-react";
import { ORDER_STATUS_LABELS, PAYMENT_LABELS, formatDateTime, pkr } from "@/lib/format";
import { business } from "@/lib/site";
import type { Order } from "@/lib/types";
import { Barcode, maskPhone } from "@/components/booking-slip";

export function OrderInvoice({ order, full = false }: { order: Order; full?: boolean }) {
  const o = order;
  return (
    <article className="slip print-sheet" aria-label={`Order invoice ${o.ref}`}>
      <header className="slip-head">
        <span className="slip-logo-mark" aria-hidden="true"><PawPrint size={27} /></span>
        <div>
          <h2>{business.name} · Pet Mall</h2>
          <p>{business.address}<br />{business.phone} · {business.email}</p>
        </div>
        <div className="slip-doc-type">
          <small>Order Invoice</small>
          <strong>{o.ref}</strong>
        </div>
      </header>

      <div className="slip-token-row">
        <div className="slip-token-side" style={{ paddingLeft: 30 }}>
          <div className="st-fact"><span>Order date</span><strong>{formatDateTime(o.createdAt)}</strong></div>
          <div className="st-fact"><span>Order status</span><strong>{ORDER_STATUS_LABELS[o.status]}</strong></div>
          <div className="st-fact"><span>Payment</span><strong>{PAYMENT_LABELS[o.paymentMethod]} · {o.paymentStatus === "paid" ? "Paid" : "Payable"}</strong></div>
          <div className="st-fact"><span>Items</span><strong>{o.items.reduce((sum, item) => sum + item.quantity, 0)}</strong></div>
        </div>
      </div>

      <div className="slip-body">
        <div className="slip-grid">
          <div className="slip-field"><span>Customer</span><strong>{o.customerName}</strong></div>
          <div className="slip-field"><span>Phone</span><strong>{full ? o.phone : maskPhone(o.phone)}</strong></div>
          <div className="slip-field wide"><span>Delivery address</span><strong>{o.address}{o.area ? `, ${o.area}` : ""}, {o.city}</strong></div>
          {o.notes && <div className="slip-field wide"><span>Order notes</span><strong>{o.notes}</strong></div>}
        </div>

        <table className="slip-table" style={{ marginTop: 16 }}>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {o.items.map((item) => (
              <tr key={`${item.productId}-${item.slug}`}>
                <td><strong style={{ color: "#0a2540" }}>{item.name}</strong>{item.unit ? <small style={{ display: "block", color: "#93a0a8" }}>{item.unit}</small> : null}</td>
                <td>{item.quantity}</td>
                <td>{pkr(item.unitPrice)}</td>
                <td>{pkr(item.unitPrice * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="slip-totals">
          <div className="fee-line"><span>Subtotal</span><span>{pkr(o.subtotal)}</span></div>
          <div className="fee-line"><span>Delivery</span><span>{o.deliveryFee === 0 ? "FREE" : pkr(o.deliveryFee)}</span></div>
          <div className="fee-line total"><span>Total {o.paymentStatus === "paid" ? "(Paid)" : ""}</span><span>{pkr(o.total)}</span></div>
        </div>
      </div>

      <footer className="slip-foot">
        <Barcode value={o.ref} />
        <p>Thank you for shopping at Jawad Pet Mall. Please inspect your parcel on delivery — for any issue, WhatsApp {business.phone} within 48 hours with your order reference.</p>
        <span className={`slip-stamp ${o.status === "cancelled" ? "cancelled" : o.status === "delivered" ? "" : "pending"}`}>{ORDER_STATUS_LABELS[o.status]}</span>
      </footer>
    </article>
  );
}
