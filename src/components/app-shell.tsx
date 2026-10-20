"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { initials } from "@/lib/format";
import type { SessionUser } from "@/lib/types";

export type NavItem = { href: string; label: string; icon: ReactNode; count?: number; alert?: boolean; group?: string };

export function AppShell({
  user, items, title, subtitle, actions, children, brandHref, brandLabel, brandNote, signOutAction, footer,
}: {
  user: SessionUser; items: NavItem[]; title: string; subtitle?: string; actions?: ReactNode; children: ReactNode;
  brandHref: string; brandLabel: string; brandNote: string; signOutAction: (formData: FormData) => Promise<void>; footer?: ReactNode;
}) {
  const pathname = usePathname();
  const groups = [...new Set(items.map((i) => i.group ?? ""))];

  return (
    <div className="app-shell">
      <aside className="app-side">
        <Link href="/" className="app-side-head brand" style={{ color: "inherit" }}>
          <span className="brand-mark"><span style={{ fontSize: 15 }}>JVH</span></span>
          <span className="brand-text">
            <b>{brandLabel}</b>
            <small>{brandNote}</small>
          </span>
        </Link>
        <nav className="app-nav" aria-label={brandNote}>
          {groups.map((group) => (
            <div key={group || "main"}>
              {group ? <span className="app-nav-label">{group}</span> : null}
              {items.filter((item) => (item.group ?? "") === group).map((item) => {
                const active = item.href === brandHref ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} data-active={active ? "true" : undefined}>
                    {item.icon}
                    {item.label}
                    {item.count !== undefined && item.count > 0 ? <span className={`count${item.alert ? " count-alert" : ""}`}>{item.count}</span> : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="app-side-foot">
          <div className="app-user">
            <span className="avatar">{initials(user.name)}</span>
            <span className="col" style={{ gap: 0, minWidth: 0 }}>
              <b>{user.name}</b>
              <small>{user.role === "customer" ? "Client portal" : `${user.role[0].toUpperCase()}${user.role.slice(1)} · clinic system`}</small>
            </span>
          </div>
          <form action={signOutAction}>
            <button className="button button-outline-light button-sm button-block" type="submit"><LogOut size={14} /> Sign out</button>
          </form>
          {footer}
        </div>
      </aside>

      <div className="app-main">
        <header className="app-top">
          <div>
            <h1>{title}</h1>
            {subtitle ? <p className="app-top-sub">{subtitle}</p> : null}
          </div>
          <div className="app-actions">{actions}</div>
        </header>
        <div className="app-body">{children}</div>
      </div>
    </div>
  );
}
