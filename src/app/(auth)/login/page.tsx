import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth-forms";
import { business } from "@/lib/site";
import { noIndex } from "@/lib/metadata";

export const metadata: Metadata = { title: "Sign in", description: "Client portal for bookings, records and orders at Jawad Veterinary Hospital, Lahore.", ...noIndex };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-card"><p className="muted small">Loading…</p></div>}>
      <LoginForm clinicName={business.name} />
    </Suspense>
  );
}
