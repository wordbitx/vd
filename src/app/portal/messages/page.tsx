import { MessageCircle } from "lucide-react";
import { ActionForm } from "@/components/forms";
import { Empty, Eyebrow } from "@/components/ui";
import { sendMessage } from "@/server/actions/account";
import { rows } from "@/server/store";
import { requireUser } from "@/server/auth";
import { ago } from "@/lib/format";

export default async function PortalMessages() {
  const user = await requireUser();
  const all = await rows("messages");
  const mine = all.filter((m) => m.userId === user.id).sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="work-grid">
      <section className="app-card">
        <div className="app-card-head">
          <div><h2>Conversations</h2><p>A veterinarian reads these between appointments — expect a reply inside one working day.</p></div>
        </div>
        <div className="app-card-body col" style={{ gap: 18 }}>
          {mine.length ? mine.map((message) => (
            <article key={message.id} className="col" style={{ gap: 10, paddingBottom: 18, borderBottom: "1px solid var(--line)" }}>
              <div className="row-between" style={{ gap: 12 }}>
                <div>
                  <b style={{ fontSize: 14.5 }}>{message.subject}</b>
                  <div className="tiny muted">{ago(message.at)} · {message.reply ? "answered" : "waiting for the clinic"}</div>
                </div>
                {message.reply ? <span className="pill pill-ok">Replied</span> : <span className="pill pill-warn">Awaiting reply</span>}
              </div>
              <div className="thread">
                <div className="msg msg-customer">{message.body}<small>You · {ago(message.at)}</small></div>
                {message.reply ? <div className="msg msg-clinic">{message.reply}<small>{message.repliedAt ? ago(message.repliedAt) : ""} · clinic team</small></div> : null}
              </div>
            </article>
          )) : (
            <Empty title="No messages yet" icon={<MessageCircle size={24} />}>
              Ask about a lab result, request a signed record, or check whether a symptom needs a visit.
            </Empty>
          )}
        </div>
      </section>

      <aside className="side-stack">
        <ActionForm
          action={sendMessage}
          title="Start a new message"
          description="Do not use this for emergencies — call the hospital instead."
          fields={[
            { name: "subject", label: "Subject", required: true, placeholder: "Blood result question" },
            { name: "body", label: "Message", type: "textarea", required: true, rows: 6, placeholder: "Tell us what you have noticed, when it started and anything your pet is taking." },
          ]}
          submitLabel="Send to the clinic"
          resetOnSuccess
        />
        <div className="app-card card-pad">
          <Eyebrow>Speak to a person</Eyebrow>
          <p className="small muted" style={{ margin: "10px 0 0" }}>
            Messages are not monitored overnight. For anything urgent, call the clinic — the desk phones the on-call veterinarian when a
            call sounds like an emergency.
          </p>
        </div>
      </aside>
    </div>
  );
}
