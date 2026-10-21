import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Award, BadgeCheck, Calendar, Languages, Phone, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { TeamCard } from "@/components/cards";
import { WhatsAppIcon } from "@/components/icons";
import { business, team } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Our veterinarians in Lahore — DVM & RVMP registered",
  "Meet the Jawad Veterinary Hospital team: lead veterinarian Dr. Jawad Hussain, surgery, dermatology, dentistry and pharmacy leads in Al Kabir Town, Lahore.",
  "/team",
  "/images/team-vets.jpg",
);

export default function TeamPage() {
  const [lead, ...rest] = team;
  return (
    <>
      <section className="r-pagehero">
        <div className="r-wrap">
          <div className="r-crumbs">
            <Link href="/">Home</Link><span className="sep">/</span><span>Team</span>
          </div>
          <div className="r-pagehero-inner r-pagehero-single" style={{ maxWidth: 800 }}>
            <div>
              <span className="label"><Users size={14} /> {business.city} · Al Kabir Town</span>
              <h1>Meet Our Veterinary Team</h1>
              <p>
                Dedicated professionals committed to delivering clinic-grade veterinary care directly to your doorstep — and
                inside our Al Kabir Town hospital. Every clinician here answers the WhatsApp thread they are named in.
              </p>
              <div className="r-pagehero-chips">
                <span className="r-chip r-chip-teal"><BadgeCheck size={12} /> RVMP registered</span>
                <span className="r-chip r-chip-teal"><ShieldCheck size={12} /> Cold-chain certified</span>
                <span className="r-chip r-chip-teal"><Stethoscope size={12} /> Small animal specialists</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 22 }}>
        <div className="r-wrap">
          <article className="r-teamlead">
            <div className="r-teamlead-media">
              <Image src={lead.image} alt={lead.name} fill sizes="(max-width:860px) 100vw, 38vw" className="object-cover" priority unoptimized />
              <span className="r-teamlead-badge">Lead veterinarian &amp; founder</span>
            </div>
            <div className="r-teamlead-body">
              <span className="r-role">{lead.credentials} · {lead.years} years in practice</span>
              <h2>{lead.name}</h2>
              <p>{lead.bio}</p>
              <ul className="r-checks">
                {lead.focus.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="r-pagehero-chips">
                <span className="r-chip r-chip-peach"><BadgeCheck size={12} /> RVMP Registered</span>
                <span className="r-chip r-chip-peach"><Languages size={12} /> {lead.languages}</span>
                <span className="r-chip r-chip-peach"><Award size={12} /> DVM Certified</span>
              </div>
              <div className="r-teamlead-actions">
                <Link href="/book-vet-appointment-lahore" className="r-btn r-btn-teal"><Calendar size={15} /> Book with {lead.name.split(" ")[1] ?? "the team"}</Link>
                <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="r-btn r-btn-green"><WhatsAppIcon size={14} /> WhatsApp directly</a>
                <a href={business.phoneHref} className="r-btn r-btn-outline"><Phone size={14} /> {business.phone}</a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-rulehead"><h2>Clinical &amp; support team</h2></div>
          <div className="r-cards r-cards-3">
            {rest.map((member) => <TeamCard key={member.slug} member={member} />)}
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-grid-2" style={{ alignItems: "stretch", gap: 20 }}>
            <div className="r-panel">
              <span className="r-kicker">Care standards</span>
              <h2 style={{ margin: "10px 0 16px", fontSize: 26 }}>Handling rules every shift follows</h2>
              <ul className="r-checks">
                {[
                  "No scruffing, no prong collars for restraint, no shouting in the cat room",
                  "Pain assessed before and after every procedure — documented, not assumed",
                  "Owners shown the cytology, the radiograph or the wound, not just told about it",
                  "Every discharge note lists what to watch for and when to call back",
                  "Referral is a plan, not a failure: we arrange it and share the records",
                ].map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="r-panel-dark" style={{ alignContent: "center", display: "grid" }}>
              <span className="r-kicker" style={{ color: "#e7b39a" }}>Working with the team</span>
              <h2 style={{ margin: "10px 0 10px", fontSize: 26 }}>A named veterinarian on every booking</h2>
              <p style={{ margin: "0 0 18px", fontSize: 13.5, lineHeight: 1.7 }}>
                Continuity in your portal, and a message thread that reaches the clinician who saw your pet — not a call
                centre. Request a specific vet when you book and we will hold the slot for them.
              </p>
              <div className="r-band-actions">
                <Link href="/book-vet-appointment-lahore" className="r-btn r-btn-orange">Request a specific vet <ArrowRight size={14} /></Link>
                <Link href="/contact-vet-lahore" className="r-btn r-btn-ghost-dark">Ask about a referral</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-band">
            <div>
              <span className="r-kicker" style={{ color: "#e7b39a" }}>Join the practice</span>
              <h2>Hiring vets, technicians and pet-care assistants in Lahore.</h2>
              <p>
                Salaried positions in Al Kabir Town with a mobile roster, paid CPD and equipment you do not have to fight
                for. Tell us what you want to specialise in — we will build the list around it.
              </p>
            </div>
            <div className="r-band-actions">
              <Link href="/contact-vet-lahore" className="r-btn r-btn-orange">Apply to join <ArrowRight size={14} /></Link>
              <a href={business.phoneHref} className="r-btn r-btn-ghost-dark"><Phone size={14} /> {business.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
