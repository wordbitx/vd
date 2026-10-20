import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Calendar, Clock, Stethoscope } from "lucide-react";
import { Breadcrumbs, Eyebrow, SectionHead, WhatsAppButton } from "@/components/ui";
import { PostCard } from "@/components/cards";
import { business } from "@/lib/site";
import { catalogPosts } from "@/server/catalog";
import { pageMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = (await catalogPosts()).find((p) => p.slug === slug);
  if (!post) return { title: "Guide not found" };
  return pageMetadata(post.title, post.excerpt, `/pet-care-tips/${post.slug}`, post.image);
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const posts = await catalogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Organization", name: business.name },
    publisher: { "@type": "Organization", name: business.name },
  };

  return (
    <>
      <section className="page-head" style={{ paddingBottom: 0 }}>
        <div className="container-narrow">
          <Breadcrumbs items={[{ label: "Events & tips", href: "/pet-care-tips" }, { label: post.category }]} />
          <Eyebrow>{post.category} · reviewed by a veterinarian</Eyebrow>
          <h1 style={{ margin: "14px 0 14px", fontSize: "clamp(30px,4vw,48px)" }}>{post.title}</h1>
          <div className="row" style={{ gap: 16, color: "var(--muted)", fontSize: 12.5, fontWeight: 700, marginBottom: 26 }}>
            <span className="row" style={{ gap: 6 }}><Calendar size={14} /> {new Date(`${post.date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</span>
            <span className="row" style={{ gap: 6 }}><Clock size={14} /> {post.readTime}</span>
            <span className="row" style={{ gap: 6 }}><Stethoscope size={14} /> Jawad clinical team</span>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="container-narrow">
          <div className="figure figure-wide" style={{ boxShadow: "var(--shadow)", marginBottom: 30 }}>
            <Image src={post.image} alt={post.title} fill sizes="(max-width:900px) 100vw,760px" className="object-cover" priority unoptimized />
          </div>
          <article className="prose">
            <p className="lead" style={{ color: "var(--ink)" }}>{post.excerpt}</p>
            {post.body.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {(section.paragraphs ?? []).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                {section.bullets?.length ? (
                  <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                ) : null}
              </section>
            ))}
            <div className="card card-pad" style={{ marginTop: 30, background: "linear-gradient(150deg,#f8f4ec,#fffdfa)" }}>
              <b>Still not sure?</b>
              <p className="small muted" style={{ margin: "6px 0 12px" }}>
                Send a photo on WhatsApp, or book a consultation. Home visits are available across Lahore, and the hospital is open
                until 11 pm most days.
              </p>
              <div className="row" style={{ gap: 9 }}>
                <Link href="/book-vet-appointment-lahore" className="button button-primary button-sm">Book a consult <ArrowRight size={14} /></Link>
                <WhatsAppButton message={`Assalam-o-Alaikum, I read “${post.title}” and have a question about my pet.`} className="button button-ghost button-sm" label="Ask on WhatsApp" />
              </div>
            </div>
            <p className="tiny muted" style={{ marginTop: 20 }}>
              This guide is general information, not a diagnosis or a treatment plan for your animal. If symptoms are severe, worsening or
              involve breathing, bleeding, collapse or straining to urinate, contact a veterinarian immediately.
            </p>
          </article>
          <div className="row" style={{ marginTop: 24 }}>
            <Link href="/pet-care-tips" className="link-arrow"><ArrowLeft size={14} /> All guides</Link>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="container">
          <SectionHead eyebrow="Keep reading" title="More from the clinic" />
          <div className="grid cols-3" style={{ marginTop: 24 }}>
            {more.map((item) => <PostCard key={item.slug} post={item} />)}
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
    </>
  );
}
