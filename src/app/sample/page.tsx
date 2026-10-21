import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SAMPLES } from "@/components/samples/data";

export const metadata: Metadata = {
  title: "20 home page studies",
  robots: { index: false, follow: false },
};

export default function SamplesIndex() {
  return (
    <div className="smp-index">
      <header className="smp-index-head">
        <span className="smp-index-kicker">Design study · not part of the live site</span>
        <h1>Twenty home pages, one practice.</h1>
        <p>
          Same content, twenty different layout and typography systems. Open any one, then use the bar at the top to move
          between them. Nothing here touches the real site.
        </p>
      </header>

      <ul className="smp-index-grid">
        {SAMPLES.map((s) => (
          <li key={s.slug}>
            <Link href={`/sample/${s.slug}`} className={`smp-tile-card smp-tile-card--${s.n}`}>
              <span className="smp-tile-thumb">
                <Image
                  src={`/samples/${s.slug}.jpg`}
                  alt={`${s.name} home page preview`}
                  width={640}
                  height={450}
                  sizes="(max-width: 700px) 100vw, 320px"
                  priority={s.n <= "04"}
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
        ))}
      </ul>
    </div>
  );
}
