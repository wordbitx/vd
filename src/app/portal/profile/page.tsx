import Link from "next/link";
import { ArrowRight, BellRing, Lock, ShieldCheck, User } from "lucide-react";
import { ActionForm } from "@/components/forms";
import { Eyebrow } from "@/components/ui";
import { changePassword, updateProfile } from "@/server/actions/auth";
import { saveReminderPrefs } from "@/server/actions/account";
import { readReminderPrefs } from "@/lib/prefs";
import { requireUser } from "@/server/auth";
import { rows } from "@/server/store";
import { dateLabel } from "@/lib/format";

export default async function PortalProfile() {
  const user = await requireUser();
  const me = (await rows("users")).find((u) => u.id === user.id);
  const prefs = readReminderPrefs(me?.notes);

  return (
    <div className="work-grid">
      <div className="col" style={{ gap: 18 }}>
        <ActionForm
          action={updateProfile}
          title="Your details"
          description="Used on slips, invoices and by the veterinarian before a home visit."
          fields={[
            { name: "id", label: "id", type: "hidden", defaultValue: user.id },
            { name: "name", label: "Full name", required: true, defaultValue: me?.name },
            { name: "phone", label: "Mobile number", required: true, defaultValue: me?.phone },
            { name: "area", label: "Area in Lahore", defaultValue: me?.area, placeholder: "Johar Town" },
            { name: "address", label: "Default visit address", type: "textarea", rows: 3, span: 2, defaultValue: me?.address, placeholder: "House / flat, street, landmark" },
          ]}
          values={{ id: user.id, name: me?.name, phone: me?.phone, area: me?.area, address: me?.address }}
          submitLabel="Save details"
        />

        <ActionForm
          action={changePassword}
          title="Password"
          description="Use at least 8 characters with a number. Anyone with portal access can see your pet's medical history — keep it private."
          fields={[
            { name: "id", label: "id", type: "hidden", defaultValue: user.id },
            { name: "current", label: "Current password", type: "password", required: true },
            { name: "next", label: "New password", type: "password", required: true },
            { name: "confirm", label: "Repeat new password", type: "password", required: true, span: 2 },
          ]}
          submitLabel="Change password"
          resetOnSuccess
        />

        <ActionForm
          action={saveReminderPrefs}
          title="Reminders"
          description="Vaccine due dates, visit confirmations and delivery updates."
          fields={[
            { name: "whatsappReminders", label: "WhatsApp reminders", hint: "Booster due dates and visit confirmation", type: "toggle", defaultValue: prefs.whatsappReminders },
            { name: "emailReminders", label: "Email reminders", hint: "Receipts, records and reorder nudges", type: "toggle", defaultValue: prefs.emailReminders },
            { name: "smsNoShow", label: "SMS before a visit", hint: "A short text the evening before", type: "toggle", defaultValue: prefs.smsNoShow },
          ]}
          submitLabel="Save preferences"
        />
      </div>

      <aside className="side-stack">
        <div className="app-card card-pad col" style={{ gap: 12 }}>
          <span className="avatar avatar-lg">{user.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
          <div>
            <b style={{ fontSize: 16 }}>{user.name}</b>
            <div className="small muted">{user.email}</div>
            <div className="small muted">{user.phone}</div>
          </div>
          <div className="hairline-top col" style={{ gap: 6 }}>
            <span className="tiny muted">Client since {me ? dateLabel(me.createdAt.slice(0, 10)) : "—"}</span>
            <span className="pill pill-ok" style={{ justifySelf: "start" }}><ShieldCheck size={12} /> Verified by the clinic</span>
          </div>
        </div>

        <div className="app-card card-pad col" style={{ gap: 10 }}>
          <Eyebrow>What the clinic can see</Eyebrow>
          <span className="row" style={{ gap: 9 }}><User size={14} style={{ color: "var(--brand)" }} /><span className="small">Your name, number, area and visit address</span></span>
          <span className="row" style={{ gap: 9 }}><ShieldCheck size={14} style={{ color: "var(--brand)" }} /><span className="small">Pet records, appointments and orders</span></span>
          <span className="row" style={{ gap: 9 }}><Lock size={14} style={{ color: "var(--brand)" }} /><span className="small">Nothing else — no card details are stored</span></span>
          <Link href="/privacy-policy" className="link-arrow" style={{ marginTop: 6 }}>Privacy policy <ArrowRight size={13} /></Link>
        </div>

        <div className="app-card card-pad col" style={{ gap: 8 }}>
          <Eyebrow>Close your account</Eyebrow>
          <p className="small muted" style={{ margin: 0 }}>
            Ask us in messages and we will close the portal account within 48 hours. Clinical records are retained for seven years as
            required for continuity of care.
          </p>
          <Link href="/portal/messages" className="button button-ghost button-sm" style={{ justifySelf: "start" }}><BellRing size={14} /> Request closure</Link>
        </div>
      </aside>
    </div>
  );
}
