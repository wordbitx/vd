import Link from "next/link";
import { ArrowRight, BadgeCheck, ShoppingBag, Truck, Wallet } from "lucide-react";
import { ShopCatalog } from "@/components/shop-catalog";
import { PageHero } from "@/components/page-parts";
import { listProducts } from "@/lib/hospital-db";
import { categories } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Pet Mall — Buy Pet Food & Supplies Online in Lahore",
  "Shop premium pet food, toys, grooming, beds, carriers and essentials at the Jawad Pet Mall. Lahore-wide delivery, cash on delivery, Easypaisa & JazzCash accepted.",
  "/shop",
  "/images/pet-shop.jpg",
);

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const products = listProducts(true);
  const initialCategory = categories.some((item) => item.slug === category) ? category : "";
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Jawad PET MALL"
        title="Everything your pet will love."
        description="Food, toys, care essentials and everyday favourites — genuine products, honest PKR prices and fast Lahore delivery."
        image="/images/pet-shop.jpg"
        imageAlt="Inside the Jawad Pet Mall boutique"
      >
        <Link href="/cart" className="button button-primary"><ShoppingBag size={17} /> View cart <ArrowRight size={16} /></Link>
      </PageHero>
      <section className="shop-catalog-section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12, marginBottom: 26 }}>
            <div className="included-grid" style={{ display: "contents" }}>
              <div><Truck size={20} /><p><strong>Lahore-wide delivery</strong> — Rs 250, free above Rs 5,000.</p></div>
              <div><Wallet size={20} /><p><strong>Pay your way</strong> — cash on delivery, Easypaisa, JazzCash, bank.</p></div>
              <div><BadgeCheck size={20} /><p><strong>Vet-approved range</strong> — selected by the Jawad hospital team.</p></div>
            </div>
          </div>
          <ShopCatalog products={products} initialCategory={initialCategory ?? ""} />
        </div>
      </section>
    </main>
  );
}
