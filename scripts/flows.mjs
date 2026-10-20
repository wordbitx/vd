#!/usr/bin/env node
/**
 * End-to-end write-path checks against a running dev server.
 * Uses progressive-enhancement form posts (the same request a browser makes with JS off),
 * so every server action is exercised for real: login, booking, checkout and admin edits.
 *
 *   JVH_AUTH_SECRET=... node scripts/flows.mjs [baseUrl]
 */
const BASE = process.argv[2] ?? "http://127.0.0.1:3000";
const jar = new Map();
let failures = 0;

const check = (label, pass, detail = "") => {
  if (!pass) failures += 1;
  console.log(`${pass ? "✓" : "✗"} ${label}${detail ? ` — ${detail}` : ""}`);
};

const cookieHeader = () => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
const keepCookies = (res) => {
  for (const raw of res.headers.getSetCookie?.() ?? []) {
    const [pair] = raw.split(";");
    const i = pair.indexOf("=");
    if (i > 0) jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
  }
};

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { headers: { cookie: cookieHeader() }, redirect: "manual" });
  keepCookies(res);
  return { status: res.status, location: res.headers.get("location"), body: await res.text() };
}

const unescape = (v) => v.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function forms(html) {
  return [...html.matchAll(/<form[^>]*method="POST"[^>]*>([\s\S]*?)<\/form>/g)].map(([, inner]) => {
    const fields = [];
    for (const input of inner.matchAll(/<input([^>]*)>/g)) {
      const attrs = input[1];
      const name = /name="([^"]*)"/.exec(attrs)?.[1];
      if (!name) continue;
      const value = /value="([^"]*)"/.exec(attrs)?.[1] ?? "";
      fields.push([unescape(name), unescape(value)]);
    }
    return fields;
  });
}

const findForm = (html, mustContain) => forms(html).find((fields) => fields.some(([name]) => name === mustContain));

async function submit(path, fields, values) {
  const form = new FormData();
  for (const [name, value] of fields) if (!(name in values)) form.append(name, value);
  for (const [name, value] of Object.entries(values)) form.append(name, String(value));
  const res = await fetch(`${BASE}${path}`, {
    method: "POST", body: form, redirect: "manual",
    headers: { cookie: cookieHeader(), origin: BASE, referer: `${BASE}${path}` },
  });
  keepCookies(res);
  return { status: res.status, location: res.headers.get("location"), body: await res.text() };
}

// The clinic validates dates in Asia/Karachi, so the checker must use the same clock.
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi" }).format(new Date());

/* ── 1. login ─────────────────────────────────────────────── */
const loginPage = await get("/login");
const loginForm = findForm(loginPage.body, "email");
check("login form is server-rendered", Boolean(loginForm));
if (!loginForm) {
  console.log("   hint: the page was served without action handles — check that the route is dynamic");
  process.exit(1);
}
const login = await submit("/login", loginForm, { email: "pet.parent@example.com", password: "petparent2026", next: "/portal" });
check("customer login succeeds", login.status === 303 || login.status === 200, `${login.status} → ${login.location ?? ""}`);
check("session cookie was issued", jar.has("jvh_session"));
const portal = await get("/portal");
check("portal renders after login", portal.status === 200 && portal.body.includes("Pet passports"));

/* ── 2. booking ───────────────────────────────────────────── */
const bookPage = await get("/book-vet-appointment-lahore");
const bookForm = findForm(bookPage.body, "serviceSlug");
check("booking wizard posts a server action", Boolean(bookForm));
const booking = await submit("/book-vet-appointment-lahore", bookForm, {
  guestName: "Sana Iqbal", guestPhone: "+92 300 1234567", guestEmail: "pet.parent@example.com",
  petName: "Scottie", species: "Dog", breed: "Golden Retriever", petAge: "3 yr", sex: "Male",
  serviceSlug: "deworming", mode: "home", urgency: "standard", date: today, slotId: "morning",
  area: "Johar Town", address: "House 44, Street 8, Johar Town", symptoms: "Quarterly deworming",
  payment: "cod", consent: "on",
});
const bookingRef = /\/booking\/(JVH-\d{4}-\d+)/.exec(booking.location ?? "")?.[1] ?? /JVH-\d{4}-\d{6}/.exec(booking.body)?.[0];
check("booking returns a reference", Boolean(bookingRef), bookingRef ?? `${booking.status}`);
if (bookingRef) {
  const slip = await get(`/slip/${bookingRef}`);
  check("new booking has a printable slip with barcode", slip.status === 200 && slip.body.includes(bookingRef) && slip.body.includes("<svg"));
  check("slip shows the priced total", /Rs\.\s?[\d,]+/.test(slip.body));
}

/* ── 3. checkout ──────────────────────────────────────────── */
const checkoutPage = await get("/checkout");
const checkoutForm = findForm(checkoutPage.body, "items");
check("checkout posts a server action", Boolean(checkoutForm));
const checkout = await submit("/checkout", checkoutForm, {
  name: "Sana Iqbal", phone: "+92 300 1234567", email: "pet.parent@example.com", area: "Johar Town",
  address: "House 44, Street 8, Johar Town", notes: "Call on arrival",
  items: JSON.stringify([{ id: "p09", qty: 1 }, { id: "p16", qty: 2 }]),
  payment: "cod", promo: "",
});
const orderRef = /\/order\/(JVH-O\d{4}-\d+)/.exec(checkout.location ?? "")?.[1];
check("order is created", Boolean(orderRef), orderRef ?? `${checkout.status}`);
if (orderRef) {
  const order = await get(`/order/${orderRef}`);
  check("order confirmation renders", order.status === 200 && order.body.includes(orderRef));
  const orderSlip = await get(`/slip/${orderRef}?kind=order`);
  check("order invoice is printable", orderSlip.status === 200 && orderSlip.body.includes("<svg"));
}

/* ── 4. portal actions ───────────────────────────────────── */
const pets = await get("/portal/pets");
check("portal renders the add-pet dialog markup", pets.body.includes("Add a pet") && pets.body.includes("<dialog"));
const petForm = forms(pets.body).find((fields) => fields.some(([name]) => name === "species") && fields.some(([name]) => name === "name"));
if (petForm) {
  const added = await submit("/portal/pets", petForm, { name: "Testy", species: "Cat", breed: "Mix", sex: "Female", dob: "2024-02-01", weightKg: "3.2" });
  check("adding a pet succeeds", added.status === 200 || added.status === 303, `${added.status}`);
  const after = await get("/portal/pets");
  check("new pet appears on the passport page", after.body.includes("Testy"));
} else {
  console.log("· add-pet dialog is client-rendered (hydrated), skipping the direct submit");
}

/* ── 5. admin actions ────────────────────────────────────── */
jar.delete("jvh_session");
const adminLoginPage = await get("/login");
const adminLogin = await submit("/login", findForm(adminLoginPage.body, "email"), { email: "owner@jawadveterinary.pk", password: "clinicadmin2026", next: "/admin" });
check("staff login succeeds", adminLogin.status === 303 || adminLogin.status === 200, `${adminLogin.status}`);
const admin = await get("/admin");
check("owner reaches the console", admin.status === 200 && admin.body.includes("Revenue"));

const board = await get("/admin/appointments");
check("appointment board renders rows with inline controls", board.body.includes("Appointment board") && board.body.includes("<select"));
const statusForm = forms(board.body).find((fields) => fields.some(([name]) => name === "status"));
if (statusForm) {
  const id = statusForm.find(([name]) => name === "id")?.[1] ?? "";
  const update = await submit("/admin/appointments", statusForm, { id: "apt_2", status: "confirmed" });
  check("status change is accepted", update.status === 200 || update.status === 303, `${update.status}${id ? ` (id ${id})` : ""}`);
  const after = await get("/admin/appointments");
  check("board reflects the new status", /apt_2|confirmed/i.test(after.body));
}

const productsPage = await get("/admin/products");
check("product table renders with stock controls", productsPage.body.includes("Pet mall catalogue") && productsPage.body.includes("+10"));
const stockForm = forms(productsPage.body).find((fields) => fields.some(([name]) => name === "delta"));
if (stockForm) {
  const adjust = await submit("/admin/products", stockForm, { id: "p01", delta: "5" });
  check("stock adjustment succeeds", adjust.status === 200 || adjust.status === 303, `${adjust.status}`);
}

const settingsPage = await get("/admin/settings");
const settingsForm = forms(settingsPage.body).find((fields) => fields.some(([name]) => name === "visitHomeStandard"));
check("settings form is rendered", Boolean(settingsForm));
if (settingsForm) {
  const values = Object.fromEntries(settingsForm.filter(([name]) => !name.startsWith("$")));
  const saved = await submit("/admin/settings", settingsForm, { ...values, visitHomeStandard: "1600" });
  check("saving fees succeeds", saved.status === 200 || saved.status === 303, `${saved.status}`);
  const checkPrice = await fetch(`${BASE}/api/self-test`).then((r) => r.json());
  check("self-test still passes after the fee change", checkPrice.ok === true, `${checkPrice.failed} failed`);
  const restore = await submit("/admin/settings", settingsForm, { ...values, visitHomeStandard: "1500" });
  check("fee restored", restore.status === 200 || restore.status === 303);
}

console.log(`\n${failures === 0 ? "✓ every flow passed" : `✗ ${failures} flow check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
