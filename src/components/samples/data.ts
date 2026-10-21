/**
 * Content for the 20 home-page design samples.
 * Deliberately static: these are layout studies, not the live catalogue, so the
 * samples stay fast and can never drift when the shop data changes.
 */

export type Sample = {
  slug: string;
  n: string;
  name: string;
  blurb: string;
  bestFor: string;
  palette: [string, string, string, string];
  type: string;
};

export const SAMPLES: Sample[] = [
  {
    slug: "aurora-split",
    n: "01",
    name: "Aurora Split",
    blurb: "Calm two-column opener: story on the left, clinician portrait card on the right.",
    bestFor: "Trust-first first impression",
    palette: ["#0b2f34", "#c7ab6a", "#fbf7ee", "#14231f"],
    type: "Cormorant + Instrument Sans",
  },
  {
    slug: "grand-editorial",
    n: "02",
    name: "Grand Editorial",
    blurb: "Full-bleed photograph with a centred serif headline and a soft light veil.",
    bestFor: "Emotional, magazine-grade branding",
    palette: ["#1a2b24", "#e6d5aa", "#fdfaf2", "#3f5a4c"],
    type: "Cormorant italic + Instrument Sans",
  },
  {
    slug: "midnight-luxe",
    n: "03",
    name: "Midnight Luxe",
    blurb: "Near-black canvas, hairline gold rules and one floating product card.",
    bestFor: "Premium, after-hours emergency positioning",
    palette: ["#0a0d0c", "#c9a961", "#111614", "#f4efe3"],
    type: "Bodoni Moda + Figtree",
  },
  {
    slug: "clinical-calm",
    n: "04",
    name: "Clinical Calm",
    blurb: "Airy white and sage with a booking bar pinned under the hero.",
    bestFor: "Clarity and low-anxiety booking",
    palette: ["#f7faf8", "#3d7a68", "#ffffff", "#16211d"],
    type: "Newsreader + Inter",
  },
  {
    slug: "bento-clinic",
    n: "05",
    name: "Bento Clinic",
    blurb: "Asymmetric bento grid where the flagship service takes the wide tile.",
    bestFor: "Showing breadth in one screen",
    palette: ["#fbf8f1", "#1c5d5c", "#b4552c", "#14231f"],
    type: "Cormorant + Figtree",
  },
  {
    slug: "booking-first",
    n: "06",
    name: "Booking First",
    blurb: "The hero is the booking form; everything else supports it.",
    bestFor: "Maximum conversion",
    palette: ["#0e3b38", "#d2b878", "#fbf7ee", "#14231f"],
    type: "Instrument Sans + Cormorant",
  },
  {
    slug: "magazine-spread",
    n: "07",
    name: "Magazine Spread",
    blurb: "Masthead, rules and three columns — a printed broadsheet feel.",
    bestFor: "Editorial authority and long-form trust",
    palette: ["#fdfbf4", "#1c1a16", "#9c3b25", "#5c5a52"],
    type: "Playfair Display + Newsreader",
  },
  {
    slug: "warm-boutique",
    n: "08",
    name: "Warm Boutique",
    blurb: "Cream and terracotta, soft blobs and generous rounding.",
    bestFor: "Friendly neighbourhood practice",
    palette: ["#fdf6ec", "#c06a45", "#8f3f24", "#3a2a21"],
    type: "Cormorant + Figtree",
  },
  {
    slug: "swiss-grid",
    n: "09",
    name: "Swiss Grid",
    blurb: "Oversized sans numerals, hard grid lines and almost no colour.",
    bestFor: "Clinical precision and data",
    palette: ["#ffffff", "#111111", "#2f6b57", "#8a8a8a"],
    type: "Figtree only",
  },
  {
    slug: "immersive-overlay",
    n: "10",
    name: "Immersive Overlay",
    blurb: "Full-height photograph with text low-left and a glass stats rail.",
    bestFor: "Wow-factor on first load",
    palette: ["#101b18", "#e9d7a8", "#f6f2e7", "#1f3a32"],
    type: "Cormorant + Instrument Sans",
  },
  {
    slug: "sidebar-app",
    n: "11",
    name: "Sidebar App",
    blurb: "Persistent left rail navigation with a dashboard-like content area.",
    bestFor: "Returning clients and portal users",
    palette: ["#f7f8f9", "#1f6f62", "#ffffff", "#1a2422"],
    type: "Instrument Sans + Figtree",
  },
  {
    slug: "duotone-poster",
    n: "12",
    name: "Duotone Poster",
    blurb: "Two bold colour blocks and a diagonal cut through the hero.",
    bestFor: "Standing out in a crowded feed",
    palette: ["#0e3b38", "#e86f43", "#fdf3e6", "#102a26"],
    type: "Bodoni Moda + Instrument Sans",
  },
  {
    slug: "pet-first",
    n: "13",
    name: "Pet-First",
    blurb: "Adoption cards above the fold; clinical services come second.",
    bestFor: "Community and adoption reach",
    palette: ["#fffaf2", "#2c7257", "#e5b95c", "#22301f"],
    type: "Newsreader + Figtree",
  },
  {
    slug: "mall-first",
    n: "14",
    name: "Mall-First",
    blurb: "Category chips and a product rail occupy the hero.",
    bestFor: "Retail and repeat purchases",
    palette: ["#fbf7ee", "#1c5d5c", "#b4552c", "#14231f"],
    type: "Instrument Sans + Cormorant",
  },
  {
    slug: "cover-story",
    n: "15",
    name: "Cover Story",
    blurb: "A magazine cover: issue number, kicker, cover photo and cover lines.",
    bestFor: "Personality-led practices",
    palette: ["#17211d", "#d8c48d", "#fbf7ee", "#2c4438"],
    type: "Bodoni Moda + Newsreader",
  },
  {
    slug: "glass-modern",
    n: "16",
    name: "Glass Modern",
    blurb: "Mesh gradient behind frosted glass panels.",
    bestFor: "Modern tech-forward clinics",
    palette: ["#101d2b", "#7fd1c0", "#f4fbf9", "#0d2836"],
    type: "Figtree + Instrument Sans",
  },
  {
    slug: "heritage-crest",
    n: "17",
    name: "Heritage Crest",
    blurb: "Engraved borders, a crest and formal small caps.",
    bestFor: "Established, institution-grade trust",
    palette: ["#0d2a24", "#b89a58", "#f6f1e4", "#1c3a31"],
    type: "Cormorant + Instrument Sans",
  },
  {
    slug: "neo-brutal",
    n: "18",
    name: "Neo Brutal",
    blurb: "Thick borders, hard offset shadows and a vivid accent.",
    bestFor: "Playful, young and memorable",
    palette: ["#fffdf6", "#111111", "#ff6b35", "#00a878"],
    type: "Figtree 800 + Inter",
  },
  {
    slug: "soft-gradient",
    n: "19",
    name: "Soft Gradient",
    blurb: "Pastel mesh gradient with very large rounded cards.",
    bestFor: "Warm, approachable first impression",
    palette: ["#f2f7ff", "#5b7cfa", "#ffb5a7", "#22304a"],
    type: "Plus Jakarta-style Figtree",
  },
  {
    slug: "split-stats",
    n: "20",
    name: "Split Stats",
    blurb: "Hero on the left, a live-looking stats and cover column on the right.",
    bestFor: "Data-forward, transparent practices",
    palette: ["#ffffff", "#0e3b38", "#eef4f1", "#14231f"],
    type: "Cormorant + Instrument Sans",
  },
];

export const NAV = ["Home", "Services", "Team", "Pet Mall", "Adopt", "Contact"];

export const SERVICES = [
  { name: "General Checkup", blurb: "Full physical exam, vitals and a plain-language plan.", duration: "30–45 min", icon: "stethoscope", price: null },
  { name: "Vaccination", blurb: "Core and non-core vaccines with a strict cold chain.", duration: "20–30 min", icon: "syringe", price: null },
  { name: "Deworming", blurb: "Internal and external parasite treatment at home.", duration: "20 min", icon: "bug", price: null },
  { name: "Dental Cleaning", blurb: "Oral exam and scaling for healthier teeth and gums.", duration: "30–45 min", icon: "tooth", price: null },
  { name: "Emergency Care", blurb: "24/7 critical care with rapid dispatch across Lahore.", duration: "Varies", icon: "siren", price: null },
  { name: "Lab & Diagnostics", blurb: "Blood work, urinalysis and rapid tests at your door.", duration: "30–45 min", icon: "flask", price: null },
];

export const PRODUCTS = [
  { name: "PrimePet No Mites Drop", price: "PKR 1,000", was: "PKR 1,500", off: 33, image: "/images/product-supplement.jpg", cat: "Prime Pet Items" },
  { name: "Mito Premium Adult Cat Food", price: "PKR 1,500", was: null, off: 0, image: "/images/product-cat-food.jpg", cat: "Cat Food" },
  { name: "Prime Pet Bone Care 100g", price: "PKR 1,800", was: "PKR 2,500", off: 28, image: "/images/product-treats.jpg", cat: "Prime Pet Items" },
  { name: "NFC Dog Collar", price: "PKR 2,500", was: null, off: 0, image: "/images/product-bed.jpg", cat: "Prime Pet Items" },
];

export const STATS = [
  { v: "24/7", l: "Emergency" },
  { v: "7", l: "Years in Lahore" },
  { v: "4.9", l: "Average rating" },
  { v: "2.4k", l: "Visits made" },
];

export const REVIEWS = [
  { name: "Hinnana Iqbal", text: "Dr. Jawad treated my cat with genuine care. He explained everything and followed up the next day.", tag: "Home visit" },
  { name: "Fatima Butt", text: "Cancelled my vet appointment elsewhere. They came to my place, sent reports, and my dog is back to himself.", tag: "Emergency" },
  { name: "Muhammad Kamran", text: "The only vet who did not rush. Clear instructions, fair pricing, and a real interest in the pet.", tag: "Vaccination" },
];

export const ADOPTS = [
  { name: "Lilly", meta: "Persian · Female", image: "/images/adopt-1.jpg" },
  { name: "Coco", meta: "Persian · Female", image: "/images/adopt-2.jpg" },
  { name: "Muffin", meta: "Persian · Female", image: "/images/adopt-3.jpg" },
  { name: "Simba", meta: "Persian · Male", image: "/images/adopt-4.jpg" },
];

export const HERO_IMG = "/images/hero-care.jpg";
export const VET_IMG = "/images/dr-jawad.jpg";
export const CLINIC_IMG = "/images/clinic-interior.jpg";
export const DOG_IMG = "/images/pet-dog.jpg";
export const CAT_IMG = "/images/pet-cat.jpg";
