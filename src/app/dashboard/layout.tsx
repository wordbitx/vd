import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal-shell";
import { requireUser } from "@/lib/auth";
import { todayIso } from "@/lib/format";
import { listAdoptionsByUser, listAppointmentsByUser, listOrdersByUser } from "@/lib/hospital-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser("/dashboard");
  // Staff land in the admin panel by default.
  if (user.role === "admin" || user.role === "vet") redirect("/admin");

  const today = todayIso();
  const appointments = listAppointmentsByUser(user.id);
  const orders = listOrdersByUser(user.id);
  const adoptions = listAdoptionsByUser(user.id);
  const badges = {
    upcomingAppointments: appointments.filter((a) => ["pending", "confirmed", "checked-in"].includes(a.status) && a.date >= today).length,
    activeOrders: orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length,
    pendingAdoptions: adoptions.filter((a) => a.status === "pending").length,
  };

  return <PortalShell user={user} variant="customer" badges={badges}>{children}</PortalShell>;
}
