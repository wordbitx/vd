"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, HeartHandshake, Inbox, LayoutDashboard, LogOut, Package, PawPrint, Settings, ShoppingBag, Stethoscope, UserRound, Users } from "lucide-react";
import { initials } from "@/lib/format";
import type { User } from "@/lib/types";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; badgeKey?: string; exact?: boolean };

const CUSTOMER_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/pets", label: "My Pets & Passport", icon: PawPrint },
  { href: "/dashboard/appointments", label: "My Appointments", icon: CalendarDays, badgeKey: "upcomingAppointments" },
  { href: "/dashboard/orders", label: "My Orders", icon: ShoppingBag, badgeKey: "activeOrders" },
  { href: "/dashboard/adopt", label: "Adoption Posts", icon: HeartHandshake, badgeKey: "pendingAdoptions" },
  { href: "/dashboard/profile", label: "Profile & Security", icon: UserRound },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarDays, badgeKey: "pendingAppointments" },
  { href: "/admin/orders", label: "Pet Mall Orders", icon: ShoppingBag, badgeKey: "pendingOrders" },
  { href: "/admin/products", label: "Products", icon: Package, badgeKey: "lowStock" },
  { href: "/admin/patients", label: "Patients & Passports", icon: Stethoscope },
  { href: "/admin/adoptions", label: "Adoptions", icon: HeartHandshake, badgeKey: "pendingAdoptions" },
  { href: "/admin/customers", label: "Customers & Staff", icon: Users },
  { href: "/admin/messages", label: "Inbox", icon: Inbox, badgeKey: "unreadMessages" },
  { href: "/admin/settings", label: "Hospital Settings", icon: Settings },
];

export function PortalShell({ user, variant, badges = {}, children }: {
  user: User;
  variant: "customer" | "admin";
  badges?: Record<string, number>;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = variant === "admin" ? ADMIN_NAV : CUSTOMER_NAV;
  const roleLabel = user.role === "admin" ? "Administrator" : user.role === "vet" ? "Veterinary Staff" : "Pet Parent";

  const isActive = (item: NavItem) => item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  }

  return (
    <section className="portal-section">
      <div className="container">
        <div className="portal-shell">
          <aside className="portal-sidebar no-print">
            <div className="portal-user">
              <span className="avatar-lg" aria-hidden="true">{initials(user.name)}</span>
              <div>
                <strong>{user.name}</strong>
                <small>{roleLabel}</small>
              </div>
            </div>
            <nav className="portal-nav" aria-label={variant === "admin" ? "Admin navigation" : "Portal navigation"}>
              {nav.map((item) => {
                const Icon = item.icon;
                const badge = item.badgeKey ? badges[item.badgeKey] ?? 0 : 0;
                return (
                  <Link key={item.href} href={item.href} className={isActive(item) ? "active" : ""} aria-current={isActive(item) ? "page" : undefined}>
                    <Icon size={17} /> {item.label}
                    {badge > 0 && <span className="nav-badge">{badge > 99 ? "99+" : badge}</span>}
                  </Link>
                );
              })}
            </nav>
            <button type="button" className="portal-logout" onClick={logout}><LogOut size={16} /> Log out</button>
          </aside>
          <div className="portal-main">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function PortalHead({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="portal-head no-print">
      <div>
        <span className="eyebrow"><span className="eyebrow-line" /> {eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{children}</div>}
    </div>
  );
}
