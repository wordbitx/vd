import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, PawPrint, Phone } from "lucide-react";
import { business, whatsappUrl } from "@/lib/site";

export default function NotFound() {
  return (
    <main id="main-content" style={{ minHeight: "78vh", display: "grid", placeItems: "center", padding: "60px 20px" }}>
      <div className="container-tight center col" style={{ gap: 20, alignItems: "center" }}>
        <span className="brand-mark" style={{ width: 60, height: 60, borderRadius: 18 }}><PawPrint size={26} /></span>
        <span className="eyebrow eyebrow-plain">Error 404</span>
        <h1 style={{ fontSize: "clamp(34px,5vw,60px)", maxWidth: "16ch" }}>This page wandered <em>off the lead.</em></h1>
        <p className="muted" style={{ maxWidth: "52ch" }}>
          The page you were looking for is not here — but the clinic is. Try the services list, the pet mall, or your portal.
        </p>
        <div className="row" style={{ gap: 10, justifyContent: "center" }}>
          <Link href="/" className="button button-primary"><ArrowLeft size={16} /> Back to home</Link>
          <Link href="/services" className="button button-ghost">Browse services <ArrowRight size={16} /></Link>
          <Link href="/portal" className="button button-ghost">My portal</Link>
        </div>
        <div className="row" style={{ gap: 18, marginTop: 10, color: "var(--muted)", fontSize: 12.5, fontWeight: 700, justifyContent: "center" }}>
          <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="row" style={{ gap: 6 }}><Phone size={14} /> {business.phone}</a>
          <a href={whatsappUrl("Assalam-o-Alaikum, I need help finding something on your website.")} className="row" style={{ gap: 6 }} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={business.mapsUrl} className="row" style={{ gap: 6 }} target="_blank" rel="noreferrer"><MapPin size={14} /> Al Kabir Town</a>
        </div>
      </div>
    </main>
  );
}
