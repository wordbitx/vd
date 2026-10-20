import type { ReactNode } from "react";
import Link from "next/link";
import { Calendar, CalendarCheck, ChartBar, ClipboardList, FileText, LayoutDashboard, MessageCircle, Package, PawPrint, Settings, ShoppingBag, Star, Stethoscope, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { requireStaff } from "@/server/auth";
import { signOut } from "@/server/actions/auth";
import { adminStats } from "@/server/queries";
import { getSettings } from "@/server/store";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const staff = await requireStaff();
  const [stats, settings] = await Promise.all([adminStats(), getSettings()]);
  const { kpis } = stats;

  const items = [
    { href: "/admin", label: "Overview", icon: <LayoutDashboard size={16} />, group: "Clinic today" },
    { href: "/admin/today", label: "Today's board", icon: <CalendarCheck size={16} />, count: kpis.todayCount, group: "Clinic today" },
    { href: "/admin/appointments", label: "Appointments", icon: <Calendar size={16} />, count: kpis.pendingCount, alert: kpis.pendingCount > 0, group: "Clinic today" },
    { href: "/admin/orders", label: "Orders", icon: <ShoppingBag size={16} />, count: kpis.ordersPending, alert: kpis.ordersPending > 0, group: "Clinic today" },
    { href: "/admin/customers", label: "Clients & pets", icon: <Users size={16} />, group: "Records" },
    { href: "/admin/messages", label: "Portal messages", icon: <MessageCircle size={16} />, count: kpis.openMessages, alert: kpis.openMessages > 0, group: "Records" },
    { href: "/admin/reviews", label: "Reviews", icon: <Star size={16} />, group: "Records" },
    { href: "/admin/products", label: "Pet mall", icon: <Package size={16} />, count: kpis.lowStock.length, alert: kpis.lowStock.length > 0, group: "Commerce" },
    { href: "/admin/services", label: "Services & fees", icon: <Stethoscope size={16} />, group: "Commerce" },
    { href: "/admin/adoption", label: "Adoption desk", icon: <PawPrint size={16} />, group: "Content" },
    { href: "/admin/posts", label: "Journal", icon: <FileText size={16} />, group: "Content" },
    { href: "/admin/staff", label: "Team & roles", icon: <Users size={16} />, group: "Settings" },
    { href: "/admin/settings", label: "Clinic settings", icon: <Settings size={16} />, group: "Settings" },
  ];

  return (
    <AppShell
      user={staff}
      items={items}
      title="Clinic console"
      subtitle={`${kpis.todayCount} visit${kpis.todayCount === 1 ? "" : "s"} today · ${kpis.pendingCount} booking${kpis.pendingCount === 1 ? "" : "s"} awaiting confirmation`}
      brandHref="/admin"
      brandLabel={settings.clinicName.replace(" Veterinary Hospital", "")}
      brandNote="Staff console"
      signOutAction={signOut}
      actions={
        <>
          <Link href="/admin/today" className="button button-ghost button-sm"><ClipboardList size={15} /> Today</Link>
          <Link href="/admin/appointments" className="button button-primary button-sm"><Calendar size={15} /> New booking</Link>
        </>
      }
      footer={
        <div className="col" style={{ gap: 6 }}>
          <Link href="/" className="row" style={{ gap: 7, fontSize: 11.5, color: "#8fa8ae" }}><ChartBar size={13} /> View public site</Link>
          <p className="tiny" style={{ color: "#5d767d", margin: 0 }}>v1.0 · data stored locally</p>
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
