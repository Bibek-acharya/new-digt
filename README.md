# Digital Chautari

A Kathmandu-based digital agency website for the agency and its three ventures: Eco Creative Marketing Agency, One Content Creation Studio, and Physio@Home.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript strict |
| Styling | Tailwind CSS v4 + CSS variables |
| Fonts | Sora + Inter via `next/font/google` |
| Animation | Framer Motion (scroll reveals, page transitions, tabs) |
| Icons | lucide-react |
| Forms | react-hook-form + Zod v3 |
| Email | Resend |
| Hosting | Vercel |

## Live URL

**https://new-digt.vercel.app**

## Local Setup

```bash
# Clone
git clone https://github.com/Bibek-acharya/new-digt.git
cd new-digt

# Install
npm install

# Configure
cp .env.example .env.local
# Fill RESEND_API_KEY, CONTACT_TO_EMAIL in .env.local

# Run
npm run dev
# Open http://localhost:3000
```

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Production email | Resend API credential (server-side only) |
| `RESEND_FROM_EMAIL` | Optional | Verified sender; defaults to `onboarding@resend.dev` |
| `CONTACT_TO_EMAIL` | Production email | Inbox receiving contact form submissions |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for OG tags, sitemap, JSON-LD |

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
npm run typecheck  # TypeScript strict check
npm run format     # Prettier
```

## Project Structure

```
app/                    # Routes + API handlers
  layout.tsx            # Root layout (fonts, Header/Footer, JSON-LD)
  template.tsx          # Page fade+slide transition
  page.tsx              # Home (10 sections)
  services/page.tsx     # Services (6 sections)
  products/page.tsx     # Products (3 sections, tabbed)
  about/page.tsx        # About (8 sections)
  contact/page.tsx      # Contact form + info
  faq/page.tsx          # FAQ accordion
  api/contact/route.ts  # POST contact form handler
  api/health/route.ts   # GET health check
  sitemap.ts            # Dynamic sitemap
  robots.ts             # Robots.txt
  opengraph-image.tsx   # OG image (1200x630)
components/
  ui/                   # Primitives (Button, Card, Container, etc.)
  layout/               # Header, Footer, Logo, MobileMenu
  sections/             # PageHero, StatBar, CTAPanel, TabbedShowcase, etc.
  forms/                # ContactForm, ProjectTypePills
data/                   # Typed content (site, home, services, products, etc.)
lib/                    # schema.ts, rateLimit.ts, email.ts, cn.ts
```

## Design System

| Token | Value | Role |
|---|---|---|
| `--teal` | `#0F9488` | Primary buttons, links, accents |
| `--teal-dark` | `#0B6F66` | Hover states, small teal text |
| `--gold` | `#E0A930` | Dark-section accent, badges |
| `--leaf` | `#7FAE3A` | Gradient end, positive markers |
| `--ink` | `#101826` | Body text |
| `--navy` | `#0B1220` | Dark backgrounds |
| `--paper` | `#FBFBF9` | Page background |
| `--muted` | `#5B6472` | Secondary text |

**Typography:** Sora (headings 600/700/800), Inter (body 400/500/600)

**Radius:** chips 10px, cards 12px, buttons 8px, pills 20px

## Architecture Decisions

- **App Router** for server components by default, route handlers as the backend (no separate API server)
- **Typed data files** in `/data` — all copy lives in TypeScript constants, never hardcoded in JSX
- **Shared Zod schema** — one `contactSchema` validates on both client and server
- **In-memory rate limit** — simple fixed-window, documented upgrade path to Upstash Redis
- **Zero raster images** — all visuals are CSS gradients, lucide icons, and the OG `ImageResponse`
- **Reduced motion** — `MotionConfig reducedMotion="user"` + CSS `prefers-reduced-motion: reduce` block

## Contact Form Flow

1. Client validates with `react-hook-form` + `zodResolver`
2. Hidden honeypot field catches bots (silent 200, no email sent)
3. Server validates with the same Zod schema
4. Rate limit: 5 requests per 10 minutes per IP
5. Email sent via Resend with HTML-escaped user input
6. Graceful fallback if `RESEND_API_KEY` is missing (logs server-side)

## License

Built for the Digital Chautari frontend assignment.
