// Small helpers for route handlers.
import { getCurrentUser } from "./auth";
import type { Role, User } from "./types";

export function jsonError(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

export function jsonOk(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

export async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export async function requireApiUser(): Promise<User | Response> {
  const user = await getCurrentUser();
  if (!user) return jsonError("Please log in to continue.", 401);
  return user;
}

export async function requireApiRole(roles: Role[]): Promise<User | Response> {
  const user = await getCurrentUser();
  if (!user) return jsonError("Please log in to continue.", 401);
  if (!roles.includes(user.role)) return jsonError("You do not have permission to do this.", 403);
  return user;
}

export function isResponse(value: User | Response): value is Response {
  return value instanceof Response;
}

export function clean(value: unknown, max = 300): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function validPhone(value: string): boolean {
  return value.replace(/\D/g, "").length >= 10;
}

export function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
