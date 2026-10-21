import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { VARIANT_MAP, type VariantSlug } from "@/components/samples/variants";
import { SAMPLES } from "@/components/samples/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SAMPLES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sample = SAMPLES.find((s) => s.slug === slug);
  return {
    title: sample ? `${sample.n} · ${sample.name}` : "Sample",
    robots: { index: false, follow: false },
  };
}

export default async function SamplePage({ params }: Props) {
  const { slug } = await params;
  const sample = SAMPLES.find((s) => s.slug === slug);
  const Variant = VARIANT_MAP[slug as VariantSlug];
  if (!sample || !Variant) notFound();

  const i = SAMPLES.findIndex((s) => s.slug === slug);
  const prev = SAMPLES[(i - 1 + SAMPLES.length) % SAMPLES.length];
  const next = SAMPLES[(i + 1) % SAMPLES.length];

  return (
    <div className="smp-host" data-sample={sample.n}>
      <div className="smp-switcher">
        <Link href="/sample" className="smp-switcher-home">
          <b>{sample.n}</b> {sample.name}
        </Link>
        <span className="smp-switcher-meta">{sample.bestFor}</span>
        <div className="smp-switcher-nav">
          <Link href={`/sample/${prev.slug}`} aria-label={`Previous: ${prev.name}`}>← {prev.n}</Link>
          <Link href={`/sample/${next.slug}`} aria-label={`Next: ${next.name}`}>{next.n} →</Link>
          <Link href="/sample" className="smp-switcher-all">All 20</Link>
        </div>
      </div>
      <Variant />
    </div>
  );
}
