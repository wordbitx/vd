import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Info, PackageCheck } from "lucide-react";
import { ProductCard } from "@/components/cards";
import { ProductImage } from "@/components/product-image";
import { ProductDetailActions } from "@/components/product-detail-actions";
import { categories, products } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return product ? pageMetadata(`${product.name} | Demo Pet Shop`, `Explore ${product.name} in the Jawad Veterinary Hospital shop preview. Contact the team to confirm actual brand, price and availability.`, `/shop/${slug}`, product.sheet) : {};
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const category = categories.find((item) => item.slug === product.categorySlug);
  const related = products.filter((item) => item.id !== product.id && item.categorySlug === product.categorySlug).concat(products.filter((item) => item.id !== product.id && item.categorySlug !== product.categorySlug)).slice(0, 4);
  return <main id="main-content">
    <div className="container breadcrumbs"><Link href="/">Home</Link><ChevronRight size={13} /><Link href="/shop">Pet Shop</Link><ChevronRight size={13} /><span>{product.name}</span></div>
    <section className="product-detail-section"><div className="container product-detail-grid"><div className="product-detail-visual"><ProductImage product={product} /><span className="product-demo-tag">ILLUSTRATIVE PRODUCT PHOTO</span></div><div className="product-detail-copy"><span className="eyebrow"><span className="eyebrow-line" /> {category?.name ?? "PET ESSENTIALS"}</span><h1>{product.name}</h1><p className="product-detail-description">{product.description}</p><div className="product-detail-facts"><div><span>PRICE</span><strong>On enquiry</strong></div><div><span>AVAILABILITY</span><strong>To be confirmed</strong></div><div><span>BRAND / SIZE</span><strong>Pending approval</strong></div></div><ProductDetailActions product={product} /><div className="product-highlights"><h2>Good to know</h2><ul>{product.highlights.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></div><div className="product-detail-disclaimer"><Info size={18} /><span>Representative demo listing only. The product shown may not be stocked by Jawad Veterinary Hospital. Medicines and supplements, if offered, require appropriate legal supply and professional advice.</span></div><Link href="/shop" className="back-link"><ArrowLeft size={16} /> Back to all products</Link></div></div></section>
    <section className="related-section"><div className="container"><div className="section-header compact"><div><span className="eyebrow"><span className="eyebrow-line" /> KEEP BROWSING</span><h2>More for their everyday.</h2></div><Link href="/shop" className="text-link">All products <ArrowRight size={16} /></Link></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></div></section>
  </main>;
}
