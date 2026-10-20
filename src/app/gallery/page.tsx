import Link from "next/link";
import { ArrowRight, Camera, MapPin } from "lucide-react";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { BookingCta, DemoNotice, PageHero } from "@/components/page-parts";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Gallery | Pet Care & Shop Preview", "Explore illustrative veterinary care and pet shop imagery in the Jawad Veterinary Hospital website preview. Real hospital photos will replace these before launch.", "/gallery", "/images/gallery-interior.jpg");

export default function GalleryPage() {
  return <main id="main-content"><PageHero eyebrow="A CLOSER LOOK" title="Moments that make care feel closer." description="A visual preview of the hospital-and-pet-shop experience. These are illustrative images, not photographs of Jawad Veterinary Hospital’s actual facilities, staff or patients." /><section className="gallery-page-section"><div className="container"><div className="gallery-page-intro"><span className="eyebrow"><span className="eyebrow-line" /> THE GALLERY</span><p>Click any image to view it larger. Use the arrow keys to explore and Escape to close.</p></div><GalleryLightbox /><DemoNotice>Every image in this gallery is illustrative. Replace these with approved exterior, reception, consultation, team and shop photographs from Jawad Veterinary Hospital before publication.</DemoNotice></div></section><section className="gallery-real-photo-note"><div className="container"><span><Camera size={26} /></span><div><h2>The real story is still to come.</h2><p>Once approved photographs are available, this gallery can show the hospital as it really is — from the entrance and consultation space to the people and products inside.</p></div><Link href="/contact" className="button button-outline"><MapPin size={17} /> Visit or contact us <ArrowRight size={16} /></Link></div></section><BookingCta /></main>;
}
