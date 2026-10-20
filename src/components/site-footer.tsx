import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { business, services } from "@/lib/site";
import { FacebookIcon, InstagramIcon, MapsIcon, WhatsAppIcon } from "@/components/icons";
import type { Settings } from "@/lib/types";

export function SiteFooter({ settings, productCategories }: { settings?: Settings; productCategories?: { slug: string; name: string }[] }) {
  const clinicName = settings?.clinicName ?? business.name;
  const phone = settings?.phone ?? business.phone;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-mark"><span>{settings?.monogram ?? business.monogram}</span></span>
              <span className="brand-text">
                <b>{clinicName}</b>
                <small>{business.descriptor}</small>
              </span>
            </div>
            <p className="footer-note">
              Veterinary hospital, home-visit service and pet mall in Al Kabir Town, Lahore. Consultations, vaccination,
              dentistry, surgery aftercare, diagnostics and everyday pet supplies — with records you can actually keep.
            </p>
            <div className="row" style={{ gap: 10 }}>
              <a className="button button-brass button-sm" href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent("Assalam-o-Alaikum, I need veterinary advice for my pet.")}`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> WhatsApp the clinic
              </a>
              <Link href="/book-vet-appointment-lahore" className="button button-outline-light button-sm">Book a visit <ArrowRight size={15} /></Link>
            </div>
            <div className="socials" style={{ marginTop: 6 }}>
              <a href={business.mapsUrl} target="_blank" rel="noreferrer" aria-label="Directions on Google Maps"><MapsIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
            </div>
          </div>

          <nav aria-label="Clinic">
            <h4>Clinic</h4>
            <div className="footer-links">
              {[["/about", "About the hospital"], ["/team", "Our veterinarians"], ["/gallery", "Clinic gallery"], ["/pet-care-tips", "Events & vet tips"], ["/adopt", "Adopt a pet"], ["/contact-vet-lahore", "Contact & directions"], ["/portal", "Client portal"], ["/shop", "Pet Mall"]].map(([href, label]) => (
                <Link key={href} href={href}>{label}</Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Services">
            <h4>Veterinary services</h4>
            <div className="footer-links">
              {services.slice(0, 8).map((service) => (
                <Link key={service.slug} href={`/services/${service.slug}`}>{service.shortTitle}</Link>
              ))}
              <Link href="/services" style={{ color: "var(--brass-3)", fontWeight: 700 }}>All services & fees →</Link>
            </div>
          </nav>

          <div>
            <h4>Visit or call</h4>
            <div className="footer-hours">
              <div><span><MapPin size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />Address</span><span style={{ textAlign: "right" }}>{business.shortAddress}</span></div>
              <div><span><Phone size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />Phone</span><span><a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a></span></div>
              <div><span><Mail size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />Email</span><span><a href={`mailto:${settings?.email ?? business.email}`}>{settings?.email ?? business.email}</a></span></div>
              {business.hours.map((h) => (
                <div key={h.day}><span>{h.day}</span><span>{h.hours}</span></div>
              ))}
            </div>
            {productCategories?.length ? (
              <div style={{ marginTop: 18 }}>
                <h4>Pet mall</h4>
                <div className="row" style={{ gap: 7 }}>
                  {productCategories.slice(0, 6).map((c) => (
                    <Link key={c.slug} href={`/shop?category=${c.slug}`} className="pill pill-dark" style={{ textTransform: "none", letterSpacing: 0, fontWeight: 650, fontSize: 11.5 }}>
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {clinicName}. {business.registration}. Prices shown are starting fees and confirmed before treatment.</span>
          <div className="row" style={{ gap: 16 }}>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-and-conditions">Terms</Link>
            <Link href="/slip/JVH">Verify a booking slip</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
