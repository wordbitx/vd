import Link from "next/link";
import { ArrowUpRight, MapPin, Phone, Clock3, MessageCircle } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";
import { business, whatsappUrl } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand"><SiteLogo light /><p>Thoughtful veterinary care and everyday pet essentials, together in one convenient Lahore location.</p><span className="footer-small-label">HERE FOR THE PETS YOU LOVE.</span></div>
        <div className="footer-col"><h3>Explore</h3><Link href="/">Home</Link><Link href="/about">About Us</Link><Link href="/services">Veterinary Services</Link><Link href="/shop">Pet Shop</Link><Link href="/team">Our Team</Link><Link href="/gallery">Gallery</Link></div>
        <div className="footer-col"><h3>Pet care</h3><Link href="/book-appointment">Book an Appointment</Link><Link href="/services/general-consultation">General Consultation</Link><Link href="/services/vaccination-preventive-care">Preventive Care</Link><Link href="/shop?category=dog-food">Dog Food</Link><Link href="/shop?category=cat-food">Cat Food</Link><Link href="/blog">Pet Care Journal</Link></div>
        <div className="footer-col footer-contact"><h3>Visit & contact</h3><p><MapPin size={17} /><span>{business.address}</span></p><a href={business.phoneHref}><Phone size={17} /><span>{business.phone}</span></a><p><Clock3 size={17} /><span>{business.reportedHours}<br /><small>{business.hoursNote}</small></span></p><a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="footer-direction">Get directions <ArrowUpRight size={15} /></a><a href={whatsappUrl("Hello Jawad Veterinary Hospital, I would like to make an enquiry.")} target="_blank" rel="noopener noreferrer" className="footer-direction"><MessageCircle size={15} /> WhatsApp us <ArrowUpRight size={15} /></a></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Jawad Veterinary Hospital. Website preview for client review.</span><div><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms-and-conditions">Terms & Conditions</Link><Link href="/contact">Contact</Link></div></div>
    </footer>
  );
}
