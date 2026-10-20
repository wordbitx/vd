import Link from "next/link";
import { ArrowLeft, ArrowRight, PawPrint } from "lucide-react";

export default function NotFound() {
  return <main id="main-content" className="not-found-page"><div className="container not-found-inner"><span className="not-found-icon"><PawPrint size={34} /></span><span className="eyebrow">A LITTLE DETOUR</span><h1>Looks like this page<br />wandered off.</h1><p>We couldn’t find the page you’re looking for. Let’s get you back to the good stuff.</p><div><Link href="/" className="button button-primary"><ArrowLeft size={17} /> Back to home</Link><Link href="/services" className="button button-outline">Explore services <ArrowRight size={17} /></Link></div></div></main>;
}
