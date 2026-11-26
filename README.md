# Rozgar Raasta Pakistan

**Tagline:** Learn Skills. Find Opportunities. Build Your Future.

A premium, trustworthy Pakistani platform for genuine jobs, online earning, freelancing skills, scholarships, internships, free courses and career guidance.

## What this is

- **Stack:** Astro 7 + TypeScript + Tailwind CSS v4, Markdown content, static output.
- **Hosting:** Cloudflare Pages (Free). No Netlify, no Vercel, no paid APIs, no secrets in code.
- **Content:** Original guides + verified opportunities (official sources only, with verification dates).

## Pages (23 + extras)

Home, Latest Opportunities, Government Jobs, Private Jobs, Remote Jobs, Online Earning, Freelancing, Skills & Courses, Scholarships, Internships, AI Tools, Student Guides, Business Guides, CV Builder, Career Preparation, About, Contact, Privacy, Terms, Disclaimer, Editorial Policy, Corrections Policy, Advertise With Us — plus All Guides, Search, Admin dashboard, 404, sitemap, robots.txt, RSS.

## Features

- Functional search (server-rendered, works without JavaScript for results).
- Category filtering on the Opportunities page.
- Working client-side CV Builder (form → live preview → print/PDF, no data leaves the browser).
- SEO: unique titles/descriptions, canonical URLs, Open Graph, JSON-LD, sitemap, robots.txt, RSS.
- Newsletter form (stores locally in the browser; no server yet).
- Admin dashboard with real content counts and honest "not connected" states for analytics/AdSense.

## Content rules (standing)

- Never invent opportunities, salaries, deadlines, statistics or application links.
- Every opportunity has a source URL and a verification date. Expired listings are marked Closed automatically.
- Never describe any platform as guaranteed income.
- No fake government logos, no implied official endorsement.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
```

## Deploy

See `docs/deployment.md` (Cloudflare Pages, GitHub-connected or direct upload).

## Docs

- `docs/deployment.md` — Cloudflare Pages deploy steps + verification checklist.
- `docs/adsense-readiness.md` — AdSense readiness audit (NOT applied).
- `docs/analytics-setup.md` — GA4 + Search Console setup (NOT connected, no IDs invented).
- `docs/social-calendar.md` — 30-day content calendar (Facebook, Pinterest, Reddit, Quora; no Instagram).
- `social/graphics/` — branded graphic templates (Pinterest vertical, Facebook square, job card, infographic).

## Costs

$0. Free-tier only: Astro, Tailwind, Cloudflare Pages Free, GitHub Free. No paid services are used.
