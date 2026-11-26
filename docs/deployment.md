# Deployment — Vercel (live)

## Stack

- **Framework:** Astro 7 (static output) + TypeScript + Tailwind CSS v4
- **Content:** Markdown guides in `src/content/guides/`, opportunities in `src/data/opportunities.json`
- **Hosting:** Vercel, free Hobby plan. **Live URL: https://rozgar-raasta-pakistan.vercel.app**
- **Repo:** https://github.com/notyhorahahu/rozgar-raasta-pakistan (public, branch `main`). Every push to `main` auto-deploys to production.
- **Vercel account:** free Hobby, scope `arslanahmad23464-6618`, signed in via Google as arslanahmad23464@gmail.com.

> **Why Vercel, not Cloudflare Pages:** Cloudflare Pages was the original
> choice, but its Turnstile human-verification check could not be
> cleared from the cloud browser (5 attempts across 2 environments),
> so no Cloudflare account could be created. The owner ordered Vercel
> instead on 26 Nov 2026. Do not switch hosts without the owner's say-so.

## Build

```bash
cd rozgar-raasta-pakistan
npm install
npm run build
```

Build output goes to `dist/`. Build verified locally on 26 Nov 2026: **61 pages, 0 errors**.

## How deployment works now

1. Make changes locally, run `npm run build` to verify.
2. Commit and push to GitHub `main`:
   ```bash
   git add -A && git commit -m "message" && git push origin main
   ```
   (Push needs a GitHub PAT — the `rozgar-push-nov26` token, repo-scoped, expires 3 Dec 2026. If pushes start failing with auth errors, create a fresh fine-grained PAT the same way.)
3. Vercel detects the push and deploys automatically (Astro preset,
   build command `npm run build`, output directory `dist`, no env vars).
4. Verify the live URL returns 200 (or run `node scripts/daily-check.mjs`).

## Post-deploy verification checklist

- [x] Homepage loads over HTTPS (verified 26 Nov 2026, HTTP 200, 94 KB).
- [x] Navigation works on desktop and mobile.
- [x] An article page opens and renders fully.
- [x] Images (logo, favicon, OG image) load (all 200).
- [x] Search works (`/search?q=...`, client-side index).
- [x] CV Builder form updates the live preview and Print works.
- [x] `/sitemap-index.xml` returns the sitemap (60 URLs).
- [x] `/robots.txt` returns the robots file.
- [x] `/rss.xml` returns a valid feed.
- [x] `/404` page renders for a bad URL (HTTP 404).
- [x] No hosting branding appears on any page (Vercel adds no visible badge).
- [x] Mobile layout clean at 360 / 390 / 768 / 1024 / 1440 px.
- [x] No console errors on the homepage.

## Free-plan limits (honest)

- Vercel Hobby (free): 100 GB bandwidth/month, 6,000 build minutes/month,
  100 deployments/day. This static site is well within those limits.
- No server-side code is used, so there are no Functions/DB costs.
- A custom domain is optional and not free by itself — the
  `.vercel.app` address works without buying a domain. Do not claim a
  paid custom domain is free.

## Updating content

- Guides: edit/add Markdown in `src/content/guides/` (see `src/content.config.ts` for the frontmatter schema: `title`, `description`, `category`, `date`, `updated`, `tags`, `author`).
- Opportunities: edit `src/data/opportunities.json` — only with verified data (source URL, verification date, status). Expired listings must be marked `"closed"`, never shown as open. The daily check flags stale entries.
- Push to GitHub → Vercel rebuilds automatically.
