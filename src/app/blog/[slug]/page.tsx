import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, ChevronRight, Clock3, Info } from "lucide-react";
import { BookingCta } from "@/components/page-parts";
import { articles } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return articles.map((article) => ({ slug: article.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  return article ? pageMetadata(article.title, article.excerpt, `/blog/${slug}`, article.image) : {};
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const related = articles.filter((item) => item.slug !== slug).slice(0, 2);
  return <main id="main-content"><div className="container breadcrumbs"><Link href="/">Home</Link><ChevronRight size={13} /><Link href="/blog">Journal</Link><ChevronRight size={13} /><span>{article.title}</span></div><article><header className="article-hero"><div className="container article-hero-inner"><span className="eyebrow"><span className="eyebrow-line" /> {article.category}</span><h1>{article.title}</h1><p>{article.excerpt}</p><div className="article-byline"><span><Clock3 size={15} /> {article.readTime}</span><span>Editorial draft · veterinary review required</span></div></div></header><div className="container article-cover-wrap"><div className="article-cover"><Image src={article.image} alt={`Illustrative photograph accompanying ${article.title}`} fill priority sizes="(max-width: 900px) 100vw, 1000px" className="object-cover" /><span className="image-disclaimer">Illustrative demo image</span></div></div><div className="container article-body-wrap"><div className="article-body"><div className="article-warning"><Info size={20} /><p>This is a draft educational article, not medical advice. It has not yet been reviewed by a qualified veterinarian. For concerns about your own pet, consult a veterinary professional.</p></div>{article.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}<div className="article-end"><h2>Every pet is different.</h2><p>If something about your companion is worrying you, a direct conversation with a veterinary professional is the most useful next step.</p><Link href="/book" className="button button-primary"><CalendarDays size={17} /> Request a visit <ArrowRight size={16} /></Link></div><Link href="/blog" className="back-link"><ArrowLeft size={16} /> Back to the journal</Link></div></div></article><section className="related-section"><div className="container"><div className="section-header compact"><div><span className="eyebrow"><span className="eyebrow-line" /> KEEP READING</span><h2>More from the journal.</h2></div></div><div className="related-article-grid">{related.map((item) => <Link key={item.slug} href={`/blog/${item.slug}`} className="related-article"><div><span className="article-meta">{item.category}</span><h3>{item.title}</h3><p>{item.excerpt}</p></div><ArrowRight size={19} /></Link>)}</div></div></section><BookingCta title="Your pet’s question deserves a personal answer." description="The team can discuss your pet’s needs and help you take an informed next step." /></main>;
}
