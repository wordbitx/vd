import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { AppointmentSlip, OrderSlip, SlipVerificationNote } from "@/components/slip";
import { findAppointmentByRef, findOrderByRef } from "@/server/queries";
import { noIndex } from "@/lib/metadata";

export const metadata: Metadata = { title: "Printable slip", ...noIndex };

export default async function SlipPage({ params, searchParams }: { params: Promise<{ ref: string }>; searchParams: Promise<{ kind?: string }> }) {
  const [{ ref }, { kind }] = await Promise.all([params, searchParams]);
  const appointment = kind === "order" ? null : await findAppointmentByRef(ref);
  const order = kind === "order" ? await findOrderByRef(ref) : appointment ? null : await findOrderByRef(ref);

  if (!appointment && !order) notFound();

  return (
    <div className="slip-page container">
      <div className="slip-page-head no-print">
        <Link href="/" className="link-arrow" style={{ justifyContent: "center" }}><ArrowLeft size={14} /> Back to the site</Link>
        <h1 style={{ fontSize: 26, margin: "12px 0 4px" }}>{appointment ? "Booking slip" : "Order confirmation"}</h1>
        <p className="muted small" style={{ margin: 0 }}>Use your browser’s print dialog and choose “Save as PDF” to keep a copy.</p>
        <PrintButton />
      </div>
      {appointment ? <AppointmentSlip appointment={appointment} wide /> : order ? <OrderSlip order={order} wide /> : null}
      <div className="no-print"><SlipVerificationNote /></div>
    </div>
  );
}
