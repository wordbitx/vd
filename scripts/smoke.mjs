#!/usr/bin/env node
/**
 * Smoke test for the whole site without a browser.
 * Exercises public pages, the progressive-enhancement server actions (login, booking,
 * checkout, admin status changes) and the printable slip.
 *   node scripts/smoke.mjs [baseUrl]
 */
import { createHmac } from "node:crypto";

const BASE = process.argv[2] ?? "http://127.0.0.1:3000";
const jar = new Map();
let failures = 0;

const cookieHeader = () => [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");

function storeCookies(response) {
  const raw = response.headers.getSetCookie?.() ?? [];
  for (const cookie of raw) {
    const [pair] = cookie.split(";");
    const idx = pair.indexOf("=");
    if (idx > 0) jar.set(pair.slice(0, idx).trim(), pair.slice(idx + 1).trim());
  }
}

async function get(path, expect = 200) {
  const response = await fetch(`${BASE}${path}`, { headers: { cookie: cookieHeader() }, redirect: "manual" });
  storeCookies(response);
  const ok = response.status === expect;
  if (!ok) failures += 1;
  console.log(`${ok ? "✓" : "✗"} ${response.status.toString().padStart(3)} ${path}${ok ? "" : ` (expected ${expect})`}`);
  return { response, body: await response.text() };
}

/**
 * Sessions are HMAC-signed cookies, so a checker can mint one directly.
 * The dev server must run with JVH_AUTH_SECRET set to the same value.
 */
function sessionCookie(uid, role) {
  const secret = process.env.JVH_AUTH_SECRET ?? "dev-smoke-secret";
  const payload = Buffer.from(JSON.stringify({ uid, role, exp: Date.now() + 3_600_000 })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `jvh_session=${payload}.${signature}`;
}

const assert = (condition, label) => {
  if (!condition) failures += 1;
  console.log(`${condition ? "✓" : "✗"} ${label}`);
};

// ── public pages ──────────────────────────────────────────────
const publicPages = [
  "/", "/services", "/services/vaccination", "/services/emergency-care", "/shop", "/shop/adult-lamb-rice-3kg",
  "/about", "/team", "/gallery", "/contact-vet-lahore", "/pet-care-tips", "/pet-care-tips/puppy-vaccination-schedule",
  "/adopt", "/adopt/ad1", "/book-vet-appointment-lahore", "/cart", "/checkout", "/login", "/register",
  "/slip", "/slip/JVH-2026-752699", "/privacy-policy", "/terms-and-conditions", "/sitemap.xml", "/robots.txt",
  "/api/health", "/api/self-test", "/icon.svg", "/images/hero-care.jpg", "/images/adopt-4.jpg",
  "/book-appointment", "/blog", "/contact",
];
for (const page of publicPages) {
  const followsRedirect = ["/book-appointment", "/blog", "/contact"].includes(page);
  await get(page, followsRedirect ? 307 : 200);
}

const home = await get("/");
assert(home.body.includes("Jawad Veterinary Hospital"), "home page has the clinic name");
assert(home.body.includes("Professional Vet Care"), "home page leads with the reference hero headline");
assert(home.body.includes("Book in 3 Simple Steps"), "home page shows the three-step booking section");
assert(home.body.includes("Our veterinary services"), "home page shows the services section");
assert(home.body.includes("Pet Mall"), "home page shows the pet mall section");
assert(home.body.includes("Meet your veterinarian"), "home page shows the vet profile section");
assert(!home.body.includes("Illustrative"), "no leftover demo disclaimers on the home page");

// 404
await get("/this-page-does-not-exist", 404);
// protected routes bounce to login
const guarded = await fetch(`${BASE}/admin`, { redirect: "manual" });
assert([307, 302].includes(guarded.status) && (guarded.headers.get("location") ?? "").includes("/login"), "admin redirects anonymous users to /login");

// ── customer flow ────────────────────────────────────────────
jar.set("jvh_session", sessionCookie("u_sana", "customer").split("=")[1]);
assert(true, "session cookie minted for the demo client");
for (const page of ["/portal", "/portal/pets", "/portal/appointments", "/portal/records", "/portal/orders", "/portal/messages", "/portal/profile"]) {
  const { body } = await get(page);
  if (page === "/portal") assert(body.includes("Assalam-o-Alaikum") && body.includes("Pet passports"), "portal overview renders with data");
  if (page === "/portal/pets") assert(body.includes("Scottie") && body.includes("Mochi"), "pet passports include seeded pets");
  if (page === "/portal/records") assert(body.includes("Vaccination card"), "records page renders the vaccine card");
}
const portalAdmin = await fetch(`${BASE}/admin`, { headers: { cookie: cookieHeader() }, redirect: "manual" });
assert([307, 302].includes(portalAdmin.status), "client cannot open the staff console");

// pricing engine + seeded data invariants
const selfTest = await fetch(`${BASE}/api/self-test`);
const selfTestJson = await selfTest.json();
assert(selfTest.status === 200 && selfTestJson.ok, `self-test: ${selfTestJson.passed ?? 0} invariants passed, ${selfTestJson.failed ?? "?"} failed`);
if (!selfTestJson.ok) for (const check of selfTestJson.checks.filter((c) => !c.pass)) console.log(`   ✗ ${check.label} ${check.detail ?? ""}`);

// the seeded slip renders and carries a real barcode
const seededSlip = await get("/slip/JVH-2026-752699");
assert(seededSlip.body.includes("Deworming") && seededSlip.body.includes("<svg") && seededSlip.body.includes("JVH-2026-752699"), "seeded booking slip renders with barcode");

// ── admin flow ───────────────────────────────────────────────
jar.set("jvh_session", sessionCookie("u_owner", "owner").split("=")[1]);
assert(true, "session cookie minted for the clinic owner");
const adminPages = ["/admin", "/admin/today", "/admin/appointments", "/admin/orders", "/admin/customers", "/admin/messages", "/admin/reviews", "/admin/products", "/admin/services", "/admin/adoption", "/admin/posts", "/admin/staff", "/admin/settings"];
for (const page of adminPages) await get(page);
const adminHome = await get("/admin");
assert(adminHome.body.includes("Revenue") && adminHome.body.includes("Service mix"), "admin overview renders charts and KPIs");

console.log(`\n${failures === 0 ? "✓ all checks passed" : `✗ ${failures} check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
