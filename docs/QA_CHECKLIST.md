# Digital Chautari — Final QA Checklist

Use this after Phase 8 and again after Phase 9 (against the production URL). Every box must be
ticked with **what was observed**, not just checked. If a check cannot be performed, write why.

Environment record — fill in at verification time:

| Item | Value |
|---|---|
| Commit SHA | |
| Local date / time | |
| Lighthouse version | |
| Browser + version | |
| OS | |
| Viewport widths tested | 360, 390, 768, 1024, 1280, 1440 |

---

## 1. Build & quality gates

- [ ] `npm run lint` → 0 errors, 0 warnings
- [ ] `npm run typecheck` (`tsc --noEmit`) → 0 errors
- [ ] `npm run build` → succeeds, no unexpected route errors
- [ ] `npm run start` → all 7 routes return HTTP 200
- [ ] Zero console errors or warnings across all routes (open DevTools, click every page, expand every accordion/tab)
- [ ] Zero React hydration warnings in the console
- [ ] `git status` clean; `.env.local` is gitignored; `.env.example` is committed

---

## 2. Design fidelity — tokens

- [ ] `--teal` = `#0F9488` (not the PDF's broken `#0F948 8`)
- [ ] `--teal-dark` = `#0B6F66`
- [ ] `--gold` = `#E0A930`
- [ ] `--leaf` = `#7FAE3A`
- [ ] `--ink` = `#101826`
- [ ] `--navy` = `#0B1220`
- [ ] `--navy-card` = `#101D2B`
- [ ] `--navy-border` = `#223140`
- [ ] `--paper` = `#FBFBF9`
- [ ] `--line` = `#E7E5DF`
- [ ] `--muted` = `#5B6472`
- [ ] Chip tints: mint `#E7F5EA`, teal `#E7F2F4`, gold `#FDF1DE`, lilac `#F4E9F6`, pink `#FDEEF0`
- [ ] **No broken hex variants** appear anywhere in the CSS or in hardcoded styles: `grep -rn "0F948 8\|0B6F6 6\|E0A93 0\|7FAE3 A\|10182 6\|0B122 0\|101D2 B\|22314 0\|FBFBF 9\|E7E5D F\|5B647 2" app components data lib` returns nothing
- [ ] Gradient headline is exactly `90deg, #0F9488, #E0A930, #7FAE3A` and is text-clipped (`background-clip: text` + `-webkit-text-fill-color: transparent`) — and the text is still selectable/legible, not a solid teal block
- [ ] CTA panel gradient is teal → deep teal → blue per SPEC §2.1

## 3. Design fidelity — type

- [ ] Headings render in **Sora**; body renders in **Inter** (verify with devtools computed `font-family`, and that no FOUT flash occurs)
- [ ] H1 = 56px desktop / 36px mobile, weight 800
- [ ] H2 = 38px / 28px, weight 700
- [ ] H3 = 20px / 18px, weight 600
- [ ] Lede = 18px / 16px, weight 400
- [ ] Body = 16px, weight 400, `line-height: 1.5`, colour `#101826`
- [ ] Eyebrow = 13px, weight 600, uppercase, `letter-spacing: 0.08em`
- [ ] Caption = 14px, weight 500
- [ ] Sora is never used below 16px
- [ ] Both fonts load via `next/font` with `display: swap` and cause **zero** Cumulative Layout Shift

## 4. Design fidelity — layout

- [ ] Container max width is exactly 1120px (measure with devtools)
- [ ] Container padding: 40px at ≥761px, 22px at ≤760px
- [ ] Section rhythm: standard 64px, tight 48px, hero 84px top / 48px bottom
- [ ] Every grid gap is 20px
- [ ] Radii: chips 10px, cards/inputs 12px, pills 20px, buttons 8px
- [ ] Cards are **flat at rest** (verify: no shadow on a non-hovered card)
- [ ] Card hover lifts exactly 4px and gains a soft shadow
- [ ] Icon chip scales to 1.08× on parent-card hover
- [ ] No layout shift when fonts/images load; no horizontal scrollbar at any width

## 5. Design fidelity — global chrome

- [ ] Header is sticky, `backdrop-blur` active, gains a bottom border after 8px of scroll
- [ ] Header left: logo square (teal gradient, "DC", Sora 700 white) + wordmark + tagline
- [ ] Header centre nav: Home / Services / Products / About / Contact
- [ ] Active nav item is `--teal-dark` with a teal underline dot, and it updates on every route
- [ ] Header right: teal "Contact Us" button → `/contact`
- [ ] At ≤760px the nav collapses to a hamburger with a working animated dropdown
- [ ] Footer is navy, 4 columns (Brand / Company / Services / Legal) on desktop
- [ ] Footer divider line present; centered `© 2026 Digital Chautari` present

## 6. Content completeness

- [ ] **Home — all 10 sections**, in order: Hero · Feature strip · Who We Are · Dark stats banner · Products teaser · Sectors · Dark 4-step process · Testimonials · Blog teaser · Closing CTA
- [ ] Home hero: eyebrow "🚀 Welcome to Digital Chautari"; H1 contains the gradient phrase "digital bridges"; both CTAs present
- [ ] Home stat bar: 3 Products / 6+ Team Members / 100% Commitment
- [ ] Home features: exactly 4, with the 4 chip tints rotated
- [ ] Home dark stats: 250+ / 40+ / 1M+ / 98%
- [ ] Home sectors: exactly 6
- [ ] Home process: exactly 4, dark, with connecting line on desktop
- [ ] Home testimonials: 3; blog teaser: 3
- [ ] **Services — all 6 sections**: Hero · Categories (3 rows × 4 sub-services = 12) · Pricing (3 tiers) · Industries (6) · Dark "Why work with us" (6) · Closing CTA
- [ ] Pricing: Starter Rs 15,000/mo · Professional Rs 45,000/mo (featured: navy card, gold "Most Popular" badge, raised) · Enterprise Custom
- [ ] **Products — 3 sections**: Hero · Tabbed switcher (3 tabs) · Dark spotlight
- [ ] Products spotlight copy matches the Physio@Home text
- [ ] **About — all 8 sections**: Hero · Story (2×2 tiles) · Mission & Vision · Values (4) · Dark trust band (4) · Team roles (7) · Dark roadmap (4 milestones) · Closing CTA
- [ ] About team: exactly 7 role cards, **no invented personal names** — roles + 2-letter monograms only
- [ ] About roadmap: 4 milestones with gold year pills; 2025 appears twice and reads deliberately
- [ ] **Contact — 4 sections**: Hero · 4 info cards · 4 department direct lines · Two-column block
- [ ] Contact form has all 5 fields + project-type pills (5 options)
- [ ] Contact right column: map card, dark FAQ callout, response-time list (3 items)
- [ ] `/faq` renders 8 Q/A pairs in an accordion
- [ ] `404` page is branded with working links to `/` and `/contact`
- [ ] All page copy comes from `data/` — spot-check that no page string is hardcoded in JSX (`grep -rn "Sectors\|Growth-Driven\|ISO 9001" app/` should not match)
- [ ] **Copy-accuracy:** "ISO 9001 **Ready**" is never stated as "certified"; testimonials do not impersonate real named people; no lorem ipsum anywhere

## 7. Behaviour

- [ ] Page transition: fade + 12px slide, 0.45s ease, on every route change
- [ ] Scroll reveal fires on scroll into view, once, with a visible 70ms stagger
- [ ] `prefers-reduced-motion: reduce` (emulate in devtools) disables: page transition transform, all reveals, all count-ups, infinite blob animation, tab spring, hover lifts, marquee, smooth scroll
- [ ] Count-ups land on the exact final value (250, 40, 1, 98 / 1M) and never show a wrong intermediate
- [ ] Products tabs: click, `ArrowRight`, `ArrowLeft`, `Home`, `End` all work; focus is always visible on the active tab
- [ ] Products tab URL updates to `#<slug>` **without** a scroll jump, and reloading `/products#physio-at-home` opens the third tab
- [ ] `/products#physio-at-home` from the Home "Learn more" link opens the correct tab
- [ ] Mobile menu closes on: link click, route change, `Escape`, outside click, and does not trap focus forever
- [ ] FAQ accordion: button toggles, `aria-expanded` flips, panel content is reachable
- [ ] Internal links resolve — crawl all links and confirm no 404s and no `#` placeholder links that should be real

## 8. Backend / contact form

- [ ] Submitting a valid form **sends a real email that arrives in the inbox** (do not accept a 200 response as proof — open the mailbox)
- [ ] Email `From` is a Resend-verified sender; `Reply-To` is the submitter
- [ ] `name` < 2 chars → inline error, no request
- [ ] `email` malformed → inline error, no request
- [ ] `subject` < 3 chars → inline error
- [ ] `message` < 10 chars → inline error
- [ ] No project type selected → inline error
- [ ] **Server-side** validation rejects a crafted bad payload even with a valid-looking client (test with curl)
- [ ] `message` > 2000 chars rejected server-side
- [ ] Honeypot (`website`) filled → returns 200 and sends **no** email
- [ ] 6 rapid requests from one IP → the 6th returns 429 with a `Retry-After` header
- [ ] Oversized request body rejected early
- [ ] Success state shows the confirmation card with a "Send another message" reset
- [ ] Error state shows an `role="alert"` toast with the server message; form data is preserved
- [ ] Submit button shows a spinner and is disabled while in flight
- [ ] No API key, provider error text, or stack trace appears in any API response body
- [ ] User input in the email body cannot inject HTML (submit `<script>` and confirm it arrives escaped)
- [ ] `GET /api/health` → 200
- [ ] Form works with no `RESEND_API_KEY` set (dev fallback path) — returns 200, logs server-side

## 9. Accessibility (axe DevTools + manual)

- [ ] axe: **0 critical, 0 serious** violations on all 7 routes
- [ ] Skip-to-content link is the first focusable element and becomes visible on focus
- [ ] Exactly one `<h1>` per page; no skipped heading levels
- [ ] Landmarks present: one `header`, one `main`, one `footer`, labelled `nav`
- [ ] Focus ring is visible on every interactive element and never removed without a replacement
- [ ] All form fields have a visible `<label>` (not placeholder-only) and `aria-describedby` for errors/hints
- [ ] Error text is `#B42318`-family on white (verify ≥4.5:1) and is announced
- [ ] Tabs: `role="tablist"`, roving `tabIndex`, `aria-selected`, `aria-controls`, panels `role="tabpanel"` + `tabIndex={0}`
- [ ] Mobile menu: `aria-expanded`, `aria-controls`, focus trapped while open
- [ ] Body scroll is locked while the mobile menu is open
- [ ] Contrast audit — verify each pair explicitly:
  | Foreground | Background | Min ratio | Where |
  |---|---|---|---|
  | `--ink` `#101826` | `--paper` `#FBFBF9` | 4.5:1 | body copy |
  | `--muted` `#5B6472` | `--paper` `#FBFBF9` | 4.5:1 | lede, captions |
  | `--teal-dark` `#0B6F66` | `--paper` `#FBFBF9` | 4.5:1 | small teal text, links |
  | `--gold` `#E0A930` | `--navy` `#0B1220` | 4.5:1 | dark eyebrows |
  | white | `--teal` `#0F9488` | 4.5:1 | primary button label |
  | white | `--navy-card` `#101D2B` | 4.5:1 | dark card copy |
  | light neutral body | `--navy` `#0B1220` | 4.5:1 | dark section paragraphs (**not** `--muted`) |
  | `--muted` on pastel tints | chip tints | 4.5:1 | chips carry icons only — verify no body copy sits on a tint |
- [ ] Full keyboard walkthrough completes every task on every page with no trap (except the intentional mobile-menu trap, which must be escapable)
- [ ] Decorative blobs/glows are `aria-hidden="true"`

## 10. Responsive

- [ ] No horizontal scroll at 360, 390, 768, 1024, 1280, 1440 on **all 7 routes**
- [ ] Nav switches to hamburger at exactly ≤760px (and stays inline at 761px)
- [ ] 761–1023px: 4-col → 2-col, 3-col → 2-col
- [ ] `StatBar` stacks correctly (2×2 then 1-col)
- [ ] Timeline is single-sided and left-aligned ≤760px
- [ ] Pricing cards stack ≤760px; featured tier treatment does not break the stack
- [ ] Products panel collapses to one column ≤760px
- [ ] All tap targets ≥44×44px on mobile
- [ ] Map iframe does not overflow its card on mobile
- [ ] Tested on a **real phone**, not just devtools emulation

## 11. SEO

- [ ] Every page has a unique `<title>` and a unique meta description ≤160 chars
- [ ] Title template renders as `"<Page> · Digital Chautari"`
- [ ] OG + Twitter `summary_large_image` tags present on every page
- [ ] `app/sitemap.ts` lists all 7 routes with the production base URL
- [ ] `app/robots.ts` allows all, references the sitemap, disallows `/api/`
- [ ] `/opengraph-image` returns 200 and renders the gradient wordmark
- [ ] OG preview looks correct when the production URL is pasted into a chat app
- [ ] `Organization` + `LocalBusiness` JSON-LD is valid (paste into Google's Rich Results test)
- [ ] Exactly one canonical URL per page; no duplicate-content URLs

## 12. Performance

- [ ] Lighthouse **mobile** — Performance ≥95, Accessibility ≥95, Best Practices ≥95, SEO ≥95
- [ ] Lighthouse **desktop** — same four ≥95
- [ ] `npx lighthouse <url> --preset=desktop` and the default mobile preset both run clean
- [ ] CLS ≈ 0; LCP < 2.5s on mobile
- [ ] Zero raster images in the project (`find public -type f \( -name '*.png' -o -name '*.jpg' \) -size +30k` returns nothing)
- [ ] Only permitted client components exist (SPEC §3 allowlist)
- [ ] JS bundle contains no charting, date, or icon-set libraries
- [ ] Framer Motion does not animate anything off-screen

## 13. Deploy

- [ ] Production URL loads over HTTPS with no mixed-content warnings
- [ ] `NEXT_PUBLIC_SITE_URL` is set on Vercel and OG tags use it
- [ ] Every branch/PR produced a preview URL that builds
- [ ] Contact form email arrives **from the production URL**
- [ ] `git log -p | grep -iE 're_[A-Za-z0-9]{20,}|api[_-]?key'` → no secrets committed
- [ ] README is complete and reflects the shipped state
- [ ] Deliverables assembled: live URL · GitHub link · README · Lighthouse scores
