import Link from "next/link";
import { HeartHandshake, Plus, ShieldCheck } from "lucide-react";
import { AdoptBoard } from "@/components/adopt-board";
import { BookingCta, PageHero } from "@/components/page-parts";
import { listAdoptions } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Adopt a Pet in Lahore", "Meet vaccinated cats, dogs and rabbits looking for forever homes through Jawad Veterinary Hospital's free community adoption board.", "/adopt", "/images/pets/lilly.jpg");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function AdoptPage() {
  const pets = listAdoptions(["available"]);
  return (
    <main id="main-content">
      <PageHero
        eyebrow="FREE ADOPTION BOARD"
        title="Some of the best souls are still waiting for home."
        description="Every pet below is listed by a verified Jawad Veterinary Hospital customer and reviewed by our team. Adoption is always free — we simply connect good pets with good people, and your first checkup with us is on the house."
        image="/images/pets/lilly.jpg"
        imageAlt="A white Persian cat waiting to be adopted"
      >
        <Link href="/login?redirectTo=/dashboard/adopt" className="button button-gold"><Plus size={16} /> Post a pet for adoption</Link>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> WAITING FOR YOU</span>
              <h2>Meet them today.</h2>
              <p>Tap a pet to view their full profile, or WhatsApp the family directly. When you adopt, bring your new companion to Jawad for a complimentary first health check and a Digital Pet Passport.</p>
            </div>
          </div>
          <AdoptBoard pets={pets} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="portal-card" style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <span className="lr-icon" style={{ width: 56, height: 56, borderRadius: 16 }}><ShieldCheck size={26} /></span>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h3 style={{ margin: "0 0 6px", fontFamily: "var(--display)", fontSize: 22, color: "var(--forest)" }}>Adopting responsibly</h3>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: "#5f6b73" }}>
                A pet is a 10–18 year commitment of food, vet care, time and love. We encourage a meeting before you decide, and we&apos;re happy to examine any listed pet at the hospital so you adopt with full confidence. <HeartHandshake size={14} style={{ verticalAlign: -2 }} />
              </p>
            </div>
            <Link href="/faqs" className="button button-outline">Adoption FAQs</Link>
          </div>
        </div>
      </section>

      <BookingCta title="Found your new best friend?" description="Book their complimentary first checkup and get a Digital Pet Passport with vaccination tracking, free with every adoption." />
    </main>
  );
}
