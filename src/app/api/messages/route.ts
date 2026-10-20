import { clean, isResponse, jsonError, jsonOk, readJson, requireApiRole } from "@/lib/api";
import { createMessage, listMessages } from "@/lib/hospital-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await readJson<{ name?: string; phone?: string; email?: string; subject?: string; message?: string }>(request);
  const name = clean(body?.name, 120);
  const message = clean(body?.message, 2000);
  if (name.length < 2) return jsonError("Please enter your name.");
  if (message.length < 5) return jsonError("Please write a message.");
  const created = createMessage({
    name,
    phone: clean(body?.phone, 40),
    email: clean(body?.email, 160),
    subject: clean(body?.subject, 120) || "General enquiry",
    message,
  });
  return jsonOk({ message: created }, 201);
}

export async function GET() {
  const user = await requireApiRole(["admin", "vet"]);
  if (isResponse(user)) return user;
  return jsonOk({ messages: listMessages() });
}
