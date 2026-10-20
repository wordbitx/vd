import { PortalHead } from "@/components/portal-shell";
import { AdminAdoptions } from "@/components/admin-adoptions";
import { requireRole } from "@/lib/auth";
import { listAdoptions } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Adoptions · Admin", "Review and manage pet adoption listings.", "/admin/adoptions");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminAdoptionsPage() {
  await requireRole(["admin", "vet"], "/admin/adoptions");
  const adoptions = listAdoptions(["pending", "available", "adopted", "rejected"]);
  return (
    <div>
      <PortalHead
        eyebrow="Community"
        title="Adoption listings"
        description="Approve customer posts before they go live, and celebrate every successful adoption."
      />
      <AdminAdoptions adoptions={adoptions} />
    </div>
  );
}
