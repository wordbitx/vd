import { PortalHead } from "@/components/portal-shell";
import { AdminCustomers } from "@/components/admin-customers";
import { requireRole } from "@/lib/auth";
import { listUsers } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Customers & Staff · Admin", "Manage customer accounts and staff roles.", "/admin/customers");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminCustomersPage() {
  const user = await requireRole(["admin", "vet"], "/admin/customers");
  const users = listUsers();
  return (
    <div>
      <PortalHead
        eyebrow="Accounts"
        title="Customers & staff"
        description="Every registered account with its pets, visits and orders. Promote team members to vet or admin, and reset forgotten passwords."
      />
      <AdminCustomers users={users} currentUserId={user.id} canManage={user.role === "admin"} />
    </div>
  );
}
