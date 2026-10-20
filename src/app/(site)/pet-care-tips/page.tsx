import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Breadcrumbs, Eyebrow, SectionHead } from "@/components/ui";
import { EventCard, PostCard } from "@/components/cards";
import { events, faqs } from "@/lib/site";
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
      <section className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: "Events & tips" }]} />
          <SectionHead
            eyebrow="Journal · vet-written"
            title={<>Advice that survives <em>contact with a real pet.</em></>}
            lead="Every guide here is written or reviewed by our clinicians, with the caveats left in — because “it depends” is often the honest answer."
          />
          <div className="chip-row" style={{ marginTop: 22 }}>
            <Link href="/pet-care-tips" className="chip" data-active={!category ? "true" : undefined}>All topics</Link>
            {categories.map((c) => <Link key={c} href={`/pet-care-tips?category=${encodeURIComponent(c)}`} className="chip" data-active={category === c ? "true" : undefined}>{c}</Link>)}
          </div>
        </div>
      </section>

      {lead ? (
        <section className="section-tight" style={{ paddingTop: 14 }}>
          <div className="container">
            <Link href={`/pet-care-tips/${lead.slug}`} className="card card-hover" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,1fr)", overflow: "hidden" }}>
              <div className="figure figure-wide" style={{ borderRadius: 0, minHeight: 340, position: "relative" }}>
                <Image src={lead.image} alt={lead.title} fill sizes="(max-width:900px) 100vw,50vw" className="object-cover" unoptimized />
                <span className="figure-ribbon">{lead.category}</span>
              </div>
              <div className="card-pad" style={{ display: "grid", alignContent: "center", gap: 12 }}>
                <span className="row" style={{ gap: 12, color: "var(--muted-2)", fontSize: 12, fontWeight: 700 }}>
                  <span className="row" style={{ gap: 5 }}><Calendar size={13} /> {new Date(`${lead.date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</span>
                  <span>·</span><span>{lead.readTime}</span>
                </span>
                <h2 style={{ fontSize: "clamp(24px,3vw,34px)" }}>{lead.title}</h2>
                <p className="muted" style={{ margin: 0 }}>{lead.excerpt}</p>
                <span className="link-arrow">Read the full guide <ArrowRight size={15} /></span>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="grid cols-3">
            {rest.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="container">
          <SectionHead eyebrow="At the clinic this season" title={<>Free clinics &amp; <em>vaccination camps.</em></>} action={<span className="pill pill-brass"><MapPin size={13} /> All in Lahore</span>} />
          <div className="grid cols-3" style={{ marginTop: 26 }}>
            {events.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
          </div>
          <div className="grid cols-3" style={{ marginTop: 30 }}>
            {[
              { q: "Do camps need an appointment?", a: "Yes for the wellness days — slots are limited so nobody queues with an anxious animal. WhatsApp the clinic and we will send a time." },
              { q: "Are camp fees different?", a: "Screening is free; treatment, vaccines and medicines are charged at the standard clinic rate, always quoted first." },
              { q: "Can I bring more than one pet?", a: "Up to three per family, but book each one separately so the veterinarian has a slot per patient." },
            ].map((item) => (
              <div key={item.q} className="card card-pad">
                <b style={{ fontSize: 14.5 }}>{item.q}</b>
                <p className="small muted" style={{ margin: "7px 0 0" }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid cols-2" style={{ gap: 34, alignItems: "start" }}>
          <div>
            <Eyebrow>Read before you search</Eyebrow>
            <h2 style={{ margin: "12px 0 12px" }}>The internet is not your <em>veterinarian.</em></h2>
            <p className="muted">
              These guides are general education, not a diagnosis. Symptoms that overlap between twenty conditions need a physical
              examination and, often, a sample under a microscope. If your pet is unwell, book a consult — a 30-minute visit is cheaper
              than a week of guessing.
            </p>
            <div className="row" style={{ gap: 10, marginTop: 18 }}>
              <Link href="/book-vet-appointment-lahore" className="button button-primary button-sm">Book a consult <ArrowRight size={14} /></Link>
              <Link href="/contact-vet-lahore" className="button button-ghost button-sm">Ask a question</Link>
            </div>
          </div>
          <div className="faq">
            {faqs.slice(2, 6).map((faq) => (
              <details key={faq.q}><summary>{faq.q}</summary><div className="faq-body"><p>{faq.a}</p></div></details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
