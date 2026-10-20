import Link from "next/link";
import { BadgeCheck, KeyRound, Mail, ShieldCheck, UserCog } from "lucide-react";
import { InlineSelect } from "@/components/admin/inline-form";
import { setUserRole } from "@/server/actions/admin";
import { rows } from "@/server/store";
import { requireStaff } from "@/server/auth";
import { dateLabel } from "@/lib/format";
import { team } from "@/lib/site";

const roleCopy: Record<string, string> = {
  owner: "Full access including fees, roles and demo reset",
  vet: "Clinical records, appointments, prescriptions, messages",
  staff: "Front desk: bookings, payments, orders, stock",
  customer: "Client portal only",
};

export default async function AdminStaff() {
  const [me, users] = await Promise.all([requireStaff(), rows("users")]);
  const staff = users.filter((u) => u.role !== "customer");

  return (
    <>
      <div className="kpi-grid">
        {[
          { label: "Staff with access", value: String(staff.length), sub: `${staff.filter((s) => s.role === "vet" || s.role === "owner").length} clinicians` },
          { label: "Your role", value: me.role, sub: me.role === "owner" ? "You can change roles" : "Ask the owner for changes" },
          { label: "Portal clients", value: String(users.filter((u) => u.role === "customer").length), sub: "Cannot see the console" },
          { label: "On the rota", value: String(team.length), sub: "Public team page" },
        ].map((card) => (
          <div key={card.label} className="kpi">
            <span className="kpi-label">{card.label}</span>
            <div className="kpi-value" style={{ textTransform: "capitalize" }}>{card.value}</div>
            <span className="tiny muted">{card.sub}</span>
          </div>
        ))}
      </div>

      <section className="app-card">
        <div className="app-card-head"><div><h2>Team &amp; access</h2><p>Roles decide what each person sees in this console. Changes are logged with your name.</p></div></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th>Contact</th><th>Role</th><th>Permissions</th><th>Since</th><th /></tr></thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="row" style={{ gap: 10 }}>
                      <span className="avatar">{member.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                      <div>
                        <span className="table-cell-title">{member.name}</span>
                        <div className="table-cell-sub">{member.area ?? "Clinic"}{member.id === me.id ? " · you" : ""}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="small"><Mail size={11} style={{ verticalAlign: "-1px" }} /> {member.email}</span><div className="table-cell-sub">{member.phone}</div></td>
                  <td>{me.role === "owner" ? <InlineSelect action={setUserRole} name="role" value={member.role} hidden={{ id: member.id }} options={["staff", "vet", "owner", "customer"]} label="Role" /> : <span className="pill pill-soft">{member.role}</span>}</td>
                  <td className="small" style={{ maxWidth: 280 }}>{roleCopy[member.role]}</td>
                  <td className="small tnum">{dateLabel(member.createdAt.slice(0, 10))}</td>
                  <td><Link href="/portal" className="icon-btn" aria-label="Client view"><UserCog size={14} /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-foot"><span><ShieldCheck size={12} style={{ verticalAlign: "-2px" }} /> Passwords are scrypt-hashed; sessions are signed, httpOnly cookies.</span><span>Signed in as {me.name}</span></div>
      </section>

      <section className="grid cols-2">
        <div className="app-card card-pad">
          <h3 style={{ fontSize: 18 }}><BadgeCheck size={16} style={{ verticalAlign: "-2px" }} /> Onboarding a new team member</h3>
          <ol className="small muted col" style={{ margin: "10px 0 0", paddingLeft: 18, gap: 6 }}>
            <li>Create the account with a clinic email address.</li>
            <li>Set the role — staff for front desk, vet for clinicians.</li>
            <li>Ask them to change the temporary password on first sign-in.</li>
            <li>Their name appears on every status change in the audit log.</li>
          </ol>
        </div>
        <div className="app-card card-pad">
          <h3 style={{ fontSize: 18 }}><KeyRound size={16} style={{ verticalAlign: "-2px" }} /> When someone leaves</h3>
          <p className="small muted" style={{ margin: "8px 0 0" }}>
            Demote them to a client role immediately — that ends console access on the next request, since the session role is re-checked
            from the database on every page load. Remove their clinic email from the account afterwards.
          </p>
        </div>
      </section>
    </>
  );
}
