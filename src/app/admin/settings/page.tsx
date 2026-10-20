import Link from "next/link";
import { AlertTriangle, ArrowRight, BadgePercent, Building2, CreditCard, Megaphone, RotateCcw, Save, Truck } from "lucide-react";
import { ActionForm, DialogForm } from "@/components/forms";
import { InlineButton } from "@/components/admin/inline-form";
import { resetDemoData, saveClinicSettings, togglePromo } from "@/server/actions/admin";
import { getSettings, rows } from "@/server/store";
import { requireStaff } from "@/server/auth";
import { money } from "@/lib/format";

export default async function AdminSettings() {
  const [settings, promos, staff] = await Promise.all([getSettings(), rows("promos"), requireStaff()]);

  return (
    <>
      <section className="app-card">
        <div className="app-card-head">
          <div><h2>Clinic profile</h2><p>Used across the site, on slips, invoices and in WhatsApp messages.</p></div>
          <span className="spacer" />
          <Link href="/" className="button button-ghost button-xs" target="_blank">View site <ArrowRight size={12} /></Link>
        </div>
        <ActionForm
          action={saveClinicSettings}
          variant="panel"
          submitLabel="Save clinic settings"
          fields={[
            { name: "clinicName", label: "Clinic name", required: true, span: 2, defaultValue: settings.clinicName },
            { name: "bookingPrefix", label: "Reference prefix", hint: "e.g. JVH — appears on every slip", defaultValue: settings.bookingPrefix },
            { name: "tagline", label: "Tagline", defaultValue: settings.tagline },
            { name: "phone", label: "Phone", defaultValue: settings.phone },
            { name: "whatsapp", label: "WhatsApp number (digits only)", defaultValue: settings.whatsapp },
            { name: "email", label: "Email", defaultValue: settings.email },
            { name: "emergencyLine", label: "Emergency line", defaultValue: settings.emergencyLine },
            { name: "address", label: "Address", type: "textarea", rows: 2, span: 2, defaultValue: settings.address },
            { name: "hoursNote", label: "Hours note", span: 2, defaultValue: settings.hoursNote },
            { name: "announcement", label: "Top-bar announcement", span: 2, defaultValue: settings.announcement, hint: "Leave blank to hide the banner" },
            { name: "announcementHref", label: "Announcement link", defaultValue: settings.announcementHref },
            { name: "whatsappTemplate", label: "WhatsApp confirmation template", type: "textarea", rows: 3, span: 2, defaultValue: settings.whatsappTemplate, hint: "Placeholders: {ref} {service} {pet} {date} {slot} {name} {area}" },
            { name: "paymentInstructions", label: "Payment instructions shown on slips", type: "textarea", rows: 3, span: 2, defaultValue: settings.paymentInstructions },
          ]}
        />
      </section>

      <section className="app-card">
        <div className="app-card-head">
          <div><h2>Fees &amp; charges</h2><p>Changes take effect on the next booking. Existing quotes keep the price they were created with.</p></div>
          <span className="spacer" /><span className="pill pill-soft"><CreditCard size={12} /> PKR</span>
        </div>
        <ActionForm
          action={saveClinicSettings}
          variant="panel"
          submitLabel="Save fees"
          fields={[
            { name: "clinicName", label: "clinicName", type: "hidden", defaultValue: settings.clinicName },
            { name: "bookingPrefix", label: "bookingPrefix", type: "hidden", defaultValue: settings.bookingPrefix },
            { name: "visitHomeStandard", label: "Home visit charge", type: "money", defaultValue: settings.visitHomeStandard, hint: "Standard daytime dispatch" },
            { name: "visitHomeEmergency", label: "Emergency / night dispatch", type: "money", defaultValue: settings.visitHomeEmergency },
            { name: "visitClinic", label: "Hospital consultation", type: "money", defaultValue: settings.visitClinic },
            { name: "nightSurcharge", label: "Night slot surcharge", type: "money", defaultValue: settings.nightSurcharge },
            { name: "deliveryLahore", label: "Lahore delivery fee", type: "money", defaultValue: settings.deliveryLahore },
            { name: "freeDeliveryOver", label: "Free delivery above", type: "money", defaultValue: settings.freeDeliveryOver },
            { name: "taxPercent", label: "GST / withholding %", type: "number", defaultValue: settings.taxPercent, min: 0, max: 25 },
          ]}
        />
        <div className="app-card-body" style={{ paddingTop: 0 }}>
          <div className="note">
            <Truck size={16} />
            <span>
              A standard home visit currently totals <b>{money(settings.visitHomeStandard)}</b> travel + the service fee. De-worming at
              3,000 therefore shows <b>{money(3000 + settings.visitHomeStandard)}</b> — the same arithmetic as the printed slip.
            </span>
          </div>
        </div>
      </section>

      <div className="grid cols-2">
        <section className="app-card">
          <div className="app-card-head"><div><h2><Megaphone size={15} style={{ verticalAlign: "-2px" }} /> Promo codes</h2><p>Applied at checkout on the pet mall.</p></div></div>
          <div className="app-card-body col" style={{ gap: 10 }}>
            {promos.map((promo) => (
              <div key={promo.code} className="row" style={{ gap: 12, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
                <span className="table-ref">{promo.code}</span>
                <span className="col" style={{ gap: 1, flex: 1 }}>
                  <b className="small">{promo.label}</b>
                  <span className="tiny muted">{promo.percent}% off · minimum {money(promo.minSubtotal)}</span>
                </span>
                <span className={`status status-${promo.active ? "completed" : "archived"}`}>{promo.active ? "Active" : "Off"}</span>
                <InlineButton action={togglePromo} payload={{ code: promo.code }} className="button button-ghost button-xs">{promo.active ? "Disable" : "Enable"}</InlineButton>
              </div>
            ))}
            <div className="note note-brass"><BadgePercent size={16} /><span>Advertise a code in the top-bar announcement and it appears at checkout automatically.</span></div>
          </div>
        </section>

        <section className="app-card">
          <div className="app-card-head"><div><h2><Building2 size={15} style={{ verticalAlign: "-2px" }} /> Booking windows</h2><p>The slots clients choose from in the wizard.</p></div></div>
          <div className="app-card-body col" style={{ gap: 8 }}>
            {settings.slotWindows.map((slot) => (
              <div key={slot.id} className="row-between" style={{ gap: 12, paddingBottom: 8, borderBottom: "1px solid var(--line)" }}>
                <b className="small" style={{ textTransform: "capitalize" }}>{slot.label}</b>
                <span className="small muted tnum">{slot.window}</span>
              </div>
            ))}
            <p className="tiny muted" style={{ margin: "8px 0 0" }}>
              Windows are defined in <code>src/server/store.ts</code> so they stay in sync with the server-side slot validation. Edit there to
              change them permanently.
            </p>
          </div>
        </section>
      </div>

      <section className="app-card card-pad" style={{ borderColor: "rgba(156,58,53,.25)" }}>
        <div className="row-between" style={{ gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 18, color: "var(--danger)" }}><AlertTriangle size={16} style={{ verticalAlign: "-2px" }} /> Demo data</h3>
            <p className="small muted" style={{ margin: "6px 0 0", maxWidth: "70ch" }}>
              This build stores everything as JSON files under <code>.data/</code>. Resetting restores the seeded catalogue, clients and
              appointments — useful before a client demo, destructive afterwards.
            </p>
            <p className="tiny" style={{ margin: "8px 0 0", color: "var(--muted-2)" }}>Signed in as {staff.name} ({staff.role}). Only the owner can reset.</p>
          </div>
          <DialogForm
            action={resetDemoData}
            title="Reset demo data"
            description="Every booking, order, product edit and account created after seeding will be deleted."
            trigger={<button type="button" className="button button-ghost button-sm" style={{ color: "var(--danger)", borderColor: "rgba(156,58,53,.35)" }}><RotateCcw size={14} /> Reset demo data</button>}
            fields={[{ name: "confirm", label: "Type RESET to confirm", required: true, placeholder: "RESET" }]}
            submitLabel="Delete and reseed"
          />
        </div>
      </section>

      <section className="app-card card-pad">
        <div className="row-between" style={{ gap: 14 }}>
          <div>
            <h3 style={{ fontSize: 17 }}><Save size={15} style={{ verticalAlign: "-2px" }} /> Before a live launch</h3>
            <p className="small muted" style={{ margin: "6px 0 0", maxWidth: "80ch" }}>
              Point the store at Postgres (the Drizzle schema mirrors these collections), replace the placeholder photography, set
              <code> NEXT_PUBLIC_SITE_URL</code> to enable search indexing, and confirm the day-by-day opening hours with the owner.
            </p>
          </div>
          <Link href="/admin/staff" className="button button-ghost button-sm">Team access <ArrowRight size={13} /></Link>
        </div>
      </section>
    </>
  );
}
