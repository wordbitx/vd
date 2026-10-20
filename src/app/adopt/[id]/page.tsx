import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Bug, CalendarDays, Check, HeartHandshake, MapPin, MessageCircle, ShieldCheck, Sparkles, Syringe, X } from "lucide-react";
import { AdoptCard, whatsappPetUrl } from "@/components/cards";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { getAdoption, listAdoptions } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pet = getAdoption(id);
  if (!pet) return pageMetadata("Adopt a Pet", "Meet pets waiting for forever homes in Lahore.", "/adopt");
  return pageMetadata(`Adopt ${pet.name} — ${pet.breed || pet.species}`, `${pet.name} is a ${pet.ageText || pet.ageGroup.toLowerCase()} ${pet.breed || pet.species} in ${pet.area}, Lahore looking for a forever home.`, `/adopt/${pet.id}`, pet.image);
}

function waNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("92") ? digits : digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
}

export default async function AdoptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pet = getAdoption(id);
  if (!pet) notFound();
  const user = await getCurrentUser();
  const canSeeHidden = (user && (isStaff(user) || pet.postedByUserId === user.id)) ?? false;
  if (pet.status !== "available" && pet.status !== "adopted" && !canSeeHidden) notFound();

  const related = listAdoptions(["available"]).filter((item) => item.id !== pet.id && item.species === pet.species).slice(0, 3);
  const familyNumber = waNumber(pet.contactPhone);
  const directWa = familyNumber
    ? `https://wa.me/${familyNumber}?text=${encodeURIComponent(`Hello, I saw ${pet.name} (${pet.breed || pet.species}) on Jawad Veterinary Hospital's adoption board and I would love to adopt. Could you please share more details?`)}`
    : whatsappPetUrl(pet);

  const health = [
    { icon: Syringe, label: "Vaccinated", ok: pet.vaccinated },
    { icon: Bug, label: "Dewormed", ok: pet.dewormed },
    { icon: Sparkles, label: "Litter / house trained", ok: pet.litterTrained },
  ];

  return (
    <main id="main-content">
      <section className="section">
        <div className="container">
          <p style={{ marginBottom: 20 }}><Link href="/adopt" className="text-link"><ArrowLeft size={15} /> Back to the adoption board</Link></p>

          {pet.status === "adopted" && (
            <div className="form-success-summary" role="status" style={{ marginBottom: 18 }}>
              <HeartHandshake size={18} /> <span><strong>Wonderful news — {pet.name} has been adopted!</strong> This profile is kept for our happy-endings wall. Explore other pets still waiting below.</span>
            </div>
          )}
          {(pet.status === "pending" || pet.status === "rejected") && (
            <div className="form-info-summary" role="status" style={{ marginBottom: 18 }}>
              <ShieldCheck size={17} /> <span>This listing is {pet.status === "pending" ? "under review and not public yet" : "not approved"} — you can see it because you&apos;re signed in as the owner or staff.</span>
            </div>
          )}

          <div className="product-detail-grid">
            <div>
              <div className="product-detail-media" style={{ background: "#e9e2d0" }}>
                <Image src={pet.image} alt={`${pet.name}, a ${pet.breed || pet.species} looking for a home`} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" priority />
                <span className="adopt-badges">
                  {pet.vaccinated && <span className="badge-vax">Vaccinated</span>}
                  <span>{pet.gender}</span>
                </span>
              </div>
            </div>
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> LOOKING FOR A FOREVER HOME</span>
              <h1 className="detail-title" style={{ textTransform: "capitalize" }}>Meet {pet.name}</h1>
              <p className="adopt-meta" style={{ fontSize: 13 }}>
                <b>{pet.breed || pet.species}</b> · {pet.gender} · {pet.ageGroup}{pet.ageText ? ` · ${pet.ageText}` : ""}
              </p>
              <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#7a868e" }}><MapPin size={14} /> {pet.area}, Lahore</p>

              <h2 style={{ fontFamily: "var(--display)", fontSize: 20, color: "var(--forest)", margin: "22px 0 8px" }}>About {pet.name}</h2>
              <p style={{ fontSize: 14, lineHeight: 1.85, color: "#3d4c5a", whiteSpace: "pre-line" }}>{pet.description}</p>

              <h2 style={{ fontFamily: "var(--display)", fontSize: 20, color: "var(--forest)", margin: "22px 0 10px" }}>Health &amp; habits</h2>
              <ul className="detail-checks">
                {health.map((item) => (
                  <li key={item.label}>
                    {item.ok ? <Check size={16} style={{ color: "#2c7a4b" }} /> : <X size={16} style={{ color: "#b0473f" }} />}
                    <span>{item.ok ? item.label : `Not yet ${item.label.toLowerCase()}`}{!item.ok && item.label === "Vaccinated" ? " — we can vaccinate at adoption" : ""}</span>
                  </li>
                ))}
              </ul>

              {pet.status === "available" && (
                <div className="detail-buy-row" style={{ marginTop: 24, display: "flex", gap: 11, flexWrap: "wrap" }}>
                  <a href={directWa} target="_blank" rel="noopener noreferrer" className="button button-whatsapp"><MessageCircle size={17} /> WhatsApp the family</a>
                  <Link href="/book" className="button button-outline"><CalendarDays size={16} /> Book a free first checkup</Link>
                </div>
              )}
              <div className="detail-trust">
                <span><ShieldCheck size={16} /> Listing reviewed by the Jawad team</span>
                <span><HeartHandshake size={16} /> Free adoption — no fees, ever</span>
                <span><Syringe size={16} /> Free first checkup &amp; Pet Passport with us</span>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div style={{ marginTop: 56 }}>
              <div className="section-header compact">
                <div>
                  <span className="eyebrow"><span className="eyebrow-line" /> ALSO WAITING</span>
                  <h2>More {pet.species.toLowerCase()}s looking for love</h2>
                </div>
                <Link href="/adopt" className="button button-outline">View all pets <ArrowRight size={16} /></Link>
              </div>
              <div className="adopt-grid">
                {related.map((item) => <AdoptCard pet={item} key={item.id} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
