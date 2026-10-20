"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

type ContactFields = { name: string; phone: string; subject: string; message: string };
export function ContactForm() {
  const [fields, setFields] = useState<ContactFields>({ name: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFields, string>>>({});
  const [review, setReview] = useState<ContactFields | null>(null);
  const update = (key: keyof ContactFields, value: string) => { setFields((current) => ({ ...current, [key]: value })); if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined })); };
  const message = review ? `Hello Jawad Veterinary Hospital, I have an enquiry.\n\nName: ${review.name}\nPhone: ${review.phone}\nSubject: ${review.subject}\nMessage: ${review.message}` : "";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Partial<Record<keyof ContactFields, string>> = {};
    if (!fields.name.trim()) next.name = "Please enter your name.";
    if (!fields.phone.trim()) next.phone = "Please enter your phone number.";
    else if (fields.phone.replace(/\D/g, "").length < 10) next.phone = "Please enter a valid phone number.";
    if (!fields.subject.trim()) next.subject = "Please enter a subject.";
    if (!fields.message.trim()) next.message = "Please write a message.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setReview({ name: fields.name.trim(), phone: fields.phone.trim(), subject: fields.subject.trim(), message: fields.message.trim() });
  }
  if (review) return <div className="review-panel" role="status"><span className="success-icon"><Check size={27} /></span><span className="eyebrow">MESSAGE PREPARED</span><h2>Ready when you are.</h2><p>Your message has <strong>not been sent</strong>. Check the preview, then open WhatsApp to send it to the hospital. For time-sensitive concerns, call instead.</p><div className="review-message"><h3>Message preview</h3><pre>{message}</pre></div><a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="button button-primary"><MessageCircle size={17} /> Open WhatsApp to send <ArrowRight size={16} /></a><button type="button" className="back-link review-edit" onClick={() => setReview(null)}><ArrowLeft size={16} /> Edit your message</button></div>;
  return <form className="contact-form form-grid" onSubmit={submit} noValidate><div className="field"><label htmlFor="contact-name">Your name <span>*</span></label><input id="contact-name" value={fields.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" placeholder="Your full name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} />{errors.name && <small id="contact-name-error" className="field-error">{errors.name}</small>}</div><div className="field"><label htmlFor="contact-phone">Phone number <span>*</span></label><input id="contact-phone" type="tel" value={fields.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" placeholder="e.g. 0300 1234567" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "contact-phone-error" : undefined} />{errors.phone && <small id="contact-phone-error" className="field-error">{errors.phone}</small>}</div><div className="field field-full"><label htmlFor="contact-subject">Subject <span>*</span></label><input id="contact-subject" value={fields.subject} onChange={(event) => update("subject", event.target.value)} placeholder="How can we help?" aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? "contact-subject-error" : undefined} />{errors.subject && <small id="contact-subject-error" className="field-error">{errors.subject}</small>}</div><div className="field field-full"><label htmlFor="contact-message">Message <span>*</span></label><textarea id="contact-message" rows={5} value={fields.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell us a little about your enquiry..." aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} />{errors.message && <small id="contact-message-error" className="field-error">{errors.message}</small>}</div><p className="form-note field-full">This demo prepares a WhatsApp message on your device. Nothing is submitted to a server from this form.</p><div className="field-full"><button type="submit" className="button button-primary">Review message <ArrowRight size={17} /></button></div></form>;
}
