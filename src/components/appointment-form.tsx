"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, MessageCircle, Phone } from "lucide-react";
import { business, services, whatsappUrl } from "@/lib/site";

type Fields = { owner: string; phone: string; pet: string; petType: string; service: string; date: string; time: string; notes: string };
type Key = keyof Fields;
const initialFields: Fields = { owner: "", phone: "", pet: "", petType: "", service: "", date: "", time: "", notes: "" };

export function AppointmentForm({ initialService = "" }: { initialService?: string }) {
  const [fields, setFields] = useState<Fields>({ ...initialFields, service: initialService });
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [review, setReview] = useState<Fields | null>(null);
  const update = (key: Key, value: string) => { setFields((current) => ({ ...current, [key]: value })); if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined })); };
  const message = review ? `Hello Jawad Veterinary Hospital, I would like to request an appointment (subject to your confirmation).\n\nOwner: ${review.owner}\nPhone: ${review.phone}\nPet: ${review.pet} (${review.petType})\nService: ${services.find((item) => item.slug === review.service)?.title ?? review.service}\nPreferred date: ${review.date}\nPreferred time: ${review.time}${review.notes ? `\nAdditional notes: ${review.notes}` : ""}\n\nPlease let me know if this time and service are available.` : "";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = new Date();
    const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const next: Partial<Record<Key, string>> = {};
    if (!fields.owner.trim()) next.owner = "Please enter your name.";
    if (!fields.phone.trim()) next.phone = "Please enter your phone number.";
    else if (fields.phone.replace(/\D/g, "").length < 10) next.phone = "Please enter a valid number with at least 10 digits.";
    if (!fields.pet.trim()) next.pet = "Please enter your pet’s name.";
    if (!fields.petType) next.petType = "Please select a pet type.";
    if (!fields.service) next.service = "Please select a care option.";
    if (!fields.date) next.date = "Please choose a preferred date.";
    else if (today && fields.date < today) next.date = "Please choose today or a future date.";
    if (!fields.time) next.time = "Please choose a preferred time.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setReview({ ...fields, owner: fields.owner.trim(), phone: fields.phone.trim(), pet: fields.pet.trim(), notes: fields.notes.trim() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (review) return <div className="appointment-confirmation" role="status"><span className="success-icon"><Check size={30} /></span><span className="eyebrow">REQUEST PREPARED</span><h2>One step closer to their visit.</h2><p>Your preferred visit is ready to share, but <strong>it is not a confirmed appointment.</strong> This website preview has no connected booking system. Please review your details, then choose whether to send them on WhatsApp or call the hospital. The team will need to confirm availability.</p><div className="review-message"><h3>Your message preview</h3><pre>{message}</pre></div><div className="confirmation-actions"><a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="button button-primary"><MessageCircle size={18} /> Open WhatsApp to send <ArrowRight size={16} /></a><a href={business.phoneHref} className="button button-outline"><Phone size={17} /> Call instead</a></div><button type="button" className="back-link review-edit" onClick={() => setReview(null)}><ArrowLeft size={16} /> Edit your request</button></div>;
  return <form className="appointment-form" onSubmit={submit} noValidate><div className="form-section-heading"><span className="form-step">01</span><div><h2>Tell us about you & your pet.</h2><p>Fields marked * are required. No request is submitted until you choose to send it.</p></div></div>{Object.keys(errors).length > 0 && <div className="form-error-summary" role="alert">Please check the highlighted fields below.</div>}<div className="form-grid">
    <div className="field"><label htmlFor="app-owner">Your name <span>*</span></label><input id="app-owner" value={fields.owner} onChange={(event) => update("owner", event.target.value)} autoComplete="name" placeholder="Your full name" aria-required="true" aria-invalid={Boolean(errors.owner)} aria-describedby={errors.owner ? "app-owner-error" : undefined} />{errors.owner && <small id="app-owner-error" className="field-error">{errors.owner}</small>}</div>
    <div className="field"><label htmlFor="app-phone">Phone number <span>*</span></label><input id="app-phone" type="tel" value={fields.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" placeholder="e.g. 0300 1234567" aria-required="true" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "app-phone-error" : undefined} />{errors.phone && <small id="app-phone-error" className="field-error">{errors.phone}</small>}</div>
    <div className="field"><label htmlFor="app-pet">Pet’s name <span>*</span></label><input id="app-pet" value={fields.pet} onChange={(event) => update("pet", event.target.value)} placeholder="Your pet’s name" aria-required="true" aria-invalid={Boolean(errors.pet)} aria-describedby={errors.pet ? "app-pet-error" : undefined} />{errors.pet && <small id="app-pet-error" className="field-error">{errors.pet}</small>}</div>
    <div className="field"><label htmlFor="app-type">Pet type <span>*</span></label><select id="app-type" value={fields.petType} onChange={(event) => update("petType", event.target.value)} aria-required="true" aria-invalid={Boolean(errors.petType)} aria-describedby={errors.petType ? "app-type-error" : undefined}><option value="">Select pet type</option><option>Dog</option><option>Cat</option><option>Bird</option><option>Rabbit</option><option>Other animal</option></select>{errors.petType && <small id="app-type-error" className="field-error">{errors.petType}</small>}</div>
    <div className="field field-full"><label htmlFor="app-service">Care option <span>*</span></label><select id="app-service" value={fields.service} onChange={(event) => update("service", event.target.value)} aria-required="true" aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? "app-service-error" : undefined}><option value="">Select a reason for your visit</option>{services.map((service) => <option key={service.slug} value={service.slug}>{service.title} — availability to confirm</option>)}<option value="Other / not sure">Other / not sure</option></select>{errors.service && <small id="app-service-error" className="field-error">{errors.service}</small>}</div>
    <div className="field"><label htmlFor="app-date">Preferred date <span>*</span></label><input id="app-date" type="date" value={fields.date} onChange={(event) => update("date", event.target.value)} aria-required="true" aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "app-date-error" : undefined} />{errors.date && <small id="app-date-error" className="field-error">{errors.date}</small>}</div>
    <div className="field"><label htmlFor="app-time">Preferred time <span>*</span></label><input id="app-time" type="time" value={fields.time} onChange={(event) => update("time", event.target.value)} aria-required="true" aria-invalid={Boolean(errors.time)} aria-describedby={errors.time ? "app-time-error" : undefined} />{errors.time && <small id="app-time-error" className="field-error">{errors.time}</small>}</div>
    <div className="field field-full"><label htmlFor="app-notes">Anything else we should know? <span className="optional">Optional</span></label><textarea id="app-notes" rows={5} value={fields.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Tell us about symptoms, questions or anything that may help the team..." /></div>
  </div><p className="form-note">For urgent concerns, call the hospital directly rather than waiting for an online request. Reported hours are subject to confirmation.</p><button type="submit" className="button button-primary form-submit"><CalendarDays size={18} /> Review appointment request <ArrowRight size={17} /></button></form>;
}
