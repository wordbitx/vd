import { PortalHead } from "@/components/portal-shell";
import { AdminMessages } from "@/components/admin-messages";
import { requireRole } from "@/lib/auth";
import { listMessages } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Inbox · Admin", "Website contact messages.", "/admin/messages");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminMessagesPage() {
  await requireRole(["admin", "vet"], "/admin/messages");
  const messages = listMessages();
  return (
    <div>
      <PortalHead eyebrow="Communication" title="Inbox" description="Every message sent from the website contact form — reply in one tap on WhatsApp or email." />
      <AdminMessages messages={messages} />
    </div>
  );
}
