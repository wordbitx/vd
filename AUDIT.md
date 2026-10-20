# Deep Audit — vetsondoor.com → Jawad Veterinary Hospital Rebuild

Audit date: 20 Oct 2026 · Auditor: Arena agent · Source: live site crawl (homepage, services, booking, shop, product detail, adopt, team, about, contact, login, events, fees, sitemap.xml)

---

## 1. What vetsondoor.com is

"Vets On Door" — Pakistan's mobile vet service (Lahore). Next.js site backed by Supabase (product/adoption images served from Supabase storage). Lead vet: Dr. Muhammad Ahmad, DVM (RVMP). Phone/WhatsApp: 0307-8517122. Android app on Play Store. Their model = **home visits**, ours = **hospital + home-visit option** (Jawad Veterinary Hospital, Al Kabir Town, Main Raiwind Road, Lahore — 0300 7755230).

## 2. Information architecture (from sitemap + nav)

Header: Logo · Get App · **Log In** · **Emergency** (tel:) · **Book Now**. Mobile drawer: Navigate (Pet Mall, Services, Team, About, Contact, Adopt a Pet, Events) + Quick Actions (Download App, Log In/Sign Up). Sticky mobile bottom bar: **Emergency | Book Visit**.

Pages:
| Area | Routes |
|---|---|
| Core | `/` `/about` `/contact-vet-lahore` `/veterinarian-lahore` (Team) `/privacy` `/terms` `/refunds` |
| Services | `/services` + 9 SEO detail pages (home-vet-checkup, pet-vaccination, pet-deworming, emergency-vet, dental-cleaning, surgical-consultation, pet-nutrition, diagnostic-lab-tests, tick-flea…) each with: duration, areas, *What's Included*, *Benefits*, *FAQs*, locations grid, other services, Book CTA |
| Booking | `/book-vet-appointment-lahore` (=`/book?service=…`) **3-step wizard** |
| Shop "Pet Mall" | `/shop` `/shop/category/:slug` `/shop/product/:id` (UUIDs = DB-driven), sale badges (-33%), PKR prices, stock, qty, Add to Cart / Buy Now, "Nationwide Delivery / Premium Quality" trust cards, related products |
| Adopt | `/adopt` (filters: All/Dog/Cat/Rabbit), `/adopt/:id`, `/adopt/cats-lahore`, `/adopt/dogs-lahore`, *Post Pet* (login-gated → `/dashboard/adopt/post`) |
| Content | `/events` + `/events/:slug` (pet-health articles), `/vet-faqs-lahore`, `/vet-fees-lahore` (full fee schedule), `/emergency-vet-lahore`, `/locations` + 20 area pages, `/app` |
| Accounts | `/login` (email+password, Sign Up toggle, Google OAuth, forgot password, `?mode=signup`, `?redirectTo=`) |
| Portal (login-gated) | `/dashboard/…` incl. `/dashboard/adopt/pet/:id`, **Digital Pet Passport** access from homepage hero |

## 3. Homepage anatomy (top → bottom)

1. Hero: "Pakistan's First Mobile Vet" eyebrow, H1 "Professional Vet Care, At Your Doorstep", Book Home Visit / Sign Up Free / Log In, trust chips (24/7, RVMP Certified, Fully Equipped, All Pets), doctor photo card (name, DVM RVMP, badges, WhatsApp button), **"Already a patient? Access your Digital Pet Passport"** box, stats (24/7 Emergency, 100% Lahore, RVMP, Fully Equipped), App promo card (5★, GET).
2. Services (7 cards) — featured "General Checkup & Wellness" + Vaccination, Emergency, Deworming, Surgical Consult, Dental, Lab Tests → each "Book Service" deep-links booking with service pre-selected.
3. **Pet Mall** — 4 DB products w/ prices + sale %.
4. "Why Pet Parents Trust Us" — 3 numbered advantages.
5. **Adopt a Pet** — pet cards (Vaccinated/gender badges, breed, age group, WhatsApp).
6. "Book in 3 Simple Steps" — form → WhatsApp confirm → doctor arrives.
7. Meet Your Veterinarian — photo, 5+ yrs badge, quote, credentials chips, WhatsApp.
8. Events & Tips — 4 article cards.
9. Gallery "Our Work in Action" (4 photos).
10. Google-style reviews (ui-avatars, star reviews, "Write a review" → Google Maps).
11. Emergency CTA band (call + email).

## 4. Booking flow (their core)

**Step 1 of 3 — Details:** Pet Name (optional), Pet Age (optional), Pet Type* (Dog/Cat/Bird/Rabbit/Other chips), Pet Breed (optional), Service select chips (General Checkup, Vaccination, Grooming, Deworming, Surgical Consultation, Diagnostic & Lab Tests), **"This is a Medical Emergency"** toggle, fee note: *Standard visiting charges Rs 1,500 / Emergency Rs 2,500*, Symptoms/notes. → (Steps 2–3 are client-side: schedule + owner/contact + review; confirmation is sent and team confirms on WhatsApp.)

**Our version adds what the client asked for:** instant **booking slip** with token number, booking reference and print/download — plus the booking appears in the customer portal and admin panel.

## 5. Fees model (from /vet-fees-lahore)

Transparent PKR ranges per category (Consultation 1,500–2,500 · Vaccines 1,500–10,000 · Deworming 600–3,500 · Labs 1,500–8,000 · Dental 1,000–7,000 · Emergency 3,500–15,000 · Other 1,000–4,000), "every visit includes" list, payment methods (Cash, Bank, Easypaisa, JazzCash), fee FAQs. We mirror this page with Jawad's own indicative schedule (editable in admin settings).

## 6. Portals / panels (inferred from routes & patterns)

- **Customer dashboard:** pets + Digital Pet Passport, appointments, shop orders, adoption listings (post/manage), profile.
- **Admin (Supabase-backed):** products, orders, bookings, adoption moderation, events/articles, users. (Their admin is not publicly visible; we build ours to cover every entity the public site exposes.)

## 7. Jawad rebuild — feature mapping

| vetsondoor | Jawad Veterinary Hospital (this build) |
|---|---|
| Home-visit only | **Hospital visit + Home visit** choice in booking |
| 3-step booking | 3-step wizard → **instant booking slip + token no.** (print / WhatsApp share) |
| Pet Mall (DB, PKR, sales) | Jawad **Pet Mall** — DB products, PKR prices, sale %, stock, cart, **online order + printable invoice**, COD/Easypaisa/JazzCash/Bank |
| Login/Signup/Google | Email+password auth (scrypt, httpOnly session cookie), roles: customer / vet / admin (Google button can be wired with client keys later) |
| Digital Pet Passport | Pet profiles with Passport ID, vaccination records + next-due, visit history |
| Dashboard | /dashboard: overview, pets & passports, appointments (+slips, cancel), orders (+invoices), my adoption posts, profile & password |
| Admin (hidden) | **/admin panel:** stats, appointments queue & statuses, orders, products CRUD, adoption approvals, customers & roles, patients & vaccine records, inbox messages, settings (fees) |
| Adopt board | /adopt + detail + post-a-pet (admin-approved) |
| Events & Tips | Existing Pet Care Journal (/blog) surfaced as Events & Tips |
| Fees page, FAQs, locations | /fees schedule, /faqs, Lahore areas served strip |
| Reviews | Testimonial cards (sample — replace with real Google reviews before launch) |
| Green/orange theme | **New luxury scheme: Midnight Navy + Champagne Gold + Ivory**, Fraunces serif display |

## 8. Stack decisions for this repo

Next.js 16 + React 19 (already scaffolded). Data layer: **Node's built-in SQLite** (`node:sqlite`) with real relational tables (users, pets, vaccinations, appointments, products, orders, order_items, adoptions, messages, settings) — zero-config, file at `data/jvh.db`, auto-seeded (admin, staff vet, demo customer, priced catalogue, adoption pets, sample bookings/orders so panels demo well). Passwords: scrypt. Sessions: HMAC-signed httpOnly cookies. Slips/invoices: print-optimised pages (Save-as-PDF from browser). The scaffold's Postgres/Drizzle stub is left intact for a future managed-PG migration; `src/db/index.ts` was made lazy so it no longer crashes without `DATABASE_URL`.

## 9. Pre-existing repo issues found (fixed in this build)

- `public/` folder missing entirely → every `/images/*.jpg` reference 404s. All imagery regenerated.
- Shop was enquiry-only (no prices, WhatsApp checkout), booking was a WhatsApp message builder, no auth/panels/DB. All replaced with real systems; honest micro-copy retained where facts (doctor credentials, reviews, product brands) still need the hospital's confirmation — flagged in README "Before launch" checklist.

## 10. Demo logins (seeded — change before launch)

- Admin: `admin@jawadvethospital.pk` / `Admin@123`
- Vet staff: `vet@jawadvethospital.pk` / `Vet@1234`
- Customer: `demo@customer.pk` / `Demo@1234`
