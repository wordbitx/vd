import Link from "next/link";
import { ArrowRight, Stethoscope } from "lucide-react";
import { ActionForm } from "@/components/forms";
import { saveService } from "@/server/actions/admin";
import { rows } from "@/server/store";
import { money } from "@/lib/format";
import { getSettings } from "@/server/store";

export default async function AdminServices() {
  const [services, settings] = await Promise.all([rows("services"), getSettings()]);
  const quote = await import("@/lib/pricing").then((m) => m.quoteAppointment({ servicePrice: 3000, mode: "home", urgency: "standard", slotId: "morning", settings }));

  return (
    <>
      <div className="kpi-grid">
        {[
          { label: "Services live", value: String(services.filter((s) => s.active).length), sub: `${services.length} configured` },
          { label: "Home visit charge", value: money(settings.visitHomeStandard), sub: `${money(settings.visitHomeEmergency)} emergency` },
          { label: "Hospital consult", value: money(settings.visitClinic), sub: "No travel charge" },
          { label: "Example total", value: money(quote.total), sub: "Rs. 3,000 service · home visit" },
        ].map((card) => (
          <div key={card.label} className="kpi">
            <span className="kpi-label">{card.label}</span>
            <div className="kpi-value">{card.value}</div>
            <span className="tiny muted">{card.sub}</span>
          </div>
        ))}
      </div>

      <section className="app-card">
        <div className="app-card-head">
          <div><h2>Services &amp; professional fees</h2><p>Changing a fee updates the booking wizard, the public service page and new invoices instantly.</p></div>
          <span className="spacer" />
          <Link href="/services" className="button button-ghost button-xs" target="_blank">Public page <ArrowRight size={12} /></Link>
        </div>
        <div className="app-card-body grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}>
          {services.map((service) => (
            <ActionForm
              key={service.slug}
              action={saveService}
              title={service.title}
              description={`${service.duration} · ${service.homeAvailable ? "home or hospital" : "hospital only"}`}
              submitLabel="Save fee"
              fields={[
                { name: "slug", label: "slug", type: "hidden", defaultValue: service.slug },
                { name: "shortTitle", label: "Short name", defaultValue: service.shortTitle },
                { name: "price", label: "Professional fee (PKR)", type: "money", required: true, defaultValue: service.price },
                { name: "duration", label: "Typical duration", defaultValue: service.duration },
                { name: "summary", label: "Public summary", type: "textarea", rows: 2, span: 2, defaultValue: service.summary },
                { name: "active", label: "Bookable", type: "toggle", defaultValue: service.active },
                { name: "homeAvailable", label: "Available as a home visit", type: "toggle", defaultValue: service.homeAvailable },
              ]}
            />
          ))}
        </div>
      </section>

      <section className="app-card card-pad" style={{ background: "linear-gradient(150deg,#f8f4ec,#fffdfa)" }}>
        <div className="row-between" style={{ gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 18 }}><Stethoscope size={16} style={{ verticalAlign: "-2px" }} /> How a quote is built</h3>
            <p className="small muted" style={{ margin: "6px 0 0", maxWidth: "80ch" }}>
              Professional fee + home visit charge (or hospital consult fee) + night surcharge if the slot is after 10 pm + any add-ons.
              The total is shown to the client before they confirm, and again on the slip. Change the visit charges in
              <Link href="/admin/settings" style={{ textDecoration: "underline" }}> Clinic settings</Link>.
            </p>
          </div>
          <Link href="/admin/settings" className="button button-dark button-sm">Open settings</Link>
        </div>
      </section>
    </>
  );
}
