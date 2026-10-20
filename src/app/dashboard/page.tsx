import Link from "next/link";
import { ArrowRight, CalendarDays, CalendarPlus, HeartHandshake, PawPrint, ShoppingBag, Siren, Syringe } from "lucide-react";
import { PortalHead } from "@/components/portal-shell";
import { PetAvatar } from "@/components/pet-manager";
import { requireUser } from "@/lib/auth";
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_TONES, ORDER_STATUS_LABELS, ORDER_STATUS_TONES, formatDate, petAgeFromDob, pkr, todayIso, addDaysIso } from "@/lib/format";
import { listAppointmentsByUser, listOrdersByUser, listPetsByUser, listVaccinations } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("My Portal", "Your Jawad Veterinary Hospital portal — pets, appointments and orders.", "/dashboard");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const today = todayIso();
  const pets = listPetsByUser(user.id);
  const appointments = listAppointmentsByUser(user.id);
  const orders = listOrdersByUser(user.id);
  const upcoming = appointments
    .filter((a) => ["pending", "confirmed", "checked-in"].includes(a.status) && a.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const next = upcoming[0];
  const activeOrders = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));

  const dueSoon = pets.flatMap((pet) =>
    listVaccinations(pet.id)
      .filter((v) => v.nextDue && v.nextDue <= addDaysIso(today, 45))
      .map((v) => ({ pet, vaccination: v, overdue: v.nextDue < today })),
  ).sort((a, b) => a.vaccination.nextDue.localeCompare(b.vaccination.nextDue));

  return (
    <div>
      <PortalHead eyebrow="PET PARENT PORTAL" title={`Assalam-o-Alaikum, ${user.name.split(" ")[0]}!`} description="Everything about your pets' care at Jawad Veterinary Hospital — passports, appointments and Pet Mall orders.">
        <Link href="/book" className="button button-gold"><CalendarPlus size={16} /> Book a visit</Link>
      </PortalHead>

      <div className="stat-cards">
        <div className="stat-card"><span className="stat-icon"><PawPrint size={19} /></span><strong>{pets.length}</strong><small>Registered pets</small></div>
        <div className="stat-card"><span className="stat-icon"><CalendarDays size={19} /></span><strong>{upcoming.length}</strong><small>Upcoming appointments</small></div>
        <div className="stat-card"><span className="stat-icon"><ShoppingBag size={19} /></span><strong>{activeOrders.length}</strong><small>Orders in progress</small></div>
        <div className={`stat-card ${dueSoon.some((d) => d.overdue) ? "alert" : ""}`}><span className="stat-icon"><Syringe size={19} /></span><strong>{dueSoon.length}</strong><small>Vaccines due soon</small></div>
      </div>

      <div className="quick-tiles" style={{ marginBottom: 20 }}>
        <Link href="/book" className="quick-tile"><span><CalendarPlus size={20} /></span><strong>Book a visit</strong><small>Hospital or home — slip in 2 minutes</small></Link>
        <Link href="/dashboard/pets" className="quick-tile"><span><PawPrint size={20} /></span><strong>Pet Passports</strong><small>Vaccines, visits &amp; records</small></Link>
        <Link href="/shop" className="quick-tile"><span><ShoppingBag size={20} /></span><strong>Shop Pet Mall</strong><small>Food &amp; essentials, delivered</small></Link>
        <Link href="/dashboard/adopt" className="quick-tile"><span><HeartHandshake size={20} /></span><strong>Adopt / rehome</strong><small>Find or post a pet for adoption</small></Link>
      </div>

      {dueSoon.length > 0 && (
        <div className="portal-card">
          <div className="card-head-row"><h2>Vaccination reminders</h2><Link href="/book?service=vaccination-preventive-care" className="mini-link">Book vaccination <ArrowRight size={12} style={{ verticalAlign: -2 }} /></Link></div>
          <div className="list-rows">
            {dueSoon.map(({ pet, vaccination, overdue }) => (
              <div className="list-row" key={vaccination.id}>
                <span className="lr-icon"><Syringe size={19} /></span>
                <div>
                  <p className="lr-title">{pet.name} · {vaccination.vaccine}</p>
                  <p className="lr-sub">{overdue ? "Overdue since" : "Due"} {formatDate(vaccination.nextDue)}</p>
                </div>
                <div className="lr-right"><span className={`badge ${overdue ? "tone-red" : "tone-amber"}`}>{overdue ? "Overdue" : "Due soon"}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="portal-card">
        <div className="card-head-row"><h2>Next appointment</h2><Link href="/dashboard/appointments" className="mini-link">All appointments <ArrowRight size={12} style={{ verticalAlign: -2 }} /></Link></div>
        {next ? (
          <div className="list-rows">
            <Link href={`/dashboard/appointments/${next.ref}`}>
              <span className="lr-icon"><CalendarDays size={19} /></span>
              <div>
                <p className="lr-title">{next.petName} · {next.serviceTitle}{next.emergency ? " (Emergency)" : ""}</p>
                <p className="lr-sub">Token {next.token} · {formatDate(next.date)} at {next.timeSlot} · {next.visitType === "home" ? "Home visit" : "Hospital visit"}</p>
              </div>
              <div className="lr-right"><span className={`badge ${APPOINTMENT_STATUS_TONES[next.status]}`}>{APPOINTMENT_STATUS_LABELS[next.status]}</span></div>
            </Link>
          </div>
        ) : (
          <div className="empty-note"><CalendarDays size={22} /><strong>No upcoming appointments</strong>Book a checkup, vaccination or grooming session whenever your pet needs us.</div>
        )}
      </div>

      <div className="portal-card">
        <div className="card-head-row"><h2>My pets</h2><Link href="/dashboard/pets" className="mini-link">Manage pets <ArrowRight size={12} style={{ verticalAlign: -2 }} /></Link></div>
        {pets.length ? (
          <div className="list-rows">
            {pets.map((pet) => (
              <Link key={pet.id} href={`/dashboard/pets/${pet.id}`}>
                <span className="lr-icon"><PetAvatar species={pet.species} size={20} /></span>
                <div>
                  <p className="lr-title">{pet.name}</p>
                  <p className="lr-sub">{pet.species}{pet.breed ? ` · ${pet.breed}` : ""} · {petAgeFromDob(pet)} · Passport {pet.passportId}</p>
                </div>
                <div className="lr-right"><ArrowRight size={16} color="#9d7c43" /></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-note"><PawPrint size={22} /><strong>Add your first pet</strong>Create a free Digital Pet Passport to keep vaccination records and book faster.</div>
        )}
      </div>

      <div className="portal-card">
        <div className="card-head-row"><h2>Recent orders</h2><Link href="/dashboard/orders" className="mini-link">All orders <ArrowRight size={12} style={{ verticalAlign: -2 }} /></Link></div>
        {orders.length ? (
          <div className="list-rows">
            {orders.slice(0, 3).map((order) => (
              <Link key={order.id} href={`/dashboard/orders/${order.ref}`}>
                <span className="lr-icon"><ShoppingBag size={19} /></span>
                <div>
                  <p className="lr-title">{order.ref} · {pkr(order.total)}</p>
                  <p className="lr-sub">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {formatDate(order.createdAt.slice(0, 10))}</p>
                </div>
                <div className="lr-right"><span className={`badge ${ORDER_STATUS_TONES[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-note"><ShoppingBag size={22} /><strong>No orders yet</strong>Your Pet Mall orders and invoices will appear here.</div>
        )}
      </div>

      <div className="inline-alert danger no-print" style={{ marginTop: 18 }}>
        <Siren size={18} />
        <span>Medical emergency? Please don&apos;t wait online — call the hospital immediately and we will guide you.</span>
      </div>
    </div>
  );
}
