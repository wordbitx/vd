import Link from "next/link";
import { BadgePercent, Banknote, CalendarDays, Home, Hospital, ShieldCheck, Smartphone, Truck } from "lucide-react";
import { BookingCta, PageHero } from "@/components/page-parts";
import { feeSchedule } from "@/lib/catalog";
import { pkr } from "@/lib/format";
import { getSettings } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Vet Fees & Pricing in Lahore", "Transparent, honest pricing at Jawad Veterinary Hospital — visiting charges, vaccinations, diagnostics, dental and more. No hidden charges, ever.", "/fees");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function FeesPage() {
  const settings = getSettings();
  return (
    <main id="main-content">
      <PageHero
        eyebrow="TRANSPARENT PRICING"
        title="Premium care. Honest, published fees."
        description="We believe luxury in veterinary care means no surprises. These are the indicative fees our team works to — your final fee is always confirmed with you before any treatment begins."
        image="/images/care-consultation.jpg"
        imageAlt="A veterinarian consulting with a pet parent"
      >
        <Link href="/book" className="button button-primary"><CalendarDays size={17} /> Book an appointment</Link>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> VISITING CHARGES</span>
              <h2>Simple, flat visiting fees.</h2>
              <p>The visiting charge covers the consultation and examination. Medicines, vaccines and procedures are quoted separately from the schedule below — always with your approval first.</p>
            </div>
          </div>
          <div className="services-index-grid">
            <div className="portal-card">
              <span className="lr-icon"><Hospital size={20} /></span>
              <h3 style={{ margin: "12px 0 6px" }}>At the hospital</h3>
              <p className="card-sub">Al Kabir Town, Main Raiwind Road, Lahore — with your daily token number on the booking slip.</p>
              <div className="fee-line"><span>Standard visit</span><strong>{pkr(settings.hospitalVisitFee)}</strong></div>
              <div className="fee-line"><span>Emergency visit</span><strong>{pkr(settings.emergencyHospitalFee)}</strong></div>
            </div>
            <div className="portal-card">
              <span className="lr-icon"><Home size={20} /></span>
              <h3 style={{ margin: "12px 0 6px" }}>At your home</h3>
              <p className="card-sub">Our vet visits you anywhere in Lahore — ideal for nervous pets, newborn litters and mobility issues.</p>
              <div className="fee-line"><span>Standard visit</span><strong>{pkr(settings.homeVisitFee)}</strong></div>
              <div className="fee-line"><span>Emergency visit</span><strong>{pkr(settings.emergencyHomeFee)}</strong></div>
            </div>
            <div className="portal-card">
              <span className="lr-icon"><Truck size={20} /></span>
              <h3 style={{ margin: "12px 0 6px" }}>Pet Mall delivery</h3>
              <p className="card-sub">Doorstep delivery of food, litter and essentials across Lahore from our online Pet Mall.</p>
              <div className="fee-line"><span>Delivery fee</span><strong>{pkr(settings.deliveryFee)}</strong></div>
              <div className="fee-line"><span>Free above</span><strong>{pkr(settings.freeDeliveryAbove)} orders</strong></div>
            </div>
          </div>
        </div>
      </section>

      {feeSchedule.map((group, index) => (
        <section className="section" style={{ paddingTop: index === 0 ? 0 : undefined }} key={group.title}>
          <div className="container">
            <div className="section-header compact">
              <div>
                <span className="eyebrow"><span className="eyebrow-line" /> {group.note.toUpperCase()}</span>
                <h2>{group.title}</h2>
              </div>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Service</th><th>Indicative fee</th><th>What&apos;s included</th></tr></thead>
                <tbody>
                  {group.rows.map((row) => (
                    <tr key={row.service}>
                      <td><span className="cell-strong">{row.service}</span></td>
                      <td><span className="cell-strong" style={{ color: "var(--gold-dark, #8a6d2f)" }}>{row.fee}</span></td>
                      <td style={{ minWidth: 320 }}>{row.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container">
          <div className="portal-card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
            <div>
              <span className="lr-icon"><Banknote size={20} /></span>
              <h3 style={{ margin: "12px 0 6px" }}>Pay how you like</h3>
              <p className="card-sub" style={{ margin: 0 }}>Cash, bank transfer, Easypaisa and JazzCash are accepted for visits and Pet Mall orders. Cash on delivery available online.</p>
            </div>
            <div>
              <span className="lr-icon"><Smartphone size={20} /></span>
              <h3 style={{ margin: "12px 0 6px" }}>Quoted before treatment</h3>
              <p className="card-sub" style={{ margin: 0 }}>For surgery and extended treatment, you receive a clear estimate in advance. No work begins without your go-ahead.</p>
            </div>
            <div>
              <span className="lr-icon"><ShieldCheck size={20} /></span>
              <h3 style={{ margin: "12px 0 6px" }}>No hidden charges</h3>
              <p className="card-sub" style={{ margin: 0 }}>Indicative ranges cover typical cases. If your pet&apos;s condition needs more, the doctor discusses options and costs with you first.</p>
            </div>
            <div>
              <span className="lr-icon"><BadgePercent size={20} /></span>
              <h3 style={{ margin: "12px 0 6px" }}>Litters &amp; rescues</h3>
              <p className="card-sub" style={{ margin: 0 }}>Ask about litter discounts for puppy/kitten series and special consideration for rescued animals via our adoption board.</p>
            </div>
          </div>
        </div>
      </section>

      <BookingCta title="Know the cost before you come in." description="Book online in three simple steps — your booking slip shows the exact visiting charges, token number and appointment details." />
    </main>
  );
}
