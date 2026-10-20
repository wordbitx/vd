import Link from "next/link";
import { ArrowRight, CalendarDays, HeartHandshake, UserRound } from "lucide-react";
import { BookingCta, DemoNotice, PageHero } from "@/components/page-parts";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Our Veterinary Team", "Meet the future team profile layout for Jawad Veterinary Hospital in Lahore. Names, photos and qualifications will be added after verification.", "/team", "/images/team-at-work.jpg");

const profileSlots = [
  { label: "VETERINARY PROFILE", title: "Veterinarian Profile", role: "Veterinary role to be confirmed" },
  { label: "TEAM PROFILE", title: "Veterinary Team Profile", role: "Professional role to be confirmed" },
  { label: "CARE PROFILE", title: "Pet Care Team Profile", role: "Professional role to be confirmed" },
];

export default function TeamPage() {
  return <main id="main-content"><PageHero eyebrow="THE PEOPLE BEHIND THE CARE" title="A team that cares about your pet." description="The hospital has a team, but individual names, verified qualifications and authorised photographs have not yet been supplied for this preview. This page is ready for the real profiles." image="/images/team-at-work.jpg" imageAlt="Illustrative veterinary team caring for a dog, not actual Jawad staff"><Link href="/book-appointment" className="button button-primary"><CalendarDays size={17} /> Request a visit <ArrowRight size={16} /></Link></PageHero>
    <section className="section team-page-section"><div className="container"><div className="section-header compact"><div><span className="eyebrow"><span className="eyebrow-line" /> MEET THE TEAM</span><h2>The faces behind the care.</h2><p>Profile cards below are layout placeholders only, not a representation of actual staff count or credentials.</p></div></div><div className="team-profile-grid">{profileSlots.map((slot, index) => <article className="team-profile-card" key={slot.title}><div className="team-avatar-placeholder"><span>0{index + 1}</span><UserRound size={65} strokeWidth={1} /><small>PHOTO TO BE ADDED</small></div><div className="team-profile-copy"><span className="product-category">{slot.label}</span><h3>{slot.title}</h3><p>{slot.role}</p><div className="team-qualification"><strong>Qualification</strong><span>To be confirmed with the hospital</span></div><p className="team-bio">A real name, short biography and confirmed areas of expertise can be added here after the hospital approves them.</p><Link href="/book-appointment" className="text-link">Enquire about a visit <ArrowRight size={16} /></Link></div></article>)}</div><DemoNotice>No doctor names, degrees, registrations, experience claims or individual portraits are invented in this preview. These profile slots are editable templates.</DemoNotice></div></section>
    <section className="team-note-section"><div className="container team-note-inner"><span><HeartHandshake size={29} /></span><div><h2>It’s personal, because they’re family.</h2><p>Have a question about the right care for your pet? Share the details with the hospital team and they can guide the conversation from there.</p></div><Link href="/contact" className="button button-outline">Contact the team <ArrowRight size={16} /></Link></div></section><BookingCta />
  </main>;
}
