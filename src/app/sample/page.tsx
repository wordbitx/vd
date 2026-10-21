import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SAMPLES, type Sample } from "@/components/samples/data";

export const metadata: Metadata = {
  title: "24 home page concepts",
  robots: { index: false, follow: false },
};

function Tile({ s }: { s: Sample }) {
  return (
    <li>
      <Link href={`/sample/${s.slug}`} className={`smp-tile-card smp-tile-card--${s.n}`}>
        <span className="smp-tile-thumb">
          <Image
            src={`/samples/${s.slug}.jpg`}
            alt={`${s.name} home page preview`}
            width={640}
            height={450}
            sizes="(max-width: 700px) 100vw, 320px"
            priority={s.n <= "04" || s.group === "full"}
          />
        </span>
        <span className="smp-tile-body">
          <span className="smp-tile-n">{s.n}</span>
          <b>{s.name}</b>
          <span className="smp-tile-blurb">{s.blurb}</span>
          <span className="smp-tile-meta">{s.bestFor}</span>
        </span>
        <span className="smp-tile-foot">
          <span className="smp-dots">
            {s.palette.map((c) => <i key={c} style={{ background: c }} />)}
          </span>
          <span className="smp-tile-type">{s.type}</span>
        </span>
      </Link>
    </li>
  );
}

export default function SamplesIndex() {
  const full = SAMPLES.filter((s) => s.group === "full");
  const studies = SAMPLES.filter((s) => s.group !== "full");

  return (
    <div className="smp-index">
      <header className="smp-index-head">
        <span className="smp-index-kicker">Design study · not part of the live site</span>
        <h1>Twenty-four home pages, one practice.</h1>
        <p>
          Four full-page builds follow the mockup you sent — same sections end to end, each in its own palette and type
          system. Below them sit the twenty earlier layout studies. Open any one, then use the bar at the top to move
          between them. Nothing here touches the real site.
        </p>
      </header>

      <div className="smp-index-group">
        <div className="smp-index-grouphead">
          <h2>Full-page concept</h2>
          <span>21–24 · hero → footer, built from the mockup</span>
        </div>
        <ul className="smp-index-grid smp-index-grid--full">{full.map((s) => <Tile key={s.slug} s={s} />)}</ul>
      </div>

      <div className="smp-index-group">
        <div className="smp-index-grouphead">
          <h2>Layout studies</h2>
          <span>01–20 · one strong idea each</span>
        </div>
        <ul className="smp-index-grid">{studies.map((s) => <Tile key={s.slug} s={s} />)}</ul>
      </div>
    </div>
  );
}
