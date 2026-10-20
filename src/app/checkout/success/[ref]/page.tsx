import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { OrderInvoice } from "@/components/order-invoice";
import { OrderSlipActions } from "@/components/slip-actions";
import { getCurrentUser } from "@/lib/auth";
import { PAYMENT_LABELS, pkr } from "@/lib/format";
import { getOrderByRef } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Order Confirmed", "Your Jawad Pet Mall order invoice.", "/checkout/success");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function CheckoutSuccessPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const order = getOrderByRef(ref);
  if (!order) notFound();
  const user = await getCurrentUser();
  const isOwner = Boolean(user && order.userId === user.id);
  const isStaff = Boolean(user && (user.role === "admin" || user.role === "vet"));

  const whatsappText = `🧾 Jawad Pet Mall — Order ${order.ref}\n\n${order.items.map((item) => `• ${item.name} × ${item.quantity} — ${pkr(item.unitPrice * item.quantity)}`).join("\n")}\n\nSubtotal: ${pkr(order.subtotal)}\nDelivery: ${order.deliveryFee === 0 ? "FREE" : pkr(order.deliveryFee)}\nTotal: ${pkr(order.total)} (${PAYMENT_LABELS[order.paymentMethod]})\n\nDeliver to: ${order.customerName}, ${order.address}${order.area ? `, ${order.area}` : ""}, ${order.city}`;

  return (
    <main id="main-content">
      <section className="section" style={{ paddingTop: 52 }}>
        <div className="container">
          <div className="slip-wrap">
            <div className="slip-success-banner no-print" role="status">
              <span className="success-icon"><Check size={26} /></span>
              <div>
                <h2>Order placed — thank you, {order.customerName.split(" ")[0]}!</h2>
                <p>
                  Order <strong>{order.ref}</strong> is with our Pet Mall team. We&apos;ll WhatsApp you shortly to confirm
                  {order.paymentMethod !== "cod" ? " payment details and" : ""} delivery timing. Save or print your invoice below.
                </p>
              </div>
            </div>
            <OrderInvoice order={order} full={isOwner || isStaff} />
            <OrderSlipActions whatsappText={whatsappText} showPortal={isOwner} />
          </div>
        </div>
      </section>
    </main>
  );
}
