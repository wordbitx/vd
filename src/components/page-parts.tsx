import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MessageCircle, Phone } from "lucide-react";
import { business, whatsappUrl } from "@/lib/site";

export function PageHero({ eyebrow, title, description, image, imageAlt, children }: { eyebrow: string; title: string; description: string; image?: string; imageAlt?: string; children?: React.ReactNode }) {
  return (
    <section className={`interior-hero ${image ? "interior-hero-split" : ""}`}>
      <div className="container interior-hero-inner">
        <div className="interior-hero-copy"><span className="eyebrow"><span className="eyebrow-line" />{eyebrow}</span><h1>{title}</h1><p>{description}</p>{children && <div className="interior-hero-actions">{children}</div>}</div>
        {image && <div className="interior-hero-image"><Image src={image} alt={imageAlt ?? "Illustrative pet care photograph"} fill sizes="(max-width: 900px) 100vw, 46vw" className="object-cover" priority /><span className="image-disclaimer">Illustrative demo imagery</span></div>}
      </div>
    </section>
  );
}

export function DemoNotice({ children }: { children: React.ReactNode }) {
  return <div className="demo-notice"><span className="demo-notice-dot" />{children}</div>;
}

export function BookingCta({ title = "Let’s make their next visit a little easier.", description = "Tell us about your pet and your preferred time. The team can follow up to discuss availability." }: { title?: string; description?: string }) {
  return (
    <section className="container booking-cta-wrap"><div className="booking-cta"><div className="booking-cta-decoration" aria-hidden="true">✳</div><div><span className="eyebrow eyebrow-light">HERE FOR YOUR PET</span><h2>{title}</h2><p>{description}</p></div><div className="booking-cta-actions"><Link href="/book-appointment" className="button button-cream"><CalendarDays size={18} /> Request a visit <ArrowRight size={16} /></Link><a href={business.phoneHref} className="button button-outline-light"><Phone size={17} /> Call {business.phone}</a></div></div></section>
  );
}

export function ContactActions({ subject = "my pet" }: { subject?: string }) {
  return <div className="contact-actions"><a href={business.phoneHref} className="button button-outline"><Phone size={17} /> Call the hospital</a><a href={whatsappUrl(`Hello Jawad Veterinary Hospital, I would like to enquire about ${subject}.`)} target="_blank" rel="noopener noreferrer" className="button button-outline"><MessageCircle size={17} /> Ask on WhatsApp</a></div>;
}
