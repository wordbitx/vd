"use client";

import { useState, type FormEvent } from "react";
import { Check, Loader2, MessageCircle, Send } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

const SUBJECTS = ["General enquiry", "Appointment question", "Pet Mall order", "Adoption enquiries", "Fees & pricing", "Something else"];

export function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: SUBJECTS[0], message: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not send your message. Please try WhatsApp instead.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div>
        <div className="form-success-summary" role="status"><Check size={17} /> <span>Thank you, {form.name.split(" ")[0]}! Your message is with our team — we usually reply within a few working hours on your phone or email.</span></div>
        <p style={{ fontSize: 12.5, color: "#7a868e", lineHeight: 1.7 }}>Need a faster answer? <a className="mini-link" href={whatsappUrl(`Hello Jawad Veterinary Hospital, I just sent a message on your website about "${form.subject}".`)} target="_blank" rel="noopener noreferrer">Continue on WhatsApp</a></p>
      </div>
    );
  }

  return (
    <form className="form-grid" onSubmit={submit} noValidate>
      {error && <div className="form-error-summary field-full" role="alert">{error}</div>}
      <div className="field">
        <label htmlFor="ct-name">Your name <span>*</span></label>
        <input id="ct-name" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" placeholder="Full name" />
      </div>
      <div className="field">
        <label htmlFor="ct-phone">Mobile / WhatsApp</label>
        <input id="ct-phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="0300 1234567" />
      </div>
      <div className="field">
        <label htmlFor="ct-email">Email</label>
        <input id="ct-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" placeholder="you@example.pk" />
      </div>
      <div className="field">
        <label htmlFor="ct-subject">Topic</label>
        <select id="ct-subject" value={form.subject} onChange={(e) => set("subject", e.target.value)}>
          {SUBJECTS.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
        </select>
      </div>
      <div className="field field-full">
        <label htmlFor="ct-message">Message <span>*</span></label>
        <textarea id="ct-message" rows={5} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us about your pet and how we can help…" />
      </div>
      <div className="field-full" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button type="submit" className="button button-primary" disabled={busy}>{busy ? <Loader2 size={16} className="spin" /> : <Send size={16} />} Send message</button>
        <a className="button button-whatsapp" href={whatsappUrl(`Hello Jawad Veterinary Hospital, I have a question about "${form.subject}".`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WhatsApp instead</a>
      </div>
      <p className="field-full" style={{ fontSize: 11, color: "#93a0a8", margin: 0 }}>For emergencies, please call the hospital directly — web messages aren&apos;t monitored around the clock.</p>
    </form>
  );
}
