import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Award, BadgeCheck, Calendar, Languages, Phone } from "lucide-react";
import { Breadcrumbs, CheckList, Eyebrow, SectionHead } from "@/components/ui";
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
      <section className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: "Our team" }]} />
          <SectionHead eyebrow={`Our team · ${business.city}`} title="Meet Our Veterinary Team"
            lead="Dedicated professionals committed to delivering clinic-grade veterinary care directly to your doorstep — and in our Al Kabir Town hospital." />
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 8 }}>
        <div className="container">
          <article className="card" style={{ overflow: "hidden", display: "grid", gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)" }}>
            <div className="figure" style={{ borderRadius: 0, minHeight: 420 }}>
              <Image src={lead.image} alt={lead.name} fill sizes="40vw" className="object-cover" priority unoptimized />
              <span className="figure-ribbon">Lead veterinarian &amp; founder</span>
            </div>
            <div className="card-pad" style={{ display: "grid", gap: 16, alignContent: "center" }}>
              <div>
                <Eyebrow>{lead.credentials}</Eyebrow>
                <h1 style={{ fontSize: "clamp(28px,3.6vw,44px)", margin: "12px 0 8px" }}>{lead.name}</h1>
                <p className="muted small" style={{ margin: 0 }}>{lead.role}</p>
              </div>
              <p className="lead" style={{ fontSize: 16 }}>{lead.bio}</p>
              <CheckList items={lead.focus} />
              <div className="row" style={{ gap: 10, marginTop: 4 }}>
                <span className="pill pill-soft"><BadgeCheck size={13} /> RVMP registered</span>
                <span className="pill pill-soft"><Languages size={13} /> {lead.languages}</span>
                <span className="pill pill-soft"><Award size={13} /> {lead.years} years in practice</span>
              </div>
              <div className="row" style={{ gap: 10, marginTop: 6 }}>
                <Link href="/book-vet-appointment-lahore" className="button button-primary button-sm"><Calendar size={15} /> Book with {lead.name.split(" ")[1] ?? "the team"}</Link>
                <a href={business.phoneHref} className="button button-ghost button-sm"><Phone size={15} /> {business.phone}</a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Clinical & support team" title="Who else you will meet" />
          <div className="grid cols-3" style={{ marginTop: 26 }}>
            {rest.map((member) => (
              <article key={member.slug} id={member.slug} className="card card-hover" style={{ overflow: "hidden" }}>
                <div className="figure figure-ratio" style={{ borderRadius: 0 }}>
                  <Image src={member.image} alt={member.name} fill sizes="33vw" className="object-cover" unoptimized />
                </div>
                <div className="card-pad col" style={{ gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 21 }}>{member.name}</h3>
                    <p className="small muted" style={{ margin: "5px 0 0" }}>{member.role} · {member.credentials}</p>
                  </div>
                  <p className="small" style={{ margin: 0, color: "var(--ink-2)" }}>{member.bio}</p>
                  <div className="row" style={{ gap: 7 }}>
                    {member.focus.map((f) => <span key={f} className="pill pill-soft" style={{ textTransform: "none", letterSpacing: 0, fontWeight: 650, fontSize: 11 }}>{f}</span>)}
                  </div>
                  <span className="tiny muted">Languages: {member.languages} · {member.years} yrs experience</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="container">
          <div className="split">
            <div>
              <Eyebrow>Care standards</Eyebrow>
              <h2 style={{ margin: "14px 0 16px" }}>Handling rules <em>every shift follows.</em></h2>
              <CheckList items={[
                "No scruffing, no prong collars for restraint, no shouting in the cat room",
                "Pain assessed before and after every procedure — documented, not assumed",
                "Owners shown the cytology, the radiograph or the wound, not just told about it",
                "Every discharge note lists what to watch for and when to call back",
                "Referral is a plan, not a failure: we arrange it and share the records",
              ]} />
            </div>
            <div className="card card-pad" style={{ background: "linear-gradient(150deg,#f8f4ec,#fffdfa)" }}>
              <h3 style={{ fontSize: 19 }}>Working with the team</h3>
              <p className="small muted" style={{ margin: "8px 0 14px" }}>
                Named veterinarian on every booking, continuity in your portal, and a message thread that reaches the clinician who saw your pet.
              </p>
              <div className="col" style={{ gap: 10 }}>
                <Link href="/book-vet-appointment-lahore" className="button button-primary button-sm">Request a specific vet <ArrowRight size={14} /></Link>
                <Link href="/contact-vet-lahore" className="button button-ghost button-sm">Ask about a referral</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
