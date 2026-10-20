import Link from "next/link";
import { ArrowRight, CalendarPlus, Download, Filter, Printer, Search } from "lucide-react";
import { DialogForm, type FieldDef } from "@/components/forms";
import { InlineSelect } from "@/components/admin/inline-form";
import { assignVet, createAppointmentByStaff, setAppointmentPayment, setAppointmentStatus } from "@/server/actions/admin";
import { rows } from "@/server/store";
import { ago, dateLabel, money, todayISO } from "@/lib/format";
import { requireStaff } from "@/server/auth";

const statuses = ["all", "pending", "confirmed", "dispatched", "in_progress", "completed", "cancelled", "no_show"];

export default async function AdminAppointments({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; mode?: string }> }) {
  const [{ status = "all", q = "", mode = "all" }, staff] = await Promise.all([searchParams, requireStaff()]);
  const [appointments, services, users, pets] = await Promise.all([rows("appointments"), rows("services"), rows("users"), rows("pets")]);
  const vets = users.filter((u) => u.role === "vet" || u.role === "owner");

  const needle = q.trim().toLowerCase();
  const visible = appointments
    .filter((a) => (status === "all" ? true : a.status === status))
    .filter((a) => (mode === "all" ? true : a.mode === mode))
    .filter((a) => (needle ? `${a.ref} ${a.guestName} ${a.guestPhone} ${a.petName} ${a.serviceTitle} ${a.area}`.toLowerCase().includes(needle) : true))
    .sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`));

  const bookingFields: FieldDef[] = [
    { name: "guestName", label: "Client name", required: true, placeholder: "Walk-in client" },
    { name: "guestPhone", label: "Mobile", required: true, placeholder: "+92 300 1234567" },
    { name: "petName", label: "Pet name", placeholder: "Simba" },
    { name: "species", label: "Species", type: "select", options: ["Dog", "Cat", "Rabbit", "Bird", "Reptile", "Other"], defaultValue: "Dog" },
    { name: "breed", label: "Breed", placeholder: "Labrador" },
    { name: "serviceSlug", label: "Service", type: "select", required: true, options: services.map((s) => ({ value: s.slug, label: `${s.shortTitle} · ${money(s.price)}` })), defaultValue: services[0]?.slug },
    { name: "mode", label: "Format", type: "select", options: [{ value: "home", label: "Home visit" }, { value: "clinic", label: "Hospital" }], defaultValue: "home" },
    { name: "urgency", label: "Urgency", type: "select", options: [{ value: "standard", label: "Standard" }, { value: "emergency", label: "Emergency" }], defaultValue: "standard" },
    { name: "date", label: "Date", type: "date", required: true, defaultValue: todayISO() },
    { name: "slotId", label: "Window", type: "select", options: [{ value: "morning", label: "Morning" }, { value: "midday", label: "Midday" }, { value: "evening", label: "Evening" }, { value: "night", label: "Night" }, { value: "any", label: "Any time" }], defaultValue: "morning" },
    { name: "area", label: "Area", placeholder: "Johar Town" },
    { name: "address", label: "Address / note", type: "textarea", rows: 2, span: 2 },
    { name: "symptoms", label: "Symptoms", type: "textarea", rows: 2, span: 2 },
    { name: "status", label: "Initial status", type: "select", options: ["pending", "confirmed"], defaultValue: "confirmed", span: 2 },
  ];

  return (
    <>
      <section className="app-card">
        <div className="app-card-head">
          <div><h2>Appointment board</h2><p>{visible.length} of {appointments.length} bookings · {vets.length} clinicians on the rota</p></div>
          <span className="spacer" />
          <DialogForm action={createAppointmentByStaff} title="Book for a client" description="For phone bookings and walk-ins. The reference is generated the same way as an online booking." trigger={<button type="button" className="button button-primary button-sm"><CalendarPlus size={15} /> New booking</button>} fields={bookingFields} submitLabel="Create booking" />
        </div>

        <form className="filter-bar" action="/admin/appointments" method="get">
          <div className="search">
            <Search size={14} />
            <input className="input" name="q" defaultValue={q} placeholder="Search reference, client, phone, pet…" />
          </div>
          <select className="select" name="status" defaultValue={status} aria-label="Filter status">
            {statuses.map((s) => <option key={s} value={s}>{s === "all" ? "All statuses" : s.replace(/_/g, " ")}</option>)}
          </select>
          <select className="select" name="mode" defaultValue={mode} aria-label="Filter format">
            <option value="all">All formats</option>
            <option value="home">Home visits</option>
            <option value="clinic">Hospital</option>
          </select>
          <button className="button button-ghost button-xs" type="submit"><Filter size={13} /> Apply</button>
          <Link href="/admin/appointments" className="button button-ghost button-xs">Reset</Link>
          <span className="spacer" />
          <span className="tiny muted">Signed in as {staff.name}</span>
        </form>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Reference</th><th>Client &amp; patient</th><th>Service</th><th>When</th><th>Vet</th><th>Status</th><th>Payment</th><th className="num">Total</th><th /></tr>
            </thead>
            <tbody>
              {visible.map((appointment) => (
                <tr key={appointment.id}>
                  <td><span className="table-ref">{appointment.ref}</span><div className="table-cell-sub">{ago(appointment.createdAt)}</div></td>
                  <td>
                    <span className="table-cell-title">{appointment.guestName}</span>
                    <div className="table-cell-sub">{appointment.petName} · {appointment.species} · {appointment.guestPhone}</div>
                  </td>
                  <td><span className="small">{appointment.serviceTitle}</span><div className="table-cell-sub">{appointment.mode === "home" ? `Home · ${appointment.area}` : "Hospital"}{appointment.urgency === "emergency" ? " · emergency" : ""}</div></td>
                  <td><span className="small tnum">{dateLabel(appointment.date)}</span><div className="table-cell-sub">{appointment.slotLabel}</div></td>
                  <td>
                    <InlineSelect
                      action={assignVet} name="vetId" value={appointment.vetId ?? ""}
                      hidden={{ id: appointment.id }} label="Assign vet"
                      options={[{ value: "", label: "Unassigned" }, ...vets.map((v) => ({ value: v.id, label: v.name }))]}
                    />
                  </td>
                  <td><InlineSelect action={setAppointmentStatus} name="status" value={appointment.status} hidden={{ id: appointment.id }} options={statuses.slice(1)} label="Status" /></td>
                  <td><InlineSelect action={setAppointmentPayment} name="paymentStatus" value={appointment.payment.status} hidden={{ id: appointment.id }} options={["unpaid", "paid", "refunded"]} label="Payment" /></td>
                  <td className="num">{money(appointment.total)}</td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/slip/${appointment.ref}`} className="icon-btn" target="_blank" aria-label="Printable slip"><Printer size={14} /></Link>
                      <Link href={`/slip/${appointment.ref}`} className="icon-btn" target="_blank" aria-label="Open record"><Download size={14} /></Link>
                      <a href={`tel:${appointment.guestPhone.replace(/\s/g, "")}`} className="icon-btn" aria-label="Call"><ArrowRight size={14} /></a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length ? <div style={{ padding: 26 }} className="center"><p className="small muted" style={{ margin: 0 }}>No bookings match those filters.</p></div> : null}
        </div>
        <div className="table-foot">
          <span>Showing {visible.length} booking{visible.length === 1 ? "" : "s"} · guest bookings are linked by email when a matching account exists</span>
          <span className="row" style={{ gap: 8 }}>
            <span className="tiny muted">Vet dropdown options: {vets.map((v) => v.name.split(" ").slice(0, 2).join(" ")).join(", ")}</span>
          </span>
        </div>
      </section>

      <section className="grid cols-2">
        <div className="app-card card-pad">
          <h3 style={{ fontSize: 18 }}>Currency of the board</h3>
          <p className="small muted" style={{ margin: "8px 0 0" }}>
            Status changes write to the appointment timeline, which the client sees in their portal. Marking a visit completed unlocks the
            invoice and the vaccine reminder scheduler.
          </p>
        </div>
        <div className="app-card card-pad">
          <h3 style={{ fontSize: 18 }}>Unlinked pets</h3>
          <p className="small muted" style={{ margin: "8px 0 0" }}>
            {pets.filter((p) => !users.some((u) => u.id === p.userId)).length} pet record(s) have no client account. Creating an account for the owner
            from <Link href="/admin/customers" style={{ textDecoration: "underline" }}>Clients &amp; pets</Link> keeps their history in one place.
          </p>
        </div>
      </section>
    </>
  );
}
