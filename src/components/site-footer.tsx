import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import { business } from "@/lib/site";
import { FacebookIcon, InstagramIcon, MapsIcon, WhatsAppIcon } from "@/components/icons";
import type { Settings } from "@/lib/types";

export function SiteFooter({ settings, productCategories }: { settings?: Settings; productCategories?: { slug: string; name: string }[] }) {
  const clinicName = settings?.clinicName ?? business.name;
  const phone = settings?.phone ?? business.phone;
  const email = settings?.email ?? business.email;
  const year = new Date().getFullYear();
  const shortName = clinicName.replace(" Veterinary Hospital", "");
  const serviceLinks = [
    ["/services/general-checkup", "Routine Health Checks"],
    ["/services/vaccination", "Vaccinations"],
    ["/services/deworming", "Deworming & Parasites"],
    ["/services/dental", "Dental Care"],
    ["/services/surgery", "Minor Surgeries"],
    ["/services/emergency-care", "Emergency Care"],
  ];

  return (
    <>
      <section className="r-section r-footer-emergency" style={{ paddingTop: 0, paddingBottom: 28 }}>
        <div className="r-wrap">
          <div className="r-fe-card">
            <div>
              <h2>Pet Emergency?</h2>
              <p>Our team is ready to assist you 24/7 across Lahore.</p>
            </div>
            <div className="r-fe-actions">
              <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="r-btn r-btn-orange r-btn-lg"><Phone size={16} /> Call {phone}</a>
              <Link href="/book-vet-appointment-lahore" className="r-btn r-btn-white r-btn-lg">Book Regular Visit</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="r-footer">
        <div className="r-wrap">
          <div className="r-footer-grid">
            <div>
              <div className="r-brand">
                <span className="r-logo"><span>{settings?.monogram ?? business.monogram}</span></span>
                <span className="r-brand-text">
                  <b>{shortName}</b>
                  <small>Hospital, home visits &amp; pet mall</small>
                </span>
              </div>
              <p>
                Lahore&apos;s neighbourhood veterinary hospital and mobile vet team. Bringing professional, clinic-grade pet
                care directly to your doorstep — with compassion and expertise, at the hospital or at home.
              </p>
              <div className="r-socials">
                <a href="#" aria-label="Instagram"><InstagramIcon /></a>
                <a href="#" aria-label="Facebook"><FacebookIcon /></a>
                <a href={business.mapsUrl} target="_blank" rel="noreferrer" aria-label="Directions on Google Maps"><MapsIcon /></a>
                <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppIcon /></a>
              </div>
              <a className="r-review-us" href={business.mapsUrl} target="_blank" rel="noreferrer">
                <Star size={13} fill="currentColor" strokeWidth={0} /> Review us on Google Maps
              </a>
            </div>

            <nav aria-label="Our services">
              <h4>Our Services</h4>
              <div className="r-footer-links">
                {serviceLinks.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
                <Link href="/services">All Services</Link>
              </div>
            </nav>

            <nav aria-label="Quick links">
              <h4>Quick Links</h4>
              <div className="r-footer-links">
                <Link href="/about">About Us</Link>
                <Link href="/team">Our Team</Link>
                <Link href="/book-vet-appointment-lahore">Book Appointment</Link>
                <Link href="/pet-care-tips">Events &amp; Tips</Link>
                <Link href="/adopt">Adopt a Pet</Link>
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/terms-and-conditions">Terms of Service</Link>
                <Link href="/portal">My Portal</Link>
              </div>
            </nav>

            <div>
              <h4>Contact Us</h4>
              <div className="r-footer-contact">
                <div>
                  <Phone size={14} />
                  <span>
                    <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a><br />
                    <span className="r-footer-note">Available 24/7 for emergencies</span>
                  </span>
                </div>
                <div>
                  <Mail size={14} />
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
                <div>
                  <MapPin size={14} />
                  <span>{business.address}</span>
                </div>
                <div>
                  <Clock size={14} />
                  <span>
                    {business.hours[0].day}: {business.hours[0].hours}<br />
                    <span className="r-footer-note">Emergency: 24/7</span>
                  </span>
                </div>
              </div>
              {productCategories?.length ? (
                <div className="r-footer-cats">
                  {productCategories.slice(0, 4).map((c) => (
                    <Link key={c.slug} href={`/shop?category=${c.slug}`}>{c.name}</Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="r-footer-bottom">
            <span>© {year} {clinicName}. {business.registration}. Starting fees confirmed before treatment.</span>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/privacy-policy">Privacy</Link>
              <Link href="/terms-and-conditions">Terms</Link>
              <Link href="/slip">Verify a slip</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
