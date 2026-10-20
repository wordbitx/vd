// Server-only data layer for Jawad Veterinary Hospital.
// Uses Node's built-in SQLite (node:sqlite) — real relational tables persisted
// to data/jvh.db, auto-seeded on first run. Never import this from client code.
import { createRequire } from "node:module";
import { randomBytes, randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { seedProducts } from "./catalog";
import { sellingPrice, type Adoption, type Appointment, type ContactMessage, type HospitalSettings, type Order, type OrderItem, type Pet, type Role, type StoreProduct, type User, type Vaccination } from "./types";

type SqlValue = string | number | null;
type Row = Record<string, SqlValue>;
interface Statement {
  run: (...params: SqlValue[]) => unknown;
  get: (...params: SqlValue[]) => Row | undefined;
  all: (...params: SqlValue[]) => Row[];
}
interface DatabaseSyncLike {
  exec: (sql: string) => void;
  prepare: (sql: string) => Statement;
}

const globalForDb = globalThis as typeof globalThis & { __jvhDb?: DatabaseSyncLike };

function openDatabase(): DatabaseSyncLike {
  const dataDir = join(process.cwd(), "data");
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  const require = createRequire(import.meta.url);
  // node:sqlite is listed in serverExternalPackages (next.config.ts) so the
  // bundler leaves this require to Node's runtime (builtin since Node 22).
  const { DatabaseSync } = require("node:sqlite") as { DatabaseSync: new (path: string) => DatabaseSyncLike };
  const db = new DatabaseSync(join(dataDir, "jvh.db"));
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  return db;
}

export function db(): DatabaseSyncLike {
  if (!globalForDb.__jvhDb) {
    globalForDb.__jvhDb = openDatabase();
    ensureSchema(globalForDb.__jvhDb);
    seedIfEmpty(globalForDb.__jvhDb);
  }
  return globalForDb.__jvhDb;
}

function ensureSchema(database: DatabaseSyncLike) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL DEFAULT '', password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer', address TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pets (
      id TEXT PRIMARY KEY, passport_id TEXT NOT NULL UNIQUE, user_id TEXT NOT NULL,
      name TEXT NOT NULL, species TEXT NOT NULL, breed TEXT NOT NULL DEFAULT '',
      gender TEXT NOT NULL DEFAULT '', dob TEXT NOT NULL DEFAULT '',
      weight_kg TEXT NOT NULL DEFAULT '', color TEXT NOT NULL DEFAULT '',
      microchip TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS vaccinations (
      id TEXT PRIMARY KEY, pet_id TEXT NOT NULL, vaccine TEXT NOT NULL,
      date_given TEXT NOT NULL, next_due TEXT NOT NULL DEFAULT '',
      vet_name TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY, ref TEXT NOT NULL UNIQUE, token INTEGER NOT NULL,
      user_id TEXT, pet_id TEXT,
      owner_name TEXT NOT NULL, owner_phone TEXT NOT NULL, owner_email TEXT NOT NULL DEFAULT '',
      pet_name TEXT NOT NULL, pet_type TEXT NOT NULL, pet_breed TEXT NOT NULL DEFAULT '',
      pet_age TEXT NOT NULL DEFAULT '', service_slug TEXT NOT NULL, service_title TEXT NOT NULL,
      visit_type TEXT NOT NULL, emergency INTEGER NOT NULL DEFAULT 0,
      date TEXT NOT NULL, time_slot TEXT NOT NULL, area TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '', symptoms TEXT NOT NULL DEFAULT '',
      fee INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
      doctor_name TEXT NOT NULL DEFAULT '', vet_notes TEXT NOT NULL DEFAULT '',
      follow_up_date TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      category_slug TEXT NOT NULL, unit TEXT NOT NULL DEFAULT '',
      price INTEGER NOT NULL, sale_price INTEGER, stock INTEGER NOT NULL DEFAULT 0,
      image_kind TEXT NOT NULL DEFAULT 'food-bag', image_url TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '', highlights TEXT NOT NULL DEFAULT '[]',
      featured INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, ref TEXT NOT NULL UNIQUE, user_id TEXT,
      customer_name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL, city TEXT NOT NULL DEFAULT 'Lahore', area TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '', payment_method TEXT NOT NULL DEFAULT 'cod',
      payment_status TEXT NOT NULL DEFAULT 'unpaid',
      subtotal INTEGER NOT NULL, delivery_fee INTEGER NOT NULL, total INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY, order_id TEXT NOT NULL, product_id TEXT NOT NULL,
      slug TEXT NOT NULL, name TEXT NOT NULL, unit TEXT NOT NULL DEFAULT '',
      unit_price INTEGER NOT NULL, quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS adoptions (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, species TEXT NOT NULL,
      breed TEXT NOT NULL DEFAULT '', gender TEXT NOT NULL DEFAULT 'Female',
      age_group TEXT NOT NULL DEFAULT 'Young', age_text TEXT NOT NULL DEFAULT '',
      vaccinated INTEGER NOT NULL DEFAULT 0, dewormed INTEGER NOT NULL DEFAULT 0,
      litter_trained INTEGER NOT NULL DEFAULT 0, description TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '', area TEXT NOT NULL DEFAULT 'Lahore',
      contact_phone TEXT NOT NULL DEFAULT '', posted_by TEXT,
      status TEXT NOT NULL DEFAULT 'available', created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL DEFAULT 'General enquiry',
      message TEXT NOT NULL, is_read INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS kv (
      key TEXT PRIMARY KEY, value TEXT NOT NULL
    );
  `);
}

/* ---------------------------------- kv ---------------------------------- */

function kvGet(key: string): string | null {
  const row = db().prepare("SELECT value FROM kv WHERE key = ?").get(key);
  return row ? String(row.value) : null;
}

function kvSet(key: string, value: string) {
  db().prepare("INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, value);
}

function nextSeq(key: string, start = 1000): number {
  const current = Number(kvGet(key) ?? start);
  kvSet(key, String(current + 1));
  return current + 1;
}

export function getSessionSecret(): string {
  let secret = process.env.SESSION_SECRET || kvGet("session_secret");
  if (!secret) {
    secret = randomBytes(32).toString("hex");
    kvSet("session_secret", secret);
  }
  return secret;
}

/* -------------------------------- settings ------------------------------- */

const DEFAULT_SETTINGS: HospitalSettings = {
  hospitalVisitFee: 1500,
  homeVisitFee: 2500,
  emergencyHospitalFee: 2500,
  emergencyHomeFee: 3500,
  deliveryFee: 250,
  freeDeliveryAbove: 5000,
  announcement: "",
};

export function getSettings(): HospitalSettings {
  const raw = kvGet("settings");
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<HospitalSettings>) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function updateSettings(next: HospitalSettings) {
  kvSet("settings", JSON.stringify(next));
}

export function quoteFee(visitType: "hospital" | "home", emergency: boolean): number {
  const s = getSettings();
  if (emergency) return visitType === "home" ? s.emergencyHomeFee : s.emergencyHospitalFee;
  return visitType === "home" ? s.homeVisitFee : s.hospitalVisitFee;
}

/* --------------------------------- users --------------------------------- */

function rowToUser(row: Row): User {
  return {
    id: String(row.id), name: String(row.name), email: String(row.email),
    phone: String(row.phone), role: String(row.role) as Role,
    address: String(row.address), createdAt: String(row.created_at),
  };
}

export function createUser(input: { name: string; email: string; phone: string; passwordHash: string; role?: Role; address?: string }): User {
  const id = randomUUID();
  const now = new Date().toISOString();
  db().prepare("INSERT INTO users (id, name, email, phone, password_hash, role, address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run(id, input.name, input.email.toLowerCase(), input.phone, input.passwordHash, input.role ?? "customer", input.address ?? "", now);
  return { id, name: input.name, email: input.email.toLowerCase(), phone: input.phone, role: input.role ?? "customer", address: input.address ?? "", createdAt: now };
}

export function getUserByEmail(email: string): (User & { passwordHash: string }) | null {
  const row = db().prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
  return row ? { ...rowToUser(row), passwordHash: String(row.password_hash) } : null;
}

export function getUserById(id: string): User | null {
  const row = db().prepare("SELECT * FROM users WHERE id = ?").get(id);
  return row ? rowToUser(row) : null;
}

export function listUsers(): (User & { petCount: number; orderCount: number; appointmentCount: number })[] {
  return db().prepare(`
    SELECT u.*,
      (SELECT COUNT(*) FROM pets p WHERE p.user_id = u.id) AS pet_count,
      (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count,
      (SELECT COUNT(*) FROM appointments a WHERE a.user_id = u.id) AS appointment_count
    FROM users u ORDER BY u.created_at DESC
  `).all().map((row) => ({
    ...rowToUser(row),
    petCount: Number(row.pet_count), orderCount: Number(row.order_count), appointmentCount: Number(row.appointment_count),
  }));
}

export function updateUserProfile(id: string, input: { name: string; phone: string; address: string }) {
  db().prepare("UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?").run(input.name, input.phone, input.address, id);
}

export function setUserRole(id: string, role: Role) {
  db().prepare("UPDATE users SET role = ? WHERE id = ?").run(role, id);
}

export function setUserPassword(id: string, passwordHash: string) {
  db().prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(passwordHash, id);
}

/* ---------------------------------- pets --------------------------------- */

function rowToPet(row: Row): Pet {
  return {
    id: String(row.id), passportId: String(row.passport_id), userId: String(row.user_id),
    name: String(row.name), species: String(row.species) as Pet["species"],
    breed: String(row.breed), gender: String(row.gender) as Pet["gender"],
    dob: String(row.dob), weightKg: String(row.weight_kg), color: String(row.color),
    microchip: String(row.microchip), notes: String(row.notes), createdAt: String(row.created_at),
  };
}

export function createPet(userId: string, input: Omit<Pet, "id" | "passportId" | "userId" | "createdAt">): Pet {
  const id = randomUUID();
  const passportId = `JVH-P${nextSeq("passport_seq", 10000)}`;
  const now = new Date().toISOString();
  db().prepare(`INSERT INTO pets (id, passport_id, user_id, name, species, breed, gender, dob, weight_kg, color, microchip, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, passportId, userId, input.name, input.species, input.breed, input.gender, input.dob, input.weightKg, input.color, input.microchip, input.notes, now);
  return { id, passportId, userId, createdAt: now, ...input };
}

export function listPetsByUser(userId: string): Pet[] {
  return db().prepare("SELECT * FROM pets WHERE user_id = ? ORDER BY created_at DESC").all(userId).map(rowToPet);
}

export function getPet(id: string): Pet | null {
  const row = db().prepare("SELECT * FROM pets WHERE id = ?").get(id);
  return row ? rowToPet(row) : null;
}

export function updatePet(id: string, input: Omit<Pet, "id" | "passportId" | "userId" | "createdAt">) {
  db().prepare(`UPDATE pets SET name = ?, species = ?, breed = ?, gender = ?, dob = ?, weight_kg = ?, color = ?, microchip = ?, notes = ? WHERE id = ?`)
    .run(input.name, input.species, input.breed, input.gender, input.dob, input.weightKg, input.color, input.microchip, input.notes, id);
}

export function deletePet(id: string) {
  db().prepare("DELETE FROM pets WHERE id = ?").run(id);
}

export function listAllPets(): (Pet & { ownerName: string; ownerPhone: string })[] {
  return db().prepare(`SELECT p.*, u.name AS owner_name, u.phone AS owner_phone FROM pets p JOIN users u ON u.id = p.user_id ORDER BY p.created_at DESC`)
    .all().map((row) => ({ ...rowToPet(row), ownerName: String(row.owner_name), ownerPhone: String(row.owner_phone) }));
}

/* ------------------------------ vaccinations ----------------------------- */

export function addVaccination(petId: string, input: Omit<Vaccination, "id" | "petId">): Vaccination {
  const id = randomUUID();
  db().prepare("INSERT INTO vaccinations (id, pet_id, vaccine, date_given, next_due, vet_name, notes) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(id, petId, input.vaccine, input.dateGiven, input.nextDue, input.vetName, input.notes);
  return { id, petId, ...input };
}

export function listVaccinations(petId: string): Vaccination[] {
  return db().prepare("SELECT * FROM vaccinations WHERE pet_id = ? ORDER BY date_given DESC").all(petId).map((row) => ({
    id: String(row.id), petId: String(row.pet_id), vaccine: String(row.vaccine),
    dateGiven: String(row.date_given), nextDue: String(row.next_due),
    vetName: String(row.vet_name), notes: String(row.notes),
  }));
}

export function deleteVaccination(id: string) {
  db().prepare("DELETE FROM vaccinations WHERE id = ?").run(id);
}

/* ------------------------------ appointments ----------------------------- */

function rowToAppointment(row: Row): Appointment {
  return {
    id: String(row.id), ref: String(row.ref), token: Number(row.token),
    userId: row.user_id ? String(row.user_id) : null, petId: row.pet_id ? String(row.pet_id) : null,
    ownerName: String(row.owner_name), ownerPhone: String(row.owner_phone), ownerEmail: String(row.owner_email),
    petName: String(row.pet_name), petType: String(row.pet_type), petBreed: String(row.pet_breed), petAge: String(row.pet_age),
    serviceSlug: String(row.service_slug), serviceTitle: String(row.service_title),
    visitType: String(row.visit_type) as Appointment["visitType"], emergency: Number(row.emergency) === 1,
    date: String(row.date), timeSlot: String(row.time_slot), area: String(row.area), address: String(row.address),
    symptoms: String(row.symptoms), fee: Number(row.fee), status: String(row.status) as Appointment["status"],
    doctorName: String(row.doctor_name), vetNotes: String(row.vet_notes), followUpDate: String(row.follow_up_date),
    createdAt: String(row.created_at),
  };
}

export type NewAppointment = Omit<Appointment, "id" | "ref" | "token" | "status" | "doctorName" | "vetNotes" | "followUpDate" | "createdAt">;

export function createAppointment(input: NewAppointment): Appointment {
  const database = db();
  const id = randomUUID();
  const seq = nextSeq("booking_seq", 1000);
  const compactDate = input.date.replaceAll("-", "").slice(2); // YYMMDD
  const ref = `JVH-${compactDate}-${seq}`;
  const tokenRow = database.prepare("SELECT COUNT(*) AS c FROM appointments WHERE date = ? AND status != 'cancelled'").get(input.date);
  const token = Number(tokenRow?.c ?? 0) + 1;
  const now = new Date().toISOString();
  database.prepare(`INSERT INTO appointments (id, ref, token, user_id, pet_id, owner_name, owner_phone, owner_email, pet_name, pet_type, pet_breed, pet_age, service_slug, service_title, visit_type, emergency, date, time_slot, area, address, symptoms, fee, status, doctor_name, vet_notes, follow_up_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', '', '', '', ?)`)
    .run(id, ref, token, input.userId, input.petId, input.ownerName, input.ownerPhone, input.ownerEmail, input.petName, input.petType, input.petBreed, input.petAge, input.serviceSlug, input.serviceTitle, input.visitType, input.emergency ? 1 : 0, input.date, input.timeSlot, input.area, input.address, input.symptoms, input.fee, now);
  return { ...input, id, ref, token, status: "pending", doctorName: "", vetNotes: "", followUpDate: "", createdAt: now };
}

export function getAppointmentByRef(ref: string): Appointment | null {
  const row = db().prepare("SELECT * FROM appointments WHERE ref = ?").get(ref);
  return row ? rowToAppointment(row) : null;
}

export function getAppointmentById(id: string): Appointment | null {
  const row = db().prepare("SELECT * FROM appointments WHERE id = ?").get(id);
  return row ? rowToAppointment(row) : null;
}

export function listAppointmentsByUser(userId: string): Appointment[] {
  return db().prepare("SELECT * FROM appointments WHERE user_id = ? ORDER BY date DESC, created_at DESC").all(userId).map(rowToAppointment);
}

export function listAppointmentsForPet(petId: string): Appointment[] {
  return db().prepare("SELECT * FROM appointments WHERE pet_id = ? ORDER BY date DESC").all(petId).map(rowToAppointment);
}

export function listAppointments(filters: { date?: string; status?: string; search?: string } = {}): Appointment[] {
  const clauses: string[] = [];
  const params: SqlValue[] = [];
  if (filters.date) { clauses.push("date = ?"); params.push(filters.date); }
  if (filters.status) { clauses.push("status = ?"); params.push(filters.status); }
  if (filters.search) {
    clauses.push("(owner_name LIKE ? OR owner_phone LIKE ? OR pet_name LIKE ? OR ref LIKE ?)");
    const like = `%${filters.search}%`;
    params.push(like, like, like, like);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db().prepare(`SELECT * FROM appointments ${where} ORDER BY date DESC, token DESC LIMIT 300`).all(...params).map(rowToAppointment);
}

export function updateAppointment(id: string, patch: Partial<Pick<Appointment, "status" | "doctorName" | "vetNotes" | "followUpDate" | "date" | "timeSlot">>) {
  const fields: string[] = [];
  const params: SqlValue[] = [];
  const map: Record<string, string> = { status: "status", doctorName: "doctor_name", vetNotes: "vet_notes", followUpDate: "follow_up_date", date: "date", timeSlot: "time_slot" };
  for (const [key, column] of Object.entries(map)) {
    const value = patch[key as keyof typeof patch];
    if (value !== undefined) { fields.push(`${column} = ?`); params.push(String(value)); }
  }
  if (!fields.length) return;
  params.push(id);
  db().prepare(`UPDATE appointments SET ${fields.join(", ")} WHERE id = ?`).run(...params);
}

/* -------------------------------- products ------------------------------- */

function rowToProduct(row: Row): StoreProduct {
  let highlights: string[] = [];
  try { highlights = JSON.parse(String(row.highlights)) as string[]; } catch { highlights = []; }
  return {
    id: String(row.id), slug: String(row.slug), name: String(row.name),
    categorySlug: String(row.category_slug), unit: String(row.unit),
    price: Number(row.price), salePrice: row.sale_price === null ? null : Number(row.sale_price),
    stock: Number(row.stock), imageKind: String(row.image_kind) as StoreProduct["imageKind"],
    imageUrl: String(row.image_url), description: String(row.description),
    highlights, featured: Number(row.featured) === 1, active: Number(row.active) === 1,
  };
}

export function listProducts(activeOnly = true): StoreProduct[] {
  const rows = activeOnly
    ? db().prepare("SELECT * FROM products WHERE active = 1 ORDER BY featured DESC, name ASC").all()
    : db().prepare("SELECT * FROM products ORDER BY featured DESC, name ASC").all();
  return rows.map(rowToProduct);
}

export function getProductBySlug(slug: string): StoreProduct | null {
  const row = db().prepare("SELECT * FROM products WHERE slug = ?").get(slug);
  return row ? rowToProduct(row) : null;
}

export function getProductById(id: string): StoreProduct | null {
  const row = db().prepare("SELECT * FROM products WHERE id = ?").get(id);
  return row ? rowToProduct(row) : null;
}

export function upsertProduct(product: StoreProduct) {
  db().prepare(`INSERT INTO products (id, slug, name, category_slug, unit, price, sale_price, stock, image_kind, image_url, description, highlights, featured, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET slug = excluded.slug, name = excluded.name, category_slug = excluded.category_slug, unit = excluded.unit,
      price = excluded.price, sale_price = excluded.sale_price, stock = excluded.stock, image_kind = excluded.image_kind,
      image_url = excluded.image_url, description = excluded.description, highlights = excluded.highlights, featured = excluded.featured, active = excluded.active`)
    .run(product.id, product.slug, product.name, product.categorySlug, product.unit, product.price, product.salePrice, product.stock, product.imageKind, product.imageUrl, product.description, JSON.stringify(product.highlights), product.featured ? 1 : 0, product.active ? 1 : 0);
}

export function deleteProduct(id: string) {
  db().prepare("DELETE FROM products WHERE id = ?").run(id);
}

/* --------------------------------- orders -------------------------------- */

function rowToOrder(row: Row, items: OrderItem[]): Order {
  return {
    id: String(row.id), ref: String(row.ref), userId: row.user_id ? String(row.user_id) : null,
    customerName: String(row.customer_name), phone: String(row.phone), email: String(row.email),
    address: String(row.address), city: String(row.city), area: String(row.area), notes: String(row.notes),
    paymentMethod: String(row.payment_method) as Order["paymentMethod"],
    paymentStatus: String(row.payment_status) as Order["paymentStatus"],
    items, subtotal: Number(row.subtotal), deliveryFee: Number(row.delivery_fee), total: Number(row.total),
    status: String(row.status) as Order["status"], createdAt: String(row.created_at),
  };
}

function orderItems(orderId: string): OrderItem[] {
  return db().prepare("SELECT * FROM order_items WHERE order_id = ?").all(orderId).map((row) => ({
    productId: String(row.product_id), slug: String(row.slug), name: String(row.name),
    unit: String(row.unit), unitPrice: Number(row.unit_price), quantity: Number(row.quantity),
  }));
}

export type NewOrderItem = { productId: string; quantity: number };

export function createOrder(input: {
  userId: string | null; customerName: string; phone: string; email: string;
  address: string; city: string; area: string; notes: string;
  paymentMethod: Order["paymentMethod"]; items: NewOrderItem[];
}): { order: Order } | { error: string } {
  const database = db();
  const settings = getSettings();
  const items: OrderItem[] = [];
  for (const wanted of input.items) {
    const product = getProductById(wanted.productId);
    if (!product || !product.active) return { error: "One of the items is no longer available." };
    if (product.stock < wanted.quantity) return { error: `Only ${product.stock} × ${product.name} left in stock.` };
    items.push({ productId: product.id, slug: product.slug, name: product.name, unit: product.unit, unitPrice: sellingPrice(product), quantity: wanted.quantity });
  }
  if (!items.length) return { error: "Your cart is empty." };
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = subtotal >= settings.freeDeliveryAbove ? 0 : settings.deliveryFee;
  const total = subtotal + deliveryFee;
  const id = randomUUID();
  const ref = `JVH-ORD-${nextSeq("order_seq", 100000)}`;
  const now = new Date().toISOString();
  database.exec("BEGIN");
  try {
    database.prepare(`INSERT INTO orders (id, ref, user_id, customer_name, phone, email, address, city, area, notes, payment_method, payment_status, subtotal, delivery_fee, total, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid', ?, ?, ?, 'pending', ?)`)
      .run(id, ref, input.userId, input.customerName, input.phone, input.email, input.address, input.city, input.area, input.notes, input.paymentMethod, subtotal, deliveryFee, total, now);
    for (const item of items) {
      database.prepare("INSERT INTO order_items (id, order_id, product_id, slug, name, unit, unit_price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
        .run(randomUUID(), id, item.productId, item.slug, item.name, item.unit, item.unitPrice, item.quantity);
      database.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").run(item.quantity, item.productId);
    }
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
  return { order: rowToOrder(database.prepare("SELECT * FROM orders WHERE id = ?").get(id)!, items) };
}

export function getOrderByRef(ref: string): Order | null {
  const row = db().prepare("SELECT * FROM orders WHERE ref = ?").get(ref);
  return row ? rowToOrder(row, orderItems(String(row.id))) : null;
}

export function listOrdersByUser(userId: string): Order[] {
  return db().prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(userId)
    .map((row) => rowToOrder(row, orderItems(String(row.id))));
}

export function listOrders(filters: { status?: string; search?: string } = {}): Order[] {
  const clauses: string[] = [];
  const params: SqlValue[] = [];
  if (filters.status) { clauses.push("status = ?"); params.push(filters.status); }
  if (filters.search) {
    clauses.push("(customer_name LIKE ? OR phone LIKE ? OR ref LIKE ?)");
    const like = `%${filters.search}%`;
    params.push(like, like, like);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db().prepare(`SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT 300`).all(...params)
    .map((row) => rowToOrder(row, orderItems(String(row.id))));
}

export function updateOrder(id: string, patch: Partial<Pick<Order, "status" | "paymentStatus">>) {
  const database = db();
  const existing = database.prepare("SELECT * FROM orders WHERE id = ?").get(id);
  if (!existing) return;
  // Restock when an order is cancelled (once).
  if (patch.status === "cancelled" && String(existing.status) !== "cancelled") {
    for (const item of orderItems(id)) {
      database.prepare("UPDATE products SET stock = stock + ? WHERE id = ?").run(item.quantity, item.productId);
    }
  }
  const fields: string[] = [];
  const params: SqlValue[] = [];
  if (patch.status !== undefined) { fields.push("status = ?"); params.push(patch.status); }
  if (patch.paymentStatus !== undefined) { fields.push("payment_status = ?"); params.push(patch.paymentStatus); }
  if (patch.status === "delivered" && String(existing.payment_method) === "cod") { fields.push("payment_status = 'paid'"); }
  if (!fields.length) return;
  params.push(id);
  database.prepare(`UPDATE orders SET ${fields.join(", ")} WHERE id = ?`).run(...params);
}

/* -------------------------------- adoptions ------------------------------ */

function rowToAdoption(row: Row): Adoption {
  return {
    id: String(row.id), name: String(row.name), species: String(row.species) as Adoption["species"],
    breed: String(row.breed), gender: String(row.gender) as Adoption["gender"],
    ageGroup: String(row.age_group) as Adoption["ageGroup"], ageText: String(row.age_text),
    vaccinated: Number(row.vaccinated) === 1, dewormed: Number(row.dewormed) === 1, litterTrained: Number(row.litter_trained) === 1,
    description: String(row.description), image: String(row.image), area: String(row.area),
    contactPhone: String(row.contact_phone), postedByUserId: row.posted_by ? String(row.posted_by) : null,
    status: String(row.status) as Adoption["status"], createdAt: String(row.created_at),
  };
}

export function createAdoption(input: Omit<Adoption, "id" | "createdAt">): Adoption {
  const id = randomUUID();
  const now = new Date().toISOString();
  db().prepare(`INSERT INTO adoptions (id, name, species, breed, gender, age_group, age_text, vaccinated, dewormed, litter_trained, description, image, area, contact_phone, posted_by, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, input.name, input.species, input.breed, input.gender, input.ageGroup, input.ageText, input.vaccinated ? 1 : 0, input.dewormed ? 1 : 0, input.litterTrained ? 1 : 0, input.description, input.image, input.area, input.contactPhone, input.postedByUserId, input.status, now);
  return { id, createdAt: now, ...input };
}

export function listAdoptions(statuses: Adoption["status"][] = ["available"]): Adoption[] {
  const placeholders = statuses.map(() => "?").join(", ");
  return db().prepare(`SELECT * FROM adoptions WHERE status IN (${placeholders}) ORDER BY created_at DESC`).all(...statuses).map(rowToAdoption);
}

export function getAdoption(id: string): Adoption | null {
  const row = db().prepare("SELECT * FROM adoptions WHERE id = ?").get(id);
  return row ? rowToAdoption(row) : null;
}

export function listAdoptionsByUser(userId: string): Adoption[] {
  return db().prepare("SELECT * FROM adoptions WHERE posted_by = ? ORDER BY created_at DESC").all(userId).map(rowToAdoption);
}

export function setAdoptionStatus(id: string, status: Adoption["status"]) {
  db().prepare("UPDATE adoptions SET status = ? WHERE id = ?").run(status, id);
}

export function deleteAdoption(id: string) {
  db().prepare("DELETE FROM adoptions WHERE id = ?").run(id);
}

/* -------------------------------- messages ------------------------------- */

export function createMessage(input: Omit<ContactMessage, "id" | "read" | "createdAt">): ContactMessage {
  const id = randomUUID();
  const now = new Date().toISOString();
  db().prepare("INSERT INTO messages (id, name, phone, email, subject, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?)")
    .run(id, input.name, input.phone, input.email, input.subject, input.message, now);
  return { id, read: false, createdAt: now, ...input };
}

export function listMessages(): ContactMessage[] {
  return db().prepare("SELECT * FROM messages ORDER BY created_at DESC LIMIT 200").all().map((row) => ({
    id: String(row.id), name: String(row.name), phone: String(row.phone), email: String(row.email),
    subject: String(row.subject), message: String(row.message), read: Number(row.is_read) === 1, createdAt: String(row.created_at),
  }));
}

export function setMessageRead(id: string, read: boolean) {
  db().prepare("UPDATE messages SET is_read = ? WHERE id = ?").run(read ? 1 : 0, id);
}

export function deleteMessage(id: string) {
  db().prepare("DELETE FROM messages WHERE id = ?").run(id);
}

/* ---------------------------------- stats --------------------------------- */

export function adminStats() {
  const database = db();
  const one = (sql: string, ...params: SqlValue[]) => Number(database.prepare(sql).get(...params)?.c ?? 0);
  const today = new Date().toISOString().slice(0, 10);
  const revenueRow = database.prepare("SELECT COALESCE(SUM(total), 0) AS c FROM orders WHERE status = 'delivered'").get();
  return {
    todaysAppointments: one("SELECT COUNT(*) AS c FROM appointments WHERE date = date('now','localtime') AND status != 'cancelled'"),
    pendingAppointments: one("SELECT COUNT(*) AS c FROM appointments WHERE status = 'pending'"),
    totalAppointments: one("SELECT COUNT(*) AS c FROM appointments"),
    pendingOrders: one("SELECT COUNT(*) AS c FROM orders WHERE status = 'pending'"),
    totalOrders: one("SELECT COUNT(*) AS c FROM orders"),
    deliveredRevenue: Number(revenueRow?.c ?? 0),
    customers: one("SELECT COUNT(*) AS c FROM users WHERE role = 'customer'"),
    petsRegistered: one("SELECT COUNT(*) AS c FROM pets"),
    lowStock: one("SELECT COUNT(*) AS c FROM products WHERE active = 1 AND stock <= 5"),
    pendingAdoptions: one("SELECT COUNT(*) AS c FROM adoptions WHERE status = 'pending'"),
    unreadMessages: one("SELECT COUNT(*) AS c FROM messages WHERE is_read = 0"),
    today,
  };
}

/* ---------------------------------- seed ---------------------------------- */

// Imported lazily inside seed to avoid a module cycle with auth.ts.
function seedHash(password: string): string {
  const { scryptSync } = createRequire(import.meta.url)("node:crypto") as typeof import("node:crypto");
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function seedIfEmpty(database: DatabaseSyncLike) {
  const existing = database.prepare("SELECT COUNT(*) AS c FROM users").get();
  if (Number(existing?.c ?? 0) > 0) return;

  const now = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const day = (offset: number) => { const d = new Date(now); d.setDate(d.getDate() + offset); return iso(d); };
  const stamp = (offsetDays: number, hour: number) => { const d = new Date(now); d.setDate(d.getDate() + offsetDays); d.setHours(hour, 15, 0, 0); return d.toISOString(); };

  const insertUser = database.prepare("INSERT INTO users (id, name, email, phone, password_hash, role, address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  const adminId = randomUUID();
  const vetId = randomUUID();
  const demoId = randomUUID();
  insertUser.run(adminId, "Hospital Admin", "admin@jawadvethospital.pk", "0300 7755230", seedHash("Admin@123"), "admin", "Al Kabir Town, Town Gate 3, Main Raiwind Road, Lahore", stamp(-120, 9));
  insertUser.run(vetId, "Dr. Jawad", "vet@jawadvethospital.pk", "0300 7755230", seedHash("Vet@1234"), "vet", "", stamp(-120, 9));
  insertUser.run(demoId, "Ayesha Khan (Demo)", "demo@customer.pk", "0321 5551234", seedHash("Demo@1234"), "customer", "House 14, Street 3, Bahria Town, Lahore", stamp(-45, 11));
  const cust2 = randomUUID();
  const cust3 = randomUUID();
  insertUser.run(cust2, "Bilal Ahmed", "bilal.ahmed@example.pk", "0333 4447788", seedHash("Customer@1"), "customer", "Block C, Al Kabir Town Phase 2, Lahore", stamp(-30, 12));
  insertUser.run(cust3, "Fatima Raza", "fatima.raza@example.pk", "0301 9876543", seedHash("Customer@1"), "customer", "Valencia Town, Lahore", stamp(-12, 10));

  for (const product of seedProducts) {
    database.prepare(`INSERT INTO products (id, slug, name, category_slug, unit, price, sale_price, stock, image_kind, image_url, description, highlights, featured, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`)
      .run(product.id, product.slug, product.name, product.categorySlug, product.unit, product.price, product.salePrice, product.stock, product.imageKind, product.imageUrl, product.description, JSON.stringify(product.highlights), product.featured ? 1 : 0);
  }

  const insertPet = database.prepare(`INSERT INTO pets (id, passport_id, user_id, name, species, breed, gender, dob, weight_kg, color, microchip, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const brunoId = randomUUID();
  const miloId = randomUUID();
  const sheruId = randomUUID();
  // Seed passport sequence high-water mark via kv after direct inserts.
  insertPet.run(brunoId, "JVH-P10001", demoId, "Bruno", "Dog", "Golden Retriever", "Male", day(-365 * 2 - 40), "28", "Golden", "", "Friendly, loves swimming. Mild chicken sensitivity.", stamp(-45, 11));
  insertPet.run(miloId, "JVH-P10002", demoId, "Milo", "Cat", "Persian", "Male", day(-365 - 90), "4.2", "White", "", "Indoor only. Nervous with strangers — gentle handling.", stamp(-45, 11));
  insertPet.run(sheruId, "JVH-P10003", cust2, "Sheru", "Dog", "German Shepherd", "Male", day(-365 * 3), "32", "Black & tan", "", "Guard training in progress.", stamp(-30, 12));
  database.prepare("INSERT INTO kv (key, value) VALUES ('passport_seq', '10003')").run();

  const insertVax = database.prepare("INSERT INTO vaccinations (id, pet_id, vaccine, date_given, next_due, vet_name, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertVax.run(randomUUID(), brunoId, "Rabies", day(-200), day(165), "Dr. Jawad", "Booster up to date.");
  insertVax.run(randomUUID(), brunoId, "DA2PP (Core)", day(-200), day(165), "Dr. Jawad", "");
  insertVax.run(randomUUID(), miloId, "FVRCP (Core)", day(-90), day(275), "Dr. Jawad", "");
  insertVax.run(randomUUID(), miloId, "Rabies", day(-90), day(275), "Dr. Jawad", "No reaction observed.");

  const insertAppt = database.prepare(`INSERT INTO appointments (id, ref, token, user_id, pet_id, owner_name, owner_phone, owner_email, pet_name, pet_type, pet_breed, pet_age, service_slug, service_title, visit_type, emergency, date, time_slot, area, address, symptoms, fee, status, doctor_name, vet_notes, follow_up_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const appt = (token: number, userId: string | null, petId: string | null, owner: string, phone: string, pet: string, type: string, breed: string, age: string, slug: string, title: string, visit: string, emergency: number, date: string, slot: string, area: string, fee: number, status: string, notes = "", follow = "") =>
    insertAppt.run(randomUUID(), `JVH-${date.replaceAll("-", "").slice(2)}-${1000 + token}`, token, userId, petId, owner, phone, "", pet, type, breed, age, slug, title, visit, emergency, date, slot, area, "", "", fee, status, status === "completed" || status === "confirmed" ? "Dr. Jawad" : "", notes, follow, stamp(-2, 10));

  appt(1, demoId, brunoId, "Ayesha Khan (Demo)", "0321 5551234", "Bruno", "Dog", "Golden Retriever", "2 years", "general-consultation", "General Checkup", "hospital", 0, day(-21), "11:00 AM", "Bahria Town", 1500, "completed", "Overall excellent health. Weight ideal at 28 kg. Continue current diet; dental check in 6 months.", day(160));
  appt(2, demoId, miloId, "Ayesha Khan (Demo)", "0321 5551234", "Milo", "Cat", "Persian", "1 year", "vaccination-preventive-care", "Vaccination", "hospital", 0, day(-90), "12:30 PM", "Bahria Town", 1500, "completed", "FVRCP + Rabies administered. Passport updated.", "");
  appt(3, cust2, sheruId, "Bilal Ahmed", "0333 4447788", "Sheru", "Dog", "German Shepherd", "3 years", "general-consultation", "General Checkup", "home", 0, day(-6), "5:00 PM", "Al Kabir Town", 2500, "completed", "Mild ear infection — drops prescribed for 7 days. Recheck if scratching persists.", day(2));
  appt(4, cust3, null, "Fatima Raza", "0301 9876543", "Snowbell", "Cat", "Persian", "8 months", "pet-grooming", "Grooming", "hospital", 0, day(-3), "3:30 PM", "Valencia Town", 1500, "completed", "Full groom: bath, lion-cut trim, nails. Client delighted.", "");
  appt(5, null, null, "Hassan Ali", "0345 1112233", "Rocky", "Dog", "Labrador", "4 years", "general-consultation", "General Checkup", "hospital", 1, day(-1), "8:00 PM", "Johar Town", 2500, "completed", "Presented with vomiting. IV fluids given, stabilised. Bland diet 3 days, follow-up scheduled.", day(2));
  appt(1, demoId, brunoId, "Ayesha Khan (Demo)", "0321 5551234", "Bruno", "Dog", "Golden Retriever", "2 years", "dental-care", "Dental Cleaning", "hospital", 0, day(0), "12:00 PM", "Bahria Town", 1500, "confirmed");
  appt(2, cust2, sheruId, "Bilal Ahmed", "0333 4447788", "Sheru", "Dog", "German Shepherd", "3 years", "general-consultation", "General Checkup", "hospital", 0, day(0), "4:30 PM", "Al Kabir Town", 1500, "confirmed");
  appt(3, null, null, "Zainab Tariq", "0322 7778899", "Coco", "Rabbit", "Holland Lop", "6 months", "general-consultation", "General Checkup", "hospital", 0, day(0), "6:00 PM", "Wapda Town", 1500, "pending");
  appt(1, cust3, null, "Fatima Raza", "0301 9876543", "Snowbell", "Cat", "Persian", "8 months", "vaccination-preventive-care", "Vaccination", "home", 0, day(1), "10:30 AM", "Valencia Town", 2500, "pending");
  appt(2, demoId, miloId, "Ayesha Khan (Demo)", "0321 5551234", "Milo", "Cat", "Persian", "1 year", "deworming", "Deworming", "hospital", 0, day(3), "1:00 PM", "Bahria Town", 1500, "pending");
  appt(6, null, null, "Omar Farooq", "0308 2223344", "Tiger", "Cat", "Domestic Shorthair", "2 years", "diagnostics-laboratory-tests", "Diagnostic & Lab Tests", "hospital", 0, day(-9), "2:00 PM", "Township", 1500, "cancelled");
  database.prepare("INSERT INTO kv (key, value) VALUES ('booking_seq', '1011')").run();

  const insertOrder = database.prepare(`INSERT INTO orders (id, ref, user_id, customer_name, phone, email, address, city, area, notes, payment_method, payment_status, subtotal, delivery_fee, total, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Lahore', ?, '', ?, ?, ?, ?, ?, ?, ?)`);
  const insertItem = database.prepare("INSERT INTO order_items (id, order_id, product_id, slug, name, unit, unit_price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  const orderWithItems = (seq: number, userId: string | null, name: string, phone: string, address: string, area: string, method: string, payStatus: string, status: string, items: { pid: string; qty: number }[], createdOffset: number) => {
    const id = randomUUID();
    let subtotal = 0;
    const detailed = items.map((item) => {
      const product = seedProducts.find((p) => p.id === item.pid)!;
      const price = sellingPrice(product);
      subtotal += price * item.qty;
      return { product, price, qty: item.qty };
    });
    const deliveryFee = subtotal >= 5000 ? 0 : 250;
    insertOrder.run(id, `JVH-ORD-${100000 + seq}`, userId, name, phone, "", address, area, method, payStatus, subtotal, deliveryFee, subtotal + deliveryFee, status, stamp(createdOffset, 13));
    for (const d of detailed) insertItem.run(randomUUID(), id, d.product.id, d.product.slug, d.product.name, d.product.unit, d.price, d.qty);
  };
  orderWithItems(1, demoId, "Ayesha Khan (Demo)", "0321 5551234", "House 14, Street 3, Bahria Town", "Bahria Town", "cod", "paid", "delivered", [{ pid: "p01", qty: 1 }, { pid: "p10", qty: 2 }], -14);
  orderWithItems(2, cust2, "Bilal Ahmed", "0333 4447788", "Block C, Al Kabir Town Phase 2", "Al Kabir Town", "easypaisa", "paid", "delivered", [{ pid: "p07", qty: 1 }, { pid: "p06", qty: 1 }], -7);
  orderWithItems(3, cust3, "Fatima Raza", "0301 9876543", "Street 9, Valencia Town", "Valencia Town", "cod", "unpaid", "out-for-delivery", [{ pid: "p02", qty: 2 }, { pid: "p05", qty: 1 }], -1);
  orderWithItems(4, null, "Hassan Ali", "0345 1112233", "Main Boulevard, Johar Town", "Johar Town", "jazzcash", "unpaid", "confirmed", [{ pid: "p11", qty: 1 }], 0);
  orderWithItems(5, demoId, "Ayesha Khan (Demo)", "0321 5551234", "House 14, Street 3, Bahria Town", "Bahria Town", "cod", "unpaid", "pending", [{ pid: "p08", qty: 1 }, { pid: "p14", qty: 1 }], 0);
  database.prepare("INSERT INTO kv (key, value) VALUES ('order_seq', '100005')").run();

  const insertAdoption = database.prepare(`INSERT INTO adoptions (id, name, species, breed, gender, age_group, age_text, vaccinated, dewormed, litter_trained, description, image, area, contact_phone, posted_by, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const adopt = (name: string, species: string, breed: string, gender: string, group: string, age: string, vax: number, deworm: number, litter: number, desc: string, img: string, area: string, status = "available") =>
    insertAdoption.run(randomUUID(), name, species, breed, gender, group, age, vax, deworm, litter, desc, img, area, "923007755230", adminId, status, stamp(-4, 10));
  adopt("Lilly", "Cat", "Persian", "Female", "Puppy/Kitten", "3 months", 1, 1, 1, "A cloud-soft snow-white Persian kitten who loves warm laps and feather toys. Fully litter trained and eating dry food independently.", "/images/pets/lilly.jpg", "Al Kabir Town");
  adopt("Coco", "Cat", "Persian Mix", "Female", "Puppy/Kitten", "4 months", 1, 1, 1, "Gentle grey princess with the sweetest purr. Coco is calm around children and other cats — a perfect first pet.", "/images/pets/Coco.jpg", "Bahria Town");
  adopt("Simba", "Cat", "Domestic Longhair", "Male", "Puppy/Kitten", "5 months", 0, 1, 1, "A brave little lion in a kitten suit. Simba is playful, curious and guaranteed to rule your heart (and sofa).", "/images/pets/simba.jpg", "Johar Town");
  adopt("Muffin", "Cat", "Persian", "Female", "Young", "9 months", 1, 1, 1, "Muffin is a soft, round cuddle expert who follows sunshine patches around the house. Spayed and ready for her forever sofa.", "/images/pets/muffin.jpg", "Valencia Town");
  adopt("Snowy", "Cat", "Persian", "Female", "Adult", "1.5 years", 1, 1, 1, "An elegant, quiet companion for a calm home. Snowy adores gentle grooming sessions and window watching.", "/images/pets/snowy.jpg", "Model Town");
  adopt("Bruno Jr.", "Dog", "Golden Retriever", "Male", "Puppy/Kitten", "3 months", 1, 1, 0, "A sunshine puppy with a wagging tail installed as standard. Bruno Jr. is learning basic commands and loves everyone he meets.", "/images/pets/bruno.jpg", "Lake City");
  adopt("Max", "Dog", "German Shepherd", "Male", "Young", "7 months", 1, 1, 0, "Loyal, bright and eager to please. Max needs an active family who will continue his training — he'll return the favour with lifetime devotion.", "/images/pets/max.jpg", "DHA Lahore");
  adopt("Oreo", "Rabbit", "Netherland Dwarf", "Male", "Young", "8 months", 0, 1, 1, "A tiny tuxedo gentleman. Oreo is litter trained, fond of coriander treats and surprisingly brave for his size.", "/images/pets/oreo.jpg", "Wapda Town");

  const insertMessage = database.prepare("INSERT INTO messages (id, name, phone, email, subject, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  insertMessage.run(randomUUID(), "Sana Malik", "0324 6667788", "sana@example.pk", "Book a Vet Visit", "Assalam-o-Alaikum, my cat has stopped eating since yesterday. Can I get an appointment tomorrow morning?", 0, stamp(0, 9));
  insertMessage.run(randomUUID(), "Ali Raza", "0302 3344556", "", "Service Inquiry", "Do you offer spaying for cats? Please share charges and recovery guidance.", 0, stamp(-1, 16));
  insertMessage.run(randomUUID(), "PetZone Distributors", "0423 5778899", "sales@petzone.example.pk", "Partnership", "We supply premium pet food brands across Punjab and would like to discuss wholesale rates for your Pet Mall.", 1, stamp(-5, 12));
}
