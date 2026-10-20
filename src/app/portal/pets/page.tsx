import Link from "next/link";
import { ArrowRight, Plus, ShieldCheck } from "lucide-react";
import { ActionForm, DialogForm, type FieldDef } from "@/components/forms";
import { Empty, Eyebrow } from "@/components/ui";
import { PetPassportCard } from "@/components/portal/pet-passport";
import { removePet, savePet } from "@/server/actions/account";
import { petsForUser } from "@/server/queries";
import { requireUser } from "@/server/auth";

const petFields: FieldDef[] = [
  { name: "name", label: "Pet's name", required: true, placeholder: "Scottie" },
  { name: "species", label: "Species", type: "select", options: ["Dog", "Cat", "Rabbit", "Bird", "Reptile", "Other"], defaultValue: "Dog" },
  { name: "breed", label: "Breed", placeholder: "Golden Retriever" },
  { name: "sex", label: "Sex", type: "select", options: ["Unknown", "Male", "Female"], defaultValue: "Unknown" },
  { name: "dob", label: "Date of birth (if known)", type: "date" },
  { name: "weightKg", label: "Weight (kg)", type: "number", step: 0.1, placeholder: "27.4" },
  { name: "colour", label: "Colour / markings", placeholder: "Cream" },
  { name: "microchip", label: "Microchip number", placeholder: "528000012345678" },
  { name: "allergies", label: "Known allergies", span: 2, placeholder: "Chicken-flavoured treats cause itching" },
  { name: "notes", label: "Notes for the veterinary team", type: "textarea", rows: 3, span: 2, placeholder: "Nervous around strangers — feed treats from the floor." },
];

export default async function PortalPets() {
  const user = await requireUser();
  const pets = await petsForUser(user.id);

  return (
    <>
      <section className="app-card">
        <div className="app-card-head">
          <div>
            <h2>Pet passports</h2>
            <p>{pets.length} pet{pets.length === 1 ? "" : "s"} on this account. The clinic keeps the same record — every vaccine batch and consult note.</p>
          </div>
          <span className="spacer" />
          <DialogForm action={savePet} title="Add a pet" description="A recorded weight and date of birth make dosing and vaccine schedules accurate." trigger={<button className="button button-primary button-sm" type="button"><Plus size={15} /> Add a pet</button>} fields={petFields} submitLabel="Add to my passport" />
        </div>
        <div className="app-card-body col" style={{ gap: 14 }}>
          {pets.length ? pets.map((pet) => (
            <div key={pet.id} className="col" style={{ gap: 10 }}>
              <PetPassportCard pet={pet} />
              <div className="row" style={{ gap: 8, marginTop: -2 }}>
                <DialogForm action={savePet} title={`Edit ${pet.name}`} description="Changes are visible to the veterinarian on the next visit." trigger={<button className="button button-ghost button-xs" type="button">Edit details</button>} fields={[{ name: "id", type: "hidden", label: "id", defaultValue: pet.id }, ...petFields]} values={{ id: pet.id, name: pet.name, species: pet.species, breed: pet.breed, sex: pet.sex, dob: pet.dob, weightKg: pet.weightKg, colour: pet.colour, microchip: pet.microchip, allergies: pet.allergies, notes: pet.notes }} submitLabel="Save changes" />
                <Link href={`/portal/records?pet=${pet.id}`} className="button button-ghost button-xs">Records &amp; vaccines</Link>
                <Link href={`/book-vet-appointment-lahore?service=general-checkup`} className="button button-ghost button-xs">Book a visit</Link>
                <span className="spacer" />
                <DialogForm action={removePet} title={`Remove ${pet.name}?`} description="Past consultations and vaccination history stay with the clinic. You can add the pet again later." trigger={<button className="button button-ghost button-xs" type="button" style={{ color: "var(--danger)" }}>Remove</button>} fields={[{ name: "id", type: "hidden", label: "id", defaultValue: pet.id }]} submitLabel="Remove from my passport" />
              </div>
            </div>
          )) : (
            <Empty title="No pets on this account yet" icon={<ShieldCheck size={24} />}>
              Add your first pet to unlock vaccine reminders and printable records.
            </Empty>
          )}
        </div>
      </section>

      <section className="grid cols-2">
        <div className="app-card">
          <div className="app-card-head"><div><h2>Why we ask for these details</h2><p>Weight-based dosing is not a formality.</p></div></div>
          <div className="app-card-body col" style={{ gap: 10 }}>
            {[
              ["Weight", "Dewormers, antibiotics and anaesthesia are all dosed per kilogram. A 3 kg cat and a 30 kg dog are not the same prescription."],
              ["Date of birth", "Vaccine and deworming schedules run on age, and senior screening starts earlier than most owners expect."],
              ["Microchip", "If your pet is ever scanned at another clinic or a shelter, this connects them back to your file instantly."],
              ["Allergies", "Printed on the treatment sheet the veterinarian takes into the room."],
            ].map(([title, detail]) => (
              <div key={title} className="col" style={{ gap: 2, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
                <b style={{ fontSize: 13.5 }}>{title}</b>
                <span className="small muted">{detail}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="app-card">
          <div className="app-card-head"><div><h2>Record access</h2><p>Yours, without a phone call.</p></div></div>
          <div className="app-card-body col" style={{ gap: 12 }}>
            <p className="small muted" style={{ margin: 0 }}>
              Every consult note, vaccine batch number and lab report the clinic holds is visible in <b>Records &amp; vaccines</b>. Need a
              stamped copy for travel, boarding or a new vet? Ask in messages and we will prepare a signed PDF.
            </p>
            <div className="row" style={{ gap: 9 }}>
              <Link href="/portal/records" className="button button-dark button-sm">Open records <ArrowRight size={14} /></Link>
              <Link href="/portal/messages" className="button button-ghost button-sm">Request a signed copy</Link>
            </div>
            <Eyebrow>Privacy</Eyebrow>
            <p className="tiny muted" style={{ margin: 0 }}>
              Only you and the treating clinic staff can see this file. Every access is written to the clinic audit log.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
