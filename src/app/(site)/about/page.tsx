import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Heart, Leaf, ShieldCheck, Sparkles, Stethoscope, Users } from "lucide-react";
import { business } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "About Jawad Veterinary Hospital — mobile vet care in Lahore",
  "Jawad Veterinary Hospital brings professional veterinary care to your doorstep in Lahore: home visits, a fully equipped hospital in Al Kabir Town, and honest advice.",
  "/about",
  "/images/clinic-interior.jpg",
);

const VALUES = [
  { icon: <Heart size={18} />, t: "Compassion", d: "We treat every pet with love, kindness and respect." },
  { icon: <Users size={18} />, t: "Customer Care", d: "A convenient, reliable and satisfying experience for every client." },
  { icon: <Leaf size={18} />, t: "Stress-Free Service", d: "Care in your pet's own environment, with less stress and less exposure to disease." },
  { icon: <Stethoscope size={18} />, t: "Professional Excellence", d: "Ethical, high-quality, evidence-based veterinary services." },
  { icon: <ShieldCheck size={18} />, t: "Trust & Transparency", d: "Honest communication, clear plans and dependable care." },
  { icon: <Sparkles size={18} />, t: "Animal Welfare", d: "The health, safety and well-being of every animal come first." },
];

export default function AboutPage() {
  return (
    <>
      <section className="r-pagehero">
        <div className="r-wrap">
          <div className="r-pagehero-inner r-pagehero-single">
            <div>
              <span className="label">About Us</span>
              <h1>Professional Veterinary Care,<br />Delivered to Your Doorstep Across Lahore.</h1>
              <p>
                {business.name} is a neighbourhood veterinary hospital and mobile team, dedicated to bringing professional
                animal healthcare directly to your doorstep. We believe pets deserve quality medical care without the stress
                and risk of unnecessary travel.
              </p>
              <p>
                Our veterinarians provide checkups, vaccinations, treatment, emergency care and consultations — at home, or in
                our fully equipped hospital in Al Kabir Town.
              </p>
              <p>
                Booking is quick and convenient through this website or over WhatsApp, so trusted veterinary care is available
                whenever you need it.
              </p>
              <p>
                Our mission is to make veterinary services more accessible, convenient and stress-free, while protecting the
                health and well-being of every animal we see.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 34 }}>
        <div className="r-wrap">
          <div className="r-grid-2" style={{ gap: "clamp(24px, 4vw, 56px)", alignItems: "start" }}>
            <div>
              <span className="r-kicker">Our Vision</span>
              <h2 className="r-sec-title" style={{ marginTop: 10 }}>Redefining Accessible Pet Care</h2>
              <p className="r-body-copy">
                Our vision is to provide stress-free, high-quality veterinary services at your doorstep, removing the need for
                animals to travel to clinics where they may be exposed to infectious diseases.
              </p>
              <p className="r-body-copy">
                We are committed to making professional care convenient, safe and accessible for every pet and livestock owner
                in Lahore and beyond — so better health and welfare reach more animals.
              </p>
            </div>
            <div>
              <span className="r-kicker">Our Journey</span>
              <h2 className="r-sec-title" style={{ marginTop: 10 }}>From a Simple Vision to Reality</h2>
              <p className="r-body-copy">
                {business.name} started in Lahore with a simple, powerful idea: make professional veterinary care more
                accessible, convenient and stress-free. We saw how much anxiety — and infection risk — comes from transporting
                pets to a clinic.
              </p>
              <p className="r-body-copy">
                So we built a doorstep service where qualified professionals visit animals at home, backed by our own hospital
                for surgery, imaging and everything a house call cannot do.
              </p>
              <p className="r-body-copy">
                From those beginnings, our work has been driven by animal welfare, customer satisfaction and steady
                improvement. Every visit reflects that — and our goal is to keep raising the standard of mobile vet care in
                Pakistan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section r-section-cream" style={{ paddingTop: 46 }}>
        <div className="r-wrap">
          <div style={{ maxWidth: 640 }}>
            <span className="r-kicker">Our Values</span>
            <h2 className="r-sec-title" style={{ marginTop: 10 }}>Guiding Everything We Do</h2>
            <p className="r-sec-lead">Our core values are the foundation of the service we provide.</p>
          </div>
          <div className="r-values">
            {VALUES.map((value) => (
              <div key={value.t} className="r-value">
                <span className="r-tile-icon">{value.icon}</span>
                <b>{value.t}</b>
                <span>{value.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 40, paddingBottom: 56 }}>
        <div className="r-wrap">
          <div className="r-legal">
            <div>
              <h3 className="r-subhead" style={{ margin: 0 }}>Legal Information</h3>
              <p className="r-muted-copy" style={{ margin: "6px 0 0" }}>How we handle your data, and the terms of using this site.</p>
            </div>
            <div className="r-band-actions">
              <Link href="/privacy-policy" className="r-btn r-btn-outline">Read Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="r-btn r-btn-outline">Read Terms of Service <ArrowRight size={13} /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
