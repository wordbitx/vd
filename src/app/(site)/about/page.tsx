import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Heart, Leaf, ShieldCheck, Sparkles, Stethoscope, Users } from "lucide-react";
import { business } from "@/lib/site";
import { PageHero } from "@/components/page-hero";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "About Jawad Veterinary Hospital — mobile vet care in Lahore",
  "Jawad Veterinary Hospital brings professional veterinary care to your doorstep in Lahore: home visits, a fully equipped hospital in Al Kabir Town, and honest advice.",
  "/about",
  "/images/clinic-interior.jpg",
);

const VALUES = [
  { icon: <Heart size={18} />, tone: "rose", t: "Compassion", d: "We treat every pet with love, kindness and respect." },
  { icon: <Users size={18} />, tone: "blue", t: "Customer Care", d: "A convenient, reliable and satisfying experience for every client." },
  { icon: <Leaf size={18} />, tone: "amber", t: "Stress-Free Service", d: "Care in your pet's own environment, with less stress and less exposure to disease." },
  { icon: <Stethoscope size={18} />, tone: "teal", t: "Professional Excellence", d: "Ethical, high-quality, evidence-based veterinary services." },
  { icon: <ShieldCheck size={18} />, tone: "violet", t: "Trust & Transparency", d: "Honest communication, clear plans and dependable care." },
  { icon: <Sparkles size={18} />, tone: "green", t: "Animal Welfare", d: "The health, safety and well-being of every animal come first." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        variant="sage"
        crumb="About"
        eyebrow="About Us"
        title={<>Professional Veterinary Care,<br />Delivered to Your Doorstep <em>Across Lahore.</em></>}
        subtitle={`${business.name} brings professional animal healthcare directly to your doorstep — home visits across the city, backed by our fully equipped hospital in Al Kabir Town.`}
      />

      <section className="r-about-intro">
        <div className="r-wrap">
          <div className="r-about-card">
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
            <p className="r-about-mission">
              Our mission is to make veterinary services more accessible, convenient and stress-free, while protecting the
              health and well-being of every animal we see.
            </p>
          </div>
        </div>
      </section>

      <section className="r-section r-about-story">
        <div className="r-wrap">
          <div className="r-story">
            <div className="r-story-vision">
              <span className="r-story-tag">Our Vision</span>
              <h2>Redefining Accessible Pet Care</h2>
              <p>
                Our vision is to provide stress-free, high-quality veterinary services at your doorstep, removing the need for
                animals to travel to clinics where they may be exposed to infectious diseases.
              </p>
              <p>
                We are committed to making professional care convenient, safe and accessible for every pet and livestock owner
                in Lahore and beyond — so better health and welfare reach more animals.
              </p>
            </div>
            <div className="r-story-journey">
              <span className="r-story-tag">Our Journey</span>
              <h2>From a Simple Vision to Reality</h2>
              <p>
                {business.name} started in Lahore with a simple, powerful idea: make professional veterinary care more
                accessible, convenient and stress-free. We saw how much anxiety — and infection risk — comes from transporting
                pets to a clinic.
              </p>
              <p>
                So we built a doorstep service where qualified professionals visit animals at home, backed by our own hospital
                for surgery, imaging and everything a house call cannot do.
              </p>
              <p>
                From those beginnings, our work has been driven by animal welfare, customer satisfaction and steady
                improvement. Every visit reflects that — and our goal is to keep raising the standard of mobile vet care in
                Pakistan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="r-about-values">
        <div className="r-wrap">
          <div className="r-about-head">
            <span className="r-eyebrow">Our Values</span>
            <h2>Guiding Everything We Do</h2>
            <p>At {business.name}, our core values are the foundation of exceptional veterinary care.</p>
          </div>
          <div className="r-values">
            {VALUES.map((value) => (
              <div key={value.t} className={`r-value r-value--${value.tone}`}>
                <span className="r-value-icon">{value.icon}</span>
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
