"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Bird, CalendarPlus, Cat, Dog, Loader2, PawPrint, Pencil, Plus, Rabbit, Trash2, X } from "lucide-react";
import { petAgeFromDob } from "@/lib/format";
import type { Pet } from "@/lib/types";

export function PetAvatar({ species, size = 26 }: { species: string; size?: number }) {
  const Icon = species === "Dog" ? Dog : species === "Cat" ? Cat : species === "Bird" ? Bird : species === "Rabbit" ? Rabbit : PawPrint;
  return <Icon size={size} />;
}

type PetFormState = {
  name: string; species: string; breed: string; gender: string; dob: string;
  weightKg: string; color: string; microchip: string; notes: string;
};

const EMPTY: PetFormState = { name: "", species: "Dog", breed: "", gender: "", dob: "", weightKg: "", color: "", microchip: "", notes: "" };

export function PetForm({ pet, ownerUserId, onDone }: { pet?: Pet | null; ownerUserId?: string; onDone?: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState<PetFormState>(pet ? { ...pet } : EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key: keyof PetFormState, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim()) { setError("Please enter your pet's name."); return; }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(pet ? `/api/pets/${pet.id}` : "/api/pets", {
        method: pet ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...(ownerUserId ? { userId: ownerUserId } : {}) }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not save this pet.");
      if (!pet) setForm(EMPTY);
      router.refresh();
      onDone?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this pet.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={submit} noValidate>
      {error && <div className="form-error-summary field-full" role="alert">{error}</div>}
      <div className="field">
        <label htmlFor="pet-name">Pet name <span>*</span></label>
        <input id="pet-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Bruno" />
      </div>
      <div className="field">
        <label htmlFor="pet-species">Species <span>*</span></label>
        <select id="pet-species" value={form.species} onChange={(e) => set("species", e.target.value)}>
          <option>Dog</option><option>Cat</option><option>Bird</option><option>Rabbit</option><option>Other</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="pet-breed">Breed</label>
        <input id="pet-breed" value={form.breed} onChange={(e) => set("breed", e.target.value)} placeholder="e.g. Persian, Labrador" />
      </div>
      <div className="field">
        <label htmlFor="pet-gender">Gender</label>
        <select id="pet-gender" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
          <option value="">Select</option><option>Male</option><option>Female</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="pet-dob">Date of birth or age</label>
        <input id="pet-dob" value={form.dob} onChange={(e) => set("dob", e.target.value)} placeholder="YYYY-MM-DD or “2 years”" />
      </div>
      <div className="field">
        <label htmlFor="pet-weight">Weight (kg)</label>
        <input id="pet-weight" value={form.weightKg} onChange={(e) => set("weightKg", e.target.value)} inputMode="decimal" placeholder="e.g. 12.5" />
      </div>
      <div className="field">
        <label htmlFor="pet-color">Colour / markings</label>
        <input id="pet-color" value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="e.g. White with grey patches" />
      </div>
      <div className="field">
        <label htmlFor="pet-chip">Microchip no. <span className="optional">if any</span></label>
        <input id="pet-chip" value={form.microchip} onChange={(e) => set("microchip", e.target.value)} placeholder="Microchip number" />
      </div>
      <div className="field field-full">
        <label htmlFor="pet-notes">Notes for our vets</label>
        <textarea id="pet-notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Allergies, temperament, ongoing medication…" />
      </div>
      <div className="field-full">
        <button type="submit" className="button button-primary" disabled={busy}>
          {busy ? <Loader2 size={16} className="spin" /> : pet ? <Pencil size={16} /> : <Plus size={16} />}
          {busy ? "Saving…" : pet ? "Save changes" : "Add pet & create passport"}
        </button>
      </div>
    </form>
  );
}

export function PetsManager({ pets, basePath = "/dashboard/pets", detailPath }: { pets: Pet[]; basePath?: string; detailPath?: (pet: Pet) => string }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Pet | null>(null);
  const [busy, setBusy] = useState(false);
  const hrefFor = (pet: Pet) => detailPath ? detailPath(pet) : `${basePath}/${pet.id}`;

  async function remove() {
    if (!confirmDelete) return;
    setBusy(true);
    await fetch(`/api/pets/${confirmDelete.id}`, { method: "DELETE" });
    setBusy(false);
    setConfirmDelete(null);
    router.refresh();
  }

  return (
    <div>
      {pets.length === 0 && !showForm && (
        <div className="empty-note" style={{ marginBottom: 18 }}>
          <PawPrint size={26} />
          <strong>No pets yet</strong>
          Add your first pet to create their free Digital Pet Passport — vaccinations, visit history and records in one place.
        </div>
      )}
      <div className="pet-cards">
        {pets.map((pet) => (
          <article className="pet-card" key={pet.id}>
            <span className="pet-avatar"><PetAvatar species={pet.species} /></span>
            <div style={{ minWidth: 0 }}>
              <h3>{pet.name}</h3>
              <p className="pet-meta-line">{pet.species}{pet.breed ? ` · ${pet.breed}` : ""} · {petAgeFromDob(pet)}</p>
              <span className="passport-no">PASSPORT {pet.passportId}</span>
            </div>
            <div className="pet-card-actions">
              <Link href={hrefFor(pet)} className="mini-link">Open passport <ArrowRight size={12} style={{ verticalAlign: -2 }} /></Link>
              {basePath.startsWith("/dashboard") && <Link href={`/book?pet=${pet.id}`} className="mini-link"><CalendarPlus size={12} style={{ verticalAlign: -2 }} /> Book visit</Link>}
              <button type="button" className="mini-link" style={{ background: "none", border: 0, cursor: "pointer", color: "#a9241b", padding: 0 }} onClick={() => setConfirmDelete(pet)}><Trash2 size={12} style={{ verticalAlign: -2 }} /> Remove</button>
            </div>
          </article>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        {!showForm ? (
          <button type="button" className="button button-gold" onClick={() => setShowForm(true)}><Plus size={16} /> Add a pet</button>
        ) : (
          <div className="portal-card">
            <div className="card-head-row">
              <h2>Add a new pet</h2>
              <button type="button" className="icon-btn" onClick={() => setShowForm(false)} aria-label="Close form"><X size={16} /></button>
            </div>
            <PetForm onDone={() => setShowForm(false)} />
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-label="Confirm remove pet">
          <div className="dialog" style={{ maxWidth: 440 }}>
            <h2>Remove {confirmDelete.name}?</h2>
            <p className="dialog-sub">This permanently deletes {confirmDelete.name}&apos;s Digital Pet Passport and vaccination records. Past appointment slips remain in your history.</p>
            <div className="dialog-actions">
              <button type="button" className="button button-danger-outline" onClick={remove} disabled={busy}>{busy ? "Removing…" : "Yes, remove pet"}</button>
              <span className="spacer" />
              <button type="button" className="button button-outline" onClick={() => setConfirmDelete(null)}>Keep pet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
