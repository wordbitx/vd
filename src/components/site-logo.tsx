import Link from "next/link";
import { PawPrint, Plus } from "lucide-react";

export function SiteLogo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`site-logo ${light ? "site-logo-light" : ""}`} aria-label="Jawad Veterinary Hospital home">
      <span className="logo-symbol" aria-hidden="true"><PawPrint size={27} strokeWidth={2.2} /><span className="logo-plus"><Plus size={11} strokeWidth={3.4} /></span></span>
      <span className="logo-words"><strong>Jawad<span className="logo-dot">.</span></strong><small>VETERINARY HOSPITAL</small></span>
    </Link>
  );
}
