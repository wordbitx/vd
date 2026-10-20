/**
 * Single source of truth for clinic identity, fees and marketing content.
 * Admin → Settings can override `fees`, `hours` and copy at runtime (see src/server/store.ts).
 */
export const business = {
  name: "Jawad Veterinary Hospital",
  shortName: "Jawad",
  monogram: "JVH",
  legalName: "Jawad Veterinary Hospital & Pet Supply Store",
  tagline: "Compassionate care. Healthier pets.",
  descriptor: "Veterinary Hospital, Home Visits & Pet Mall",
  city: "Lahore",
  address: "Al Kabir Town, Town Gate 3, Main Raiwind Road, Lahore, 54000, Pakistan",
  shortAddress: "Al Kabir Town, Main Raiwind Road, Lahore",
  plusCode: "962Q+36 Lahore, Pakistan",
  phone: "+92 300 7755230",
  phoneHref: "tel:+923007755230",
  emergencyPhone: "+92 300 7755230",
  whatsappNumber: "923007755230",
  email: "care@jawadveterinary.pk",
  established: 2019,
  registration: "Punjab Animal Husbandry Dept. registered facility",
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Al+Kabir+Town+Town+Gate+3+Main+Raiwind+Road+Lahore+54000+Pakistan",
  hours: [
    { day: "Monday – Thursday", hours: "10:00 AM – 11:00 PM" },
    { day: "Friday", hours: "10:00 AM – 01:00 PM · 03:00 PM – 11:00 PM" },
    { day: "Saturday – Sunday", hours: "10:00 AM – 11:30 PM" },
    { day: "Home-visit emergency", hours: "24/7 across Lahore" },
  ],
  serviceAreas: [
    "Al Kabir Town", "Raiwind Road", "Johar Town", "Bahria Town", "DHA Lahore", "Gulberg",
    "Model Town", "Askari 11", "Valencia Town", "Ballupura", "Adda Plot", "LDA Avenue",
    "Faisal Town", "Wapda Town", "Snapr Business Park", "Shalimar Link Road",
  ],
} as const;

/** Pricing knobs the clinic can change from Admin → Settings. */
export const fees = {
  currency: "PKR",
  prefix: "JVH",
  visitHomeStandard: 1500,
  visitHomeEmergency: 2500,
  visitClinic: 1000,
  nightSurcharge: 1000,
  addOnLabKit: 800,
  addOnFollowUp: 1000,
  addOnNebulisation: 1200,
  deliveryLahore: 250,
  freeDeliveryOver: 5000,
  taxPercent: 0,
  advancePercent: 0,
} as const;

export type SlotId = "morning" | "midday" | "evening" | "night" | "any";

export const timeSlots: { id: SlotId; label: string; window: string; note: string }[] = [
  { id: "morning", label: "Morning", window: "10:00 AM – 02:00 PM", note: "Calmest households, best for seniors & kittens" },
  { id: "midday", label: "Midday", window: "02:00 PM – 06:00 PM", note: "Convenient if someone is home for lunch" },
  { id: "evening", label: "Evening", window: "06:00 PM – 10:00 PM", note: "Most requested slot" },
  { id: "night", label: "Night", window: "10:00 PM – 02:00 AM", note: "Night dispatch fee applies" },
  { id: "any", label: "Any time", window: "We call to confirm", note: "Fastest confirmation for emergencies" },
];

export type ServiceIcon =
  | "stethoscope" | "syringe" | "scissors" | "microscope" | "sparkles" | "heartPulse"
  | "smile" | "bowl" | "bone" | "testTube" | "home" | "shield" | "paw" | "dog";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  icon: ServiceIcon;
  image: string;
  /** Starting professional fee, in PKR. Travel/visit charges are added at checkout. */
  price: number;
  duration: string;
  overview: string;
  includes: string[];
  suitable: string;
  preparation: string;
  faq?: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "general-checkup", title: "General Checkup & Wellness", shortTitle: "General Checkup", icon: "stethoscope",
    image: "/images/consultation.jpg", price: 2500, duration: "30–45 mins",
    summary: "Full physical examination, vital signs and a written wellness plan for your pet.",
    overview:
      "A checkup is where good care starts. Our veterinarian examines eyes, ears, teeth, skin, coat, heart, lungs, abdomen, joints and hydration, records weight and temperature, and turns what we find into a simple plan you can actually follow at home.",
    includes: ["Head-to-toe physical examination", "Weight, temperature and hydration charting", "Nutrition and parasite-prevention advice", "Written summary with next steps", "Digital Pet Passport entry for your records"],
    suitable: "Every pet, once or twice a year — and any pet that seems 'a little off'.",
    preparation: "Bring any previous records or prescriptions. Fasting is not required unless blood work is planned.",
    faq: [
      { q: "Do you really come to my home?", a: "Yes — anywhere within our Lahore coverage area. Choose Home Visit while booking; otherwise your appointment is held at the Al Kabir Town hospital." },
      { q: "What if my pet needs medicine straight away?", a: "The veterinarian dispenses from the mobile pharmacy where appropriate and writes a dated prescription for anything the pharmacy needs to prepare." },
    ],
  },
  {
    slug: "vaccination", title: "Vaccination & Preventive Care", shortTitle: "Vaccination", icon: "syringe",
    image: "/images/vaccination.jpg", price: 3500, duration: "20–30 mins",
    summary: "Core and non-core vaccines with cold-chain handling and a printed card.",
    overview:
      "We follow age-appropriate core schedules for dogs and cats, using imported vaccines stored under a documented cold chain. Every dose is logged with brand, batch number and expiry in your pet's Digital Pet Passport, so a boarding kennel, groomer or future vet can verify it in seconds.",
    includes: ["DHPP / DHLPP and rabies (dogs)", "FVRCP, rabies and FeLV where indicated (cats)", "Batch and expiry recorded on your vaccine card", "Booster reminders before the due date", "Post-vaccination observation"],
    suitable: "Puppies and kittens starting at 6–8 weeks, and any adult whose booster is due.",
    preparation: "Your pet should be well, eating normally and free of fever on the day. Tell us about any reaction to a previous dose.",
    faq: [
      { q: "Which vaccines are essential?", a: "Rabies and the core combination are the non-negotiables in Lahore. Lepto, Bordetella and FeLV depend on lifestyle — we will advise at the visit." },
      { q: "Do you send reminders?", a: "Yes. Booster due dates are attached to your pet's profile and the clinic calls or WhatsApps before they lapse." },
    ],
  },
  {
    slug: "deworming", title: "Deworming & Parasite Control", shortTitle: "Deworming", icon: "shield",
    image: "/images/deworming.jpg", price: 3000, duration: "20 mins",
    summary: "Safe internal and external parasite treatment, dosed to your pet's exact weight.",
    overview:
      "Roundworm, tapeworm, hookworm, fleas, ticks and ear mites are all common in Lahore homes. We weigh your pet, dose precisely, and separate the indoor treatment from the environmental one so the problem does not simply come back in three weeks.",
    includes: ["Weight-based dosing", "Internal dewormer (liquid or tablet)", "External flea and tick control", "Ear and skin check", "Household and bedding advice"],
    suitable: "Every pet, every 3 months. Puppies and kittens monthly until six months old.",
    preparation: "A recent stool sample helps if you suspect an active infestation, but is not required.",
    faq: [
      { q: "My pet never goes outside. Why deworm?", a: "Eggs come in on shoes, on flies, in raw food and through a littermate. Indoor-only pets still need a quarterly schedule." },
      { q: "Can I use a dog product on my cat?", a: "Never unless a veterinarian directs it. Several dog spot-ons are dangerous to cats." },
    ],
  },
  {
    slug: "tick-flea", title: "Tick & Flea Treatment", shortTitle: "Tick & Flea", icon: "sparkles",
    image: "/images/grooming.jpg", price: 2800, duration: "20–30 mins",
    summary: "Eradication and prevention for fleas, ticks, lice and manges.",
    overview:
      "We treat the animal and the environment. Infested pets are bathed and dosed, heavily affected skin is medicated, and you leave with a two-week plan for bedding, carpets, curtains and other pets in the home.",
    includes: ["Coat and skin survey", "Medicated bath where needed", "Spot-on or oral preventive", "Tick removal with aftercare", "Environment plan for the household"],
    suitable: "Itchy pets, hair patches, visible ticks, or any home with a new rescue.",
    preparation: "Do not bathe for 48 hours before a spot-on treatment. Bring the current product if one is already in use.",
  },
  {
    slug: "emergency-care", title: "Emergency & Critical Care", shortTitle: "Emergency", icon: "heartPulse",
    image: "/images/emergency.jpg", price: 4500, duration: "Varies",
    summary: "Rapid dispatch for poisoning, breathing difficulty, trauma, seizures and blockages.",
    overview:
      "Emergencies do not wait for clinic hours. Call or WhatsApp us and we triage immediately, dispatch with oxygen, IV access, emergency drugs and a splinting kit, and stabilise your pet at home before deciding whether transport is safe.",
    includes: ["Phone triage within minutes", "24/7 Lahore dispatch", "Oxygen and IV support", "Wound stabilisation and splinting", "Referral coordination for surgery or imaging"],
    suitable: "Collapse, laboured breathing, uncontrolled bleeding, suspected poisoning, straining to urinate, prolonged labour, seizure, hit-by-vehicle.",
    preparation: "Do not feed or give human medicine. Send a short video on WhatsApp — it often changes how fast we move.",
  },
  {
    slug: "surgical-consult", title: "Surgical Consultation & Aftercare", shortTitle: "Surgical Consult", icon: "microscope",
    image: "/images/surgery.jpg", price: 3500, duration: "45–60 mins",
    summary: "Pre-operative assessment, neutering plans, wound care and suture removal.",
    overview:
      "Before any procedure we assess fitness, explain the options honestly and quote a written estimate. After surgery we handle dressing changes, pain control and stitch removal at your home, so your pet recovers somewhere quiet.",
    includes: ["Pre-anaesthetic examination", "Written estimate before booking", "Neutering and soft-tissue planning", "Post-op dressing and suture removal", "Pain and nausea management"],
    suitable: "Neutering, lump removal, orthopaedic assessment, or any pet recovering from surgery elsewhere.",
    preparation: "Overnight fasting if instructed by the clinic. Bring prior records and imaging.",
  },
  {
    slug: "dental", title: "Dental Cleaning & Extractions", shortTitle: "Dental Care", icon: "smile",
    image: "/images/dental.jpg", price: 8000, duration: "60–90 mins",
    summary: "Ultrasonic scaling, polishing, grading and extractions under monitored anaesthesia.",
    overview:
      "Bad breath is not normal — it is usually infection. We grade each tooth, scale and polish above and below the gumline, extract what cannot be saved, and monitor anaesthesia throughout with pulse-oximetry.",
    includes: ["Dental grading chart", "Ultrasonic scaling and polishing", "Extractions where required", "Monitored anaesthesia with IV support", "Home brushing and diet plan"],
    suitable: "Tartar, bad breath, drooling, reluctance to chew, bleeding gums, or any pet over three years old.",
    preparation: "Overnight fast as directed. Blood work is recommended for pets over seven.",
    faq: [
      { q: "Is anaesthesia safe for an older pet?", a: "We pre-screen with blood work, use IV catheters and monitor throughout. Age alone is not a reason to leave a mouth full of infection." },
    ],
  },
  {
    slug: "lab-tests", title: "Lab Tests & Diagnostics", shortTitle: "Lab Tests", icon: "testTube",
    image: "/images/lab.jpg", price: 2000, duration: "30–45 mins",
    summary: "Blood, urine, skin and faecal sampling at home, with results explained.",
    overview:
      "Sample collection happens at your door; analysis runs through our reference laboratory. You get readable reports and a veterinarian's interpretation — not just a PDF of numbers.",
    includes: ["CBC and biochemistry panels", "Urinalysis and culture", "Skin scraping, cytology, Wood's lamp", "Faecal and parasite screens", "Fasting glucose and thyroid panels"],
    suitable: "Lethargy, weight loss, chronic itching, vomiting, diabetes monitoring, pre-anaesthetic screening.",
    preparation: "An 8–12 hour fast gives the cleanest biochemistry. Keep water available.",
  },
  {
    slug: "nutrition", title: "Pet Nutrition Consultation", shortTitle: "Nutrition", icon: "bowl",
    image: "/images/nutrition.jpg", price: 2000, duration: "30 mins",
    summary: "Life-stage feeding plans, weight management and therapeutic diets.",
    overview:
      "We look at the body condition score, the food actually in your cupboard and the portion you pour, then build a plan you can keep — including home-cooked balance where that is the right choice for your household.",
    includes: ["Body condition scoring", "Daily calorie target", "Brand and formulation shortlist", "Weight-loss milestones", "Therapeutic diet guidance"],
    suitable: "Obesity, picky eating, growth planning, kidney or liver support, skin coats and sensitivities.",
    preparation: "Photograph the back of your current food bag and note how much you feed per day.",
  },
  {
    slug: "grooming", title: "Grooming, Bath & Spa", shortTitle: "Grooming", icon: "scissors",
    image: "/images/grooming.jpg", price: 3500, duration: "60–120 mins",
    summary: "Medicated and cosmetic grooming with clipping, nail and ear care.",
    overview:
      "A cool-water gentle routine with breed-appropriate clipping, degreasing or medicated shampoo, blow-dry, nails and ears. Skin findings are reported to the veterinarian before anything is applied.",
    includes: ["Shampoo matched to the skin", "Breed cut or de-shedding", "Blow-dry and brush-out", "Nail trim and ear cleaning", "Skin report to the vet"],
    suitable: "Every 4–8 weeks, or as directed after a skin treatment.",
    preparation: "Current vaccination details are required for grooming. Tell us about handling concerns.",
  },
  {
    slug: "microchip", title: "Microchipping & ID Tags", shortTitle: "Microchipping", icon: "bone",
    image: "/images/home-visit.jpg", price: 9500, duration: "15 mins",
    summary: "ISO 11784/8511 microchip, registration and an NFC-enabled tag.",
    overview:
      "A chip the size of a grain of rice, inserted between the shoulder blades in one quick step, plus an NFC collar tag that carries your pet's profile and your contact details for anyone who finds them.",
    includes: ["ISO-compliant 134.2 kHz chip", "Implantation and scanning", "Lifetime registration and updates", "NFC collar tag", "Passport entry with chip number"],
    suitable: "Any pet that goes outside, travels, or is worth never losing.",
    preparation: "None. A calm dog or cat handled by an owner they trust is all we need.",
  },
  {
    slug: "boarding", title: "Boarding & Day Care", shortTitle: "Boarding", icon: "home",
    image: "/images/clinic-interior.jpg", price: 1500, duration: "Per day",
    summary: "Vaccine-verified boarding with daily photos and medication support.",
    overview:
      "Clean individual suites, two walks a day, enrichment for sociable pets, and a daily photo so you can see them settled. Injectables, timed feeds and post-surgical recovery are handled by the clinical team.",
    includes: ["Individual clean suite", "Two walks plus play", "Daily photo update", "Medication and special diets", "On-site veterinary cover"],
    suitable: "Travel, house moves, exams — and pets recovering from surgery.",
    preparation: "Vaccination must be current. Bring their own food and something that smells like home.",
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

export type Icon = ServiceIcon;

export type Product = {
  id: string; slug: string; name: string; brand: string; categorySlug: string;
  price: number; compareAt?: number; image: string; gallery?: string[];
  description: string; highlights: string[]; stock: number; rating: number; reviews: number;
  badge?: string; sizes?: string[]; tags?: string[]; featured?: boolean;
};

export const categories = [
  { slug: "dog-food", name: "Dog Food", shortName: "Dog Food", icon: "dog" as Icon },
  { slug: "cat-food", name: "Cat Food", shortName: "Cat Food", icon: "paw" as Icon },
  { slug: "treats-chews", name: "Treats & Chews", shortName: "Treats", icon: "bone" as Icon },
  { slug: "toys-enrichment", name: "Toys & Enrichment", shortName: "Toys", icon: "sparkles" as Icon },
  { slug: "grooming-care", name: "Grooming & Skin Care", shortName: "Grooming", icon: "scissors" as Icon },
  { slug: "supplements", name: "Supplements & Pharmacy", shortName: "Supplements", icon: "shield" as Icon },
  { slug: "beds-carriers", name: "Beds, Bowls & Carriers", shortName: "Beds & Travel", icon: "home" as Icon },
  { slug: "collars-leashes", name: "Collars & Leashes", shortName: "Walking", icon: "microchip" as unknown as Icon },
];

const img = (n: string) => `/images/${n}`;

export const products: Product[] = [
  { id: "p01", slug: "adult-lamb-rice-3kg", name: "Adult Lamb & Rice Dry Dog Food 3 kg", brand: "Care Nutrition", categorySlug: "dog-food", price: 5250, compareAt: 5900, image: img("product-dog-food.jpg"), description: "A maintenance formula for adult dogs with lamb as the first named protein and rice for easy digestion. Sold from our Al Kabir Town store with batch and expiry on every bag.", highlights: ["Lamb listed as the first ingredient", "Omega 3 & 6 for coat condition", "Batch and expiry printed on the pack", "Ask us about the 12 kg bag"], stock: 18, rating: 4.7, reviews: 34, badge: "Best seller", featured: true, sizes: ["1.5 kg", "3 kg", "12 kg"], tags: ["dog", "adult", "dry"] },
  { id: "p02", slug: "puppy-growth-chicken-1-5kg", name: "Puppy Growth Chicken Formula 1.5 kg", brand: "Care Nutrition", categorySlug: "dog-food", price: 2950, image: img("product-dog-food.jpg"), description: "Higher energy and calcium for growing puppies, with kibble sized for small jaws. Transition gradually over 7 days.", highlights: ["DHA for brain and eye development", "Controlled calcium for growth", "Small-kibble size", "Free feeding-portion card"], stock: 24, rating: 4.6, reviews: 21, tags: ["dog", "puppy", "dry"], featured: true },
  { id: "p03", slug: "sterilised-cat-food-1-5kg", name: "Sterilised Cat Formula 1.5 kg", brand: "Feline Co.", categorySlug: "cat-food", price: 3100, compareAt: 3600, image: img("product-cat-food.jpg"), description: "Lower fat, higher fibre and urinary support for neutered indoor cats, formulated to help keep body condition healthy.", highlights: ["L-carnitine for lean mass", "Urinary health support", "Helps control hairballs", "Portion guide included"], stock: 15, rating: 4.8, reviews: 46, badge: "-14%", featured: true, tags: ["cat", "adult", "dry"] },
  { id: "p04", slug: "kitten-starters-pouches", name: "Kitten Starter Mousse 12 Pouches", brand: "Feline Co.", categorySlug: "cat-food", price: 1850, image: img("product-cat-food.jpg"), description: "Soft mousse for weaning kittens and cats who prefer wet food. A good choice during dental recovery.", highlights: ["Soft texture for young kittens", "High moisture for urinary flow", "No added sugar or colour", "12 × 85 g pouches"], stock: 30, rating: 4.5, reviews: 12, tags: ["cat", "kitten", "wet"] },
  { id: "p05", slug: "dental-chew-sticks", name: "Dental Chew Sticks — 28 count", brand: "VetCare", categorySlug: "treats-chews", price: 1650, image: img("product-treats.jpg"), description: "Textured daily chews designed to reduce plaque build-up between cleanings. Always supervise chewing.", highlights: ["Daily plaque support", "Sized for medium dogs", "Under 30 kcal per chew", "Resealable pouch"], stock: 40, rating: 4.4, reviews: 27, featured: true, tags: ["dog", "dental"] },
  { id: "p06", slug: "training-treats-grainfree", name: "Grain-Free Training Treats", brand: "VetCare", categorySlug: "treats-chews", price: 950, image: img("product-treats.jpg"), description: "Small, soft, high-value training rewards that break cleanly — useful for clinic-desensitisation work at home.", highlights: ["Breaks into low-calorie pieces", "Single animal protein", "No wheat or maize", "Great for clicker work"], stock: 55, rating: 4.7, reviews: 19, tags: ["dog", "training"] },
  { id: "p07", slug: "interactive-puzzle-feeder", name: "Interactive Puzzle Feeder", brand: "Playful Paws", categorySlug: "toys-enrichment", price: 2200, compareAt: 2600, image: img("product-toys.jpg"), description: "Slow-feeder puzzle that turns a meal into ten minutes of sniffing and problem-solving. Excellent for weight management and anxious pets.", highlights: ["Slows fast eaters", "Machine-washable tray", "Rubber base for hard floors", "Recommended by our behaviour team"], stock: 22, rating: 4.6, reviews: 15, badge: "Vet pick", tags: ["enrichment", "cat", "dog"] },
  { id: "p08", slug: "cat-wand-toy-set", name: "Cat Wand & Replacement Feathers", brand: "Playful Paws", categorySlug: "toys-enrichment", price: 780, image: img("product-toys.jpg"), description: "A sturdy wand with three replacement lure sets. Store it out of reach — never leave a string toy with an unsupervised cat.", highlights: ["Three lure refills included", "Soft, pet-safe fibres", "Retractable wand", "Supervise and store safely"], stock: 60, rating: 4.3, reviews: 9, tags: ["cat", "play"] },
  { id: "p09", slug: "oatmeal-medicated-shampoo", name: "Oatmeal Soothing Shampoo 250 ml", brand: "DermaPet", categorySlug: "grooming-care", price: 1450, image: img("product-grooming.jpg"), description: "Fragrance-free colloidal oatmeal shampoo for itchy, dry or post-treatment skin. Leave 5–10 minutes before rinsing.", highlights: ["Fragrance and soap free", "Safe for cats and dogs", "Veterinarian formulation", "Patch-test first"], stock: 33, rating: 4.8, reviews: 41, featured: true, tags: ["skin", "grooming"] },
  { id: "p10", slug: "nail-clippers-grooming-kit", name: "Grooming Kit: Clippers, Brush & Nail Trimmer", brand: "DermaPet", categorySlug: "grooming-care", price: 1950, image: img("product-grooming.jpg"), description: "A home grooming set with a scissor-style trimmer, slicker brush, comb and styptic powder for clipped nails.", highlights: ["Safety guard trimmer", "Styptic powder included", "Slicker brush and steel comb", "Guide card for nervous pets"], stock: 20, rating: 4.4, reviews: 8, tags: ["grooming", "dog", "cat"] },
  { id: "p11", slug: "omega-3-skin-coat-oil", name: "Omega 3 Skin & Coat Oil 250 ml", brand: "WellPet", categorySlug: "supplements", price: 2150, image: img("product-supplement.jpg"), description: "Cold-pressed fish oil for coat condition and joint comfort, dosed by weight. Refrigerate after opening.", highlights: ["EPA + DHA per 5 ml", "Pump dosing by weight", "Sustainably sourced", "Ask us about interactions"], stock: 27, rating: 4.7, reviews: 23, tags: ["supplement", "skin", "joints"] },
  { id: "p12", slug: "joint-support-chews", name: "Joint Support Chews — 60 count", brand: "WellPet", categorySlug: "supplements", price: 3400, compareAt: 3900, image: img("product-supplement.jpg"), description: "Glucosamine, chondroitin and green-lipped mussel for older or large-breed dogs. Allow 4–6 weeks to judge the effect.", highlights: ["For senior and large breeds", "Palatable soft chew", "Two-per-day maintenance", "Discuss with your vet first"], stock: 16, rating: 4.5, reviews: 31, badge: "-13%", tags: ["supplement", "joints"] },
  { id: "p13", slug: "probiotic-diarrhoea-support", name: "Gut Probiotic Paste for Dogs & Cats", brand: "WellPet", categorySlug: "supplements", price: 1750, image: img("product-supplement.jpg"), description: "Syringe-dosed probiotic and prebiotic paste for soft stool, diet transitions and after antibiotic courses.", highlights: ["Syringe for accurate dosing", "Useful during food changes", "Shelf stable until opened", "Call us if stool persists"], stock: 25, rating: 4.6, reviews: 18, tags: ["supplement", "digestive"] },
  { id: "p14", slug: "orthopaedic-pet-bed", name: "Orthopaedic Memory-Foam Bed", brand: "RestNest", categorySlug: "beds-carriers", price: 6500, image: img("product-bed.jpg"), description: "Supportive foam base with a removable washable cover — kind to arthritic hips and elbows, and to your floor.", highlights: ["Washable zip-off cover", "Non-slip base", "Waterproof inner liner", "Three sizes in store"], stock: 11, rating: 4.9, reviews: 26, featured: true, sizes: ["Small", "Medium", "Large"], tags: ["bed", "comfort"] },
  { id: "p15", slug: "ventilated-pet-carrier", name: "Ventilated Travel Carrier", brand: "RestNest", categorySlug: "beds-carriers", price: 4800, compareAt: 5500, image: img("product-carrier.jpg"), description: "Hard-shell carrier with a top-opening door, which makes a nervous cat far easier to place. Sized for clinic and travel use.", highlights: ["Top and front access", "High ventilation panels", "Seat-belt compatible", "Wipe-clean interior"], stock: 14, rating: 4.6, reviews: 13, badge: "Vet pick", sizes: ["Cat/small dog", "Medium dog"], tags: ["travel"] },
  { id: "p16", slug: "stainless-slow-bowl-set", name: "Stainless Slow-Feed Bowl Set", brand: "RestNest", categorySlug: "beds-carriers", price: 1250, image: img("product-bed.jpg"), description: "Two raised-rim steel bowls — one maze insert for fast eaters, one plain for water. Rust-proof and dishwasher safe.", highlights: ["Food-grade stainless", "Maze insert for bloat risk", "Non-slip ring", "Dishwasher safe"], stock: 38, rating: 4.5, reviews: 11, tags: ["bowls", "feeding"] },
  { id: "p17", slug: "nfc-id-collar-tag", name: "NFC Smart ID Tag & Nylon Collar", brand: "TraceMe", categorySlug: "collars-leashes", price: 2500, image: img("product-carrier.jpg"), description: "A scannable tag carrying your pet's profile, your number and allergies — no app or subscription needed for the finder.", highlights: ["Scan with any phone", "Editable profile", "Allergy and vet contacts", "Quiet, no jingle"], stock: 29, rating: 4.8, reviews: 37, badge: "New", featured: true, tags: ["id", "safety"] },
  { id: "p18", slug: "reflective-harness-leash", name: "Reflective No-Pull Harness & Leash", brand: "TraceMe", categorySlug: "collars-leashes", price: 2950, compareAt: 3400, image: img("product-carrier.jpg"), description: "Padded Y-front harness with front and rear leash attachments plus 360° reflective stitching for Lahore evening walks.", highlights: ["Chest and rear clip", "Reflective stitching", "Padded, chafe-free edges", "Five sizes in store"], stock: 21, rating: 4.7, reviews: 22, sizes: ["XS", "S", "M", "L", "XL"], tags: ["walking", "safety"] },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "Pet Mall";

export type TeamMember = {
  slug: string; name: string; role: string; credentials: string; image: string;
  focus: string[]; bio: string; languages: string; years: number;
};

export const team: TeamMember[] = [
  { slug: "dr-jawad-hussain", name: "Dr. Jawad Hussain", role: "Lead Veterinarian & Founder", credentials: "DVM (RVMP)", image: "/images/dr-jawad.jpg", focus: ["Small animal medicine", "Emergency stabilisation", "Soft-tissue surgery"], bio: "Founded the Al Kabir Town hospital to combine clinic-grade diagnostics with unhurried, family-centred consults — and to make home visits genuinely reliable in south Lahore.", languages: "Urdu, Punjabi, English", years: 11 },
  { slug: "dr-ayesha-khan", name: "Dr. Ayesha Khan", role: "Veterinary Surgeon", credentials: "DVM, MVSc (Surgery)", image: "/images/team-vets.jpg", focus: ["Neutering & spay", "Lump and mass surgery", "Orthopaedic assessment"], bio: "Runs the surgical list and the post-operative recovery programme, including home dressing changes for pets who heal better away from the clinic.", languages: "Urdu, English", years: 8 },
  { slug: "dr-bilal-ahmed", name: "Dr. Bilal Ahmed", role: "Dermatology & Dentistry", credentials: "DVM", image: "/images/clinic-interior.jpg", focus: ["Skin scrapings and cytology", "Dental scaling", "Allergy workups"], bio: "The clinician pet parents ask for when the itching will not stop — methodical with cytology and honest about what a food trial actually requires.", languages: "Urdu, Punjabi, English", years: 6 },
  { slug: "usman-riaz", name: "Usman Riaz", role: "Clinic Manager & Pharmacy", credentials: "BSc, Vet Pharmacy", image: "/images/pharmacy.jpg", focus: ["Cold chain and stock", "Prescription dispensing", "Home-visit dispatch"], bio: "Keeps the mobile pharmacy stocked, the cold chain logged and the dispatch rota running late into the night.", languages: "Urdu, Punjabi, English", years: 9 },
];

export const galleryItems = [
  { id: "g1", src: "/images/hero-care.jpg", title: "A gentler visit", alt: "Veterinarian caring for a dog and cat in a bright clinic" },
  { id: "g2", src: "/images/clinic-interior.jpg", title: "A welcoming space", alt: "Light-filled veterinary clinic waiting space" },
  { id: "g3", src: "/images/consultation.jpg", title: "Unhurried consultations", alt: "Veterinarian checking a small dog in a consultation room" },
  { id: "g4", src: "/images/pet-shop.jpg", title: "The pet mall", alt: "Pet store shelves with food and accessories" },
  { id: "g5", src: "/images/pet-cat.jpg", title: "Feline-friendly handling", alt: "Close-up of a calm cat during a veterinary examination" },
  { id: "g6", src: "/images/team-vets.jpg", title: "Working together", alt: "Veterinary professionals caring for a dog" },
  { id: "g7", src: "/images/pet-dog.jpg", title: "Healthy, happy companions", alt: "Golden retriever resting indoors in soft sunlight" },
  { id: "g8", src: "/images/lab.jpg", title: "Answers, not guesses", alt: "Veterinary laboratory sample analysis" },
  { id: "g9", src: "/images/grooming.jpg", title: "Care that finishes well", alt: "Freshly groomed dog during a spa session" },
  { id: "g10", src: "/images/home-visit.jpg", title: "The clinic, packed and driven to you", alt: "Mobile veterinary kit prepared for a home visit" },
];

export type Post = {
  slug: string; title: string; category: string; excerpt: string; image: string;
  readTime: string; date: string; body: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
};

export const articles: Post[] = [
  {
    slug: "preparing-your-pet-for-a-vet-visit", title: "A Calmer Trip to the Vet: How to Prepare Your Pet", category: "Everyday care", image: "/images/consultation.jpg", readTime: "4 min read", date: "2026-10-02",
    excerpt: "A little planning makes a veterinary visit more comfortable for both you and your companion.",
    body: [
      { heading: "Start with the journey", paragraphs: ["For many pets the journey is the frightening part, not the exam. Give yourself extra time, use a secure carrier or a well-fitted lead, and keep the trip as boring as you can.", "If your pet is genuinely distressed by travel, tell us when you book. We can see them in a quiet hour, or come to you."] },
      { heading: "Bring what is useful", paragraphs: ["A few details make the consult sharper in the same fifteen minutes."], bullets: ["Previous records and the vaccination card", "A photo of the current food bag, or the bag itself", "When it started, what makes it better or worse, and your questions in writing"] },
      { heading: "Go at your pet's pace", paragraphs: ["Let them settle on the floor before they are lifted. Tell us about handling concerns before hands go on. Do not change food or stop medication on your own — call us instead."] },
    ],
  },
  {
    slug: "puppy-vaccination-schedule", title: "The Puppy Vaccination Schedule, Explained Simply", category: "Preventive care", image: "/images/vaccination.jpg", readTime: "5 min read", date: "2026-09-18",
    excerpt: "What the first year looks like, why boosters overlap, and the questions worth asking.",
    body: [
      { heading: "Why the schedule overlaps", paragraphs: ["Maternal antibodies passed through the first milk protect a puppy — and can also block a vaccine given too early. That is why core doses are repeated a few weeks apart rather than given once."] },
      { heading: "A typical Lahore first year", paragraphs: ["Schedules vary by brand, health status and lifestyle. Your veterinarian confirms the plan; this is the shape of it."], bullets: ["6–8 weeks: first combination dose, deworming starts", "9–12 weeks: second combination dose", "12–16 weeks: rabies, final combination, leptospirosis where advised", "Every 3 months: deworming and parasite control", "12 months: boosters, then annual review"] },
      { heading: "After the visit", paragraphs: ["A sleepy, mildly sore puppy for 24 hours is normal. Swelling that keeps growing, vomiting, facial puffiness or collapse needs an immediate call — do not wait for the next appointment."] },
    ],
  },
  {
    slug: "choosing-everyday-pet-food", title: "Choosing Everyday Food for Your Dog or Cat", category: "Nutrition", image: "/images/pet-shop.jpg", readTime: "4 min read", date: "2026-08-30",
    excerpt: "Life stage, portion, transition — a practical framework that ignores the marketing.",
    body: [
      { heading: "Start with the pet, not the packet", paragraphs: ["Age, neuter status, activity and medical history decide the food far more than a slogan does. If your pet has a condition, a therapeutic plan needs veterinary supervision."] },
      { heading: "Read the practical lines", bullets: ["A clear life-stage statement (growth, adult, senior, all-life-stage)", "Named animal protein early in the list", "Feeding guidance in grams, not just 'as needed'", "Batch and expiry on the bag in store"], paragraphs: ["Then measure. Most obesity in Lahore homes comes from a generous cup, not a bad brand."] },
      { heading: "Change food slowly", paragraphs: ["Seven days, starting at roughly a quarter of the new food and increasing, keeps most stomachs settled. Soft stool for two days is common; blood, vomiting or refusal to eat is not — call us."] },
    ],
  },
  {
    slug: "signs-your-pet-needs-vet-attention", title: "When Should You Call the Vet About Your Pet?", category: "Pet wellbeing", image: "/images/emergency.jpg", readTime: "5 min read", date: "2026-08-12",
    excerpt: "The changes that deserve a phone call today rather than a wait for next week.",
    body: [
      { heading: "You know your pet best", paragraphs: ["Nobody catches a slow change in appetite, water intake or personality like an owner does. If something feels wrong, it is worth a conversation — that is what we are here for."] },
      { heading: "Worth a call soon", bullets: ["Eating or drinking noticeably differently", "Vomiting or loose stool beyond 24 hours", "Straining in the litter tray, or going without results", "Limping, reluctance to jump, or sleeping through walks", "A lump that has changed size in weeks"] },
      { heading: "Same-hour emergencies", paragraphs: ["Laboured breathing, pale or blue gums, collapse, a seizure lasting more than two minutes, uncontrolled bleeding, suspected poisoning, or a male cat straining without passing urine. Call immediately — for the last one, do not wait for morning."] },
    ],
  },
  {
    slug: "flea-tick-prevention-lahore", title: "Flea & Tick Prevention in Lahore's Climate", category: "Preventive care", image: "/images/deworming.jpg", readTime: "4 min read", date: "2026-07-24",
    excerpt: "Why year-round prevention beats spring panic in a warm, humid city.",
    body: [
      { heading: "The maths nobody warns you about", paragraphs: ["One flea lays up to fifty eggs a day, and most of the population is in your carpet, bedding and sofa — not on the animal. Treating only the pet addresses a fraction of the problem."] },
      { heading: "What actually works here", bullets: ["A monthly or quarterly veterinary parasite product, all year", "Treating every pet in the home together", "Hot-wash bedding weekly during an outbreak", "Vacuuming soft furniture, then emptying the bin outside"] },
      { heading: "Get advice before you buy", paragraphs: ["Products differ by species, weight, age and health status. Never apply a dog spot-on to a cat unless a veterinarian has explicitly directed it."] },
    ],
  },
  {
    slug: "dental-disease-before-the-smell", title: "Dental Disease: What the Smell Is Telling You", category: "Clinic news", image: "/images/dental.jpg", readTime: "4 min read", date: "2026-07-05",
    excerpt: "Bad breath is a symptom, not a personality trait — and it rarely stops on its own.",
    body: [
      { heading: "Under the gumline", paragraphs: ["Plaque hardens into calculus, bacteria colonise below the gum, and the ligament holding the tooth loosens. By the time a tooth is mobile, much of that support is gone."] },
      { heading: "What a proper clean involves", paragraphs: ["Grading each tooth, scaling above and below the gumline under anaesthesia, polishing, extracting what cannot be saved, and pre-anaesthetic blood work for older patients."] },
      { heading: "Between visits", bullets: ["Daily brushing beats any gel", "Approved dental chews between cleanings", "Annual check of the mouth at every consult", "Bring loose or broken teeth to our attention early"] },
    ],
  },
];

export const events = [
  { id: "e1", title: "Free Puppy Wellness Day", date: "2026-11-08", place: "Al Kabir Town hospital", detail: "Weight check, vaccination review and feeding advice for puppies under six months. Book a slot — first 40 families.", cta: "Reserve a slot" },
  { id: "e2", title: "Rabies Awareness Camp", date: "2026-11-22", place: "Bahria Town / Raiwind Road", detail: "Discounted rabies vaccination for dogs and cats, plus on-the-spot microchip registration.", cta: "Enquire on WhatsApp" },
  { id: "e3", title: "Senior Pet Screening Clinic", date: "2026-12-06", place: "Al Kabir Town hospital", detail: "Blood pressure, kidney panels and dental grading for pets aged eight and above.", cta: "Book screening" },
];

export const testimonials = [
  { name: "Sana Iqbal", area: "Johar Town", text: "Our cat stopped using the litter tray and we were panicking at 11 pm. Dr. Jawad explained exactly what to watch for, then came next morning. Catheterisation was done calmly and she recovered fully.", service: "Emergency care", rating: 5 },
  { name: "Hassan Raza", area: "Bahria Town", text: "I have never had a vet weigh my dog and dose the dewormer to the gram. They record everything — batch numbers, expiry, next due date. I got a reminder before the booster lapsed.", service: "Deworming", rating: 5 },
  { name: "Mariam Sheikh", area: "DHA Phase 6", text: "The grooming and skin plan finally worked after months of shampoo changes. Dr. Bilal took scrapings, explained cytology in plain Urdu and set a real timeline.", service: "Skin & coat", rating: 5 },
  { name: "Owais Tariq", area: "Gulberg III", text: "Booked a home neutering consult, got a written estimate before anything happened, and they came for stitch removal at home. No cages, no stress for a nervous dog.", service: "Surgical consult", rating: 5 },
  { name: "Areeba Khan", area: "Model Town", text: "The Pet Mall is the reason we keep coming back — the right food actually in stock, and staff who tell you when you do not need to buy anything.", service: "Pet Mall", rating: 5 },
  { name: "Zain Abbas", area: "Askari 11", text: "They called just to check on our puppy two days after the vaccination. Small thing, big difference.", service: "Vaccination", rating: 5 },
];

export const faqs = [
  { q: "Do you really come to my home in Lahore?", a: "Yes — anywhere in our coverage area, with examination tools, oxygen, IV support and a stocked mobile pharmacy. Choose Home Visit when you book and we confirm the arrival window on WhatsApp." },
  { q: "What does a home visit cost?", a: "The professional fee for the service plus a Rs 1,500 home-visit charge (Rs 2,500 for emergency or night dispatch). Every line is shown before you confirm — there is no surprise bill." },
  { q: "Is clinic care cheaper?", a: "Attending us at Al Kabir Town removes the travel charge, so you pay only the service fee. Consultation starts at Rs 1,000." },
  { q: "How do I get my booking slip?", a: "A printable slip with a barcode reference is generated the moment you confirm. Keep it in your portal — you can reprint or share it with our team at the door." },
  { q: "How do I pay?", a: "Cash on delivery/visit, or bank transfer to the account details on your slip. Paytm/Easypaisa receipts can be sent to our WhatsApp for verification." },
  { q: "Do you keep my pet's records?", a: "Every consultation, vaccine and prescription is stored in your pet's Digital Pet Passport in the portal, yours to access and reprint at any time." },
  { q: "Can you treat rabbits, birds or turtles?", a: "Yes for consultations, nail trims, parasite control and nutritional advice. Specialist surgery is referred, and we will tell you honestly when that is the right call." },
  { q: "What about grooming while my pet is unwell?", a: "Grooming is deferred until a veterinarian clears it. Medicated baths are prescribed instead, and done as part of the treatment plan." },
];

export function whatsappUrl(message: string) {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Veterinary Services" },
  { href: "/shop", label: "Pet Mall" },
  { href: "/book-vet-appointment-lahore", label: "Book Visit" },
  { href: "/portal", label: "My Portal" },
  { href: "/team", label: "Our Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/pet-care-tips", label: "Events & Tips" },
  { href: "/adopt", label: "Adopt" },
  { href: "/contact-vet-lahore", label: "Contact" },
];

/** Header links in the same order as the reference site's navigation. */
export const primaryNav = [
  { href: "/shop", label: "Pet Mall" },
  { href: "/services", label: "Services" },
  { href: "/team", label: "Team" },
  { href: "/about", label: "About" },
  { href: "/contact-vet-lahore", label: "Contact" },
  { href: "/adopt", label: "Adopt a Pet" },
  { href: "/pet-care-tips", label: "Events" },
];
