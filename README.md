# Jawad Veterinary Hospital — Website + Portals

A premium, fully working hospital platform for **Jawad Veterinary Hospital** (Al Kabir Town, Town Gate 3, Main Raiwind Road, Lahore), functionally modelled on a deep audit of vetsondoor.com (see `AUDIT.md`) but with an original **Midnight Navy + Champagne Gold + Ivory** luxury identity.

## What's inside

**Public website** — homepage, services (8 + detail pages), transparent `/fees`, `/faqs`, adoption board (`/adopt`), Pet Mall (`/shop`), blog, gallery, team, about, contact with map, legal pages, SEO (sitemap/robots/JSON-LD).

**Online booking (like vetsondoor's 3-step flow)** — `/book`: Step 1 pet + service + emergency toggle + symptoms → Step 2 hospital/home visit + date/time slot (+ Lahore area for home visits) → Step 3 owner details + review + live fee quote → **printable booking slip** with token number, ref (`JVH-YYMMDD-####`) and barcode. Works for guests and signed-in customers.

**Pet Mall** — real catalogue with categories, search, sort, sale pricing, stock, cart, checkout (COD / Easypaisa / JazzCash / bank), **printable order invoice** (`JVH-ORD-######`), stock auto-decrement/restock.

**Customer portal** (`/dashboard`) — Digital Pet Passports (`JVH-P#####`) with vaccination record & next-due reminders, appointment history with slips + cancel, order tracking timeline, adoption posting (reviewed before publishing), profile & password.

**Admin panel** (`/admin`) — live stats, today's token queue, appointment management (confirm/check-in/complete, assign vet, diagnosis & prescription notes, reschedule, WhatsApp customer, print slip), order management (status pipeline + payment), full product/stock manager, patients & passports (add vaccinations), adoption approvals, customers & staff (roles + password reset), inbox (contact messages with 1-tap WhatsApp/email reply), hospital settings (fees, delivery, announcement bar).

## Demo logins (seeded)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@jawadvethospital.pk` | `Admin@123` |
| Vet | `vet@jawadvethospital.pk` | `Vet@1234` |
| Customer (demo) | `demo@customer.pk` | `Demo@1234` |
| Customer | `bilal.ahmed@example.pk` | `Customer@1` |
| Customer | `fatima.raza@example.pk` | `Customer@1` |

> ⚠️ **Before real launch:** change/delete these accounts (Admin → Customers & Staff → reset password), and remove the demo-accounts hint box in `src/components/auth-form.tsx`.

## Run it

```bash
npm install
npm run build     # webpack build (required for node:sqlite — see below)
npm start         # http://localhost:3000
# or for development:
npm run dev
```

Requires **Node 22+** (uses the built-in `node:sqlite`). The database is created and seeded automatically at `data/jvh.db` on first run — delete that file to reset to factory demo data. Back it up to keep real data.

Optional env: `NEXT_PUBLIC_SITE_URL=https://your-domain.pk` (enables indexing + correct canonical/sitemap URLs).

## Tech notes

- Next.js 16 + React 19, App Router, server components; API routes under `src/app/api/*` (all `runtime = "nodejs"`).
- Data layer: `src/lib/hospital-db.ts` (SQLite, WAL, transactional orders). Auth: scrypt passwords + HMAC session cookie (`src/lib/auth.ts`). Roles: `customer` / `vet` / `admin`.
- Fees, delivery and the announcement bar are editable in **Admin → Hospital Settings** and apply instantly everywhere (booking wizard, slips, checkout, `/fees`).
- Products are managed in **Admin → Products** (the 16 seeded products use original "Jawad Select" vector packshots; paste a real photo URL in the product form to override).
- Build uses `--webpack` because Turbopack (as of Next 16.2) cannot resolve the `node:sqlite` builtin. `node:sqlite` is also listed in `serverExternalPackages`.
- Fonts are self-hosted via Fontsource (Manrope + Fraunces variable) — no Google Fonts dependency.

## Before launch checklist

1. Confirm real opening hours (currently "8:00 AM – 11:30 PM — pending confirmation" in `src/lib/site.ts`).
2. Replace illustrative photos with real hospital/team photography (esp. the Dr. Jawad portrait slot on the homepage), and real product photos via Admin.
3. Change seeded passwords; remove demo accounts & the login hint box.
4. Have a vet review blog/fee content; connect a real domain + set `NEXT_PUBLIC_SITE_URL`.
5. Optional upgrades: SMS/WhatsApp booking confirmations, online card payments, Google sign-in, Postgres (Drizzle schema stub kept in `src/db/`).
