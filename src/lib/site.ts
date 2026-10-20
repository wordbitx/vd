export const business = {
  name: "Jawad Veterinary Hospital",
  shortName: "Jawad",
  descriptor: "Veterinary Hospital & Pet Supply Store",
  address: "Al Kabir Town, Town Gate 3, Main Raiwind Road, Lahore, 54000, Pakistan",
  shortAddress: "Al Kabir Town, Main Raiwind Road, Lahore",
  plusCode: "962Q+36 Lahore, Pakistan",
  phone: "+92 300 7755230",
  phoneHref: "tel:+923007755230",
  whatsappNumber: "923007755230",
  // Reported listing hours only. Confirm the day-by-day schedule with the owner before launch.
  reportedHours: "Reported: 8:00 AM – 11:30 PM",
  hoursNote: "Daily schedule pending confirmation",
  mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Al+Kabir+Town+Town+Gate+3+Main+Raiwind+Road+Lahore+54000+Pakistan",
} as const;

export function whatsappUrl(message: string) {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export type ServiceIcon = "stethoscope" | "syringe" | "scissors" | "microscope" | "sparkles" | "heartPulse" | "smile" | "bowl";
export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  icon: ServiceIcon;
  image: string;
  overview: string;
  involves: string[];
  suitable: string;
  preparation: string;
};

// These are proposed service pages for the client demo, not a verified on-site service list.
export const services: Service[] = [
  {
    slug: "general-consultation", title: "General Consultation", shortTitle: "General Consultation", icon: "stethoscope", image: "/images/care-consultation.jpg",
    summary: "A thoughtful starting point for your pet’s health and everyday concerns.",
    overview: "A consultation is a chance to talk through a change in your pet’s health, behaviour or routine with a veterinary professional. The appropriate next steps depend on an individual assessment.",
    involves: ["Discussing your pet’s history and current concerns", "A physical examination as appropriate", "Advice on possible next steps and follow-up"],
    suitable: "Dogs, cats and other pets, subject to the team’s availability and experience with the species.",
    preparation: "Bring any previous medical records, current medicines and a note of symptoms. Keep your pet safely secured in a carrier or on a lead.",
  },
  {
    slug: "vaccination-preventive-care", title: "Vaccination & Preventive Care", shortTitle: "Vaccinations", icon: "syringe", image: "/images/care-cat.jpg",
    summary: "Discuss age-appropriate protection and routine wellbeing with the team.",
    overview: "Preventive care may include wellness checks, vaccination planning, parasite prevention and advice tailored to your pet’s age and lifestyle. Your veterinarian can advise what is appropriate after assessing your pet.",
    involves: ["Reviewing health and vaccination history", "Discussing a suitable vaccination plan", "Guidance on deworming, ticks and fleas where appropriate"],
    suitable: "Puppies, kittens and adult pets who may benefit from routine preventive care.",
    preparation: "Bring your pet’s vaccination card if available. Let the team know about any recent illness or previous vaccine reactions.",
  },
  {
    slug: "surgery-treatment", title: "Surgery & Treatment", shortTitle: "Surgery & Treatment", icon: "scissors", image: "/images/service-surgery.jpg",
    summary: "Discuss treatment pathways and whether a surgical consultation is needed.",
    overview: "Some conditions may call for medical treatment or a surgical assessment. The team can explain available options, suitability and any referral requirements once your pet has been assessed. Specific procedures and facilities must be confirmed directly.",
    involves: ["An initial clinical assessment", "A discussion of treatment or surgical options", "Planning aftercare and follow-up when applicable"],
    suitable: "Pets with a condition requiring a treatment plan or further surgical opinion, as assessed by a veterinarian.",
    preparation: "Call before visiting for procedure-specific instructions. Never withhold food, water or medication unless a veterinarian advises you to.",
  },
  {
    slug: "diagnostics-laboratory-tests", title: "Diagnostics & Laboratory Tests", shortTitle: "Diagnostics", icon: "microscope", image: "/images/care-cat.jpg",
    summary: "Ask about testing options that may help inform a care plan.",
    overview: "Diagnostic investigations can help a veterinarian understand a pet’s condition. Available tests and whether they are performed on-site or through a partner need to be confirmed with the hospital.",
    involves: ["A consultation to determine if testing is appropriate", "Discussion of available laboratory or imaging options", "Review of results and next steps when available"],
    suitable: "Pets for whom a veterinarian recommends further investigation after an examination.",
    preparation: "Bring earlier test results or medical notes. Ask the team if any preparation is needed for a particular test.",
  },
  {
    slug: "pet-grooming", title: "Pet Grooming", shortTitle: "Pet Grooming", icon: "sparkles", image: "/images/service-grooming.jpg",
    summary: "Explore gentle grooming and hygiene options for your companion.",
    overview: "Grooming can support a pet’s comfort and everyday hygiene. Available grooming services, suitable species and appointment times should be confirmed before your visit.",
    involves: ["Discussing your pet’s coat and grooming needs", "Bathing, brushing or nail care where available", "Simple guidance for at-home care"],
    suitable: "Dogs and cats who can be safely handled for grooming, subject to the team’s assessment.",
    preparation: "Tell the team about any skin sensitivity, anxiety or medical conditions before booking.",
  },
  {
    slug: "urgent-veterinary-assessment", title: "Urgent Veterinary Assessment", shortTitle: "Urgent Care", icon: "heartPulse", image: "/images/care-consultation.jpg",
    summary: "Call first if your pet needs prompt attention, so the team can guide you.",
    overview: "If something feels urgent, phone the hospital immediately to check availability and receive guidance. This website does not represent a 24-hour emergency or on-site emergency guarantee.",
    involves: ["Calling ahead to explain the situation", "An assessment if the team is available", "Advice on next steps or referral if necessary"],
    suitable: "Pets with sudden illness, injury or worrying symptoms. For a life-threatening situation, contact an available emergency veterinary service immediately.",
    preparation: "Call before travelling. Handle an injured or distressed pet carefully and follow professional advice.",
  },
  {
    slug: "dental-care", title: "Dental Care", shortTitle: "Dental Care", icon: "smile", image: "/images/care-cat.jpg",
    summary: "Start a conversation about your pet’s teeth and oral comfort.",
    overview: "Dental concerns can affect your pet’s comfort. A consultation can help determine whether an oral examination or additional care is appropriate; specific dental procedures must be confirmed with the team.",
    involves: ["Talking through signs of oral discomfort", "An oral examination where appropriate", "Recommendations for next steps and home care"],
    suitable: "Pets with bad breath, difficulty eating or visible changes in their mouth, as well as pets due for a wellness discussion.",
    preparation: "Make a note of any changes in eating or chewing and bring a list of current medicines.",
  },
  {
    slug: "pet-nutrition-guidance", title: "Pet Nutrition Guidance", shortTitle: "Nutrition Guidance", icon: "bowl", image: "/images/pet-shop.jpg",
    summary: "Explore everyday nutrition questions and feeding choices.",
    overview: "The right food depends on your pet’s age, activity, health and preferences. Ask the team about nutrition advice and the selection of everyday pet essentials available in the shop.",
    involves: ["Reviewing your pet’s current diet", "Discussing age and lifestyle needs", "Advice on appropriate food options where available"],
    suitable: "Pet owners planning a new feeding routine or navigating everyday nutrition questions.",
    preparation: "Bring the current food packaging and a rough idea of portions and feeding times.",
  },
];

export type Category = { slug: string; name: string; shortName: string };
export const categories: Category[] = [
  { slug: "cat-food", name: "Cat Food", shortName: "Cat Food" },
  { slug: "dog-food", name: "Dog Food", shortName: "Dog Food" },
  { slug: "puppy-kitten-food", name: "Puppy & Kitten Food", shortName: "Puppy & Kitten" },
  { slug: "treats-chews", name: "Treats & Chews", shortName: "Treats" },
  { slug: "dry-wet-food", name: "Dry and Wet Food", shortName: "Dry & Wet Food" },
  { slug: "cat-litter", name: "Cat Litter & Litter Accessories", shortName: "Cat Litter" },
  { slug: "toys-enrichment", name: "Toys & Enrichment", shortName: "Toys" },
  { slug: "collars-leashes-harnesses", name: "Collars, Leashes & Harnesses", shortName: "Walk Essentials" },
  { slug: "pet-beds", name: "Pet Beds & Comfort", shortName: "Beds & Comfort" },
  { slug: "bowls-feeders", name: "Bowls, Feeders & Water Dispensers", shortName: "Bowls & Feeders" },
  { slug: "grooming-hygiene", name: "Grooming Brushes, Shampoos & Hygiene", shortName: "Grooming" },
  { slug: "travel-accessories", name: "Pet Carriers & Travel Accessories", shortName: "Travel" },
  { slug: "pet-stationery", name: "Pet Stationery and Everyday Pet-Care Essentials", shortName: "Everyday Care" },
  { slug: "medicines-supplements", name: "Veterinary Medicines and Supplements", shortName: "Supplements" },
];

export type Product = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  sheet: string;
  quadrant: 0 | 1 | 2 | 3;
  description: string;
  highlights: string[];
  featured?: boolean;
};

// Representative unbranded demo products. No live inventory, verified brands, or prices are implied.
export const products: Product[] = [
  { id: "p01", slug: "adult-dog-dry-food", name: "Adult Dog Dry Food", categorySlug: "dog-food", sheet: "/images/products-food.jpg", quadrant: 0, featured: true, description: "A representative everyday dry food option for adult dogs. Actual brands, sizes and formulations will be added after approval.", highlights: ["Sample product listing", "Brand and pack size to be confirmed", "Ask about suitable feeding options"] },
  { id: "p02", slug: "everyday-cat-food", name: "Everyday Cat Food", categorySlug: "cat-food", sheet: "/images/products-food.jpg", quadrant: 1, featured: true, description: "A sample cat food listing to demonstrate the future shop experience. Ask the team about currently available options.", highlights: ["Sample product listing", "Available formulas to be confirmed", "Ask about your cat’s needs"] },
  { id: "p03", slug: "puppy-starter-food", name: "Puppy Starter Food", categorySlug: "puppy-kitten-food", sheet: "/images/products-food.jpg", quadrant: 2, featured: true, description: "A representative growing-pet food listing. Exact recipes and availability are pending confirmation.", highlights: ["Sample product listing", "Feeding suitability varies by pet", "Packaging shown is illustrative"] },
  { id: "p04", slug: "clumping-cat-litter", name: "Clumping Cat Litter", categorySlug: "cat-litter", sheet: "/images/products-food.jpg", quadrant: 3, featured: true, description: "A sample litter and litter-care category item for the demo shop.", highlights: ["Sample product listing", "Type and size to be confirmed", "Ask about litter accessories"] },
  { id: "p05", slug: "cotton-rope-play-set", name: "Cotton Rope Play Set", categorySlug: "toys-enrichment", sheet: "/images/products-accessories.jpg", quadrant: 0, featured: true, description: "A representative toy for playtime and enrichment. Choose toys appropriate for your pet’s size and supervise play.", highlights: ["Sample product listing", "Colours may vary", "Supervise playtime"] },
  { id: "p06", slug: "adjustable-walk-harness", name: "Adjustable Walk Harness", categorySlug: "collars-leashes-harnesses", sheet: "/images/products-accessories.jpg", quadrant: 1, featured: true, description: "A sample adjustable harness and leash pairing for everyday walks.", highlights: ["Sample product listing", "Sizing to be confirmed", "Check fit before use"] },
  { id: "p07", slug: "gentle-grooming-essentials", name: "Gentle Grooming Essentials", categorySlug: "grooming-hygiene", sheet: "/images/products-accessories.jpg", quadrant: 2, featured: true, description: "A representative shampoo and brush set for everyday grooming.", highlights: ["Sample product listing", "Ingredients and sizes to be confirmed", "Ask about sensitive skin"] },
  { id: "p08", slug: "ceramic-food-water-bowls", name: "Ceramic Food & Water Bowls", categorySlug: "bowls-feeders", sheet: "/images/products-accessories.jpg", quadrant: 3, featured: true, description: "A sample set of simple ceramic feeding bowls for pets.", highlights: ["Sample product listing", "Sizes and colours to be confirmed", "Everyday feeding essential"] },
  { id: "p09", slug: "natural-treat-selection", name: "Treat & Chew Selection", categorySlug: "treats-chews", sheet: "/images/products-more.jpg", quadrant: 0, description: "A representative treats category listing. Ingredient details and suitable options must be confirmed before purchase.", highlights: ["Sample product listing", "Check ingredients for your pet", "Supervise chewing"] },
  { id: "p10", slug: "soft-pet-bed", name: "Soft Pet Bed", categorySlug: "pet-beds", sheet: "/images/products-more.jpg", quadrant: 1, description: "A sample comfortable bed for a pet’s own little corner of the home.", highlights: ["Sample product listing", "Sizes and colours to be confirmed", "Comfort for everyday rest"] },
  { id: "p11", slug: "ventilated-pet-carrier", name: "Ventilated Pet Carrier", categorySlug: "travel-accessories", sheet: "/images/products-more.jpg", quadrant: 2, description: "A representative carrier for safer, more comfortable trips.", highlights: ["Sample product listing", "Check sizing before travel", "Style and stock to be confirmed"] },
  { id: "p12", slug: "pet-care-record-kit", name: "Pet Care Record Kit", categorySlug: "pet-stationery", sheet: "/images/products-more.jpg", quadrant: 3, description: "A sample notebook and record-keeping essential for keeping pet-care notes together.", highlights: ["Sample product listing", "Design to be confirmed", "For everyday pet-care notes"] },
  { id: "p13", slug: "wet-food-selection", name: "Wet Food Selection", categorySlug: "dry-wet-food", sheet: "/images/products-extra.jpg", quadrant: 0, description: "A representative wet food category item. Ask the shop about brands and formulations currently available.", highlights: ["Sample product listing", "Recipes and pack sizes to be confirmed", "Choose according to your pet’s needs"] },
  { id: "p14", slug: "veterinary-supplement-enquiry", name: "Pet Supplement Enquiry", categorySlug: "medicines-supplements", sheet: "/images/products-extra.jpg", quadrant: 3, description: "An enquiry-only category example. Veterinary medicines and supplements should be supplied only where appropriately stocked and legally permitted, with professional guidance where required.", highlights: ["Enquiry only", "No medicine is sold through this demo", "Availability and suitability require confirmation"] },
  { id: "p15", slug: "kitten-starter-food", name: "Kitten Starter Food", categorySlug: "puppy-kitten-food", sheet: "/images/products-extra.jpg", quadrant: 1, description: "A representative starter food option for kittens. The actual formulation will depend on available brands.", highlights: ["Sample product listing", "Age-specific nutrition varies", "Ask about available options"] },
  { id: "p16", slug: "cat-wand-toy-set", name: "Cat Wand Toy Set", categorySlug: "toys-enrichment", sheet: "/images/products-extra.jpg", quadrant: 2, description: "A representative interactive toy set for cats. Supervise play and store wand toys safely afterward.", highlights: ["Sample product listing", "Colours may vary", "Interactive play essential"] },
];

export const galleryItems = [
  { id: "g1", src: "/images/hero-vet.jpg", title: "A gentler visit", alt: "Illustrative veterinarian caring for a dog and cat in a clinic", caption: "Illustrative demo image — not a photograph of Jawad Veterinary Hospital." },
  { id: "g2", src: "/images/gallery-interior.jpg", title: "A welcoming space", alt: "Illustrative light-filled veterinary clinic waiting space", caption: "Illustrative facility image. Replace with an actual hospital photograph before launch." },
  { id: "g3", src: "/images/care-consultation.jpg", title: "Thoughtful consultations", alt: "Illustrative veterinarian checking a dog in a consultation room", caption: "Illustrative demo image — not an actual team member or patient." },
  { id: "g4", src: "/images/pet-shop.jpg", title: "Everyday pet essentials", alt: "Illustrative pet store shelves with food and accessories", caption: "Illustrative shop image. Replace with actual store photos before launch." },
  { id: "g5", src: "/images/care-cat.jpg", title: "Care for feline friends", alt: "Illustrative close-up of a cat at a veterinary examination", caption: "Illustrative demo image — not an actual hospital photograph." },
  { id: "g6", src: "/images/team-at-work.jpg", title: "Working together for pets", alt: "Illustrative veterinary professionals caring for a dog", caption: "Illustrative demo image. Actual team photographs pending client approval." },
  { id: "g7", src: "/images/gallery-pets.jpg", title: "A happy, healthy companion", alt: "Illustrative photograph of a golden retriever resting indoors in soft sunlight", caption: "Illustrative stock photograph — not an actual patient of Jawad Veterinary Hospital." },
  { id: "g8", src: "/images/gallery-exam.jpg", title: "Careful, calm examinations", alt: "Illustrative photograph of a veterinary professional examining a small dog", caption: "Illustrative stock photograph — not an actual Jawad team member or patient." },
  { id: "g9", src: "/images/gallery-care.jpg", title: "A gentle health check", alt: "Illustrative photograph of a veterinarian using a stethoscope on a small dog", caption: "Illustrative stock photograph. Replace with approved hospital photography before launch." },
];

export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

// Educational drafts only: a qualified veterinarian should review these before publication.
export const articles: Article[] = [
  {
    slug: "preparing-your-pet-for-a-vet-visit", title: "A Calmer Trip to the Vet: How to Prepare Your Pet", category: "Everyday care", image: "/images/care-consultation.jpg", readTime: "4 min read",
    excerpt: "A little planning can make a veterinary visit more comfortable for both you and your companion.",
    sections: [
      { heading: "Start with the journey", paragraphs: ["For many pets, the journey is the unfamiliar part. Give yourself extra time, use a secure carrier or well-fitted lead, and keep the trip as calm as you can.", "If your pet finds travelling particularly stressful, mention it when you contact the hospital. The team may be able to offer preparation advice."] },
      { heading: "Bring the useful details", paragraphs: ["A few notes can help you make the most of your appointment."], bullets: ["Previous records and vaccination cards, if you have them", "A list of current medicines, supplements and food", "When symptoms started, what you have noticed and any questions you want to ask"] },
      { heading: "Take things at your pet’s pace", paragraphs: ["Give your pet space to settle when you arrive. Speak to the team about handling concerns, and avoid changing feeding or medication routines unless a veterinary professional has advised you to."] },
    ],
  },
  {
    slug: "puppy-vaccinations-what-to-ask", title: "Puppy Vaccinations: What to Ask Your Veterinarian", category: "Preventive care", image: "/images/hero-vet.jpg", readTime: "5 min read",
    excerpt: "Understand the questions worth asking when planning your puppy’s early preventive care.",
    sections: [
      { heading: "Why an individual plan matters", paragraphs: ["Puppies need age-appropriate preventive care, but schedules can vary by medical history, location and lifestyle. A veterinarian can recommend a plan after assessing your puppy."] },
      { heading: "Questions for your visit", paragraphs: ["Bring any records from a breeder, rescue or previous clinic, and ask for a written explanation of the recommended plan."], bullets: ["Which vaccines are appropriate for my puppy?", "When should we return for follow-up doses?", "What should I watch for after the appointment?", "When should we discuss parasite prevention?"] },
      { heading: "Keep records close", paragraphs: ["Store your puppy’s vaccination card somewhere accessible and share it at future visits. If your puppy seems unwell, call a veterinarian for advice rather than waiting for a routine appointment."] },
    ],
  },
  {
    slug: "choosing-everyday-pet-food", title: "Choosing Everyday Food for Your Dog or Cat", category: "Nutrition", image: "/images/pet-shop.jpg", readTime: "4 min read",
    excerpt: "A simple starting point for thinking about life stage, feeding routine and individual needs.",
    sections: [
      { heading: "Start with your pet, not the packaging", paragraphs: ["Age, size, activity and health conditions all affect food choices. A diet that works for one pet may not be right for another. Ask a veterinary professional for personalised advice, especially if your pet has a medical condition."] },
      { heading: "Read the practical details", paragraphs: ["Look for clear life-stage information and feeding guidance on the packaging. Measure portions consistently and keep fresh water available."], bullets: ["Consider life stage: growing, adult or senior", "Check the ingredient and feeding information", "Introduce food changes gradually when advised", "Monitor appetite, weight and energy over time"] },
      { heading: "Ask when you are unsure", paragraphs: ["If your pet’s appetite changes, they lose weight unexpectedly or they develop digestive issues, a veterinary consultation is a better next step than guessing at a new food."] },
    ],
  },
  {
    slug: "signs-your-pet-needs-vet-attention", title: "When Should You Call the Vet About Your Pet?", category: "Pet wellbeing", image: "/images/care-cat.jpg", readTime: "5 min read",
    excerpt: "Changes in behaviour, appetite or energy can be worth discussing sooner rather than later.",
    sections: [
      { heading: "You know your pet best", paragraphs: ["A change from your pet’s usual behaviour can be an early sign that something is wrong. If you are worried, contact a veterinary professional for advice rather than relying on an online checklist."] },
      { heading: "Changes worth mentioning", paragraphs: ["Keep track of when a change started and whether it is improving or getting worse."], bullets: ["Reduced appetite or unusual thirst", "Persistent vomiting or diarrhoea", "Difficulty walking or visible discomfort", "Changes in breathing, energy or behaviour"] },
      { heading: "If it feels urgent", paragraphs: ["Trouble breathing, collapse, serious injury or rapidly worsening symptoms need prompt professional attention. Call an available veterinary service immediately; do not wait for an online booking response."] },
    ],
  },
  {
    slug: "flea-and-tick-prevention-basics", title: "Flea & Tick Prevention: The Everyday Basics", category: "Preventive care", image: "/images/team-at-work.jpg", readTime: "4 min read",
    excerpt: "Small habits and the right advice can help you stay on top of parasites.",
    sections: [
      { heading: "Prevention is personal", paragraphs: ["Parasite risks differ by species, environment and lifestyle. Ask a veterinarian which prevention approach is suitable for your pet; never use a dog treatment on a cat unless explicitly directed by a professional."] },
      { heading: "Make checks part of your routine", paragraphs: ["After outdoor activity, look over your pet’s coat and skin. Keep bedding clean and discuss any scratching, hair loss or visible parasites with the team."] },
      { heading: "Get product advice", paragraphs: ["Some products are not appropriate for very young, unwell or certain species of pets. Follow professional guidance and the product label carefully."] },
    ],
  },
];
