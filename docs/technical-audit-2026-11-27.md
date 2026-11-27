# Technical Audit — Rozgar Raasta Pakistan

**Date:** 27 November 2026
**Site:** https://rozgar-raasta-pakistan.vercel.app
**Repo:** https://github.com/notyhorahahu/rozgar-raasta-pakistan (local HEAD `4737885`)
**Auditor:** Phase 1 of the 14-phase upgrade directive. Audit only — no code was changed.
**Method:** source read (every page/component/data file), `npm run build`, `node scripts/daily-check.mjs`, live HTTP checks on all 28 routes, headless-Chrome interaction tests at 390px viewport (scrollWidth, search, CV builder, newsletter, mobile menu, save-job), built-HTML inspection, and a spot-check of one live Indeed listing.

---

## 0. Architecture (the fact that decides everything else)

**There is no database and no backend.** The site is a fully static Astro site:

- Content lives in two places only: `src/data/opportunities.json` (40 records) and `src/content/guides/` (32 Markdown files).
- `npm run build` compiles it to static HTML in `dist/` (61 pages, ~3.5 s, 0 errors).
- Vercel serves the static files (free Hobby). There is no server, no API, no database, no user accounts, no server-side form handling, and no authentication of any kind.
- The only "dynamic" behaviour is client-side JavaScript in the browser (search over a generated `search-index.json`, CV builder, newsletter and save-job both in `localStorage`, contact form via `mailto:`).

**Consequence for the upgrade:** a real admin panel (Phases 2–4) cannot be bolted onto this codebase as a frontend page. It requires adding a backend + database + server-side auth — a new subsystem, not a restyle. The existing `/admin` page is a read-only counts dashboard, not an admin panel (see §13).

---

## 0.1 Brand — Makaryo (live), do not touch

**Owner decision, 27 Nov 14:19 PKT:** *"Joo live haa na color wohi rahay gaa, color or theme koo nai touch b krna"* — keep the current live Makaryo design exactly. Do **not** change the colour or theme.

- Live brand: primary orange-red `#FF4C28` (`--color-brand-600`), cream `#FFF5F0`, sky `#85B6C9` / pink `#FCA6B3` panels, dark navy `#1E1D22` CTA, near-black `#101010` footer, Poppins. See `src/styles/global.css:5-24`.
- The "navy" tokens in the CSS are already remapped to the Makaryo near-black scale (`--color-navy-900: #111111`, `--color-navy-800: #1e1d22`) — they are **not** the directive's deep navy.
- **CONFLICT — the directive's Phase 11 palette is REJECTED by the owner and must not be applied:** Deep Navy `#071426`, Pakistan Green `#087A43`, Bright Green `#16A34A`, Soft Background `#F3F6FA`. Applying it would replace the live Makaryo orange/cream identity the owner just confirmed. Any Phase 11 work must keep the Makaryo tokens above. The Phase 11 "Premium SaaS dashboard" language for the *admin* interface is a separate question from the public site's brand — but no navy/green rebrand of the public site.

---

## 1. Homepage — INCOMPLETE (3 real problems, counts themselves are correct)

**Verdict on the "40 total / 36 open" question: the counts are CORRECT, not inconsistent.**
`src/data/opportunities.json` has 40 records: **36 open + 2 closed + 2 unverified** (counted directly from the file). The homepage shows "40 verified opportunities" and "36 currently open" — both numbers match the data. The directive's premise of a 40/36 inconsistency is wrong. However the *label* is wrong (see problem 3 below).

- Structure: cream hero (search + trust avatars + stat donut + "Now hiring" card), 5 category tiles, 7 job cards + orange CTA card, Free Courses, Scholarships, Freelancing/AI guides, Latest Articles (6), Popular Guides (4), trust band, "Sources we verify", dark CTA, newsletter, black footer. All render; homepage is 89 KB HTML, ~0.7 s live.
- **Problem A — duplicate articles in Latest Articles vs Popular Guides (CONFIRMED).** `src/pages/index.astro:27-28`: `latestArticles` = first 6 guides by `updated` date; `popular` = career/earning guides by the same date sort, with no exclusion. Two articles appear in **both** sections on the live homepage:
  - `ppsc-vs-fpsc-which-exam-to-prepare`
  - `how-to-get-a-remote-job-in-pakistan-without-experience`
- **Problem B — future-dated articles are live (CONFIRMED).** All 6 "Latest Articles" are dated **after today (27 Nov 2026)** and are already published, with their future dates visible on the cards ("28 Nov 2026", "29 Nov 2026", "30 Nov 2026", "1 Dec 2026" ×2, "2 Dec 2026", "3 Dec 2026" — read from `dist/index.html`). The 6 guides (28 Nov–3 Dec) were committed as files on 26 Nov; there is **no build-time or render-time date gate** anywhere (`src/pages/index.astro`, `src/pages/guides.astro`, `src/pages/guides/[slug].astro` and the RSS feed all list guides regardless of `date`). The future dates are also in the Article JSON-LD (`datePublished: 2026-12-03`) and in the sitemap. Note: `scripts/publish-daily.mjs:53` *does* gate new publishing (`date <= today`), but that only controls when a new guide body is written — it cannot un-publish files already committed.
- **Problem C — "40 verified opportunities" overstates verification (MISLEADING).** `src/pages/index.astro:54,329` and the trust slide say "40 verified opportunities", but 2 of the 40 have `status: 'unverified'` (see §3). The honest figure is 38 verified (or label it "40 opportunities"). The "36 currently open" figure is correct.
- Verification labels: the homepage itself does not mislabel individual jobs (it only shows open ones). The labelling problem lives on the cards/pages (see §3).

## 2. Navigation + mobile — WORKING

- Header (`src/components/Header.astro`): logo + brand, 5 main links, a "More" dropdown (14 links), "CV Builder" text link + orange "Find Jobs" button, search icon and hamburger on mobile. Mobile menu toggles and lists all 20 links + search (tested in headless Chrome at 390 px: menu opens, 20 links present).
- **No horizontal overflow:** measured `document.documentElement.scrollWidth === 390` at a 390 px viewport on home, opportunities, government jobs and a guide article (headless Chrome). The `min-w-0` + `grid-cols-1` fixes from the Makaryo redesign hold.
- Minor: "CV Builder" appears twice in the desktop header (main nav + right-side text link). The "More" dropdown is hover-driven, so it is awkward on touch — but the mobile menu covers the same links, so this is cosmetic.

## 3. Sections (Government / Private / Remote / Scholarships / Free Courses / Freelancing / AI Tools) — WORKING, with 2 labelling problems

- All section pages exist and return **200 live**: `/jobs/government`, `/jobs/private`, `/jobs/remote`, `/scholarships`, `/internships`, `/freelancing`, `/skills`, `/earning`, `/student-guides`, `/business-guides`, `/career-preparation`, `/ai-tools`, `/opportunities`, `/guides`. Each is a real `CategoryPage` with open listings, official-source links and related guides. All 28 site routes checked return 200 (see §8).
- Content is real: 40 opportunities (10 government, 13 private, 1 remote, 2 scholarship, 9 course, 1 ai-tools, 3 freelancing, 1 internship by category), 32 guides. No duplicates by title+organisation; every opportunity has a `sourceUrl`; no salary field exists anywhere (none invented — correct).
- Automatic expiry **does** exist in code: `effectiveStatus()` in `src/data/opportunities.ts` returns `closed` when `deadline` has passed, and 0 open records have a past deadline. The 2 closed records (FPSC CSS CE-2027, NAVTTC PMYSDP internships) are correctly closed.
- **Problem D — closed listings keep a live "Apply" button.** `src/components/OpportunityCard.astro:60-68` renders the "Apply job / View course / Apply now" link unconditionally. Closed listings sit in a collapsed `<details>` ("Closed / expired listings — shown for reference only", `src/components/CategoryPage.astro:71-79`), which is good labelling, but the button inside is still clickable and takes the visitor to the (now closed) application page. The directive's "disable its application button" is not implemented.
- **Problem E — contradictory "Verified" line on unverified cards.** The 2 `status: 'unverified'` records (HEC US–Pakistan Knowledge Corridor PhD Scholarship; NAVTTC PMYSDP skills programme — both `deadline: null`, `verifiedDate: 2026-11-26`) appear on their category pages inside the "Closed / expired listings" details (wrong bucket — they are not closed/expired, they are unverified) and their cards show **both** a red "· Unverified" label (`OpportunityCard.astro:58`) **and** the footer line "Verified 2026-11-26 · Source: hec.gov.pk" (`OpportunityCard.astro:70`). One card says unverified and verified at the same time. The same "Verified {date}" line is printed on every card regardless of status.

## 4. CV Builder — WORKING (basic), INCOMPLETE vs the directive

- `src/pages/cv-builder.astro`: form (name, title, phone, email, city, summary, 2 education, 2 experience, skills) → live preview updates on input (tested in headless Chrome: typing a name/title/skills updates `#p-name`, `#p-title`, `#p-skills`). "Download / Print as PDF" calls `window.print()` with a print stylesheet that shows only the preview — so **PDF export is the browser's Print → Save as PDF, not a generated PDF file**. The page says this honestly ("Use your browser's Print → Save as PDF").
- Missing vs Phase 6: only **one** template; no photo, projects, certifications, languages or references sections; only 2 education / 2 experience slots (fixed inputs, not addable rows); no Fresh Graduate mode; no data persistence (a reload wipes the form — nothing is saved to `localStorage`); no real PDF generation. It works as a basic tool; it is not a professional resume builder yet.

## 5. Search — WORKING (basic), INCOMPLETE vs Phase 5

- `src/pages/search.astro`: client-side search over a build-generated `search-index.json` (72 items: 40 opportunities + 32 guides), substring match on title+description+category+tags, results split into Opportunities and Guides, with a no-results state and popular-search chips. Simulating the exact JS filter against the real index gives "freelancing" → 14 hits (4 opps, 10 guides), matching the earlier Playwright check. Input is escaped before `innerHTML` (`esc()`), so the obvious XSS route is closed.
- Missing vs Phase 5: **no filters at all** — no city, province, education, department, job type, remote/on-site, experience, salary range or deadline filter; no sorting (Latest / Closing Soon); no "recently viewed" or "related jobs" (Related Articles exist on guide pages, but not related *jobs*). Save-job exists (bookmark toggle → `localStorage 'rrp-saved'`, tested: click writes the id and sets `aria-pressed="true"`), but there is no saved-jobs page to view them on.
- **Problem F — closed/unverified listings appear in search results.** `src/pages/search-index.json.ts` indexes **all** 40 opportunities with no status filter. Searching "CSS" returns the closed FPSC CSS CE-2027 exam as an opportunity with an "Apply on official site" button. Unverified records are likewise returned with no warning.

## 6. Newsletter — MISLEADING (works as designed, but the promise is false)

- `src/components/Footer.astro`: the form validates the email, then stores it in `localStorage` under `rrp-newsletter` (tested: submitting `audit-test@example.com` stored `["audit-test@example.com"]` and showed "Thank you! You are subscribed. We will email you once a week with verified opportunities.").
- **There is no backend, no mailing list and no email is ever sent.** The success message promises a weekly email that will never arrive. There is no subscriber list anywhere an admin could see — this is the "Manage Newsletter Subscribers" section the directive asks for, and it does not exist in any form. The form is honest about nothing being stored *on the server* only in the contact form; the newsletter copy does not carry that caveat.

## 7. Contact form — WORKING as designed, BROKEN in effect

- `src/pages/contact.astro`: validates name/email/message, then opens `mailto:hello@rozgar-raasta-pakistan.vercel.app?subject=…&body=…` in the visitor's own email client, and shows "Your email app should now open…". The page states "We do not store form submissions on our servers" — true.
- **The address is not a real mailbox.** `hello@rozgar-raasta-pakistan.vercel.app` is a placeholder; `vercel.app` is not a mail domain, so mail sent there bounces. The page simultaneously promises "We read every message and reply to genuine enquiries" — that cannot happen. The owner put the change to his real Gmail on hold (26 Nov, "abi nai"), so the fix is blocked on his decision, but as it stands the contact channel is dead. There is also no "Manage Contact Messages" store — messages are never recorded anywhere.

## 8. Footer + internal links — WORKING

- `node scripts/daily-check.mjs`: **35 passed, 0 failed** (5,311 internal links checked, 0 broken; 32 guides, all ≥500 words, no placeholders; 40 opportunities, none past deadline). `npm run build`: **61 pages, 0 errors, ~3.5 s**.
- Live route check (all 28 routes): every nav/footer/docs page returns **200**, and a nonsense URL correctly returns **404**. Footer links (Home, Opportunities, Government Jobs, Guides, CV Builder, Contact, Privacy, Terms, Disclaimer, Editorial/Corrections Policy, Advertise, Freelancing, Skills, Earning, AI Tools, Scholarships, Student Guides) all resolve. Facebook + Pinterest social links are real profile URLs.
- Sitemap, robots.txt, RSS and search-index all return 200 live (see §10).

## 9. Database / backend — MISSING (by design, not by accident)

- Confirmed: **no database, no backend, no API, no server-side code at all.** `src/data/opportunities.json` + `src/content/guides/*.md` are the entire data layer; `astro.config.mjs` has no server adapter (static output); there is no `vercel.json`, no serverless functions, no env-based DB connection anywhere in the repo.
- Any admin panel, user accounts, subscriber/message storage, scheduled publishing, or server-side auth requires adding a backend + database first. The honest Phase 2 starting point is therefore a backend choice (free tier), not a UI page.

## 10. SEO — WORKING, with 4 gaps

- **Working:** XML sitemap (61 URLs, excludes `/admin` via the sitemap filter; robots.txt disallows `/admin` and points to the sitemap); canonical URL on every page; unique titles + meta descriptions per page (via `BaseLayout`); OG + Twitter Card tags; Organization JSON-LD by default and Article JSON-LD on guide pages (headline, author, publisher, `datePublished`/`dateModified`); breadcrumbs (visual, on guide pages); heading hierarchy; all `<img>` have `alt` (decorative ones correctly `alt=""`); RSS feed; 404 page.
- **Gap 1 — homepage `<title>` is brand-only, no keyword.** Live: `<title>Rozgar Raasta Pakistan</title>` (`src/layouts/BaseLayout.astro:36`: the title is used as-is when it equals the site name). Every other page gets "Page | Rozgar Raasta Pakistan". The homepage — the most important page — targets no search keyword.
- **Gap 2 — no JobPosting structured data.** `grep` finds zero `JobPosting` JSON-LD anywhere in `src/` or `dist/`. Opportunities are rendered as cards, not as individual pages, so there is no per-job URL to attach it to. (If JobPosting schema is wanted, it needs per-job pages or a list-level implementation; do not fabricate it.)
- **Gap 3 — no BreadcrumbList JSON-LD.** Breadcrumbs render visually on guide pages but carry no schema.
- **Gap 4 — not indexed on Google.** As of 26 Nov, `site:rozgar-raasta-pakistan.vercel.app` returns nothing; Google Search Console is not set up and the sitemap has not been submitted (needs the owner's Google-account action). Until that happens Google sends zero traffic. Technical SEO is otherwise sound.

## 11. Performance — WORKING

- Build: 61 pages in ~3.5 s, 0 errors. Live homepage: **~0.66–0.77 s, 89 KB HTML** (3 runs). Total `dist/` is 4.7 MB.
- CSS is a single 34.6 KB file. Images total 1.7 MB in `public/images/` (largest 130 KB); hero uses `loading="eager"`, everything else `loading="lazy"` — correct. Poppins loads from Google Fonts (external, render-blocking, standard practice).
- No heavy client libraries. No measured Core Web Vitals yet (Speed Insights is not enabled — it needs `@vercel/speed-insights` code; Real Experience Score is a paid add-on). Nothing here is a performance emergency; the gaps are measurement, not speed.

## 12. Security — WORKING at the free-tier level, with 3 gaps

- **Vercel platform (checked 26 Nov):** Firewall (WAF) **Active**, "All systems normal" (224 requests/24 h, 0 denied); Deployment Protection **ON** (preview deployments require login); Build Logs / Source Protection and Git Fork Protection **Enabled**. Latest deploy `d95610c` Ready; 4 deploys on 26 Nov, 0 failed.
- **Headers (live, measured):** only `Strict-Transport-Security` is sent. **Missing: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.** There is no `vercel.json`, so no custom headers or redirects are configured at all. (Vercel Hobby has no WAF rule editor; Bot Protection and the OWASP ruleset are paid and not available.)
- **Authentication / admin:** there is **no login system and no server-side auth anywhere**. `/admin` is a public, unauthenticated static page (see §13). Anyone can open it. There is nothing to "break into" today (no data to steal — content is public), but the directive's Phase 4 must build auth from zero; nothing can be reused.
- **Secrets:** clean. No `.env` files in the repo, no hardcoded API keys/passwords/tokens in `src/`, `docs/` or `scripts/` (grep for key/password/secret/token assignments found nothing), and `.gitignore` covers `node_modules/`, `dist/`, `.env`. The GitHub PAT used for deploys is not in the repo (it lives outside it and expires 3 Dec 2026).
- **Client-side hygiene:** search and CV-builder outputs are HTML-escaped before insertion (`esc()` / `escapeHtml()`); external links use `rel="noopener noreferrer"`. No obvious XSS hole in the site's own code.

## 13. Existing admin page — INCOMPLETE (placeholder dashboard, not an admin panel)

- `src/pages/admin.astro` (71 lines) is a **public, unauthenticated, read-only counts page**: 4 stat cards (32 guides, 40 opportunity listings, 36 open, 4 closed), two breakdown lists (opportunities by category, guides by category), and two honest "not connected" panels (Traffic — "Google Analytics is not connected yet"; AdSense — "not applied"), plus a note explaining content lives in Markdown/JSON and Vercel rebuilds on commit. It is `noindex` + disallowed in robots.txt and excluded from the sitemap.
- It is explicitly **not** a functional admin: no login, no create/edit/delete, no user management, no subscriber/message store, no settings. Its own copy says so ("Analytics not yet connected; numbers shown are real content counts only"). There is no `/admin/login` and no `/admin/dashboard` route — both are 404 today (the directive's Phase 2 URLs do not exist).
- Note: the "Traffic — not connected" panel is now **out of date** — Vercel Web Analytics *was* enabled on 26 Nov (dashboard + `<Analytics/>` code, commit `bc68fd2`, verified live). The admin page still says it is not connected. Similarly the traffic numbers it withholds are now collectable. This is a stale-copy problem, not a functional one.

---

## Verdicts summary

| # | Area | Verdict | Evidence |
|---|------|---------|----------|
| 1 | Homepage | INCOMPLETE | Duplicate articles (§1A); 6 future-dated articles live (§1B); "40 verified" overstates by 2 (§1C) |
| 2 | Navigation + mobile | WORKING | 390 px scrollWidth = 390 on 4 pages; menu opens, 20 links |
| 3 | Job/scholarship/course sections | WORKING | All routes 200; real content; auto-expiry works; but closed cards keep live Apply buttons (§3D) and unverified cards carry contradictory labels (§3E) |
| 4 | CV Builder | WORKING (basic) | Form → live preview → browser-print PDF works; single template, no persistence, no real PDF gen |
| 5 | Search | WORKING (basic) | "freelancing" → 14 hits (4+10) verified; no filters/sorting; closed+unverified appear in results (§5F) |
| 6 | Newsletter | MISLEADING | localStorage only; success message promises weekly emails that are never sent |
| 7 | Contact form | BROKEN in effect | mailto to a non-existent mailbox; "we read every message" cannot be true |
| 8 | Footer + links | WORKING | Daily check 35/0; 28/28 routes 200; nonsense URL 404 |
| 9 | Database / backend | MISSING | Static site; no DB, no API, no server code |
| 10 | SEO | WORKING | Sitemap/robots/canonical/OG/Article JSON-LD all live; gaps: brand-only homepage title, no JobPosting, no BreadcrumbList, not indexed |
| 11 | Performance | WORKING | 89 KB homepage, ~0.7 s; 61 pages in ~3.5 s; images lazy-loaded |
| 12 | Security | WORKING (free tier) | WAF active, HSTS only; no CSP/X-Frame/Referrer headers; no auth exists |
| 13 | Admin page | INCOMPLETE | Public read-only counts page; no login, no CRUD, no `/admin/login` or `/admin/dashboard`; "Analytics not connected" copy is now stale |

---

## Top 10 problems (priority order)

1. **No backend / no database / no auth (BLOCKER for Phases 2–4).** Everything an admin panel needs — content CRUD, users, subscribers, messages, roles, audit logs, sessions — has no place to live. A backend + database must be chosen and added first; the current site cannot host a secure admin panel as-is. *Fix: pick a free-tier backend (e.g. a small server + free Postgres, or a BaaS with a free tier) and a session/auth design before writing any admin UI.*
2. **Future-dated articles already published (visible, live).** 6 guides dated 28 Nov–3 Dec 2026 are live on the homepage, in the sitemap, in RSS and in Article JSON-LD with future `datePublished`. *Fix: add a build-time gate — exclude guides with `date > today` (PKT) from collections/sitemap/RSS/search index — and stop committing future-dated guide files; the daily publisher already gates new writes, but it cannot retract committed files.*
3. **Contact email is a dead mailbox.** `mailto:hello@rozgar-raasta-pakistan.vercel.app` bounces; the page promises replies. *Fix: owner decision needed (his Gmail change is on hold since 26 Nov) — until then, say plainly on the page that messages go to the visitor's own email app and may not be monitored, or use a real monitored address / a free form service.*
4. **Newsletter promises emails it never sends.** Success copy says "We will email you once a week" but addresses only ever reach the visitor's own `localStorage`. *Fix: either connect a real (free) mailing list and say so, or change the copy to "saved on this device only — we cannot email you yet" until one exists. Do not keep the current promise.*
5. **Duplicate articles on the homepage.** "PPSC vs FPSC" and "Remote Jobs Without Experience" appear in both Latest Articles and Popular Guides. *Fix: exclude `latestArticles` slugs from `popular` (or drive Popular from the unused `featured` frontmatter field — 8 guides already have `featured: true` and nothing reads it).*
6. **"40 verified opportunities" overstates verification.** 2 of the 40 are `status: 'unverified'`. *Fix: count verified only (38), or relabel to "40 opportunities", and make the unverified records visually distinct everywhere (not just on their card).*
7. **Closed listings keep a working Apply button, and unverified ones sit in the "Closed / expired" bucket.** *Fix: in `OpportunityCard`, render a disabled "Closed" state (no link) when `effectiveStatus !== 'open'`; separate unverified records into their own section with their own label; drop the "Verified {date}" footer line from any card whose status is not verified (use "Last checked {date}" instead).*
8. **No security headers.** Only HSTS is sent; no CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy or Permissions-Policy. *Fix: add a `vercel.json` with headers (and the redirect map Phase 8 asks for). This is free on Hobby.*
9. **Homepage `<title>` is brand-only, no keyword.** Live: `<title>Rozgar Raasta Pakistan</title>`. *Fix: give the homepage a keyword title (e.g. "Jobs in Pakistan — Government & Private Jobs, Scholarships, Free Courses | Rozgar Raasta Pakistan").*
10. **Search has no filters and returns closed/unverified listings.** *Fix: filter `search-index.json` to open + verified records only (or mark closed/unverified in results), then add the Phase 5 filters (city, type, deadline, sorting) once a backend or a richer static index exists.*

### Honourable mentions (real, lower priority)
- CV Builder is one template with no persistence and print-only PDF (Phase 6 work, not a bug).
- No JobPosting or BreadcrumbList JSON-LD (Phase 8; needs per-job pages or a list-level design — do not fabricate).
- `featured: true` exists on 8 guides and nothing reads it (dead config; either use it for Popular Guides or remove it).
- The "More" nav dropdown is hover-driven (touch-awkward; mobile menu covers it).
- Admin page copy is stale ("Analytics not connected" — Web Analytics was enabled 26 Nov).
- Speed Insights is not enabled (needs `@vercel/speed-insights` code; Real Experience Score is paid).
- The site is not on Google yet (Search Console + sitemap submission need the owner's Google-account action).

---

## What the directive gets wrong (so Phase 2+ does not build on a false premise)

- **"40 total vs 36 open inconsistency" — there is none.** 40 = 36 open + 2 closed + 2 unverified. Do not "fix" the counts; fix the *label* ("40 verified" → 38 verified or "40 opportunities").
- **Phase 11 navy/green palette is rejected by the owner** (see §0.1). Keep the Makaryo orange/cream tokens. Any admin UI should be professional and distinct, but the public site's brand is frozen.
- **"Database and backend architecture" (Phase 1 §17) assumes one exists — it does not.** Phase 2's 20 admin sections each imply storage; the first design decision is the backend, not the dashboard layout.
- **"Resolve the inconsistency… / Do not publish future-dated articles"** are real issues, but the future-dating is a *build* problem (no date gate), not a *publishing-schedule* problem — the daily publisher already gates new writes.
- **"Test valid login / lockout / 2FA" (Phase 13) cannot be tested** until an auth system exists; today there is no login at all.

---

## Files changed by this audit

- `docs/technical-audit-2026-11-27.md` (this file) — committed locally, not pushed.
- No source code was changed. No deployment was made.
