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
| Shop | ✓ basic | ✓ 18 products / 8 categories, category cards, promo codes, delivery threshold, stock decrement, order statuses, printable invoice (search/sort live in the admin and the cart, not on the storefront) |
| Content | events-as-blog | ✓ `/pet-care-tips` journal + event listings, admin editor |
| Trust | review wall | ✓ review moderation in the console; published reviews feed the site automatically |
| SEO | Next metadata | ✓ per-page metadata, `VeterinaryCare` + `Article` JSON-LD, sitemap, robots (indexing gated on `NEXT_PUBLIC_SITE_URL`) |

---

## 4. Colour scheme (deliberately changed)

> **Update (third review):** the client asked for an exact clone — *same palette, same UX* — so the public site now uses the
> reference's own colours (section 8). The token table below documents the earlier, now-superseded scheme; the database,
> portal, console and slip styling are unaffected because they use the legacy tokens, which the website bridges to the new
> palette inside `.site-shell`.

The earlier build used a **petrol-teal + brass on warm ivory** system:

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

---

## 7. Reference-layout parity pass (21 Oct 2026, second review)

The client reviewed the first build and asked for the public site to follow the reference's actual page
architecture rather than an editorial interpretation of it. The public site was therefore rebuilt section-for-section:

| Reference section (vetsondoor.com) | This build (home) |
|---|---|
| Sticky header: logo, nav, Get App / Log In / Emergency / Book Now | Same structure, same labels, cart and account added |
| Hero: two trust badges, 2-line headline, CTA row, 5 trust chips, vet photo card with WhatsApp, Digital Pet Passport strip | Same |
| 24/7 · coverage · certified · equipped stat bar | Same, four cells |
| App promo strip | "Jawad Care" strip → client portal |
| "Our Veterinary Services" grid with Book Service links | 8 services, fee + duration + Book Service |
| "Pet Mall" (Shop Essentials) — 4 product cards with discount badges | Same, driven by live catalogue |
| "Why Pet Parents Trust Us" — three numbered advantages | Same |
| "Adopt a Pet" — 4 cards with Vaccinated / sex badges + WhatsApp | Same, vet-checked listings |
| "Book in 3 Simple Steps" | Same |
| "Meet Your Veterinarian" — photo, years badge, quote, certification chips, WhatsApp | Same, Dr. Jawad Hussain |
| "Events & Tips" — 4 article cards | Same, live journal posts |
| "Our Work in Action" gallery | 4-image gallery strip |
| Google review wall | 5 published reviews + rating card |
| "Pet Emergency?" band with call/email | Same, clinic number and email |
| Footer | Explore / Clinic / Visit-or-call columns, socials, legal links |

Supporting pages were aligned to the reference's simple title + grid pattern: `/services` ("Veterinary Services in
Lahore"), `/shop` ("Everything Your Pet Will Love" → Browse Categories → Trending Now), `/book-vet-appointment-lahore`
("Book a Vet Home Visit"), `/about` ("Professional Veterinary Care, Delivered to Your Doorstep Across Lahore."),
`/team` ("Meet Our Veterinary Team"), `/adopt` ("Adopt a Pet"), `/gallery` ("Our Work in Action") and `/contact-vet-lahore`
("Contact Us"). A floating Emergency / Book Visit bar appears on mobile, as on the reference.

**Palette remains deliberately different** (as briefed): petrol teal `#0e3a44`, brass `#a97a30` / `#c69a4f` and warm
ivory `#f7f3ea` / `#fffdfa` on white cards, with Manrope as the public typeface. All new public styles live in
`src/app/site.css`, scoped under `.site-shell`, so the clinic console, client portal and printable slips keep their own
design system untouched. The booking slip, barcode and portal/admin behaviour were not changed by this pass.

---

## 8. Exact-clone pass (21 Oct 2026, third review)

The client supplied full-page screenshots of the live reference and asked for a like-for-like clone: same colours, same
typography, same section order, same interactions. The public site was rebuilt against those screenshots.

### Palette, sampled from the screenshots

| Token | Value | Use |
|---|---|---|
| `--r-teal` | `#224c5c` | Hero background, dark feature cards, footer CTA |
| `--r-teal-2` | `#316c87` | Primary buttons, links, icon accents, stat numbers |
| `--r-ink` | `#1f2d34` | Dark navigation bar, footer, body headings |
| `--r-orange` | `#d76638` | "Sign Up Free", Emergency pill, Call button, discount badges |
| `--r-green-2` | `#65d072` | WhatsApp / adoption CTAs |
| `--r-cream` | `#fefaf3` | Page background, alternating sections |
| `--r-peach` / `--r-peach-2` | `#f8d7c4` / `#fdeee4` | Service bento tiles, certification chips |
| `--r-blue` | `#ecf7fb` | Lab-tests tile, advantage blobs |
| White | `#ffffff` | Header, cards, trust sections |

Typography: **Fraunces** (display serif, matching the reference's serif headlines) + **Manrope** (UI), both self-hosted.

### Structure cloned from the screenshots

1. White header (logo, Get App, cart, Log In, Emergency, Book Now) **plus the separate dark nav bar** underneath.
2. Deep-teal hero with two outline pills, three-line headline, three CTAs, four trust chips, and the **white veterinarian
   card** with a rotated "Top Rated" ribbon, credential chips and the green WhatsApp button; the Digital Pet Passport
   strip sits under the card and now really resolves a booking reference to its slip.
3. Floating white statistics card overlapping the hero's bottom edge.
4. **Bento services grid** — one wide teal tile plus peach/white/blue tiles, each with "Book Service →".
5. Pet Mall rail with discount badges and circular cart buttons.
6. Zig-zag "Why Pet Parents Trust Us" with organic blob art behind each advantage icon.
7. Adoption cards with vaccinated/sex badges and full-width WhatsApp buttons.
8. Three-step booking strip with a peach connector line.
9. Dark-teal "Meet Your Veterinarian" band with the portrait, quote, certification chips and WhatsApp CTA.
10. Events & Tips cards with category chips and circular arrow buttons.
11. "Our Work in Action" four-image gallery.
12. Google review wall: brand block with the green "Write a review" button and a **swipeable three-up carousel** with
    floating arrow controls.
13. Full-width "Pet Emergency?" gradient band with the orange call pill and email link.
14. Teal CTA card above the dark four-column footer with ▸ service links, contact block and Google review pill.
15. Mobile: floating Emergency / Book Visit bar, exactly as the reference does it.

The interaction model is unchanged from the earlier build (booking wizard → server action → reference + printable slip,
cart → checkout → invoice, portal and console), so the clone is visual and behavioural, not a static mock.

---

## 9. Premium-palette pass + interior-page migration (21 Oct 2026, fourth review)

The client's review of the clone: *"Pet Mall aur baqi sab pages ko dekho … colour scheme thori premium kar lo but design
aur overall look waise hi rakho jaise links de rahe hain."* Named pages: the Pet Mall (`/shop`), `/services`,
`/veterinarian-lahore`, `/about`, `/contact-vet-lahore`, `/adopt`, `/events`.

So this pass **changed no layout, no section order and no interaction**. It did two things:

1. **Refined the palette in the same colour family** — the reference's cream / teal / copper / peach system, moved from
   flat web colours to deeper, less saturated "hospital-luxury" values. Contrast is unchanged or better; the peach and
   blue tints keep their role (service tiles, lab tile, advantage blobs) and the greens still mean WhatsApp/adoption.
2. **Rebuilt every named interior page on the same bespoke component layer as the home page**, so the interior pages are
   no longer riding the older global classes. Each page mirrors its reference counterpart section for section.

### Palette (current, authoritative)

| Token | Value | Was (screenshot sample) | Use |
|---|---|---|---|
| `--r-ink` | `#152329` | `#1f2d34` | Dark nav, footer, headings |
| `--r-ink-2` | `#2f4149` | — | Secondary headings, select arrows |
| `--r-muted` | `#5c6e76` | — | Body copy on light surfaces |
| `--r-teal` | `#163e4a` | `#224c5c` | Hero, dark feature cards, footer CTA |
| `--r-teal-2` | `#2a6073` | `#316c87` | Primary buttons, links, icon accents |
| `--r-teal-3` | `#0f2c35` | — | Deepest gradient stop |
| `--r-orange` | `#b45f34` | `#d76638` | Emergency pill, call button, discount badges |
| `--r-copper-soft` | `#e7b39a` | `#f8d7c4` | Kickers on dark bands, chip text |
| `--r-gold` | `#a8863f` | — | Serif eyebrows, hairline rules, halo details |
| `--r-peach` / `--r-peach-2` | `#f2d9c9` / `#fbece2` | `#f8d7c4` / `#fdeee4` | Service tiles, certification chips |
| `--r-cream` / `--r-cream-2` | `#fbf8f1` / `#f6efe3` | `#fefaf3` | Page background, alternating bands |
| `--r-blue` | `#e9f2f5` | `#ecf7fb` | Lab-tests tile, info notices |
| `--r-green` / `--r-green-2` | `#2f9c50` / `#4bbd68` | `#65d072` | WhatsApp and adoption CTAs |
| `--r-line` | `#e7ded0` | — | Hairlines, panel borders |
| `--r-radius` | `22px` | — | Card and panel radius |
| card shadow | `0 20px 44px -32px rgba(21,35,41,.5)` | — | Lift on white cards |

The portal, the clinic console and the **printable slip keep their own palettes**. Inside `.site-shell` every legacy token
(`--brand`, `--brass`, `--noir`, `--ok` …) is bridged to the values above, so the checkout, booking wizard, gallery and
legal pages inherit the premium palette without being rewritten. The slip's print palette is pinned separately
(`.site-shell .slip`) so an A5 print never inherits a screen colour.

### Interior pages, section for section

| Route | Mirrors | Sections |
|---|---|---|
| `/shop` | `/shop` | **Teal rounded banner** with the search field on top, headline and subtitle bottom-left and the bag watermark right → "Browse Categories" row of 9 photograph tiles (All + 8 categories, each filters the grid; hover lifts the tile with a soft shadow) → "Trending Now" header with the filter/sort control → product grid with −% badges and PKR strikethroughs. Search, category and sort are all live via query params |
| `/services` | `/services` | Page hero → nine service cards in the reference's order (description, "Typical Duration", Learn More / Book Now, **no fees**) → "Life-threatening emergency?" WhatsApp band |
| `/team` | `/veterinarian-lahore` | Page hero → "Lead Vet" founder card (photo, Founder badge, credentials, bio, Specialisations pills, DVM/RVMP/PVMC badges, Book with / WhatsApp Direct) → Credentials & Qualifications rows → "We're Growing" band |
| `/about` | `/about` | Hero + four intro paragraphs → "Our Vision" / "Our Journey" two-column → six value cards → "Legal Information" links. No stats strip, team strip, reviews or CTA band |
| `/contact-vet-lahore` | `/contact-vet-lahore` | Three reach tiles (WhatsApp with 5-minute note, email, 24/7 hotline) → "Follow Us" + "Business Hours" → "Send Us a Message" (Name / Phone / Email / Subject select / Message) with a single **Send via WhatsApp** action; the submission is also stored in the clinic inbox |
| `/adopt` | `/adopt` | Logo + "Find Your Perfect Companion" centred hero → species pills → adoption cards (vaccinated badge, sex pill, breed · age, WhatsApp) → **Post Pet** (login-gated posting form). No counts, reserved block or four-step flow |
| `/events` → `/pet-care-tips` | `/events` | "Events & Tips" hero → one grid of large article cards (image, category chip, title, date). No category filters, lead article, event list or FAQ |
| `/services/[slug]` | `/services/pet-vaccination-lahore` | Hero + duration/area meta → "What's included" checklist → three benefit cards → dark booking slot panel → FAQ accordion → area pills → related services → booking band |

The contact form posts a real record (name, phone, email, subject, message) to the clinic inbox **and** hands the same
message to WhatsApp, which is the reference's own submit behaviour. "Post Pet" is a working, login-gated listing form
(`/adopt/post`) rather than a dead button.

### Reference URLs still work

`/veterinarian-lahore` → `/team`, `/events` and `/events/:slug` → `/pet-care-tips[/:slug]`, `/contact` →
`/contact-vet-lahore`, `/blog[/:slug]` → `/pet-care-tips[/:slug]`, `/privacy` → `/privacy-policy`, `/terms` →
`/terms-and-conditions` (307 redirects in `next.config.ts`), so links copied from the reference site land on the
equivalent page here.

### Verification

`rm -rf .next && JVH_AUTH_SECRET=… npm run build`, `npx tsc --noEmit`, `npm run lint`, `node scripts/smoke.mjs`,
`node scripts/flows.mjs` — all clean on this pass; every route in the sweep returns 200 and every flow (booking → slip,
cart → checkout → invoice, portal, console) still passes.


---

## 10. Reference-parity correction (21 Oct 2026, fifth review)

The client compared the pages against the reference links again: *"jo mne uper links deye h tumne pages wese ni bnae …
design or overlook sb same rkho or prices agr wha ni mentioned to tum b mt kro or jese wo kam kr rha h wese kro."*
The pages had been over-built — extra sections the reference does not have, and invented fees.

**What changed**

- **No price unless the reference shows one.** Service cards and service detail pages no longer carry a fee, "From"
  label or home-visit surcharge block. Prices remain where the reference shows them: the Pet Mall (live product prices
  and strike-throughs) and the booking flow (visiting / emergency fees).
- **Extra sections removed** on `/shop`, `/services`, `/services/[slug]`, `/team`, `/about`, `/contact-vet-lahore`,
  `/adopt` and `/events`, so each page now has the same section list, in the same order, as its reference counterpart
  (see the updated table in §9).
- **Behaviour matched.** Category cards filter the Pet Mall; every service card's "Book Now" pre-selects that service in
  the booking wizard; "Post Pet" opens a login-gated listing form that publishes into the adoption feed and the admin
  desk; the contact form's single primary action is "Send via WhatsApp" (the record is still stored).
- **Copy aligned** to the reference's own wording for the service list, durations, emergency band, contact tiles,
  business-hours block, about-page values and legal strip.

**Verification.** `tsc --noEmit`, `eslint`, `next build`, `scripts/smoke.mjs` and `scripts/flows.mjs` all pass; every
route in the sweep returns 200 (`/adopt/post` correctly 307s to `/login?next=/adopt/post` when signed out), and a
price audit confirms zero PKR strings on `/services`, `/services/<slug>`, `/about`, `/contact-vet-lahore`, `/adopt`,
`/pet-care-tips` and `/team`.
