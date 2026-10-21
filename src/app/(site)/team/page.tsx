import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Calendar, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { WhatsAppIcon } from "@/components/icons";
import { business, team } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Meet our veterinarians in Lahore — DVM & RVMP registered",
  "Meet the lead veterinarian at Jawad Veterinary Hospital: DVM qualified, RVMP registered, and the team behind clinic-grade home visits across Lahore.",
  "/team",
  "/images/dr-jawad.jpg",
);

export default function TeamPage() {
  const lead = team[0];

  return (
    <>
      <PageHero
        variant="gradient"
        crumb="Team"
        title="Meet Our Veterinary Team"
        subtitle="Dedicated professionals committed to delivering clinic-grade veterinary care directly to your doorstep."
      />

      <section className="r-section" style={{ paddingTop: 40 }}>
        <div className="r-wrap">
          <article className="r-teamlead">
            <div className="r-teamlead-media">
              <span className="r-teamlead-badge"><BadgeCheck size={12} /> Lead Vet</span>
              <div className="r-teamlead-photo">
                <Image src={lead.image} alt={lead.name} fill sizes="(max-width:860px) 100vw, 38vw" className="object-cover" priority unoptimized />
              </div>
            </div>
            <div className="r-teamlead-body">
              <span className="r-eyebrow">Founder</span>
              <h2>{lead.name}</h2>
              <span className="r-role"><b>{lead.credentials}</b> <i>|</i> Lead Veterinarian</span>
              <p>{lead.bio}</p>

              <div className="r-teamlead-focus">
                <h3 className="r-subhead"><Sparkles size={12} /> Specialisations</h3>
                <div className="r-chips-row">
                  {lead.focus.map((item) => <span key={item} className="r-filter">{item}</span>)}
                </div>
              </div>

              <div className="r-creds-badges">
                <span><BadgeCheck size={13} /> DVM</span>
                <span><ShieldCheck size={13} /> RVMP Registered</span>
                <span><BadgeCheck size={13} /> Pakistan Veterinary Medical Council</span>
              </div>

              <div className="r-teamlead-actions">
                <Link href="/book-vet-appointment-lahore" className="r-btn r-btn-teal">
                  <Calendar size={15} /> Book with Dr. {lead.name.split(" ").slice(-1)[0]}
                </Link>
                <a
                  href={`https://wa.me/${business.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="r-btn r-btn-green"
                >
                  <WhatsAppIcon size={14} /> WhatsApp Direct
                </a>
              </div>
            </div>
          </article>

          <div className="r-panel r-creds" style={{ marginTop: 24 }}>
            <div className="r-head-row">
              <h3 className="r-subhead" style={{ margin: 0 }}><ShieldCheck size={12} /> Credentials &amp; Qualifications</h3>
              <Link href="/contact-vet-lahore" className="r-link">View Full CV <ArrowRight size={13} /></Link>
            </div>
            <div className="r-creds-rows">
              {[
                { k: "Education", v: "Doctor of Veterinary Medicine (DVM)" },
                { k: "Clinical Experience", v: `${lead.years} years · Al Kabir Town hospital and mobile practice` },
                { k: "Clinical Skills", v: lead.focus.join(", ") },
                { k: "Specialisation", v: "Small & large animal medicine, home visits" },
                { k: "Languages", v: lead.languages },
              ].map((row) => (
                <div key={row.k} className="r-creds-row">
                  <span>{row.k}</span>
                  <b>{row.v}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-band">
            <div>
              <h2>We&apos;re Growing</h2>
              <p>
                Interested in joining our mobile vet team? We are always looking for passionate veterinary professionals to
                join our mission.
              </p>
            </div>
            <div className="r-band-actions">
              <a href={`mailto:${business.email}?subject=Joining%20the%20team`} className="r-btn r-btn-orange r-btn-lg">
                <Mail size={15} /> Email us at {business.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
