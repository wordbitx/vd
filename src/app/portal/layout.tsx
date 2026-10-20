import type { ReactNode } from "react";
import Link from "next/link";
import { Calendar, FileText, Home, MessageCircle, PawPrint, ShoppingBag, User } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/server/auth";
import { signOut } from "@/server/actions/auth";
import { portalSummary } from "@/server/queries";
import { getSettings } from "@/server/store";

export const dynamic = "force-dynamic";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const user = await requireUser("/portal");
  const [summary, settings] = await Promise.all([portalSummary(user.id), getSettings()]);

  const items = [
    { href: "/portal", label: "Overview", icon: <Home size={16} />, group: "My pet care" },
    { href: "/portal/pets", label: "Pet passports", icon: <PawPrint size={16} />, count: summary.pets, group: "My pet care" },
    { href: "/portal/appointments", label: "Appointments", icon: <Calendar size={16} />, count: summary.upcomingCount, alert: summary.needsAttention > 0, group: "My pet care" },
    { href: "/portal/records", label: "Records & vaccines", icon: <FileText size={16} />, count: summary.vaccineDue, alert: summary.vaccineDue > 0, group: "My pet care" },
    { href: "/portal/orders", label: "Pet mall orders", icon: <ShoppingBag size={16} />, count: summary.orders, group: "My account" },
    { href: "/portal/messages", label: "Messages", icon: <MessageCircle size={16} />, group: "My account" },
    { href: "/portal/profile", label: "Profile & settings", icon: <User size={16} />, group: "My account" },
  ];

  const firstName = user.name.split(" ")[0];

  return (
    <AppShell
      user={user}
      items={items}
      title={`Assalam-o-Alaikum, ${firstName}`}
      subtitle={`${summary.pets} pet${summary.pets === 1 ? "" : "s"} · ${summary.upcomingCount} upcoming visit${summary.upcomingCount === 1 ? "" : "s"} · ${settings.clinicName}`}
      brandHref="/portal"
      brandLabel={settings.clinicName.replace(" Veterinary Hospital", "")}
      brandNote="Client portal"
      signOutAction={signOut}
      actions={
        <>
          <Link href="/shop" className="button button-ghost button-sm"><ShoppingBag size={15} /> Pet mall</Link>
          <Link href="/book-vet-appointment-lahore" className="button button-primary button-sm"><Calendar size={15} /> Book a visit</Link>
        </>
      }
      footer={<p className="tiny" style={{ color: "#6d868d", margin: 0 }}>Need a person? Call {settings.phone}</p>}
    >
      {children}
    </AppShell>
  );
}
