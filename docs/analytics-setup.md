# Analytics Setup — Rozgar Raasta Pakistan

**Status:** NOT connected. No analytics IDs exist and none have been invented. This document describes exactly what to do when the owner is ready.

## Google Analytics 4 (GA4)

1. Go to https://analytics.google.com/ and sign in with the owner's Google account.
2. Create a property named "Rozgar Raasta Pakistan".
3. Choose "Web" as the platform and enter the live URL `https://rozgarraasta.pages.dev`.
4. Copy the Measurement ID (it looks like `G-XXXXXXXXXX`).
5. Add it to the site configuration (create `src/data/analytics.ts` with the ID, or set it as a Cloudflare Pages environment variable `PUBLIC_GA_MEASUREMENT_ID`) and include the GA4 snippet in `src/layouts/BaseLayout.astro` inside `<head>`.
6. Verify in GA4 Realtime that a visit to the live site is recorded.

**Do not invent a Measurement ID.** Until a real one is added, the admin dashboard honestly shows "Traffic — not connected".

## Google Search Console

1. Go to https://search.google.com/search-console and sign in with the owner's Google account.
2. Add the property `https://rozgarraasta.pages.dev` (URL prefix).
3. Verify ownership using the HTML-tag method (add the verification meta tag to `BaseLayout.astro`) or the DNS method.
4. Submit the sitemap: `https://rozgarraasta.pages.dev/sitemap-index.xml`.
5. Request indexing for the homepage and the main category pages.
6. Monitor Search impressions, clicks, and any coverage issues weekly.

## What we track (once connected)

- Daily visitors, unique visitors, page views.
- Traffic sources (Google Search, Facebook, Pinterest, Reddit, Quora, direct).
- Top articles and top landing pages.
- Search impressions and clicks (Search Console).
- Social referrals.
- Returning visitors and engagement.
- AdSense revenue (only after approval — never before).

## What we never do

- Never fabricate traffic or earnings numbers.
- Never buy traffic or use bots.
- The admin dashboard shows real content counts and honest "not connected" states for anything not yet wired up.
