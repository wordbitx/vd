"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight, CalendarDays, Clock, Download, Heart, Info, LogIn, Mail, MapPin,
  Menu, PawPrint, Phone, ShoppingBag, ShoppingCart, Sparkles, Stethoscope, Users,
  UserRound, X,
} from "lucide-react";
import type { SessionUser } from "@/lib/types";
import { useCart } from "@/components/cart-context";

export type NavLink = { href: string; label: string };

const ICONS: Record<string, React.ReactNode> = {
  "/shop": <ShoppingBag size={15} />,
  "/services": <Stethoscope size={15} />,
  "/team": <Users size={15} />,
  "/about": <Info size={15} />,
  "/contact-vet-lahore": <Mail size={15} />,
  "/adopt": <PawPrint size={15} />,
  "/pet-care-tips": <CalendarDays size={15} />,
};

export function SiteHeader({
  links, user, phone, clinicName, monogram, announcement, announcementHref, tagline,
}: {
  links: NavLink[];
  user: SessionUser | null;
  announcement?: string;
  announcementHref?: string;
  phone: string;
  clinicName: string;
  monogram: string;
  tagline: string;
}) {
  const pathname = usePathname();
  const { count: cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const shortName = clinicName.replace(" Veterinary Hospital", "");
  const tel = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const accountHref = user ? (user.role === "customer" ? "/portal" : "/admin") : "/login";
  const firstName = user?.name.split(" ")[0];

  return (
    <header className="r-header" data-scrolled={scrolled ? "true" : "false"} data-open={open ? "true" : "false"}>
      {/* hairline utility strip */}
      <div className="r-hd-strip">
        <div className="r-hd-strip-in">
          <span className="r-hd-strip-item">
            <MapPin size={11} aria-hidden="true" /> Al Kabir Town, Lahore
            <i aria-hidden="true">·</i> Est. 2026
          </span>
          <div className="r-hd-strip-right">
            <span className="r-hd-strip-item r-hd-strip-hours">
              <Clock size={11} aria-hidden="true" /> Mon–Sun · 9:00–21:00
            </span>
            <a href={tel} className="r-hd-strip-link"><Phone size={11} aria-hidden="true" /> {phone}</a>
            <a href={tel} className="r-hd-strip-em"><span className="r-pulse" aria-hidden="true" /> 24/7 Emergency</a>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="r-hd-bar">
        <div className="r-hd-bar-in">
          <Link href="/" className="r-brand" aria-label={`${clinicName} — home`}>
            <span className="r-logo"><span>{monogram}</span></span>
            <span className="r-brand-text">
              <b>{shortName}</b>
              <small>{tagline}</small>
            </span>
          </Link>

          <nav className="r-hd-nav" aria-label="Main">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="r-hd-link"
                data-active={isActive(link.href) ? "true" : undefined}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="r-hd-actions">
            <Link href="/cart" className="r-cart" aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}>
              <ShoppingCart size={17} />
              {cartCount > 0 ? <span className="r-cart-count">{cartCount}</span> : null}
            </Link>
            <span className="r-hd-divider" aria-hidden="true" />
            <Link href={accountHref} className="r-hd-login">
              <LogIn size={13} aria-hidden="true" /> {firstName ?? "Log In"}
            </Link>
            <Link href="/book-vet-appointment-lahore" className="r-hd-cta">
              Book a Visit <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="r-hd-burger"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {announcement ? (
        <Link href={announcementHref ?? "/book-vet-appointment-lahore"} className="r-hd-ribbon">
          <span className="r-hd-ribbon-star" aria-hidden="true">✦</span>
          <span>{announcement}</span>
          <ArrowUpRight size={12} aria-hidden="true" />
        </Link>
      ) : null}

      {/* mobile / compact drawer */}
      <div className="r-hd-drawer" data-open={open ? "true" : "false"}>
        <div className="r-hd-drawer-links">
          {links.map((link, i) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} data-active={isActive(link.href) ? "true" : undefined}>
              <i aria-hidden="true">{String(i + 1).padStart(2, "0")}</i>
              <span>{link.label}</span>
              <span className="r-hd-drawer-ico">{ICONS[link.href] ?? <Sparkles size={15} />}</span>
            </Link>
          ))}
        </div>
        <div className="r-hd-drawer-foot">
          <div className="r-hd-drawer-row">
            <a href={tel} className="r-hd-drawer-btn r-hd-drawer-btn-em"><Heart size={14} /> Emergency</a>
            <Link href="/book-vet-appointment-lahore" className="r-hd-drawer-btn r-hd-drawer-btn-book" onClick={() => setOpen(false)}>Book a Visit</Link>
          </div>
          <div className="r-hd-drawer-row">
            <Link href={accountHref} className="r-hd-drawer-link" onClick={() => setOpen(false)}><UserRound size={14} /> {user ? "My account" : "Log In / Sign Up"}</Link>
            <Link href="/cart" className="r-hd-drawer-link" onClick={() => setOpen(false)}><ShoppingCart size={14} /> Basket ({cartCount})</Link>
            <Link href="/portal" className="r-hd-drawer-link" onClick={() => setOpen(false)}><Download size={14} /> Get App</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
