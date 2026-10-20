"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone, ShoppingBag, Smartphone, User, X } from "lucide-react";
import type { SessionUser } from "@/lib/types";
import { useCart } from "@/components/cart-context";

export type NavLink = { href: string; label: string };

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
    <header className="vs-header">
      <div className="v-wrap vs-row">
        <Link href="/" className="vs-brand" aria-label={`${clinicName} — home`}>
          <span className="vs-logo"><span>{monogram}</span></span>
          <span className="vs-brand-text">
            <b>{shortName}</b>
            <small>Your neighbourhood vet team</small>
          </span>
        </Link>

        <nav className="vs-nav" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href} data-active={isActive(link.href) ? "true" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="vs-actions">
          <Link href="/portal" className="vs-link vs-link-getapp"><Smartphone size={15} /> Get App</Link>
          <Link href={accountHref} className="vs-link vs-link-login"><User size={15} /> {user ? user.name.split(" ")[0] : "Log In"}</Link>
          <Link href="/cart" className="vs-icon" aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}>
            <ShoppingBag size={18} />
            {cartCount > 0 ? <span className="vs-count">{cartCount}</span> : null}
          </Link>
          <a href={tel} className="vs-emergency"><Phone size={14} /> Emergency</a>
          <Link href="/book-vet-appointment-lahore" className="vs-book">Book Now</Link>
          <button className="vs-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <div className="vs-drawer" data-open={open ? "true" : "false"}>
        <div className="v-wrap vs-drawer-inner">
          <div>
            <div className="vs-drawer-label" style={{ marginBottom: 6 }}>Navigate</div>
            <div className="vs-drawer-links">
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={closeMenu} data-active={isActive(link.href) ? "true" : undefined}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="vs-drawer-label" style={{ marginBottom: 8 }}>Quick actions</div>
            <div className="vs-drawer-actions">
              <Link href="/portal" className="button button-ghost button-sm" onClick={closeMenu}><Smartphone size={14} /> Get App</Link>
              <Link href={accountHref} className="button button-ghost button-sm" onClick={closeMenu}><User size={14} /> {user ? "My account" : "Log In / Sign Up"}</Link>
              <Link href="/cart" className="button button-ghost button-sm" onClick={closeMenu}><ShoppingBag size={14} /> Basket ({cartCount})</Link>
            </div>
          </div>
          <div className="vs-drawer-cta">
            <a href={tel} className="vs-emergency"><Phone size={14} /> Emergency</a>
            <Link href="/book-vet-appointment-lahore" className="vs-book" onClick={closeMenu}>Book Now</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
