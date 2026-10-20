import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth-forms";
import { noIndex } from "@/lib/metadata";

export const metadata: Metadata = { title: "Create an account", description: "Book veterinary visits, keep pet records and track pet mall orders in one portal.", ...noIndex };

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="auth-card"><p className="muted small">Loading…</p></div>}>
      <RegisterForm />
    </Suspense>
  );
}
