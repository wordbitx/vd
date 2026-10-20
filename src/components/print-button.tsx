"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print or save PDF", className = "button button-dark button-sm" }: { label?: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.print()}>
      <Printer size={15} /> {label}
    </button>
  );
}
