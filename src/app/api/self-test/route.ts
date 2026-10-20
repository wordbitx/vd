import { quoteAppointment, quoteOrder } from "@/lib/pricing";
import { fees } from "@/lib/site";
import { hashPassword, verifyPassword, passwordIssues } from "@/server/passwords";
import { getSettings, rows } from "@/server/store";
import { barcodeSvg } from "@/lib/barcode";

export const dynamic = "force-dynamic";

/**
 * Read-only diagnostics: pricing arithmetic, password hashing and seeded data.
 * Safe to call in production — it touches nothing that a page does not already read.
 */
export async function GET() {
  const checks: { label: string; pass: boolean; detail?: string }[] = [];
  const expect = (label: string, pass: boolean, detail?: string) => checks.push({ label, pass, detail });

  const home = quoteAppointment({ servicePrice: 3000, mode: "home", urgency: "standard", slotId: "morning" });
  expect("home visit adds travel", home.total === 3000 + fees.visitHomeStandard, `${home.total}`);

  const night = quoteAppointment({ servicePrice: 3000, mode: "home", urgency: "standard", slotId: "night" });
  expect("night slot surcharge", night.total === 3000 + fees.visitHomeStandard + fees.nightSurcharge, `${night.total}`);

  const emergency = quoteAppointment({ servicePrice: 4500, mode: "home", urgency: "emergency" });
  expect("emergency dispatch fee", emergency.total === 4500 + fees.visitHomeEmergency, `${emergency.total}`);

  const clinic = quoteAppointment({ servicePrice: 2500, mode: "clinic", urgency: "standard" });
  expect("hospital consult fee, no travel", clinic.total === 2500 + fees.visitClinic, `${clinic.total}`);

  const credit = quoteAppointment({ servicePrice: 2000, mode: "clinic", urgency: "standard", credit: 500 });
  expect("portal credit deducts", credit.total === 2000 + fees.visitClinic - 500, `${credit.total}`);

  const bulk = quoteOrder([{ productId: "p", slug: "p", name: "Food", price: 3000, qty: 2, image: "" }]);
  expect("free delivery above threshold", bulk.delivery === 0, `${bulk.delivery}`);

  const small = quoteOrder([{ productId: "p", slug: "p", name: "Food", price: 1000, qty: 1, image: "" }]);
  expect("delivery charged below threshold", small.delivery === fees.deliveryLahore, `${small.delivery}`);

  const promo = quoteOrder([{ productId: "p", slug: "p", name: "Food", price: 3000, qty: 1, image: "" }], undefined, { percent: 10, minSubtotal: 2000 });
  expect("promo discount", promo.discount === 300, `${promo.discount}`);

  const hash = hashPassword("self-test-password-1");
  expect("scrypt hash verifies", verifyPassword("self-test-password-1", hash));
  expect("wrong password rejected", !verifyPassword("self-test-password-2", hash));
  expect("password policy", passwordIssues("short", "short").length > 0 && passwordIssues("longenough123", "longenough123").length === 0);

  const svg = barcodeSvg("JVH-2026-752699");
  expect("code128 barcode renders", svg.startsWith("<svg") && svg.includes("<path"), `${svg.length} bytes`);

  const [users, products, services, appointments, settings] = await Promise.all([
    rows("users"), rows("products"), rows("services"), rows("appointments"), getSettings(),
  ]);
  expect("seed: users", users.length >= 4, `${users.length}`);
  expect("seed: products", products.length >= 18, `${products.length}`);
  expect("seed: services", services.length >= 10, `${services.length}`);
  expect("seed: appointments", appointments.length >= 8, `${appointments.length}`);
  expect("seed: settings", Boolean(settings.clinicName && settings.bookingPrefix), settings.clinicName);
  expect("seed: demo owner credentials", users.some((u) => u.role === "owner" && verifyPassword("clinicadmin2026", u.passwordHash)));
  expect("reference format", /^[A-Z]+-\d{4}-\d+$/.test(appointments[0]?.ref ?? ""), appointments[0]?.ref);

  const failed = checks.filter((c) => !c.pass);
  return Response.json({ ok: failed.length === 0, checkedAt: new Date().toISOString(), passed: checks.length - failed.length, failed: failed.length, checks }, { status: failed.length ? 500 : 200 });
}
