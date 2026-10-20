"use client";

import Link from "next/link";
import { CalendarPlus, MessageCircle, Printer, ShoppingBag } from "lucide-react";

export function PrintButton({ label = "Print / Save PDF" }: { label?: string }) {
  return (
    <button type="button" className="button button-primary" onClick={() => window.print()}>
      <Printer size={16} /> {label}
    </button>
  );
}

export function BookingSlipActions({ whatsappText, showPortal }: { whatsappText: string; showPortal: boolean }) {
  return (
    <div className="slip-actions no-print">
      <PrintButton label="Print booking slip" />
      <a className="button button-whatsapp" href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={16} /> Share on WhatsApp
      </a>
      {showPortal
        ? <Link className="button button-outline" href="/dashboard/appointments">View in my portal</Link>
        : <Link className="button button-outline" href="/login?mode=signup&redirectTo=/dashboard/appointments">Create free account to track</Link>}
      <Link className="button button-outline" href="/book"><CalendarPlus size={16} /> Book another visit</Link>
    </div>
  );
}

export function OrderSlipActions({ whatsappText, showPortal }: { whatsappText: string; showPortal: boolean }) {
  return (
    <div className="slip-actions no-print">
      <PrintButton label="Print invoice" />
      <a className="button button-whatsapp" href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={16} /> Share on WhatsApp
      </a>
      {showPortal && <Link className="button button-outline" href="/dashboard/orders">Track in my portal</Link>}
      <Link className="button button-outline" href="/shop"><ShoppingBag size={16} /> Continue shopping</Link>
    </div>
  );
}
