"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { signIn, signUp } from "@/server/actions/auth";

const inputClass = (error?: string) => `input${error ? " input-error" : ""}`;

export function LoginForm({ clinicName }: { clinicName: string }) {
  const params = useSearchParams();
  const next = params.get("next") ?? "/portal";
  const mode = params.get("mode") === "signup";
  const [state, formAction, pending] = useActionState<Awaited<ReturnType<typeof signIn>> | null, FormData>(signIn, null);
  const [show, setShow] = useState(false);
  const errors = state?.errors ?? {};

  return (
    <div className="auth-card">
      <div>
        <span className="eyebrow">{clinicName}</span>
        <h1 style={{ margin: "12px 0 8px" }}>Welcome back</h1>
        <p className="muted" style={{ margin: 0 }}>Your pets, bookings, slips and orders — all in one login.</p>
      </div>
      {params.get("notice") === "welcome" ? <p className="notice notice-ok">Account created. Your portal is ready.</p> : null}
      {params.get("notice") === "staff-only" ? <p className="notice notice-error">That area is for clinic staff. Your client portal is at /portal.</p> : null}
      <form action={formAction} className="col" style={{ gap: 14 }} noValidate>
        <input type="hidden" name="next" value={next} readOnly />
        <div className="field">
          <label className="label" htmlFor="login-email">Email address</label>
          <div style={{ position: "relative" }}>
            <Mail size={15} style={{ position: "absolute", left: 14, top: 16, color: "var(--muted-2)" }} />
            <input id="login-email" name="email" type="email" autoComplete="email" className={inputClass(errors.email)} style={{ paddingLeft: 38 }} placeholder="you@example.com" defaultValue={mode ? "" : "pet.parent@example.com"} />
          </div>
          {errors.email ? <span className="field-error">{errors.email}</span> : null}
        </div>
        <div className="field">
          <label className="label" htmlFor="login-password">Password</label>
          <div style={{ position: "relative" }}>
            <Lock size={15} style={{ position: "absolute", left: 14, top: 16, color: "var(--muted-2)" }} />
            <input id="login-password" name="password" type={show ? "text" : "password"} autoComplete="current-password" className={inputClass(errors.password)} style={{ paddingLeft: 38, paddingRight: 44 }} placeholder="••••••••" defaultValue={mode ? "" : "petparent2026"} />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} style={{ position: "absolute", right: 12, top: 14, color: "var(--muted)" }}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password ? <span className="field-error">{errors.password}</span> : null}
        </div>
        {state && !state.ok ? <p className="notice notice-error" style={{ margin: 0 }}>{state.message}</p> : null}
        <button className="button button-primary button-lg button-block" type="submit" disabled={pending}>
          {pending ? "Checking…" : <>Sign in <ArrowRight size={16} /></>}
        </button>
      </form>
      <div className="row-between" style={{ fontSize: 13 }}>
        <span className="muted">No account yet?</span>
        <Link href="/register" className="link-arrow">Create one — it is free <ArrowRight size={14} /></Link>
      </div>
      <div className="demo-creds">
        <span className="tiny" style={{ fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-2)" }}>Demo logins</span>
        {[
          { label: "Client", email: "pet.parent@example.com", pass: "petparent2026" },
          { label: "Front desk", email: "frontdesk@jawadveterinary.pk", pass: "desk2026" },
          { label: "Owner / admin", email: "owner@jawadveterinary.pk", pass: "clinicadmin2026" },
        ].map((cred) => (
          <span className="demo-cred" key={cred.email}>
            <b>{cred.label}</b>
            <code>{cred.email}</code>
            <code>{cred.pass}</code>
          </span>
        ))}
      </div>
      <p className="tiny muted" style={{ textAlign: "center", margin: 0 }}>
        <ShieldCheck size={12} style={{ display: "inline", verticalAlign: "-2px" }} /> Passwords are hashed with scrypt; sessions are signed cookies. Nothing leaves this server.
      </p>
    </div>
  );
}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<Awaited<ReturnType<typeof signUp>> | null, FormData>(signUp, null);
  const errors = state?.errors ?? {};
  const [species, setSpecies] = useState("Dog");

  return (
    <div className="auth-card">
      <div>
        <span className="eyebrow">Client portal</span>
        <h1 style={{ margin: "12px 0 8px" }}>Create your account</h1>
        <p className="muted" style={{ margin: 0 }}>Book visits, keep every record, track orders and reprint slips.</p>
      </div>
      <form action={formAction} className="col" style={{ gap: 14 }} noValidate>
        <div className="form-grid">
          <div className="field">
            <label className="label" htmlFor="reg-name">Full name *</label>
            <div style={{ position: "relative" }}>
              <User size={15} style={{ position: "absolute", left: 13, top: 16, color: "var(--muted-2)" }} />
              <input id="reg-name" name="name" className={inputClass(errors.name)} style={{ paddingLeft: 36 }} placeholder="Areeba Khan" />
            </div>
            {errors.name ? <span className="field-error">{errors.name}</span> : null}
          </div>
          <div className="field">
            <label className="label" htmlFor="reg-phone">Mobile *</label>
            <input id="reg-phone" name="phone" type="tel" className={inputClass(errors.phone)} placeholder="+92 300 1234567" />
            {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="reg-email">Email *</label>
          <input id="reg-email" name="email" type="email" className={inputClass(errors.email)} placeholder="you@example.com" />
          {errors.email ? <span className="field-error">{errors.email}</span> : null}
        </div>
        <div className="form-grid">
          <div className="field">
            <label className="label" htmlFor="reg-pass">Password *</label>
            <input id="reg-pass" name="password" type="password" className={inputClass(errors.password)} placeholder="At least 8 characters" />
            {errors.password ? <span className="field-error">{errors.password}</span> : null}
          </div>
          <div className="field">
            <label className="label" htmlFor="reg-confirm">Repeat password *</label>
            <input id="reg-confirm" name="confirm" type="password" className={inputClass()} placeholder="••••••••" />
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label className="label" htmlFor="reg-pet">Pet’s name (optional)</label>
            <input id="reg-pet" name="petName" className={inputClass()} placeholder="Scottie" />
          </div>
          <div className="field">
            <label className="label" htmlFor="reg-species">Species</label>
            <select id="reg-species" name="species" className="select" value={species} onChange={(e) => setSpecies(e.target.value)}>
              {["Dog", "Cat", "Rabbit", "Bird", "Other"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label className="label" htmlFor="reg-breed">Breed</label>
            <input id="reg-breed" name="breed" className={inputClass()} placeholder="Golden Retriever" />
          </div>
          <div className="field">
            <label className="label" htmlFor="reg-area">Area in Lahore</label>
            <input id="reg-area" name="area" className={inputClass()} placeholder="Johar Town" />
          </div>
        </div>
        {state && !state.ok ? <p className="notice notice-error" style={{ margin: 0 }}>{state.message}</p> : null}
        <button className="button button-primary button-lg button-block" type="submit" disabled={pending}>
          {pending ? "Creating account…" : <>Create account <ArrowRight size={16} /></>}
        </button>
      </form>
      <ul className="col" style={{ listStyle: "none", margin: 0, padding: 0, gap: 7, fontSize: 13, color: "var(--muted)" }}>
        {["Every booking generates a printable slip", "Vaccination cards and prescriptions, never lost", "Reschedule or cancel without phone queues"].map((line) => (
          <li key={line} className="row" style={{ gap: 8 }}><Check size={14} style={{ color: "var(--ok)" }} /> {line}</li>
        ))}
      </ul>
      <p className="tiny muted" style={{ margin: 0 }}>
        By creating an account you agree to our <Link href="/terms-and-conditions" style={{ textDecoration: "underline" }}>terms</Link> and <Link href="/privacy-policy" style={{ textDecoration: "underline" }}>privacy policy</Link>.
      </p>
    </div>
  );
}
