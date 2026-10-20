"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, ShoppingBag, User, X } from "lucide-react";
import type { SessionUser } from "@/lib/types";
import { initials } from "@/lib/format";
import { useCart } from "@/components/cart-context";

export type NavLink = { href: string; label: string };

export function SiteHeader({
  links, user, announcement, announcementHref, phone, clinicName, monogram, tagline,
}: { links: NavLink[]; user: SessionUser | null; announcement?: string; announcementHref?: string; phone: string; clinicName: string; monogram: string; tagline: string }) {
  const pathname = usePathname();
  const { count: cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Subscribes to the scroll position; state only changes from the browser's callback.
    const onScroll = () => setScrolled(window.scrollY > 14);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="site-header" data-scrolled={scrolled ? "true" : "false"} style={scrolled ? { boxShadow: "0 10px 30px -22px rgba(7,26,32,.5)" } : undefined}>
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="row" style={{ gap: 18 }}>
            <span className="topbar-item">📍 Al Kabir Town, Main Raiwind Road, Lahore</span>
            <span className="topbar-sep hidden-sm" />
            <span className="topbar-item hidden-sm">Open till 11 pm · Home visits 24/7</span>
          </div>
          <div className="row" style={{ gap: 16 }}>
            {announcement ? (
              <Link className="topbar-item" href={announcementHref || "/"} style={{ color: "var(--brass-3)", fontWeight: 800 }}>
                ✦ {announcement}
              </Link>
            ) : null}
            <a className="topbar-item" href={`tel:${phone.replace(/\s/g, "")}`}><span style={{ color: "var(--brass-3)" }}>☏</span> {phone}</a>
          </div>
        </div>
      </div>

      <div className="container nav">
        <Link href="/" className="brand" aria-label={`${clinicName} — home`}>
          <span className="brand-mark"><span>{monogram}</span></span>
          <span className="brand-text">
            <b>{clinicName.replace(" Veterinary Hospital", "")}<span style={{ color: "var(--brass-2)" }}>.</span></b>
            <small>{tagline}</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href} data-active={isActive(link.href) ? "true" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link href="/cart" className="icon-btn" aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`} style={{ position: "relative" }}>
            <ShoppingBag size={17} />
            {cartCount > 0 ? (
              <span style={{ position: "absolute", top: -6, right: -6, minWidth: 17, height: 17, borderRadius: 99, background: "var(--brass)", color: "#241a08", fontSize: 10, fontWeight: 800, display: "grid", placeItems: "center", padding: "0 4px" }}>{cartCount}</span>
            ) : null}
          </Link>
          {user ? (
            <Link href={user.role === "customer" ? "/portal" : "/admin"} className="nav-account">
              <span className="avatar">{initials(user.name)}</span>
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link href="/login" className="button button-ghost button-sm">My portal</Link>
          )}
          <Link href="/book-vet-appointment-lahore" className="button button-primary button-lg">
            Book appointment <ArrowRight size={16} />
          </Link>
          <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Menu">
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <div className="mobile-nav" data-open={open ? "true" : "false"}>
        <div className="container mobile-nav-inner">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={closeMenu} data-active={isActive(link.href) ? "true" : undefined}>
              {link.label}
            </Link>
          ))}
          <div className="row" style={{ gap: 10, marginTop: 8 }}>
            <Link href={user ? (user.role === "customer" ? "/portal" : "/admin") : "/login"} className="button button-ghost" style={{ flex: 1 }}>
              <User size={16} /> {user ? "My account" : "Sign in"}
            </Link>
            <Link href="/cart" className="button button-ghost" style={{ flex: 1 }}>Basket ({cartCount})</Link>
          </div>
          <Link href="/book-vet-appointment-lahore" className="button button-primary button-block">Book appointment <ArrowRight size={16} /></Link>
        </div>
      </div>
      <style>{`.hidden-sm{display:inline-flex}@media(max-width:980px){.hidden-sm{display:none}}`}</style>
    </header>
  );
}
