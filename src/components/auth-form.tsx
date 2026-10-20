"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Info, Loader2, LockKeyhole, LogIn, Mail, Phone, UserPlus, UserRound } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";
import { business } from "@/lib/site";
import type { User } from "@/lib/types";

type Mode = "login" | "signup";

export function AuthForm({ initialMode = "login", redirectTo = "" }: { initialMode?: Mode; redirectTo?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const destinationFor = (user: User) => redirectTo && redirectTo.startsWith("/") ? redirectTo : (user.role === "admin" || user.role === "vet" ? "/admin" : "/dashboard");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const payload = mode === "login" ? { email, password } : { name, email, phone, password };
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await res.json()) as { user?: User; error?: string };
      if (!res.ok || !data.user) throw new Error(data.error ?? "Could not sign you in. Please try again.");
      router.refresh();
      router.push(destinationFor(data.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-logo"><SiteLogo /></div>
      <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="auth-sub">
        {mode === "login"
          ? "Manage your pets, Digital Pet Passports, appointments and Pet Mall orders — all in one place."
          : "Join Jawad Veterinary Hospital to book faster, keep a Digital Pet Passport for every pet and track orders."}
      </p>

      <div className="auth-tabs" role="tablist" aria-label="Login or sign up">
        <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); setInfo(""); }}>Log In</button>
        <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setError(""); setInfo(""); }}>Sign Up</button>
      </div>

      {error && <div className="form-error-summary" role="alert" style={{ marginBottom: 15 }}>{error}</div>}
      {info && <div className="form-info-summary" role="status" style={{ marginBottom: 15 }}><Info size={16} /> <span>{info}</span></div>}

      <form className="auth-form" onSubmit={submit} noValidate>
        {mode === "signup" && (
          <>
            <div className="field">
              <label htmlFor="auth-name"><UserRound size={13} style={{ verticalAlign: -2 }} /> Full name <span>*</span></label>
              <input id="auth-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your full name" required />
            </div>
            <div className="field">
              <label htmlFor="auth-phone"><Phone size={13} style={{ verticalAlign: -2 }} /> Mobile / WhatsApp number <span>*</span></label>
              <input id="auth-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="0300 1234567" required />
            </div>
          </>
        )}
        <div className="field">
          <label htmlFor="auth-email"><Mail size={13} style={{ verticalAlign: -2 }} /> Email address <span>*</span></label>
          <input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" required />
        </div>
        <div className="field">
          <label htmlFor="auth-password"><LockKeyhole size={13} style={{ verticalAlign: -2 }} /> Password <span>*</span></label>
          <div className="input-wrap">
            <input id="auth-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder={mode === "signup" ? "At least 8 characters" : "Your password"} required />
            <button type="button" className="password-eye" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {mode === "login" && (
            <p className="forgot-note" style={{ marginTop: 8 }}>
              <button type="button" onClick={() => setInfo(`Password reset is handled personally by our team for your security — WhatsApp us at ${business.phone} from your registered number and we will reset it within minutes during opening hours.`)}>
                Forgot password?
              </button>
            </p>
          )}
        </div>
        <button type="submit" className="button button-gold button-large" disabled={busy}>
          {busy ? <Loader2 size={17} className="spin" /> : mode === "login" ? <LogIn size={17} /> : <UserPlus size={17} />}
          {busy ? "Please wait…" : mode === "login" ? "Sign In" : "Create free account"}
        </button>
      </form>

      <div className="auth-divider">OR</div>
      <button type="button" className="google-btn" onClick={() => setInfo("Google sign-in will be activated with the hospital's Google account at launch. For now, please continue with email — it takes less than a minute.")}>
        <span className="g-mark" aria-hidden="true"><span style={{ color: "#4285f4" }}>G</span></span> Continue with Google
      </button>

      <p className="auth-switch">
        {mode === "login" ? <>Don&apos;t have an account? <button type="button" onClick={() => setMode("signup")}>Sign up free</button></> : <>Already registered? <button type="button" onClick={() => setMode("login")}>Log in</button></>}
      </p>

      <div className="demo-logins">
        <h3>Demo accounts · for review</h3>
        <p>Customer portal — <code>demo@customer.pk</code> / <code>Demo@1234</code></p>
        <p>Admin panel — <code>admin@jawadvethospital.pk</code> / <code>Admin@123</code></p>
        <p>Vet staff — <code>vet@jawadvethospital.pk</code> / <code>Vet@1234</code></p>
      </div>

      <p className="auth-legal">
        By continuing, you agree to our <Link href="/terms-and-conditions">Terms of Service</Link> and <Link href="/privacy-policy">Privacy Policy</Link>.
        <br />Need help? WhatsApp <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer">{business.phone}</a>
      </p>
    </div>
  );
}
