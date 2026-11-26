# AdSense Readiness Audit — Rozgar Raasta Pakistan

**Date:** 26 November 2026 (re-verified against the live site)
**Live URL:** https://rozgar-raasta-pakistan.vercel.app
**Status:** NOT APPLIED.

## Verdict: NO-GO — do not apply yet

Be blunt: **the site is content-ready but NOT application-ready.**
It went live on 26 November 2026 — today — with **zero days of age
and zero traffic history**. AdSense routinely rejects brand-new sites
with no established readership, even when the content is good. Applying
now would most likely waste the application and risk a rejection that
has to be explained on the next attempt.

**Apply only after ALL of these are true:**
1. The site has been live and publishing daily for **at least 4–6 weeks**.
2. Google Search Console shows real indexed pages and real search
   impressions/clicks (not zero).
3. There is genuine organic traffic (even modest — tens of visitors a
   day from search and social is a real signal; zero is not).
4. The contact email is a real monitored mailbox (see gap 6 below).

## What AdSense requires (official)

Based on Google AdSense programme policies and the AdSense help pages:
- Original, useful content with clear navigation.
- Working About, Contact, Privacy Policy and Terms pages.
- Mobile-friendly, fast-loading pages.
- No copied content, no misleading earning promises, no deceptive ad placement.
- The site must be complete before applying.

## Audit checklist (verified 26 Nov 2026)

| Requirement | Status | Evidence / note |
|---|---|---|
| Original, useful content | ✅ PASS | 32 original guides (see `src/content/guides/`), 1,000–1,900 words each, FAQs, steps, official source links. No copied content. |
| Clear navigation | ✅ PASS | Header nav + mobile menu + footer nav covering all 23 pages. Verified live. |
| About Us page | ✅ PASS | `/about` — who we are, what we do and do not do, verification method, funding. Live, HTTP 200. |
| Contact Us page | ✅ PASS | `/contact` — validated form opening a mailto draft, no data stored on servers. Live, HTTP 200. |
| Privacy Policy | ✅ PASS | `/privacy` — what we collect, what we never collect, cookies, advertising, rights. Live, HTTP 200. |
| Terms & Conditions | ✅ PASS | `/terms` — acceptance, accuracy, no guarantee, acceptable use, liability. Live, HTTP 200. |
| Disclaimer | ✅ PASS | `/disclaimer` — general information only, no guarantee, scam warning. Live, HTTP 200. |
| Editorial transparency | ✅ PASS | `/editorial-policy` + `/corrections-policy` — sources, verification, corrections process. Live, HTTP 200. |
| Mobile usability | ✅ PASS | Responsive layouts; no fixed-width overflow in CSS; tables scroll horizontally; verified at 360/390/768/1024/1440. |
| Performance | ✅ PASS | Static Astro site; homepage 94 KB, 1.4 s load, 36 KB CSS, minimal JS, system fonts, SVG graphics only. Run Google PageSpeed Insights on the live URL to confirm the score. |
| No copied content | ✅ PASS | All guides original; opportunities link to official sources, not copied listings. |
| No misleading earning promises | ✅ PASS | Re-scanned all 32 guides + all pages 26 Nov: every earning mention is paired with a "not guaranteed" disclaimer (14 such disclaimers). No "earn lots of money", no guaranteed-income claims, no invented salaries. |
| No deceptive ad placement | ✅ PASS | No ads yet. When ads are added, keep them separate from navigation and content. |
| Sitemap + robots.txt | ✅ PASS | `/sitemap-index.xml` lists 60 URLs (all pages + guides); `/robots.txt` allows `/`, disallows `/admin`, points to the sitemap. Both live, HTTP 200. |
| RSS feed | ✅ PASS | `/rss.xml` live, HTTP 200, valid. |
| HTTPS | ✅ PASS | Live on Vercel with HTTPS; homepage, guides, sitemap, robots, RSS all HTTP 200. |
| SEO basics | ✅ PASS | Every page has a unique title + meta description + canonical URL; Open Graph + JSON-LD (Organization, WebSite, Article) present. |
| Site age / traffic | ❌ FAIL | Live since 26 Nov 2026 (0 days). No traffic history, no Search Console data. **This is the main blocker.** |
| Search Console | ❌ NOT DONE | Property not created, sitemap not submitted, no pages confirmed indexed. Owner must do this from their Google account. |
| Contact email is real | ⚠️ MINOR GAP | Contact form uses `mailto:hello@rozgar-raasta-pakistan.vercel.app`, which is not a real monitored mailbox (vercel.app is not a mail domain). Messages sent there will bounce. Replace with a real monitored email before applying. (Owner put this change on hold 26 Nov 21:35 — do not change until he says so.) |
| AdSense account + code | ❌ NOT DONE | No AdSense account created, no ad code added. Deliberate — apply only when ready and the owner authorises it. |

## Gaps to close before applying (in order)

1. **Publish daily for 4–6 weeks.** One new honest guide per day; keep
   the opportunities list fresh (close expired ones, verify open ones).
   The daily check (`node scripts/daily-check.mjs`) catches stale data.
2. **Set up Google Search Console** (owner, from their Google account):
   add the property for `https://rozgar-raasta-pakistan.vercel.app`,
   verify ownership (DNS or HTML file), submit
   `https://rozgar-raasta-pakistan.vercel.app/sitemap-index.xml`, and
   confirm the main pages get indexed.
3. **Run Google PageSpeed Insights** on the live homepage and the
   three most-visited guides; fix anything below 80 on mobile.
4. **Build real traffic.** Share new guides on the Facebook page and
   Pinterest boards; answer real questions on Reddit/Quora with a link
   only where it genuinely helps. Never buy traffic, never use bots.
5. **Replace the contact email** with a real monitored mailbox and
   confirm a test message arrives.
6. **Re-run this audit** after 4–6 weeks. Only apply when every row
   above is ✅ PASS (or the minor gap is closed) and Search Console
   shows real impressions.

## How to apply (when the verdict turns GO)

Only the owner applies, from their own Google account. Steps:
1. Go to https://adsense.google.com and sign in with the owner's
   Google account.
2. Click "Get started", enter the site URL
   `https://rozgar-raasta-pakistan.vercel.app`, choose the account
   country (Pakistan), accept the Terms.
3. Enter the payment name/address exactly as on the owner's ID/bank.
4. Google gives an AdSense code snippet — add it to the site exactly
   as provided (the `<head>` of every page, via the base layout).
   Do not modify the code.
5. Click "Submit for review" in AdSense. Review typically takes a few
   days to a few weeks. Do not re-submit repeatedly.
6. If approved: configure ad placements that do not interfere with
   navigation or content; track impressions, CTR, RPM and earnings in
   the admin dashboard; monitor invalid traffic.
7. If rejected: read Google's exact reason, fix that specific issue,
   wait, and re-apply once. Do not apply again the same day.

## After approval (only)

- Add the official AdSense code exactly as Google provides it.
- Configure ad placements that do not interfere with navigation and content.
- Track impressions, CTR, RPM and earnings in the admin dashboard (currently shows honest "not connected" states).
- Monitor invalid traffic and never click your own ads.

## Absolutely forbidden

- Clicking our own ads.
- Asking users to click ads.
- Paying for ad clicks.
- Bots, click farms or purchased traffic.
- Misleading download buttons or accidental-click layouts.
- Fake page views.

Website link clicks and AdSense ad clicks are different events — never confuse them.
