import Image from "next/image";
import RevealClient from "@/components/reveal";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, Clock, MapPin, Phone, Star } from "lucide-react";
import { business } from "@/lib/site";
import { money } from "@/lib/format";
import { WhatsAppIcon } from "@/components/icons";
import type { Settings } from "@/lib/types";

export function Eyebrow({ children, tone = "brass", line = true }: { children: ReactNode; tone?: "brass" | "light" | "muted"; line?: boolean }) {
  return <span className={`eyebrow${tone === "light" ? " eyebrow-light" : ""}${line ? "" : " eyebrow-plain"}`}>{children}</span>;
}

export function SectionHead({
  eyebrow, title, lead, align = "left", action, tone = "brass",
}: { eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; align?: "left" | "center"; action?: ReactNode; tone?: "brass" | "light" }) {
  return (
    <div className={`section-head${align === "center" ? " center" : " section-head-between"}`}>
      <div className="stack" style={{ gap: 14 }}>
        {eyebrow ? <Eyebrow tone={tone === "light" ? "light" : "brass"}>{eyebrow}</Eyebrow> : null}
        <h2>{title}</h2>
        {lead ? <p className={tone === "light" ? "muted" : undefined} style={tone === "light" ? { color: "#a9bcbf" } : undefined}>{lead}</p> : null}
      </div>
      {action ? <div className="row" style={{ gap: 10 }}>{action}</div> : null}
    </div>
  );
}

export function Figure({
  src, alt, ratio = "figure-ratio", className = "", priority = false, overlay, ribbon, sizes = "(max-width: 980px) 100vw, 45vw",
}: { src: string; alt: string; ratio?: string; className?: string; priority?: boolean; overlay?: ReactNode; ribbon?: ReactNode; sizes?: string }) {
  return (
    <div className={`figure ${ratio} ${className}`.trim()}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized />
      {ribbon ? <span className="figure-ribbon">{ribbon}</span> : null}
      {overlay}
    </div>
  );
}

export function Stars({ rating = 5, count }: { rating?: number; count?: number }) {
  return (
    <span className="stars" aria-label={`${rating.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={13} fill={i <= Math.round(rating) ? "currentColor" : "none"} strokeWidth={i <= Math.round(rating) ? 0 : 1.6} />
      ))}
      {count !== undefined ? <b>{count}</b> : null}
    </span>
  );
}

export function Price({ value, compareAt, label = "from" }: { value: number; compareAt?: number; label?: string }) {
  return (
    <span className="price">
      {label ? <small>{label}</small> : null}
      <b>{money(value)}</b>
      {compareAt && compareAt > value ? <s>{money(compareAt)}</s> : null}
    </span>
  );
}

export function Empty({ title, children, href, hrefLabel = "Browse services", icon }: { title: string; children?: ReactNode; href?: string; hrefLabel?: string; icon?: ReactNode }) {
  return (
    <div className="empty">
      {icon ?? <Check size={26} style={{ color: "var(--line-2)" }} />}
      <h3>{title}</h3>
      {children ? <p>{children}</p> : null}
      {href ? <Link href={href} className="button button-ghost button-sm">{hrefLabel} <ArrowRight size={15} /></Link> : null}
    </div>
  );
}

export function InfoRow({ label, value, href }: { label: string; value: ReactNode; href?: string }) {
  return (
    <div className="summary-row">
      <dt>{label}</dt>
      <dd>{href ? <Link href={href} className="link-arrow">{value} <ArrowRight size={14} /></Link> : value}</dd>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item) => (
        <span key={item.label} className="row" style={{ gap: 8 }}>
          <span>/</span>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span style={{ color: "var(--ink)" }}>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function EmergencyStrip({ settings, compact = false }: { settings?: Settings; compact?: boolean }) {
  const phone = settings?.emergencyLine ?? business.emergencyPhone;
  return (
    <div className="emergency no-print">
      <span className="emergency-icon"><Phone size={19} /></span>
      <div className="col" style={{ gap: 1 }}>
        <b>{compact ? "24/7 emergency line" : "Life-threatening emergency? Do not wait for an online form."}</b>
        <span>{compact ? "Rapid dispatch across Lahore" : "Call now — a veterinarian triages your case on the phone and dispatches immediately."}</span>
      </div>
      <span className="spacer" />
      <a className="button button-dark button-sm" href={`tel:${phone.replace(/\s/g, "")}`}>Call {phone}</a>
    </div>
  );
}

export function WhatsAppButton({ message, label = "Chat on WhatsApp", className = "button button-ghost button-sm", phone }: { message: string; label?: string; className?: string; phone?: string }) {
  const number = (phone ?? business.whatsappNumber).replace(/\D/g, "");
  return (
    <a className={className} href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
      <WhatsAppIcon /> {label}
    </a>
  );
}

export function ContactTiles({ settings }: { settings?: Settings }) {
  const tiles = [
    { icon: <MapPin size={19} />, title: "Visit the hospital", body: settings?.address ?? business.address, href: business.mapsUrl, cta: "Directions" },
    { icon: <Phone size={19} />, title: "Call the desk", body: `${settings?.phone ?? business.phone} · ${settings?.hoursNote ?? "Open till 11 pm"}`, href: `tel:${(settings?.phone ?? business.phone).replace(/\s/g, "")}`, cta: "Call now" },
    { icon: <Clock size={19} />, title: "Home-visit hours", body: "Slots from 10 am to 2 am, seven days a week across Lahore", href: "/book-vet-appointment-lahore", cta: "Book a slot" },
  ];
  return (
    <div className="grid cols-3">
      {tiles.map((tile) => (
        <a key={tile.title} className="card card-hover card-pad" href={tile.href} target={tile.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          <span className="service-icon">{tile.icon}</span>
          <h4>{tile.title}</h4>
          <p className="muted small" style={{ margin: "6px 0 12px" }}>{tile.body}</p>
          <span className="link-arrow">{tile.cta} <ArrowRight size={14} /></span>
        </a>
      ))}
    </div>
  );
}

export function Divider({ label }: { label?: string }) {
  return label ? (
    <div className="row" style={{ gap: 14, color: "var(--muted-2)" }}>
      <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
      <span className="tiny" style={{ fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
    </div>
  ) : (
    <hr />
  );
}

export function CheckList({ items, tone = "brand" }: { items: ReactNode[]; tone?: "brand" | "light" }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: tone === "light" ? "#c8d6d9" : "var(--ink-2)" }}>
          <span style={{ flex: "none", width: 18, height: 18, borderRadius: 6, display: "grid", placeItems: "center", background: tone === "light" ? "rgba(255,255,255,.1)" : "var(--brand-tint)", color: tone === "light" ? "var(--brass-3)" : "var(--brand)", marginTop: 2 }}>
            <Check size={12} strokeWidth={3} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <RevealClient className={className} delay={delay}>{children}</RevealClient>;
}
