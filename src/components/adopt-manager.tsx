"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, HeartHandshake, Loader2, Plus, Trash2, X } from "lucide-react";
import type { Adoption } from "@/lib/types";

const STATUS_TONES: Record<Adoption["status"], string> = {
  pending: "tone-amber", available: "tone-green", adopted: "tone-blue", rejected: "tone-red",
};
const STATUS_LABELS: Record<Adoption["status"], string> = {
  pending: "Under review", available: "Live on board", adopted: "Adopted", rejected: "Not approved",
};

const PHOTO_CHOICES = [
  { value: "/images/pets/lilly.jpg", label: "White Persian cat" },
  { value: "/images/pets/Coco.jpg", label: "Grey kitten" },
  { value: "/images/pets/simba.jpg", label: "Orange kitten" },
  { value: "/images/pets/muffin.jpg", label: "Persian cat (young)" },
  { value: "/images/pets/bruno.jpg", label: "Golden puppy" },
  { value: "/images/pets/max.jpg", label: "Shepherd puppy" },
  { value: "/images/pets/oreo.jpg", label: "Dwarf rabbit" },
];

export function AdoptManager({ mine }: { mine: Adoption[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "", species: "Cat", breed: "", gender: "Female", ageGroup: "Puppy/Kitten", ageText: "",
    vaccinated: false, dewormed: false, litterTrained: false,
    description: "", image: PHOTO_CHOICES[0].value, area: "", contactPhone: "",
  });
  const set = (key: string, value: unknown) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/adoptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not submit this listing.");
      setSuccess("Submitted! Our team will review your listing and publish it on the adoption board shortly.");
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit this listing.");
    } finally {
      setBusy(false);
    }
  }

  async function markAdopted(id: string) {
    await fetch(`/api/adoptions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "adopted" }) });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/adoptions/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      {success && <div className="form-success-summary" role="status" style={{ marginBottom: 16 }}><Check size={17} /> <span>{success}</span></div>}
      {error && <div className="form-error-summary" role="alert" style={{ marginBottom: 16 }}>{error}</div>}

      {mine.length === 0 && !showForm && (
        <div className="empty-note" style={{ marginBottom: 18 }}>
          <HeartHandshake size={24} />
          <strong>No adoption posts yet</strong>
          Looking to rehome a pet responsibly? Post them here — our team reviews every listing before it goes live.
        </div>
      )}

      {mine.length > 0 && (
        <div className="portal-card" style={{ padding: "8px 22px", marginBottom: 18 }}>
          <div className="list-rows">
            {mine.map((pet) => (
              <div className="list-row" key={pet.id}>
                <span className="lr-icon"><HeartHandshake size={19} /></span>
                <div style={{ minWidth: 0 }}>
                  <p className="lr-title">{pet.name} · {pet.breed || pet.species}</p>
                  <p className="lr-sub">{pet.ageGroup}{pet.ageText ? ` · ${pet.ageText}` : ""} · {pet.area}</p>
                </div>
                <div className="lr-right" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <span className={`badge ${STATUS_TONES[pet.status]}`}>{STATUS_LABELS[pet.status]}</span>
                  {pet.status === "available" && <Link href={`/adopt/${pet.id}`} className="mini-link">View</Link>}
                  {pet.status === "available" && (
                    <button type="button" className="mini-link" style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }} onClick={() => markAdopted(pet.id)}>Mark adopted</button>
                  )}
                  <button type="button" className="icon-btn danger" onClick={() => remove(pet.id)} aria-label={`Delete ${pet.name} listing`}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showForm ? (
        <button type="button" className="button button-gold" onClick={() => setShowForm(true)}><Plus size={16} /> Post a pet for adoption</button>
      ) : (
        <div className="portal-card">
          <div className="card-head-row">
            <h2>Post a pet for adoption</h2>
            <button type="button" className="icon-btn" onClick={() => setShowForm(false)} aria-label="Close form"><X size={16} /></button>
          </div>
          <p className="card-sub">Adoptions are always free on our board — we simply help good pets find good homes. Listings are reviewed by the Jawad team before publishing.</p>
          <form className="form-grid" onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="ad-name">Pet name <span>*</span></label>
              <input id="ad-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Coco" />
            </div>
            <div className="field">
              <label htmlFor="ad-species">Species <span>*</span></label>
              <select id="ad-species" value={form.species} onChange={(e) => set("species", e.target.value)}>
                <option>Cat</option><option>Dog</option><option>Rabbit</option><option>Bird</option><option>Other</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="ad-breed">Breed</label>
              <input id="ad-breed" value={form.breed} onChange={(e) => set("breed", e.target.value)} placeholder="e.g. Persian" />
            </div>
            <div className="field">
              <label htmlFor="ad-gender">Gender</label>
              <select id="ad-gender" value={form.gender} onChange={(e) => set("gender", e.target.value)}><option>Female</option><option>Male</option></select>
            </div>
            <div className="field">
              <label htmlFor="ad-agegroup">Age group</label>
              <select id="ad-agegroup" value={form.ageGroup} onChange={(e) => set("ageGroup", e.target.value)}>
                <option>Puppy/Kitten</option><option>Young</option><option>Adult</option><option>Senior</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="ad-age">Exact age</label>
              <input id="ad-age" value={form.ageText} onChange={(e) => set("ageText", e.target.value)} placeholder="e.g. 4 months" />
            </div>
            <div className="field">
              <label htmlFor="ad-area">City area</label>
              <input id="ad-area" value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. Bahria Town" />
            </div>
            <div className="field">
              <label htmlFor="ad-phone">WhatsApp for adopters</label>
              <input id="ad-phone" type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="0300 1234567 (or leave blank to use account number)" />
            </div>
            <div className="field field-full">
              <label htmlFor="ad-image">Listing photo</label>
              <select id="ad-image" value={form.image} onChange={(e) => set("image", e.target.value)}>
                {PHOTO_CHOICES.map((choice) => <option key={choice.value} value={choice.value}>{choice.label} (stock photo)</option>)}
              </select>
              <small style={{ color: "#93a0a8", fontSize: 10.5 }}>Photo uploads arrive at launch — for now pick the closest stock photo, or WhatsApp us real photos to attach.</small>
            </div>
            <div className="field field-full" style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <label className="checkbox-row"><input type="checkbox" checked={form.vaccinated} onChange={(e) => set("vaccinated", e.target.checked)} /> Vaccinated</label>
              <label className="checkbox-row"><input type="checkbox" checked={form.dewormed} onChange={(e) => set("dewormed", e.target.checked)} /> Dewormed</label>
              <label className="checkbox-row"><input type="checkbox" checked={form.litterTrained} onChange={(e) => set("litterTrained", e.target.checked)} /> Litter / house trained</label>
            </div>
            <div className="field field-full">
              <label htmlFor="ad-desc">About this pet <span>*</span></label>
              <textarea id="ad-desc" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Personality, habits, reason for rehoming, ideal home…" />
            </div>
            <div className="field-full">
              <button type="submit" className="button button-primary" disabled={busy}>
                {busy ? <Loader2 size={16} className="spin" /> : <Plus size={16} />} Submit for review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
