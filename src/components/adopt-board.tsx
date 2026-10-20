"use client";

import { useMemo, useState } from "react";
import { HeartHandshake } from "lucide-react";
import { AdoptCard } from "@/components/cards";
import type { Adoption } from "@/lib/types";

const FILTERS = ["All", "Dog", "Cat", "Rabbit", "Bird"] as const;

export function AdoptBoard({ pets }: { pets: Adoption[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const filtered = useMemo(() => filter === "All" ? pets : pets.filter((pet) => pet.species === filter), [pets, filter]);
  const countFor = (key: (typeof FILTERS)[number]) => key === "All" ? pets.length : pets.filter((pet) => pet.species === key).length;

  return (
    <div>
      <div className="tab-pills no-print" role="tablist" aria-label="Filter pets by species">
        {FILTERS.map((key) => (
          <button key={key} type="button" role="tab" aria-selected={filter === key} className={filter === key ? "active" : ""} onClick={() => setFilter(key)}>
            {key === "All" ? "All pets" : `${key}s`} · {countFor(key)}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-note"><HeartHandshake size={24} /><strong>No {filter === "All" ? "pets" : `${filter.toLowerCase()}s`} listed right now</strong>New listings arrive often — check back soon, or WhatsApp us and we&apos;ll keep an eye out for you.</div>
      ) : (
        <div className="adopt-grid">
          {filtered.map((pet) => <AdoptCard pet={pet} key={pet.id} />)}
        </div>
      )}
    </div>
  );
}
