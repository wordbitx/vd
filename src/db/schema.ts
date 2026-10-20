import { boolean, date, integer, jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Production schema. The demo runs on a JSON document store with exactly these shapes
 * (see src/lib/types.ts), so moving to Postgres is a data migration, not a rewrite.
 *   npx drizzle-kit push
 */

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("customer"),
  area: text("area"),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pets = pgTable("pets", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  species: text("species").notNull(),
  breed: text("breed"),
  sex: text("sex").default("Unknown"),
  dob: date("dob"),
  weightKg: numeric("weight_kg", { precision: 5, scale: 2 }),
  microchip: text("microchip"),
  colour: text("colour"),
  photo: text("photo"),
  allergies: text("allergies"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const vaccineRecords = pgTable("vaccine_records", {
  id: text("id").primaryKey(),
  petId: text("pet_id").notNull().references(() => pets.id, { onDelete: "cascade" }),
  vaccine: text("vaccine").notNull(),
  givenOn: date("given_on").notNull(),
  nextDue: date("next_due"),
  batch: text("batch"),
  vet: text("vet"),
  note: text("note"),
});

export const medicalRecords = pgTable("medical_records", {
  id: text("id").primaryKey(),
  petId: text("pet_id").notNull().references(() => pets.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  date: date("date").notNull(),
  vet: text("vet"),
  summary: text("summary"),
});

export const appointments = pgTable("appointments", {
  id: text("id").primaryKey(),
  ref: text("ref").notNull().unique(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  guestName: text("guest_name").notNull(),
  guestPhone: text("guest_phone").notNull(),
  guestEmail: text("guest_email"),
  petId: text("pet_id").references(() => pets.id, { onDelete: "set null" }),
  petName: text("pet_name").notNull(),
  species: text("species").notNull(),
  breed: text("breed"),
  serviceSlug: text("service_slug").notNull(),
  serviceTitle: text("service_title").notNull(),
  mode: text("mode").notNull().default("home"),
  urgency: text("urgency").notNull().default("standard"),
  date: date("date").notNull(),
  slotId: text("slot_id").notNull(),
  slotWindow: text("slot_window"),
  address: text("address"),
  area: text("area"),
  symptoms: text("symptoms"),
  addOns: jsonb("add_ons").$type<string[]>().default([]),
  lines: jsonb("lines").$type<{ label: string; amount: number }[]>().default([]),
  subtotal: integer("subtotal").notNull().default(0),
  total: integer("total").notNull().default(0),
  status: text("status").notNull().default("pending"),
  vetId: text("vet_id").references(() => users.id),
  paymentMethod: text("payment_method").default("cod"),
  paymentStatus: text("payment_status").default("unpaid"),
  timeline: jsonb("timeline").$type<{ at: string; label: string; by: string }[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  ref: text("ref").notNull().unique(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  items: jsonb("items").$type<{ productId: string; name: string; price: number; qty: number }[]>().notNull(),
  subtotal: integer("subtotal").notNull(),
  delivery: integer("delivery").notNull().default(0),
  discount: integer("discount").notNull().default(0),
  total: integer("total").notNull(),
  status: text("status").notNull().default("pending"),
  address: text("address").notNull(),
  area: text("area"),
  notes: text("notes"),
  timeline: jsonb("timeline").$type<{ at: string; label: string; by: string }[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand"),
  categorySlug: text("category_slug").notNull(),
  price: integer("price").notNull(),
  compareAt: integer("compare_at"),
  image: text("image"),
  description: text("description"),
  highlights: jsonb("highlights").$type<string[]>().default([]),
  stock: integer("stock").notNull().default(0),
  rating: numeric("rating", { precision: 2, scale: 1 }).default("5.0"),
  reviews: integer("reviews").default(0),
  badge: text("badge"),
  active: boolean("active").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
});

export const services = pgTable("services", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  shortTitle: text("short_title").notNull(),
  summary: text("summary"),
  icon: text("icon"),
  image: text("image"),
  price: integer("price").notNull(),
  duration: text("duration"),
  active: boolean("active").notNull().default(true),
  homeAvailable: boolean("home_available").notNull().default(true),
});

export const adoptionPets = pgTable("adoption_pets", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  species: text("species").notNull(),
  breed: text("breed"),
  age: text("age"),
  sex: text("sex"),
  status: text("status").notNull().default("available"),
  image: text("image"),
  story: text("story"),
  vaccinated: boolean("vaccinated").default(false),
  dewormed: boolean("dewormed").default(false),
  postedAt: date("posted_at"),
});

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category"),
  excerpt: text("excerpt"),
  image: text("image"),
  readTime: text("read_time"),
  date: date("date"),
  status: text("status").notNull().default("draft"),
  body: jsonb("body").$type<{ heading: string; paragraphs: string[]; bullets?: string[] }[]>().default([]),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  reply: text("reply"),
  repliedAt: timestamp("replied_at", { withTimezone: true }),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  author: text("author").notNull(),
  area: text("area"),
  rating: integer("rating").notNull().default(5),
  text: text("text").notNull(),
  service: text("service"),
  at: date("at"),
  status: text("status").notNull().default("pending"),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  target: text("target"),
  detail: text("detail"),
});
