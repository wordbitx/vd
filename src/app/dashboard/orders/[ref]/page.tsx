import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { OrderInvoice } from "@/components/order-invoice";
import { OrderTimeline } from "@/components/order-timeline";
import { OrderSlipActions } from "@/components/slip-actions";
import { requireUser } from "@/lib/auth";
import { PAYMENT_LABELS, pkr } from "@/lib/format";
import { getOrderByRef } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Order Invoice", "Your Jawad Pet Mall order invoice and delivery tracking.", "/dashboard/orders");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function MyOrderPage({ params }: { params: Promise<{ ref: string }> }) {
  const user = await requireUser("/dashboard/orders");
  const { ref } = await params;
  const order = getOrderByRef(ref);
  if (!order || order.userId !== user.id) notFound();

  const whatsappText = `🧾 Jawad Pet Mall — Order ${order.ref}\n\n${order.items.map((item) => `• ${item.name} × ${item.quantity} — ${pkr(item.unitPrice * item.quantity)}`).join("\n")}\n\nTotal: ${pkr(order.total)} (${PAYMENT_LABELS[order.paymentMethod]})`;

  return (
    <div>
      <p className="no-print" style={{ marginBottom: 16 }}>
        <Link href="/dashboard/orders" className="back-link"><ArrowLeft size={16} /> All orders</Link>
      </p>
      <div className="portal-card no-print" style={{ marginBottom: 18 }}>
        <h2 style={{ marginBottom: 16 }}>Delivery progress</h2>
        <OrderTimeline status={order.status} />
      </div>
      <OrderInvoice order={order} full />
      <OrderSlipActions whatsappText={whatsappText} showPortal />
    </div>
  );
}
