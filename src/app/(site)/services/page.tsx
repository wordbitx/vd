import type { Metadata } from "next";
import { ServiceCard } from "@/components/cards";
import { PageHero } from "@/components/page-hero";
import { WhatsAppIcon } from "@/components/icons";
import { business } from "@/lib/site";
import { catalogServices } from "@/server/catalog";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Veterinary Services in Lahore — home vet care",
  "Consultations, vaccination, deworming, surgical aftercare, dentistry, emergency care, nutrition and lab tests — delivered at home across Lahore or at our Al Kabir Town hospital.",
  "/services",
  "/images/consultation.jpg",
);

/** The reference lists its services in this order; ours follow, then the extra hospital services. */
const ORDER = [
  "general-checkup",
  "vaccination",
  "deworming",
  "surgical-consult",
  "dental",
  "emergency-care",
  "nutrition",
  "lab-tests",
  "tick-flea",
];

const DISPLAY: Record<string, string> = {
  "general-checkup": "General Checkup",
  vaccination: "Vaccination",
  deworming: "Deworming",
  "surgical-consult": "Surgical Consultation",
  dental: "Dental Cleaning",
  "emergency-care": "Emergency Care",
  nutrition: "Pet Nutrition Consultation",
  "lab-tests": "Diagnostic & Lab Tests",
  "tick-flea": "Tick & Flea Treatments",
};

export default async function ServicesPage() {
  const all = await catalogServices();
  const rank = (slug: string) => (ORDER.includes(slug) ? ORDER.indexOf(slug) : ORDER.length + all.findIndex((s) => s.slug === slug));
  const services = [...all].sort((a, b) => rank(a.slug) - rank(b.slug));

  return (
    <>
      <PageHero
        variant="gradient"
        crumb="Services"
        title="Veterinary Services in Lahore"
        subtitle="Clinic-grade home vet care across all areas of Lahore"
      />

      <section className="r-section r-services-section">
        <div className="r-wrap">
          <div className="r-cards r-cards-services">
            {services.map((service) => (
              <ServiceCard
                key={service.slug}
                service={{ ...service, shortTitle: DISPLAY[service.slug] ?? service.shortTitle }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-band">
            <div>
              <h2>Life-threatening emergency?</h2>
              <p>Don&apos;t book — WhatsApp immediately. Our rapid response team is available 24/7 for critical cases.</p>
            </div>
            <div className="r-band-actions">
              <a
                href={`https://wa.me/${business.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="r-btn r-btn-orange r-btn-lg"
              >
                <WhatsAppIcon size={15} /> WhatsApp {business.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
