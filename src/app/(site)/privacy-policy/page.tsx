import type { Metadata } from "next";
import { Breadcrumbs, Eyebrow } from "@/components/ui";
import { business } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Privacy policy",
  "How Jawad Veterinary Hospital collects, uses and protects your details and your pet's medical records.",
  "/privacy-policy",
);

const sections = [
  {
    h: "What we collect",
    p: [
      "Your name, phone number, email and address when you book a visit, place an order or create a portal account. Your pet's species, breed, age, weight, medical notes and vaccination history.",
      "Payment is collected in cash or by bank transfer / Easypaisa. We never store card numbers on this system — card payments are taken on the clinic terminal.",
    ],
  },
  {
    h: "Why we hold it",
    p: [
      "To deliver care safely (dosing is weight-based, and vaccination schedules depend on history), to contact you about a booking or an order, and to keep a legal record of treatment.",
      "We also use aggregate, non-identifying numbers — how many visits a month, which services are busiest — to plan staffing. That reporting cannot identify you.",
    ],
  },
  {
    h: "Who can see your records",
    p: [
      "The veterinarians and front-desk staff treating your pet. Every change to a record is written to an audit log with the staff member's name.",
      "We share records with another clinic or specialist only when you ask us to, or when a referral is part of your pet's treatment and you have agreed.",
    ],
  },
  {
    h: "How long we keep it",
    p: [
      "Clinical records are kept for seven years after the last visit, which is the standard we hold ourselves to for continuity of care. Portal accounts remain active until you ask us to close them.",
      "You can ask for a copy of everything we hold about you and your pet at any time, free of charge.",
    ],
  },
  {
    h: "Cookies and this website",
    p: [
      "One cookie holds your signed portal session so you stay logged in. Your basket is stored in your browser's local storage on your own device. There are no advertising trackers on this site.",
    ],
  },
  {
    h: "Your choices",
    p: [
      "You can turn off WhatsApp or email reminders in the portal, ask us to correct anything inaccurate, or request deletion of a portal account (clinical records are retained separately, as above).",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <section className="section-tight" style={{ paddingTop: 26, paddingBottom: 60 }}>
      <div className="container-narrow">
        <Breadcrumbs items={[{ label: "Privacy" }]} />
        <Eyebrow>Legal</Eyebrow>
        <h1 style={{ margin: "14px 0 10px", fontSize: "clamp(30px,4vw,46px)" }}>Privacy policy</h1>
        <p className="muted small">Last reviewed {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })} · Applies to {business.name}, Al Kabir Town, Lahore.</p>
        <article className="prose" style={{ marginTop: 26 }}>
          <p className="lead">Your pet’s file is medical information about your household. We treat it that way: minimum collection, tight access, and a copy for you whenever you ask.</p>
          {sections.map((section) => (
            <section key={section.h}>
              <h2>{section.h}</h2>
              {section.p.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </section>
          ))}
          <h2>Contact</h2>
          <p>Questions about this policy, or a request for your records: <a href={`mailto:${business.email}`}>{business.email}</a> or call {business.phone}. Our clinic manager handles these within five working days.</p>
        </article>
      </div>
    </section>
  );
}
