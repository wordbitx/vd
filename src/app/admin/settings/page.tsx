import { PortalHead } from "@/components/portal-shell";
import { AdminSettingsForm } from "@/components/admin-settings-form";
import { requireRole } from "@/lib/auth";
import { getSettings } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Hospital Settings · Admin", "Fees, delivery and announcements.", "/admin/settings");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminSettingsPage() {
  const user = await requireRole(["admin", "vet"], "/admin/settings");
  const settings = getSettings();
  return (
    <div>
      <PortalHead eyebrow="Configuration" title="Hospital settings" description="Control the fees and announcements the whole platform runs on — changes take effect immediately." />
      <AdminSettingsForm settings={settings} canEdit={user.role === "admin"} />
    </div>
  );
}
