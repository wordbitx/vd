"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticate, clearSessionCookie, isStaffRole, setSessionCookie } from "@/server/auth";
import { audit, getSettings, insert, rows, uid, update } from "@/server/store";
import { passwordIssues, hashPassword, verifyPassword } from "@/server/passwords";
import { emailValid, field, normalisePhone, phoneValid, required } from "@/server/validate";
import type { FieldErrors } from "@/server/validate";
import type { User } from "@/lib/types";

export type AuthResult = { ok: boolean; message?: string; errors?: FieldErrors };

export async function signIn(_prev: AuthResult | null, form: FormData): Promise<AuthResult> {
  const email = field(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  const next = field(form, "next") || "/portal";
  if (!email || !password) {
    return { ok: false, message: "Enter your email and password.", errors: { email: email ? "" : "Email is required.", password: password ? "" : "Password is required." } };
  }
  const result = await authenticate(email, password);
  if (!result.ok) return { ok: false, message: result.message, errors: { password: result.message } };
  await setSessionCookie(result.user);
  revalidatePath("/", "layout");
  redirect(isStaffRole(result.user.role) ? (next === "/login" ? "/admin" : next) : next || "/portal");
}

export async function signUp(_prev: AuthResult | null, form: FormData): Promise<AuthResult> {
  const errors: FieldErrors = {};
  const name = required(form, errors, "name", "Full name", 80);
  const email = field(form, "email").toLowerCase();
  const phone = field(form, "phone");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (!emailValid(email)) errors.email = "Enter a valid email address.";
  if (!phoneValid(phone)) errors.phone = "Enter a reachable mobile number.";
  const pwIssues = passwordIssues(password, confirm);
  if (pwIssues.length) errors.password = pwIssues.join(" ");
  const users = await rows("users");
  if (users.some((u) => u.email.toLowerCase() === email)) errors.email = "An account already uses this email. Try signing in.";
  if (Object.keys(errors).length || !name) return { ok: false, errors, message: "Please correct the highlighted fields." };

  const id = uid("u");
  await insert("users", {
    id, name, email, phone: normalisePhone(phone), passwordHash: hashPassword(password), role: "customer",
    area: field(form, "area").slice(0, 60) || undefined, address: field(form, "address").slice(0, 200) || undefined,
    createdAt: new Date().toISOString(),
  } satisfies User);
  const settings = await getSettings();
  if (field(form, "petName")) {
    await insert("pets", {
      id: uid("pet"), userId: id, name: field(form, "petName").slice(0, 40), species: field(form, "species") || "Dog",
      breed: field(form, "breed").slice(0, 60) || "Not recorded", sex: "Unknown",
      dob: field(form, "dob") || undefined, notes: field(form, "petNotes").slice(0, 300) || undefined,
      photo: "/images/pet-dog.jpg", createdAt: new Date().toISOString(),
    });
  }
  await audit("Self-service", "Account created", name, `${email} · ${settings.clinicName}`);
  const created = (await rows("users")).find((u) => u.id === id)!;
  await setSessionCookie(created);
  revalidatePath("/", "layout");
  redirect("/portal?notice=welcome");
}

export async function signOut() {
  await clearSessionCookie();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateProfile(_prev: AuthResult | null, form: FormData): Promise<AuthResult> {
  const errors: FieldErrors = {};
  const id = field(form, "id");
  const name = required(form, errors, "name", "Full name", 80);
  const phone = field(form, "phone");
  if (!phoneValid(phone)) errors.phone = "Enter a reachable mobile number.";
  if (Object.keys(errors).length) return { ok: false, errors, message: "Please correct the highlighted fields." };
  await update("users", id, {
    name, phone: normalisePhone(phone), area: field(form, "area").slice(0, 60) || undefined,
    address: field(form, "address").slice(0, 200) || undefined,
  });
  revalidatePath("/portal", "layout");
  return { ok: true, message: "Profile updated." };
}

export async function changePassword(_prev: AuthResult | null, form: FormData): Promise<AuthResult> {
  const errors: FieldErrors = {};
  const id = field(form, "id");
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  const user = (await rows("users")).find((u) => u.id === id);
  if (!user) return { ok: false, message: "Session expired — sign in again.", errors: {} };
  if (!verifyPassword(current, user.passwordHash)) errors.current = "Current password is incorrect.";
  const issues = passwordIssues(next, confirm);
  if (issues.length) errors.next = issues.join(" ");
  if (Object.keys(errors).length) return { ok: false, errors, message: "Please correct the highlighted fields." };
  await update("users", id, { passwordHash: hashPassword(next) });
  await audit(user.name, "Password changed", user.email, "");
  revalidatePath("/portal", "layout");
  return { ok: true, message: "Password changed." };
}
