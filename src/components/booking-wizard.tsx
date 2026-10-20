"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Bird, Building2, CalendarDays, Cat, Check, Clock3, Dog, HeartPulse, Home, Info, Loader2, MapPin, Microscope, PawPrint, Phone, Rabbit, Scissors, Siren, Smile, Soup, Sparkles, Stethoscope, Syringe } from "lucide-react";
import { bookingServices, lahoreAreas } from "@/lib/catalog";
import { TIME_SLOTS, formatDate, pkr, todayIso } from "@/lib/format";
import { business } from "@/lib/site";
import type { Appointment, HospitalSettings, Pet, User } from "@/lib/types";

const PET_TYPES = [
  { label: "Dog", icon: Dog },
  { label: "Cat", icon: Cat },
  { label: "Bird", icon: Bird },
  { label: "Rabbit", icon: Rabbit },
  { label: "Other", icon: PawPrint },
] as const;

const SERVICE_ICONS: Record<string, typeof Stethoscope> = {
  "general-consultation": Stethoscope,
  "vaccination-preventive-care": Syringe,
  deworming: HeartPulse,
  "pet-grooming": Sparkles,
  "surgery-treatment": Scissors,
  "diagnostics-laboratory-tests": Microscope,
  "dental-care": Smile,
  "pet-nutrition-guidance": Soup,
};

type Props = {
  settings: HospitalSettings;
  user: User | null;
  myPets: Pet[];
  initialService?: string;
  initialPetId?: string;
};

export function BookingWizard({ settings, user, myPets, initialService = "", initialPetId = "" }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [petId, setPetId] = useState(initialPetId);
  const selectedPet = myPets.find((pet) => pet.id === petId) ?? null;
  const [petName, setPetName] = useState(selectedPet?.name ?? "");
  const [petType, setPetType] = useState(selectedPet?.species ?? "");
  const [petBreed, setPetBreed] = useState(selectedPet?.breed ?? "");
  const [petAge, setPetAge] = useState("");
  const [serviceSlug, setServiceSlug] = useState(initialService);
  const [emergency, setEmergency] = useState(false);
  const [symptoms, setSymptoms] = useState("");

  const [visitType, setVisitType] = useState<"hospital" | "home">("hospital");
  const [date, setDate] = useState(todayIso());
  const [timeSlot, setTimeSlot] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState(user?.address ?? "");

  const [ownerName, setOwnerName] = useState(user?.name ?? "");
  const [ownerPhone, setOwnerPhone] = useState(user?.phone ?? "");
  const [ownerEmail, setOwnerEmail] = useState(user?.email ?? "");

  const service = bookingServices.find((item) => item.slug === serviceSlug);
  const fee = emergency
    ? visitType === "home" ? settings.emergencyHomeFee : settings.emergencyHospitalFee
    : visitType === "home" ? settings.homeVisitFee : settings.hospitalVisitFee;

  const isToday = date === todayIso();
  const nowMinutes = useMemo(() => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }, [date]);
  const slotDisabled = (slot: string) => {
    if (!isToday || emergency) return false;
    const match = slot.match(/^(\d+):(\d+)\s(AM|PM)$/);
    if (!match) return false;
    let h = Number(match[1]);
    if (match[3] === "PM" && h !== 12) h += 12;
    if (match[3] === "AM" && h === 12) h = 0;
    return h * 60 + Number(match[2]) <= nowMinutes + 30;
  };

  const choosePet = (id: string) => {
    setPetId(id);
    const pet = myPets.find((item) => item.id === id);
    if (pet) {
      setPetName(pet.name);
      setPetType(pet.species);
      setPetBreed(pet.breed);
    }
  };

  const validateStep = (current: number): string => {
    if (current === 1) {
      if (!petType) return "Please select your pet type.";
      if (!serviceSlug) return "Please select a service.";
    }
    if (current === 2) {
      if (!date || date < todayIso()) return "Please choose today or a future date.";
      if (!emergency && !timeSlot) return "Please choose a time slot.";
      if (visitType === "home" && address.trim().length < 8) return "Please enter your complete home address for the home visit.";
    }
    if (current === 3) {
      if (ownerName.trim().length < 2) return "Please enter your name.";
      if (ownerPhone.replace(/\D/g, "").length < 10) return "Please enter a valid mobile number (we confirm on WhatsApp).";
    }
    return "";
  };

  const next = () => {
    const problem = validateStep(step);
    setError(problem);
    if (!problem) { setStep((value) => Math.min(3, value + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };
  const back = () => { setError(""); setStep((value) => Math.max(1, value - 1)); };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = validateStep(3);
    if (problem) { setError(problem); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId: petId || undefined,
          petName: petName.trim(), petType, petBreed: petBreed.trim(), petAge: petAge.trim(),
          serviceSlug, visitType, emergency,
          date, timeSlot: emergency && !timeSlot ? "As soon as possible" : timeSlot,
          area, address: address.trim(), symptoms: symptoms.trim(),
          ownerName: ownerName.trim(), ownerPhone: ownerPhone.trim(), ownerEmail: ownerEmail.trim(),
        }),
      });
      const data = (await res.json()) as { appointment?: Appointment; error?: string };
      if (!res.ok || !data.appointment) throw new Error(data.error ?? "Something went wrong while booking.");
      router.push(`/book/slip/${data.appointment.ref}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while booking. Please try again or call us.");
      setSubmitting(false);
    }
  }

  return (
    <form className="wizard" onSubmit={submit} noValidate>
      <div className="wizard-progress" aria-label="Booking progress">
        {[{ n: 1, label: "Pet & Service" }, { n: 2, label: "Schedule & Visit" }, { n: 3, label: "Review & Confirm" }].map((item, index) => (
          <div key={item.n} style={{ display: "contents" }}>
            <div className={`wp-step ${step === item.n ? "active" : ""} ${step > item.n ? "done" : ""}`}>
              <span className="wp-dot">{step > item.n ? <Check size={16} /> : item.n}</span>
              <span className="wp-label">{item.label}</span>
            </div>
            {index < 2 && <span className={`wp-bar ${step > item.n ? "done" : ""}`} />}
          </div>
        ))}
      </div>

      {error && <div className="form-error-summary" role="alert" style={{ marginBottom: 18 }}>{error}</div>}

      {step === 1 && (
        <div>
          <span className="eyebrow"><span className="eyebrow-line" /> STEP 1 OF 3 · DETAILS</span>
          {myPets.length > 0 && (
            <>
              <h2>Which pet is this visit for?</h2>
              <div className="chip-group" style={{ marginBottom: 8 }}>
                {myPets.map((pet) => (
                  <button type="button" key={pet.id} className={`chip ${petId === pet.id ? "selected" : ""}`} onClick={() => choosePet(pet.id)} aria-pressed={petId === pet.id}>
                    <PawPrint size={15} /> {pet.name} · {pet.species}
                  </button>
                ))}
                <button type="button" className={`chip ${!petId ? "selected" : ""}`} onClick={() => setPetId("")} aria-pressed={!petId}>A new pet</button>
              </div>
            </>
          )}
          <h2>Pet details</h2>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="bw-petname">Pet name <span className="optional">Optional</span></label>
              <input id="bw-petname" value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="e.g. Bruno" />
            </div>
            <div className="field">
              <label htmlFor="bw-petage">Pet age <span className="optional">Optional</span></label>
              <input id="bw-petage" value={petAge} onChange={(e) => setPetAge(e.target.value)} placeholder="e.g. 2 years, 6 months" />
            </div>
            <div className="field field-full">
              <label>Pet type <span>*</span></label>
              <div className="chip-group">
                {PET_TYPES.map(({ label, icon: Icon }) => (
                  <button type="button" key={label} className={`chip ${petType === label ? "selected" : ""}`} onClick={() => setPetType(label)} aria-pressed={petType === label}>
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="field field-full">
              <label htmlFor="bw-breed">Pet breed <span className="optional">Optional</span></label>
              <input id="bw-breed" value={petBreed} onChange={(e) => setPetBreed(e.target.value)} placeholder="e.g. Persian, German Shepherd, Holland Lop" />
            </div>
          </div>

          <h2>Select service</h2>
          <div className="service-chips">
            {bookingServices.map((item) => {
              const Icon = SERVICE_ICONS[item.slug] ?? Stethoscope;
              return (
                <button type="button" key={item.slug} className={`service-chip ${serviceSlug === item.slug ? "selected" : ""}`} onClick={() => setServiceSlug(item.slug)} aria-pressed={serviceSlug === item.slug}>
                  <span className="sc-icon"><Icon size={19} /></span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.blurb}</small>
                    <span className="sc-fee"><Clock3 size={11} style={{ verticalAlign: -2 }} /> {item.duration}{item.feeFrom > 0 ? ` · Service from ${pkr(item.feeFrom)}` : " · Included in visit"}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <label className="toggle-row">
            <span className="toggle-icon"><Siren size={21} /></span>
            <span>
              <strong>This is a medical emergency</strong>
              <small>Check this if your pet needs immediate attention — we will prioritise your booking and call you back right away.</small>
            </span>
            <span className="switch">
              <input type="checkbox" checked={emergency} onChange={(e) => setEmergency(e.target.checked)} aria-label="This is a medical emergency" />
              <span className="track" />
            </span>
          </label>

          <div className="fee-note-box">
            <Info size={17} />
            <span>
              Visiting charges — Hospital: <strong>{pkr(settings.hospitalVisitFee)}</strong> · Home visit: <strong>{pkr(settings.homeVisitFee)}</strong> ·
              Emergency: <strong>{pkr(settings.emergencyHospitalFee)}</strong> (hospital) / <strong>{pkr(settings.emergencyHomeFee)}</strong> (home).
              Service &amp; medicine charges are always confirmed with you before treatment. No hidden fees.
            </span>
          </div>

          <div className="field" style={{ marginTop: 18 }}>
            <label htmlFor="bw-symptoms">Symptoms or notes for the vet <span className="optional">Optional</span></label>
            <textarea id="bw-symptoms" rows={3} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Tell us what's happening — when it started, appetite, behaviour changes…" />
          </div>

          <div className="wizard-nav">
            <span className="spacer" />
            <button type="button" className="button button-primary button-large" onClick={next}>Next · Schedule <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <span className="eyebrow"><span className="eyebrow-line" /> STEP 2 OF 3 · SCHEDULE</span>
          <h2>How would you like to see the vet?</h2>
          <div className="visit-type-grid">
            <button type="button" className={`visit-type-card ${visitType === "hospital" ? "selected" : ""}`} onClick={() => setVisitType("hospital")} aria-pressed={visitType === "hospital"}>
              <Building2 size={24} />
              <strong>Hospital Visit</strong>
              <small>Visit us at Al Kabir Town, Gate 3, Main Raiwind Road. Skip the queue with your token number.</small>
              <span className="vt-fee">{emergency ? `Emergency charges ${pkr(settings.emergencyHospitalFee)}` : `Visiting charges ${pkr(settings.hospitalVisitFee)}`}</span>
            </button>
            <button type="button" className={`visit-type-card ${visitType === "home" ? "selected" : ""}`} onClick={() => setVisitType("home")} aria-pressed={visitType === "home"}>
              <Home size={24} />
              <strong>Home Visit</strong>
              <small>Our vet comes to your home anywhere in Lahore — stress-free for anxious pets.</small>
              <span className="vt-fee">{emergency ? `Emergency charges ${pkr(settings.emergencyHomeFee)}` : `Visiting charges ${pkr(settings.homeVisitFee)}`}</span>
            </button>
          </div>

          <h2>Choose date &amp; time</h2>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="bw-date">Appointment date <span>*</span></label>
              <input id="bw-date" type="date" min={todayIso()} value={date} onChange={(e) => { setDate(e.target.value); setTimeSlot(""); }} />
            </div>
            <div className="field">
              <label htmlFor="bw-area">Your area <span className="optional">{visitType === "home" ? "Recommended" : "Optional"}</span></label>
              <select id="bw-area" value={area} onChange={(e) => setArea(e.target.value)}>
                <option value="">Select area</option>
                {lahoreAreas.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>
          {emergency ? (
            <div className="fee-note-box" role="status">
              <Siren size={17} />
              <span><strong>Emergency booking:</strong> we will call you immediately after booking and guide you — no need to pick a time slot. For life-threatening situations, call <a href={business.phoneHref}><strong>{business.phone}</strong></a> right now.</span>
            </div>
          ) : (
            <div className="field" style={{ marginTop: 16 }}>
              <label>Available time slots · {formatDate(date)} <span>*</span></label>
              <div className="slot-grid">
                {TIME_SLOTS.map((slot) => (
                  <button type="button" key={slot} className={`slot ${timeSlot === slot ? "selected" : ""}`} disabled={slotDisabled(slot)} onClick={() => setTimeSlot(slot)} aria-pressed={timeSlot === slot}>{slot}</button>
                ))}
              </div>
            </div>
          )}
          {visitType === "home" && (
            <div className="field" style={{ marginTop: 18 }}>
              <label htmlFor="bw-address">Complete home address <span>*</span></label>
              <textarea id="bw-address" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, street, block, nearest landmark — so our vet reaches you quickly" />
            </div>
          )}
          <div className="wizard-nav">
            <button type="button" className="button button-outline" onClick={back}><ArrowLeft size={16} /> Back</button>
            <span className="spacer" />
            <button type="button" className="button button-primary button-large" onClick={next}>Next · Your details <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <span className="eyebrow"><span className="eyebrow-line" /> STEP 3 OF 3 · CONFIRM</span>
          <h2>Your details</h2>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="bw-owner">Your name <span>*</span></label>
              <input id="bw-owner" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} autoComplete="name" placeholder="Your full name" />
            </div>
            <div className="field">
              <label htmlFor="bw-phone">Mobile / WhatsApp number <span>*</span></label>
              <input id="bw-phone" type="tel" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} autoComplete="tel" placeholder="0300 1234567" />
            </div>
            <div className="field field-full">
              <label htmlFor="bw-email">Email address <span className="optional">Optional</span></label>
              <input id="bw-email" type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
            </div>
          </div>

          <h2>Review your booking</h2>
          <div className="review-list">
            <div><span>Pet</span><strong>{petName || "My pet"} · {petType}{petBreed ? ` (${petBreed})` : ""}{petAge ? ` · ${petAge}` : ""}</strong></div>
            <div><span>Service</span><strong>{service?.title ?? "—"}{emergency ? " · EMERGENCY" : ""}</strong></div>
            <div><span>Visit type</span><strong>{visitType === "home" ? "Home visit" : "Hospital visit"}</strong></div>
            <div><span>Date &amp; time</span><strong>{formatDate(date)} · {emergency && !timeSlot ? "As soon as possible" : timeSlot}</strong></div>
            {visitType === "home" && <div><span>Address</span><strong>{address}{area ? `, ${area}` : ""}</strong></div>}
            {symptoms && <div><span>Notes</span><strong>{symptoms}</strong></div>}
          </div>

          <div className="fee-summary-card" style={{ marginTop: 18 }}>
            <h3>Charges summary</h3>
            <div className="fee-line"><span>{emergency ? "Emergency visiting charges" : "Visiting charges"} ({visitType === "home" ? "home visit" : "hospital"})</span><strong>{pkr(fee)}</strong></div>
            <div className="fee-line"><span>{service?.title ?? "Service"}</span><strong>{service && service.feeFrom > 0 ? `from ${pkr(service.feeFrom)}` : "Included / on assessment"}</strong></div>
            <div className="fee-line total"><span>Payable at visit (visiting charges)</span><strong>{pkr(fee)}</strong></div>
            <small>Pay cash, Easypaisa, JazzCash or bank transfer at your visit. Your instant booking slip with token number is generated on confirmation — our team also confirms on WhatsApp.</small>
          </div>

          <div className="wizard-nav">
            <button type="button" className="button button-outline" onClick={back} disabled={submitting}><ArrowLeft size={16} /> Back</button>
            <span className="spacer" />
            <button type="submit" className="button button-gold button-large" disabled={submitting}>
              {submitting ? <Loader2 size={17} className="spin" /> : <CalendarDays size={17} />}
              {submitting ? "Confirming…" : "Confirm booking & get slip"}
            </button>
          </div>
          <p style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginTop: 16, fontSize: 11.5, color: "#7a868e" }}>
            <Phone size={14} /> Prefer to book by phone? Call <a href={business.phoneHref} style={{ fontWeight: 800, color: "#0a2540" }}>{business.phone}</a>
            <MapPin size={14} style={{ marginLeft: 8 }} /> {business.shortAddress}
          </p>
        </div>
      )}
    </form>
  );
}
