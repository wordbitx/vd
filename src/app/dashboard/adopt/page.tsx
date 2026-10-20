import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { PortalHead } from "@/components/portal-shell";
import { AdoptManager } from "@/components/adopt-manager";
import { requireUser } from "@/lib/auth";
import { listAdoptionsByUser } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("My Adoption Posts", "Post and manage your pet adoption listings at Jawad Veterinary Hospital.", "/dashboard/adopt");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function MyAdoptionsPage() {
  const user = await requireUser("/dashboard/adopt");
  const mine = listAdoptionsByUser(user.id);
  return (
    <div>
      <PortalHead eyebrow="Adoption Board" title="My adoption posts" description="Help a pet find a forever home. Your listings are reviewed by our team before they appear on the public board.">
        <Link href="/adopt" className="button button-outline"><HeartHandshake size={16} /> Browse the board</Link>
      </PortalHead>
      <AdoptManager mine={mine} />
    </div>
  );
}
