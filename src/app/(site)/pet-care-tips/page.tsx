import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Calendar, MapPin, Search } from "lucide-react";
import { EventCard, PostCard } from "@/components/cards";
import { WhatsAppIcon } from "@/components/icons";
import { business, events, faqs } from "@/lib/site";
import { catalogPosts } from "@/server/catalog";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Pet care tips & events in Lahore — written by our vets",
  "Practical guides from Jawad Veterinary Hospital: vaccination schedules, dental disease, parasite prevention, nutrition and what to do in an emergency. Plus free clinics and camps in Lahore.",
  "/pet-care-tips",
  "/images/consultation.jpg",
);

export default async function TipsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [{ category }, posts] = await Promise.all([searchParams, catalogPosts()]);
  const categories = [...new Set(posts.map((p) => p.category))];
  const visible = category ? posts.filter((p) => p.category === category) : posts;
  const [lead, ...rest] = visible;

  return (
    <>
      <section className="r-pagehero">
        <div className="r-wrap">
          <div className="r-crumbs">
            <Link href="/">Home</Link><span className="sep">/</span><span>Events &amp; Tips</span>
          </div>
          <div className="r-pagehero-inner r-pagehero-single" style={{ maxWidth: 840 }}>
            <div>
              <span className="label"><Calendar size={14} /> Community updates</span>
              <h1>Events &amp; Tips</h1>
              <p>
                Browse the latest events, daily insights and pet health tips from our veterinary experts — written or
                reviewed by our clinicians, with the caveats left in.
              </p>
              <div className="r-filters" style={{ marginTop: 22 }}>
                <Link href="/pet-care-tips" className="r-filter" data-active={!category ? "true" : undefined}>All topics</Link>
                {categories.map((c) => (
                  <Link key={c} href={`/pet-care-tips?category=${encodeURIComponent(c)}`} className="r-filter" data-active={category === c ? "true" : undefined}>
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {lead ? (
        <section className="r-section" style={{ paddingTop: 22 }}>
          <div className="r-wrap">
            <Link href={`/pet-care-tips/${lead.slug}`} className="r-panel" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.02fr) minmax(0,1fr)", overflow: "hidden", padding: 0 }}>
              <div style={{ position: "relative", minHeight: 340 }}>
                <Image src={lead.image} alt={lead.title} fill sizes="(max-width:900px) 100vw,50vw" className="object-cover" unoptimized />
                <span style={{ position: "absolute", top: 14, left: 14, padding: "5px 11px", borderRadius: 999, background: "rgba(255,255,255,.95)", color: "var(--r-teal)", fontSize: 9.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {lead.category}
                </span>
              </div>
              <div style={{ padding: "clamp(22px, 3vw, 38px)", display: "grid", alignContent: "center", gap: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 12, fontSize: 11.5, fontWeight: 700, color: "#8c9ba1" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <Calendar size={13} /> {new Date(`${lead.date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                  </span>
                  <span>·</span><span>{lead.readTime}</span>
                </span>
                <h2 style={{ margin: 0, fontSize: "clamp(24px,2.8vw,34px)" }}>{lead.title}</h2>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--r-muted)" }}>{lead.excerpt}</p>
                <span className="r-link">Read the full guide <ArrowRight size={15} /></span>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      <section className="r-section" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-rulehead"><h2>Latest from the clinic</h2></div>
          {rest.length ? (
            <div className="r-cards r-cards-4">
              {rest.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <div className="r-empty">
              <h3 style={{ margin: "0 0 8px" }}>Nothing else in this topic yet</h3>
              <p style={{ margin: "0 0 16px", color: "var(--r-muted)", fontSize: 13.5 }}>Pick another category, or ask us directly — advice on WhatsApp is free.</p>
              <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="r-btn r-btn-green">
                <WhatsAppIcon size={14} /> Ask a question
              </a>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
            <Link href="/book-vet-appointment-lahore" className="r-btn r-btn-teal"><Search size={14} /> Book a consult instead</Link>
          </div>
        </div>
      </section>

      <section className="r-section r-section-white" style={{ paddingTop: 0 }}>
        <div className="r-wrap">
          <div className="r-head-row">
            <div className="r-head">
              <span className="label"><MapPin size={14} /> At the clinic this season</span>
              <h2 style={{ marginTop: 10 }}>Free clinics &amp; vaccination camps</h2>
              <p>Community days across Lahore — screening is free, treatment is quoted first.</p>
            </div>
            <span className="r-chip r-chip-peach"><MapPin size={12} /> All in Lahore</span>
          </div>
          <div className="r-cards">
            {events.map((event) => <EventCard key={event.id} event={event} index={0} />)}
          </div>
          <div className="r-faq" style={{ marginTop: 26 }}>
            {[
              { q: "Do camps need an appointment?", a: "Yes for the wellness days — slots are limited so nobody queues with an anxious animal. WhatsApp the clinic and we will send a time." },
              { q: "Are camp fees different?", a: "Screening is free; treatment, vaccines and medicines are charged at the standard clinic rate, always quoted first." },
              { q: "Can I bring more than one pet?", a: "Up to three per family, but book each one separately so the veterinarian has a slot per patient." },
            ].map((item, i) => (
              <details key={item.q} open={i === 0}><summary>{item.q}</summary><div className="r-faq-body">{item.a}</div></details>
            ))}
          </div>
        </div>
      </section>

      <section className="r-section">
        <div className="r-wrap">
          <div className="r-grid-2" style={{ gap: 30, alignItems: "start" }}>
            <div>
              <span className="label">Read before you search</span>
              <h2 style={{ margin: "10px 0 12px" }}>The internet is not your veterinarian</h2>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "var(--r-muted)" }}>
                These guides are general education, not a diagnosis. Symptoms that overlap between twenty conditions need a
                physical examination and, often, a sample under a microscope. If your pet is unwell, book a consult — a
                30-minute visit is cheaper than a week of guessing.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                <Link href="/book-vet-appointment-lahore" className="r-btn r-btn-teal">Book a consult <ArrowRight size={14} /></Link>
                <Link href="/contact-vet-lahore" className="r-btn r-btn-outline">Ask a question</Link>
              </div>
            </div>
            <div className="r-faq">
              {faqs.slice(2, 6).map((faq, i) => (
                <details key={faq.q} open={i === 0}><summary>{faq.q}</summary><div className="r-faq-body">{faq.a}</div></details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
