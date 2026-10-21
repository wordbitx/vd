import type { ReactNode } from "react";

/**
 * Hand-drawn category art for the Pet Mall: a complete illustrated figure per
 * category, transparent background, deep-teal line work with cream fills and
 * antique-gold accents. Colours come from CSS so the rail can restyle on hover.
 */
const ART: Record<string, ReactNode> = {
  "dog-food": (
    <>
      <path d="M86 78c8 2 13-3 13-10 0-5-4-8-7-6-3 2-2 6 1 7" fill="var(--art-cream)"/>
      <path d="M60 52c-7 0-12 4-15 9-3 6-5 14-5 22v12a6 6 0 0 0 6 6h6a6 6 0 0 0 6-6v-8h4v8a6 6 0 0 0 6 6h6a6 6 0 0 0 6-6V83c0-8-2-16-5-22-3-5-8-9-15-9Z" fill="var(--art-cream)"/>
      <path d="M52 88v5M68 88v5" strokeWidth="1.6" stroke="var(--art-sand)"/>
      <path d="M48 24c-7 0-11 8-10 16 1 7 5 9 8 6 3-4 3-14 2-22Z" fill="var(--art-sand)"/>
      <path d="M72 24c7 0 11 8 10 16-1 7-5 9-8 6-3-4-3-14-2-22Z" fill="var(--art-sand)"/>
      <ellipse cx="60" cy="34" rx="15.5" ry="14" fill="var(--art-cream)"/>
      <path d="M49 33.4c.9 1.5.7 3.2-.5 4.2M71 33.4c-.9 1.5-.7 3.2.5 4.2" strokeWidth="1.5"/>
      <path d="M57.4 40.8c.8-1 4.4-1 5.2 0 .7.9.3 2.2-.8 2.7-1 .5-2.6.5-3.6 0-1.1-.5-1.5-1.8-.8-2.7Z" fill="currentColor" stroke="none"/>
      <path d="M60 43.6v2.2M60 45.8c-.9 1.4-3.1 1.4-3.9.1M60 45.8c.9 1.4 3.1 1.4 3.9.1" strokeWidth="1.5"/>
      <path d="M49.5 48c3.4 2.2 6.9 3.2 10.5 3.2S67.1 50.2 70.5 48" stroke="var(--art-gold)" strokeWidth="2.6"/>
      <circle cx="60" cy="54.6" r="3.5" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.6"/>
      <circle cx="54.4" cy="32" r="1.9" fill="currentColor" stroke="none"/>
      <circle cx="65.6" cy="32" r="1.9" fill="currentColor" stroke="none"/>
    </>
  ),
  "cat-food": (
    <>
      <path d="M78 92c9 1 15-5 15-14 0-6-4-10-8-8-3 2-2 6 1 7" fill="var(--art-cream)"/>
      <path d="M60 51c-6 0-11 3-14 8-3 6-5 14-5 22v13a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5v-6h6v6a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5V81c0-8-2-16-5-22-3-5-8-8-14-8Z" fill="var(--art-cream)"/>
      <path d="M47 30 45 15l15 10" fill="var(--art-sand)"/>
      <path d="M73 30 75 15 60 25" fill="var(--art-sand)"/>
      <path d="M60 24c-11 0-19 8-19 18s8 18 19 18 19-8 19-18-8-18-19-18Z" fill="var(--art-cream)"/>
      <path d="M58 41.4c.6-.8 3.4-.8 4 0 .5.7.2 1.8-.6 2.3-.8.5-2 .5-2.8 0-.8-.5-1.1-1.6-.6-2.3Z" fill="currentColor" stroke="none"/>
      <path d="M60 44v2.2M60 46.2c-.8 1.2-2.8 1.2-3.5 0M60 46.2c.8 1.2 2.8 1.2 3.5 0" strokeWidth="1.4"/>
      <path d="M48 37c2.6-1.4 5-1.4 7 0M65 37c2-1.4 4.4-1.4 7 0" strokeWidth="1.4"/>
      <path d="M44.5 40.5l6 2-6 2.4M75.5 40.5l-6 2 6 2.4" stroke="var(--art-gold)" strokeWidth="1.5"/>
      <path d="M49.6 48.4c3.3 2 6.8 3 10.4 3s7.1-1 10.4-3" stroke="var(--art-gold)" strokeWidth="2.6"/>
      <circle cx="60" cy="54.8" r="3.4" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.6"/>
      <circle cx="54.6" cy="32.2" r="1.9" fill="currentColor" stroke="none"/>
      <circle cx="65.4" cy="32.2" r="1.9" fill="currentColor" stroke="none"/>
    </>
  ),
  "treats-chews": (
    <>
      <path d="M41 36c-12-2-20 12-10 19-10 7-2 21 10 19 7-1 11-7 13-13h12c2 6 6 12 13 13 12 2 20-12 10-19 10-7 2-21-10-19-7 1-11 7-13 13H54c-2-6-6-12-13-13Z" fill="var(--art-cream)"/>
      <path d="M50 48c3-2 7-3 10-3s7 1 10 3" stroke="var(--art-sand)" strokeWidth="2.2"/>
      <path d="M50 72c3 2 7 3 10 3s7-1 10-3" stroke="var(--art-sand)" strokeWidth="2.2"/>
      <path d="M96 24l1.5 4.1 4.1 1.5-4.1 1.5L96 35.2l-1.5-4.1-4.1-1.5 4.1-1.5Z" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.3"/>
      <path d="M24 30l1.1 3.1 3.1 1.1-3.1 1.1L24 38.4l-1.1-3.1-3.1-1.1 3.1-1.1Z" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.1"/>
    </>
  ),
  "toys-enrichment": (
    <>
      <circle cx="57" cy="60" r="28" fill="var(--art-cream)"/>
      <path d="M31 52c12 2 30 12 44 26M35 76c4-16 14-31 27-42M38 38c12 9 24 24 28 46M79 48c-4 14-13 26-24 34" stroke="var(--art-sand)" strokeWidth="2.3"/>
      <path d="M84 74c6 3 9 7 9 12 0 3-2 5-5 4" strokeWidth="2"/>
      <path d="M88 90c-3 1-5-1-4-4" strokeWidth="1.8"/>
      <path d="M97 22l1.5 4 4 1.4-4 1.4L97 33l-1.5-4.2-4-1.4 4-1.4Z" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.3"/>
    </>
  ),
  "grooming-care": (
    <>
      <rect x="40" y="46" width="40" height="50" rx="12" fill="var(--art-cream)"/>
      <path d="M50 46v-8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8" fill="var(--art-sand)"/>
      <path d="M54 32h12" stroke="var(--art-gold)" strokeWidth="2"/>
      <path d="M60 22h10a4 4 0 0 1 4 4v3" fill="none" strokeWidth="2"/>
      <path d="M74 26h8" stroke="var(--art-gold)" strokeWidth="2.4"/>
      <path d="M60 60a7 7 0 0 1 14 0 7 7 0 0 1-14 0Z" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.6"/>
      <circle cx="52.4" cy="58" r="2.6" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.4"/>
      <circle cx="67.6" cy="58" r="2.6" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.4"/>
      <circle cx="60" cy="73.6" r="3.8" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.6"/>
      <circle cx="86" cy="40" r="7" fill="var(--art-cream)" stroke="var(--art-gold)" strokeWidth="1.5"/>
      <circle cx="94" cy="54" r="4.4" fill="var(--art-cream)" stroke="var(--art-gold)" strokeWidth="1.4"/>
      <circle cx="84" cy="63" r="3" fill="var(--art-cream)" stroke="var(--art-gold)" strokeWidth="1.3"/>
      <path d="M26 30l1.2 3.4 3.4 1.2-3.4 1.2L26 39.2l-1.2-3.4-3.4-1.2 3.4-1.2Z" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.2"/>
    </>
  ),
  "supplements": (
    <>
      <rect x="30" y="40" width="36" height="50" rx="9" fill="var(--art-cream)"/>
      <path d="M37 40v-9h22v9" fill="var(--art-sand)"/>
      <rect x="35" y="25" width="26" height="7" rx="3.5" fill="var(--art-sand)"/>
      <rect x="35" y="52" width="26" height="24" rx="5" fill="var(--art-sand)" stroke="none"/>
      <path d="M48 58v12M42 64h12" stroke="var(--art-gold)" strokeWidth="2.6"/>
      <g transform="rotate(-40 84 72)">
      <rect x="72" y="63" width="24" height="13" rx="6.5" fill="var(--art-cream)"/>
      <path d="M84 63v13" stroke="var(--art-gold)" strokeWidth="2"/>
      </g>
      <path d="M26 30l1.1 3 3 1.1-3 1.1L26 38.3l-1.1-3.1-3-1.1 3-1.1Z" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.1"/>
      <circle cx="95" cy="38" r="3" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.3"/>
      <circle cx="88" cy="30" r="2.2" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.2"/>
    </>
  ),
  "beds-carriers": (
    <>
      <path d="M18 70c0-11 18-19 42-19s42 8 42 19v12a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8Z" fill="var(--art-cream)"/>
      <path d="M27 70c0-7 14-13 33-13s33 6 33 13-14 13-33 13-33-6-33-13Z" fill="var(--art-sand)"/>
      <path d="M53 68a7 7 0 0 1 14 0 7 7 0 0 1-14 0Z" fill="var(--art-cream)" stroke="var(--art-gold)" strokeWidth="1.7"/>
      <ellipse cx="45" cy="71" rx="4.4" ry="5" fill="var(--art-cream)" stroke="var(--art-gold)" strokeWidth="1.7"/>
      <ellipse cx="75" cy="71" rx="4.4" ry="5" fill="var(--art-cream)" stroke="var(--art-gold)" strokeWidth="1.7"/>
      <ellipse cx="60" cy="79.4" rx="4.6" ry="5.2" fill="var(--art-cream)" stroke="var(--art-gold)" strokeWidth="1.7"/>
      <path d="M30 94h60" strokeWidth="1.6" stroke="var(--art-sand)"/>
      <path d="M95 26a7 7 0 1 0 0 14 5.4 5.4 0 0 1 0-14Z" fill="var(--art-cream)" stroke="var(--art-gold)" strokeWidth="1.6"/>
      <path d="M26 30l1.1 3 3 1.1-3 1.1L26 38.3l-1.1-3.1-3-1.1 3-1.1Z" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.1"/>
    </>
  ),
  "collars-leashes": (
    <>
      <ellipse cx="60" cy="56" rx="38" ry="30" fill="none" strokeWidth="13" stroke="var(--art-cream)"/>
      <ellipse cx="60" cy="56" rx="38" ry="30" fill="none" strokeWidth="2"/>
      <ellipse cx="60" cy="56" rx="38" ry="30" fill="none" stroke="var(--art-sand)" strokeWidth="5" strokeDasharray="6 7"/>
      <ellipse cx="60" cy="56" rx="31.5" ry="23.5" fill="none" strokeWidth="2"/>
      <rect x="18" y="47" width="14" height="17" rx="4" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.7"/>
      <path d="M25 47v17" stroke="var(--art-gold)" strokeWidth="1.5"/>
      <path d="M60 86v7" strokeWidth="2"/>
      <path d="M60 93a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.8"/>
      <path d="M60 99a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8Z" fill="var(--art-cream)" stroke="var(--art-gold)" strokeWidth="1.4"/>
      <path d="M97 26l1.3 3.6 3.6 1.3-3.6 1.3L97 35.8l-1.3-3.6-3.6-1.3 3.6-1.3Z" fill="var(--art-sand)" stroke="var(--art-gold)" strokeWidth="1.2"/>
    </>
  ),
};

export function CategoryArt({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ART[slug] ?? ART["beds-carriers"]}
    </svg>
  );
}
