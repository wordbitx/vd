import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Mail, Music2, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { business } from "@/lib/site";
import { currentUser } from "@/server/auth";
import { getSettings } from "@/server/store";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Contact a vet in Lahore — WhatsApp, email or call",
  "Contact Jawad Veterinary Hospital in Al Kabir Town, Lahore: WhatsApp, email, the 24/7 emergency hotline, business hours and a message form.",
  "/contact-vet-lahore",
  "/images/clinic-interior.jpg",
);

function ReachCard({
  icon, title, value, note, href, noteIcon, noteTone,
}: {
  icon: ReactNode; title: string; value: string; note: string; href: string; noteIcon?: ReactNode; noteTone?: "green" | "muted" | "orange";
}) {
  return (
    <a href={href} className="r-contact-tile" target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      <span className="r-tile-icon">{icon}</span>
      <b>{title}</b>
      <span className="r-contact-value">{value}</span>
      <small style={{ color: noteTone === "orange" ? "var(--r-orange)" : noteTone === "muted" ? "var(--r-muted)" : "var(--r-green)" }}>
        {noteIcon} {note}
      </small>
    </a>
  );
}

export default async function ContactPage() {
  const [user, settings] = await Promise.all([currentUser().catch(() => null), getSettings()]);
  const phone = settings.phone || business.phone;
  const email = settings.email || business.email;
  const wa = settings.whatsapp || business.whatsappNumber;
  const tel = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      <section className="r-pagehero">
        <div className="r-wrap">
          <div className="r-pagehero-inner r-pagehero-single">
            <div>
              <span className="label">Get In Touch</span>
              <h1>Contact {business.name}</h1>
              <p>
                Have questions? Need to book a home vet visit in Lahore? We&apos;re available via WhatsApp, email and social
                media — typically responding within minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 34 }}>
        <div className="r-wrap">
          <h2 className="r-sec-title">Reach Us Directly</h2>
          <div className="r-tiles">
            <ReachCard
              icon={<WhatsAppIcon size={18} />}
              title="WhatsApp"
              value={`+${wa}`}
              note="Typically replies in under 5 minutes"
              noteIcon={<span className="r-pulse" style={{ background: "var(--r-green)", boxShadow: "0 0 0 3px rgba(47,156,80,.18)", width: 6, height: 6 }} />}
              href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi! I have a question about ${business.name}.`)}`}
            />
            <ReachCard
              icon={<Mail size={18} />}
              title="Email"
              value={email}
              note="Replies within 24 hours"
              noteTone="muted"
              href={`mailto:${email}`}
            />
            <ReachCard
              icon={<Phone size={18} />}
              title="Emergency Hotline 24/7"
              value={phone}
              note="Available around the clock"
              noteTone="orange"
              href={tel}
            />
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-grid-2" style={{ gap: 20, alignItems: "stretch" }}>
            <div className="r-panel">
              <h3 className="r-subhead" style={{ margin: 0 }}>Follow Us</h3>
              <div className="r-socials2" style={{ marginTop: 14 }}>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramIcon size={14} /> Instagram
                </a>
                <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <Music2 size={14} /> TikTok
                </a>
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <WhatsAppIcon size={14} /> WhatsApp
                </a>
              </div>
            </div>

            <div className="r-panel">
              <h3 className="r-subhead" style={{ margin: 0 }}>Business Hours</h3>
              <div className="r-hours" style={{ marginTop: 10 }}>
                {business.hours.map((h) => (
                  <div key={h.day} className="r-hours-row">
                    <b>{h.day}</b>
                    <span>{h.hours}</span>
                  </div>
                ))}
                <div className="r-hours-row is-emergency">
                  <b>Emergency Services</b>
                  <span>24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-panel r-contact-form">
            <h2 className="r-sec-title" style={{ margin: 0 }}>Send Us a Message</h2>
            <p className="r-muted-copy" style={{ margin: "8px 0 20px" }}>
              Fill out the form below and you will be redirected to WhatsApp to send your message directly to our team.
            </p>
            <ContactForm signedIn={!!user} />
          </div>
        </div>
      </section>
    </>
  );
}
