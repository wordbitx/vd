import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CartView } from "@/components/cart-view";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Demo Shopping Cart", "Review items in your Jawad Veterinary Hospital demo pet shop cart. Products are representative and prices and stock require confirmation.", "/cart");

export default function CartPage() {
  return <main id="main-content"><div className="container breadcrumbs"><Link href="/">Home</Link><ChevronRight size={13} /><Link href="/shop">Pet Shop</Link><ChevronRight size={13} /><span>Cart</span></div><section className="simple-page-section"><div className="container"><span className="eyebrow"><span className="eyebrow-line" /> THE PET SHOP</span><h1>Your demo cart.</h1><p className="page-intro">All items here are samples for the website preview. You can prepare an order enquiry, but no purchase is made online.</p><CartView /></div></section></main>;
}
