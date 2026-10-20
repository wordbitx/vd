"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function GalleryLightbox({ items }: { items: { id: string; src: string; title: string; alt: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % items.length));
      if (event.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, items.length]);

  return (
    <>
      <div className="photo-mosaic">
        {items.map((item, i) => (
          <button key={item.id} type="button" onClick={() => setOpen(i)} aria-label={`Open ${item.title}`}>
            <Image src={item.src} alt={item.alt} fill sizes="(max-width:720px) 50vw,25vw" className="object-cover" unoptimized />
          </button>
        ))}
      </div>
      {open !== null ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={items[open].title} onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
          <div className="lightbox-bar">
            <span>{items[open].title} · {open + 1} / {items.length}</span>
            <button type="button" className="lightbox-close" onClick={() => setOpen(null)} aria-label="Close"><X size={18} /></button>
          </div>
          <Image src={items[open].src} alt={items[open].alt} width={1200} height={800} style={{ maxHeight: "82vh", width: "auto", borderRadius: 14 }} unoptimized />
          <button type="button" className="lightbox-nav lightbox-prev" onClick={() => setOpen((i) => (i! - 1 + items.length) % items.length)} aria-label="Previous"><ChevronLeft size={20} /></button>
          <button type="button" className="lightbox-nav lightbox-next" onClick={() => setOpen((i) => (i! + 1) % items.length)} aria-label="Next"><ChevronRight size={20} /></button>
        </div>
      ) : null}
    </>
  );
}
