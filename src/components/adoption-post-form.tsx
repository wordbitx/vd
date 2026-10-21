"use client";

import { useActionState } from "react";
import { Check, PawPrint } from "lucide-react";
import { postAdoptionListing, type AdoptionPostResult } from "@/server/actions/adoption";

const SPECIES = ["Dog", "Cat", "Rabbit", "Bird", "Other"];
const SEXES = ["Male", "Female", "Unknown"];

export function AdoptionPostForm() {
  const [state, formAction, pending] = useActionState<AdoptionPostResult | null, FormData>(postAdoptionListing, null);
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="col" style={{ gap: 14 }} noValidate>
      <div className="r-form-grid">
        <div className="field">
          <label className="label" htmlFor="ap-name">Pet&apos;s name *</label>
          <input id="ap-name" name="name" className={`input${errors.name ? " input-error" : ""}`} placeholder="Mochi" />
          {errors.name ? <span className="field-error">{errors.name}</span> : null}
        </div>
        <div className="field">
          <label className="label" htmlFor="ap-species">Species *</label>
          <select id="ap-species" name="species" className="select" defaultValue="Cat">
            {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor="ap-breed">Breed</label>
          <input id="ap-breed" name="breed" className="input" placeholder="Persian mix" />
        </div>
        <div className="field">
          <label className="label" htmlFor="ap-age">Age</label>
          <input id="ap-age" name="age" className="input" placeholder="4 months" />
        </div>
        <div className="field">
          <label className="label" htmlFor="ap-sex">Sex</label>
          <select id="ap-sex" name="sex" className="select" defaultValue="Unknown">
            {SEXES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor="ap-contact">Contact number</label>
          <input id="ap-contact" name="contact" type="tel" className="input" placeholder="0300 1234567" />
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor="ap-story">Their story *</label>
        <textarea
          id="ap-story"
          name="story"
          rows={5}
          className={`textarea${errors.story ? " input-error" : ""}`}
          placeholder="How they came to you, what they are like, and what kind of home would suit them."
        />
        {errors.story ? <span className="field-error">{errors.story}</span> : null}
      </div>
      <div className="row" style={{ gap: 18, flexWrap: "wrap" }}>
        <label className="row" style={{ gap: 8, fontSize: 12.5, fontWeight: 700 }}>
          <input type="checkbox" name="vaccinated" /> Vaccinated
        </label>
        <label className="row" style={{ gap: 8, fontSize: 12.5, fontWeight: 700 }}>
          <input type="checkbox" name="dewormed" /> Dewormed
        </label>
      </div>
      {state && !state.ok && state.message ? <p className="notice notice-error" style={{ margin: 0 }}>{state.message}</p> : null}
      {state?.ok ? <p className="notice notice-ok" style={{ margin: 0 }}><Check size={15} /> {state.message}</p> : null}
      <div>
        <button className="r-btn r-btn-teal r-btn-lg" type="submit" disabled={pending}>
          <PawPrint size={15} /> {pending ? "Publishing…" : "Publish listing"}
        </button>
        <p className="tiny muted" style={{ margin: "8px 0 0" }}>
          The clinic reviews every listing. Add a photo over WhatsApp after posting if you have one.
        </p>
      </div>
    </form>
  );
}
