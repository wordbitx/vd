// Request-body parsers shared by route handlers (server-only usage).
import { randomUUID } from "node:crypto";
import { clean } from "./api";
import { categories } from "./site";
import type { Pet, PetSpecies, ProductImageKind, StoreProduct } from "./types";

const SPECIES: PetSpecies[] = ["Dog", "Cat", "Bird", "Rabbit", "Other"];

export function parsePetBody(body: Record<string, unknown> | null): Omit<Pet, "id" | "passportId" | "userId" | "createdAt"> | null {
  if (!body) return null;
  const name = clean(body.name, 80);
  const species = SPECIES.includes(body.species as PetSpecies) ? (body.species as PetSpecies) : null;
  if (!name || !species) return null;
  const gender = body.gender === "Male" || body.gender === "Female" ? body.gender : "";
  return {
    name, species, gender,
    breed: clean(body.breed, 80),
    dob: clean(body.dob, 40),
    weightKg: clean(body.weightKg, 20),
    color: clean(body.color, 60),
    microchip: clean(body.microchip, 60),
    notes: clean(body.notes, 1000),
  };
}

const KINDS: ProductImageKind[] = ["food-bag", "food-pouch", "kitten-food", "litter", "toy", "harness", "grooming", "bowls", "treats", "bed", "carrier", "wet-food", "supplement", "record-kit", "wand"];

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 70) || "product";
}

export function parseProductBody(body: Record<string, unknown> | null, existingId?: string): StoreProduct | string {
  if (!body) return "Invalid product data.";
  const name = clean(body.name, 160);
  const categorySlug = clean(body.categorySlug, 80);
  const price = Math.round(Number(body.price));
  const saleRaw = body.salePrice === null || body.salePrice === "" || body.salePrice === undefined ? null : Math.round(Number(body.salePrice));
  const stock = Math.max(0, Math.round(Number(body.stock) || 0));
  if (name.length < 3) return "Please enter a product name.";
  if (!categories.some((c) => c.slug === categorySlug)) return "Please choose a valid category.";
  if (!Number.isFinite(price) || price <= 0) return "Please enter a valid price.";
  if (saleRaw !== null && (!Number.isFinite(saleRaw) || saleRaw < 0)) return "Sale price is invalid.";
  const highlights = Array.isArray(body.highlights)
    ? body.highlights.map((h) => clean(h, 160)).filter(Boolean).slice(0, 6)
    : clean(body.highlights, 800).split("\n").map((h) => h.trim()).filter(Boolean).slice(0, 6);
  return {
    id: existingId ?? randomUUID(),
    slug: clean(body.slug, 90) || slugify(name),
    name,
    categorySlug,
    unit: clean(body.unit, 60),
    price,
    salePrice: saleRaw && saleRaw > 0 ? saleRaw : null,
    stock,
    imageKind: KINDS.includes(body.imageKind as ProductImageKind) ? (body.imageKind as ProductImageKind) : "food-bag",
    imageUrl: clean(body.imageUrl, 500),
    description: clean(body.description, 1500),
    highlights,
    featured: body.featured === true,
    active: body.active !== false,
  };
}
