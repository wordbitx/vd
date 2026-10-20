import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronDown, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/page-parts";
import { faqs } from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";
import { business, whatsappUrl } from "@/lib/site";

export const metadata = pageMetadata("FAQs — Jawad Veterinary Hospital Lahore", "Answers about appointments, home visits, fees, the Pet Mall, Digital Pet Passports and adoptions at Jawad Veterinary Hospital.", "/faqs");

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FaqsPage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHero
        eyebrow="GOOD QUESTIONS"
        title="Everything pet parents ask us."
        description="Appointments, home visits, fees, your pet's Digital Passport, online orders and adoptions — answered plainly. Anything else? We're one call away."
      >
        <a href={business.phoneHref} className="button button-outline"><Phone size={16} /> {business.phone}</a>
        <a href={whatsappUrl("Hello Jawad Veterinary Hospital, I have a question about my pet.")} target="_blank" rel="noopener noreferrer" className="button button-outline"><MessageCircle size={16} /> Ask on WhatsApp</a>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details className="faq-item" key={faq.question} open={index === 0}>
                <summary>{faq.question}<ChevronDown size={18} /></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="portal-card" style={{ marginTop: 36, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", maxWidth: 880 }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h3 style={{ margin: "0 0 6px", fontFamily: "var(--display)", fontSize: 22, color: "var(--forest)" }}>Still unsure about something?</h3>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: "#5f6b73" }}>Send us a message from the contact page or WhatsApp — and if your pet simply needs to be seen, booking takes under two minutes.</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/book" className="button button-primary"><CalendarDays size={16} /> Book a visit</Link>
              <Link href="/contact" className="button button-outline">Contact us <ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
