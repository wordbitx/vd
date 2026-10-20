import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronRight, MessageCircle, Phone } from "lucide-react";
import { ServiceCard, ServiceIconView } from "@/components/cards";
import { DemoNotice, PageHero } from "@/components/page-parts";
import { business, services, whatsappUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return services.map((service) => ({ slug: service.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return service ? pageMetadata(`${service.title} in Lahore`, `${service.summary} Learn about ${service.title.toLowerCase()} and contact Jawad Veterinary Hospital to confirm availability.`, `/services/${slug}`, service.image) : {};
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  return <main id="main-content">
    <div className="container breadcrumbs"><Link href="/">Home</Link><ChevronRight size={13} /><Link href="/services">Services</Link><ChevronRight size={13} /><span>{service.title}</span></div>
    <PageHero eyebrow="VETERINARY CARE OPTION" title={service.title} description={service.summary} image={service.image} imageAlt={`Illustrative image for ${service.title}`}>
      <Link href={`/book-appointment?service=${service.slug}`} className="button button-primary"><CalendarDays size={17} /> Request a visit <ArrowRight size={16} /></Link><Link href="/services" className="button button-outline"><ArrowLeft size={16} /> All services</Link>
    </PageHero>
    <section className="detail-section"><div className="container detail-layout"><div className="detail-content"><DemoNotice>This is a proposed service page for the website preview. Please confirm availability, scope and any on-site facilities with the hospital before visiting.</DemoNotice><div className="detail-intro-icon"><ServiceIconView name={service.icon} size={28} /></div><span className="eyebrow"><span className="eyebrow-line" /> ABOUT THIS CARE OPTION</span><h2>Understanding {service.title.toLowerCase()}.</h2><p className="detail-lead">{service.overview}</p><div className="detail-divider" /><h3>What a visit may involve</h3><ul className="detail-check-list">{service.involves.map((item) => <li key={item}><span><Check size={15} /></span>{item}</li>)}</ul><div className="detail-info-grid"><div><h3>Who might it be for?</h3><p>{service.suitable}</p></div><div><h3>Before you come in</h3><p>{service.preparation}</p></div></div><p className="medical-caution">Information here is general and does not replace an individual veterinary examination or guarantee an outcome.</p></div><aside className="detail-sidebar"><span className="eyebrow">LET’S TALK ABOUT YOUR PET</span><h3>Start with a conversation.</h3><p>Tell the team what’s going on, then confirm the most helpful next step and a suitable time to visit.</p><Link href={`/book-appointment?service=${service.slug}`} className="button button-primary"><CalendarDays size={17} /> Request appointment</Link><a href={business.phoneHref} className="button button-outline"><Phone size={16} /> {business.phone}</a><a href={whatsappUrl(`Hello Jawad Veterinary Hospital, I would like to ask about ${service.title.toLowerCase()} for my pet.`)} target="_blank" rel="noopener noreferrer" className="sidebar-whatsapp"><MessageCircle size={17} /> Ask about this service on WhatsApp <ArrowRight size={15} /></a><small>Requests are not confirmed appointments. The hospital will need to accept your preferred time.</small></aside></div></section>
    <section className="related-section"><div className="container"><div className="section-header compact"><div><span className="eyebrow"><span className="eyebrow-line" /> KEEP EXPLORING</span><h2>Other care conversations.</h2></div><Link href="/services" className="text-link">All services <ArrowRight size={16} /></Link></div><div className="related-service-grid">{related.map((item) => <ServiceCard key={item.slug} service={item} />)}</div></div></section>
  </main>;
}
