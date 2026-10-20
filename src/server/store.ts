import { promises as fs } from "node:fs";
import path from "node:path";
import {
  articles, business, fees, galleryItems, products, services as catalogServices, team, testimonials,
} from "@/lib/site";
import { nextISO, todayISO } from "@/lib/format";
import { quoteAppointment, quoteOrder } from "@/lib/pricing";
import type {
  AdoptionRow, Appointment, AuditEntry, MedicalRecord, Message, Order, Pet, PostRow, ProductRow,
  Review, ServiceRow, Settings, User, VaccineRecord,
} from "@/lib/types";

/* ------------------------------------------------------------------ *
 * A tiny JSON document store.
 * Zero external dependencies so the portal, shop and admin panel work
 * anywhere Next.js runs. Swap `read`/`write` for Drizzle + Postgres
 * (schema mirrors these shapes in src/db/schema.ts) when going live.
 * ------------------------------------------------------------------ */

const DATA_DIR = process.env.JVH_DATA_DIR ?? path.join(process.cwd(), ".data");

export const DB = {
  users: [] as User[],
  pets: [] as Pet[],
  vaccines: [] as VaccineRecord[],
  records: [] as MedicalRecord[],
  appointments: [] as Appointment[],
  orders: [] as Order[],
  products: [] as ProductRow[],
  services: [] as ServiceRow[],
  adoption: [] as AdoptionRow[],
  posts: [] as PostRow[],
  messages: [] as Message[],
  reviews: [] as Review[],
  audit: [] as AuditEntry[],
  promos: [] as { code: string; label: string; percent: number; minSubtotal: number; active: boolean }[],
  settings: {} as Settings,
  counter: { booking: 0, order: 0 },
};

export type CollectionName = Exclude<keyof typeof DB, "settings" | "counter">;
export type RowOf<K extends CollectionName> = (typeof DB)[K][number];

const fileFor = (name: string) => path.join(DATA_DIR, `${name}.json`);

let queue: Promise<unknown> = Promise.resolve();
let seeded: Promise<void> | null = null;

function writeThrough(name: string, value: unknown) {
  const task = queue.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${fileFor(name)}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
    await fs.rename(tmp, fileFor(name));
  });
  queue = task.catch(() => undefined);
  return task;
}

async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(fileFor(name), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Rows are read from disk and cached briefly so a hot dev server does not re-read 14 files per render.
const cache = new Map<string, { at: number; rows: unknown }>();
const CACHE_MS = 1200;

async function rowsLoaded(name: string) {
  const hit = cache.get(name);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.rows;
  await ensureSeeded();
  const rows = await readJson(name, []);
  cache.set(name, { at: Date.now(), rows });
  return rows;
}

export async function rows<K extends CollectionName>(name: K): Promise<(typeof DB)[K]> {
  return (await rowsLoaded(name)) as unknown as (typeof DB)[K];
}

export function invalidate(name?: string) {
  if (name) cache.delete(name);
  else cache.clear();
}

async function setRows<K extends CollectionName>(name: K, next: (typeof DB)[K]) {
  await writeThrough(name, next);
  cache.set(name, { at: Date.now(), rows: next });
}

export async function insert<K extends CollectionName>(name: K, row: (typeof DB)[K][number]) {
  const all = await rows(name);
  await setRows(name, [row, ...all] as unknown as (typeof DB)[K]);
  return row;
}

const rowKey = (row: unknown) => {
  const record = row as Record<string, unknown>;
  return String(record.id ?? record.slug ?? record.code ?? "");
};

export async function update<K extends CollectionName>(name: K, id: string, patch: Partial<(typeof DB)[K][number]>) {
  const all = await rows(name);
  const idx = all.findIndex((r) => rowKey(r) === id);
  if (idx === -1) return null;
  const merged = { ...all[idx], ...patch } as (typeof DB)[K][number];
  const next = [...all];
  next[idx] = merged;
  await setRows(name, next as unknown as (typeof DB)[K]);
  return merged;
}

export async function replaceRows<K extends CollectionName>(name: K, next: (typeof DB)[K]) {
  await setRows(name, next);
}

export async function remove<K extends CollectionName>(name: K, id: string) {
  const all = await rows(name);
  await setRows(name, all.filter((r) => rowKey(r) !== id) as unknown as (typeof DB)[K]);
}

export async function getSettings(): Promise<Settings> {
  await ensureSeeded();
  const hit = cache.get("settings");
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.rows as Settings;
  const value = { ...defaultSettings(), ...(await readJson<Partial<Settings>>("settings", {})) };
  cache.set("settings", { at: Date.now(), rows: value });
  return value;
}

export async function saveSettings(patch: Partial<Settings>) {
  const next = { ...(await getSettings()), ...patch };
  await writeThrough("settings", next);
  cache.set("settings", { at: Date.now(), rows: next });
  return next;
}

export const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;

export async function nextRef(kind: "booking" | "order") {
  await ensureSeeded();
  const settings = await getSettings();
  const prefix =
    (settings.bookingPrefix || business.monogram).replace(/[^A-Za-z0-9]/g, "").toUpperCase() || business.monogram;
  const year = new Date().getFullYear();
  const counter = { ...DB.counter, ...(await readJson("counter", DB.counter)) };
  const bump = (n: unknown) => (typeof n === "number" && Number.isFinite(n) ? Math.floor(n) : 752600) + 1;
  if (kind === "booking") {
    counter.booking = bump(counter.booking);
    await writeThrough("counter", counter);
    return `${prefix}-${year}-${counter.booking}`;
  }
  counter.order = bump(counter.order);
  await writeThrough("counter", counter);
  return `${prefix}-O${year}-${String(counter.order % 10000).padStart(4, "0")}`;
}

export async function audit(actor: string, action: string, target: string, detail = "") {
  const all = await rows("audit");
  await setRows("audit", [{ id: uid("log"), at: new Date().toISOString(), actor, action, target, detail }, ...all].slice(0, 400));
}

/* ------------------------------------------------------------------ *
 * Seed
 * ------------------------------------------------------------------ */

function defaultSettings(): Settings {
  return {
    clinicName: business.name,
    monogram: business.monogram,
    phone: business.phone,
    whatsapp: business.whatsappNumber,
    email: business.email,
    address: business.address,
    tagline: business.tagline,
    bookingPrefix: `${business.monogram}`,
    visitHomeStandard: fees.visitHomeStandard,
    visitHomeEmergency: fees.visitHomeEmergency,
    visitClinic: fees.visitClinic,
    nightSurcharge: fees.nightSurcharge,
    deliveryLahore: fees.deliveryLahore,
    freeDeliveryOver: fees.freeDeliveryOver,
    taxPercent: fees.taxPercent,
    slotWindows: [
      { id: "morning", label: "Morning", window: "10:00 AM – 02:00 PM" },
      { id: "midday", label: "Midday", window: "02:00 PM – 06:00 PM" },
      { id: "evening", label: "Evening", window: "06:00 PM – 10:00 PM" },
      { id: "night", label: "Night", window: "10:00 PM – 02:00 AM" },
    ],
    paymentInstructions:
      "Cash to the veterinarian or rider on delivery, or bank transfer to Meezan Bank Ltd — Jawad Veterinary Hospital, Account No. 0023 0103 8844 21 (IBAN: PK36MEZN0000002301038844). Send the receipt on WhatsApp and we will mark it paid the same day.",
    whatsappTemplate:
      "Assalam-o-Alaikum, I just booked online. Reference {ref} — {service} for {pet} on {date} ({slot}). Name: {name}. Address: {area}.",
    announcement: "Free 15-minute puppy wellness screening every Wednesday before 12 pm.",
    announcementHref: "/book-vet-appointment-lahore?service=general-checkup",
    emergencyLine: business.emergencyPhone,
    hoursNote: "Home-visit emergencies 24/7 across Lahore",
  };
}

let seedPromise: Promise<void> | null = null;

/** Seeds once per process, and once per data directory (a marker file keeps restarts cheap). */
async function ensureSeeded() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    const marker = path.join(DATA_DIR, ".seeded");
    try {
      await fs.access(marker);
      return;
    } catch {
      /* not seeded yet */
    }
    await seed();
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(marker, new Date().toISOString(), "utf8");
  })().catch((error) => {
    seedPromise = null;
    throw error;
  });
  return seedPromise;
}

async function seed() {
  const { hashPassword } = await import("@/server/passwords");
  const stamp = new Date().toISOString();
  const pw = (v: string) => hashPassword(v);

  const users: User[] = [
    { id: "u_owner", name: "Dr. Jawad Hussain", email: "owner@jawadveterinary.pk", phone: "+92 300 7755230", passwordHash: pw("clinicadmin2026"), role: "owner", createdAt: stamp },
    { id: "u_ayesha", name: "Dr. Ayesha Khan", email: "ayesha@jawadveterinary.pk", phone: "+92 301 4455981", passwordHash: pw("vet2026care"), role: "vet", createdAt: stamp, area: "Hospital" },
    { id: "u_bilal", name: "Dr. Bilal Ahmed", email: "bilal@jawadveterinary.pk", phone: "+92 321 1187742", passwordHash: pw("vet2026care"), role: "vet", createdAt: stamp, area: "Hospital" },
    { id: "u_usman", name: "Usman Riaz", email: "frontdesk@jawadveterinary.pk", phone: "+92 333 9090112", passwordHash: pw("desk2026"), role: "staff", createdAt: stamp, area: "Front desk" },
    { id: "u_sana", name: "Sana Iqbal", email: "pet.parent@example.com", phone: "+92 300 1234567", passwordHash: pw("petparent2026"), role: "customer", area: "Johar Town", address: "House 44, Street 8, Johar Town, Lahore", createdAt: stamp, notes: "Prefers evening slots. Two cats, one nervous." },
    { id: "u_hassan", name: "Hassan Raza", email: "hassan@example.com", phone: "+92 321 7654321", passwordHash: pw("petparent2026"), role: "customer", area: "Bahria Town", address: "Villa 12, Crescent Boulevard, Bahria Town, Lahore", createdAt: stamp },
    { id: "u_mariam", name: "Mariam Sheikh", email: "mariam@example.com", phone: "+92 302 5544123", passwordHash: pw("petparent2026"), role: "customer", area: "DHA Phase 6", address: "Flat 3B, Lane 7, DHA Phase 6, Lahore", createdAt: stamp },
  ];

  const pets: Pet[] = [
    { id: "pet_scottie", userId: "u_sana", name: "Scottie", species: "Dog", breed: "Golden Retriever", sex: "Male", dob: "2022-04-18", weightKg: 27.4, microchip: "528000012345678", colour: "Cream", photo: "/images/pet-dog.jpg", allergies: "None reported", notes: "Anxious around strangers — feed treats from the floor.", createdAt: stamp },
    { id: "pet_mochi", userId: "u_sana", name: "Mochi", species: "Cat", breed: "Persian", sex: "Female", dob: "2024-01-09", weightKg: 3.6, colour: "Chinchilla", photo: "/images/pet-cat.jpg", allergies: "Chicken-flavoured treats cause itching", notes: "Needs annual dental review.", createdAt: stamp },
    { id: "pet_bruno", userId: "u_hassan", name: "Bruno", species: "Dog", breed: "German Shepherd", sex: "Male", dob: "2020-11-02", weightKg: 34.1, microchip: "528000099887766", colour: "Black & tan", photo: "/images/hero-care.jpg", allergies: "None", notes: "Hip assessment pending.", createdAt: stamp },
    { id: "pet_pixie", userId: "u_mariam", name: "Pixie", species: "Cat", breed: "Domestic Shorthair", sex: "Female", dob: "2025-06-21", weightKg: 2.1, photo: "/images/pet-cat.jpg", notes: "Recently adopted from our programme.", createdAt: stamp },
  ];

  const vaccines: VaccineRecord[] = [
    { id: "v1", petId: "pet_scottie", vaccine: "Rabies (Nobivac Rabies)", givenOn: nextISO(-320), nextDue: nextISO(45), batch: "RB-4471", vet: "Dr. Jawad Hussain" },
    { id: "v2", petId: "pet_scottie", vaccine: "DHLPP booster", givenOn: nextISO(-300), nextDue: nextISO(65), batch: "DH-2290", vet: "Dr. Jawad Hussain" },
    { id: "v3", petId: "pet_mochi", vaccine: "FVRCP", givenOn: nextISO(-390), nextDue: nextISO(-12), batch: "FC-1180", vet: "Dr. Bilal Ahmed", note: "Overdue — reminder sent." },
    { id: "v4", petId: "pet_bruno", vaccine: "Leptospirosis", givenOn: nextISO(-175), nextDue: nextISO(190), batch: "LP-7741", vet: "Dr. Ayesha Khan" },
    { id: "v5", petId: "pet_pixie", vaccine: "FVRCP (1st of 2)", givenOn: nextISO(-21), nextDue: nextISO(9), batch: "FC-1215", vet: "Dr. Bilal Ahmed" },
  ];

  const records: MedicalRecord[] = [
    { id: "r1", petId: "pet_scottie", type: "Consultation", title: "Annual wellness exam", date: nextISO(-318), vet: "Dr. Jawad Hussain", summary: "Body condition 5/9. Teeth: mild calculus upper premolars — dental plan discussed. Coat good. Continue quarterly deworming." },
    { id: "r2", petId: "pet_scottie", type: "Prescription", title: "Metronidazole + probiotic paste", date: nextISO(-64), vet: "Dr. Bilal Ahmed", summary: "Soft stool after a diet change. 5-day course, food transition over 7 days, review if blood appears." },
    { id: "r3", petId: "pet_mochi", type: "Lab report", title: "Skin cytology", date: nextISO(-40), vet: "Dr. Bilal Ahmed", summary: "Malassezia overgrowth, no bacteria. Medicated bath twice weekly for 4 weeks, then recheck." },
    { id: "r4", petId: "pet_bruno", type: "Consultation", title: "Lameness & hip assessment", date: nextISO(-16), vet: "Dr. Ayesha Khan", summary: "Grade 2/5 left hind lameness. Weight-managed diet started. Orthopaedic consult under sedation recommended within 6 weeks." },
    { id: "r5", petId: "pet_pixie", type: "Vaccination", title: "Kitten intake + first FVRCP", date: nextISO(-21), vet: "Dr. Bilal Ahmed", summary: "FeLV/FIV negative. Dewormed. Second dose due in 3–4 weeks." },
  ];

  const appointments: Appointment[] = [
    makeAppt({ i: 1, ref: `${business.monogram}-${new Date().getFullYear()}-752699`, userId: "u_sana", name: "Sana Iqbal", phone: "+92 300 1234567", email: "pet.parent@example.com", pet: pets[0], service: catalogServices[2], date: todayISO(), slot: "morning", mode: "home", status: "confirmed", vet: "Dr. Jawad Hussain", pay: "unpaid" }),
    makeAppt({ i: 2, userId: "u_hassan", name: "Hassan Raza", phone: "+92 321 7654321", email: "hassan@example.com", pet: pets[2], service: catalogServices[7], date: todayISO(), slot: "evening", mode: "home", status: "pending", vet: "", pay: "unpaid", addOns: ["lab-kit"] }),
    makeAppt({ i: 3, userId: "u_mariam", name: "Mariam Sheikh", phone: "+92 302 5544123", email: "mariam@example.com", pet: pets[3], service: catalogServices[1], date: nextISO(2), slot: "midday", mode: "clinic", status: "confirmed", vet: "Dr. Bilal Ahmed", pay: "paid" }),
    makeAppt({ i: 4, userId: "u_sana", name: "Sana Iqbal", phone: "+92 300 1234567", email: "pet.parent@example.com", pet: pets[1], service: catalogServices[3], date: nextISO(4), slot: "evening", mode: "home", status: "pending", vet: "", pay: "unpaid" }),
    makeAppt({ i: 5, userId: "u_hassan", name: "Hassan Raza", phone: "+92 321 7654321", email: "hassan@example.com", pet: pets[2], service: catalogServices[5], date: nextISO(6), slot: "morning", mode: "clinic", status: "confirmed", vet: "Dr. Ayesha Khan", pay: "unpaid", addOns: ["follow-up"] }),
    makeAppt({ i: 6, name: "Areeba Khan", phone: "+92 345 9988776", email: "areeba@example.com", pet: { id: null, name: "Simba", species: "Cat", breed: "Maine Coon mix" }, service: catalogServices[0], date: nextISO(-1), slot: "night", mode: "home", status: "completed", vet: "Dr. Jawad Hussain", pay: "paid", urgency: "emergency" }),
    makeAppt({ i: 7, name: "Zain Abbas", phone: "+92 311 2200987", email: "zain@example.com", pet: { id: null, name: "Rocky", species: "Dog", breed: "Labrador" }, service: catalogServices[1], date: nextISO(-3), slot: "morning", mode: "home", status: "completed", vet: "Dr. Bilal Ahmed", pay: "paid" }),
    makeAppt({ i: 8, name: "Farhan Sheikh", phone: "+92 300 5541220", pet: { id: null, name: "Luna", species: "Dog", breed: "Husky" }, service: catalogServices[4], date: nextISO(-5), slot: "midday", mode: "home", status: "cancelled", vet: "", pay: "unpaid", urgency: "emergency" }),
    makeAppt({ i: 9, userId: "u_mariam", name: "Mariam Sheikh", phone: "+92 302 5544123", email: "mariam@example.com", pet: pets[3], service: catalogServices[9], date: nextISO(-9), slot: "evening", mode: "clinic", status: "completed", vet: "Dr. Ayesha Khan", pay: "paid" }),
    makeAppt({ i: 10, name: "Nadia Aslam", phone: "+92 333 7781200", email: "nadia@example.com", pet: { id: null, name: "Coco", species: "Dog", breed: "Pomeranian" }, service: catalogServices[2], date: nextISO(-12), slot: "midday", mode: "home", status: "no_show", vet: "Dr. Bilal Ahmed", pay: "unpaid" }),
    makeAppt({ i: 11, userId: "u_sana", name: "Sana Iqbal", phone: "+92 300 1234567", email: "pet.parent@example.com", pet: pets[0], service: catalogServices[6], date: nextISO(-24), slot: "morning", mode: "clinic", status: "completed", vet: "Dr. Ayesha Khan", pay: "paid" }),
    makeAppt({ i: 12, userId: "u_hassan", name: "Hassan Raza", phone: "+92 321 7654321", email: "hassan@example.com", pet: pets[2], service: catalogServices[0], date: nextISO(-38), slot: "evening", mode: "home", status: "completed", vet: "Dr. Jawad Hussain", pay: "paid" }),
  ];

  const orders: Order[] = [
    makeOrder({ i: 1, userId: "u_sana", name: "Sana Iqbal", phone: "+92 300 1234567", email: "pet.parent@example.com", area: "Johar Town", address: "House 44, Street 8, Johar Town, Lahore", status: "dispatched", items: [["p11", 1], ["p09", 2]], pay: "unpaid" }),
    makeOrder({ i: 2, userId: "u_hassan", name: "Hassan Raza", phone: "+92 321 7654321", area: "Bahria Town", address: "Villa 12, Crescent Boulevard, Bahria Town", status: "delivered", items: [["p01", 1], ["p05", 1], ["p16", 1]], pay: "paid" }),
    makeOrder({ i: 3, userId: "u_mariam", name: "Mariam Sheikh", phone: "+92 302 5544123", area: "DHA Phase 6", address: "Flat 3B, Lane 7, DHA Phase 6", status: "pending", items: [["p04", 2], ["p08", 1]], pay: "unpaid" }),
    makeOrder({ i: 4, name: "Iqra Malik", phone: "+92 347 1122009", area: "Gulberg III", address: "House 9, M.M. Alam Road, Gulberg III", status: "delivered", items: [["p14", 1], ["p07", 1]], pay: "paid" }),
    makeOrder({ i: 5, name: "Talha Noor", phone: "+92 301 7766554", area: "Model Town", address: "Street 6, Block C, Model Town", status: "packed", items: [["p03", 1]], pay: "unpaid" }),
    makeOrder({ i: 6, name: "Sana Iqbal", phone: "+92 300 1234567", area: "Johar Town", address: "House 44, Street 8, Johar Town, Lahore", status: "delivered", items: [["p17", 1], ["p18", 1]], pay: "paid", ageDays: 11 }),
    makeOrder({ i: 7, name: "Hina Sarwar", phone: "+92 322 4455667", area: "Faisal Town", address: "Street 11, Faisal Town", status: "cancelled", items: [["p02", 1]], pay: "unpaid", ageDays: 20 }),
  ];

  const productRows: ProductRow[] = products.map((p) => ({
    id: p.id, slug: p.slug, name: p.name, brand: p.brand, categorySlug: p.categorySlug, price: p.price,
    compareAt: p.compareAt, image: p.image, description: p.description, highlights: p.highlights, stock: p.stock,
    rating: p.rating, reviews: p.reviews, badge: p.badge, sizes: p.sizes, tags: p.tags, featured: p.featured, active: true,
  }));

  const serviceRows: ServiceRow[] = catalogServices.map((s) => ({
    slug: s.slug, title: s.title, shortTitle: s.shortTitle, summary: s.summary, icon: s.icon, image: s.image,
    price: s.price, duration: s.duration, active: true, homeAvailable: s.slug !== "boarding" && s.slug !== "dental",
  }));

  const adoption: AdoptionRow[] = [
    { id: "ad1", name: "Kitu", species: "Cat", breed: "Persian mix", age: "4 months", sex: "Male", status: "available", image: "/images/adopt-1.jpg", story: "Found under a parked car on Raiwind Road at three weeks old. Hand-raised, uses a tray perfectly and will sit on your shoulder while you work.", vaccinated: true, dewormed: true, traits: ["Lap cat", "Good with kids", "Loves a window"], postedAt: nextISO(-14) },
    { id: "ad2", name: "Muffin", species: "Dog", breed: "Indie / Terrier mix", age: "1 year", sex: "Female", status: "available", image: "/images/adopt-2.jpg", story: "Surrendered when a family moved abroad. House-trained, quiet in a flat, and already knows sit. Vet-checked and neutered by our team.", vaccinated: true, dewormed: true, traits: ["Apartment-ready", "Neutered", "Calm with cats"], postedAt: nextISO(-27) },
    { id: "ad3", name: "Coco", species: "Rabbit", breed: "Dutch", age: "8 months", sex: "Female", status: "reserved", image: "/images/adopt-3.jpg", story: "Outgrew a child's birthday party. Litter-trained, needs a shaded run and hay that is actually good.", vaccinated: false, dewormed: true, traits: ["Litter trained", "Quiet home"], postedAt: nextISO(-40) },
    { id: "ad4", name: "Bruno (senior)", species: "Dog", breed: "Labrador", age: "9 years", sex: "Male", status: "available", image: "/images/adopt-4.jpg", story: "A gentle, greyspanned lab whose owner passed away. Arthritic but mobile on flat ground; we cover his joint medication for the first year.", vaccinated: true, dewormed: true, traits: ["Senior", "Medication covered", "Gentle"], postedAt: nextISO(-6) },
  ];

  const posts: PostRow[] = articles.map((a, i) => ({
    id: `post_${i + 1}`, slug: a.slug, title: a.title, category: a.category, excerpt: a.excerpt, image: a.image,
    readTime: a.readTime, date: a.date, status: "published" as const, body: a.body,
  }));

  const reviews: Review[] = testimonials.map((t, i) => ({
    id: `rev_${i + 1}`, author: t.name, area: t.area, rating: t.rating, text: t.text, service: t.service, at: nextISO(-(9 + i * 11)), status: "published" as const,
  }));

  const messages: Message[] = [
    { id: "m1", userId: "u_sana", userName: "Sana Iqbal", subject: "Mochi scratching ears at night", body: "No visible fleas but she shakes her head most evenings. Can we bring the cotton swab sample from the vet we saw last month?", at: new Date(Date.now() - 86400000 * 2).toISOString(), from: "customer", reply: "Yes, bring it in a sealed bag. Dr. Bilal will look at cytology at 5 pm Thursday — no charge for the follow-up.", repliedAt: new Date(Date.now() - 86400000 * 1.4).toISOString() },
    { id: "m2", userId: "u_hassan", userName: "Hassan Raza", subject: "Invoice for Bruno's lab work", body: "Could you re-send the invoice for the biochemistry panel? My insurer needs the lab name.", at: new Date(Date.now() - 3600000 * 20).toISOString(), from: "customer" },
  ];

  const audit: AuditEntry[] = [
    { id: "log_1", at: new Date(Date.now() - 3600000 * 3).toISOString(), actor: "Usman Riaz", action: "Appointment confirmed", target: "Home visit · Deworming", detail: "WhatsApp confirmation sent to +92 300 1234567" },
    { id: "log_2", at: new Date(Date.now() - 3600000 * 9).toISOString(), actor: "Dr. Bilal Ahmed", action: "Lab report added", target: "Mochi · Skin cytology", detail: "Malassezia overgrowth — medicated bath plan issued" },
    { id: "log_3", at: new Date(Date.now() - 86400000 * 1.2).toISOString(), actor: "System", action: "Order packed", target: "Order", detail: "Rider assigned for Johar Town route" },
  ];

  const promos = [{ code: "NEWPET10", label: "10% for first-time pet parents", percent: 10, minSubtotal: 2000, active: true }];

  await Promise.all([
    writeThrough("users", users), writeThrough("pets", pets), writeThrough("vaccines", vaccines),
    writeThrough("records", records), writeThrough("appointments", appointments), writeThrough("orders", orders),
    writeThrough("products", productRows), writeThrough("services", serviceRows), writeThrough("adoption", adoption),
    writeThrough("posts", posts), writeThrough("reviews", reviews), writeThrough("messages", messages),
    writeThrough("audit", audit), writeThrough("promos", promos),
    writeThrough("settings", defaultSettings()), writeThrough("counter", { booking: 752700 + appointments.length, order: 4100 + orders.length }),
  ]);
  invalidate();
}

type MakeAppt = {
  i: number; ref?: string; userId?: string; name: string; phone: string; email?: string; pay: "paid" | "unpaid";
  pet: { id?: string | null; name: string; species: string; breed?: string };
  service: (typeof catalogServices)[number]; date: string; slot: string; mode: "home" | "clinic";
  status: Appointment["status"]; vet: string; urgency?: "standard" | "emergency"; addOns?: string[];
};

function makeAppt({ i, ref, userId, name, phone, email, pet, service, date, slot, mode, status, vet, pay, urgency = "standard", addOns = [] }: MakeAppt): Appointment {
  const quote = quoteAppointment({ servicePrice: service.price, mode, urgency, slotId: slot, addOns });
  const created = new Date(Date.now() - (2 + i * 3) * 86400000).toISOString();
  const slotMeta = { morning: "Morning", midday: "Midday", evening: "Evening", night: "Night" }[slot] ?? "Any time";
  return {
    id: `apt_${i}`, ref: ref ?? `${business.monogram}-${new Date().getFullYear()}-${752688 + i}`,
    userId: userId ?? null, guestName: name, guestPhone: phone, guestEmail: email,
    petId: pet.id ?? null, petName: pet.name, species: pet.species, breed: pet.breed, petAge: "3 yr",
    serviceSlug: service.slug, serviceTitle: service.title, mode, urgency, date,
    slotId: slot, slotLabel: slotMeta, slotWindow: slotWindowOf(slot),
    address: mode === "home" ? "House 44, Street 8, Johar Town, Lahore" : "Jawad Veterinary Hospital, Al Kabir Town, Main Raiwind Road",
    area: mode === "home" ? "Johar Town" : "Al Kabir Town",
    symptoms: urgency === "emergency" ? "Straining, vocalising, appetite off for 36 hours." : "",
    addOns, lines: quote.lines, subtotal: quote.subtotal, total: quote.total, status,
    vetId: vet.includes("Ayesha") ? "u_ayesha" : vet.includes("Bilal") ? "u_bilal" : vet.includes("Jawad") ? "u_owner" : undefined,
    vetName: vet || undefined,
    payment: { method: pay === "paid" ? "transfer" : "cod", status: pay },
    timeline: [{ at: created, label: "Booked online", by: name }, ...(status === "pending" ? [] : [{ at: created, label: `${cap(status)} by front desk`, by: "Usman Riaz" }])],
    consent: true, createdAt: created, updatedAt: created,
  };
}

function makeOrder({ i, userId, name, phone, email, area, address, status, items, pay, ageDays = 3 + i * 4 }: {
  i: number; userId?: string; name: string; phone: string; email?: string; area: string; address: string;
  status: Order["status"]; items: [string, number][]; pay: "paid" | "unpaid"; ageDays?: number;
}): Order {
  const rows = items.map(([id, qty]) => {
    const p = products.find((x) => x.id === id)!;
    return { productId: p.id, slug: p.slug, name: p.name, price: p.price, qty, image: p.image };
  });
  const q = quoteOrder(rows);
  const created = new Date(Date.now() - ageDays * 86400000).toISOString();
  return {
    id: `ord_${i}`, ref: `${business.monogram}-O${new Date().getFullYear()}-${4100 + i}`, userId: userId ?? null,
    name, phone, email, items: rows, subtotal: q.subtotal, delivery: q.delivery, discount: q.discount, total: q.total,
    status, payment: { method: pay === "paid" ? "transfer" : "cod", status: pay }, address, area,
    notes: status === "pending" ? "Please deliver after 6 pm." : "",
    timeline: [{ at: created, label: "Order placed online", by: name }], createdAt: created, updatedAt: created,
  };
}

const cap = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function slotWindowOf(id: string) {
  return { morning: "10:00 AM – 02:00 PM", midday: "02:00 PM – 06:00 PM", evening: "06:00 PM – 10:00 PM", night: "10:00 PM – 02:00 AM" }[id] ?? "We call to confirm";
}

export const gallery = galleryItems;
export { cap as capitalise };
