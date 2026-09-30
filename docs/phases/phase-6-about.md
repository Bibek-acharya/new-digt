# Phase 6 — About Page

**Goal:** Ship the eight-section About page that explains Digital Chautari's story, values, role-based team, roadmap, and contact CTA.
**Depends on:** Phase 2 — shared sections and typed team data
**Estimate:** 5h
**Ships:**
- `/about` renders all eight sections in the exact order from SPEC §5.4.
- Story, mission, vision, values, trust points, roles, and milestones are typed data with no duplicated page copy.
- The TeamGrid contains seven role cards with only the SPEC monograms, and the Timeline has the specified desktop/mobile geometry.
- All dark-surface and pastel-tint text passes the documented contrast checks at desktop and mobile widths.

---

## Scope

**In scope**
- Create `data/about.ts` for the About-specific mission, vision, and two story paragraphs.
- Complete the Phase 2 `data/team.ts` values, trust points, seven roles, and four milestones without duplicating About-specific copy.
- Create the About page and About-only data; refine the existing TeamGrid and Timeline contracts only where the About geometry requires it.
- Implement the eight-section responsive layout, contrast checks, role-only identity treatment, and exact CTA route.

**Out of scope (later phases)**
- Contact form behavior and the `/api/contact` backend — Phase 7.
- Final site-wide Lighthouse, axe, sitemap, and deployment verification — Phase 8.
- Invented employee names, portraits, or a photo/raster asset pipeline — no phase owns these; the canonical requirement is roles only.

## Files to create

| Path | Purpose | Key exports / props |
|---|---|---|
| `app/about/page.tsx` | Server-rendered eight-section About route and metadata | `metadata`; default page export |
| `data/about.ts` | About-only mission, vision, and story paragraphs | `about` object |

## Files to modify

| Path | Change |
|---|---|
| `data/team.ts` | Verify Phase 2 content against SPEC §4.7 and add the ISO readiness code comment; retain `team`, `values`, `milestones`, and `trust` exports. |
| `components/sections/TeamGrid.tsx` | Apply the About responsive column plan while preserving the existing `TeamGrid({ team })` prop contract. |
| `components/sections/Timeline.tsx` | Apply the About line color, dot geometry, alternating layout, and ≤760px left-edge behavior while preserving `Timeline({ milestones })`. |

## Step-by-step

1. Add `data/about.ts` with the approved About-only story, mission, and vision strings below; keep values, trust, roles, and milestones in `data/team.ts` only.
2. Verify the existing Phase 2 `data/team.ts` against SPEC §4.7, including exact role, monogram, focus, gradient, values, trust labels, and milestone strings; add only the ISO readiness comment.
3. Refine `TeamGrid` with role labels as the primary identity; do not add personal names anywhere.
4. Refine `Timeline` with the desktop centered line and alternating cards, then the ≤760px left-edge line and left-aligned cards.
5. Compose the eight sections in the exact order below, using the shared container, section, card, reveal, and CTA contracts.
6. Export metadata with title `"About"`, the exact site description from SPEC §4.1 because no About-specific description is supplied, `site.url`, `type: "website"`, `siteName: "Digital Chautari"`, and `twitter: { card: "summary_large_image" }`.
7. Run the verification commands and perform the 360px, 760px, keyboard, contrast, reduced-motion, and role-only identity checks.

## Section-by-section build plan

### Section 1 — PageHero
- **Component:** `<PageHero eyebrow="About Us" title={<>The people behind <span className="gradient-text">Digital Chautari</span></>} lede={about.hero.lede} />`.
- **Copy:** eyebrow `"About Us"`; title `"The people behind Digital Chautari"`. SPEC does not provide the PageHero lede literal; obtain it before implementation and source it from data.
- **Layout:** Use `PageHero`'s `--gradient-page-hero` wash, top-right `GradientBlobs`, shared `1120px` container, `40px` desktop / `22px` mobile padding, and hero `84px` top / `48px` bottom padding.
- **Motion:** Use the existing PageHero reveal only; blobs are `aria-hidden="true"` and static under reduced motion.
- **Acceptance:** Exactly one `h1` reads `The people behind Digital Chautari`, with only `Digital Chautari` gradient-styled, and the lede is data sourced.

### Section 2 — Story
- **Component:** `<Section variant="standard"><Container>...</Container></Section>` with `SectionHeading title="From a chautari to a digital powerhouse"` and story data from `about.story`.
- **Copy:** heading `"From a chautari to a digital powerhouse"`; store and render these two About-specific paragraphs in `data/about.ts`: `"A chautari is a place in Nepal where people gather, talk, and solve problems together. Digital Chautari brings that spirit to digital work from Kathmandu."` and `"We bring strategy, storytelling, engineering, and health-tech delivery into one team, so ambitious ideas can move from a conversation to something people can use."` The 2×2 tile labels are literal: `2025` / `Founded`, `3` / `Products`, `Kathmandu` / `HQ`, and `7+` / `Team Members`.
- **Layout:** Two columns above 760px: story copy and a 2×2 tile grid, `gap-5`; collapse to one column at `max-width: 760px` with copy first and tiles second. Use standard `64px` block padding and shared container padding.
- **Motion:** `Reveal` indices `0` for heading, `1` and `2` for the paragraphs, and `3–6` for the four tiles, each using the shared 70ms index stagger. Tiles may use the shared interactive card hover only.
- **Acceptance:** Four tiles are present in the specified order and each has an individually checked foreground/background pair: `2025` Founded uses `--teal-dark #0B6F66` on `--chip-teal #E7F2F4` at `5.29:1`; `3` Products uses `#FFFFFF` on `--navy #0B1220` at `18.72:1`; `Kathmandu` HQ uses `--ink #101826` on `--paper #FBFBF9` at `17.17:1`; `7+` Team Members uses `--ink #101826` on `--chip-gold #FDF1DE` at `15.93:1`.

### Section 3 — Mission & Vision
- **Component:** two `<Card tone="light">` cards in a two-column grid.
- **Copy:** Mission: `"We help organisations in Nepal turn clear ideas into useful brands, content, and software that people can use."` Vision: `"We want Kathmandu to be known for digital products and creative work that improve everyday life in Nepal and reach beyond it."` These are the plain, concrete About-specific strings to store in `data/about.ts`.
- **Layout:** Two equal columns with `gap-5` above 760px; stack Mission first and Vision second at `max-width: 760px`. Use `22px` card padding, `12px` card radius, and standard section padding.
- **Motion:** `Reveal` indices `0` and `1`; cards are flat at rest and use only the shared 250ms hover lift when interactive.
- **Acceptance:** Both cards are visible at 761px and above, stack in Mission/Vision order at 760px and below, and the exact strings are loaded from `data/about.ts`.

### Section 4 — Values
- **Component:** `<SectionHeading title="Values" />` plus four value cards from `<data/team.ts>.values`, mapping the existing `body` field to card copy.
- **Copy:** Values are exact: Passion — icon `Flame` — `"We care about the outcome more than the deliverable."`; Creativity — icon `Lightbulb` — `"We look for the idea nobody else tried."`; Excellence — icon `Award` — `"Details are the product."`; Collaboration — icon `Users` — `"Client and agency, one team."`.
- **Layout:** Four cards in one row at ≥1280px, two columns in the 761–1279px range, and one column at ≤760px; `gap-5`, `22px` card padding. Use the explicitly assigned pastel chip tints: Passion `--chip-mint #E7F5EA`, Creativity `--chip-lilac #F4E9F6`, Excellence `--chip-gold #FDF1DE`, Collaboration `--chip-pink #FDEEF0`.
- **Motion:** `Reveal` indices `0–3`; icon chips use the shared `.group` scale to `1.08` for 250ms and respect reduced motion.
- **Acceptance:** Each icon name resolves to the exact lucide icon, each copy string matches above, and the `--ink #101826` body text passes on its chip background: `15.79:1` on mint, `15.10:1` on lilac, `15.93:1` on gold, and `15.81:1` on pink. Body text must never use `--muted` on a pastel chip.

### Section 5 — Dark trust band
- **Component:** `<DarkBanner title="Committed to quality & trust">...</DarkBanner>` with the four `trust` entries.
- **Copy:** title `"Committed to quality & trust"`; trust labels `ISO 9001 Ready`, `Data Protection (Nepal)`, `Global Delivery`, and `Pan-Nepal Network`.
- **Layout:** Full-width `--navy` section with a four-column trust grid at ≥1280px, two columns from 761–1279px, and one column at ≤760px; `gap-5`, standard `64px` block padding. Use the existing `DarkBanner` heading/body rhythm.
- **Motion:** `Reveal` indices `0–3` for trust points; no new background animation.
- **Acceptance:** `ISO 9001 Ready` is rendered exactly as written and is never described as certified. Add `// "Ready" describes readiness, not ISO certification.` immediately beside the string in `data/team.ts`. Check white `#FFFFFF` on `--navy #0B1220` at `18.72:1`; any muted-style supporting text must use a light neutral such as `#C9D2DC`, not `--muted #5B6472`.

### Section 6 — Team roles
- **Component:** `<TeamGrid team={team} />` using the existing shared component prop contract.
- **Copy:** Role and focus are read from the seven SPEC §4.7 rows: Founder & CEO — Vision, fundraising, partnerships; Co-Founder & COO — Operations, delivery, hiring; Front-End Developer — React, Next.js, design systems; Back-End Developer — APIs, databases, infrastructure; Marketing Lead — Campaigns, SEO, paid media; Sales Executive — Client relationships, pipeline; Business Development Officer — Partnerships, vendor network.
- **Layout:** Use the clean responsive plan `4 columns at ≥1280px`, `3 columns at 1024–1279px`, `2 columns at 761–1023px`, and `1 column at ≤760px`; `gap-5`, `22px` card padding. Cards are flat at rest and use the shared interactive lift only if interactive.
- **Motion:** `Reveal` indices `0–6`; avatar circles remain static gradients, with no invented image loading.
- **Acceptance:** **Hard requirement: do not invent personal names.** The role is the primary label and the avatar contains only the exact two-letter monogram from SPEC §4.7: `FC`, `CO`, `FE`, `BE`, `ML`, `SE`, `BD`. No name, initials, portrait, or biography is added to “helpfully” personalise a role card. Each role's gradient matches the SPEC table, and focus text is present.

### Section 7 — Roadmap timeline
- **Component:** `<Timeline milestones={team.milestones} />` inside a dark `Section`.
- **Copy:** Use the exact four milestones: `2025` The Idea — `"Digital Chautari registered. Three problems picked: marketing, content, and access to physiotherapy."`; `2025` First Products — `"Eco Creative and One Content launched with their first five clients."`; `2026` Health-Tech Entry — `"Physio@Home MVP shipped across Kathmandu Valley, with eight districts on the roadmap."`; `2026` Company Registration — `"Formal company registration, expanded team, and first enterprise contracts."`.
- **Layout:** Desktop (`min-width: 761px`): centered `1px` vertical line, alternating cards with odd milestones left and even milestones right, and a centered `8px` green dot on each line intersection. Use `--timeline-line: #7D8B99` on `--navy #0B1220`; its `5.37:1` ratio is visibly stronger than `--navy-border #223140` and exceeds the 3:1 non-text guidance. Year pills are gold background with dark text. Mobile (`max-width: 760px`): move the 1px line to the left edge, left-align every card with padding from the line, keep dots centered on the line, and preserve vertical order. Use standard `64px` block padding and `gap-5` card spacing.
- **Motion:** `Reveal` indices `0–3`; dots and line are static, with no transform under reduced motion.
- **Acceptance:** The four cards alternate left/right on desktop; all four are left aligned with a left-edge line at 760px and below; dots are 8–10px and `--leaf #7FAE3A`; year pills are gold; line is `#7D8B99`; text on navy is light and contrast checked. Render one year pill per milestone, deliberately showing `2025` twice for the two distinct 2025 milestones and `2026` twice for the two distinct 2026 milestones rather than grouping or hiding a year.

### Section 8 — Closing CTA
- **Component:** `<CTAPanel title="Want to join our journey?" primary={{ label: "Get in Touch", href: "/contact" }} />`.
- **Copy:** title `"Want to join our journey?"`; primary label `"Get in Touch"`; primary href `/contact`.
- **Layout:** Shared `CTAPanel` gradient, rounded panel, white heading, and centered responsive action row within the shared container; use standard section padding around it.
- **Motion:** Use the shared panel reveal; button uses the existing 120ms `active:scale-[0.98]` press contract.
- **Acceptance:** The visible `Get in Touch` control is an anchor to `/contact`, has a visible focus ring, and remains reachable at 360px without horizontal scroll.

## Complex interaction spec

```tsx
type TimelineProps = { milestones: Array<{
  year: number;
  title: string;
  body: string;
}> };

const timelineGeometry = {
  desktop: {
    breakpoint: "min-width: 761px",
    line: { position: "absolute", left: "50%", width: "1px", color: "#7D8B99" },
    dot: { size: "8px", position: "absolute", left: "50%", transform: "translateX(-50%)", color: "#7FAE3A" },
    cards: { odd: "grid-column: 1; text-align: right", even: "grid-column: 2; text-align: left" },
    yearPill: { background: "#E0A930", text: "#0B1220", onePerMilestone: true },
  },
  mobile: {
    breakpoint: "max-width: 760px",
    line: { position: "absolute", left: "0", width: "1px", color: "#7D8B99" },
    dot: { size: "8px", position: "absolute", left: "0", transform: "translateX(-50%)", color: "#7FAE3A" },
    cards: { all: "grid-column: 1; text-align: left; padding-left: 22px" },
    yearPill: { background: "#E0A930", text: "#0B1220", onePerMilestone: true },
  },
};

// Render milestones in data order. Index 0 and 2 are left on desktop;
// index 1 and 3 are right. Do not group duplicate years: 2025 is shown
// once for The Idea and once for First Products, intentionally.
```

The timeline is not interactive. The geometry above is the contract: the line is `#7D8B99` rather than low-contrast `--navy-border`, dots are `--leaf`, and all year pills are individually rendered.

## Data to add

| Export in `<file>` | Shape | Source |
|---|---|---|
| `about` in `data/about.ts` | `{ hero: { lede: string }; story: { paragraphs: [string, string] }; mission: string; vision: string }` | Hero lede is missing from SPEC and needs owner approval; story/mission/vision use the exact strings specified in this phase until reconciled |
| `team` in `data/team.ts` | Seven `{ role, monogram, focus, gradient }` records | Phase 2 established this export; SPEC §4.7 exact table; use `FC`, not names |
| `team.values` / `values` in `data/team.ts` | Four `{ title, icon, body }` records; map the selected pastel tone at the `IconChip` call site | Phase 2 established `body`; SPEC §4.7 supplies exact values and icon names; this phase assigns tones mint/lilac/gold/pink |
| `team.milestones` / `milestones` in `data/team.ts` | Four `{ year, title, body }` records | SPEC §4.7 exact milestone table |
| `team.trust` / `trust` in `data/team.ts` | `string[]` of four labels | SPEC §4.7 exact trust list; include the ISO readiness comment |

Do not duplicate `values`, `milestones`, or `trust` into `data/about.ts`. Keep mission, vision, and story paragraphs exclusively in `data/about.ts`.

## Acceptance criteria

**Functional**
- [ ] `/about` contains exactly eight sections in SPEC §5.4 order and exactly one `h1`.
- [ ] All seven role cards render with role labels, focus text, exact monograms, and no personal names.
- [ ] The timeline renders all four milestones, including two deliberate `2025` pills and two deliberate `2026` pills.
- [ ] `Get in Touch` is an accessible link to `/contact`.

**Design fidelity**
- [ ] Story tiles are a 2×2 grid above 760px and single-column at 760px and below, with the four specified surfaces and documented contrast ratios.
- [ ] Mission/Vision are side by side above 760px and stacked at 760px and below.
- [ ] Values use Flame, Lightbulb, Award, and Users with the specified copy and pastel tints.
- [ ] Trust band and timeline use `--navy`; timeline uses a visible `#7D8B99` line, `--leaf` dots, gold year pills, and the required alternating geometry.
- [ ] TeamGrid follows 4/3/2/1 columns at ≥1280px / 1024–1279px / 761–1023px / ≤760px and has no horizontal scroll at 360px.

**Accessibility**
- [ ] Every interactive element has the shared visible focus ring; decorative gradients and avatar treatment are `aria-hidden` where appropriate.
- [ ] All body text on `--navy` uses a light foreground and all pastel-tint text uses a dark foreground; the documented ratios are checked in a contrast tool.
- [ ] Heading order has no skipped level, cards remain readable when stacked, and the timeline remains understandable without relying on left/right position.
- [ ] Reduced motion produces static reveals, avatars, timeline, and CTA interactions.

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

- [ ] Open `/about` and verify all eight sections, exact headings, exact trust labels, and exact CTA route.
- [ ] Inspect the four story tile foreground/background pairs individually, including white on navy for Products.
- [ ] Verify Mission and Vision stack at 760px and remain side by side at 761px.
- [ ] Verify each value icon, copy, pastel tint, and contrast ratio.
- [ ] Confirm the ISO label says `ISO 9001 Ready`, never ISO certified, and inspect the source comment.
- [ ] Confirm all seven cards show roles and `FC`, `CO`, `FE`, `BE`, `ML`, `SE`, `BD` only; search rendered HTML and source for invented personal names.
- [ ] At desktop, confirm odd timeline milestones are left, even milestones are right, the line is centered, dots are centered, and year pills appear per milestone.
- [ ] At 760px and 360px, confirm the timeline line is at the left edge, cards are left aligned, all grids stack as specified, and there is no horizontal scroll.
- [ ] Enable reduced motion and verify no reveal, hover, or CTA transition creates movement.
- [ ] Run axe and inspect landmarks, heading order, focus rings, dark-surface contrast, pastel contrast, and console output.

## Commit

`git commit -m "Phase 6: About page"`
