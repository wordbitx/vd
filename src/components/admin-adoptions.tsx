"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, HeartHandshake, Trash2, X } from "lucide-react";
import type { Adoption, AdoptionStatus } from "@/lib/types";

const TABS: { key: AdoptionStatus | "all"; label: string }[] = [
  { key: "pending", label: "Pending review" },
  { key: "available", label: "Live" },
  { key: "adopted", label: "Adopted" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

const TONES: Record<AdoptionStatus, string> = { pending: "tone-amber", available: "tone-green", adopted: "tone-blue", rejected: "tone-red" };

export function AdminAdoptions({ adoptions }: { adoptions: Adoption[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<AdoptionStatus | "all">("pending");
  const filtered = useMemo(() => tab === "all" ? adoptions : adoptions.filter((a) => a.status === tab), [adoptions, tab]);
  const counts = useMemo(() => ({
    pending: adoptions.filter((a) => a.status === "pending").length,
    available: adoptions.filter((a) => a.status === "available").length,
    adopted: adoptions.filter((a) => a.status === "adopted").length,
    rejected: adoptions.filter((a) => a.status === "rejected").length,
    all: adoptions.length,
  }), [adoptions]);

  async function setStatus(id: string, status: AdoptionStatus) {
    await fetch(`/api/adoptions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    router.refresh();
  }
  async function remove(id: string) {
    await fetch(`/api/adoptions/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="tab-pills no-print" role="tablist" aria-label="Adoption status filter">
        {TABS.map((item) => (
          <button key={item.key} type="button" role="tab" aria-selected={tab === item.key} className={tab === item.key ? "active" : ""} onClick={() => setTab(item.key)}>
            {item.label} · {counts[item.key]}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-note"><HeartHandshake size={24} /><strong>Nothing in this list</strong>Listings will appear here as customers post pets for adoption.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table" style={{ minWidth: 780 }}>
            <thead><tr><th>Pet</th><th>Details</th><th>Health</th><th>Area</th><th>Status</th><th aria-label="Actions" /></tr></thead>
            <tbody>
              {filtered.map((pet) => (
                <tr key={pet.id}>
                  <td>
                    <span style={{ display: "flex", gap: 11, alignItems: "center" }}>
                      <span style={{ position: "relative", width: 48, height: 48, borderRadius: 9, overflow: "hidden", flex: "none", display: "block", background: "#e9e2d0" }}>
                        <Image src={pet.image} alt={pet.name} fill sizes="48px" className="object-cover" />
                      </span>
                      <span><span className="cell-strong" style={{ textTransform: "capitalize" }}>{pet.name}</span><span className="cell-sub">{pet.breed || pet.species} · {pet.gender}</span></span>
                    </span>
                  </td>
                  <td>{pet.ageGroup}{pet.ageText ? ` · ${pet.ageText}` : ""}<span className="cell-sub" style={{ maxWidth: 260, whiteSpace: "normal" }}>{pet.description.slice(0, 90)}…</span></td>
                  <td>
                    {pet.vaccinated ? <span className="badge tone-green">Vaccinated</span> : <span className="badge tone-grey">Not vaccinated</span>}
                    <span className="cell-sub">{pet.dewormed ? "Dewormed" : "Not dewormed"}{pet.litterTrained ? " · Litter trained" : ""}</span>
                  </td>
                  <td>{pet.area}</td>
                  <td><span className={`badge ${TONES[pet.status]}`}>{pet.status === "available" ? "Live" : pet.status[0].toUpperCase() + pet.status.slice(1)}</span></td>
                  <td>
                    <div className="row-actions">
                      {pet.status === "pending" && <button type="button" className="icon-btn" onClick={() => setStatus(pet.id, "available")} aria-label={`Approve ${pet.name}`} title="Approve & publish"><Check size={15} /></button>}
                      {pet.status === "pending" && <button type="button" className="icon-btn danger" onClick={() => setStatus(pet.id, "rejected")} aria-label={`Reject ${pet.name}`} title="Reject"><X size={15} /></button>}
                      {pet.status === "available" && <button type="button" className="mini-link" style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }} onClick={() => setStatus(pet.id, "adopted")}>Mark adopted</button>}
                      {pet.status === "adopted" && <button type="button" className="mini-link" style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }} onClick={() => setStatus(pet.id, "available")}>Relist</button>}
                      {pet.status !== "pending" && <Link className="icon-btn" href={`/adopt/${pet.id}`} target="_blank" aria-label={`View ${pet.name}`} title="View listing"><Eye size={15} /></Link>}
                      <button type="button" className="icon-btn danger" onClick={() => remove(pet.id)} aria-label={`Delete ${pet.name}`} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
