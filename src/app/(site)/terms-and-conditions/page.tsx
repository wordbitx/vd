import type { Metadata } from "next";
import { Breadcrumbs, Eyebrow } from "@/components/ui";
import { business, fees } from "@/lib/site";
import { money } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Terms & conditions",
  "Booking terms, fees, cancellation, payment and pet mall delivery/returns for Jawad Veterinary Hospital, Lahore.",
  "/terms-and-conditions",
);

const sections = [
  {
    h: "Bookings and confirmations",
    p: [
      "An online booking is a request until the clinic confirms it — by WhatsApp, phone call or a status change in your portal. The time window is an arrival window, not an appointment minute: emergencies on the road can move a visit by up to an hour, and we call if that happens.",
      "If your pet's condition changes before the visit, message the clinic. We may re-triage and, where necessary, move you earlier or refer you to an emergency facility.",
    ],
  },
  {
    h: "Fees and payment",
    p: [
      `Fees are confirmed when you book. A home visit adds ${money(fees.visitHomeStandard)} for travel (${money(fees.visitHomeEmergency)} for emergency or night dispatch). Medicines, lab analysis, imaging, anaesthesia and hospitalisation are quoted separately, in writing, before they begin.`,
      "Payment is due at the visit: cash, bank transfer or Easypaisa. Where a treatment plan runs across visits, we will agree a schedule in writing. We do not take card details online.",
    ],
  },
  {
    h: "Cancellations",
    p: [
      "You can cancel or request a reschedule from the portal at no cost until the veterinarian is dispatched. After dispatch, the travel charge is payable; the service fee is not.",
      "If we cancel a visit for our own reasons, nothing is charged and we will offer the next available slot first.",
    ],
  },
  {
    h: "Clinical limits",
    p: [
      "Veterinary medicine is not an exact science. We will explain the likely diagnosis, the alternatives and the risks, but no outcome can be guaranteed. Consent for anaesthesia or surgery is taken separately, in writing.",
      "If a case needs facilities or expertise we do not have, we will say so and arrange a referral — continuing treatment beyond our competence is not something we do.",
    ],
  },
  {
    h: "Pet mall orders & delivery",
    p: [
      `Orders confirmed before 4 pm are delivered the same day inside Lahore; later orders go out the next morning. Delivery is ${money(fees.deliveryLahore)}, free above ${money(fees.freeDeliveryOver)}.`,
      "Unopened, in-date stock can be returned within 7 days with the invoice for a refund or exchange. Medicines, opened food and prescription diets cannot be returned once dispensed, for safety reasons.",
    ],
  },
  {
    h: "Emergencies",
    p: [
      "This website is not an emergency service. If your pet is collapsed, bleeding heavily, struggling to breathe, seizuring or a male cat is straining without passing urine, call the clinic immediately — do not wait for a form or a reply.",
    ],
  },
];

export default function TermsPage() {
  return (
    <section className="section-tight" style={{ paddingTop: 26, paddingBottom: 60 }}>
      <div className="container-narrow">
        <Breadcrumbs items={[{ label: "Terms" }]} />
        <Eyebrow>Legal</Eyebrow>
        <h1 style={{ margin: "14px 0 10px", fontSize: "clamp(30px,4vw,46px)" }}>Terms &amp; conditions</h1>
        <p className="muted small">Last reviewed {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })} · {business.name}, {business.shortAddress}</p>
        <article className="prose" style={{ marginTop: 26 }}>
          <p className="lead">Plain terms, because nobody reads six pages of legal prose before bringing a sick cat to the vet.</p>
          {sections.map((section) => (
            <section key={section.h}>
              <h2>{section.h}</h2>
              {section.p.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </section>
          ))}
          <h2>Questions</h2>
          <p>Call {business.phone} or email <a href={`mailto:${business.email}`}>{business.email}</a>. We would rather clarify a fee before a visit than argue about it afterwards.</p>
        </article>
      </div>
    </section>
  );
}
