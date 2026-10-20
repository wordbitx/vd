import { getSettings, rows } from "@/server/store";
import { daysUntil, shiftISO, todayISO } from "@/lib/format";
import type { Appointment, MedicalRecord, Order, Pet, User, VaccineRecord } from "@/lib/types";

export const ACTIVE_STATUSES = ["pending", "confirmed", "dispatched", "in_progress"];
export const isLive = (status: string) => ACTIVE_STATUSES.includes(status);

const byDateDesc = <T extends { date?: string; createdAt: string }>(a: T, b: T) =>
  `${b.date ?? ""}${b.createdAt}`.localeCompare(`${a.date ?? ""}${a.createdAt}`);

export async function appointmentsForUser(userId: string) {
  const all = await rows("appointments");
  return all.filter((a) => a.userId === userId).sort(byDateDesc);
}

export async function ordersForUser(userId: string) {
  const all = await rows("orders");
  return all.filter((o) => o.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function petsForUser(userId: string) {
  const [pets, vaccines, records] = await Promise.all([rows("pets"), rows("vaccines"), rows("records")]);
  return pets
    .filter((p) => p.userId === userId)
    .map((pet) => hydratePet(pet, vaccines, records));
}

export type HydratedPet = Pet & {
  vaccines: VaccineRecord[];
  records: MedicalRecord[];
  nextDue?: VaccineRecord & { dueIn: number | null; overdue: boolean };
  ageLabel: string;
};

export function hydratePet(pet: Pet, vaccines: VaccineRecord[], records: MedicalRecord[]): HydratedPet {
  const petVaccines = vaccines.filter((v) => v.petId === pet.id).sort((a, b) => b.givenOn.localeCompare(a.givenOn));
  const due = petVaccines.filter((v) => v.nextDue).sort((a, b) => (a.nextDue! < b.nextDue! ? -1 : 1))[0];
  return {
    ...pet,
    vaccines: petVaccines,
    records: records.filter((r) => r.petId === pet.id).sort((a, b) => b.date.localeCompare(a.date)),
    ageLabel: ageLabel(pet.dob),
    nextDue: due ? { ...due, dueIn: daysUntil(due.nextDue), overdue: (daysUntil(due.nextDue) ?? 0) < 0 } : undefined,
  };
}

export function petAgeDays(iso?: string) {
  if (!iso) return 0;
  return Math.round((Date.now() - new Date(`${iso}T00:00:00`).getTime()) / 86400000);
}

function ageLabel(dob?: string) {
  const days = petAgeDays(dob);
  if (!days) return "Age not recorded";
  if (days < 365) return `${Math.max(1, Math.round(days / 30))} months`;
  const years = Math.floor(days / 365);
  const months = Math.round((days % 365) / 30);
  return months ? `${years} yr ${months} mo` : `${years} yr`;
}

export async function findAppointmentByRef(ref: string) {
  const all = await rows("appointments");
  const needle = ref.trim().toUpperCase();
  return all.find((a) => a.ref.toUpperCase() === needle || a.id === ref) ?? null;
}

export async function findOrderByRef(ref: string) {
  const all = await rows("orders");
  const needle = ref.trim().toUpperCase();
  return all.find((o) => o.ref.toUpperCase() === needle || o.id === ref) ?? null;
}

export type AdminStats = Awaited<ReturnType<typeof adminStats>>;

export async function adminStats() {
  const [appointments, orders, users, products, pets, vaccines, messages, audit, settings] = await Promise.all([
    rows("appointments"), rows("orders"), rows("users"), rows("products"), rows("pets"), rows("vaccines"),
    rows("messages"), rows("audit"), getSettings(),
  ]);
  const today = todayISO();
  const revenue = (a: Appointment) => (a.status === "completed" ? a.total : 0);
  const series: { date: string; label: string; bookings: number; revenue: number }[] = [];
  for (let i = 13; i >= 0; i -= 1) {
    const d = shiftISO(-i);
    const day = appointments.filter((a) => a.date === d);
    series.push({
      date: d,
      label: new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      bookings: day.length,
      revenue: day.reduce((s, a) => s + revenue(a), 0),
    });
  }
  const monthStart = today.slice(0, 7);
  const monthRevenue =
    appointments.filter((a) => a.status === "completed" && a.date.startsWith(monthStart)).reduce((s, a) => s + a.total, 0) +
    orders.filter((o) => o.status === "delivered" && o.createdAt.startsWith(monthStart)).reduce((s, o) => s + o.total, 0);
  const prevMonth = new Date(`${monthStart}-01`).setMonth(new Date(`${monthStart}-01`).getMonth() - 1);
  const prevKey = new Date(prevMonth).toISOString().slice(0, 7);
  const prevRevenue =
    appointments.filter((a) => a.status === "completed" && a.date.startsWith(prevKey)).reduce((s, a) => s + a.total, 0) +
    orders.filter((o) => o.status === "delivered" && o.createdAt.startsWith(prevKey)).reduce((s, o) => s + o.total, 0);
  const upcoming = appointments
    .filter((a) => isLive(a.status) && a.date >= today)
    .sort((a, b) => `${a.date}${a.slotId}`.localeCompare(`${b.date}${b.slotId}`));
  const serviceMix = Object.entries(
    appointments.reduce<Record<string, number>>((acc, a) => {
      acc[a.serviceTitle] = (acc[a.serviceTitle] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));
  const overdueVaccines = vaccines
    .filter((v) => (daysUntil(v.nextDue) ?? 999) < 0)
    .map((v) => ({ ...v, pet: pets.find((p) => p.id === v.petId), dueIn: daysUntil(v.nextDue) }))
    .sort((a, b) => (a.dueIn ?? 0) - (b.dueIn ?? 0));
  return {
    settings,
    today,
    series,
    serviceMix,
    kpis: {
      monthRevenue,
      revenueDelta: prevRevenue ? Math.round(((monthRevenue - prevRevenue) / prevRevenue) * 100) : null,
      upcomingCount: upcoming.length,
      pendingCount: appointments.filter((a) => a.status === "pending").length,
      ordersPending: orders.filter((o) => o.status === "pending" || o.status === "packed").length,
      unpaidCount: appointments.filter((a) => a.status === "completed" && a.payment.status === "unpaid").length,
      customers: users.filter((u) => u.role === "customer").length,
      newCustomers30: users.filter((u) => u.role === "customer" && Date.now() - new Date(u.createdAt).getTime() < 30 * 86400000).length,
      pets: pets.length,
      openMessages: messages.filter((m) => !m.reply).length,
      lowStock: products.filter((p) => p.active && p.stock <= 15).sort((a, b) => a.stock - b.stock),
      todayCount: appointments.filter((a) => a.date === today && isLive(a.status)).length,
      homeShare: appointments.length ? Math.round((appointments.filter((a) => a.mode === "home").length / appointments.length) * 100) : 0,
      urgent: appointments.filter((a) => a.urgency === "emergency" && isLive(a.status)).length,
    },
    schedule: appointments.filter((a) => a.date === today).sort((a, b) => a.slotId.localeCompare(b.slotId)),
    upcoming: upcoming.slice(0, 8),
    recent: [...appointments, ...orders.map(orderAsAppointment)].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10),
    audit: audit.slice(0, 12),
    overdueVaccines: overdueVaccines.slice(0, 6),
    customers: (users.filter((u) => u.role === "customer") as User[]).length,
  };
}

const orderAsAppointment = (o: Order): Appointment & { kind: "order" } =>
  ({ ...o, kind: "order" } as unknown as Appointment & { kind: "order" });

export async function portalSummary(userId: string) {
  const [appointments, orders, pets] = await Promise.all([appointmentsForUser(userId), ordersForUser(userId), petsForUser(userId)]);
  const today = todayISO();
  const upcoming = appointments.filter((a) => isLive(a.status) && a.date >= today);
  const spend = appointments.filter((a) => a.status === "completed").reduce((s, a) => s + a.total, 0) +
    orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const unpaid = appointments.filter((a) => a.payment.status === "unpaid" && isLive(a.status)).reduce((s, a) => s + a.total, 0) +
    orders.filter((o) => o.payment.status === "unpaid" && o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  return {
    appointments: upcoming.length ? upcoming[upcoming.length - 1] : null,
    upcomingCount: upcoming.length,
    visits: appointments.filter((a) => a.status === "completed").length,
    orders: orders.length,
    pets: pets.length,
    spend,
    unpaid,
    needsAttention: appointments.filter((a) => a.status === "pending" || a.status === "confirmed").length,
    vaccineDue: pets.filter((p) => p.nextDue?.overdue).length,
    allAppointments: appointments,
    allOrders: orders,
    allPets: pets,
  };
}
