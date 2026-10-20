import { PortalHead } from "@/components/portal-shell";
import { ProfileForm } from "@/components/profile-form";
import { requireUser } from "@/lib/auth";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Profile & Security", "Manage your Jawad Veterinary Hospital account details and password.", "/dashboard/profile");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function ProfilePage() {
  const user = await requireUser("/dashboard/profile");
  return (
    <div>
      <PortalHead eyebrow="Account" title="Profile & security" description="Your contact details power faster bookings, home visits and deliveries." />
      <ProfileForm user={user} />
    </div>
  );
}
