import { PortalHead } from "@/components/portal-shell";
import { AdminOrders } from "@/components/admin-orders";
import { requireRole } from "@/lib/auth";
import { listOrders } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Pet Mall Orders · Admin", "Manage online orders, payments and deliveries.", "/admin/orders");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminOrdersPage() {
  await requireRole(["admin", "vet"], "/admin/orders");
  const orders = listOrders();
  return (
    <div>
      <PortalHead
        eyebrow="Pet Mall"
        title="Orders"
        description="Confirm orders, update delivery progress and record payments. Customers track everything live in their portal."
      />
      <AdminOrders orders={orders} />
    </div>
  );
}
