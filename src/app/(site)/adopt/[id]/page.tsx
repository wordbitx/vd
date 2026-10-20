import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Check, HeartHandshake, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Breadcrumbs, CheckList, Eyebrow, WhatsAppButton } from "@/components/ui";
import { AdoptionCard } from "@/components/cards";
import { business } from "@/lib/site";
import { rows } from "@/server/store";
import { pageMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const pet = (await rows("adoption")).find((p) => p.id === id);
  if (!pet) return { title: "Pet not found" };
  return pageMetadata(`Adopt ${pet.name} — ${pet.species} in Lahore`, pet.story.slice(0, 150), `/adopt/${pet.id}`, pet.image);
}

export default async function PetProfile({ params }: Params) {
  const { id } = await params;
  const all = await rows("adoption");
  const pet = all.find((p) => p.id === id);
  if (!pet) notFound();
  const others = all.filter((p) => p.id !== pet.id && p.status === "available").slice(0, 3);

  return (
    <>
      <section className="page-head" style={{ paddingBottom: 10 }}>
        <div className="container">
          <Breadcrumbs items={[{ label: "Adopt", href: "/adopt" }, { label: pet.name }]} />
          <div className="grid" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.05fr)", gap: 38, alignItems: "start" }}>
            <div className="figure figure-tall figure-frame" style={{ boxShadow: "var(--shadow-lg)" }}>
              <Image src={pet.image} alt={pet.name} fill sizes="45vw" className="object-cover" priority unoptimized />
              <span className="figure-ribbon">{pet.status === "available" ? "Looking for a home" : pet.status}</span>
            </div>
            <div className="col" style={{ gap: 18 }}>
              <div>
                <Eyebrow>{pet.species} · {pet.breed}</Eyebrow>
                <h1 style={{ margin: "12px 0 10px", fontSize: "clamp(34px,4.4vw,54px)" }}>{pet.name}</h1>
                <p className="muted" style={{ margin: 0 }}>{pet.age} · {pet.sex} · listed {new Date(`${pet.postedAt}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "long" })}</p>
              </div>
              <div className="row" style={{ gap: 8 }}>
                {pet.vaccinated ? <span className="pill pill-ok"><Check size={12} /> Vaccinated</span> : <span className="pill pill-soft">Vaccination pending</span>}
                {pet.dewormed ? <span className="pill pill-ok"><Check size={12} /> Dewormed</span> : null}
                {pet.traits.map((trait) => <span key={trait} className="pill pill-soft">{trait}</span>)}
              </div>
              <p className="lead" style={{ margin: 0, fontSize: 16 }}>{pet.story}</p>
              <div className="card card-pad" style={{ background: "linear-gradient(150deg,#f8f4ec,#fffdfa)" }}>
                <h3 style={{ fontSize: 18 }}>What is included</h3>
                <div style={{ marginTop: 12 }}>
                  <CheckList items={[
                    "Health examination and record card",
                    "Age-appropriate vaccination and deworming",
                    "Settle-in home visit from our team",
                    "A free first-year consult, plus neutering at our cost",
                  ]} />
                </div>
              </div>
              <div className="row" style={{ gap: 10 }}>
                {pet.status === "available" ? (
                  <>
                    <WhatsAppButton
                      message={`Assalam-o-Alaikum, I would like to apply to adopt ${pet.name} (${pet.species}, ${pet.age}). Reference: ${pet.id}.`}
                      className="button button-primary button-lg" label={`Apply to adopt ${pet.name}`}
                    />
                    <a href={business.phoneHref} className="button button-ghost button-lg"><Phone size={15} /> {business.phone}</a>
                  </>
                ) : (
                  <div className="note"><ShieldCheck size={16} /><span>{pet.name} already has a family lined up. Ask the clinic about the next rescue — we always have a waiting list.</span></div>
                )}
              </div>
              <p className="tiny muted" style={{ margin: 0 }}>
                <MapPin size={12} style={{ display: "inline", verticalAlign: "-2px" }} /> Meet at the hospital, {business.shortAddress}. No adoption fee; a home check is required.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="container">
          <div className="row-between" style={{ marginBottom: 22 }}>
            <div>
              <Eyebrow>Also waiting</Eyebrow>
              <h2 style={{ margin: "10px 0 0", fontSize: 28 }}>Someone else would suit you too</h2>
            </div>
            <Link href="/adopt" className="button button-ghost button-sm"><ArrowLeft size={14} /> All animals</Link>
          </div>
          <div className="grid cols-3">
            {others.map((other) => <AdoptionCard key={other.id} pet={other} />)}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingBottom: 48 }}>
        <div className="container">
          <div className="cta-band">
            <div className="cta-inner">
              <div>
                <Eyebrow tone="light"><HeartHandshake size={13} /> Not ready to adopt?</Eyebrow>
                <h2 style={{ margin: "12px 0 8px", fontSize: "clamp(24px,3vw,34px)" }}>Sponsor a recovery instead.</h2>
                <p>Rs. 5,000 covers a rescue’s vaccination, deworming and food for a month. We send photos and the treatment record.</p>
              </div>
              <div className="cta-actions">
                <Link href="/contact-vet-lahore" className="button button-brass button-lg">Sponsor a pet <ArrowRight size={16} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
