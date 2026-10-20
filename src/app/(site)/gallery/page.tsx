import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Camera, Home, MapPin } from "lucide-react";
import { Breadcrumbs, Eyebrow, SectionHead } from "@/components/ui";
import { GalleryLightbox } from "@/components/gallery-view";
import { business, galleryItems } from "@/lib/site";
import { catalogGallery } from "@/server/catalog";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Clinic gallery — inside Jawad Veterinary Hospital, Lahore",
  "Consultation rooms, procedure theatre, pharmacy, pet mall and home-visit kit at Jawad Veterinary Hospital in Al Kabir Town, Lahore.",
  "/gallery",
  "/images/clinic-interior.jpg",
);

export default async function GalleryPage() {
  const items = await catalogGallery();
  const groups = [
    { title: "The hospital", note: "Waiting area, consultation rooms and the cat-friendly room.", images: ["/images/clinic-interior.jpg", "/images/consultation.jpg", "/images/pet-cat.jpg"] },
    { title: "Care in practice", note: "Examinations, dentistry, lab work and recovery.", images: ["/images/lab.jpg", "/images/dental.jpg", "/images/surgery.jpg", "/images/team-vets.jpg"] },
    { title: "Home visits & pet mall", note: "The mobile kit, the shelves and the delivery bike.", images: ["/images/home-visit.jpg", "/images/pet-shop.jpg", "/images/pharmacy.jpg"] },
  ];

  return (
    <>
      <section className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: "Gallery" }]} />
          <SectionHead
            eyebrow={`${business.city} · Al Kabir Town`}
            title={<>Where your pet will <em>actually be seen.</em></>}
            lead="No stock-photo theatre: the rooms, the kit we carry to your home and the shelves we stock. Tap any photo to open it full size."
            action={<a href={business.mapsUrl} target="_blank" rel="noreferrer" className="button button-ghost button-sm"><MapPin size={15} /> Open in Maps</a>}
          />
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 10 }}>
        <div className="container">
          <GalleryLightbox items={items.map((item) => ({ id: item.id, src: item.src, title: item.title, alt: item.alt }))} />
        </div>
      </section>

      <section className="section band">
        <div className="container grid" style={{ gap: 36 }}>
          {groups.map((group) => (
            <div key={group.title}>
              <div className="row-between" style={{ marginBottom: 16 }}>
                <div>
                  <Eyebrow>{group.title}</Eyebrow>
                  <h2 style={{ margin: "10px 0 0", fontSize: 26 }}>{group.note}</h2>
                </div>
                <span className="pill pill-soft"><Camera size={13} /> {group.images.length}</span>
              </div>
              <div className="grid" style={{ gridTemplateColumns: `repeat(${group.images.length}, minmax(0,1fr))`, gap: 12 }}>
                {group.images.map((src, i) => (
                  <div key={src} className="figure figure-ratio card-hover">
                    <Image src={src} alt={`${group.title} — image ${i + 1}`} fill sizes="30vw" className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div className="cta-inner">
              <div>
                <Eyebrow tone="light"><Home size={13} /> Prefer your own sofa?</Eyebrow>
                <h2 style={{ margin: "12px 0 8px", fontSize: "clamp(24px,3vw,36px)" }}>We bring all of this to you.</h2>
                <p>Examination tools, oxygen, IV support, emergency drugs and the pharmacy — packed and driven anywhere in our Lahore coverage.</p>
              </div>
              <div className="cta-actions">
                <Link href="/book-vet-appointment-lahore" className="button button-brass button-lg">Book a home visit <ArrowRight size={16} /></Link>
                <Link href="/services" className="button button-outline-light button-lg">What it costs</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
