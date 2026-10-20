import Link from "next/link";
import { CheckCircle2, MessageCircle, Phone, Send } from "lucide-react";
import { ActionForm } from "@/components/forms";
import { replyMessage } from "@/server/actions/admin";
import { rows } from "@/server/store";
import { requireStaff } from "@/server/auth";
import { ago } from "@/lib/format";

export default async function AdminMessages() {
  const staff = await requireStaff();
  const [messages, users] = await Promise.all([rows("messages"), rows("users")]);
  const open = messages.filter((m) => !m.reply);
  const answered = messages.filter((m) => m.reply);

  return (
    <>
      <div className="kpi-grid">
        {[
          { label: "Open messages", value: String(open.length), sub: "Reply inside one working day", dark: true },
          { label: "Answered", value: String(answered.length), sub: "Visible in the client portal" },
          { label: "Clients messaging", value: String(new Set(messages.map((m) => m.userId)).size), sub: "Across the demo data" },
          { label: "Oldest open", value: open.length ? ago(open[open.length - 1].at) : "—", sub: "Age of the longest wait" },
        ].map((card) => (
          <div key={card.label} className={`kpi${card.dark ? " kpi-dark" : ""}`}>
            <span className="kpi-label">{card.label}</span>
            <div className="kpi-value">{card.value}</div>
            <span className="tiny muted">{card.sub}</span>
          </div>
        ))}
      </div>

      <div className="work-grid">
        <section className="app-card">
          <div className="app-card-head"><div><h2>Inbox</h2><p>Replies appear in the client portal and are logged against your name.</p></div><span className="spacer" /><span className="pill pill-soft">Signed in as {staff.name}</span></div>
          <div className="app-card-body col" style={{ gap: 18 }}>
            {messages.slice().sort((a, b) => b.at.localeCompare(a.at)).map((message) => {
              const client = users.find((u) => u.id === message.userId);
              return (
                <article key={message.id} className="card card-pad col" style={{ gap: 12 }}>
                  <div className="row-between" style={{ gap: 12 }}>
                    <div>
                      <b style={{ fontSize: 15 }}>{message.subject}</b>
                      <div className="tiny muted">{message.userName} · {client?.phone ?? "no phone on file"} · {ago(message.at)}</div>
                    </div>
                    {message.reply ? <span className="pill pill-ok"><CheckCircle2 size={12} /> Answered</span> : <span className="pill pill-warn">Open</span>}
                  </div>
                  <div className="thread">
                    <div className="msg msg-customer">{message.body}<small>{message.userName} · {ago(message.at)}</small></div>
                    {message.reply ? <div className="msg msg-clinic">{message.reply}<small>clinic · {message.repliedAt ? ago(message.repliedAt) : ""}</small></div> : null}
                  </div>
                  {message.reply ? null : (
                    <ActionForm
                      action={replyMessage}
                      variant="plain"
                      fields={[
                        { name: "id", label: "id", type: "hidden", defaultValue: message.id },
                        { name: "reply", label: "Reply to the client", type: "textarea", rows: 3, required: true, placeholder: "Answer clinically, and tell them when to call instead. Sign with your name." },
                      ]}
                      submitLabel="Send reply"
                      resetOnSuccess
                    />
                  )}
                  <div className="row" style={{ gap: 8 }}>
                    <a href={client ? `tel:${client.phone.replace(/\s/g, "")}` : "#"} className="button button-ghost button-xs"><Phone size={12} /> Call</a>
                    <Link href="/admin/appointments" className="button button-ghost button-xs"><Send size={12} /> Book a visit for them</Link>
                  </div>
                </article>
              );
            })}
            {!messages.length ? <div className="empty"><MessageCircle size={24} style={{ color: "var(--line-2)" }} /><h3>No messages</h3><p>Clients can write from the portal once they have an account.</p></div> : null}
          </div>
        </section>

        <aside className="side-stack">
          <div className="app-card card-pad">
            <h3 style={{ fontSize: 17 }}>Tone rules</h3>
            <ul className="col" style={{ margin: "10px 0 0", paddingLeft: 18, gap: 8, fontSize: 13, color: "var(--muted)" }}>
              <li>Answer the question asked, then add only what changes the decision.</li>
              <li>Never diagnose from a photo — say what needs an examination and offer a slot.</li>
              <li>If it could be an emergency, tell them to call, not to wait for the portal.</li>
              <li>Sign with your name; clients remember who helped.</li>
            </ul>
          </div>
          <div className="app-card card-pad" style={{ background: "linear-gradient(150deg,#f8f4ec,#fffdfa)" }}>
            <h3 style={{ fontSize: 17 }}>Response target</h3>
            <p className="small muted" style={{ margin: "8px 0 0" }}>One working day for clinical questions. Same hour for anything about an active booking or delivery.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
