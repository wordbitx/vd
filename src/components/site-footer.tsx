import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";
import { business, whatsappUrl } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <SiteLogo light />
          <p>Premium veterinary care, a curated Pet Mall and gentle home visits — everything your pet needs, under one trusted roof in Lahore.</p>
          <span className="footer-small-label">HERE FOR THE PETS YOU LOVE.</span>
        </div>
        <div className="footer-col">
          <h3>Explore</h3>
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/services">Veterinary Services</Link>
          <Link href="/fees">Fees &amp; Pricing</Link>
          <Link href="/team">Our Team</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/blog">Events &amp; Tips</Link>
        </div>
        <div className="footer-col">
          <h3>Pet care &amp; portal</h3>
          <Link href="/book">Book an Appointment</Link>
          <Link href="/shop">Pet Mall · Shop Online</Link>
          <Link href="/adopt">Adopt a Pet</Link>
          <Link href="/login">Log In / Sign Up</Link>
          <Link href="/dashboard/pets">Digital Pet Passport</Link>
          <Link href="/dashboard">My Appointments &amp; Orders</Link>
          <Link href="/faqs">FAQs</Link>
        </div>
        <div className="footer-col footer-contact">
          <h3>Visit &amp; contact</h3>
          <p><MapPin size={17} /><span>{business.address}</span></p>
          <a href={business.phoneHref}><Phone size={17} /><span>{business.phone}</span></a>
          <a href={`mailto:${business.email}`}><Mail size={17} /><span>{business.email}</span></a>
          <p><Clock3 size={17} /><span>Open daily · 8:00 AM – 11:30 PM<br /><small>Emergency? Call any time — we will guide you.</small></span></p>
          <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="footer-direction">Get directions <ArrowUpRight size={15} /></a>
          <a href={whatsappUrl("Hello Jawad Veterinary Hospital, I would like to make an enquiry.")} target="_blank" rel="noopener noreferrer" className="footer-direction"><MessageCircle size={15} /> WhatsApp us <ArrowUpRight size={15} /></a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Jawad Veterinary Hospital · Al Kabir Town, Lahore.</span>
        <div>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
