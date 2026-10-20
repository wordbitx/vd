import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { ShopCatalog } from "@/components/shop-catalog";
import { DemoNotice, PageHero } from "@/components/page-parts";
import { categories } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Pet Shop in Lahore", "Explore demo pet food, toys, grooming, beds, carriers and everyday essentials at Jawad Veterinary Hospital. Enquire to confirm real prices and availability.", "/shop", "/images/pet-shop.jpg");

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const initialCategory = categories.some((item) => item.slug === category) ? category : "";
  return <main id="main-content">
    <PageHero eyebrow="JAWAD PET SHOP" title="Everything your pet needs, all in one place." description="Discover everyday essentials for your pet’s nutrition, comfort, playtime and care. This shoppable preview shows representative items; enquire with the hospital for the actual range." image="/images/pet-shop.jpg" imageAlt="Illustrative shelves of pet food and accessories in a boutique pet store"><Link href="/cart" className="button button-primary"><ShoppingBag size={17} /> View demo cart <ArrowRight size={16} /></Link></PageHero>
    <section className="shop-catalog-section"><div className="container"><DemoNotice>All product names and photographs are sample content. Brands, prices, sizes and stock status are pending client confirmation; no live inventory or online payment is connected.</DemoNotice><ShopCatalog initialCategory={initialCategory ?? ""} /></div></section>
  </main>;
}
