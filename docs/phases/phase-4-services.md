# Phase 4 — Services Page

**Goal:** Ship the six-section `/services` catalogue, pricing, industries, trust band, and closing CTA exactly as contracted.
**Depends on:** Phase 1 (shared shell, tokens, primitives, motion contracts) and Phase 3 (home-page patterns and shared data conventions)
**Estimate:** 3–4h
**Ships:**
- A complete `/services` route with six sections in the canonical order.
- Typed `data/services.ts` and `data/pricing.ts` sources with the exact supplied content.
- Three alternating service-category rows, three pricing tiers, six industries, six reasons-to-work-with-us items, and the closing CTA.
- Responsive behavior at the 760px boundary, including stacked pricing cards and category layouts.
- Optional billing toggle behavior that cannot block completion of the phase.

---

## Scope

**In scope**
- Services sections 1–6 from SPEC §5.2.
- Category, sub-service, industry, why-us, pricing, and billing data contracts.
- `/services` metadata export.
- Pricing featured treatment and optional Monthly/Yearly toggle.
- Contrast, keyboard, reduced-motion, and responsive checks for this route.

**Out of scope (later phases)**
- Contact form submission and backend email flow — Phase 7.
- Product, About, FAQ, and supporting routes — their respective later phases.
- New service copy, new pricing tiers, or new palette tokens not present in SPEC.

## Files to create

| Path | Purpose | Key exports / props |
|---|---|---|
| `app/services/page.tsx` | Server-rendered Services route containing six sections | `metadata`; `default` page export |
| `data/services.ts` | Typed category, industry, and why-us content | `categories`, `industries`, `whyUs` |
| `data/pricing.ts` | Typed pricing tiers and billing source data | `pricing`; `PricingTier`/billing types as needed, without changing the specified shape |

## Files to modify

| Path | Change |
|---|---|
| None required by this phase | Reuse existing `PageHero`, `SectionHeading`, `IconChip`, `Card`, `PricingGrid`, `DarkBanner`, `CTAPanel`, `Reveal`, and layout primitives. |

## Step-by-step

1. Add `data/services.ts` with the three categories, their exact category descriptions, the exact sub-service names/icons, six industries, and six why-us labels.
2. Add `data/pricing.ts` using the exact `pricing` object and tier content from SPEC §4.5; retain `price` as a string so `"Custom"` remains valid.
3. Add `/services` metadata with title `"Services"`, use the exact site description from SPEC §4.1 because no services-specific lede/description is supplied, and include the site URL, `type: "website"`, `siteName: "Digital Chautari"`, and `twitter.card: "summary_large_image"`.
4. Build the six sections in the exact order below. Keep all page copy in the two data files; the only literal JSX strings should be structural/accessibility values already defined by the component contract.
5. Implement the billing toggle only if time permits; it is explicitly optional/strippable and must never block the monthly pricing acceptance criteria.
6. Run the phase verification commands and record the manual QA observations before committing.

## Section-by-section build plan

### Section 1 — Page Hero  (`app/services/page.tsx:hero region`)
- **Component:** `Section variant="hero" tone="tint"` with `PageHero`.
- **Component call:** `<PageHero eyebrow="Our Services" title={<>Services that <strong className="gradient-text">drive growth</strong></>} lede={servicesHero.lede} />`; `servicesHero` is not an export specified by §4.4, so the missing lede must be reconciled before implementation. If the PageHero lede is intentionally omitted, document that exception rather than inventing one.
- **Copy:** eyebrow `"Our Services"`; title plain `"Services that "` plus gradient-bold `"drive growth"`; lede is required by the PageHero contract but is not supplied as a literal in SPEC §5.2 or §4.4.
- **Layout:** at `≥1024px`, use the PageHero content width and `84px` top/`48px` bottom hero padding; at `761–1023px`, retain the readable single-column hero; at `≤760px`, use 22px container padding, 36px H1, and the 760px mobile behavior.
- **Motion:** PageHero’s eyebrow, title, and lede use `Reveal index={0}`, `{1}`, and `{2}` with `0ms`, `70ms`, and `140ms`; the hero gradient blobs honor reduced motion.
- **Acceptance:** the eyebrow and title literals match exactly; only `drive growth` is gradient-bold; exactly one H1 is emitted; the unresolved lede is not replaced with invented copy.

### Section 2 — Categories  (`app/services/page.tsx:categories region`)
- **Component:** three category rows separated by `--line`, each with a category `IconChip`, H2, description, and a 2×2 sub-service grid.
- **Component call:** `IconChip icon={category.icon}` plus a category heading/description and four `Card` sub-service items from `categories`; the shared category-row component prop contract is not named in SPEC, so preserve the data mapping locally until that contract is reconciled.
- **Copy:**
  - **Digital Marketing** (`Megaphone`) — `"Full-funnel acquisition across search, social, and paid."`; sub-services: **SEO & SEM** (`Search`), **Social Media Marketing** (`Share2`), **Paid Advertising** (`MousePointerClick`), **Analytics & Reporting** (`BarChart3`).
  - **Content Creation** (`Clapperboard`) — `"Original video, photography, and copy that people actually watch."`; sub-services: **Video Production** (`Video`), **Photography** (`Camera`), **Copywriting** (`PenLine`), **Graphic Design** (`Palette`).
  - **Software Development** (`Code2`) — `"Web, mobile, and health-tech products built to be maintained."`; sub-services: **Web Applications** (`Globe`), **Mobile Apps** (`Smartphone`), **Health-Tech Software** (`HeartPulse`), **API & Integrations** (`Plug`).
- **Sub-service descriptions:** SPEC requires a one-line description for each sub-service but supplies only the names and icons above. Leave these fields unresolved rather than inventing copy; this is a content blocker to reconcile before implementation is called complete.
- **Row direction:** use alternating placement: row 1 icon/content left and sub-service grid right; row 2 icon/content right and sub-service grid left; row 3 icon/content left and sub-service grid right. `// Alternate the feature column to create a predictable visual rhythm while preserving the same reading order in the DOM.` Keep the DOM order category content then sub-services for accessibility, and use layout order only for the visual reversal.
- **Layout:** at `≥1024px`, each row is a two-column split with the category column and a 2×2 sub-service grid, `gap-5`, and a `1px solid var(--line)` separator between rows. At `761–1023px`, retain two columns if both remain readable and keep the alternating visual direction. At `≤760px`, stack category content above the 2×2 sub-service grid or collapse the grid to one column if required by width; use the custom 760px switch, 22px container padding, and separators between rows.
- **Motion:** each row’s category block and sub-service cards use sequential reveals: row 1 indices `0–4` (0–280ms), row 2 indices `5–9` (350–630ms), row 3 indices `10–14` (700–980ms), at 70ms increments. If the section heading is present, it precedes row 1 at `index={0}` and row indices shift by one; keep the order deterministic.
- **Acceptance:** there are exactly three rows and four sub-services per row; row placement is left/right/left as documented; separators are `--line`; category descriptions match the three exact strings; all twelve sub-service names/icons match SPEC; unresolved one-line descriptions are tracked and not fabricated.

### Section 3 — Pricing  (`app/services/page.tsx:pricing region`)
- **Component:** `Section variant="standard"` with a pricing `SectionHeading` and `PricingGrid`; the Professional tier is featured.
- **Component call:** `PricingGrid` receives the `pricing` object/tier collection according to the existing component contract. SPEC defines the three-tier behavior but does not name the `PricingGrid` data prop, so do not create a new public prop name without reconciling it. The required content is `pricing.currency` plus `pricing.tiers`.
- **Copy:**
  - **Starter** — `15,000` `/month`; `"For founders validating a new idea."`; features `"1 active campaign channel"`, `"SEO audit + monthly reporting"`, `"4 social posts / month"`, `"Email support"`; `featured: false`.
  - **Professional** — `45,000` `/month`; `"Our most popular plan for growing teams."`; features `"Up to 3 channels, fully managed"`, `"Content production (video + photo)"`, `"Landing page build & CRO"`, `"Bi-weekly strategy calls"`, `"Priority support"`; `featured: true`.
  - **Enterprise** — `"Custom"`; empty period; `"For organisations with complex needs."`; features `"Dedicated squad"`, `"Custom software development"`, `"Full brand identity system"`, `"SLA & 24/7 escalation"`, `"Quarterly on-site reviews"`; `featured: false`.
- **Featured treatment:** Professional is a `--navy-card` card with a gold `"Most Popular"` badge and the contracted desktop `lg:-translate-y-3 lg:scale-[1.02]`; it is visually raised/scaled only at the specified large breakpoint. Keep text contrast compliant on the navy card.
- **Optional billing toggle:** Monthly/Yearly with `−15%` is **optional/strippable**. The phase is complete without it if monthly pricing works. If included, yearly numeric pricing is `monthly × 12 × 0.85`, rounded to the nearest `500`; e.g. compute the numeric monthly value, multiply by 12 and 0.85, then round `Math.round(value / 500) * 500`; display `/year`. `Custom` remains `Custom` and is not numerically transformed. Selecting a billing option must not change the source tier names/features.
- **Layout:** at `≥1024px`, three columns with the Professional card raised/scaled; at `761–1023px`, two columns with the third wrapped; at `≤760px`, stack cards, with featured-first acceptable, and keep all controls at least 44px. The optional toggle sits above the grid and remains full-width-safe at 360px.
- **Motion:** heading `Reveal index={0}` (`0ms`), tiers `Reveal index={1}`, `{2}`, `{3}` (`70ms`, `140ms`, `210ms`). If the optional toggle is present, it uses `Reveal index={0}` and shifts the heading/tiers consistently. Billing changes use only the contracted client boundary and reduced-motion behavior for `PricingGrid`.
- **Acceptance:** all three tiers, prices, periods, taglines, features, and featured flags match exactly; Professional has the navy/gold/raised treatment; the page can be marked complete with the toggle removed; when included, yearly rounding is nearest 500 and Enterprise remains Custom.

### Section 4 — Industries  (`app/services/page.tsx:industries region`)
- **Component:** `Section id="industries" variant="tight"` with `SectionHeading` and six compact icon+label cards.
- **Component call:** `<Section id="industries" ...>`; `IconChip icon={industry.icon}` and `Card interactive` for each entry in `industries`.
- **Copy:** heading `"Who we work with"`; labels `Healthcare`, `E-Commerce`, `Real Estate`, `Education`, `Tourism & Hospitality`, `Media & Publishing`.
- **Layout:** at `≥1024px`, three columns; at `761–1023px`, two columns; at `≤760px`, one column. Use `gap-5`, compact 22px card padding, and preserve `id="industries"` for `/services#industries`.
- **Motion:** cards use `Reveal index={0}` through `{5}` with `0ms` through `350ms` in 70ms increments; the heading uses the preceding reveal index if present.
- **Acceptance:** `/services#industries` lands on this section; all six labels/icons are present in data order; the section is 3×2, then 2-column, then 1-column at the specified widths; no horizontal overflow occurs at 360px.

### Section 5 — Why work with us  (`app/services/page.tsx:why-us region`)
- **Component:** dark `Section tone="dark"` or `DarkBanner` treatment with a six-item checklist.
- **Component call:** `DarkBanner` with title `"Why work with us"` and checklist children, or the existing dark section contract if the shared component is not intended for checklist content; use `IconChip`/Lucide teal check icons on `--navy` as the visual marker.
- **Copy:** title `"Why work with us"`; checklist `Dedicated project manager`, `Agile development cycle`, `Transparent pricing`, `Post-launch support`, `Scalable architecture`, `Cross-platform expertise`.
- **Contrast:** check icons must use `--teal-light` if that token exists in the implemented Phase 1 contract, or the approved teal/gold non-body accent that passes contrast; never use gold body text on navy at small size. Verify the chosen check-icon foreground against `--navy` is ≥3:1 for UI/icon graphics, and verify all body text against `--navy` is ≥4.5:1. Large heading text may use the ≥3:1 threshold.
- **Layout:** at `≥1024px`, six items in a 3×2 checklist grid; at `761–1023px`, two columns; at `≤760px`, one column. Use `gap-5`, keep the section full-bleed dark with content in the 1120px container, and apply the 760px 22px padding switch.
- **Motion:** title `Reveal index={0}` (`0ms`), checklist items `Reveal index={1}` through `{6}` (`70ms` through `420ms`). Check icons remain static when reduced motion is enabled.
- **Acceptance:** title is exact; exactly six checklist items render; the background is `--navy`; check icons are teal-light/approved accent and pass the explicit contrast test; no small gold body text is present; the grid collapses at 760px.

### Section 6 — Closing CTA  (`app/services/page.tsx:closing CTA region`)
- **Component:** `CTAPanel` in the final section.
- **Component call:** `<CTAPanel title="Let's find the right service for you" primary={{ label: "Book a Consultation", href: "/contact" }} />`; body and secondary CTA are not supplied by SPEC §5.2, so do not invent them. If the shared component requires a body or secondary prop, reconcile that contract before implementation.
- **Copy:** title `"Let's find the right service for you"`; primary label `"Book a Consultation"` → `/contact`.
- **Layout:** at `≥1024px`, contained CTA panel with the contracted gradient and horizontal action layout; at `761–1023px`, retain the row if controls remain readable; at `≤760px`, stack the primary action and keep a 44px minimum target inside the 22px container.
- **Motion:** title `Reveal index={0}` (`0ms`) and primary CTA `Reveal index={1}` (`70ms`); button press uses the global 120ms scale contract.
- **Acceptance:** title and primary CTA are literal; `/contact` is the only required CTA destination; the panel uses `--gradient-cta`; missing body/secondary copy is not invented.

## Data to add

| Export in `<file>` | Shape | Source |
|---|---|---|
| `categories` in `data/services.ts` | Three categories `{ icon, title, description, subServices: { icon, title, description }[] }`; exactly four sub-services each | SPEC §4.4; category strings/icons exact, sub-service one-line descriptions missing |
| `industries` in `data/services.ts` | Six `{ icon, label, href }` entries; href `/services#industries` per SPEC | SPEC §4.4 |
| `whyUs` in `data/services.ts` | Six checklist labels | SPEC §4.4 |
| `PricingTier` in `data/pricing.ts` | `{ name, price, period, tagline, features, featured }` | SPEC §4.5; preserve `price: string` for `Custom` |
| `pricing` in `data/pricing.ts` | `{ currency: "Rs", tiers: PricingTier[] }` | Exact object in SPEC §4.5 |
| Optional billing type in `data/pricing.ts` | Monthly/Yearly state or display type only if the optional toggle is implemented | SPEC §4.5; yearly calculation is ×12×0.85 rounded nearest 500 |

## Acceptance criteria

**Functional**
- [ ] `/services` renders exactly six sections in the order PageHero, Categories, Pricing, Industries, Why work with us, Closing CTA.
- [ ] Three service categories render with four sub-service slots each; the three category descriptions and all twelve supplied names/icons match SPEC.
- [ ] Pricing renders Starter, Professional, and Enterprise with the exact prices, features, periods, taglines, and featured flags.
- [ ] Professional is the featured navy card with gold `Most Popular` badge and the specified raised/scaled desktop treatment.
- [ ] `id="industries"` exists and `/services#industries` targets the industries section.
- [ ] The optional billing toggle is explicitly removable; if present, yearly values use ×12×0.85 and nearest-500 rounding.

**Design fidelity**
- [ ] Category rows alternate icon/content left, right, left, and use `--line` separators.
- [ ] The 760px boundary is used for the navigation/container/grid switch; do not substitute 768px for the mobile collapse.
- [ ] Cards are flat at rest and use the specified 4px lift/`--shadow-hover` only when interactive.
- [ ] Contrast is checked explicitly: body foreground on `--paper` and dark-section body foreground on `--navy` are ≥4.5:1; large text/UI borders are ≥3:1; the Why-us check-icon foreground against `--navy` is ≥3:1; no gold body text appears on navy at small size.

**Accessibility**
- [ ] The page has exactly one H1 and a logical heading order; category visual reversals do not reverse DOM reading order.
- [ ] `industries` is directly addressable by its id; all interactive cards and buttons have visible focus rings and ≥44px targets on mobile.
- [ ] Pricing controls, if included, expose their selected state and remain usable by keyboard; the toggle is not required for completion.
- [ ] Reduced motion disables reveal/count/price transition animation while leaving content and selected states available.

**Quality gates**
- [ ] `npm run lint` clean
- [ ] `npm run typecheck` clean
- [ ] `npm run build` succeeds

## Verification commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Manual QA

- [ ] Check the whole scroll: exactly six sections, canonical order, no missing category or CTA block.
- [ ] At `≥1024px`, verify category rows are left/right/left, pricing is three columns, and industries/why-us use their documented grids.
- [ ] At `761–1023px`, verify grids move to two columns while navigation remains inline.
- [ ] At `760px` and below, verify 22px container padding, stacked pricing cards, one-column fallback where specified, and 44px controls.
- [ ] At 360px, verify no horizontal scroll in category rows, pricing cards, the optional billing control, or the closing CTA.
- [ ] Verify `#industries` anchor targeting and all required `/contact` CTA navigation.
- [ ] If the billing toggle is included, verify Monthly/Yearly selection, `−15%` copy, `/year` display, nearest-500 rounding, and unchanged Enterprise `Custom`.
- [ ] Verify Professional’s badge, navy surface, raised/scaled desktop treatment, and contrast.
- [ ] Verify Why-us check icons pass the recorded contrast test and that no small gold body text appears on navy.
- [ ] Confirm reveals and optional billing transitions honor reduced motion.

## Commit

`git commit -m "Phase 4: Services page"`
