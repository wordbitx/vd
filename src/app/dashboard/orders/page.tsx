import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { PortalHead } from "@/components/portal-shell";
import { requireUser } from "@/lib/auth";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES, formatDate, pkr } from "@/lib/format";
import { listOrdersByUser } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("My Pet Mall Orders", "Track your Jawad Pet Mall orders and download invoices.", "/dashboard/orders");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function MyOrdersPage() {
  const user = await requireUser("/dashboard/orders");
  const orders = listOrdersByUser(user.id);
  return (
    <div>
      <PortalHead eyebrow="Pet Mall" title="My orders" description="Track deliveries and download a printable invoice for every order.">
        <Link href="/shop" className="button button-gold"><ShoppingBag size={16} /> Shop the Pet Mall</Link>
      </PortalHead>
      {orders.length === 0 ? (
        <div className="empty-note">
          <ShoppingBag size={24} />
          <strong>No orders yet</strong>
          When you order from the Jawad Pet Mall, tracking and invoices will live here.
          <div style={{ marginTop: 12 }}><Link href="/shop" className="button button-primary">Browse the Pet Mall</Link></div>
        </div>
      ) : (
        <div className="portal-card" style={{ padding: "8px 22px" }}>
          <div className="list-rows">
            {orders.map((order) => (
              <Link key={order.id} href={`/dashboard/orders/${order.ref}`}>
                <span className="lr-icon"><ShoppingBag size={19} /></span>
                <div style={{ minWidth: 0 }}>
                  <p className="lr-title">{order.ref} · {pkr(order.total)}</p>
                  <p className="lr-sub">
                    {order.items.slice(0, 2).map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                    {order.items.length > 2 ? ` +${order.items.length - 2} more` : ""} · {formatDate(order.createdAt.slice(0, 10))}
                  </p>
                </div>
                <div className="lr-right"><span className={`badge ${ORDER_STATUS_TONES[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span></div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
