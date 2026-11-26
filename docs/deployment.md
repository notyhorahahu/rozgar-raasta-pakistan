# Deployment — Cloudflare Pages

## Stack

- **Framework:** Astro 7 (static output) + TypeScript + Tailwind CSS v4
- **Content:** Markdown guides in `src/content/guides/`, opportunities in `src/data/opportunities.json`
- **Hosting:** Cloudflare Pages (Free plan). No Netlify, no Vercel.
- **Repo:** GitHub (to be created by the owner — this project is deployment-ready, not yet pushed).

## Build

```bash
cd rozgar-raasta-pakistan
npm install
npm run build
```

Build output goes to `dist/`. Build verified locally on 26 Nov 2026: **47 pages, 0 errors**.

## Deploy to Cloudflare Pages (owner steps)

### Option A — GitHub connected (recommended)

1. Create a new GitHub repository (e.g. `rozgar-raasta-pakistan`) and push this project to it.
2. Go to https://dash.cloudflare.com/ → Workers & Pages → Create → Pages → Connect to Git.
3. Select the GitHub repository.
4. Framework preset: **Astro**.
5. Build command: `npm run build`
6. Build output directory: `dist`
7. Environment variables: none required (the site has no secrets).
8. Deploy. Cloudflare will give a `*.pages.dev` URL, e.g. `https://rozgar-raasta-pakistan.pages.dev`.
9. If the assigned subdomain differs from `rozgarraasta.pages.dev`, update `site:` in `astro.config.mjs` and the sitemap URL in `src/pages/robots.txt.ts` to match, then redeploy.

### Option B — Direct upload (no Git)

1. Run `npm run build` locally.
2. Go to https://dash.cloudflare.com/ → Workers & Pages → Create → Pages → Upload assets.
3. Upload the `dist/` folder.
4. Deploy.

## Post-deploy verification checklist

- [ ] Homepage loads over HTTPS.
- [ ] Navigation works on desktop and mobile.
- [ ] An article page opens and renders fully.
- [ ] Images (logo, favicon, OG image) load.
- [ ] Search works (`/search?q=...`).
- [ ] CV Builder form updates the live preview and Print works.
- [ ] `/sitemap-index.xml` returns the sitemap.
- [ ] `/robots.txt` returns the robots file.
- [ ] `/rss.xml` returns a valid feed.
- [ ] `/404` page renders for a bad URL.
- [ ] No Cloudflare or hosting branding appears on any page (Cloudflare Pages adds no visible badge by default).
- [ ] Mobile layout clean at 360 / 390 / 768 / 1024 / 1440 px.
- [ ] No console errors on the homepage.

## Free-plan limits (honest)

- Cloudflare Pages Free: 500 builds/month, unlimited bandwidth for static sites, 20,000 files per deployment. This site is well within those limits.
- No server-side code is used, so there are no Workers/D1 costs.
- A custom domain is optional and not free by itself — the `.pages.dev` address works without buying a domain. Do not claim a paid custom domain is free.

## Updating content

- Guides: edit/add Markdown in `src/content/guides/` (see `src/content.config.ts` for the frontmatter schema).
- Opportunities: edit `src/data/opportunities.json` — only with verified data (source URL, verification date, status). Expired listings are marked Closed automatically by their deadline.
- Push to GitHub → Cloudflare Pages rebuilds automatically.
