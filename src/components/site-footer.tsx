import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { business, services } from "@/lib/site";
import { FacebookIcon, InstagramIcon, MapsIcon, WhatsAppIcon } from "@/components/icons";
import type { Settings } from "@/lib/types";

export function SiteFooter({ settings, productCategories }: { settings?: Settings; productCategories?: { slug: string; name: string }[] }) {
  const clinicName = settings?.clinicName ?? business.name;
  const phone = settings?.phone ?? business.phone;
  const email = settings?.email ?? business.email;
  const year = new Date().getFullYear();
  const shortName = clinicName.replace(" Veterinary Hospital", "");

  return (
    <footer className="vs-footer">
      <div className="v-wrap">
        <div className="vs-footer-grid">
          <div>
            <div className="vs-brand">
              <span className="vs-logo"><span>{settings?.monogram ?? business.monogram}</span></span>
              <span className="vs-brand-text">
                <b>{shortName}</b>
                <small>Hospital, home visits &amp; pet mall</small>
              </span>
            </div>
            <p>
              Clinic-grade veterinary care in Al Kabir Town and at your doorstep across Lahore. Consultations, vaccination,
              dentistry, diagnostics, surgery aftercare — plus a pet mall stocked by the same vets who treat your pet.
            </p>
            <div className="vs-footer-socials">
              <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp the clinic"><WhatsAppIcon /></a>
              <a href={business.mapsUrl} target="_blank" rel="noreferrer" aria-label="Directions on Google Maps"><MapsIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
            </div>
          </div>

          <nav aria-label="Explore">
            <h4>Explore</h4>
            <div className="vs-footer-links">
              <Link href="/shop">Pet Mall</Link>
              <Link href="/services">Veterinary Services</Link>
              <Link href="/team">Our Team</Link>
              <Link href="/about">About Us</Link>
              <Link href="/adopt">Adopt a Pet</Link>
              <Link href="/pet-care-tips">Events &amp; Tips</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/contact-vet-lahore">Contact</Link>
            </div>
          </nav>

          <nav aria-label="Clinic">
            <h4>Clinic</h4>
            <div className="vs-footer-links">
              <Link href="/book-vet-appointment-lahore">Book a Visit</Link>
              <Link href="/portal">My Portal</Link>
              <Link href="/login">Log In / Sign Up</Link>
              <Link href="/slip">Track a Booking Slip</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-and-conditions">Terms of Service</Link>
            </div>
            {productCategories?.length ? (
              <div className="vs-footer-cats">
                {productCategories.slice(0, 4).map((c) => (
                  <Link key={c.slug} href={`/shop?category=${c.slug}`}>{c.name}</Link>
                ))}
              </div>
            ) : null}
          </nav>

          <div>
            <h4>Visit or Call</h4>
            <div className="vs-footer-contact">
              <div><MapPin size={14} /><span>{business.address}</span></div>
              <div><Phone size={14} /><a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a></div>
              <div><Mail size={14} /><a href={`mailto:${email}`}>{email}</a></div>
              <div><Clock size={14} /><span>{business.hours[0].day}: {business.hours[0].hours}</span></div>
              <div><Clock size={14} /><span>Home-visit emergency: 24/7 across Lahore</span></div>
            </div>
            <div className="vs-footer-links" style={{ marginTop: 14 }}>
              <Link href="/book-vet-appointment-lahore" style={{ color: "#ecd7a9", fontWeight: 800 }}>Book a house call →</Link>
            </div>
          </div>
        </div>

        <div className="vs-footer-bottom">
          <span>© {year} {clinicName}. {business.registration}. Starting fees confirmed before treatment.</span>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-and-conditions">Terms</Link>
            <Link href="/slip">Verify a slip</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
