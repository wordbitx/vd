// Catalogue & content data for Jawad Veterinary Hospital.
// Products here seed the database on first run; afterwards the admin panel
// manages them. Prices are the hospital's launch catalogue — update in /admin.
import type { StoreProduct } from "./types";

/** Services offered in the booking wizard (mirrors /services + deworming). */
export type BookingService = {
  slug: string;
  title: string;
  duration: string;
  feeFrom: number; // indicative service fee (excl. visiting charges), PKR
  blurb: string;
};

export const bookingServices: BookingService[] = [
  { slug: "general-consultation", title: "General Checkup", duration: "30–45 mins", feeFrom: 0, blurb: "Full physical examination, vitals and a tailored health plan." },
  { slug: "vaccination-preventive-care", title: "Vaccination", duration: "20–30 mins", feeFrom: 1500, blurb: "Core & booster vaccines with certificate and passport entry." },
  { slug: "deworming", title: "Deworming", duration: "20 mins", feeFrom: 600, blurb: "Weight-based internal parasite treatment, safe and gentle." },
  { slug: "pet-grooming", title: "Grooming", duration: "45–60 mins", feeFrom: 2000, blurb: "Bath, haircut, nail care and hygiene by trained groomers." },
  { slug: "surgery-treatment", title: "Surgical Consultation", duration: "45–60 mins", feeFrom: 2000, blurb: "Pre-surgical assessment, planning and post-op wound care." },
  { slug: "diagnostics-laboratory-tests", title: "Diagnostic & Lab Tests", duration: "30–45 mins", feeFrom: 2500, blurb: "Blood work, urinalysis and rapid diagnostic screening." },
  { slug: "dental-care", title: "Dental Cleaning", duration: "30–45 mins", feeFrom: 3000, blurb: "Oral examination, scaling and polishing for healthy gums." },
  { slug: "pet-nutrition-guidance", title: "Nutrition Consultation", duration: "30 mins", feeFrom: 1200, blurb: "Personalised diet planning for every life stage." },
];

export function bookingServiceBySlug(slug: string): BookingService | undefined {
  return bookingServices.find((service) => service.slug === slug);
}

/** Lahore areas for home visits & delivery. */
export const lahoreAreas = [
  "Al Kabir Town",
  "Bahria Town",
  "Valencia Town",
  "Lake City",
  "Wapda Town",
  "Johar Town",
  "Township",
  "Green Town",
  "Model Town",
  "Gulberg",
  "DHA Lahore",
  "Lahore Cantt",
  "Iqbal Town",
  "Faisal Town",
  "Garden Town",
  "EME Society",
  "Canal View",
  "Sabzazar",
  "Samanabad",
  "Shadman",
  "Raiwind",
  "Thokar Niaz Beg",
  "Other / not listed",
];

/** Indicative fee schedule shown on /fees (confirmed before treatment). */
export type FeeGroup = { title: string; note: string; rows: { service: string; fee: string; detail: string }[] };

export const feeSchedule: FeeGroup[] = [
  {
    title: "Consultation & Checkup",
    note: "At our Al Kabir Town hospital or at your home.",
    rows: [
      { service: "Hospital Consultation", fee: "Rs 1,500", detail: "30–45 mins · Full examination" },
      { service: "Home Visit Consultation (Lahore)", fee: "Rs 2,500", detail: "30–45 mins · Travel included" },
      { service: "Senior Pet Wellness Exam", fee: "Rs 2,000 – 3,000", detail: "45–60 mins · Pets 7+ years" },
      { service: "Follow-up Consultation", fee: "Rs 800 – 1,500", detail: "Within 7 days of last visit" },
      { service: "Online / Phone Consultation", fee: "Rs 500 – 1,000", detail: "15–30 mins · WhatsApp / video" },
    ],
  },
  {
    title: "Vaccinations",
    note: "Strict cold-chain protocols; certificate + Digital Pet Passport entry included.",
    rows: [
      { service: "Rabies Vaccine (Dog/Cat)", fee: "Rs 1,500 – 2,500", detail: "15 mins · Annual booster" },
      { service: "Cat Core Vaccine (FVRCP)", fee: "Rs 2,000 – 3,500", detail: "20–30 mins" },
      { service: "Dog Core Vaccine (DA2PP)", fee: "Rs 2,500 – 4,000", detail: "20–30 mins" },
      { service: "Full Puppy/Kitten Vaccine Series", fee: "Rs 6,000 – 10,000", detail: "Series of 3 visits" },
    ],
  },
  {
    title: "Deworming & Parasite Control",
    note: "Weight-based dosing by our veterinary team.",
    rows: [
      { service: "Internal Deworming (Dog/Cat)", fee: "Rs 600 – 1,200", detail: "20 mins" },
      { service: "Tick & Flea Treatment", fee: "Rs 1,000 – 2,500", detail: "20–30 mins · Spot-on or spray" },
      { service: "Full Deworming + Tick Package", fee: "Rs 2,000 – 3,500", detail: "30 mins · Combined treatment" },
    ],
  },
  {
    title: "Diagnostics & Lab Tests",
    note: "Samples collected at the hospital or your home; reports shared on WhatsApp.",
    rows: [
      { service: "Complete Blood Count (CBC)", fee: "Rs 2,500 – 4,000", detail: "Results in 24–48 hrs" },
      { service: "Blood Biochemistry Panel", fee: "Rs 3,000 – 6,000", detail: "Liver, kidney, glucose" },
      { service: "Urinalysis", fee: "Rs 1,500 – 2,500", detail: "30 mins" },
      { service: "Full Wellness Blood Panel", fee: "Rs 5,000 – 8,000", detail: "CBC + Biochemistry" },
    ],
  },
  {
    title: "Dental, Grooming & Other Care",
    note: "Final quote confirmed after examination, before any procedure.",
    rows: [
      { service: "Dental Examination", fee: "Rs 1,000 – 1,500", detail: "20 mins" },
      { service: "Professional Dental Scaling + Polish", fee: "Rs 4,000 – 7,000", detail: "45–60 mins" },
      { service: "Full Grooming (Bath, Cut & Nails)", fee: "Rs 2,000 – 4,500", detail: "By size & coat" },
      { service: "Surgical Consultation / Pre-op Exam", fee: "Rs 2,000 – 4,000", detail: "45–60 mins" },
      { service: "Post-Surgery Wound Care / Suture Removal", fee: "Rs 1,000 – 3,000", detail: "15–45 mins" },
      { service: "Nutrition Consultation", fee: "Rs 1,200 – 2,000", detail: "30 mins · Diet plan included" },
    ],
  },
  {
    title: "Emergency Care",
    note: "For life-threatening emergencies call immediately — do not wait for an online slot.",
    rows: [
      { service: "Emergency Hospital Visit", fee: "Rs 2,500", detail: "Priority assessment on arrival" },
      { service: "Emergency Home Visit (Lahore)", fee: "Rs 3,500", detail: "Rapid dispatch, subject to availability" },
      { service: "IV Fluid Therapy (per session)", fee: "Rs 2,000 – 4,000", detail: "In addition to visit fee" },
      { service: "Critical Stabilisation Care", fee: "Rs 6,000 – 15,000", detail: "Complex emergency cases" },
    ],
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "How do I book an appointment at Jawad Veterinary Hospital?",
    answer:
      "Use the online booking form — it takes under two minutes. Choose your pet's service, pick Hospital Visit (Al Kabir Town) or Home Visit anywhere in Lahore, select a time, and you'll instantly receive a booking slip with your token number. Our team also confirms every booking on WhatsApp.",
  },
  {
    question: "What is the Digital Pet Passport?",
    answer:
      "Every registered patient gets a free Digital Pet Passport in your account: your pet's profile, vaccination history with next-due dates, visit history and prescription notes — accessible any time from your phone, and printable when you travel or change vets.",
  },
  {
    question: "What are your visiting charges?",
    answer:
      "Standard hospital consultation is Rs 1,500 and a Lahore home visit is Rs 2,500. Emergency visits are Rs 2,500 (hospital) and Rs 3,500 (home). Service fees (vaccines, tests, procedures) are always quoted and agreed before treatment — see our full fee schedule.",
  },
  {
    question: "Do you offer home visits outside Al Kabir Town?",
    answer:
      "Yes — our mobile team covers all of Lahore including Bahria Town, DHA, Johar Town, Gulberg, Model Town, Valencia, Lake City and surrounding areas. Choose 'Home Visit' while booking and share your exact address and area.",
  },
  {
    question: "My pet is having an emergency. What should I do?",
    answer:
      "Call us immediately on 0300 7755230 — do not wait for an online booking response. Keep your pet warm and still, note the symptoms and when they started, and head to the hospital if advised. Trouble breathing, collapse, seizures, heavy bleeding or suspected poisoning always need immediate attention.",
  },
  {
    question: "Which pets do you treat?",
    answer:
      "Dogs and cats are our core patients, and we also see rabbits, birds and other small pets subject to the duty veterinarian's expertise. If you're unsure, message us on WhatsApp before booking.",
  },
  {
    question: "Can I order pet food and supplies online?",
    answer:
      "Yes — the Jawad Pet Mall delivers across Lahore (and nationwide on request). Pay cash on delivery, or via Easypaisa, JazzCash or bank transfer. Delivery is Rs 250 and free on orders above Rs 5,000 within Lahore.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "Cash, Easypaisa, JazzCash and bank transfer — at the hospital, on home visits and for Pet Mall orders.",
  },
  {
    question: "How do pet adoptions work?",
    answer:
      "Browse verified pets on our Adopt page and tap WhatsApp to speak with the poster. To list a pet for adoption, create a free account and submit the pet's details — every listing is reviewed by our team before it goes live.",
  },
  {
    question: "Can I reschedule or cancel my booking?",
    answer:
      "Yes. From your account dashboard you can cancel a pending or confirmed appointment, or simply reply to our WhatsApp confirmation to reschedule. Please give us as much notice as you can so another pet can use the slot.",
  },
];

/** Sample testimonials for layout — replace with the hospital's real Google reviews before launch. */
export const testimonials = [
  {
    name: "Ayesha Khan",
    area: "Bahria Town",
    rating: 5,
    when: "2 weeks ago",
    text: "Took my Persian cat for vaccination and grooming. The hospital is spotless, the staff gentle, and the Digital Pet Passport means I never lose her vaccine dates again. Truly premium care in Lahore.",
  },
  {
    name: "Bilal Ahmed",
    area: "Al Kabir Town",
    rating: 5,
    when: "1 month ago",
    text: "My German Shepherd needed urgent treatment late in the evening. One call and the team guided us in, assessed him immediately and explained everything clearly. He recovered beautifully.",
  },
  {
    name: "Fatima Raza",
    area: "Valencia Town",
    rating: 5,
    when: "3 weeks ago",
    text: "Booked a home visit online and got my booking slip instantly with a token number. The doctor arrived on time with everything needed. My anxious cat stayed calm at home — wonderful experience.",
  },
  {
    name: "Usman Tariq",
    area: "Johar Town",
    rating: 5,
    when: "2 months ago",
    text: "Ordered food and a harness from the Pet Mall — delivered the same day in Lahore with cash on delivery. Fair prices and genuine products. This is now our family's one-stop pet destination.",
  },
  {
    name: "Mahnoor S.",
    area: "Lake City",
    rating: 5,
    when: "1 month ago",
    text: "We adopted our kitten Coco through Jawad's adoption board. She came vaccinated and dewormed, and the team still checks in on her. You can feel how much they genuinely love animals.",
  },
];

/** Launch catalogue (seed). Prices in PKR. */
export const seedProducts: StoreProduct[] = [
  {
    id: "p01", slug: "premium-adult-dog-food-chicken", name: "Premium Adult Dog Food — Chicken & Rice", categorySlug: "dog-food",
    unit: "3 kg bag", price: 5650, salePrice: 4499, stock: 42, imageKind: "food-bag", imageUrl: "", featured: true, active: true,
    description: "Complete balanced nutrition for adult dogs with real chicken protein, omega fatty acids for a glossy coat and added taurine for heart health.",
    highlights: ["30% quality protein for strong muscles", "Omega 3 & 6 for skin and coat", "No artificial colours", "Vet-recommended daily feeding guide on pack"],
  },
  {
    id: "p02", slug: "premium-adult-cat-food-salmon", name: "Premium Adult Cat Food — Salmon Recipe", categorySlug: "cat-food",
    unit: "1.5 kg bag", price: 3200, salePrice: 2750, stock: 58, imageKind: "food-pouch", imageUrl: "", featured: true, active: true,
    description: "Salmon-rich everyday nutrition for adult cats with increased taurine for a healthy heart, eyes and nervous system, plus urinary-care minerals.",
    highlights: ["Healthy & shiny fur", "Supports urinary health", "Added taurine", "Highly palatable salmon recipe"],
  },
  {
    id: "p03", slug: "puppy-starter-food", name: "Puppy Starter Food — Growth Formula", categorySlug: "puppy-kitten-food",
    unit: "2 kg bag", price: 3400, salePrice: 2950, stock: 35, imageKind: "food-bag", imageUrl: "", featured: true, active: true,
    description: "DHA-enriched starter nutrition for puppies from weaning to 12 months, supporting brain development, immunity and strong bones.",
    highlights: ["DHA for brain & vision", "Calcium for growing bones", "Small, easy-chew kibble", "Immunity support blend"],
  },
  {
    id: "p04", slug: "kitten-starter-food", name: "Kitten Starter Food — Chicken & Milk", categorySlug: "puppy-kitten-food",
    unit: "1.2 kg bag", price: 2100, salePrice: 1799, stock: 47, imageKind: "kitten-food", imageUrl: "", featured: false, active: true,
    description: "Gentle, energy-dense kitten food for 1–12 months with colostrum-inspired nutrients and tiny kibble sized for little mouths.",
    highlights: ["For kittens 1–12 months", "Supports healthy growth", "Easy digestion", "Rich in protein & calcium"],
  },
  {
    id: "p05", slug: "clumping-cat-litter-10l", name: "Premium Clumping Cat Litter — Lavender", categorySlug: "cat-litter",
    unit: "10 L bag", price: 1650, salePrice: 1350, stock: 80, imageKind: "litter", imageUrl: "", featured: true, active: true,
    description: "Fast-clumping bentonite litter with long-lasting lavender freshness and 99% dust-free granules for easy scooping.",
    highlights: ["Instant strong clumps", "Odour control up to 3 weeks", "Low dust, low tracking", "Gentle on paws"],
  },
  {
    id: "p06", slug: "cotton-rope-toy-set", name: "Natural Cotton Rope Toy Set (3 pcs)", categorySlug: "toys-enrichment",
    unit: "Pack of 3", price: 950, salePrice: 749, stock: 64, imageKind: "toy", imageUrl: "", featured: true, active: true,
    description: "Hand-knotted natural cotton ropes for tug, fetch and teething — helps clean teeth while they play. Supervise playtime.",
    highlights: ["100% natural cotton", "Supports dental hygiene", "Three sizes for all breeds", "Machine washable"],
  },
  {
    id: "p07", slug: "adjustable-no-pull-harness", name: "Adjustable No-Pull Harness & Leash Set", categorySlug: "collars-leashes-harnesses",
    unit: "Medium · Navy", price: 2400, salePrice: 1899, stock: 29, imageKind: "harness", imageUrl: "", featured: true, active: true,
    description: "Padded, breathable no-pull harness with reflective trim and matching 5 ft leash. Four-point adjustment for a perfect, escape-proof fit.",
    highlights: ["No-pull front clip", "Soft breathable padding", "Reflective night-safe trim", "Matching leash included"],
  },
  {
    id: "p08", slug: "gentle-grooming-kit", name: "Gentle Grooming Kit — Shampoo, Brush & Nail Care", categorySlug: "grooming-hygiene",
    unit: "Complete kit", price: 2850, salePrice: 2299, stock: 38, imageKind: "grooming", imageUrl: "", featured: true, active: true,
    description: "Everything for spa day at home: pH-balanced oatmeal shampoo (500 ml), self-cleaning slicker Brush, nail clipper and massage glove.",
    highlights: ["Oatmeal soothing shampoo 500 ml", "Self-cleaning slicker Brush", "Safe-guard nail clipper", "For dogs & cats"],
  },
  {
    id: "p09", slug: "ceramic-bowl-duo", name: "Ceramic Food & Water Bowl Duo — Elevated Stand", categorySlug: "bowls-feeders",
    unit: "Set of 2 + stand", price: 3200, salePrice: null, stock: 22, imageKind: "bowls", imageUrl: "", featured: false, active: true,
    description: "Hand-glazed stoneware bowls on a raised bamboo stand to ease neck strain and keep feeding corners looking beautiful.",
    highlights: ["Food-grade ceramic", "Raised ergonomic stand", "Dishwasher safe", "Heavy, tip-resistant base"],
  },
  {
    id: "p10", slug: "natural-treat-selection", name: "Natural Treat & Chew Selection Box", categorySlug: "treats-chews",
    unit: "450 g box", price: 1450, salePrice: 1150, stock: 51, imageKind: "treats", imageUrl: "", featured: false, active: true,
    description: "A rotating selection of oven-baked biscuits, dental chews and training treats made with simple, recognisable ingredients.",
    highlights: ["No added sugar or rawhide", "Training-size bite pieces", "Resealable freshness box", "Check ingredients for allergies"],
  },
  {
    id: "p11", slug: "calming-donut-bed", name: "Calming Donut Pet Bed — Cloud Plush", categorySlug: "pet-beds",
    unit: "Medium 70 cm", price: 4950, salePrice: 3999, stock: 17, imageKind: "bed", imageUrl: "", featured: true, active: true,
    description: "Ultra-soft faux-fur donut bed that supports burrowing and joint comfort — loved by anxious sleepers and champion nappers alike.",
    highlights: ["Anxiety-easing raised rim", "Machine washable cover", "Non-slip base", "For pets up to 15 kg"],
  },
  {
    id: "p12", slug: "ventilated-pet-carrier", name: "Ventilated Airline-Style Pet Carrier", categorySlug: "travel-accessories",
    unit: "Up to 8 kg pets", price: 6850, salePrice: 5499, stock: 14, imageKind: "carrier", imageUrl: "", featured: false, active: true,
    description: "Sturdy hard-shell carrier with steel door, 360° ventilation and top handle — the safe way to travel to the vet or beyond.",
    highlights: ["Secure steel spring door", "360° airflow vents", "Easy-clean hard shell", "Fits cats & small dogs"],
  },
  {
    id: "p13", slug: "gourmet-wet-food-tray", name: "Gourmet Wet Food Selection — 12 Tray Pack", categorySlug: "dry-wet-food",
    unit: "12 × 85 g trays", price: 2380, salePrice: 1980, stock: 44, imageKind: "wet-food", imageUrl: "", featured: false, active: true,
    description: "Succulent chunks in gravy across chicken, tuna and salmon recipes. Serve alone or as a tasty topper over dry food.",
    highlights: ["Three favourite recipes", "Complete & balanced", "No artificial preservatives", "Easy-peel trays"],
  },
  {
    id: "p14", slug: "multivitamin-supplement", name: "Daily Multivitamin & Coat Supplement Chews", categorySlug: "medicines-supplements",
    unit: "60 chews", price: 2250, salePrice: 1850, stock: 33, imageKind: "supplement", imageUrl: "", featured: false, active: true,
    description: "Tasty daily chews with vitamins A–E, biotin and fish oil for immunity, skin and a show-ready coat. Ask our vets for the right dose for your pet.",
    highlights: ["Immunity + coat support", "Palatable soft chews", "For dogs & cats", "Vet guidance available in-store"],
  },
  {
    id: "p15", slug: "cat-wand-play-set", name: "Interactive Cat Wand & Feather Play Set", categorySlug: "toys-enrichment",
    unit: "6-piece set", price: 899, salePrice: 699, stock: 72, imageKind: "wand", imageUrl: "", featured: false, active: true,
    description: "Feather wand, crinkle balls and catnip mice to satisfy hunting instincts and keep indoor cats active and lean.",
    highlights: ["6 interactive pieces", "Natural feathers & catnip", "Encourages daily exercise", "Store safely after play"],
  },
  {
    id: "p16", slug: "pet-passport-record-kit", name: "Pet Care Record Kit — Health Folder & Cards", categorySlug: "pet-stationery",
    unit: "Folder set", price: 650, salePrice: null, stock: 90, imageKind: "record-kit", imageUrl: "", featured: false, active: true,
    description: "A beautiful keepsake folder for vaccination cards, prescriptions and milestones — the perfect companion to your free Digital Pet Passport.",
    highlights: ["Vaccination card sleeves", "Milestone & weight tracker", "Emergency info card", "Pairs with Digital Pet Passport"],
  },
];
