"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Check, Send } from "lucide-react";
import { sendMessage } from "@/server/actions/account";

export function ContactForm({ signedIn }: { signedIn: boolean }) {
  const [state, formAction, pending] = useActionState<Awaited<ReturnType<typeof sendMessage>> | null, FormData>(sendMessage, null);
  const [sent, setSent] = useState(false);
  const errors = state?.errors ?? {};

  return (
    <form
      action={formAction}
      className="col"
      style={{ gap: 14 }}
      noValidate
      onSubmit={() => setSent(false)}
      onChange={() => undefined}
    >
      {!signedIn ? (
        <div className="field">
          <label className="label" htmlFor="cf-name">Your name *</label>
          <input id="cf-name" name="name" className={`input${errors.name ? " input-error" : ""}`} placeholder="Areeba Khan" />
          {errors.name ? <span className="field-error">{errors.name}</span> : null}
        </div>
      ) : null}
      <div className="field">
        <label className="label" htmlFor="cf-subject">Subject *</label>
        <input id="cf-subject" name="subject" className={`input${errors.subject ? " input-error" : ""}`} placeholder="Vaccination question about my cat" />
        {errors.subject ? <span className="field-error">{errors.subject}</span> : null}
      </div>
      <div className="field">
        <label className="label" htmlFor="cf-body">Message *</label>
        <textarea id="cf-body" name="body" rows={5} className={`textarea${errors.body ? " input-error" : ""}`} placeholder="Tell us what you have noticed, for how long, and anything your pet is already on." />
        {errors.body ? <span className="field-error">{errors.body}</span> : null}
      </div>
      {state?.ok ? (
        <p className="notice notice-ok" style={{ margin: 0 }}><Check size={15} /> {state.message}</p>
      ) : state && !state.ok ? (
        <p className="notice notice-error" style={{ margin: 0 }}>{state.message}</p>
      ) : null}
      <div className="row-between">
        <span className="tiny muted">For emergencies call the hospital — do not use this form.</span>
        <button className="button button-primary" type="submit" disabled={pending}>{pending ? "Sending…" : <>Send message <Send size={15} /></>}</button>
      </div>
    </form>
  );
}

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <form
      className="row"
      style={{ gap: 9 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) setOk(true);
      }}
    >
      {ok ? (
        <span className="pill pill-ok"><Check size={13} /> Noted — we will send reminders to {email}</span>
      ) : (
        <>
          <input className="input" style={{ maxWidth: 240 }} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email for vaccination reminders" />
          <button className="button button-ghost button-sm" type="submit">Remind me <ArrowRight size={14} /></button>
        </>
      )}
    </form>
  );
}
