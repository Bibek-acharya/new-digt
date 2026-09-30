# Phase 9 — Deploy to Vercel & Final QA

**Goal:** Release the finished Digital Chautari site to Vercel and prove the live backend, seven routes, quality gates, and interview deliverables work in production.
**Depends on:** Phase 8
**Estimate:** 3–4h
**Ships:**
- A live Vercel URL with the contact form sending an email to the configured inbox.
- A clean, documented GitHub repository with safe environment-variable handling and a README that explains the architecture and trade-offs.
- Recorded production Lighthouse, axe, route, mobile-menu, OG, deep-link, rate-limit, and health checks.

---

## Scope

**In scope**
- Local pre-deploy gates, README completion, environment-variable hygiene, GitHub/Vercel setup, production deployment, rollback readiness, and final QA.
- Explicit proof that the production contact form reaches the inbox, not merely that the local request returns 200.

**Out of scope (later phases)**
- New features, redesign, content expansion, or infrastructure migration beyond the documented Upstash Redis upgrade path.

## Files to create

| Path | Purpose | Key exports / props |
|---|---|---|
| `README.md` | Interview artefact documenting setup, architecture, design system, QA, and deployment. | Markdown only |
| `.env.example` | Safe names and empty values for local setup. | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL` |

## Files to modify

| Path | Change |
|---|---|
| `.gitignore` | Ensure `.env.local` and local secret files are ignored. |
| `README.md` | Replace placeholder sections with the outline and evidence below. |
| `docs/QA_CHECKLIST.md` | Tick the final production observations; do not claim a check that was not performed. |

## Step-by-step

1. Ensure `.env.local` is gitignored, `.env.example` is committed with no secret values, and inspect history for leaked keys.
2. Run the three quality gates and fix every error before pushing. Check `git status` is clean after the intended commit.
3. Complete the README as an interview artefact, including the exact design-token table and architecture trade-offs.
4. Push the repository to GitHub. In Vercel, import it, confirm Next.js auto-detection, and add all environment variables for Production, Preview, and Development.
5. Deploy through the dashboard, read the deployment URL, optionally rename the project slug, and attach a custom domain only if the user has one.
6. Execute the ordered post-deploy runbook below. The first check is a real production contact submission and inbox confirmation.
7. Record Lighthouse, axe, route status, deep-link, health, mobile-menu, OG, and rate-limit results in `docs/QA_CHECKLIST.md` and the README.
8. If a deployment fails, use the failure-mode table before changing code. If a release is bad, use the dashboard rollback plan.
9. Confirm the final deliverables checklist one-to-one before submission.

## Implementation detail

### Pre-deploy gate

Run from the repository root:

```bash
npm run lint && npm run typecheck && npm run build
git status --short
git diff --check
git log -p | grep -iE 're_[A-Za-z0-9]{20,}|api[_-]?key' || true
```

All three npm commands must be clean. `git status --short` must be empty after all intended files are committed. The history scan must return no Resend key, API key, or other secret; investigate every match instead of relying on `|| true`. Confirm `.env.local` is gitignored and `.env.example` is committed with empty values:

```dotenv
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_TO_EMAIL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Do not put a real key in `.env.example`, README, screenshots, commit messages, or source. If a secret ever entered Git history, revoke it, remove it through the repository's approved history-cleaning process, and verify the scan again before deployment.

### README outline

Write `README.md` as an interview artefact, not a generic starter README. It must contain these sections and completed values:

1. **What it is** — Digital Chautari, a Kathmandu-based digital agency site for the agency and its three ventures.
2. **Tech stack** — Next.js 15 App Router, TypeScript strict, Tailwind CSS v4, Sora/Inter via `next/font`, Framer Motion, lucide-react, react-hook-form, Zod v3, Resend, and Vercel.
3. **Live URL** — a placeholder before launch, then the actual Vercel/custom URL after launch.
4. **Local setup** — Node 20+, install dependencies, copy `.env.example` to `.env.local`, fill values, run `npm run dev`, and open `http://localhost:3000`.
5. **Environment variables**:

   | Variable | Required | Purpose |
   |---|---|---|
   | `RESEND_API_KEY` | Production email | Resend API credential; never expose to the client. |
   | `RESEND_FROM_EMAIL` | Optional | Verified sender; defaults to `onboarding@resend.dev` when absent. |
   | `CONTACT_TO_EMAIL` | Production email | Inbox receiving contact submissions. |
   | `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL for metadata, sitemap, robots, and JSON-LD. |

6. **Scripts** — document the actual `package.json` scripts, including `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run start` if present.
7. **Project structure** — explain `app/`, `components/`, `data/`, `lib/`, `public/`, and `docs/` using the authoritative structure in SPEC §7.
8. **Design-system summary** — include this exact token table:

   | Token | Value | Role |
   |---|---|---|
   | `--teal` | `#0F9488` | Primary buttons, links, accents, gradient start |
   | `--teal-dark` | `#0B6F66` | Hover state and small teal text on light backgrounds |
   | `--gold` | `#E0A930` | Dark-section accent, gradient mid-stop, badges |
   | `--leaf` | `#7FAE3A` | Gradient end-stop and positive markers |
   | `--ink` | `#101826` | Body text |
   | `--navy` | `#0B1220` | Dark sections and footer |
   | `--navy-card` | `#101D2B` | Dark card surface |
   | `--navy-border` | `#223140` | Dark-surface border |
   | `--paper` | `#FBFBF9` | Page background |
   | `--line` | `#E7E5DF` | Light hairline border |
   | `--muted` | `#5B6472` | Secondary text |
   | `--chip-mint` | `#E7F5EA` | Icon chip tint A |
   | `--chip-teal` | `#E7F2F4` | Icon chip tint B |
   | `--chip-gold` | `#FDF1DE` | Icon chip tint C |
   | `--chip-lilac` | `#F4E9F6` | Icon chip tint D |
   | `--chip-pink` | `#FDEEF0` | Icon chip tint E |

   Also state the exact typography (Sora headings, Inter body), 1120px container, 40px desktop/22px mobile padding, 20px grid gap, 12px card radius, 8px button radius, 20px pill radius, 760px nav switch, and zero raster images.

9. **Architecture notes** — App Router and Server Components by default; the route handlers are the backend; `lib/schema.ts` is shared by the client and server; `/data` is typed content; the contact limiter is an in-memory fixed-window map and is instance-local on serverless.
10. **Deliberate trade-offs and upgrades** — the no-config path returns a safe 200 for local/demo resilience, while production must configure Resend; the in-memory limiter is simple but not distributed, with Upstash Redis as the upgrade; CSS-only visuals avoid image weight; role-only team cards avoid inventing names; `/api/blog` is optional and strippable.
11. **QA checklist results** — record the exact lint/typecheck/build outcome, production inbox confirmation, all seven route statuses, health, deep-link, 429, mobile menu, OG, Lighthouse mobile/desktop scores, and axe result.
12. **Credits/licence** — credit the implemented libraries and state the repository's chosen licence or that the licence decision is pending; do not invent a licence file that does not exist.
13. **Interview talking points** — briefly distill: one Zod contract on both sides, XSS-safe email rendering, silent honeypot, graceful missing-env behavior, serverless rate-limit limitation and upgrade, Server/Client boundary, reduced motion, zero raster visuals, and the production inbox proof. This README is itself an interview artefact.

### Vercel dashboard deployment

The dashboard is the documented route:

1. Push the clean branch to GitHub.
2. Open Vercel and select **Add New → Project**.
3. Import the GitHub repository.
4. Confirm framework auto-detection identifies Next.js. Keep the repository's build command and output defaults unless the project explicitly defines otherwise.
5. In **Project Settings → Environment Variables**, add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`, and `NEXT_PUBLIC_SITE_URL`.
6. Select **Production**, **Preview**, and **Development** for each variable. `RESEND_API_KEY` and `CONTACT_TO_EMAIL` must be present in Production; adding the same names to Preview and Development prevents environment-specific 500s during QA.
7. Click **Deploy**, wait for the build, and read the generated deployment URL.
8. Optionally rename the project for a clean `*.vercel.app` slug. If the user has a custom domain, add it in **Project Settings → Domains**, complete DNS verification, and update `NEXT_PUBLIC_SITE_URL` to the canonical URL.
9. Redeploy after changing environment variables; environment changes do not retroactively alter an already-built deployment.

### Vercel CLI alternative

The dashboard remains the documented path, but the equivalent CLI flow is:

```bash
npx vercel
npx vercel env add RESEND_API_KEY production
npx vercel env add RESEND_API_KEY preview
npx vercel env add RESEND_API_KEY development
npx vercel env add RESEND_FROM_EMAIL production
npx vercel env add RESEND_FROM_EMAIL preview
npx vercel env add RESEND_FROM_EMAIL development
npx vercel env add CONTACT_TO_EMAIL production
npx vercel env add CONTACT_TO_EMAIL preview
npx vercel env add CONTACT_TO_EMAIL development
npx vercel env add NEXT_PUBLIC_SITE_URL production
npx vercel env add NEXT_PUBLIC_SITE_URL preview
npx vercel env add NEXT_PUBLIC_SITE_URL development
npx vercel --prod
```

Use the CLI prompts to enter values; do not place secrets in shell history when the environment offers a secure prompt. Confirm the project and scope before `npx vercel --prod`.

### Ordered post-deploy verification runbook

Run these steps in this order against the production URL. Record observations, not assumptions:

1. **Production email — single most important check.** Open the production `/contact` page, submit a valid form with a real test email, and confirm the email actually arrives in the configured inbox. This proves the backend works in production, not just locally. Verify the reply-to address is the submitter and that user content is rendered safely.
2. Submit a sixth rapid valid request from the same client/IP and confirm 429 with `Retry-After`. Note that Vercel serverless instances make the in-memory limit per-instance rather than globally distributed.
3. Verify all seven named page routes are reachable: `/`, `/services`, `/products`, `/about`, `/contact`, and `/faq` return 200, while a deliberately missing route renders the branded 404 UI with its intentional 404 status. The specification calls the 404 page a seventh route but also asks for every route to return 200; record this expected exception explicitly rather than masking a real error.
4. Open `https://<live-domain>/products#physio-at-home` directly in a new session; confirm the Physio@Home tab is selected and the page does not jump unexpectedly.
5. Open `/api/health`; confirm `{ "ok": true, "uptime": <number> }`.
6. Test the hamburger menu on a real phone: open, trap focus, lock body scroll, use links, press Escape, and confirm it closes on route change/outside click.
7. Paste the production OG image URL into a chat app or validator and inspect the Sora gradient wordmark and 1200×630 preview.
8. Run Lighthouse mobile and desktop against the production URL. Require ≥95 in Performance, Accessibility, Best Practices, and SEO.
9. Run axe against the production URL on all routes and require zero critical/serious violations.
10. Open the browser console while navigating all routes and require zero errors or warnings.

Useful production commands:

```bash
LIVE=https://<live-domain>
for path in / /services /products /about /contact /faq /does-not-exist; do curl -sS -o /dev/null -w "$path %{http_code}\n" "$LIVE$path"; done
curl -sS "$LIVE/api/health"
npx lighthouse "$LIVE" --preset=mobile --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" --output=html --output-path=./artifacts/production-mobile.html
npx lighthouse "$LIVE" --preset=desktop --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" --output=html --output-path=./artifacts/production-desktop.html
```

### Failure-mode table

| Symptom | Likely cause | Fix |
|---|---|---|
| Resend returns 401/403 | `RESEND_API_KEY` is invalid, revoked, or belongs to another account. | Generate/verify the key in Resend, update the Vercel variable for all required environments, redeploy, and never expose the value. |
| Contact form returns 200 but no email arrives | `CONTACT_TO_EMAIL` is missing; the contract intentionally no-ops with a server log. | Set `CONTACT_TO_EMAIL` in Project Settings for Production, redeploy, submit again, and confirm the inbox. |
| Resend rejects the `from` address | The domain is not verified, or `RESEND_FROM_EMAIL` is an unverified sender. | Verify the sending domain in Resend and set `RESEND_FROM_EMAIL` to the verified address; use `onboarding@resend.dev` only for the documented fallback/demo path. |
| Vercel build fails on TypeScript strictness | A type is implicit, an export/prop contract differs from SPEC, or server/client boundaries are wrong. | Reproduce with `npm run typecheck` and `npm run build` locally, fix the type at its source, and redeploy; do not weaken strictness. |
| Preview build/API returns 500 but Production works | Environment variables were set only for Production. | Add all four variable names to Preview and Development as well, then create a new preview deployment. |
| Hydration mismatch warnings | Server and client render different initial values, often from time, random data, or browser-only APIs. | Keep initial markup deterministic, move browser reads into effects, and ensure reduced-motion/client state does not alter server HTML. |
| OG image returns 500 | `ImageResponse` contains unsupported CSS/JSX, a missing local font, or a build-time external font fetch. | Use the minimal 1200×630 snippet, remove unsupported styles, avoid external font fetches, rebuild, and inspect `/opengraph-image`. |
| Form works locally but 500s in production | Missing env variables, unverified Resend sender/domain, wrong runtime, or provider error hidden by local no-config path. | Confirm Node runtime, set Production variables, verify Resend sender/domain, inspect server logs without returning provider details, and repeat the inbox test. |

### Rollback plan

1. Open the Vercel project **Deployments** tab.
2. Select the last known-good deployment and open its actions menu.
3. Choose **Promote to Production** (or **Rollback** where the dashboard exposes it) and confirm.
4. Re-run the production health, contact inbox, route, and Lighthouse smoke checks against the promoted deployment.
5. Preserve the failing deployment URL and logs, fix the cause on a branch, pass the pre-deploy gate, and deploy a new candidate. Do not force-push or delete evidence before the incident is understood.

### Final deliverables checklist

This maps one-to-one to what the user submits:

- [ ] **Live URL:** the final Vercel URL or attached custom-domain URL, with the production contact inbox confirmation.
- [ ] **GitHub repo link:** the public/private repository link shared with the reviewer, with clean history and no secrets.
- [ ] **README:** completed setup, environment table, scripts, structure, exact design-system token table, architecture notes, trade-offs, QA results, credits/licence, and the interview artefact note.
- [ ] **Lighthouse scores:** saved production mobile and desktop reports showing Performance, Accessibility, Best Practices, and SEO at ≥95.
- [ ] **Interview talking points:** a short README section covering the shared Zod contract, XSS-safe email rendering, honeypot, graceful no-config path, serverless rate-limit limitation and Upstash upgrade, Server/Client boundary, reduced motion, zero raster visuals, and production inbox proof.

## Data to add

| Export in `<file>` | Shape | Source |
|---|---|---|
| README design-system table | Exact token/value/role table | SPEC §2.1 and the table above |
| `.env.example` values | Four empty environment-variable assignments | SPEC §6.5 |
| `docs/QA_CHECKLIST.md` results | Checked items with observed production evidence | SPEC §10 and this runbook |

## Acceptance criteria

**Functional**
- [ ] `npm run lint && npm run typecheck && npm run build` all pass before deployment.
- [ ] The live contact form sends a real email that is confirmed in the inbox.
- [ ] All seven page routes return 200 or the intentional branded 404 response, `/api/health` is healthy, and `/products#physio-at-home` deep-links correctly.
- [ ] Production 429 and `Retry-After` behavior are observed and the per-instance limitation is documented.

**Security / robustness**
- [ ] `.env.local` is gitignored, `.env.example` contains no secrets, and the concrete Git-history scan finds no key.
- [ ] Production responses do not reveal the API key, provider error text, or stack trace.
- [ ] Resend sender/domain and recipient variables are configured for the environments that were tested.

**Design fidelity**
- [ ] The production mobile menu, OG preview, deep-link, and responsive routes match the approved contracts.
- [ ] No deployment fix changed the canonical token values, copy, route contracts, or zero-raster-image constraint.

**Accessibility**
- [ ] Real-phone menu test passes with focus trap, Escape, outside click, route close, and body scroll lock.
- [ ] Production axe reports zero critical/serious violations; focus and reduced-motion checks remain green.

**Quality gates**
- [ ] `npm run lint` clean
- [ ] `npm run typecheck` clean
- [ ] `npm run build` succeeds
- [ ] Lighthouse is ≥95 in Performance, Accessibility, Best Practices, and SEO on production mobile and desktop.
- [ ] README, QA evidence, live URL, and repository link are ready for submission.

## Verification commands

```bash
npm run lint && npm run typecheck && npm run build
git status --short
git diff --check
git log -p | grep -iE 're_[A-Za-z0-9]{20,}|api[_-]?key' || true

LIVE=https://<live-domain>
for path in / /services /products /about /contact /faq /does-not-exist; do curl -sS -o /dev/null -w "$path %{http_code}\n" "$LIVE$path"; done
curl -sS "$LIVE/api/health"
npx lighthouse "$LIVE" --preset=mobile --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"
npx lighthouse "$LIVE" --preset=desktop --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"
```

## Manual QA

- [ ] Confirm the production contact email actually arrives in the inbox; record timestamp and deployment URL.
- [ ] Confirm production 429, `Retry-After`, and the instance-local caveat.
- [ ] Verify all seven routes, the branded 404, `/products#physio-at-home`, and `/api/health`.
- [ ] Test the mobile menu on a real phone.
- [ ] Verify the OG preview in a chat app or validator.
- [ ] Run production Lighthouse mobile and desktop and save both reports.
- [ ] Run production axe and save the zero-critical/serious result.
- [ ] Check the production console for errors/warnings across all routes.
- [ ] Fill the README QA results and final deliverables checklist with observed values.

## Commit

`git commit -m "Phase 9: deploy and complete final QA"`
