import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { dateLabel, money } from "@/lib/format";
import { business } from "@/lib/site";
import { barcodeSvg } from "@/lib/barcode";
import { PrintButton } from "@/components/print-button";
import { WhatsAppButton } from "@/components/ui";
import type { Appointment, Order } from "@/lib/types";

const statusTone = (status: string) =>
  ["completed", "delivered", "paid"].includes(status) ? "ok" : ["cancelled", "no_show"].includes(status) ? "danger" : ["pending"].includes(status) ? "warn" : "ok";

function SlipShell({
  kind, refCode, issued, status, children, footerNote, wide = false,
}: { kind: string; refCode: string; issued: string; status: string; children: React.ReactNode; footerNote: string; wide?: boolean }) {
  const tone = statusTone(status);
  return (
    <article className={`slip${wide ? " slip-wide" : ""}`} id="slip">
      <header className="slip-head">
        <div className="slip-clinic">
          <span className="brand-mark" style={{ width: 26, height: 26, borderRadius: 8 }}><span style={{ fontSize: 11 }}>{business.monogram}</span></span>
          <b>{business.name}</b>
        </div>
        <span className="slip-label">{kind}</span>
        <h2 className="slip-ref">{refCode}</h2>
        <span className="slip-sub">Issued {issued} · {business.shortAddress}</span>
        <span className={`slip-stamp slip-stamp-${tone}`}>{status.replace(/_/g, " ")}</span>
      </header>
      <div className="slip-perf" />
      {children}
      <div className="slip-code">
        <div dangerouslySetInnerHTML={{ __html: barcodeSvg(refCode, { height: 46 }) }} />
        <small>{refCode}</small>
      </div>
      <footer className="slip-foot">
        <span>{footerNote}</span>
        <span style={{ textAlign: "right" }}>{business.phone}<br />{business.email}</span>
      </footer>
    </article>
  );
}

export function AppointmentSlip({ appointment, wide = false }: { appointment: Appointment; wide?: boolean }) {
  return (
    <SlipShell
      wide={wide}
      kind={appointment.mode === "home" ? "Home visit booking reference" : "Hospital visit booking reference"}
      refCode={appointment.ref}
      issued={dateLabel(appointment.createdAt.slice(0, 10))}
      status={appointment.status}
      footerNote={appointment.mode === "home" ? `Show this slip to the veterinarian on arrival. ${appointment.address}` : "Bring this slip and your pet's records to the hospital."}
    >
      <dl className="slip-rows">
        <Row label="Date" value={dateLabel(appointment.date)} />
        <Row label="Time" value={`${appointment.slotLabel} (${appointment.slotWindow})`} />
        <Row label="Patient" value={`${appointment.petName}${appointment.breed ? ` · ${appointment.breed}` : ""}`} sub={`${appointment.species}${appointment.petAge ? ` · ${appointment.petAge}` : ""}`} />
        <Row label="Service" value={appointment.serviceTitle} brand />
        <Row label="Visit type" value={appointment.mode === "home" ? (appointment.urgency === "emergency" ? "Home visit · emergency" : "Home visit · Lahore") : "Hospital consult"} sub={appointment.vetName ? `Assigned: ${appointment.vetName}` : "Vet assigned on confirmation"} />
        <Row label="Total due" value={money(appointment.total)} strong />
      </dl>
      <div className="slip-fees">
        {appointment.lines.map((line) => (
          <div className="slip-fee" key={line.label}>
            <span>{line.label}</span>
            <b style={line.amount < 0 ? { color: "var(--ok)" } : undefined}>{line.amount < 0 ? `− ${money(Math.abs(line.amount))}` : money(line.amount)}</b>
          </div>
        ))}
      </div>
      <div className="slip-total">
        <span>Payment</span>
        <b>{appointment.payment.status === "paid" ? "Paid" : `${money(appointment.total)} due`}
          <small style={{ display: "block", fontFamily: "var(--sans)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginTop: 4 }}>
            {appointment.payment.status === "paid" ? "Receipt on file" : appointment.payment.method === "cod" ? "Cash after the visit" : "Transfer / wallet"}
          </small>
        </b>
      </div>
    </SlipShell>
  );
}

export function OrderSlip({ order, wide = false }: { order: Order; wide?: boolean }) {
  return (
    <SlipShell
      wide={wide}
      kind="Pet Mall order confirmation"
      refCode={order.ref}
      issued={dateLabel(order.createdAt.slice(0, 10))}
      status={order.status}
      footerNote={`Delivering to ${order.address}. Riders call ${order.phone} on the way.`}
    >
      <dl className="slip-rows">
        <Row label="Order for" value={order.name} sub={`${order.area} · ${order.phone}`} />
        <Row label="Items" value={`${order.items.length} product${order.items.length === 1 ? "" : "s"}`} brand />
      </dl>
      <div className="slip-fees" style={{ borderTop: "1px dashed #cfc4ae" }}>
        {order.items.map((item) => (
          <div className="slip-fee" key={item.productId}>
            <span>{item.qty} × {item.name}</span>
            <b>{money(item.price * item.qty)}</b>
          </div>
        ))}
        <div className="slip-fee"><span>Delivery in Lahore</span><b>{order.delivery ? money(order.delivery) : "Free"}</b></div>
        {order.discount ? <div className="slip-fee"><span>Promo discount</span><b style={{ color: "var(--ok)" }}>− {money(order.discount)}</b></div> : null}
      </div>
      <div className="slip-total">
        <span>Total {order.payment.status === "paid" ? "paid" : "due on delivery"}</span>
        <b>{money(order.total)}</b>
      </div>
    </SlipShell>
  );
}

function Row({ label, value, sub, strong, brand }: { label: string; value: React.ReactNode; sub?: string; strong?: boolean; brand?: boolean }) {
  return (
    <div className="slip-row">
      <dt>{label}</dt>
      <dd style={strong ? { fontSize: 17 } : undefined} className={brand ? "slip-brand" : undefined}>
        {value}
        {sub ? <small>{sub}</small> : null}
      </dd>
    </div>
  );
}

export function SlipActions({ refCode, message, href }: { refCode: string; message: string; href?: string }) {
  return (
    <div className="slip-actions no-print">
      <PrintButton />
      <WhatsAppButton message={message} label="Send to the clinic" className="button button-brass button-sm" />
      {href ? <Link href={href} className="button button-ghost button-sm">Open in portal <ArrowRight size={14} /></Link> : null}
    </div>
  );
}

export function SlipVerificationNote() {
  return (
    <p className="tiny muted center" style={{ maxWidth: 520, margin: "18px auto 0" }}>
      <ShieldCheck size={12} style={{ display: "inline", verticalAlign: "-2px", marginRight: 5 }} />
      This reference is generated by the clinic system. The barcode matches the booking record; the front desk can verify it in seconds.
    </p>
  );
}
