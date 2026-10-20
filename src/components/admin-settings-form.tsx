"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Save, Settings2 } from "lucide-react";
import { pkr } from "@/lib/format";
import type { HospitalSettings } from "@/lib/types";

export function AdminSettingsForm({ settings, canEdit }: { settings: HospitalSettings; canEdit: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState({
    hospitalFee: String(settings.hospitalVisitFee),
    homeFee: String(settings.homeVisitFee),
    emergencyHospitalFee: String(settings.emergencyHospitalFee),
    emergencyHomeFee: String(settings.emergencyHomeFee),
    deliveryFee: String(settings.deliveryFee),
    freeDeliveryAbove: String(settings.freeDeliveryAbove),
    announcement: settings.announcement,
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setSaved(false);
    setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hospitalVisitFee: Number(form.hospitalFee), homeVisitFee: Number(form.homeFee),
        emergencyHospitalFee: Number(form.emergencyHospitalFee), emergencyHomeFee: Number(form.emergencyHomeFee),
        deliveryFee: Number(form.deliveryFee), freeDeliveryAbove: Number(form.freeDeliveryAbove),
        announcement: form.announcement,
      }),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) { setError(data.error ?? "Could not save settings."); return; }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={submit}>
      {!canEdit && <p className="form-info-summary" style={{ marginBottom: 14 }}><Settings2 size={16} /><span>Only administrators can change fees and announcements. You&apos;re viewing the current values.</span></p>}
      {saved && <div className="form-success-summary" role="status" style={{ marginBottom: 14 }}><Check size={16} /> Settings saved — the website, booking wizard and checkout now use the new values.</div>}
      {error && <div className="form-error-summary" role="alert" style={{ marginBottom: 14 }}>{error}</div>}

      <div className="portal-card">
        <h2>Visiting charges</h2>
        <p className="card-sub">Shown in the booking wizard and printed on booking slips. Current standard hospital fee: {pkr(settings.hospitalVisitFee)}.</p>
        <fieldset style={{ border: 0, padding: 0, margin: 0 }} disabled={!canEdit}>
          <div className="form-grid">
            <div className="field"><label htmlFor="st-hosp">Hospital visit — standard (PKR)</label><input id="st-hosp" type="number" min={0} value={form.hospitalFee} onChange={(e) => set("hospitalFee", e.target.value)} /></div>
            <div className="field"><label htmlFor="st-ehosp">Hospital visit — emergency (PKR)</label><input id="st-ehosp" type="number" min={0} value={form.emergencyHospitalFee} onChange={(e) => set("emergencyHospitalFee", e.target.value)} /></div>
            <div className="field"><label htmlFor="st-home">Home visit — standard (PKR)</label><input id="st-home" type="number" min={0} value={form.homeFee} onChange={(e) => set("homeFee", e.target.value)} /></div>
            <div className="field"><label htmlFor="st-ehome">Home visit — emergency (PKR)</label><input id="st-ehome" type="number" min={0} value={form.emergencyHomeFee} onChange={(e) => set("emergencyHomeFee", e.target.value)} /></div>
          </div>
        </fieldset>
      </div>

      <div className="portal-card">
        <h2>Pet Mall delivery</h2>
        <p className="card-sub">Applied at checkout for every online order.</p>
        <fieldset style={{ border: 0, padding: 0, margin: 0 }} disabled={!canEdit}>
          <div className="form-grid">
            <div className="field"><label htmlFor="st-del">Delivery fee (PKR)</label><input id="st-del" type="number" min={0} value={form.deliveryFee} onChange={(e) => set("deliveryFee", e.target.value)} /></div>
            <div className="field"><label htmlFor="st-free">Free delivery above (PKR)</label><input id="st-free" type="number" min={0} value={form.freeDeliveryAbove} onChange={(e) => set("freeDeliveryAbove", e.target.value)} /></div>
          </div>
        </fieldset>
      </div>

      <div className="portal-card">
        <h2>Announcement bar</h2>
        <p className="card-sub">Displayed across the top of every page of the website. Leave blank to hide it.</p>
        <fieldset style={{ border: 0, padding: 0, margin: 0 }} disabled={!canEdit}>
          <div className="form-grid">
            <div className="field field-full"><label htmlFor="st-ann">Announcement text</label><input id="st-ann" value={form.announcement} onChange={(e) => set("announcement", e.target.value)} placeholder="e.g. Free deworming with every vaccination this week" /></div>
          </div>
        </fieldset>
      </div>

      {canEdit && <button type="submit" className="button button-primary" disabled={busy}>{busy ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Save settings</button>}
    </form>
  );
}
