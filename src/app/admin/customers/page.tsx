import Link from "next/link";
import { ArrowRight, Mail, Phone, Search, Syringe } from "lucide-react";
import { DialogForm } from "@/components/forms";
import { InlineSelect } from "@/components/admin/inline-form";
import { saveCustomerNote, setUserRole } from "@/server/actions/admin";
import { rows } from "@/server/store";
import { dateLabel, daysUntil, money } from "@/lib/format";
import { requireStaff } from "@/server/auth";

export default async function AdminCustomers({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [{ q = "" }, staff] = await Promise.all([searchParams, requireStaff()]);
  const [users, pets, appointments, orders, vaccines] = await Promise.all([rows("users"), rows("pets"), rows("appointments"), rows("orders"), rows("vaccines")]);
  const customers = users.filter((u) => u.role === "customer");
  const needle = q.trim().toLowerCase();
  const visible = customers.filter((u) => (needle ? `${u.name} ${u.email} ${u.phone} ${u.area ?? ""}`.toLowerCase().includes(needle) : true));

  const summaryFor = (userId: string) => {
    const myPets = pets.filter((p) => p.userId === userId);
    const visits = appointments.filter((a) => a.userId === userId);
    const spend = visits.filter((a) => a.status === "completed").reduce((s, a) => s + a.total, 0) + orders.filter((o) => o.userId === userId && o.status === "delivered").reduce((s, o) => s + o.total, 0);
    const overdue = vaccines.filter((v) => myPets.some((p) => p.id === v.petId) && (daysUntil(v.nextDue) ?? 999) < 0);
    return { myPets, visits, spend, overdue };
  };

  return (
    <>
      <div className="kpi-grid">
        {[
          { label: "Client accounts", value: String(customers.length), sub: `${pets.length} pets on file` },
          { label: "With overdue vaccines", value: String(customers.filter((c) => summaryFor(c.id).overdue.length).length), sub: "Call or WhatsApp this week" },
          { label: "Repeat clients", value: String(customers.filter((c) => summaryFor(c.id).visits.filter((v) => v.status === "completed").length > 1).length), sub: "Two or more completed visits" },
          { label: "Lifetime value", value: money(customers.reduce((s, c) => s + summaryFor(c.id).spend, 0)), sub: "Completed visits + delivered orders" },
        ].map((card) => (
          <div key={card.label} className="kpi">
            <span className="kpi-label">{card.label}</span>
            <div className="kpi-value">{card.value}</div>
            <span className="tiny muted">{card.sub}</span>
          </div>
        ))}
      </div>

      <section className="app-card">
        <div className="app-card-head">
          <div><h2>Clients &amp; pets</h2><p>Clinical notes are visible to staff only; the client sees their pets, not these notes.</p></div>
        </div>
        <form className="filter-bar" action="/admin/customers" method="get">
          <div className="search"><Search size={14} /><input className="input" name="q" defaultValue={q} placeholder="Search name, phone, email…" /></div>
          <button className="button button-ghost button-xs" type="submit">Search</button>
          <span className="spacer" />
          <span className="tiny muted">Signed in as {staff.name} ({staff.role})</span>
        </form>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Client</th><th>Pets</th><th>Visits</th><th>Vaccines</th><th className="num">Lifetime</th><th>Notes</th><th /></tr></thead>
            <tbody>
              {visible.map((client) => {
                const { myPets, visits, spend, overdue } = summaryFor(client.id);
                return (
                  <tr key={client.id}>
                    <td>
                      <span className="table-cell-title">{client.name}</span>
                      <div className="table-cell-sub">{client.area ?? "Area not recorded"} · client since {dateLabel(client.createdAt.slice(0, 10))}</div>
                      <div className="table-cell-sub"><Mail size={10} style={{ verticalAlign: "-1px" }} /> {client.email} · <Phone size={10} style={{ verticalAlign: "-1px" }} /> {client.phone}</div>
                    </td>
                    <td className="small">{myPets.length ? myPets.map((p) => p.name).join(", ") : "—"}</td>
                    <td className="small">{visits.length}<div className="table-cell-sub">{visits.filter((v) => v.status === "completed").length} completed</div></td>
                    <td>{overdue.length ? <span className="pill pill-danger" style={{ fontSize: 9.5 }}><Syringe size={10} /> {overdue.length} overdue</span> : <span className="pill pill-ok" style={{ fontSize: 9.5 }}>Current</span>}</td>
                    <td className="num">{money(spend)}</td>
                    <td style={{ maxWidth: 200 }}>
                      <DialogForm
                        action={saveCustomerNote}
                        title={`Note for ${client.name}`}
                        description="Visible to clinic staff in this table only."
                        trigger={<button type="button" className="button button-ghost button-xs">{(client.notes ?? "").replace(/^PREFS:.*?\|/, "").replace(/^NOTE:/, "") ? "Edit note" : "Add note"}</button>}
                        fields={[
                          { name: "id", label: "id", type: "hidden", defaultValue: client.id },
                          { name: "note", label: "Staff note", type: "textarea", rows: 3, defaultValue: (client.notes ?? "").replace(/^PREFS:.*?\|/, "").replace(/^NOTE:/, "") },
                        ]}
                        submitLabel="Save note"
                      />
                      <div className="table-cell-sub" style={{ marginTop: 4 }}>{(client.notes ?? "").replace(/^PREFS:\{.*?\}\|/, "").replace(/^NOTE:/, "").slice(0, 60) || "No note"}</div>
                    </td>
                    <td>
                      {staff.role === "owner" ? (
                        <InlineSelect action={setUserRole} name="role" value={client.role} hidden={{ id: client.id }} options={["customer", "vet", "staff", "owner"]} label="Role" />
                      ) : (
                        <Link href={`mailto:${client.email}`} className="icon-btn" aria-label="Email client"><ArrowRight size={14} /></Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="table-foot"><span>{visible.length} client{visible.length === 1 ? "" : "s"} shown</span><span>Owners can promote a client to staff from the role column</span></div>
      </section>

      <section className="app-card card-pad">
        <h3 style={{ fontSize: 18 }}>Pets without an account</h3>
        <p className="small muted" style={{ margin: "6px 0 12px" }}>
          {pets.filter((p) => !users.some((u) => u.id === p.userId)).length} pet(s) in the database are not linked to a client login.
          Creating an account for the owner keeps vaccine reminders and slips in one place.
        </p>
        <div className="row" style={{ gap: 8 }}>
          {pets.filter((p) => !users.some((u) => u.id === p.userId)).slice(0, 6).map((pet) => (
            <span key={pet.id} className="pill pill-soft" style={{ textTransform: "none", letterSpacing: 0 }}>{pet.name} · {pet.species}</span>
          ))}
        </div>
      </section>
    </>
  );
}
