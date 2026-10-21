"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ReviewCarousel({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const node = track.current;
    if (!node) return;
    node.scrollBy({ left: direction * (node.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="r-reviews-track">
      <div className="r-reviews-scroll" ref={track}>{children}</div>
      <div className="r-reviews-arrows">
        <button type="button" className="r-arrow-btn" onClick={() => scrollBy(-1)} aria-label="Previous reviews">
          <ChevronLeft size={17} />
        </button>
        <button type="button" className="r-arrow-btn" onClick={() => scrollBy(1)} aria-label="Next reviews">
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
