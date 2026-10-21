import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, CheckCircle2, Clock, Home, Mail, PawPrint, Phone, ShieldCheck, Stethoscope, Truck } from "lucide-react";
import { ServiceGlyph, WhatsAppIcon } from "@/components/icons";
import { business, fees } from "@/lib/site";
import { pkrLabel } from "@/lib/format";
import { catalogServices } from "@/server/catalog";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Veterinary services in Lahore — fees & what's included",
  "Consultations, vaccination, deworming, dentistry, surgery aftercare, lab tests, grooming and 24/7 emergency home visits. Starting fees for each service, itemised before you book.",
  "/services",
  "/images/consultation.jpg",
);

export default async function ServicesPage() {
  const services = await catalogServices();

  return (
    <>
      <section className="r-pagehero">
        <div className="r-wrap">
          <div className="r-crumbs">
            <Link href="/">Home</Link><span className="sep">/</span><span>Services</span>
          </div>
          <div className="r-pagehero-inner">
            <div>
              <span className="label"><Stethoscope size={14} /> Lahore · hospital &amp; mobile clinic</span>
              <h1>Veterinary Services in Lahore</h1>
              <p>
                Clinic-grade home vet care across all areas of Lahore, and a fully equipped hospital in Al Kabir Town for
                surgery, dentistry and diagnostics. Every fee below is the starting professional fee; the home-visit charge
                and anything else is itemised before treatment starts.
              </p>
              <div className="r-pagehero-chips">
                <span className="r-chip r-chip-teal"><Home size={12} /> Home visits</span>
                <span className="r-chip r-chip-teal"><Stethoscope size={12} /> Hospital consults</span>
                <span className="r-chip r-chip-teal"><ShieldCheck size={12} /> RVMP registered</span>
                <span className="r-chip r-chip-teal"><BadgeCheck size={12} /> Printed slip every time</span>
              </div>
              <div className="r-pagehero-actions">
                <Link href="/book-vet-appointment-lahore" className="r-btn r-btn-teal r-btn-lg">Book a service <ArrowRight size={15} /></Link>
                <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="r-btn r-btn-outline r-btn-lg">
                  <WhatsAppIcon size={15} /> Not sure? Ask us
                </a>
              </div>
            </div>
            <div className="r-pagehero-media">
              <Image src="/images/hero-care.jpg" alt="Veterinarian examining a dog at Jawad Veterinary Hospital" fill sizes="(max-width:900px) 92vw, 42vw" className="object-cover" priority unoptimized />
              <span className="r-media-tag">Everything here is done in-house, or with a partner lab we trust.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 30 }}>
        <div className="r-wrap">
          <div className="r-tiles r-tiles-4">
            {[
              { icon: <Home size={18} />, t: "Home visits", d: "16 areas across Lahore, 10 am – 2 am" },
              { icon: <Stethoscope size={18} />, t: "Hospital consults", d: `Walk-in & scheduled from ${pkrLabel(fees.visitClinic)}` },
              { icon: <ShieldCheck size={18} />, t: "Cold-chain vaccines", d: "Batch logged, card issued every time" },
              { icon: <PawPrint size={18} />, t: "All species", d: "Dogs, cats, rabbits, birds, reptiles" },
            ].map((item) => (
              <div key={item.t} className="r-tile">
                <span className="r-tile-icon">{item.icon}</span>
                <b>{item.t}</b>
                <span>{item.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-rulehead"><h2>Explore our services</h2></div>
          <div className="r-cards">
            {services.map((service) => (
              <article key={service.slug} className="r-svc2">
                <div className="r-svc2-top">
                  <span className="r-svc2-icon"><ServiceGlyph icon={service.icon} size={21} /></span>
                  <span className="r-chip r-chip-teal"><Clock size={11} /> {service.duration}</span>
                </div>
                <h3>{service.shortTitle}</h3>
                <p>{service.summary}</p>
                <div className="r-svc2-meta">
                  <span><Home size={12} /> {service.homeAvailable ? "Home or hospital" : "Hospital"}</span>
                  <span><BadgeCheck size={12} /> Records in portal</span>
                </div>
                <div className="r-svc2-foot">
                  <span className="r-svc2-price"><small>From</small><b>{pkrLabel(service.price)}</b></span>
                  <span className="r-svc2-actions">
                    <Link href={`/services/${service.slug}`} className="r-btn r-btn-outline">Learn More</Link>
                    <Link href={`/book-vet-appointment-lahore?service=${service.slug}`} className="r-btn r-btn-teal">
                      Book Now <ArrowRight size={12} />
                    </Link>
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="r-note r-note-info" style={{ marginTop: 22 }}>
            <CheckCircle2 size={15} />
            <span>
              Home visit charge: {pkrLabel(fees.visitHomeStandard)} standard · {pkrLabel(fees.visitHomeEmergency)} for emergency
              or night dispatch. No advance payment — you pay after the consultation.
            </span>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-band">
            <div>
              <span className="label" style={{ color: "#e7b39a" }}><Phone size={13} /> Life-threatening emergency?</span>
              <h2>Don&apos;t book — call immediately.</h2>
              <p>
                Our rapid response team is available 24/7 for critical cases. If your pet is struggling to breathe, bleeding,
                collapsing or straining to urinate, call the clinic now.
              </p>
            </div>
            <div className="r-band-actions">
              <a className="r-btn r-btn-orange r-btn-lg" href={`tel:${business.phone.replace(/[^\d+]/g, "")}`}>
                <Phone size={15} /> {business.phone}
              </a>
              <a className="r-btn r-btn-ghost-dark r-btn-lg" href={`mailto:${business.email}`}>
                <Mail size={15} /> Email the clinic
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section r-section-white" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-tiles">
            {[
              { icon: <Truck size={18} />, t: "Same-day dispatch", d: "Booked before 4 pm, seen the same evening across Lahore." },
              { icon: <ShieldCheck size={18} />, t: "Itemised, not estimated", d: "Travel, medicines and lab work quoted before anything begins." },
              { icon: <BadgeCheck size={18} />, t: "Records you keep", d: "Every visit, vaccine and prescription filed in your portal." },
            ].map((item) => (
              <div key={item.t} className="r-tile">
                <span className="r-tile-icon">{item.icon}</span>
                <b>{item.t}</b>
                <span>{item.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
