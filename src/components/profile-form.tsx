"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, KeyRound, Loader2, Save } from "lucide-react";
import type { User } from "@/lib/types";

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, address }),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) { setError(data.error ?? "Could not save your profile."); return; }
    setMessage("Profile saved.");
    router.refresh();
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordBusy(true);
    setPasswordError("");
    setPasswordMessage("");
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = (await res.json()) as { error?: string };
    setPasswordBusy(false);
    if (!res.ok) { setPasswordError(data.error ?? "Could not change your password."); return; }
    setCurrentPassword("");
    setNewPassword("");
    setPasswordMessage("Password changed successfully.");
  }

  return (
    <div>
      <div className="portal-card">
        <h2>Profile details</h2>
        <p className="card-sub">Used for bookings, delivery and WhatsApp confirmations. Your email ({user.email}) is your login and cannot be changed here.</p>
        {message && <div className="form-success-summary" role="status" style={{ marginBottom: 14 }}><Check size={16} /> {message}</div>}
        {error && <div className="form-error-summary" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
        <form className="form-grid" onSubmit={saveProfile} noValidate>
          <div className="field">
            <label htmlFor="pf-name">Full name <span>*</span></label>
            <input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="pf-phone">Mobile / WhatsApp <span>*</span></label>
            <input id="pf-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          </div>
          <div className="field field-full">
            <label htmlFor="pf-address">Home address</label>
            <textarea id="pf-address" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" placeholder="Used to prefill home-visit bookings and deliveries" />
          </div>
          <div className="field-full">
            <button type="submit" className="button button-primary" disabled={busy}>{busy ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Save profile</button>
          </div>
        </form>
      </div>

      <div className="portal-card">
        <h2>Change password</h2>
        <p className="card-sub">Choose a strong password of at least 8 characters that you don&apos;t use elsewhere.</p>
        {passwordMessage && <div className="form-success-summary" role="status" style={{ marginBottom: 14 }}><Check size={16} /> {passwordMessage}</div>}
        {passwordError && <div className="form-error-summary" role="alert" style={{ marginBottom: 14 }}>{passwordError}</div>}
        <form className="form-grid" onSubmit={changePassword} noValidate>
          <div className="field">
            <label htmlFor="pf-current">Current password <span>*</span></label>
            <input id="pf-current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <div className="field">
            <label htmlFor="pf-new">New password <span>*</span></label>
            <input id="pf-new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" placeholder="At least 8 characters" />
          </div>
          <div className="field-full">
            <button type="submit" className="button button-outline" disabled={passwordBusy}>{passwordBusy ? <Loader2 size={16} className="spin" /> : <KeyRound size={16} />} Change password</button>
          </div>
        </form>
      </div>
    </div>
  );
}
