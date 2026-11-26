# AdSense Readiness Audit — Rozgar Raasta Pakistan

**Date:** 26 November 2026
**Status:** NOT APPLIED. This is a readiness audit only — do not apply until the gaps below are closed and the site has been live with real traffic for a reasonable period.

## What AdSense requires (official)

Based on Google AdSense programme policies and the AdSense help pages:
- Original, useful content with clear navigation.
- Working About, Contact, Privacy Policy and Terms pages.
- Mobile-friendly, fast-loading pages.
- No copied content, no misleading earning promises, no deceptive ad placement.
- The site must be complete before applying.

## Audit checklist

| Requirement | Status | Evidence / note |
|---|---|---|
| Original, useful content | ✅ PASS | 25 original guides (see `src/content/guides/`), each with FAQs, steps and official source links. No copied content. |
| Clear navigation | ✅ PASS | Header nav + mobile menu + footer nav covering all 23 pages. |
| About Us page | ✅ PASS | `/about` — who we are, what we do and do not do, verification method, funding. |
| Contact Us page | ✅ PASS | `/contact` — working mailto form with validation, no data stored on servers. |
| Privacy Policy | ✅ PASS | `/privacy` — what we collect, what we never collect, cookies, advertising, rights. |
| Terms & Conditions | ✅ PASS | `/terms` — acceptance, accuracy, no guarantee, acceptable use, liability. |
| Disclaimer | ✅ PASS | `/disclaimer` — general information only, no guarantee, scam warning. |
| Editorial transparency | ✅ PASS | `/editorial-policy` + `/corrections-policy` — sources, verification, corrections process. |
| Mobile usability | ✅ PASS | Responsive layouts; verified at 360/390/768/1024/1440 (see test notes in `docs/deployment.md`). |
| Performance | ✅ PASS | Static Astro site, no heavy JS, system fonts, SVG graphics only. PageSpeed check still to be run on the live URL. |
| No copied content | ✅ PASS | All guides original; opportunities link to official sources, not copied listings. |
| No misleading earning promises | ✅ PASS | Every earning/freelancing guide states income is not guaranteed; no "guaranteed" claims anywhere. |
| No deceptive ad placement | ✅ PASS | No ads yet. When ads are added, they will be kept separate from navigation and content. |
| Sitemap + robots.txt | ✅ PASS | `/sitemap-index.xml` (auto-generated) and `/robots.txt` present. |
| HTTPS | ⏳ PENDING DEPLOY | Cloudflare Pages provides HTTPS automatically on `*.pages.dev`. Verify after deploy. |
| Real traffic / site age | ⏳ PENDING | AdSense favours established sites. Do not apply on day one — let the site run, publish regularly, and build genuine traffic first. |
| AdSense account + code | ❌ NOT DONE | No AdSense account created, no ad code added. This is deliberate — apply only when the site is ready and the owner authorises it. |

## Gaps to close before applying

1. **Deploy the site** and confirm HTTPS, sitemap and robots.txt on the live URL.
2. **Run Google PageSpeed Insights** on the live homepage and fix any issues.
3. **Submit the site to Google Search Console** and confirm indexing of the main pages.
4. **Publish regularly** for several weeks so the site shows genuine activity and real traffic.
5. **Owner authorisation** — the AdSense application must be submitted by the owner from their own Google account.

## After approval (only)

- Add the official AdSense code exactly as Google provides it.
- Configure ad placements that do not interfere with navigation or content.
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
