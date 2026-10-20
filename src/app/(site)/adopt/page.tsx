import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, HeartHandshake, ShieldCheck, Stethoscope, Syringe } from "lucide-react";
import { Breadcrumbs, CheckList, Eyebrow, SectionHead } from "@/components/ui";
import { AdoptionCard } from "@/components/cards";
import { rows } from "@/server/store";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Adopt a pet in Lahore — vet-checked cats, dogs and rabbits",
  "Meet the pets looking for homes through Jawad Veterinary Hospital in Lahore. Every animal is examined, dewormed and vaccinated before listing, with follow-up care included.",
  "/adopt",
  "/images/adopt-1.jpg",
);

export default async function AdoptPage() {
  const pets = await rows("adoption");
  const available = pets.filter((p) => p.status === "available");
  const reserved = pets.filter((p) => p.status !== "available");

  return (
    <>
      <section className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: "Adopt a pet" }]} />
          <SectionHead
            eyebrow="The adoption desk"
            title="Adopt a Pet"
            lead="Give a loving animal a forever home. These pets were rescued, surrendered or born to a clinic patient — each is examined, dewormed and vaccinated before listing, with the first year of follow-up care on us."
            action={<Link href="/contact-vet-lahore" className="button button-ghost button-sm">Ask about adopting <ArrowRight size={15} /></Link>}
          />
          <div className="grid cols-4" style={{ gap: 12, marginTop: 28 }}>
            {[
              { icon: <Stethoscope size={17} />, t: "Vet-checked", d: "Full examination before any listing goes live" },
              { icon: <Syringe size={17} />, t: "Vaccinated & dewormed", d: "Age-appropriate, with a record card" },
              { icon: <ShieldCheck size={17} />, t: "Home visit included", d: "Settle-in check at your home, no charge" },
              { icon: <HeartHandshake size={17} />, t: "Not a purchase", d: "No fee — just a real commitment" },
            ].map((item) => (
              <div key={item.t} className="card card-pad" style={{ display: "grid", gap: 7 }}>
                <span className="service-icon" style={{ width: 34, height: 34, marginBottom: 0 }}>{item.icon}</span>
                <b style={{ fontSize: 14 }}>{item.t}</b>
                <span className="tiny muted">{item.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 18 }}>
        <div className="container">
          <div className="section-head-between" style={{ marginBottom: 22 }}>
            <div>
              <Eyebrow>Available now</Eyebrow>
              <h2 style={{ margin: "10px 0 0", fontSize: 30 }}>{available.length} animal{available.length === 1 ? "" : "s"} waiting</h2>
            </div>
            <span className="pill pill-soft">Applications reviewed in order</span>
          </div>
          <div className="grid cols-3">
            {available.map((pet) => <AdoptionCard key={pet.id} pet={pet} />)}
          </div>
          {!available.length ? (
            <div className="empty"><h3>No listings this week</h3><p>All our current rescues are spoken for. Message the clinic to be added to the waiting list.</p></div>
          ) : null}
        </div>
      </section>

      {reserved.length ? (
        <section className="section band">
          <div className="container">
            <SectionHead eyebrow="In progress" title="Reserved or already home" lead="Kept here for transparency — and because their new families still send us photos." />
            <div className="grid cols-3" style={{ marginTop: 24 }}>
              {reserved.map((pet) => <AdoptionCard key={pet.id} pet={pet} />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <div className="split">
            <div>
              <Eyebrow>How adoption works here</Eyebrow>
              <h2 style={{ margin: "12px 0 18px" }}>Four steps, <em>no fee.</em></h2>
              <div className="grid" style={{ gap: 12 }}>
                {[
                  ["Meet properly", "Come to the hospital for an unhurried introduction — bring your children and any existing dog."],
                  ["Home check", "A quick visit to confirm the space, the boundary walls and that everyone is on board."],
                  ["Adoption day", "Vaccination card, deworming dates and a starter food portion go home with them."],
                  ["First-year follow-up", "Settle-in check, free consults and a discounted neutering slot when age allows."],
                ].map(([title, detail], i) => (
                  <div key={title} className="card card-pad" style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 14 }}>
                    <span style={{ fontFamily: "var(--serif)", fontSize: 24, color: "var(--brass)" }}>{`0${i + 1}`}</span>
                    <div><b style={{ fontSize: 14.5 }}>{title}</b><p className="small muted" style={{ margin: "4px 0 0" }}>{detail}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card card-pad">
              <h3 style={{ fontSize: 20 }}>What we ask of you</h3>
              <div style={{ marginTop: 14 }}>
                <CheckList items={[
                  "Indoor access at night and a shaded area during the day",
                  "Regular rubella/rabies vaccination — we will do the first one free",
                  "Neutering once age-appropriate, at our cost",
                  "A phone number that stays active, and a photo now and then",
                  "If life changes, the animal comes back to us — never to the street",
                ]} />
              </div>
              <div className="row" style={{ gap: 10, marginTop: 18 }}>
                <Link href="/contact-vet-lahore" className="button button-primary button-sm">Start an application <ArrowRight size={14} /></Link>
                <Link href="/team" className="button button-ghost button-sm">Meet the team</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
