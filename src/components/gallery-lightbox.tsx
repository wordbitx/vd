"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { galleryItems } from "@/lib/site";

export function GalleryLightbox() {
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (active === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((value) => value === null ? null : (value + 1) % galleryItems.length);
      if (event.key === "ArrowLeft") setActive((value) => value === null ? null : (value - 1 + galleryItems.length) % galleryItems.length);
    }
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [active]);
  function close() { setActive(null); window.setTimeout(() => triggerRef.current?.focus(), 0); }
  return <><div className="gallery-grid">{galleryItems.map((item, index) => <button type="button" className={`gallery-tile gallery-tile-${index + 1}`} key={item.id} onClick={(event) => { triggerRef.current = event.currentTarget; setActive(index); }} aria-label={`Enlarge ${item.title}: illustrative demo image`}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" className="object-cover" /><span className="gallery-tile-overlay"><span><strong>{item.title}</strong><small>Illustrative demo image</small></span><ZoomIn size={23} /></span></button>)}</div>{active !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><button ref={closeRef} className="lightbox-close" type="button" onClick={close} aria-label="Close image"><X size={24} /></button><button type="button" className="lightbox-arrow lightbox-prev" onClick={() => setActive((active - 1 + galleryItems.length) % galleryItems.length)} aria-label="Previous image"><ChevronLeft size={25} /></button><div className="lightbox-content"><div className="lightbox-image"><Image src={galleryItems[active].src} alt={galleryItems[active].alt} fill sizes="(max-width: 900px) 90vw, 900px" className="object-contain" priority /></div><div className="lightbox-caption"><div><span>{String(active + 1).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}</span><h2 id="lightbox-title">{galleryItems[active].title}</h2><p>{galleryItems[active].caption}</p></div></div></div><button type="button" className="lightbox-arrow lightbox-next" onClick={() => setActive((active + 1) % galleryItems.length)} aria-label="Next image"><ChevronRight size={25} /></button></div>}</>;
}
