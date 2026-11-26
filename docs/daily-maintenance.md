# Daily Maintenance — Rozgar Raasta Pakistan

Run every morning to catch problems before readers do. The check is
read-only except for running a local build — it never edits content,
never deploys and never touches the live site.

## The daily command

```bash
cd ~/workspace/coding/projects/rozgar-raasta-pakistan
node scripts/daily-check.mjs
```

Exit code **0** = all green. Exit code **1** = something failed; the
script lists every failure at the end. Fix each failure, re-run until
green, then commit + push (Vercel auto-deploys from `main`).

To check a different URL (e.g. a preview deploy):

```bash
RRP_SITE_URL=https://rozgar-raasta-pakistan-xxxx.vercel.app node scripts/daily-check.mjs
```

## What each check does

### 1. Live site checks
Fetches the homepage, all 23 main pages, `/admin`, `/sitemap-index.xml`,
`/robots.txt`, `/rss.xml` and `/favicon.svg` from the live site and
requires HTTP 200 for each. Also fetches a nonsense URL and requires
HTTP 404 (the custom 404 page must still work). A non-200 means the
deploy is broken, a page was removed, or Vercel is down.

### 2. Local build
Runs `npm run build`. Any build error (bad frontmatter, broken import,
invalid content) fails the check. This catches problems before they
reach production.

### 3. Broken internal links in `dist/`
Scans every built HTML file for internal `href`/`src` links and
confirms each target exists as a route or an asset. `<script>` blocks
are ignored (client-side search builds URLs in JavaScript — those are
not real links). External links are not checked here; spot-check the
official source links in new guides by hand.

### 4. Opportunities data freshness
Reads `src/data/opportunities.json` and flags any entry whose
`deadline` has passed but whose `status` is still `"open"`. Fix by
setting `status` to `"closed"` (never delete the entry — readers can
still see it was a real opportunity). Also flags entries missing a
required field (title, organization, category, sourceUrl, status,
verifiedDate).

### 5. Guide content sanity
Every file in `src/content/guides/` must have frontmatter with
`title`, `description`, `category`, `date` and `updated`, be at least
500 words, and contain no `lorem ipsum`, `TODO` or `placeholder` text.

## When a check fails

| Failure | Fix |
|---|---|
| Live page not 200 | Check Vercel dashboard for a failed deploy; re-deploy from GitHub. If the page was renamed, update links and the sitemap. |
| Build fails | Read the build error, fix the file it names (usually a guide's frontmatter), rebuild. |
| Broken internal link | Fix the link in the source page/guide, rebuild. |
| Stale opportunity | Set `status: "closed"` in `src/data/opportunities.json`. |
| Thin/placeholder guide | Finish or remove the guide; never publish filler. |

## Weekly (in addition to the daily check)

- **Search Console:** confirm new guides are indexed; fix any crawl errors.
- **Opportunity verification:** re-check the official source of each
  open opportunity; update `verifiedDate` and deadlines.
- **PageSpeed:** run Google PageSpeed Insights on the homepage and
  the three most-visited guides; fix anything below 80 on mobile.
- **AdSense policy scan:** re-read new guides for any guaranteed-income
  wording, invented salaries or misleading claims and remove them.
- **Traffic:** check Vercel Analytics / Search Console for real
  visitors; never buy traffic or use bots.

## What this check does NOT do

- It does not deploy, publish, or edit content.
- It does not check external links (official portals change URLs;
  verify those by hand when a guide is updated).
- It does not submit anything to Google or AdSense.
