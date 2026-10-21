"use client";

import { useActionState, useMemo, useState } from "react";
import { ArrowRight, Check, Send } from "lucide-react";
import { sendMessage } from "@/server/actions/account";
import { whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";

const SUBJECTS = [
  "Book a Vet Visit",
  "Emergency Care",
  "Service Inquiry",
  "Feedback",
  "Partnership",
  "Other",
];

export function ContactForm({ signedIn }: { signedIn: boolean }) {
  const [state, formAction, pending] = useActionState<Awaited<ReturnType<typeof sendMessage>> | null, FormData>(sendMessage, null);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [body, setBody] = useState("");
  const errors = state?.errors ?? {};

  const waHref = useMemo(
    () =>
      whatsappUrl(
        [`Hello ${"Jawad Veterinary Hospital"},`, "", subject, body.trim(), "", name ? `— ${name}` : ""].join("\n").trim(),
      ),
    [subject, body, name],
  );

  return (
    <form
      action={formAction}
      className="col"
      style={{ gap: 14 }}
      noValidate
      onSubmit={() => setSent(false)}
    >
      <div className="r-form-grid">
        <div className="field">
          <label className="label" htmlFor="cf-name">Name *</label>
          <input
            id="cf-name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`input${errors.name ? " input-error" : ""}`}
            placeholder="Areeba Khan"
            autoComplete="name"
          />
          {errors.name ? <span className="field-error">{errors.name}</span> : null}
        </div>
        <div className="field">
          <label className="label" htmlFor="cf-phone">Phone *</label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            className={`input${errors.phone ? " input-error" : ""}`}
            placeholder="0300 1234567"
            autoComplete="tel"
          />
          {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
        </div>
        <div className="field">
          <label className="label" htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" className="input" placeholder="you@example.com" autoComplete="email" />
        </div>
        <div className="field">
          <label className="label" htmlFor="cf-subject">Subject *</label>
          <select
            id="cf-subject"
            name="subject"
            className={`select${errors.subject ? " input-error" : ""}`}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.subject ? <span className="field-error">{errors.subject}</span> : null}
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor="cf-body">Message *</label>
        <textarea
          id="cf-body"
          name="body"
          rows={5}
          className={`textarea${errors.body ? " input-error" : ""}`}
          placeholder="Tell us what you have noticed, for how long, and anything your pet is already on."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {errors.body ? <span className="field-error">{errors.body}</span> : null}
      </div>
      {state?.ok ? (
        <p className="notice notice-ok" style={{ margin: 0 }}><Check size={15} /> {state.message}</p>
      ) : state && !state.ok ? (
        <p className="notice notice-error" style={{ margin: 0 }}>{state.message}</p>
      ) : null}
      <div className="row-between" style={{ flexWrap: "wrap", gap: 10 }}>
        <span className="tiny muted">
          {signedIn ? "Sent to the front desk and your portal inbox." : "For emergencies call the hospital — do not use this form."}
        </span>
        <div className="row" style={{ gap: 8 }}>
          <a className="button button-ghost" href={waHref} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={15} /> Send via WhatsApp
          </a>
          <button className="button button-primary" type="submit" disabled={pending}>
            {pending ? "Sending…" : <><Send size={15} /> Send message</>}
          </button>
        </div>
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
