"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, CalendarDays, Heart, LogIn, MapPin, Menu, Phone, PawPrint, ShieldCheck, ShoppingBag, Siren, UserRound, X } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { SiteLogo } from "@/components/site-logo";
import { business } from "@/lib/site";
import { initials } from "@/lib/format";
import type { User } from "@/lib/types";

const navLinks = [
  { href: "/shop", label: "Pet Mall" },
  { href: "/services", label: "Services" },
  { href: "/team", label: "Team" },
  { href: "/about", label: "About" },
  { href: "/adopt", label: "Adopt a Pet" },
  { href: "/blog", label: "Events & Tips" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { user: User | null }) => { if (!cancelled) setUser(data.user); })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const portalHref = user?.role === "admin" || user?.role === "vet" ? "/admin" : "/dashboard";

  return (
    <>
      <header className="site-header">
        <div className="topbar"><div className="container topbar-inner">
          <span><span className="topbar-sparkle">✦</span> Lahore&apos;s premium veterinary hospital · Hospital &amp; home visits</span>
          <span className="topbar-location"><MapPin size={13} /> Al Kabir Town, Main Raiwind Road · {business.phone}</span>
        </div></div>
        <div className="nav-wrap"><div className="container nav-inner">
          <SiteLogo />
          <nav className="desktop-nav" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={isActive(link.href) ? "nav-active" : ""} aria-current={isActive(link.href) ? "page" : undefined}>{link.label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            {user ? (
              <Link href={portalHref} className="header-account" aria-label="Open my portal">
                <span className="avatar-dot" aria-hidden="true">{initials(user.name)}</span>
                <span>{user.role === "customer" ? "My Portal" : "Admin Panel"}</span>
              </Link>
            ) : (
              <Link href="/login" className="header-login"><LogIn size={16} /><span>Log In</span></Link>
            )}
            <a href={business.phoneHref} className="button button-emergency header-emergency" aria-label={`Emergency call ${business.phone}`}><Siren size={15} /><span>Emergency</span></a>
            <Link href="/book" className="button button-gold header-book"><CalendarDays size={16} /><span>Book Now</span></Link>
            <Link href="/cart" className="cart-nav" aria-label={`Shopping cart, ${count} items`}><ShoppingBag size={21} strokeWidth={1.8} />{count > 0 && <span className="cart-badge">{count > 9 ? "9+" : count}</span>}</Link>
            <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>{open ? <X size={25} /> : <Menu size={25} />}</button>
          </div>
        </div></div>
        {open && <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
          <div className="container mobile-menu-inner">
            <span className="mobile-menu-section">Navigate</span>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={isActive(link.href) ? "mobile-active" : ""} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={16} /></Link>
            ))}
            <Link href="/fees" onClick={() => setOpen(false)}>Fees &amp; Pricing<ArrowUpRight size={16} /></Link>
            <Link href="/faqs" onClick={() => setOpen(false)}>FAQs<ArrowUpRight size={16} /></Link>
            <Link href="/gallery" onClick={() => setOpen(false)}>Gallery<ArrowUpRight size={16} /></Link>
            <span className="mobile-menu-section">Quick Actions</span>
            {user ? (
              <Link href={portalHref} onClick={() => setOpen(false)}><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><ShieldCheck size={16} /> {user.role === "customer" ? "My Portal & Pet Passport" : "Admin Panel"}</span><ArrowUpRight size={16} /></Link>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><UserRound size={16} /> Log In / Sign Up Free</span><ArrowUpRight size={16} /></Link>
            )}
            <Link href="/adopt" onClick={() => setOpen(false)}><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Heart size={16} /> Adopt a Pet</span><ArrowUpRight size={16} /></Link>
            <Link href="/dashboard/pets" onClick={() => setOpen(false)}><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><PawPrint size={16} /> Digital Pet Passport</span><ArrowUpRight size={16} /></Link>
            <div className="mobile-menu-cta">
              <a href={business.phoneHref} className="button button-emergency"><Phone size={16} /> Emergency</a>
              <Link href="/book" className="button button-gold" onClick={() => setOpen(false)}><CalendarDays size={16} /> Book Now</Link>
            </div>
          </div>
        </nav>}
      </header>
      <div className="mobile-bottom-bar" aria-label="Quick actions">
        <a href={business.phoneHref} className="emergency-link"><Siren size={18} /> Emergency</a>
        <Link href="/book"><CalendarDays size={18} /> Book Visit</Link>
      </div>
    </>
  );
}
