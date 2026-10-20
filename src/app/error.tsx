"use client";

import Link from "next/link";
import { ArrowRight, RefreshCw, TriangleAlert } from "lucide-react";

/** Last-resort boundary: keeps a crash looking like the clinic, not a stack trace. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{ minHeight: "80vh", display: "grid", placeItems: "center", padding: "60px 20px" }}>
      <div className="container-tight center col" style={{ gap: 18, alignItems: "center" }}>
        <span className="service-icon" style={{ width: 52, height: 52, marginBottom: 0, background: "var(--danger-tint)", color: "var(--danger)" }}>
          <TriangleAlert size={24} />
        </span>
        <span className="eyebrow eyebrow-plain">Something went wrong</span>
        <h1 style={{ fontSize: "clamp(28px,4vw,44px)", maxWidth: "18ch" }}>That did not load <em>as it should.</em></h1>
        <p className="muted" style={{ maxWidth: "52ch" }}>
          Nothing has been lost — your bookings and records are stored on the clinic server. Try again, or call the desk if you are mid-visit.
        </p>
        <div className="row" style={{ gap: 10, justifyContent: "center" }}>
          <button type="button" className="button button-primary" onClick={reset}><RefreshCw size={15} /> Try again</button>
          <Link href="/" className="button button-ghost">Back to the site</Link>
          <Link href="/contact-vet-lahore" className="button button-ghost">Contact the clinic <ArrowRight size={14} /></Link>
        </div>
        {error.digest ? <p className="tiny muted">Reference: {error.digest}</p> : null}
      </div>
    </main>
  );
}
