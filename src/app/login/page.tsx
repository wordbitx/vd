import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Log In / Sign Up",
  "Log in to your Jawad Veterinary Hospital account to manage pets, Digital Pet Passports, appointments and Pet Mall orders.",
  "/login",
);

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ mode?: string; redirectTo?: string }> }) {
  const { mode, redirectTo } = await searchParams;
  const user = await getCurrentUser();
  if (user) {
    redirect(redirectTo && redirectTo.startsWith("/") ? redirectTo : user.role === "admin" || user.role === "vet" ? "/admin" : "/dashboard");
  }
  return (
    <main id="main-content">
      <section className="auth-section">
        <div className="container">
          <AuthForm initialMode={mode === "signup" ? "signup" : "login"} redirectTo={redirectTo ?? ""} />
        </div>
      </section>
    </main>
  );
}
