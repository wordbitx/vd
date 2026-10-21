import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Clock, Mail, Music2, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
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
      <span className="r-contact-copy">
        <b>{title}</b>
        <span className="r-contact-value">{value}</span>
        <small className={`r-contact-note is-${noteTone ?? "green"}`}>
          {noteIcon} {note}
        </small>
      </span>
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
      <PageHero
        variant="dark"
        crumb="Contact"
        eyebrow="Get In Touch"
        title={`Contact ${business.name}`}
        subtitle="Have questions? Need to book a home vet visit in Lahore? We're available via WhatsApp, email and social media — typically responding within minutes."
      />

      <section className="r-contact-main">
        <div className="r-wrap">
          <div className="r-contact-grid">
            {/* left rail: the three reach tiles, socials and hours */}
            <div className="r-contact-col">
              <h2 className="r-contact-h">Reach Us Directly</h2>
              <div className="r-tiles r-tiles-contact">
                <ReachCard
                  icon={<WhatsAppIcon size={17} />}
                  title="WhatsApp"
                  value={`+${wa}`}
                  note="Typically replies in under 5 minutes"
                  noteIcon={<span className="r-pulse" />}
                  href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi! I have a question about ${business.name}.`)}`}
                />
                <ReachCard
                  icon={<Mail size={17} />}
                  title="Email"
                  value={email}
                  note="Replies within 24 hours"
                  noteTone="muted"
                  href={`mailto:${email}`}
                />
                <ReachCard
                  icon={<Phone size={17} />}
                  title="Emergency Hotline 24/7"
                  value={phone}
                  note="Available around the clock"
                  noteTone="orange"
                  href={tel}
                />
              </div>

              <div className="r-contact-panel">
                <h3 className="r-contact-sub">Follow Us</h3>
                <div className="r-socials2">
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <InstagramIcon size={13} /> Instagram
                  </a>
                  <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                    <Music2 size={13} /> TikTok
                  </a>
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <WhatsAppIcon size={13} /> WhatsApp
                  </a>
                </div>
              </div>

              <div className="r-contact-panel">
                <h3 className="r-contact-sub"><Clock size={12} /> Business Hours</h3>
                <div className="r-hours">
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

            {/* right: the WhatsApp message form */}
            <div className="r-contact-col">
              <h2 className="r-contact-h">Send Us a Message</h2>
              <div className="r-contact-form">
                <p className="r-muted-copy" style={{ margin: "0 0 18px" }}>
                  Fill out the form below and you will be redirected to WhatsApp to send your message directly to our team.
                </p>
                <ContactForm signedIn={!!user} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
