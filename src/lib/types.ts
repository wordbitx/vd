export type Role = "customer" | "vet" | "staff" | "owner";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  area?: string;
  address?: string;
  notes?: string;
  createdAt: string;
};

export type Pet = {
  id: string;
  userId: string;
  name: string;
  species: string;
  breed: string;
  sex: "Male" | "Female" | "Unknown";
  dob?: string;
  weightKg?: number;
  microchip?: string;
  colour?: string;
  photo?: string;
  allergies?: string;
  notes?: string;
  createdAt: string;
};

export type VaccineRecord = {
  id: string;
  petId: string;
  vaccine: string;
  givenOn: string;
  nextDue?: string;
  batch?: string;
  vet: string;
  note?: string;
};

export type MedicalRecord = {
  id: string;
  petId: string;
  type: "Consultation" | "Prescription" | "Lab report" | "Surgery" | "Dental" | "Vaccination" | "Grooming";
  title: string;
  date: string;
  vet: string;
  summary: string;
};

export type AppointmentStatus =
  | "pending" | "confirmed" | "dispatched" | "in_progress" | "completed" | "cancelled" | "no_show";

export type FeeLine = { label: string; amount: number; kind?: "charge" | "discount" | "credit" };

export type Appointment = {
  id: string;
  ref: string;
  userId?: string | null;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  petId?: string | null;
  petName: string;
  species: string;
  breed?: string;
  petAge?: string;
  serviceSlug: string;
  serviceTitle: string;
  mode: "home" | "clinic";
  urgency: "standard" | "emergency";
  date: string;
  slotId: string;
  slotLabel: string;
  slotWindow: string;
  address: string;
  area: string;
  symptoms?: string;
  addOns: string[];
  lines: FeeLine[];
  subtotal: number;
  total: number;
  status: AppointmentStatus;
  vetId?: string;
  vetName?: string;
  payment: { method: "cod" | "transfer" | "easypaisa" | "card"; status: "unpaid" | "paid" | "refunded"; reference?: string };
  timeline: { at: string; label: string; by: string }[];
  consent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OrderStatus = "pending" | "packed" | "dispatched" | "delivered" | "cancelled";

export type OrderItem = { productId: string; slug: string; name: string; price: number; qty: number; image: string; size?: string };

export type Order = {
  id: string;
  ref: string;
  userId?: string | null;
  name: string;
  phone: string;
  email?: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  status: OrderStatus;
  payment: { method: "cod" | "transfer" | "easypaisa"; status: "unpaid" | "paid" | "refunded"; reference?: string };
  address: string;
  area: string;
  notes?: string;
  timeline: { at: string; label: string; by: string }[];
  createdAt: string;
  updatedAt: string;
};

export type ProductRow = {
  id: string; slug: string; name: string; brand: string; categorySlug: string;
  price: number; compareAt?: number; image: string; description: string; highlights: string[];
  stock: number; rating: number; reviews: number; badge?: string; sizes?: string[]; tags?: string[];
  featured?: boolean; active: boolean;
};

export type ServiceRow = {
  slug: string; title: string; shortTitle: string; summary: string; icon: string; image: string;
  price: number; duration: string; active: boolean; homeAvailable: boolean;
};

export type AdoptionRow = {
  id: string; name: string; species: string; breed: string; age: string; sex: string;
  status: "available" | "reserved" | "adopted"; image: string; story: string;
  vaccinated: boolean; dewormed: boolean; traits: string[]; postedAt: string;
};

export type PostRow = {
  id: string; slug: string; title: string; category: string; excerpt: string; image: string;
  readTime: string; date: string; status: "published" | "draft";
  body: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
};

export type Message = {
  id: string; userId: string; userName: string; subject: string; body: string;
  at: string; from: "customer" | "clinic"; reply?: string; repliedAt?: string;
};

export type Review = { id: string; author: string; area: string; rating: number; text: string; service: string; at: string; status: "pending" | "published" };

export type AuditEntry = { id: string; at: string; actor: string; action: string; target: string; detail: string };

export type Settings = {
  clinicName: string;
  monogram: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  tagline: string;
  bookingPrefix: string;
  visitHomeStandard: number;
  visitHomeEmergency: number;
  visitClinic: number;
  nightSurcharge: number;
  deliveryLahore: number;
  freeDeliveryOver: number;
  taxPercent: number;
  slotWindows: { id: string; label: string; window: string }[];
  paymentInstructions: string;
  whatsappTemplate: string;
  announcement: string;
  announcementHref: string;
  emergencyLine: string;
  hoursNote: string;
};

export type SessionUser = Pick<User, "id" | "name" | "email" | "role" | "phone">;
