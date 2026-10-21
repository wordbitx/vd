import {
  Ambulance, Bath, Bone, Calendar, Cat, ClipboardList, Dog, Droplets, FlaskConical, HeartPulse, House, Link2,
  Microscope, Package, PawPrint, Pill, Scissors, Shield, Smile, Sofa, Sparkles, Stethoscope, Syringe, TestTube,
  ToyBrick, Truck, Utensils, type LucideIcon,
} from "lucide-react";
import type { ServiceIcon } from "@/lib/site";

const registry: Record<string, LucideIcon> = {
  stethoscope: Stethoscope, syringe: Syringe, scissors: Scissors, microscope: Microscope, sparkles: Sparkles,
  heartPulse: HeartPulse, smile: Smile, bowl: Utensils, bone: Bone, testTube: TestTube, home: House,
  shield: Shield, paw: PawPrint, dog: PawPrint, ambulance: Ambulance, bath: Bath, flask: FlaskConical,
  clipboard: ClipboardList, droplets: Droplets, truck: Truck, calendar: Calendar,
};

export function ServiceGlyph({ icon, size = 22, className }: { icon: string; size?: number; className?: string }) {
  const Cmp = registry[icon] ?? Stethoscope;
  return <Cmp size={size} className={className} strokeWidth={1.7} aria-hidden="true" />;
}

export function WhatsAppIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.05c-.24.68-1.4 1.31-1.94 1.36-.5.05-.98.23-3.36-.7-2.83-1.11-4.62-4.03-4.76-4.22-.14-.19-1.14-1.52-1.14-2.9 0-1.38.72-2.06.98-2.34.25-.28.55-.35.73-.35l.53.01c.17 0 .4-.06.62.48.24.57.79 1.97.86 2.11.07.14.12.31.02.5-.09.19-.14.31-.28.48l-.42.49c-.14.14-.28.29-.12.57.16.28.72 1.18 1.54 1.92 1.06.94 1.95 1.23 2.23 1.37.28.14.44.12.6-.07.17-.19.69-.8.87-1.08.19-.28.37-.23.62-.14.25.09 1.61.76 1.88.9.28.14.47.21.54.33.07.11.07.67-.17 1.35Z" />
    </svg>
  );
}

export function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.3-.12-2.48-.12-2.45 0-4.12 1.5-4.12 4.24v2.18H7.4V13h2.25v8h3.85Z" />
    </svg>
  );
}

export function MapsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function PetGlyph({ species, size = 18 }: { species?: string; size?: number }) {
  const key = (species ?? "").toLowerCase();
  if (key.startsWith("cat") || key === "kitten") return <PawPrint size={size} strokeWidth={1.7} aria-hidden="true" />;
  if (key.startsWith("bird")) return <Droplets size={size} strokeWidth={1.7} aria-hidden="true" />;
  return <PawPrint size={size} strokeWidth={1.7} aria-hidden="true" />;
}

/** Premium line icons for the Pet Mall category rail — one per shop category. */
const categoryRegistry: Record<string, LucideIcon> = {
  "dog-food": Dog,
  "cat-food": Cat,
  "treats-chews": Bone,
  "toys-enrichment": ToyBrick,
  "grooming-care": Bath,
  supplements: Pill,
  "beds-carriers": Sofa,
  "collars-leashes": Link2,
};

export function CategoryIcon({ slug, size = 27 }: { slug: string; size?: number }) {
  const Cmp = categoryRegistry[slug] ?? Package;
  return (
    <span className="r-cat-emblem" aria-hidden="true">
      <span className="r-cat-emblem-ring" />
      <Cmp size={size} strokeWidth={1.55} />
    </span>
  );
}
