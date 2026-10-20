"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, Calendar, Check, Clock, HeartPulse, Home, MapPin, PawPrint, Stethoscope, Truck, User } from "lucide-react";
import { money, todayISO } from "@/lib/format";
import { ServiceGlyph } from "@/components/icons";
import { ADDONS, quoteAppointment } from "@/lib/pricing";
import { createAppointment, type BookingResult } from "@/server/actions/booking";

export type WizardService = { slug: string; title: string; shortTitle: string; summary: string; icon: string; price: number; duration: string; homeAvailable: boolean };
export type WizardPet = { id: string; name: string; species: string; breed: string };
export type WizardSettings = { visitHomeStandard: number; visitHomeEmergency: number; visitClinic: number; nightSurcharge: number; taxPercent: number };

const SLOTS = [
  { id: "morning", label: "Morning", window: "10:00 AM – 02:00 PM", note: "Quietest houses, best for seniors" },
  { id: "midday", label: "Midday", window: "02:00 PM – 06:00 PM", note: "Someone home over lunch" },
  { id: "evening", label: "Evening", window: "06:00 PM – 10:00 PM", note: "Most requested" },
  { id: "night", label: "Night", window: "10:00 PM – 02:00 AM", note: "Night surcharge applies" },
  { id: "any", label: "Any time", window: "We call to confirm", note: "Fastest for urgent cases" },
];

const SPECIES = ["Dog", "Cat", "Rabbit", "Bird", "Reptile", "Other"];
const DRAFT_KEY = "jvh.booking.draft.v2";
const today = () => todayISO();

type Draft = Record<string, string | string[] | boolean>;

export function BookingWizard({
  services, settings, pets = [], areas, user, initialService, emergencyLine,
}: {
  services: WizardService[]; settings: WizardSettings; pets?: WizardPet[]; areas: string[];
  user: { name: string; phone: string; email: string } | null; initialService?: string; emergencyLine: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftNote, setDraftNote] = useState(false);
  const [form, setForm] = useState<Draft>(() => ({
    mode: "home", urgency: "standard", serviceSlug: initialService ?? "", species: "Dog",
    petName: "", breed: "", petAge: "", sex: "Unknown", date: today(), slotId: "evening",
    area: "", address: "", guestName: user?.name ?? "", guestPhone: user?.phone ?? "", guestEmail: user?.email ?? "",
    symptoms: "", petId: "", addOns: [] as string[], payment: "cod", consent: false,
  }));
  const [state, formAction, pending] = useActionState<BookingResult | null, FormData>(createAppointment, null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // rescue a half-filled booking
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Draft;
      if (parsed && typeof parsed === "object" && (parsed.petName || parsed.guestName)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring a draft from localStorage is an external-store sync, not derived state
        setForm((current) => ({ ...current, ...parsed }));
        setDraftNote(true);
      }
    } catch { /* ignore a broken draft */ }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)); } catch { /* storage blocked */ }
    }, 400);
    return () => window.clearTimeout(id);
  }, [form]);

  const set = useCallback((key: string, value: string | string[] | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: "" } : current));
  }, []);

  const toggleAddOn = (id: string) => {
    const list = Array.isArray(form.addOns) ? (form.addOns as string[]) : [];
    set("addOns", list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const service = services.find((s) => s.slug === form.serviceSlug);
  const mode = form.mode === "clinic" ? "clinic" : "home";
  const urgency = form.urgency === "emergency" ? "emergency" : "standard";
  const addOns = useMemo(() => (Array.isArray(form.addOns) ? (form.addOns as string[]) : []), [form.addOns]);
  const quote = useMemo(
    () => quoteAppointment({ servicePrice: service?.price ?? 0, mode, urgency, slotId: String(form.slotId), addOns, settings }),
    [service?.price, mode, urgency, form.slotId, addOns, settings],
  );
  const homeOnly = service && !service.homeAvailable && mode === "home";

  const validate = (target: number) => {
    const next: Record<string, string> = {};
    if (target > 0) {
      if (!service) next.serviceSlug = "Choose the service you need.";
      if (!String(form.petName).trim()) next.petName = "What should we call your pet?";
    }
    if (target > 1) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(form.date)) || String(form.date) < today()) next.date = "Pick today or a future date.";
      if (!String(form.address).trim()) next.address = "We need an address to reach you.";
      if (!String(form.area).trim()) next.area = "Choose your area.";
      if (String(form.guestName).trim().length < 2) next.guestName = "Your name, please.";
      if (String(form.guestPhone).replace(/\D/g, "").length < 10) next.guestPhone = "Enter a reachable mobile number.";
      if (form.guestEmail && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(String(form.guestEmail))) next.guestEmail = "Check the email address.";
    }
    if (target > 2 && !form.consent) next.consent = "Tick the box so the clinic may contact you.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const go = (target: number) => {
    if (target > step && !validate(target)) {
      const first = document.querySelector<HTMLElement>("[data-field-error='true']");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setStep(Math.max(0, Math.min(2, target)));
    if (typeof window !== "undefined") window.scrollTo({ top: (document.getElementById("book")?.getBoundingClientRect().top ?? 0) + window.scrollY - 90, behavior: "smooth" });
  };

  const handleSubmit = (event: React.FormEvent) => {
    if (!validate(3)) { event.preventDefault(); return; }
    // let the form submit naturally to the server action
  };

  const stepTitles = ["Pet & service", "When & where", "Review & confirm"];

  return (
    <div className="wizard" id="book">
      <div className="wizard-rail">
        {stepTitles.map((title, i) => (
          <button key={title} type="button" className="wizard-step" data-state={i === step ? "active" : i < step ? "done" : "todo"} onClick={() => go(i)}>
            <span className="wizard-step-n">{i < step ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
            <span>
              <b style={{ display: "block", fontSize: 13.5 }}>{title}</b>
              <small style={{ fontSize: 11 }}>{i === 0 ? "Patient, service, symptoms" : i === 1 ? "Date, slot, address" : "Fees, payment, confirm"}</small>
            </span>
          </button>
        ))}
      </div>

      <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="wizard-body" noValidate>
        <div className="wizard-progress"><span style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>

        {draftNote ? (
          <div className="note note-brass" style={{ margin: "16px" }}>
            <BadgeCheck size={16} />
            <span>We restored the details from your last visit to this form. <button type="button" style={{ fontWeight: 800, textDecoration: "underline" }} onClick={() => { setForm((c) => ({ ...c, petName: "", guestName: user?.name ?? "", symptoms: "", address: "", addOns: [] })); setDraftNote(false); localStorage.removeItem(DRAFT_KEY); }}>Start fresh</button></span>
          </div>
        ) : null}

        {step === 0 ? (
          <>
            <section className="wizard-section">
              <h2>Who are we looking after?</h2>
              <p>Two minutes of detail lets the veterinarian arrive prepared instead of guessing.</p>
              <div className="segmented" role="group" aria-label="Where should we meet">
                {[{ v: "home", l: "Home visit", i: <Home size={15} /> }, { v: "clinic", l: "At the hospital", i: <Stethoscope size={15} /> }].map((o) => (
                  <button key={o.v} type="button" data-active={mode === o.v ? "true" : "false"} onClick={() => set("mode", o.v)}>
                    <span className="row" style={{ gap: 7 }}>{o.i} {o.l}</span>
                  </button>
                ))}
              </div>
              <p className="tiny muted" style={{ marginTop: 10 }}>
                {mode === "home"
                  ? <>We come to you anywhere in our Lahore coverage. Visit charge {money(urgency === "emergency" ? settings.visitHomeEmergency : settings.visitHomeStandard)} is added to the fee.</>
                  : <>Attend us at Al Kabir Town, Town Gate 3 — no travel charge, consultation from {money(settings.visitClinic)}.</>}
              </p>

              <div className="form-grid" style={{ marginTop: 22 }}>
                <FieldLabel icon={<PawPrint size={13} />} name="species" label="Species">
                  <div className="chip-row">
                    {SPECIES.map((s) => (
                      <button key={s} type="button" className="chip" data-active={form.species === s ? "true" : undefined} onClick={() => set("species", s)}>{s}</button>
                    ))}
                  </div>
                </FieldLabel>
                <div className="form-grid">
                  <TextField name="petName" label="Pet's name" required value={String(form.petName)} onChange={(v) => set("petName", v)} error={errors.petName} placeholder="Scottie" />
                  <div className="field">
                    <label className="label" htmlFor="petId">Or pick from my passport</label>
                    <select id="petId" className="select" value={String(form.petId)} onChange={(e) => { const pet = pets.find((p) => p.id === e.target.value); set("petId", e.target.value); if (pet) { set("petName", pet.name); set("species", pet.species); } }}>
                      <option value="">New patient</option>
                      {pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name} · {pet.species}</option>)}
                    </select>
                    <span className="hint">{user ? "Saving to your portal keeps a full medical history." : "Sign in afterwards to keep records in your portal."}</span>
                  </div>
                </div>
                <TextField name="breed" label="Breed (optional)" value={String(form.breed)} onChange={(v) => set("breed", v)} placeholder="Golden Retriever" />
                <div className="form-grid">
                  <TextField name="petAge" label="Age (optional)" value={String(form.petAge)} onChange={(v) => set("petAge", v)} placeholder="3 yr" />
                  <div className="field">
                    <label className="label" htmlFor="sex">Sex</label>
                    <select id="sex" className="select" value={String(form.sex)} onChange={(e) => set("sex", e.target.value)}>
                      {["Unknown", "Male", "Female"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section className="wizard-section">
              <h2>What do you need?</h2>
              <p>Fees below are the professional fee only; travel and add-ons are itemised at the last step.</p>
              <div className="pick-grid">
                {services.filter((s) => (mode === "home" ? true : true)).map((s) => (
                  <button key={s.slug} type="button" className="pick" data-checked={form.serviceSlug === s.slug ? "true" : "false"} data-field-error={errors.serviceSlug ? "true" : undefined} onClick={() => set("serviceSlug", s.slug)}>
                    <span className="pick-check"><Check size={11} strokeWidth={3.4} /></span>
                    <span className="row" style={{ gap: 8, alignItems: "center" }}>
                      <span className="service-icon" style={{ width: 30, height: 30, marginBottom: 0, borderRadius: 9 }}><ServiceGlyph icon={s.icon} size={15} /></span>
                      <b>{s.shortTitle}</b>
                    </span>
                    <small>{s.duration}{s.homeAvailable ? "" : " · hospital only"}</small>
                    <span className="pick-price"><small>from</small> {money(s.price)}</span>
                  </button>
                ))}
              </div>
              {errors.serviceSlug ? <p className="field-error" data-field-error="true" style={{ marginTop: 10 }}>{errors.serviceSlug}</p> : null}
              {homeOnly ? <p className="notice notice-error" style={{ marginTop: 12 }}>This service needs hospital facilities — switch to “At the hospital”.</p> : null}

              <label className="choice" style={{ marginTop: 16, borderColor: urgency === "emergency" ? "var(--danger)" : undefined, background: urgency === "emergency" ? "var(--danger-tint)" : undefined }} data-checked={urgency === "emergency" ? "true" : "false"}>
                <input type="checkbox" name="urgencyFlag" checked={urgency === "emergency"} onChange={(e) => set("urgency", e.target.checked ? "emergency" : "standard")} />
                <span className="col" style={{ gap: 3 }}>
                  <b><AlertTriangle size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 5 }} />This is urgent or an emergency</b>
                  <small>Priority dispatch, and the emergency visit charge of {money(settings.visitHomeEmergency)} applies instead of {money(settings.visitHomeStandard)}.</small>
                </span>
              </label>
              {urgency === "emergency" ? (
                <p className="small" style={{ marginTop: 10, color: "var(--danger)", fontWeight: 700 }}>
                  If your pet is collapsed, bleeding heavily or struggling to breathe, call <a href={`tel:${emergencyLine.replace(/\s/g, "")}`} style={{ textDecoration: "underline" }}>{emergencyLine}</a> now — do not wait for this form.
                </p>
              ) : null}

              <div style={{ marginTop: 18 }}>
                <TextField name="symptoms" label="Symptoms or notes for the veterinarian (optional)" textarea rows={4} value={String(form.symptoms)} onChange={(v) => set("symptoms", v)} placeholder="Started 3 days ago, eating less, vomiting twice yesterday, no fever measured…" />
              </div>
            </section>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <section className="wizard-section">
              <h2>Pick a date and window</h2>
              <p>We confirm by WhatsApp, usually within 20 minutes during working hours.</p>
              <div className="form-grid">
                <TextField name="date" label="Preferred date" required type="date" value={String(form.date)} onChange={(v) => set("date", v)} error={errors.date} min={today()} />
                <div className="field">
                  <label className="label" htmlFor="slotId">Time window</label>
                  <select id="slotId" className="select" value={String(form.slotId)} onChange={(e) => set("slotId", e.target.value)}>
                    {SLOTS.map((s) => <option key={s.id} value={s.id}>{s.label} · {s.window}</option>)}
                  </select>
                  <span className="hint">{SLOTS.find((s) => s.id === form.slotId)?.note}</span>
                </div>
              </div>
              <div className="pick-grid" style={{ marginTop: 16, gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))" }}>
                {SLOTS.map((s) => (
                  <button key={s.id} type="button" className="pick" data-checked={form.slotId === s.id ? "true" : "false"} onClick={() => set("slotId", s.id)}>
                    <span className="pick-check"><Check size={11} strokeWidth={3.4} /></span>
                    <b>{s.label}</b>
                    <small>{s.window}</small>
                    <span className="tiny muted">{s.note}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="wizard-section">
              <h2>Where and who</h2>
              <div className="form-grid">
                <TextField name="guestName" label="Your name" required value={String(form.guestName)} onChange={(v) => set("guestName", v)} error={errors.guestName} placeholder="Areeba Khan" icon={<User size={13} />} />
                <TextField name="guestPhone" label="Mobile number" required type="tel" value={String(form.guestPhone)} onChange={(v) => set("guestPhone", v)} error={errors.guestPhone} placeholder="+92 300 1234567" />
              </div>
              <div className="form-grid" style={{ marginTop: 16 }}>
                <div className="field">
                  <label className="label" htmlFor="area">Area</label>
                  <select id="area" className="select" value={String(form.area)} onChange={(e) => set("area", e.target.value)} data-field-error={errors.area ? "true" : undefined}>
                    <option value="">Choose your area…</option>
                    {areas.map((a) => <option key={a} value={a}>{a}</option>)}
                    <option value="Other — Lahore">Other — Lahore</option>
                  </select>
                  {errors.area ? <span className="field-error">{errors.area}</span> : null}
                </div>
                <TextField name="guestEmail" label="Email (optional)" type="email" value={String(form.guestEmail)} onChange={(v) => set("guestEmail", v)} error={errors.guestEmail} placeholder="you@example.com" />
              </div>
              <div style={{ marginTop: 16 }}>
                <TextField name="address" label={mode === "home" ? "Full address for the visit" : "Any note for the hospital visit"} required textarea rows={2} value={String(form.address)} onChange={(v) => set("address", v)} error={errors.address} placeholder={mode === "home" ? "House / flat no., street, landmark, area, Lahore" : "Parking, gate code, arrival time…"} icon={<MapPin size={13} />} />
              </div>
            </section>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <section className="wizard-section">
              <h2>Anything else we should bring?</h2>
              <p>Optional extras — add or drop them here, or ask the veterinarian at the visit.</p>
              <div className="choice-grid">
                {ADDONS.map((addon) => {
                  const checked = addOns.includes(addon.id);
                  return (
                    <label key={addon.id} className="choice" data-checked={checked ? "true" : "false"}>
                      <input type="checkbox" checked={checked} onChange={() => toggleAddOn(addon.id)} />
                      <span className="col" style={{ gap: 2, flex: 1 }}>
                        <b>{addon.label}</b>
                        <small>{addon.hint}</small>
                      </span>
                      <span className="pick-price" style={{ margin: 0 }}>{money(addon.amount)}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="wizard-section">
              <h2>Check the numbers</h2>
              <div className="form-grid" style={{ alignItems: "start", gap: 24 }}>
                <div className="summary-rows">
                  <Row label="Patient" value={`${form.petName || "—"} · ${form.species}${form.breed ? ` · ${form.breed}` : ""}`} />
                  <Row label="Service" value={service?.title ?? "—"} />
                  <Row label="Format" value={mode === "home" ? "Home visit" : "Hospital visit"} />
                  <Row label="When" value={<span className="row" style={{ gap: 8, justifyContent: "flex-end" }}><Calendar size={14} /> {form.date} · {SLOTS.find((s) => s.id === form.slotId)?.label}</span>} />
                  <Row label="Window" value={String(SLOTS.find((s) => s.id === form.slotId)?.window ?? "")} />
                  <Row label={mode === "home" ? "Address" : "Location"} value={mode === "home" ? `${form.address || "—"}${form.area ? `, ${form.area}` : ""}` : "Al Kabir Town, Town Gate 3, Main Raiwind Road"} />
                  <Row label="Contact" value={`${form.guestName} · ${form.guestPhone}`} />
                  {form.symptoms ? <Row label="Notes" value={<span style={{ fontWeight: 500, fontSize: 13, textAlign: "right" }}>{form.symptoms}</span>} /> : null}
                </div>
                <div className="card card-pad" style={{ background: "linear-gradient(150deg,#f8f4ec,#fffdfa)" }}>
                  <div className="row-between" style={{ marginBottom: 10 }}><h4>Fees</h4><span className="pill pill-soft">No advance</span></div>
                  {quote.lines.map((line) => (
                    <div className="fee-row" key={line.label}><span>{line.label}</span><b>{money(line.amount)}</b></div>
                  ))}
                  <div className="fee-row fee-total"><span>Total due after the visit</span><b>{money(quote.total)}</b></div>
                  <p className="tiny muted" style={{ margin: "12px 0 0" }}>
                    <Truck size={12} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} />
                    Medicines, dressings or lab analysis are quoted separately at the visit and never started without your approval.
                  </p>
                </div>
              </div>

              <h4 style={{ margin: "24px 0 10px" }}>How would you like to pay?</h4>
              <div className="chip-row">
                {[{ v: "cod", l: "Cash after the visit" }, { v: "transfer", l: "Bank transfer" }, { v: "easypaisa", l: "Easypaisa / JazzCash" }, { v: "card", l: "Card at the desk" }].map((o) => (
                  <button key={o.v} type="button" className="chip" data-active={form.payment === o.v ? "true" : undefined} onClick={() => set("payment", o.v)}>{o.l}</button>
                ))}
              </div>

              <label className="choice" style={{ marginTop: 18 }} data-checked={form.consent ? "true" : "false"}>
                <input type="checkbox" checked={Boolean(form.consent)} onChange={(e) => set("consent", e.target.checked)} />
                <span className="col" style={{ gap: 3 }}>
                  <b>I agree the clinic may contact me on this number about the booking</b>
                  <small>Booking requests are confirmed by a veterinarian. This form is not an emergency service — for emergencies call {emergencyLine}.</small>
                </span>
              </label>
              {errors.consent ? <p className="field-error" data-field-error="true" style={{ marginTop: 8 }}>{errors.consent}</p> : null}
              {state && !state.ok ? <p className="notice notice-error" style={{ marginTop: 14 }}>{state.message}</p> : null}
            </section>
          </>
        ) : null}

        <div className="wizard-foot">
          <button type="button" className="button button-ghost button-sm" onClick={() => go(step - 1)} style={{ visibility: step === 0 ? "hidden" : "visible" }}>
            <ArrowLeft size={15} /> Back
          </button>
          <span className="row" style={{ gap: 10 }}>
            <span className="tiny muted"><Clock size={12} style={{ display: "inline", verticalAlign: "-2px" }} /> Step {step + 1} of 3 · takes about 2 minutes</span>
            {step < 2 ? (
              <button type="button" className="button button-primary" onClick={() => go(step + 1)}>Continue <ArrowRight size={16} /></button>
            ) : (
              <button type="submit" className="button button-primary button-lg" disabled={pending || homeOnly}>
                {pending ? "Sending to the clinic…" : `Confirm booking · ${money(quote.total)}`}
              </button>
            )}
          </span>
        </div>
        {/* mirror of wizard state into real inputs so the server action receives everything */}
        <MirroredFields form={form} serviceSlug={String(form.serviceSlug)} />
      </form>

      <div className="row" style={{ justifyContent: "center", gap: 14, marginTop: 4 }}>
        <HeartPulse size={15} style={{ color: "var(--brass)" }} />
        <span className="small muted">Already booked by phone? <button type="button" className="link-arrow" onClick={() => router.push("/portal")}>Track or reschedule in your portal</button></span>
      </div>
    </div>
  );
}

function MirroredFields({ form, serviceSlug }: { form: Draft; serviceSlug: string }) {
  const simple = ["guestName", "guestPhone", "guestEmail", "petName", "species", "breed", "petAge", "sex", "date", "slotId", "area", "address", "symptoms", "petId", "payment", "mode"] as const;
  const addOns = Array.isArray(form.addOns) ? (form.addOns as string[]) : [];
  return (
    <>
      {simple.map((key) => <input key={key} type="hidden" name={key} value={String(form[key] ?? "")} readOnly />)}
      <input type="hidden" name="serviceSlug" value={serviceSlug} readOnly />
      <input type="hidden" name="urgency" value={form.urgency === "emergency" ? "emergency" : "standard"} readOnly />
      {addOns.map((id) => <input key={id} type="hidden" name="addOns" value={id} readOnly />)}
      {form.consent ? <input type="hidden" name="consent" value="on" readOnly /> : null}
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="summary-row"><dt>{label}</dt><dd>{value}</dd></div>;
}

function FieldLabel({ children, label, icon }: { children: React.ReactNode; label: string; name: string; icon?: React.ReactNode }) {
  return (
    <div className="field">
      <span className="label" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>{icon} {label}</span>
      {children}
    </div>
  );
}

function TextField({
  name, label, value, onChange, error, placeholder, type = "text", required, textarea, rows, icon, min,
}: { name: string; label: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string; type?: string; required?: boolean; textarea?: boolean; rows?: number; icon?: React.ReactNode; min?: string }) {
  return (
    <div className="field">
      <label className="label" htmlFor={`bw-${name}`} style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>{icon} {label}{required ? " *" : ""}</label>
      {textarea ? (
        <textarea id={`bw-${name}`} rows={rows ?? 3} className={`textarea${error ? " input-error" : ""}`} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} data-field-error={error ? "true" : undefined} />
      ) : (
        <input id={`bw-${name}`} type={type} min={min} className={`input${error ? " input-error" : ""}`} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} data-field-error={error ? "true" : undefined} />
      )}
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  );
}
