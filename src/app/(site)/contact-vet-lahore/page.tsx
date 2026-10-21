import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/icons";
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
  const phone = settings.phone || business.phone;
  const email = settings.email || business.email;
  const wa = settings.whatsapp || business.whatsappNumber;

  return (
    <>
      <section className="r-pagehero">
        <div className="r-wrap">
          <div className="r-crumbs">
            <Link href="/">Home</Link><span className="sep">/</span><span>Contact</span>
          </div>
          <div className="r-pagehero-inner">
            <div>
              <span className="label"><MessageCircle size={14} /> Get in touch</span>
              <h1>Contact Us</h1>
              <p>
                Have questions, or need to book a home vet visit in Lahore? We are available on WhatsApp, phone and email —
                usually replying within minutes. If your pet is in danger, skip the form and call; we will triage on the
                phone and dispatch.
              </p>
              <div className="r-pagehero-chips">
                <span className="r-chip r-chip-teal"><Clock size={12} /> Replies in under 5 minutes</span>
                <span className="r-chip r-chip-teal"><ShieldCheck size={12} /> 24/7 emergency line</span>
                <span className="r-chip r-chip-teal"><MapPin size={12} /> Al Kabir Town</span>
              </div>
              <div className="r-pagehero-actions">
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="r-btn r-btn-teal r-btn-lg"><Phone size={15} /> {phone}</a>
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="r-btn r-btn-green r-btn-lg">
                  <WhatsAppIcon size={15} /> WhatsApp us
                </a>
              </div>
            </div>
            <div className="r-pagehero-media" style={{ aspectRatio: "4 / 3.2" }}>
              <Image src="/images/clinic-interior.jpg" alt="Reception at Jawad Veterinary Hospital, Al Kabir Town" fill sizes="(max-width:900px) 92vw, 42vw" className="object-cover" priority unoptimized />
              <span className="r-media-tag">Al Kabir Town · Town Gate 3</span>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 24 }}>
        <div className="r-wrap">
          <div className="r-rulehead"><h2>Reach us directly</h2></div>
          <div className="r-tiles">
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="r-contact-tile">
              <span className="r-tile-icon"><WhatsAppIcon size={18} /></span>
              <b>WhatsApp</b>
              <span>+{wa}</span>
              <small><span className="r-pulse" style={{ background: "var(--r-green)" }} /> Typically replies in under 5 minutes</small>
            </a>
            <a href={`mailto:${email}`} className="r-contact-tile">
              <span className="r-tile-icon"><Mail size={18} /></span>
              <b>Email</b>
              <span>{email}</span>
              <small style={{ color: "var(--r-muted)" }}>Replies within 24 hours</small>
            </a>
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="r-contact-tile">
              <span className="r-tile-icon"><Phone size={18} /></span>
              <b>Emergency hotline · 24/7</b>
              <span>{phone}</span>
              <small style={{ color: "var(--r-orange)" }}>Available around the clock</small>
            </a>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-grid-2" style={{ alignItems: "start", gap: 24 }}>
            <div className="r-panel">
              <span className="r-kicker">Send us a message</span>
              <h2 style={{ margin: "10px 0 6px", fontSize: 27 }}>Ask before you travel</h2>
              <p style={{ margin: "0 0 18px", fontSize: 12.5, lineHeight: 1.65, color: "var(--r-muted)" }}>
                {user
                  ? `Sending as ${user.name}. A veterinarian replies inside the portal within one working day.`
                  : "No account needed. We reply on the number or email you give us — usually the same day."}
              </p>
              <ContactForm signedIn={!!user} />
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              <div className="r-panel">
                <span className="r-kicker">Follow us</span>
                <div className="r-socials2" style={{ marginTop: 12 }}>
                  <a href="#" aria-label="Instagram"><InstagramIcon size={14} /> Instagram</a>
                  <a href="#" aria-label="Facebook"><FacebookIcon size={14} /> Facebook</a>
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={14} /> WhatsApp</a>
                </div>
              </div>
              <div className="r-panel">
                <span className="r-kicker">Business hours</span>
                <div className="r-hours" style={{ marginTop: 10 }}>
                  {business.hours.map((h) => (
                    <div key={h.day} className="r-hours-row">
                      <b>{h.day}</b>
                      <span>{h.hours}</span>
                    </div>
                  ))}
                  <div className="r-hours-row is-emergency">
                    <b>Emergency services</b>
                    <span>24/7</span>
                  </div>
                </div>
                <p style={{ margin: "12px 0 0", fontSize: 11.5, color: "var(--r-muted)" }}>{settings.hoursNote}</p>
              </div>
              <div className="r-panel" style={{ overflow: "hidden", padding: 0 }}>
                <div style={{ position: "relative", aspectRatio: "16 / 9" }}>
                  <Image src="/images/hero-care.jpg" alt="Veterinarian with a dog and cat at the hospital" fill sizes="46vw" className="object-cover" unoptimized />
                </div>
                <div style={{ padding: 20 }}>
                  <b style={{ fontSize: 14 }}>Finding us</b>
                  <p style={{ margin: "6px 0 12px", fontSize: 12, lineHeight: 1.65, color: "var(--r-muted)" }}>
                    {business.address}. Landmark: opposite the main gate market, Town Gate 3 — the blue sign with the paw.
                    Plus code {business.plusCode}.
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="r-btn r-btn-teal r-btn-sm">Directions <ArrowRight size={13} /></a>
                    <Link href="/gallery" className="r-btn r-btn-outline r-btn-sm">See the rooms</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-band">
            <div>
              <span className="label" style={{ color: "#e7b39a" }}><Phone size={13} /> Pet emergency?</span>
              <h2>Don&apos;t wait — call the clinic now.</h2>
              <p>Our team is available 24/7 for critical cases and responds rapidly with life-saving equipment.</p>
            </div>
            <div className="r-band-actions">
              <a className="r-btn r-btn-orange r-btn-lg" href={`tel:${phone.replace(/[^\d+]/g, "")}`}><Phone size={15} /> Call {phone}</a>
              <Link href="/book-vet-appointment-lahore" className="r-btn r-btn-ghost-dark r-btn-lg">Book a regular visit</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
