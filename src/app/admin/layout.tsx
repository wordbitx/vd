import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal-shell";
import { requireRole } from "@/lib/auth";
import { adminStats } from "@/lib/hospital-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireRole(["admin", "vet"], "/admin");
  const stats = adminStats();
  const badges = {
    pendingAppointments: stats.pendingAppointments,
    pendingOrders: stats.pendingOrders,
    lowStock: stats.lowStock,
    pendingAdoptions: stats.pendingAdoptions,
    unreadMessages: stats.unreadMessages,
  };
  return <PortalShell user={user} variant="admin" badges={badges}>{children}</PortalShell>;
}
