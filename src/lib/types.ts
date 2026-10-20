// Shared domain types for Jawad Veterinary Hospital.
// Safe to import from both server and client components (no runtime imports).

export type Role = "customer" | "vet" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  address: string;
  createdAt: string;
};

export type PetSpecies = "Dog" | "Cat" | "Bird" | "Rabbit" | "Other";

export type Pet = {
  id: string;
  passportId: string;
  userId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  gender: "Male" | "Female" | "";
  dob: string; // "" or free-text age when unknown
  weightKg: string;
  color: string;
  microchip: string;
  notes: string;
  createdAt: string;
};

export type Vaccination = {
  id: string;
  petId: string;
  vaccine: string;
  dateGiven: string;
  nextDue: string;
  vetName: string;
  notes: string;
};

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "checked-in"
  | "completed"
  | "cancelled"
  | "no-show";

export type VisitType = "hospital" | "home";

export type Appointment = {
  id: string;
  ref: string;
  token: number;
  userId: string | null;
  petId: string | null;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  petName: string;
  petType: string;
  petBreed: string;
  petAge: string;
  serviceSlug: string;
  serviceTitle: string;
  visitType: VisitType;
  emergency: boolean;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  area: string;
  address: string;
  symptoms: string;
  fee: number; // PKR visiting/consultation charges quoted at booking
  status: AppointmentStatus;
  doctorName: string;
  vetNotes: string;
  followUpDate: string;
  createdAt: string;
};

export type ProductImageKind =
  | "food-bag"
  | "food-pouch"
  | "kitten-food"
  | "litter"
  | "toy"
  | "harness"
  | "grooming"
  | "bowls"
  | "treats"
  | "bed"
  | "carrier"
  | "wet-food"
  | "supplement"
  | "record-kit"
  | "wand";

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  unit: string;
  price: number; // PKR list price
  salePrice: number | null; // PKR selling price when on sale
  stock: number;
  imageKind: ProductImageKind;
  imageUrl: string; // optional real photo (admin) — overrides packshot
  description: string;
  highlights: string[];
  featured: boolean;
  active: boolean;
};

export function sellingPrice(product: Pick<StoreProduct, "price" | "salePrice">): number {
  return product.salePrice && product.salePrice > 0 && product.salePrice < product.price
    ? product.salePrice
    : product.price;
}

export function discountPercent(product: Pick<StoreProduct, "price" | "salePrice">): number {
  const sell = sellingPrice(product);
  if (product.price <= 0 || sell >= product.price) return 0;
  return Math.round(((product.price - sell) / product.price) * 100);
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "easypaisa" | "jazzcash" | "bank";

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  unit: string;
  unitPrice: number;
  quantity: number;
};

export type Order = {
  id: string;
  ref: string;
  userId: string | null;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  notes: string;
  paymentMethod: PaymentMethod;
  paymentStatus: "unpaid" | "paid";
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export type AdoptionStatus = "pending" | "available" | "adopted" | "rejected";

export type Adoption = {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  gender: "Male" | "Female";
  ageGroup: "Puppy/Kitten" | "Young" | "Adult" | "Senior";
  ageText: string;
  vaccinated: boolean;
  dewormed: boolean;
  litterTrained: boolean;
  description: string;
  image: string;
  area: string;
  contactPhone: string;
  postedByUserId: string | null;
  status: AdoptionStatus;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type HospitalSettings = {
  hospitalVisitFee: number;
  homeVisitFee: number;
  emergencyHospitalFee: number;
  emergencyHomeFee: number;
  deliveryFee: number;
  freeDeliveryAbove: number;
  announcement: string;
};
