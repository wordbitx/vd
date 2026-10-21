import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PawPrint } from "lucide-react";
import { AdoptionCard } from "@/components/cards";
import { business } from "@/lib/site";
import { rows } from "@/server/store";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Adopt a pet in Lahore — vet-checked dogs, cats and rabbits",
  "Find your perfect companion. Every pet listed by Jawad Veterinary Hospital is examined, dewormed and vaccinated before adoption, with follow-up care included.",
  "/adopt",
  "/images/adopt-1.jpg",
);

type Species = "Dog" | "Cat" | "Rabbit";

const FILTERS: { key: Species | "all"; label: string }[] = [
  { key: "all", label: "All Pets" },
  { key: "Dog", label: "Dog" },
  { key: "Cat", label: "Cat" },
  { key: "Rabbit", label: "Rabbit" },
];

export default async function AdoptPage({ searchParams }: { searchParams: Promise<{ species?: string; posted?: string }> }) {
  const [{ species, posted }, pets] = await Promise.all([searchParams, rows("adoption")]);
  const list = species ? pets.filter((p) => p.species.toLowerCase() === species.toLowerCase()) : pets;

  return (
    <>
      <section className="r-pagehero r-pagehero-centered">
        <div className="r-wrap">
          <div className="r-adopt-hero">
            <span className="r-adopt-mark" aria-hidden="true">
              <PawPrint size={22} />
            </span>
            <span className="r-adopt-wordmark">{business.name}</span>
            <h1>Find Your Perfect Companion</h1>
            <p>Give a loving pet the forever home they deserve.</p>
            <div className="r-filters r-filters-center">
              {FILTERS.map((item) => (
                <Link
                  key={item.key}
                  href={item.key === "all" ? "/adopt" : `/adopt?species=${item.key}`}
                  className="r-filter"
                  data-active={item.key === "all" ? (!species ? "true" : undefined) : species === item.key ? "true" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 26 }}>
        <div className="r-wrap">
          {posted ? (
            <p className="r-note" style={{ marginBottom: 22 }}>
              <PawPrint size={15} /> Thank you — your listing is live. The clinic will review it and may call to confirm details.
            </p>
          ) : null}
          {list.length ? (
            <div className="r-adopts">
              {list.map((pet) => <AdoptionCard key={pet.id} pet={pet} />)}
            </div>
          ) : (
            <div className="r-empty">
              <p style={{ margin: 0 }}>
                No {species?.toLowerCase()}s are listed right now — <Link href="/adopt" className="r-link">see every pet</Link>.
              </p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <Link href="/adopt/post" className="r-btn r-btn-outline r-btn-lg">
              Post Pet
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
