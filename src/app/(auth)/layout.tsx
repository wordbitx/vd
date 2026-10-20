import Image from "next/image";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { business } from "@/lib/site";
import { getSettings } from "@/server/store";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  return (
    <div className="auth-wrap">
      <aside className="auth-side">
        <Image src="/images/hero-care.jpg" alt="" aria-hidden="true" fill sizes="45vw" className="object-cover" unoptimized priority />
        <Link href="/" className="brand" style={{ position: "relative", zIndex: 3 }}>
          <span className="brand-mark"><span>{settings?.monogram ?? business.monogram}</span></span>
          <span className="brand-text">
            <b style={{ color: "#f7f4ec" }}>{business.name}</b>
            <small style={{ color: "#8fa8ae" }}>{business.city} · since {business.established}</small>
          </span>
        </Link>
        <div className="auth-side-quote">
          “The record you can see is the record you can trust. Every visit, every vaccine, every batch number — in your portal, forever.”
          <div className="row" style={{ gap: 10, marginTop: 18, fontSize: 12.5, color: "#9db2b8", fontWeight: 700 }}>
            <span className="avatar">JH</span> Dr. Jawad Hussain · DVM (RVMP)
          </div>
        </div>
      </aside>
      <section className="auth-panel">
        <div className="col" style={{ gap: 22, width: "100%", maxWidth: 520 }}>
          <Link href="/" className="link-arrow" style={{ alignSelf: "flex-start" }}><ArrowLeft size={14} /> Back to the site</Link>
          {children}
        </div>
      </section>
    </div>
  );
}
