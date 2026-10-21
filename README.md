# Jawad Veterinary Hospital — website, client portal & clinic console

A complete clinic platform for **Jawad Veterinary Hospital**, Al Kabir Town, Lahore: marketing site, 3-step booking with a printable barcode slip, a client portal with Digital Pet Passports, a pet mall with real orders, and a staff console that runs the day.

Built as a close visual and functional clone of the reference site — same typography, section order and interactions,
with the colour scheme refined into a slightly deeper, more premium version of the same cream/teal/copper family — plus a
much heavier back office (client portal, clinic console, printable slips). Read the reference-site audit in
[`docs/audit.md`](docs/audit.md), §9 for the palette.

---

## Quick start

```bash
npm install
cp .env.example .env.local        # optional but recommended
npm run dev                       # http://localhost:3000
```

The first request seeds a demo dataset into `.data/` (clients, pets, vaccine records, appointments, orders, products, adoption listings, articles, reviews).

```bash
npm run build && npm start        # production
npm run typecheck                 # tsc --noEmit
npm run lint                      # eslint
npm run check:images              # fails if any /images/* reference is missing
node scripts/smoke.mjs            # every route, as anonymous / client / owner
node scripts/flows.mjs            # login → booking → checkout → admin writes
```

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Client (2 pets, live records) | `pet.parent@example.com` | `petparent2026` |
| Front desk | `frontdesk@jawadveterinary.pk` | `desk2026` |
| Vet | `ayesha@jawadveterinary.pk` | `vet2026care` |
| Owner / admin | `owner@jawadveterinary.pk` | `clinicadmin2026` |

The same list is printed on the login screen so a demo can be handed over without a briefing.

---

## What is in the box

### Public site (`src/app/(site)`)
- **Home** — hero with a live-looking booking slip, priced quick-book bar, services, four-step explainer, portal preview, reviews, adoption strip, FAQ, emergency band.
- **Services** (`/services`, `/services/[slug]`) — 12 services with starting fees, durations, inclusions, preparation notes and FAQs.
- **Booking** (`/book-vet-appointment-lahore`) — 3-step wizard (pet & service → date/address → review), emergency toggle, add-ons, live server-priced quote, draft rescue via `localStorage`, then `/booking/[ref]` with a printable slip.
- **Pet Mall** (`/shop`, `/shop/[slug]`, `/cart`, `/checkout`, `/order/[ref]`) — 18 products, 8 categories, filters, promo code, delivery threshold, COD/transfer/Easypaisa, printable invoice.
- **Adoption desk** (`/adopt`, `/adopt/[id]`), **Journal & events** (`/pet-care-tips/[slug]`), **Gallery** with lightbox, **Team**, **About**, **Contact**, **Privacy**, **Terms**, **404**, **sitemap**, **robots**.
- Legacy URLs (`/book-appointment`, `/blog`, `/contact`) redirect to their new homes.

### Client portal (`/portal`)
Overview KPIs · Digital Pet Passports (add/edit/remove, weight, microchip, allergies) · vaccination card with batch numbers and due dates · consult notes · appointments with self-service **reschedule/cancel** and payment references · orders with progress tracker, reorder and change requests · messages with the clinic · profile, password and reminder preferences.

### Staff console (`/admin`)
Revenue chart + bookings trend (hand-rolled SVG, no chart dependency) · today's dispatch board grouped by window · appointment board with inline status, vet assignment and payment · order fulfilment · clients & pets with lifetime value and overdue vaccines · stock adjustments and product editor · service pricing (feeds the wizard instantly) · adoption listings · journal editor · review moderation · team roles · clinic settings (fees, hours, announcement, WhatsApp template) · audit log · demo reset.

### Print
`/slip/[ref]` and `/slip/[ref]?kind=order` render an **A5 print layout** with a perforation rule, status stamp and a real Code-128 barcode (`bwip-js`, server-side SVG). `/slip` lets a guest reopen a slip from a reference.

---

## Architecture

```
src/
  app/
    (site)/          marketing, shop, booking, slips   ← SiteHeader/Footer
    (auth)/          login, register                   ← split-screen layout
    portal/          client account                    ← AppShell
    admin/           staff console                     ← AppShell
    api/health       liveness + store inventory
    api/self-test    19 pricing/password/seed invariants
  components/        UI kit, booking wizard, cart, slips, charts, forms
  lib/               site content, pricing engine, formatting, barcode, types
  server/
    store.ts         JSON document store + seed
    auth.ts          scrypt passwords, HMAC signed cookies, role guards
    catalog.ts       store rows merged over marketing copy
    queries.ts       reporting + portal aggregates
    actions/         server actions: auth, booking, shop, account, admin
  db/                Drizzle schema mirroring the collections (production path)
```

**Money** is always recomputed on the server (`lib/pricing.ts`); the browser only previews it. **References** (`JVH-2026-752713`) are issued server-side from a counter and stored with the record that owns them.

### Going to Postgres

`src/db/schema.ts` mirrors every collection. Set `DATABASE_URL`, run `npm run db:push`, then swap the `rows/insert/update/remove` helpers in `src/server/store.ts` for Drizzle queries — the page and action layers do not change.

### Environment

| Variable | Purpose |
|---|---|
| `JVH_AUTH_SECRET` | Signs session cookies. **Set this in production** or sessions expire on restart. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL; also switches `robots.txt` from "block everything" to indexed. |
| `DATABASE_URL` | Optional. Enables `/api/health` `POST` checks and the Drizzle path. |
| `JVH_DATA_DIR` | Overrides the `.data/` location (useful in containers). |

---

## Notes for the client

- Photography in `public/images/` is AI-generated placeholder art that matches the palette. Replace with real hospital, team and patient photos before launch — file names are stable, so nothing else needs editing.
- Opening hours seeded here come from the public listing and are flagged in the console as **pending confirmation**.
- Fees (Rs 1,500 home visit / Rs 2,500 emergency / Rs 1,000 clinic) are seeded defaults, editable in **Admin → Clinic settings**.
