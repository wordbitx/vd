import Link from "next/link";
import { ArrowRight, CalendarDays, Check, MessageCircle, Phone } from "lucide-react";
import { ServiceCard } from "@/components/cards";
import { BookingCta, DemoNotice, PageHero } from "@/components/page-parts";
import { business, services, whatsappUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Veterinary Services in Lahore", "Explore proposed veterinary consultation, preventive care, treatment and pet grooming options at Jawad Veterinary Hospital. Confirm availability directly before visiting.", "/services", "/images/care-consultation.jpg");

const careTopics = [
  { number: "01", title: "Preventive care", items: ["Health examinations and wellness consultations", "Puppy and kitten checkups", "Vaccination planning", "Deworming and parasite prevention"] },
  { number: "02", title: "Medical concerns", items: ["Illness and symptom consultations", "Skin, allergy and digestive concerns", "Follow-up conversations", "Medication guidance"] },
  { number: "03", title: "Treatment & procedures", items: ["Surgical consultations and procedure enquiries", "Spay and neuter enquiries", "Wound management and aftercare", "Urgent assessment — call ahead"] },
  { number: "04", title: "More ways to help", items: ["Laboratory testing enquiries", "Dental care enquiries", "Grooming and bathing enquiries", "Nutrition and feeding guidance"] },
];

export default function ServicesPage() {
  return <main id="main-content">
    <PageHero eyebrow="CARE FOR EVERY CHAPTER" title="Veterinary care, with your pet in mind." description="Explore the ways the team may be able to help, from everyday health questions to conversations about treatment and next steps. Please confirm exact services and availability when contacting the hospital." image="/images/care-consultation.jpg" imageAlt="Illustrative veterinarian examining a dog in a consultation room">
      <Link href="/book-appointment" className="button button-primary"><CalendarDays size={17} /> Request an appointment <ArrowRight size={16} /></Link>
    </PageHero>
    <section className="section"><div className="container"><div className="section-header"><div><span className="eyebrow"><span className="eyebrow-line" /> COMPLETE VETERINARY CARE</span><h2>Find the right place to start.</h2><p>Every pet is different. These pages help you understand a care option before speaking to the team.</p></div></div><div className="services-index-grid">{services.map((service) => <ServiceCard service={service} image key={service.slug} />)}</div><DemoNotice>Service pages are editable demo content, not a confirmed list of equipment, procedures or hours. Please call to confirm what is available for your pet.</DemoNotice></div></section>
    <section className="care-topics-section"><div className="container"><div className="section-header compact"><div><span className="eyebrow"><span className="eyebrow-line" /> QUESTIONS WE CAN HELP YOU EXPLORE</span><h2>Care, organised around real life.</h2><p>Use these topics as a starting point for a conversation. The hospital will confirm what it can offer and whether a referral is needed.</p></div></div><div className="care-topics-grid">{careTopics.map((topic) => <article key={topic.title} className="care-topic-card"><span>{topic.number}</span><h3>{topic.title}</h3><ul>{topic.items.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></article>)}</div></div></section>
    <section className="container service-contact-strip"><div><h2>Not sure what your pet needs?</h2><p>Call first and describe what you’re noticing. For a potentially urgent situation, please phone rather than wait for a form response.</p></div><div><a href={business.phoneHref} className="button button-primary"><Phone size={17} /> Call {business.phone}</a><a href={whatsappUrl("Hello Jawad Veterinary Hospital, I would like to ask about veterinary care for my pet.")} target="_blank" rel="noopener noreferrer" className="button button-outline"><MessageCircle size={17} /> WhatsApp us</a></div></section>
    <BookingCta />
  </main>;
}
