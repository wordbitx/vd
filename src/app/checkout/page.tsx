import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CheckoutView } from "@/components/checkout-view";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Order Enquiry", "Review a pet shop order enquiry and choose whether to send it via WhatsApp to Jawad Veterinary Hospital. No payment or order confirmation takes place online.", "/checkout");

export default function CheckoutPage() {
  return <main id="main-content"><div className="container breadcrumbs"><Link href="/">Home</Link><ChevronRight size={13} /><Link href="/shop">Pet Shop</Link><ChevronRight size={13} /><Link href="/cart">Cart</Link><ChevronRight size={13} /><span>Order Enquiry</span></div><section className="simple-page-section"><div className="container"><span className="eyebrow"><span className="eyebrow-line" /> NO PAYMENT REQUIRED</span><h1>Order enquiry.</h1><p className="page-intro">Prepare a message with your selected items. Nothing is sent until you choose to open WhatsApp and send it yourself.</p><CheckoutView /></div></section></main>;
}
