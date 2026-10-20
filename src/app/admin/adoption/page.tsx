import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, HeartHandshake, Plus } from "lucide-react";
import { DialogForm, type FieldDef } from "@/components/forms";
import { InlineButton } from "@/components/admin/inline-form";
import { saveAdoption, setAdoptionStatus } from "@/server/actions/admin";
import { rows } from "@/server/store";
import { dateLabel } from "@/lib/format";

export default async function AdminAdoption() {
  const pets = await rows("adoption");
  const available = pets.filter((p) => p.status === "available").length;

  const fields = (pet?: typeof pets[number]): FieldDef[] => [
    { name: "id", label: "id", type: "hidden", defaultValue: pet?.id },
    { name: "name", label: "Name", required: true, defaultValue: pet?.name },
    { name: "species", label: "Species", type: "select", options: ["Dog", "Cat", "Rabbit", "Bird", "Other"], defaultValue: pet?.species ?? "Cat" },
    { name: "breed", label: "Breed", defaultValue: pet?.breed },
    { name: "age", label: "Age", defaultValue: pet?.age, placeholder: "4 months" },
    { name: "sex", label: "Sex", type: "select", options: ["Unknown", "Male", "Female"], defaultValue: pet?.sex ?? "Unknown" },
    { name: "status", label: "Status", type: "select", options: ["available", "reserved", "adopted"], defaultValue: pet?.status ?? "available" },
    { name: "image", label: "Photo", type: "image", defaultValue: pet?.image ?? "/images/adopt-1.jpg", span: 2 },
    { name: "story", label: "Story", type: "textarea", rows: 4, span: 2, defaultValue: pet?.story },
    { name: "traits", label: "Traits", type: "list", defaultValue: pet?.traits ?? [], span: 2 },
    { name: "vaccinated", label: "Vaccinated", type: "toggle", defaultValue: pet?.vaccinated ?? false },
    { name: "dewormed", label: "Dewormed", type: "toggle", defaultValue: pet?.dewormed ?? false },
  ];

  return (
    <>
      <div className="kpi-grid">
        {[
          { label: "Listings", value: String(pets.length), sub: `${available} available now` },
          { label: "Reserved", value: String(pets.filter((p) => p.status === "reserved").length), sub: "Home checks in progress" },
          { label: "Adopted", value: String(pets.filter((p) => p.status === "adopted").length), sub: "Rehomed through the clinic" },
          { label: "Vaccinated", value: `${pets.filter((p) => p.vaccinated).length}/${pets.length}`, sub: "Before listing" },
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
          <div><h2>Adoption desk</h2><p>Every animal is examined, dewormed and vaccinated before it is listed.</p></div>
          <span className="spacer" />
          <DialogForm action={saveAdoption} title="New adoption listing" trigger={<button type="button" className="button button-primary button-sm"><Plus size={15} /> Add an animal</button>} fields={fields()} submitLabel="Publish listing" />
        </div>
        <div className="app-card-body grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))" }}>
          {pets.map((pet) => (
            <article key={pet.id} className="card" style={{ overflow: "hidden" }}>
              <div style={{ position: "relative", aspectRatio: "16/10" }}>
                <Image src={pet.image} alt={pet.name} fill sizes="30vw" className="object-cover" unoptimized />
                <span className={`status status-${pet.status}`} style={{ position: "absolute", top: 10, right: 10 }}>{pet.status}</span>
              </div>
              <div className="card-pad col" style={{ gap: 8 }}>
                <div className="row-between" style={{ gap: 8 }}>
                  <b style={{ fontSize: 15 }}>{pet.name}</b>
                  <span className="tiny muted">listed {dateLabel(pet.postedAt)}</span>
                </div>
                <span className="tiny muted">{pet.species} · {pet.breed} · {pet.age} · {pet.sex}</span>
                <p className="tiny" style={{ margin: 0, color: "var(--ink-2)" }}>{pet.story.slice(0, 110)}…</p>
                <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                  <InlineButton action={setAdoptionStatus} payload={{ id: pet.id, status: "available" }} className="button button-ghost button-xs">Available</InlineButton>
                  <InlineButton action={setAdoptionStatus} payload={{ id: pet.id, status: "reserved" }} className="button button-ghost button-xs">Reserved</InlineButton>
                  <InlineButton action={setAdoptionStatus} payload={{ id: pet.id, status: "adopted" }} className="button button-primary button-xs"><HeartHandshake size={12} /> Adopted</InlineButton>
                </div>
                <div className="row" style={{ gap: 8, borderTop: "1px solid var(--line)", paddingTop: 8 }}>
                  <DialogForm action={saveAdoption} title={`Edit ${pet.name}`} trigger={<button type="button" className="link-arrow" style={{ fontSize: 11.5 }}>Edit listing</button>} fields={fields(pet)} values={{ id: pet.id, name: pet.name, species: pet.species, breed: pet.breed, age: pet.age, sex: pet.sex, status: pet.status, image: pet.image, story: pet.story, traits: pet.traits, vaccinated: pet.vaccinated, dewormed: pet.dewormed }} submitLabel="Save listing" />
                  <span className="spacer" />
                  <Link href={`/adopt/${pet.id}`} target="_blank" className="link-arrow" style={{ fontSize: 11.5 }}>Public page <ArrowUpRight size={12} /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
