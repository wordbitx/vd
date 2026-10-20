import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs, EmergencyStrip, Eyebrow, WhatsAppButton } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
import { business } from "@/lib/site";
import { currentUser } from "@/server/auth";
import { getSettings } from "@/server/store";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Contact a vet in Lahore — call, WhatsApp or visit",
  "Contact Jawad Veterinary Hospital in Al Kabir Town, Lahore: phone, WhatsApp, email, opening hours, directions and a message form answered by the clinic.",
  "/contact-vet-lahore",
  "/images/clinic-interior.jpg",
);

export default async function ContactPage() {
  const [user, settings] = await Promise.all([currentUser().catch(() => null), getSettings()]);
  const tiles = [
    { icon: <Phone size={18} />, label: "Call the desk", value: settings.phone || business.phone, href: `tel:${(settings.phone || business.phone).replace(/\s/g, "")}`, note: "Urdu, Punjabi, English" },
    { icon: <MessageCircle size={18} />, label: "WhatsApp", value: "Chat with the clinic", href: `https://wa.me/${settings.whatsapp || business.whatsappNumber}`, note: "Fastest for photos of a wound or lump" },
    { icon: <Mail size={18} />, label: "Email", value: settings.email || business.email, href: `mailto:${settings.email || business.email}`, note: "Records, invoices and referrals" },
    { icon: <MapPin size={18} />, label: "Visit", value: business.shortAddress, href: business.mapsUrl, note: "Free street parking" },
  ];

  return (
    <>
      <section className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: "Contact" }]} />
          <div className="split">
            <div>
              <Eyebrow>Get in touch</Eyebrow>
              <h1 style={{ margin: "16px 0 16px", fontSize: "clamp(32px,4.4vw,56px)" }}>
                Talk to someone who has <em>actually seen the file.</em></h1>
              <p className="lead">
                The desk answers between 10 am and 11 pm; clinical questions are passed to the veterinarian on duty. If your pet is in
                danger, skip the form and call — we will triage on the phone and dispatch.
              </p>
              <div className="row" style={{ gap: 11, marginTop: 22 }}>
                <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="button button-primary button-lg"><Phone size={16} /> {business.phone}</a>
                <WhatsAppButton message="Assalam-o-Alaikum, I need to speak to the clinic." className="button button-ghost button-lg" label="WhatsApp instead" />
              </div>
            </div>
            <div className="figure figure-wide" style={{ boxShadow: "var(--shadow)" }}>
              <Image src="/images/clinic-interior.jpg" alt="Reception at Jawad Veterinary Hospital, Al Kabir Town" fill sizes="45vw" className="object-cover" priority unoptimized />
              <span className="figure-tag">Al Kabir Town · Town Gate 3</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="grid cols-4" style={{ gap: 12 }}>
            {tiles.map((tile) => (
              <a key={tile.label} href={tile.href} target={tile.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="card card-hover card-pad" style={{ display: "grid", gap: 8 }}>
                <span className="service-icon" style={{ width: 36, height: 36, marginBottom: 0 }}>{tile.icon}</span>
                <span className="tiny" style={{ fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-2)" }}>{tile.label}</span>
                <b style={{ fontSize: 14.5, letterSpacing: "-0.02em" }}>{tile.value}</b>
                <span className="tiny muted">{tile.note}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.05fr)", gap: 30, alignItems: "start" }}>
            <div className="card card-pad">
              <Eyebrow>Message the clinic</Eyebrow>
              <h2 style={{ margin: "12px 0 6px", fontSize: 26 }}>Ask before you travel.</h2>
              <p className="small muted" style={{ margin: "0 0 18px" }}>
                {user ? `Sending as ${user.name}. A veterinarian replies inside the portal within one working day.` : "No account needed. We reply on the number or email you give us."}
              </p>
              <ContactForm signedIn={!!user} />
            </div>

            <div className="col" style={{ gap: 16 }}>
              <div className="card" style={{ overflow: "hidden" }}>
                <div className="figure figure-wide" style={{ borderRadius: 0 }}>
                  <Image src="/images/hero-care.jpg" alt="Veterinarian with a dog and cat at the hospital" fill sizes="50vw" className="object-cover" unoptimized />
                </div>
                <div className="card-pad">
                  <h3 style={{ fontSize: 19 }}>Finding us</h3>
                  <p className="small muted" style={{ margin: "8px 0 14px" }}>{business.address}. Landmark: opposite the main gate market, Town Gate 3 — the blue sign with the paw. Plus code {business.plusCode}.</p>
                  <div className="row" style={{ gap: 10 }}>
                    <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="button button-primary button-sm">Directions <ArrowRight size={14} /></a>
                    <Link href="/gallery" className="button button-ghost button-sm">See the rooms</Link>
                  </div>
                </div>
              </div>
              <div className="card card-pad">
                <span className="row" style={{ gap: 9 }}><Clock size={17} style={{ color: "var(--brand)" }} /><h3 style={{ fontSize: 18 }}>Opening hours</h3></span>
                <div className="footer-hours" style={{ marginTop: 12, color: "var(--muted)" }}>
                  {business.hours.map((h) => (
                    <div key={h.day} style={{ borderColor: "var(--line)" }}><span>{h.day}</span><span style={{ color: "var(--ink)" }}>{h.hours}</span></div>
                  ))}
                </div>
                <p className="tiny muted" style={{ margin: "12px 0 0" }}>{settings.hoursNote}. Emergency home visits are dispatched at any hour.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingBottom: 48 }}>
        <div className="container"><EmergencyStrip settings={settings} /></div>
      </section>
    </>
  );
}
