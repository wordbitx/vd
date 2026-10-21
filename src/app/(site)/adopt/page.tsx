import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Cat, Dog, HeartHandshake, PawPrint, Rabbit, ShieldCheck, Syringe, Stethoscope } from "lucide-react";
import { AdoptionCard } from "@/components/cards";
import { WhatsAppIcon } from "@/components/icons";
import { business } from "@/lib/site";
import { rows } from "@/server/store";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Adopt a pet in Lahore — vet-checked cats, dogs and rabbits",
  "Meet the pets looking for homes through Jawad Veterinary Hospital in Lahore. Every animal is examined, dewormed and vaccinated before listing, with follow-up care included.",
  "/adopt",
  "/images/adopt-1.jpg",
);

const SPECIES = [
  { key: "", label: "All Pets", icon: <PawPrint size={14} /> },
  { key: "Dog", label: "Dogs", icon: <Dog size={14} /> },
  { key: "Cat", label: "Cats", icon: <Cat size={14} /> },
  { key: "Rabbit", label: "Rabbits", icon: <Rabbit size={14} /> },
];

export default async function AdoptPage({ searchParams }: { searchParams: Promise<{ species?: string }> }) {
  const [{ species }, pets] = await Promise.all([searchParams, rows("adoption")]);
  const available = pets.filter((p) => p.status === "available");
  const reserved = pets.filter((p) => p.status !== "available");
  const list = species ? available.filter((p) => p.species.toLowerCase() === species.toLowerCase()) : available;

  return (
    <>
      <section className="r-pagehero r-pagehero-centered">
        <div className="r-wrap">
          <div className="r-adopt-hero">
            <span className="r-adopt-mark" aria-hidden="true">
              <PawPrint size={22} />
            </span>
            <span className="label" style={{ justifyContent: "center" }}>Find a friend · Lahore</span>
            <h1>Find Your Perfect Companion</h1>
            <p>
              Give a loving pet the forever home they deserve. These animals were rescued, surrendered or born to a clinic
              patient — each is examined, dewormed and vaccinated before listing, with the first year of follow-up care on us.
            </p>
            <div className="r-filters r-filters-center">
              {SPECIES.map((item) => (
                <Link
                  key={item.key || "all"}
                  href={item.key ? `/adopt?species=${item.key}` : "/adopt"}
                  className="r-filter"
                  data-active={!species && !item.key ? "true" : species === item.key ? "true" : undefined}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
            <span className="r-chip r-chip-peach">
              <ShieldCheck size={12} /> {available.length} waiting for a home
            </span>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 26 }}>
        <div className="r-wrap">
          <div className="r-head-row" style={{ marginBottom: 22 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 26 }}>
                {list.length} animal{list.length === 1 ? "" : "s"} looking for a family
              </h2>
              <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "var(--r-muted)" }}>Applications reviewed in order · no adoption fee</p>
            </div>
            <Link href="/contact-vet-lahore" className="r-btn r-btn-teal r-btn-sm">Post a pet for adoption <ArrowRight size={14} /></Link>
          </div>
          {list.length ? (
            <div className="r-cards r-cards-4">
              {list.map((pet) => <AdoptionCard key={pet.id} pet={pet} />)}
            </div>
          ) : (
            <div className="r-empty">
              <h3 style={{ margin: "0 0 8px" }}>No {species ? species.toLowerCase() : ""} listings this week</h3>
              <p style={{ margin: "0 0 16px", color: "var(--r-muted)", fontSize: 13.5 }}>
                All our current rescues in this group are spoken for. Message the clinic to join the waiting list.
              </p>
              <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="r-btn r-btn-green">
                <WhatsAppIcon size={14} /> Ask about the next arrival
              </a>
            </div>
          )}

          <div className="r-tiles r-tiles-4" style={{ marginTop: 26 }}>
            {[
              { icon: <Stethoscope size={17} />, t: "Vet-checked", d: "Full examination before any listing goes live" },
              { icon: <Syringe size={17} />, t: "Vaccinated & dewormed", d: "Age-appropriate, with a record card" },
              { icon: <ShieldCheck size={17} />, t: "Home visit included", d: "Settle-in check at your home, no charge" },
              { icon: <HeartHandshake size={17} />, t: "Not a purchase", d: "No fee — just a real commitment" },
            ].map((item) => (
              <div key={item.t} className="r-tile">
                <span className="r-tile-icon">{item.icon}</span>
                <b>{item.t}</b>
                <span>{item.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {reserved.length ? (
        <section className="r-section r-section-white" style={{ paddingTop: 0 }}>
          <div className="r-wrap">
            <div className="r-rulehead"><h2>Reserved or already home</h2></div>
            <p style={{ margin: "-10px 0 22px", fontSize: 13.5, color: "var(--r-muted)", maxWidth: "60ch" }}>
              Kept here for transparency — and because their new families still send us photos.
            </p>
            <div className="r-cards r-cards-4">
              {reserved.map((pet) => <AdoptionCard key={pet.id} pet={pet} />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="r-section">
        <div className="r-wrap">
          <div className="r-grid-2" style={{ alignItems: "start", gap: 24 }}>
            <div>
              <span className="label"><HeartHandshake size={14} /> How adoption works here</span>
              <h2 style={{ margin: "10px 0 18px" }}>Four steps, no fee</h2>
              <div className="r-flow">
                {[
                  ["Meet properly", "Come to the hospital for an unhurried introduction — bring your children and any existing dog."],
                  ["Home check", "A quick visit to confirm the space, the boundary walls and that everyone is on board."],
                  ["Adoption day", "Vaccination card, deworming dates and a starter food portion go home with them."],
                  ["First-year follow-up", "Settle-in check, free consults and a discounted neutering slot when age allows."],
                ].map(([title, detail], i) => (
                  <div key={title} className="r-flow-item">
                    <span className="r-flow-n">0{i + 1}</span>
                    <div><b>{title}</b><p>{detail}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="r-panel-dark" style={{ alignContent: "center", display: "grid" }}>
              <span className="r-kicker" style={{ color: "#e7b39a" }}>Before you apply</span>
              <h2 style={{ margin: "10px 0 12px", fontSize: 26 }}>What we ask of you</h2>
              <ul className="r-checks r-checks-dark" style={{ marginBottom: 20 }}>
                {[
                  "Indoor access at night and a shaded area during the day",
                  "Regular rabies and core vaccination — we do the first one free",
                  "Neutering once age-appropriate, at our cost",
                  "A phone number that stays active, and a photo now and then",
                  "If life changes, the animal comes back to us — never to the street",
                ].map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="r-band-actions">
                <Link href="/contact-vet-lahore" className="r-btn r-btn-orange">Start an application <ArrowRight size={14} /></Link>
                <Link href="/team" className="r-btn r-btn-ghost-dark">Meet the team</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
