# Phase 1 Audit Checklist — Internships for Fresh (Rozgar Raasta Pakistan)

> **Historical record (27 Nov 2026).** The admin role hierarchy described
> in this checklist (`super_admin`, `content_manager`, `editor`, `viewer`,
> `EDITOR_ROLES` / `DELETE_ROLES`) was **removed on 27 Nov 2026** (owner
> order: one admin only; migration 003, `db/migrations/003-single-admin.sql`).
> There is now exactly one admin (`admin`); `public_user` is not an admin.
> This file is kept as evidence of what the audit found at the time — do
> not treat its role descriptions as the current system. See
> `docs/admin-setup.md` §8 for the current state.

- Date: 2026-11-27. Auditor: Phase 1 coordinator + 3 read-only inspection workers.
- Scope: entire repo at HEAD `f43ad6d` (admin/public separation) + live site.
- Method: read the actual code (no guessing), ran the build + daily-check, probed the live site with curl. Production Neon NOT touched; no source file modified by this audit.
- Brand: Makaryo design is approved live — orange-red `#FF4C28`, cream `#FFF5F0`. Do NOT change colors/theme.
- Conventions: `[x]` = verified working. `[ ]` = fix/build item. `P#` = mission phase that owns it.

## 0. Test evidence (this audit's own runs, 27 Nov 2026)

- [x] `npm run build` — 0 errors, server built in 7.80s, sitemap-index.xml created.
- [x] `node scripts/daily-check.mjs` — **35 passed, 0 failed**.
- [x] Live status codes (curl, no auth): `/` 200, `/opportunities` 200, `/internships` 200, `/guides` 200, `/guides/how-to-earn-from-youtube-in-pakistan` 200, `/guides/how-to-get-a-remote-job-in-pakistan-without-experience` **404** (expected — 28 Nov guide, PKT date gate), `/search` 200, `/cv-builder` 200, `/jobs/government` 200, `/scholarships` 200, `/ai-tools` 200, `/about` 200, `/contact` 200, `/privacy` 200, `/terms` 200, `/sitemap-index.xml` 200 (53 URLs in sitemap-0.xml, 0 admin URLs), `/robots.txt` 200 (`Disallow: /admin`), `/rss.xml` 200, `/search-index.json` 200, `/404-test-page` 404.
- [x] Live auth guards: `/admin` → 302 `/admin/login`, `/admin/dashboard` → 302, `/admin/jobs` → 302; `POST /api/admin/jobs` unauth → 401; `POST /api/admin/login` with `{}` → 403 (CSRF fires before body validation); `GET /api/admin/me` unauth → 401.
- [x] Live security headers on `/`: CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`, **HSTS `max-age=63072000; includeSubDomains; preload` (served by Vercel platform, NOT in vercel.json)**.
- [x] Live `/admin/setup` returns **"Admin setup is complete"** — a Super Admin already exists, so the claim window is closed. The setup page + endpoint are still present and must be removed (see §4).
- [x] Live homepage shows "40 opportunities". Cache headers: images + pages served `Cache-Control: public, max-age=0, must-revalidate` (no long-term immutable caching).
- [x] No test suite exists in the repo: zero `*.test.*` files, no test directory, no `test` npm script.
- [ ] NOT verified by this audit: live DB state (Neon migration 002 + seed were running via a separate browser task at audit time), live session/CSRF round-trip with a real login, actual WCAG contrast ratios (hex-based estimates only), external source-URL liveness.

## 1. Frontend & design system

- [x] Routes: 15 server-rendered public pages (`prerender=false`, DB-first with static fallback) + static pages (search, cv-builder, about, contact, policies). All public internal hrefs resolve; no dead internal link found in code.
- [x] Makaryo tokens in `src/styles/global.css:3-27` (Tailwind v4 `@theme`): brand-600 `#FF4C28`, cream `#FFF5F0`, ink `#111111`, Poppins only. Card/button patterns consistent (`OpportunityCard.astro:37`, `ArticleCard.astro:16`).
- [x] Empty states exist on all listing pages; 404 page exists with 4 links; closed/unverified listings behind `<details>`.
- [ ] Fix one-off arbitrary values alongside tokens: `bg-[#101010]`, `text-[#9a9a9a]` (`Footer.astro:52`), share-button brand hexes (`guides/[slug].astro:168-170`), `text-[44px]/lg:text-[64px]` hero (`index.astro:105`), `bg-slate-200` closed state (`OpportunityCard.astro:73`). Consolidate into tokens. — P2
- [ ] Fix `global.css:43-45` `a { @apply text-brand-600; }` — every bare link is orange, incl. prose links (contrast ~3.3:1, fails WCAG AA normal text). Scope link color to nav/buttons. — P2
- [ ] Fix keyboard focus invisible outside inputs: no `focus-visible` anywhere; nav links, `More` button, mobile-menu button, footer links have no focus style. — P2
- [ ] Fix `More` dropdown hover/focus-only (`Header.astro:57,61`): no `aria-expanded`, no click/keyboard toggle — touch users cannot reliably open it. Add click toggle + `aria-expanded`. — P2
- [ ] Add skip-to-content link (0 hits for `skip` in layouts/components/pages). — P2
- [ ] Fix `ArticleCard.astro:17-31` triple link to the same URL (image + title + "Read guide") — redundant tab stops. — P2
- [ ] Fix trust carousel `index.astro:328,378-384`: `role="tablist"` without `role="tab"`/`aria-selected`, auto-rotates every 6s with no pause control. — P2
- [ ] Fix touch targets <44px: save-bookmark `p-1` + 20px icon (`OpportunityCard.astro:40,46`, ~28px), header icon buttons (~36-40px), trust dots. — P2
- [ ] Fix hero image on only 6/11 category pages (`CategoryPage.astro` heroImage prop missing for government/private/remote/internships). — P2/P3
- [ ] Add loading states: no spinner/skeleton anywhere (grep 0); server pages render only after DB fetch. Add skeletons for listings/search. — P2
- [ ] Add `src/pages/500.astro` (does not exist). — P2
- [ ] Fix contrast: white on `bg-brand-600` (~3.3:1) for normal text; footer `text-[#9a9a9a]` on `bg-[#101010]`; `text-white/70` on dark CTA. Verify with measured ratios, fix failing pairs. — P2
- [ ] Fix desktop nav: no search link on desktop (search icon only `lg:hidden`, `Header.astro:71-74`). — P2/P13
- [ ] Fix footer Pinterest handle `calchub_/` (`Footer.astro:62`) vs Rozgar brand — inconsistent branding. — P2

## 2. Backend & APIs

- [x] Stack: Astro 7.4.13 + `@astrojs/vercel` 11, Tailwind v4, `pg` 8, `bcryptjs` 3, `marked` 18, `@vercel/analytics` 2. Node ≥22.23.4. No explicit `output` in `astro.config.mjs` (static default; server pages via `prerender=false`).
- [x] All SQL in `src/lib` + `src/pages/api` is parameterised (`$1…$n`); zero user-input string concatenation. Only static-constant interpolations (`content.ts:178,195` column lists; admin list pages build `where` from fixed fragments + placeholders).
- [x] All 9 mutating admin API routes enforce `requireAdmin` + `verifyCsrf` (login/logout/setup enforce CSRF; login/setup exempt from requireAdmin by design). All 7 admin pages call `getAdminUser` server-side and 302 to `/admin/login` when null; all `prerender=false`.
- [x] Error handling: `toHttpErrorResponse` (`auth.ts:292-296`) returns generic 500, no stack traces/DB errors/paths in responses.
- [x] Input validation: `parseJobInput`/`parseGuideInput` (`admin-content.ts:120-224`) enforce required fields, enums, slug regex, `source_url` http/https, strict `YYYY-MM-DD` dates, slug uniqueness.
- [ ] Add max-length validation on ALL API fields — none exists (title, description, body, tags, author, SEO fields, image, source_domain; slug length capped only in client-side `slugify`, 100 chars). — P9
- [ ] Add rate limiting to CRUD APIs — only login/setup have per-email lockout; jobs/guides endpoints rely on auth + CSRF only. — P9
- [ ] Fix guide `image` field: free string, no URL/path validation; rendered as `<img src={image}>` (`guides/[slug].astro:118`) and concatenated into JSON-LD (`:66`). Validate as relative path or https URL. — P9
- [ ] Fix `jobs/[id].astro:18`, `guides/[id].astro:18`: row SELECT runs before the `canEdit` check (not a leak — viewers can list the same data — but reorder for hygiene). — P9
- [ ] Fix `src/lib/db.ts:24`: SSL `rejectUnauthorized: false` for all non-local hosts (Neon) — MITM risk to DB connection. Investigate Neon CA / `sslmode` alternative. — P9
- [ ] Fix `getClientIp` (`auth.ts:304-308`) trusts first `x-forwarded-for` entry (spoofable; currently audit-log only, low impact). — P9
- [ ] Add pagination to admin list pages + public listing pages (none exists; full lists rendered). — P11/P14
- [ ] Add response caching for DB-backed public pages (currently every request hits Neon; `Cache-Control: max-age=0`). — P14

## 3. Database & content

- [x] Schema 001 (93 lines): users, sessions, audit_logs, login_attempts; role CHECK incl. `public_user`; unique index on `lower(email)`; `set_updated_at()` trigger. 002 (134 lines): opportunities (28 cols), guides (18 cols); CHECKs on job_type/category/type/status/verification_status; unique `(title, company)`; slug UNIQUE. Both idempotent (`IF NOT EXISTS`).
- [x] Content: 40 opportunities (36 open, 2 closed, 2 unverified; categories private 13, government 10, course 9, freelancing 3, scholarship 2, remote 1, internship 1, ai-tools 1; types job 22, course 10, internship 3, guide 3, scholarship 2). 32 guides (26 published, 6 future-dated 28 Nov–3 Dec; categories career 11, freelancing 6, student 6, skills 3, earning 3, business 2, ai-tools 1; featured 8; with image 10).
- [x] No duplicate (title, organization). All 32 guides have frontmatter + 500+ words (973–1,246).
- [x] Seed `db/seed-2026-11-27.sql` (3,820 lines, 40 + 32 INSERTs, all `ON CONFLICT DO NOTHING`) — re-run is insert-safe.
- [ ] Fix salary data gap: **0/40 opportunities have a salary/stipend field** (no `salary` key in JSON; DB column always NULL). Pay info only as free text inside `eligibility` in 20/40. Discovery must extract stipend + payment frequency per listing. — P4/P6
- [ ] Fix deadline gap: **26/40 (65%) deadlines null** — they stay `open` forever (`isExpired` false with no deadline, `opportunities.ts:60-63`). Add re-verification cadence + stale-listing archival. — P6/P12
- [ ] Fix source-URL quality: **25/40 are bare homepages** (path `/` only — njp.gov.pk ×4, jobs.gov.pk ×3, digiskills.pk ×3, etc.); only 15/40 are deep links (13 Indeed `viewjob?jk=`, 1 HEC, 1 LinkedIn). Replace homepage links with the actual listing/ad page where one exists. — P5/P6
- [ ] **Remove the LinkedIn source URL**: one opportunity's `sourceUrl` is `linkedin.com/jobs/` — mission excludes LinkedIn completely. Also remove LinkedIn mentions from guide body text where it is presented as a source. — P5
- [ ] Fix seed re-run is NOT update-safe: `ON CONFLICT DO NOTHING` never updates existing rows — a corrected deadline/status/title in JSON will not reach the DB. Add an update path (or `DO UPDATE`) for the seed. — P6
- [ ] Fix file-vs-DB divergence: the 6 future-dated guides are baked `published=false` in the seed and never flip on re-run, while the file-based site flips automatically via the PKT date gate. Add a publish-date job or a `published` recompute. — P6
- [ ] Fix `docs/deployment.md:36` stale ("no env vars") — contradicts live `DATABASE_URL`. Correct the doc. — P1
- [ ] Fix verification freshness: all 40 `verifiedDate` = 2026-11-26 (single-day bulk verification). Re-verify on a rolling schedule; record `last_verified` per listing. — P6/P12
- [ ] Fix `fees` templating: 13/40 identical Indeed fee text, 4/40 identical NJP disclaimer — replace with per-listing facts or drop. — P6

## 4. Auth & security

- [x] Passwords bcrypt cost 12, min length 8 (`auth.ts:33-34,64`). Sessions: `randomBytes(32)` token, only SHA-256 hash stored, httpOnly + Secure (prod) + SameSite=Lax cookie, 7-day expiry enforced server-side, logout deletes session row.
- [x] CSRF double-submit cookie (`rrp_admin_csrf` + `x-csrf-token`, `timingSafeEqual`, `auth.ts:94-121`), enforced on every state-changing route.
- [x] Login lockout 5 fails / 15 min / 15-min lockout, identical behaviour for known + unknown emails (anti-enumeration, `auth.ts:207-301`); generic "Invalid email or password".
- [x] RBAC: `EDITOR_ROLES` (super_admin, content_manager, editor) create/edit/publish; `DELETE_ROLES` (super_admin, content_manager) delete; Viewer read-only (403 on mutations, read-only banner). Audit logs on logins/logouts/failures/lockouts + all CRUD mutations.
- [x] No real secrets in repo (grep: only `<redacted>` placeholders; `DATABASE_URL`/`ADMIN_PASSWORD` env-only; `.env` gitignored/untracked).
- [x] Security headers live (see §0). CSP present with `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self' mailto:`.
- [ ] **REMOVE `/admin/setup` page + `POST /api/admin/setup` now** — live check proves a Super Admin exists ("Admin setup is complete"). The endpoint is coded safely (403 once a super_admin exists, atomic `INSERT…WHERE NOT EXISTS`, rate-limited), but leaving a public account-creation route live is unnecessary risk. — P9 (do first)
- [ ] **FIX XSS — Markdown sanitiser is regex, not a real sanitiser** (`src/lib/content.ts:306-314` strips script/iframe/on*/javascript: by regex, injected via `set:html`, `guides/[slug].astro:126`). Regex misses `xlink:href="javascript:…"`, `formaction`, `data:text/html` hrefs, `<svg>/<math>` nested vectors, entity-encoded schemes. Replace with `sanitize-html` or DOMPurify (server-side). Threat needs an editor account, but an editor compromise then XSSes every visitor + admin. — P9 (critical)
- [ ] **FIX XSS — JSON-LD `</script>` breakout** (`BaseLayout.astro:75` `set:html={JSON.stringify(jsonLd)}`): a guide title/description containing `</script><script>…</script>` breaks out of the JSON-LD block. Escape `</script>` (and `<`, `>`, `&`) in the serialised JSON. — P9 (critical)
- [ ] Add MFA for admins (TOTP) — none exists. — P9
- [ ] Add password-reset flow + change-password UI/API — none exists (grep `mfa|totp|otp|password reset|forgot password|email verif` finds only unrelated guide text). — P8/P9
- [ ] Add email verification for candidate accounts — none exists (no candidate accounts at all, see §8). — P8
- [ ] Add user-management UI/API — none exists; extra accounts only via one-time setup or `scripts/create-admin.mjs`; roles cannot be changed in the panel. — P11
- [ ] Fix `super_admin` vs `content_manager` distinction is cosmetic — no route restricts to `super_admin` alone (except setup). Define real super-admin-only capabilities (user management, settings, backups). — P9/P11
- [ ] Fix session rotation: no rotation on login (old sessions stay valid); no idle timeout (fixed 7 days); no IP/user-agent binding (stored but never checked, `auth.ts:124-141`); no `__Host-` cookie prefix. — P9
- [ ] Fix known-user lockout counter has no sliding-window reset (`login.ts:99-107`): after lockout expires the counter stays at 5, so the next single failure re-locks for 15 min. Mirror the unknown-email window reset (`auth.ts:218-228`). — P9
- [ ] Fix CSRF token not bound to session, never rotated (not on login), 7-day life; `getOrSetCsrfToken` (`auth.ts:96-105`) accepts any pre-existing cookie value matching `/^[A-Za-z0-9_-]{32,}$/` (cookie-fixation vector via subdomain). Bind to session + rotate on login. — P9
- [ ] Harden CSP: `'unsafe-inline'` allowed for scripts AND styles (`vercel.json`) — weakens CSP. Move inline scripts to external files / nonces where feasible. Add explicit `object-src 'none'`. Add HSTS explicitly to `vercel.json` (currently only Vercel platform default). — P9
- [ ] Add file-upload security policy before any upload ships (type/size validation, malware scan where supported) — no upload capability exists yet, so this is a build-time requirement, not a fix. — P7/P8/P9
- [ ] Add dependency vulnerability scanning (no audit run in this audit; no CI). Run `npm audit` + add to a recurring check. — P9/P14
- [ ] Add backup/recovery procedure for Neon (none documented; no backup UI). — P9/P11
- [ ] Add per-IP rate limiting (login lockout is per-email only; distributed brute-force across many emails is not throttled). — P9

## 5. Admin panel

- [x] REAL (9 of 20 sidebar sections, `AdminLayout.astro:24-44`): Dashboard Overview (live DB counts + last-10 audit log), Manage Government/Private/Remote Jobs, Scholarships, Free Courses, Internships (all filtered views of the same real jobs CRUD), Manage Articles (real guides CRUD), Manage AI Tools. Jobs CRUD: list/search/filter/counts, create/edit/delete/publish; guides CRUD same + slug validation + plain-Markdown textarea (no fake rich-text editor).
- [x] Admin/public separation verified: no admin links on public site, no public links in admin (removed 27 Nov, commits `0e2f622` + `f43ad6d`); admin only reachable by typing `/admin/login`; `/admin` disallowed in robots, absent from sitemap.
- [ ] Build the 11 placeholder sections (all "Coming soon", no link): Manage Categories, Manage CV Builder Templates, Manage Newsletter Subscribers, Manage Contact Messages, Manage Users, SEO Management, Website Settings, Analytics, Security Logs, Admin Profile, Backup and Recovery. — P11 (each maps to mission §11; see §8)
- [ ] Dashboard audit-log table is real but read-only; no dedicated Security Logs page (see above). — P11
- [ ] Admin has no bulk operations (bulk publish/unpublish/delete, bulk verify) — needed for daily discovery volume. — P6/P11

## 6. Hosting / deploy / automation

- [x] Vercel free Hobby, scope arslanahmad23464-6618, GitHub App on `notyhorahahu/rozgar-raasta-pakistan`, push-to-main auto-deploys. `DATABASE_URL` set as Secret (Production + Preview + Development). Web Analytics enabled (verified live; real traffic 0).
- [x] `vercel.json` (29 lines): headers only. No rewrites/redirects.
- [x] Scripts exist and are sound: `daily-check.mjs` (5 checks, 35 assertions), `publish-daily.mjs` (safety gates, exit 2 on skeleton), `new-guide.mjs`, `migrate-content.mjs` (single-transaction live path with ROLLBACK; `--print-sql` touches no DB), `create-admin.mjs` (idempotent refusal).
- [ ] **Daily publishing cron NOT installed** — no cron config in repo, no `vercel.json` `crons`, no `.github/workflows` (`.github/` does not exist). The cron exists only as documentation (`scripts/README.md`, `0 4 * * *` = 09:00 PKT). Install it (or a Vercel Cron — Hobby allows daily) once the PAT/secret story is settled; do not improvise credential storage. — P6
- [ ] Day-8 guide body (4 Dec, "How to Create a LinkedIn Profile…") not written — the cron would scaffold + exit 2 until a body exists. Note: the LinkedIn topic itself conflicts with the LinkedIn exclusion; re-topic it. — P6
- [ ] No npm scripts wire `daily-check` / `publish-daily` (must be invoked as `node scripts/…`). Add `check` + `publish-daily` scripts to `package.json`. — P6/P14
- [ ] No CI at all (no GitHub Actions): no build check on PR/push, no audit, no tests. Add a minimal free CI (build + daily-check). — P14/P15
- [ ] Direct Postgres from the sandbox is BLOCKED (port 5432 egress) — all production DB work must go through Neon SQL Editor (browser) or the deployed app. Documented in `docs/admin-setup.md`; keep as a standing constraint. — P6
- [ ] Speed Insights NOT enabled (needs `@vercel/speed-insights` + redeploy; Real Experience Score is paid). Optional. — P14

## 7. SEO / accessibility / performance

- [x] SEO scaffolding: `BaseLayout` title/description/canonical (auto from pathname)/OG/Twitter/RSS link; `Organization` + `BreadcrumbList` + `JobPosting` (open + verified only, no invented salary/datePosted) + `WebSite+SearchAction` (homepage) + `Article` JSON-LD; robots + sitemap wiring correct; RSS correct.
- [x] Accessibility basics: `lang="en"`, single `h1` per page, all forms labelled, `aria-current`/`aria-pressed`/`role="status"` used, focus rings on inputs.
- [ ] Fix OG image: `ogImage` prop exists (`BaseLayout.astro:11,23`) but **never passed by any page** — every page shares `/og-default.svg` (1.1K SVG; most social crawlers reject SVG OG images). Pass per-page JPG (guide hero / category image), add `og:image:width/height/alt`. — P2/P13
- [ ] Fix `/docs/adsense-readiness` + `/docs/analytics-setup` are public + indexed (normal BaseLayout, no `noindex`, in auto sitemap — only `/admin` is filtered). Add `noindex` or move out of `src/pages`. — P9/P13
- [ ] Fix no `noindex` on `/search` (search-result pages indexable) and on guide 404 (`guides/[slug].astro:16-18` sets 404 status but renders indexable meta). The `noindex` prop exists but is only used on admin pages. — P13
- [ ] Fix `sameAs: []` empty in Organization JSON-LD (`BaseLayout.astro:42`, `jsonld.ts:11`) despite FB/Pinterest links in the footer. Fill with the real FB page + Pinterest profile. — P13
- [ ] Fix images: no `srcset`, no `width/height` on most `<img>` (only logo + 1 hero have them), no Astro `<Image>` optimisation — plain `<img>`, `loading="lazy"` except hero. Add dimensions + responsive sizes. — P3/P14
- [ ] Fix video: `guides/[slug].astro:175` `<video>` has no `<track kind="captions">`, no transcript (all 32 guides have no video fields anyway — `video*` missing in 32/32). — P2/P3
- [ ] Search is client-side substring only (`search.astro:56-119`, `search-index.json.ts:13-36`): `includes()` on title+description+category+tags, no ranking/tokenisation/fuzzy, no debounce, no pagination, no sorting. Rebuild per P13 (see §8). — P13
- [ ] CV Builder is print-only "PDF" (`window.print()`, `cv-builder.astro:157-163`): no real PDF generation/download, no templates, no persistence (data lost on refresh), validation only name-required via `alert()`. — P6/P8 (mission: real PDF export, templates, Fresh Graduate mode)
- [ ] Newsletter is localStorage-only (`Footer.astro:32-50,99-127`, key `rrp-newsletter`) — "no emails are sent yet"; no backend endpoint/list. — P8/P11
- [ ] Contact is mailto-only (`contact.astro:53`, `mailto:hello@rozgar-raasta-pakistan.vercel.app`) — no server storage, no API; page admits no monitored inbox; the address is a placeholder, not a real mailbox. — P11
- [ ] Saved/bookmark has no view: `rrp-saved` toggles exist (`BaseLayout.astro:84-117`, `OpportunityCard.astro:38-45`) but no page/section lists saved items; save ID is slugified title, so same-title listings collide. Build Saved Jobs page + use stable IDs. — P8/P13

## 8. Missing vs mission — phase map (all MISSING unless noted)

| Mission item | Phase | Status in current site |
|---|---|---|
| Premium design polish (focus states, contrast, touch targets, loading states, 500 page, OG images, per-page polish) | P2 | Partial — Makaryo brand live and consistent; fixes listed in §1/§7 |
| Per-listing unique relevant images; opportunities have NO image (initial-letter avatar only, `OpportunityCard.astro:46`); guides 22/32 imageless; category images shared (cat-career ×8, cat-freelancing ×6, cat-student ×5, cat-skills ×4); no srcset; no perceptual-hash duplicate detection | P3 | MISSING |
| Daily discovery engine (all 4 sectors, payment-frequency exactness) | P4 | MISSING — no discovery code at all |
| Source monitoring + Pakistan registry (PITB, cmitinterns, Ignite, BNIP, PDA, PASTIC, NJP, SESSI) | P5 | MISSING — no registry file; only 8 official sources named as text on homepage |
| Automated daily operations pipeline (discover→verify→dedupe→image→save→archive) + cron | P6 | MISSING — cron not installed; pipeline does not exist |
| "OUR INTERNSHIP PROGRAMS" section + program admin (seats, deadlines, stipend, docs, forms, review/shortlist/interview/accept-reject, supervisors, attendance, certificates) + candidate apply/track | P7 | MISSING — no programs table, no applications table, no section |
| Candidate accounts (register, login/logout, email verification, password reset, profile, education, skills, experience, CV upload, saved, history, status tracking, notifications, security settings, deletion request) | P8 | MISSING — `public_user` role type exists in `auth.ts:37` but is unused; no public auth routes, no profile, no CV upload |
| MFA, password reset, change password, user management, session rotation, rate-limited CRUD, real Markdown sanitiser, JSON-LD escaping, max-length validation, backups, dependency audit | P9 | MISSING — see §4 |
| 3D analytics dashboard (real-time visitors, geo, devices, sources, funnels; 3D globe; date/country/sector filters; real data only) | P10 | MISSING — only Vercel Web Analytics (aggregate, 0 real traffic, no admin dashboard, no events table) |
| Admin Control Center: 11 placeholder sections (§5) + bulk ops + verification queue + duplicate detection + expired-listings + job sources + automation logs | P11 | PARTIAL — 9/20 real |
| Verification/fraud system: 6 statuses (Official Source Verified / Source Confirmed / Pending Verification / Unverified / Suspicious / Expired) — DB has only 3 (`verified/pending/unverified`, `002-content.sql`); no duplicate detection, no fraud heuristics, no verification queue, no suspicious-link checks | P12 | MISSING — current `verification_status` enum must be extended; `status` vs `verification_status` overlap needs a decision |
| Advanced search + filters (sector/location/stipend/paid-unpaid/remote/education/deadline/duration), saved searches, sector/location landing pages | P13 | MISSING — only category pages + substring search (§7) |
| Performance: image optimisation/srcset, caching headers, pagination, background jobs, bundle measurement | P14 | MISSING — no srcset, `max-age=0` everywhere, no pagination, no background jobs |
| Automated test suite (unit/integration/e2e) + Phase 15 verification | P15 | MISSING — no test files, no test script; only `scripts/daily-check.mjs` (35 checks) |

## 9. Implementation order (recommended, respects dependencies)

1. **P9 first, small + critical**: remove `/admin/setup` (live Super Admin exists); fix the two XSS vectors (Markdown sanitiser → real library; JSON-LD `</script>` escaping); add max-length validation; add HSTS + CSP hardening to `vercel.json`.
2. **P12 data model**: extend `verification_status` to the 6 mission statuses; decide `status` vs `verification_status`; add `salary/stipend` + `payment_frequency` + `duration` + `source_type` columns; backfill rules (never invent — NULL where unpublished).
3. **P6 pipeline skeleton + P5 registry**: source registry file (the 8 named sources + discovery of more), daily discovery script (read-only fetch, dedupe, suspicious flags), cron install; seed data quality fixes from §3 (deadlines, source URLs, LinkedIn removal).
4. **P8 candidate accounts** (needed before P7 applications): public auth routes reusing `auth.ts` session/CSRF machinery + `public_user` role; email verification + password reset need a mail sender — free options must be evaluated first (no paid service; no mailbox exists yet — contact email is a placeholder).
5. **P7 programs + P11 admin sections** on top of the P8 accounts + P6 pipeline.
6. **P3 images**: per-listing images (opportunities first — currently zero), dedupe hashing, srcset/dimensions.
7. **P13 search/filters + P2 polish + P10 analytics** (analytics needs an events table + tracking — design before building; real data only).
8. **P14 performance + P15 tests** throughout; final independent verification per mission §15.

## 10. Risks / honest limits of this audit

- Production Neon state not verified (migration 002 + seed were being applied by a separate browser task during this audit; do not assume they completed — re-check counts before building on them).
- No live login performed (no credentials used); session/CSRF behaviour verified only in code + unauthenticated probes.
- No external URL liveness checked; no `npm audit` run; no visual/mobile rendering checked in a real browser (code inspection only).
- `.env` exists locally (gitignored, 78 bytes, contents never read) — assumed to hold the local test DB URL; production `DATABASE_URL` lives only in Vercel.
