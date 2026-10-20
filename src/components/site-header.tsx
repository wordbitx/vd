"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, CalendarDays, MapPin, Menu, Phone, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { SiteLogo } from "@/components/site-logo";
import { business } from "@/lib/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Veterinary Services" },
  { href: "/shop", label: "Pet Shop" },
  { href: "/team", label: "Our Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="site-header">
          <div className="topbar"><div className="container topbar-inner"><span><span className="topbar-sparkle">✦</span> Veterinary clinic &amp; pet food store · Al Kabir Town, Lahore</span><span className="topbar-location"><MapPin size={13} /> Food, accessories &amp; pet-care items in store</span></div></div>
        <div className="nav-wrap"><div className="container nav-inner">
          <SiteLogo />
          <nav className="desktop-nav" aria-label="Main navigation">{navLinks.map((link) => <Link key={link.href} href={link.href} className={isActive(link.href) ? "nav-active" : ""} aria-current={isActive(link.href) ? "page" : undefined}>{link.label}</Link>)}</nav>
          <div className="header-actions">
            <a href={business.phoneHref} className="header-phone" aria-label={`Call ${business.phone}`}><Phone size={17} /><span>{business.phone}</span></a>
            <Link href="/book-appointment" className="button button-primary header-book"><CalendarDays size={16} /><span>Book Appointment</span></Link>
            <Link href="/cart" className="cart-nav" aria-label={`Demo shopping cart, ${count} items`}><ShoppingBag size={21} strokeWidth={1.8} />{count > 0 && <span className="cart-badge">{count > 9 ? "9+" : count}</span>}</Link>
            <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>{open ? <X size={25} /> : <Menu size={25} />}</button>
          </div>
        </div></div>
        {open && <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
          <div className="container mobile-menu-inner">
            {navLinks.map((link) => <Link key={link.href} href={link.href} className={isActive(link.href) ? "mobile-active" : ""} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={16} /></Link>)}
            <Link href="/blog" onClick={() => setOpen(false)}>Pet Care Journal<ArrowUpRight size={16} /></Link>
            <div className="mobile-menu-cta"><a href={business.phoneHref} className="button button-outline"><Phone size={17} /> Call us</a><Link href="/book-appointment" className="button button-primary" onClick={() => setOpen(false)}><CalendarDays size={17} /> Book a visit</Link></div>
          </div>
        </nav>}
      </header>
      <div className="mobile-bottom-bar" aria-label="Quick contact actions"><a href={business.phoneHref}><Phone size={18} /> Call us</a><Link href="/book-appointment"><CalendarDays size={18} /> Book a visit</Link></div>
    </>
  );
}
