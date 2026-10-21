"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays, Download, LogIn, Mail, Menu, PawPrint, ShoppingBag, ShoppingCart,
  Sparkles, Stethoscope, Users, UserRound, X, Info, Heart,
} from "lucide-react";
import type { SessionUser } from "@/lib/types";
import { useCart } from "@/components/cart-context";

export type NavLink = { href: string; label: string };

const ICONS: Record<string, React.ReactNode> = {
  "/shop": <ShoppingBag size={13} />,
  "/services": <Stethoscope size={13} />,
  "/team": <Users size={13} />,
  "/about": <Info size={13} />,
  "/contact-vet-lahore": <Mail size={13} />,
  "/adopt": <PawPrint size={13} />,
  "/pet-care-tips": <CalendarDays size={13} />,
};

export function SiteHeader({
  links, user, phone, clinicName, monogram,
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

  const closeMenu = () => setOpen(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const shortName = clinicName.replace(" Veterinary Hospital", "");
  const tel = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const accountHref = user ? (user.role === "customer" ? "/portal" : "/admin") : "/login";

  return (
    <header className="r-header">
      <div className="r-topbar">
        <div className="r-wrap r-topbar-row">
          <Link href="/" className="r-brand" aria-label={`${clinicName} — home`}>
            <span className="r-logo"><span>{monogram}</span></span>
            <span className="r-brand-text">
              <b>{shortName}</b>
              <small>Your neighbourhood vet team</small>
            </span>
          </Link>

          <div className="r-top-actions">
            <Link href="/portal" className="r-pill r-pill-getapp"><Download size={14} /> Get App</Link>
            <Link href="/cart" className="r-cart" aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}>
              <ShoppingCart size={18} />
              {cartCount > 0 ? <span className="r-cart-count">{cartCount}</span> : null}
            </Link>
            <Link href={accountHref} className="r-pill r-pill-login"><LogIn size={14} /> {user ? user.name.split(" ")[0] : "Log In"}</Link>
            <a href={tel} className="r-pill r-pill-emergency"><span className="r-pulse" /> Emergency</a>
            <Link href="/book-vet-appointment-lahore" className="r-pill r-pill-book"><CalendarDays size={14} /> Book Now</Link>
            <button className="r-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </div>

      <nav className="r-navbar" aria-label="Main">
        <div className="r-wrap r-navbar-inner">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="r-navlink" data-active={isActive(link.href) ? "true" : undefined}>
              {ICONS[link.href] ?? <Sparkles size={13} />} {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="r-drawer" data-open={open ? "true" : "false"}>
        <div className="r-wrap r-drawer-inner">
          <div className="r-drawer-links">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMenu} data-active={isActive(link.href) ? "true" : undefined}>
                {ICONS[link.href] ?? <Sparkles size={13} />} {link.label}
              </Link>
            ))}
          </div>
          <div className="r-drawer-actions">
            <Link href="/portal" className="r-btn r-btn-outline r-btn-sm" onClick={closeMenu}><Download size={14} /> Get App</Link>
            <Link href={accountHref} className="r-btn r-btn-outline r-btn-sm" onClick={closeMenu}><UserRound size={14} /> {user ? "My account" : "Log In / Sign Up"}</Link>
            <Link href="/cart" className="r-btn r-btn-outline r-btn-sm" onClick={closeMenu}><ShoppingCart size={14} /> Basket ({cartCount})</Link>
          </div>
          <div className="r-drawer-actions">
            <a href={tel} className="r-btn r-btn-orange r-btn-sm" style={{ flex: 1 }}><Heart size={14} /> Emergency</a>
            <Link href="/book-vet-appointment-lahore" className="r-btn r-btn-teal r-btn-sm" style={{ flex: 1 }} onClick={closeMenu}>Book Now</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
