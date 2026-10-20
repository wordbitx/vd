import { redirect } from "next/navigation";
import { Breadcrumbs, Eyebrow } from "@/components/ui";
import { noIndex } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Verify a booking slip", ...noIndex };

export default async function SlipLookup({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  if (ref) redirect(`/slip/${encodeURIComponent(ref)}`);

  return (
    <section className="section-tight" style={{ paddingTop: 24, minHeight: "60vh" }}>
      <div className="container-tight">
        <Breadcrumbs items={[{ label: "Verify a slip" }]} />
        <div className="card card-pad" style={{ display: "grid", gap: 16 }}>
          <Eyebrow>Slip verification</Eyebrow>
          <h1 style={{ fontSize: "clamp(26px,3.4vw,40px)", margin: 0 }}>Have a reference from the clinic?</h1>
          <p className="muted small" style={{ margin: 0 }}>
            Paste a booking or order reference — for example <b>JVH-{new Date().getFullYear()}-752699</b> — to reopen the printable slip. Guests can
            use this without an account; signed-in clients see everything in the portal.
          </p>
          <form action="/slip" method="get" className="row" style={{ gap: 10 }}>
            <input className="input" name="ref" placeholder="JVH-2026-752699" required autoComplete="off" style={{ maxWidth: 320 }} />
            <button className="button button-primary" type="submit">Find my slip</button>
          </form>
          <p className="tiny muted" style={{ margin: 0 }}>Lost the reference? WhatsApp the clinic with your pet’s name and the date of the visit.</p>
        </div>
      </div>
    </section>
  );
}

