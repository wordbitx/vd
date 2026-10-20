# Audit: vetsondoor.com → Jawad Veterinary Hospital rebuild

**Date:** 21 October 2026 · **Reference site:** https://www.vetsondoor.com/ · **Client:** Jawad Veterinary Hospital, Al Kabir Town, Lahore

---

## 1. What the reference site actually is

| Area | Observation on vetsondoor.com |
|---|---|
| Positioning | "Pakistan's first mobile vet" — a **home-visit** service around one named vet (Dr. Muhammad Ahmad, DVM/RVMP), not a hospital. |
| Primary CTA | `Book Now` → `/book-vet-appointment-lahore`; every service card repeats `Book Service`. Log In sits beside it in the header. |
| Booking | **3-step wizard**. Step 1 collects pet name/age/type/breed, service, and an "is this an emergency" switch, and already discloses money: *Rs 1,500 standard visit / Rs 2,500 emergency*. Symptoms are optional. |
| Pricing | Visit charge + service fee, plus per-service pricing pages. This is the single strongest trust device on the site — it removes the "how much will this cost?" objection before contact. |
| Commerce | `Pet Mall` (`/shop`): category browse (Cat Food, Prime Pet Items, Toys), product cards with discount badges and PKR prices, cart, checkout. Product data lives in Supabase storage. |
| Account | `/login` → Supabase auth (email + password, Google OAuth). "Digital Pet Passport" is promised on the home page as the logged-in experience: pets, appointments, adoption enquiries. |
| Content | `/events` used as a **blog** (maggot wounds, cats spraying, panleukopenia, fatty liver), `Adopt a Pet` listings with vaccinated/sex/age chips, gallery, reviews pulled from Google (avatars are UI-Avatars placeholders). |
| Trust signals | RVMP registration, 5+ years experience, 24/7 emergency line, Google review wall, "Fully Equipped Mobile Clinic" advantage blocks. |
| Contact | Phone-first: emergency number in the header, WhatsApp CTAs everywhere, floating mobile emergency bar. |
| Weak points we could see from the outside | Mixed-language microcopy, thin product taxonomy, no visible invoice/confirmation artefact (no printable slip), reviews are unstructured text, blog and events share one conflated route, no visible admin surface for the clinic, and the booking flow has no way to pay or hold a slot. |

**Conclusion:** the site is a marketing funnel around a 3-step booking form plus a small shop. What it lacks — and what a premium clinic actually needs — is a **records spine**: something that turns a booking into a printable reference, keeps the pet's history, and gives the clinic a console.

---

## 2. Screenshot supplied by the client (the booking slip)

The reference PDF/PNG the client sent (`Booking-VOD-2026-752699.png`) is the artefact that closes the loop:

```
BOOKING REFERENCE
VOD-2026-752699
────────────────────────────
DATE      21 Oct 2026
TIME      Morning (10:00 AM – 02:00 PM)
PATIENT   Custom Dog
SERVICE   Deworming
TOTAL DUE Rs. 4,500
────────────────────────────
[ Code-128 barcode ]
```

Four things make it feel trustworthy, and we reproduced all four:

1. **A human-readable reference with a prefix** (`VOD-2026-…` → ours `JVH-2026-…`).
2. **Slot language, not a clock time** ("Morning (10:00 AM – 02:00 PM)") — honest about arrival windows.
3. **A single total**, in PKR, formatted `Rs. 4,500`.
4. **A real scannable barcode**, not decoration.

---

## 3. Gap analysis

| Need | vetsondoor.com | This build |
|---|---|---|
| Printable booking artefact | ✗ (no slip, no invoice) | ✓ `/booking/[ref]`, `/slip/[ref]`, print CSS for A5, **real Code-128** via `bwip-js`, works for orders too |
| Price transparency | ✓ visit charge on step 1 | ✓ full line-item quote re-computed server-side, shown before confirm, repeated on the slip |
| Client portal | ✓ (Supabase) | ✓ `/portal` — pet passports, vaccine card with batch numbers, appointments (reschedule/cancel), orders, messages, profile |
| Staff console | ✗ | ✓ `/admin` — KPI overview with SVG charts, today's dispatch board, appointment board with inline status/vet/payment, orders, clients, stock, services, adoption, journal, reviews, roles, settings |
| Records spine | partial | ✓ pet → vaccines (batch/expiry) → consult notes; overdues surface in the portal **and** the console |
| Emergency handling | phone + WhatsApp | ✓ same, plus an explicit "call, don't fill a form" path inside the booking wizard when emergency is toggled |
| Shop | ✓ basic | ✓ 18 products / 8 categories, filters, promo codes, delivery threshold, stock decrement, order statuses, printable invoice |
| Content | events-as-blog | ✓ `/pet-care-tips` journal + event listings, admin editor |
| Trust | review wall | ✓ review moderation in the console; published reviews feed the site automatically |
| SEO | Next metadata | ✓ per-page metadata, `VeterinaryCare` + `Article` JSON-LD, sitemap, robots (indexing gated on `NEXT_PUBLIC_SITE_URL`) |

---

## 4. Colour scheme (deliberately changed)

The brief said: same functionality, different palette. vetsondoor.com is a bright, clinical blue/white. This build uses a **petrol-teal + brass on warm ivory** system:

| Token | Value | Use |
|---|---|---|
| `--noir` | `#071a20` | Console sidebar, footer, dark bands |
| `--brand` | `#0e3a44` | Primary buttons, headings accents |
| `--brass` / `--brass-2` | `#a97a30` / `#c69a4f` | Eyebrows, badges, halo details, print seal |
| `--bone` | `#f7f3ea` | Page background |
| `--porcelain` | `#fffdfa` | Cards |
| `--ok` / `--warn` / `--danger` | `#2c7257` / `#9b6b0d` / `#9c3a35` | Status system |

Type: **Fraunces Variable** (display, optical size axis) + **Manrope Variable** (UI), both **self-hosted** through `@fontsource-variable` — no Google Fonts request at build or runtime.

---

## 5. What "premium" means in the implementation

- **Restraint over ornament** — one accent (brass), generous whitespace, hairline rules instead of boxes.
- **Real detail** — batch numbers on vaccine rows, "night dispatch" fee lines, dispatch checklists, audit log with names.
- **Honest pricing** — every page repeats that the figure is a *starting professional fee* and that travel is added; the slip itemises each line.
- **Print quality** — the slip is designed for A5, with a perforation rule, a rotated status stamp and a true barcode.
- **No fake data at the edges** — no invented five-star counts on product cards beyond seeded reviews; the demo credentials are shown openly on the login screen so nobody mistakes this for a live system.

---

## 6. Deliberate limitations (and how to close them)

| Limitation | Why | To go live |
|---|---|---|
| Data lives in JSON files under `.data/` | Keeps the demo portable and dependency-free; the portal must work on any host | Point `src/server/store.ts` at Postgres — `src/db/schema.ts` already mirrors every collection; `npm run db:push` |
| No email/SMS delivery | No provider credentials in this environment | Add Resend/Twilio in `src/server/actions/booking.ts` (the WhatsApp deep link already works without a provider) |
| No card payments | PCI scope; the clinic takes cash/transfer today | Stripe/Checkout or a local PSP; `payment` objects already carry `method`/`status`/`reference` |
| Photography is AI-generated | No client photo library supplied | Swap files in `public/images/`; `npm run check:images` fails the build if a reference breaks |
| Opening hours are seeded, not confirmed | The listing hours on Google were unverified | Admin → Clinic settings |
