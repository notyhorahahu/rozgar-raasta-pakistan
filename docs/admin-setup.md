# Admin Setup — Rozgar Raasta Pakistan (Phases 2–4, foundation milestone)

Foundation only: database + authentication + admin login + dashboard shell.
The 19 content-management sections are **not** built yet — they come in
the next milestone, on top of the content tables added in section 7.

## 1. Database choice

| Environment | Database | How it is reached |
|---|---|---|
| Testing (this machine) | PostgreSQL 16, local database `rozgar_test` (also `rozgar_dev`) | `DATABASE_URL` in the gitignored `.env` |
| Production | Neon free tier (Postgres, pooled endpoint) | `DATABASE_URL` set as a Vercel env var |

The code reads `DATABASE_URL` from the environment in `src/lib/db.ts`
(`pg` Pool). SSL is off for local hosts (`localhost` / `127.0.0.1`) and on
(`rejectUnauthorized: false`, as Neon's pooled endpoints require) for
every other host, so the same code works locally and on Neon. `pg`
(node-postgres) was chosen deliberately: it works with both local Postgres
and Neon. `@neondatabase/serverless` was **not** used — it only works with
Neon and cannot be tested locally.

Free infrastructure only — no paid service, no card prompt anywhere.

## 2. Schema

Migration: `db/migrations/001-init.sql` (reproducible, safe to re-run).
Apply it with:

```bash
psql "$DATABASE_URL" -f db/migrations/001-init.sql
```

Tables:

- **`users`** — `id` uuid PK (`gen_random_uuid()`), `email` text (unique
  case-insensitively via an index on `lower(email)`; the app stores
  lower-cased emails), `password_hash` text NOT NULL, `role` text with a
  CHECK constraint over `super_admin | content_manager | editor | viewer |
  public_user`, `name`, `created_at` / `updated_at` (auto-maintained by a
  trigger), `last_login_at`, `failed_login_attempts` (default 0),
  `locked_until`, `is_active` (default true).
- **`sessions`** — `id` uuid PK, `user_id` FK → users (ON DELETE CASCADE),
  `token_hash` text NOT NULL UNIQUE (SHA-256 hex of the session token —
  the raw token is never stored), `expires_at`, `created_at`, `ip`,
  `user_agent`.
- **`audit_logs`** — `id` uuid PK, `user_id` FK → users (ON DELETE SET
  NULL), `action`, `resource_type`, `resource_id`, `details` jsonb, `ip`,
  `created_at`. Logins, logouts, failed logins and lockouts are recorded.
- **`login_attempts`** — `email` PK, `attempts`, `window_start`,
  `locked_until`. Why it exists: the per-user lockout
  (`users.failed_login_attempts` / `users.locked_until`) only works for
  emails that exist in the `users` table. Without this table an attacker
  could hammer a non-existent email forever, and the difference in
  behaviour would let them enumerate which emails have accounts. This
  table rate-limits unknown emails with the same limits (5 per 15-minute
  window, then a 15-minute lockout), so the endpoint behaves identically
  for real and fake emails.

Content tables (`opportunities`, `guides`) are in migration 002 — see
section 7. Subscriber / message tables are not created yet.

## 3. Auth design

Implemented in `src/lib/db.ts` and `src/lib/auth.ts`.

- **Passwords:** bcryptjs, cost factor 12. Minimum length 8 characters.
- **Sessions:** on login a random 32-byte token is generated
  (`crypto.randomBytes`). Only its SHA-256 hex hash is stored in
  `sessions.token_hash`. The raw token goes into an httpOnly cookie named
  `rrp_admin_session` — `Secure` in production only, `SameSite=Lax`,
  `Path=/`, `Max-Age` 7 days. Session expiry (7 days) is enforced
  server-side: an expired session is rejected and its row deleted.
- **Guard:** `requireAdmin(request-cookies, allowedRoles)` reads the
  session cookie, looks up session + user, throws 401 for a missing /
  invalid / expired session or an inactive account, and 403 when the
  user's role is not in `allowedRoles`. Every protected API route and
  every protected page calls it server-side. The frontend is never trusted.
  Pages use `getAdminUser()` (same checks, returns null) and redirect
  server-side to `/admin/login`.
- **Rate limiting:** max 5 failed attempts per email per 15 minutes, then
  a 15-minute lockout (`failed_login_attempts` + `locked_until` on the user
  row; `login_attempts` table for unknown emails). A locked account gets
  "Too many failed login attempts. Account locked — try again in about N
  minutes." The counter resets on successful login.
- **Logout:** deletes the session row and clears the cookie.
- **CSRF:** double-submit cookie pattern. A random token is issued in the
  `rrp_admin_csrf` cookie (readable by page JS, `SameSite=Lax`) when the
  login / dashboard page loads, and the same token must be sent in the
  `x-csrf-token` header on every state-changing admin API call
  (`POST /api/admin/login`, `POST /api/admin/logout`). The server compares
  the two with `timingSafeEqual`; a missing or mismatched token is a 403.
  The `SameSite=Lax` session cookie is a second layer, not the defence.
- **Validation:** every endpoint validates input (valid email format,
  password present and ≥ 8 characters, no empty fields). All queries are
  parameterised — no string-built SQL. No secrets in frontend code.
- **Failure messages:** a failed login always returns the generic
  "Invalid email or password" — it never reveals whether the email exists.
- **Roles:** `super_admin` (full access, creates admin accounts),
  `content_manager`, `editor`, `viewer` (read-only — enforced by the
  route guards in later milestones), `public_user` (future public
  accounts; can hold a session but is refused by every admin route
  with 403).

## 4. Admin URLs

Admin lives **only** under `/admin/*`. There is no admin login or admin
link anywhere on the public website, and the public site has no login UI.

| URL | What it is |
|---|---|
| `/admin` | Server-side redirect → `/admin/login` |
| `/admin/login` | Admin login page (server-rendered, `prerender = false`). Email + password. States that admin accounts are created by a Super Admin only; no sign-up link. |
| `/admin/dashboard` | Dashboard shell (server-rendered, `prerender = false`). Redirects server-side to `/admin/login` when unauthenticated. |
| `POST /api/admin/login` | Validates input, checks lockout, verifies the bcrypt hash, creates a session, sets the httpOnly cookie, returns the user as JSON. |
| `POST /api/admin/logout` | Deletes the session, clears the cookie. |
| `GET /api/admin/me` | Returns the current admin user + role; 401 when unauthenticated, 403 for non-admin roles. |

`robots.txt` disallows `/admin` and the sitemap filter excludes `/admin`
(both verified still in place). The dashboard sidebar lists all 20
sections; only **Dashboard Overview** has real content in this milestone.
The other 19 show a "Coming soon" placeholder noting they are part of the
next milestone — no fake data anywhere.

The Overview shows **real** data only: total users by role and active
sessions from the database, the latest 10 audit-log entries, and the
opportunity / guide counts read from the existing static files
(`src/data/opportunities.json`, the guides collection) — labelled
"static content" until the database migration in the next milestone.

## 5. Astro setup

`astro.config.mjs` uses the `@astrojs/vercel` adapter with the default
`output: 'static'`. Two Astro 7 facts matter here:

- `output: 'hybrid'` was **removed** in Astro 7 — `static` (the default)
  now behaves the same way: public pages prerender to static HTML
  exactly as before, and only pages marked `prerender = false`
  (`/admin/login`, `/admin/dashboard`, `/admin`) run on the server.
- API routes are **also prerendered by default** in Astro 7 under
  `output: 'static'` — a prerendered endpoint cannot read request
  headers or cookies and rejects POSTs. Every `/api/admin/*` route
  therefore carries `export const prerender = false;` (without it, login
  fails with a 403 because the CSRF header/cookie are invisible).
  If a future API route is added, it needs the same line.

With the adapter, `npm run build` writes static files to `dist/client/`
(and the server function to `.vercel/output/`); `scripts/daily-check.mjs`
was updated to look in `dist/client/` when it exists.
The `vercel.json` security headers from Phase 9 are unchanged — the admin
pages work under that CSP (it already allows `'unsafe-inline'` scripts
and Google Fonts).

## 6. Owner instructions — production setup (do once)

Prerequisites: the Neon project and the Vercel env vars. The owner (or the
parent agent) creates the Neon project; the steps below assume it exists.

1. **Create the Neon project** (browser task — done by the parent agent).
   Use the free tier. Copy the **pooled** connection string.
2. **Set the Vercel env var** (project → Settings → Environment Variables,
   Production): `DATABASE_URL` = the Neon pooled connection string.
3. **Run the migration against Neon** (from any machine with `psql`):
   ```bash
   psql "$DATABASE_URL" -f db/migrations/001-init.sql
   ```
   Replace `$DATABASE_URL` with the Neon connection string for that command.
4. **Create the first Super Admin — one-time setup page** (recommended):
   open `https://rozgar-raasta-pakistan.vercel.app/admin/setup`, enter the
   email + password (8+ characters, twice) and submit. The page creates the
   account through `POST /api/admin/setup`, which:
   - refuses with 403 if ANY Super Admin already exists (checked before
     the request body is read, and again atomically in the insert, so it
     can only ever create one account);
   - validates the email format and the 8-character minimum;
   - rate-limits the endpoint like the login endpoint (5 attempts per
     email per 15 minutes, then a 15-minute lockout);
   - hashes the password with bcrypt (cost 12) and writes an `admin_setup`
     row to `audit_logs`;
   - never returns the password or its hash.
   After success the page shows "Admin account created — you can now log
   in" with a link to `/admin/login`. If a Super Admin already exists the
   page shows "Admin setup is complete" instead of the form.
   The setup page is not linked from anywhere on the public site, is
   excluded from the sitemap and disallowed in `robots.txt`.
   **Remove the setup page and endpoint** (`src/pages/admin/setup.astro`
   and `src/pages/api/admin/setup.ts`) in a follow-up commit once the
   account is created.
5. **Alternative: create the account with the script** (if the setup page
   cannot be used):
   ```bash
   ADMIN_EMAIL='<the email>' ADMIN_PASSWORD='<the password>' \
     DATABASE_URL='<the Neon connection string>' \
     node scripts/create-admin.mjs
   ```
   The script refuses to run if a Super Admin already exists, and refuses
   if the env vars are missing. It never prints the password or the
   connection string.
6. **Log in** at `https://rozgar-raasta-pakistan.vercel.app/admin/login`.

## 7. Content migration (migration 002)

Content tables live in `db/migrations/002-content.sql` (safe to re-run;
requires migration 001 first — it uses the `users` table and the
`set_updated_at()` trigger function). The tables are seeded from the
file sources of truth by `scripts/migrate-content.mjs`:

- **`opportunities`** — one row per record in
  `src/data/opportunities.json` (40). Columns: `title`, `company` (from
  JSON `organization`), `department`, `location`, `province`,
  `education`, `qualification`, `experience`, `salary`, `job_type` and
  `category` (both from JSON `category`), `type` (from JSON `type` —
  a separate column because type and category do not map 1:1, e.g. 3
  records are type `guide`), `status` (`open`/`closed`/`unverified`),
  `verification_status` (mapped from JSON status: `unverified` →
  `unverified`, `open`/`closed` → `verified`), `deadline`,
  `source_url`, `source_domain` (hostname of `source_url`),
  `description` (= `eligibility`, the descriptive text),
  `eligibility`, `procedure`, `fees`, `verified_date`, `required_documents`,
  `published`, `created_at` / `updated_at` (auto-maintained by a
  trigger), `created_by` (FK → users, nullable). Indexes on `category`,
  `status`, `verification_status`, `deadline`, `job_type`, plus a
  unique index on `(title, company)` — the dedupe key for the seed
  script. The nullable columns with no source data (`department`,
  `province`, `education`, `qualification`, `experience`, `salary`,
  `required_documents`) are NULL for all 40 rows: nothing was invented.
- **`guides`** — one row per file in `src/content/guides/*.md` (32).
  Columns: `slug` (UNIQUE, from the filename), `title`,
  `description`, `category`, `tags` (`text[]`), `body` (the full
  Markdown after the frontmatter block), `featured`, `published`,
  `publish_date`, `seo_title` / `seo_description` (= title /
  description), `author`, `image` / `image_alt` (from frontmatter;
  only 10 of the 32 guides have one — the rest are NULL),
  `created_at` (from frontmatter `date`) / `updated_at` (from
  frontmatter `updated`), `created_by` (FK → users, nullable).
  `published` follows the PKT date gate in `src/data/guides.ts`
  (`isPublished`: date <= today in Asia/Karachi): the 6 guides dated
  28 Nov–3 Dec 2026 are inserted with `published = false`; the 27 Nov
  guide and all earlier ones get `published = true`.

### Local (testing) — run directly

```bash
psql "$DATABASE_URL" -f db/migrations/002-content.sql   # apply twice to prove it re-runs cleanly
node --env-file=.env scripts/migrate-content.mjs        # seeds 40 opportunities + 32 guides
node --env-file=.env scripts/migrate-content.mjs        # second run: 0 inserted (idempotent)
```

The script uses `INSERT ... ON CONFLICT DO NOTHING` on both tables
(opportunities on `(title, company)`, guides on `slug`), runs all
inserts in one transaction (any failure rolls everything back and
exits non-zero), validates every record first (unknown category/type/
status, bad dates/URLs, missing required fields — any error aborts
before inserting anything), and prints how many rows were inserted
vs skipped. Verified locally 27 Nov 2026: migration applies cleanly
twice; first run inserts 40 + 32, second run inserts 0; field-by-field
spot checks pass for 3 jobs + 2 guides; the 6 future-dated guides have
`published = false`, the 27 Nov guide `published = true`.

### Production (Neon) — via the Neon SQL Editor (browser task)

Direct Postgres connections (port 5432) from this sandbox to Neon are
**blocked by the network egress**, so nothing here can run against
Neon directly — do not try `psql` or the script with the Neon
`DATABASE_URL` from this machine. The Neon path is:

1. Generate the seed SQL (this does **not** touch any database):
   ```bash
   node scripts/migrate-content.mjs --print-sql --sql-file /tmp/migrate-content.sql
   ```
   This prints/writes the same 72 `INSERT ... ON CONFLICT DO NOTHING`
   statements the script would run (40 opportunities + 32 guides),
   with values escaped as SQL literals. Note the PKT date gate is
   evaluated when the file is generated — generate it on the day you
   apply it, so `published` matches that day's date.
2. In the Neon dashboard, open the **SQL Editor** for the
   `rozgar-raasta-pakistan` project and run, in this order:
   a. the full contents of `db/migrations/002-content.sql` (migration
      001 must already have run — it has, on 27 Nov 2026);
   b. the full contents of the generated `/tmp/migrate-content.sql`.
3. Verify in the SQL Editor:
   ```sql
   SELECT (SELECT count(*) FROM opportunities) AS opportunities,
          (SELECT count(*) FROM guides) AS guides,
          (SELECT count(*) FROM guides WHERE published = false) AS unpublished;
   ```
   Expected: 40 opportunities, 32 guides, 6 unpublished (the guides
   dated 28 Nov–3 Dec 2026). Re-running either file must change
   nothing (0 new rows).

## 8. Public user accounts — design only (next milestone)

No public login / sign-up UI is built in this milestone, and none was
added to the public site. The design for the next milestone:

- The `users` table already has the `public_user` role, and the session
  system in `src/lib/auth.ts` already supports it: a `public_user` can
  hold a session exactly like an admin, and `requireAdmin()` refuses
  that role on every admin route with 403 (verified by test). The next
  milestone does **not** rebuild auth.
- Future public endpoints: `POST /api/auth/signup`,
  `POST /api/auth/login`, `POST /api/auth/logout` (separate from the
  `/api/admin/*` endpoints; same hashing, session, rate-limit and CSRF
  rules; the public login page will live outside `/admin/*`).
- Guest vs logged-in behaviour: **guest** — everything works without an
  account (browse jobs, apply, build a CV, search); nothing is saved to
  an account (today's `localStorage` behaviour for saved jobs / CV data
  stays as the guest fallback). **Logged in** — saved jobs, CVs and
  application history are saved to the visitor's account in the database
  and follow them across devices. There is never a forced login: every
  public feature works as a guest.
- The public account tables/columns for saved data (saved jobs, CVs,
  application history) are designed with the content tables in the next
  milestone.

## 9. What is NOT in this milestone

- The 19 content-management sections (placeholder only).
- Admin pages for the content tables, public signup/login UI,
  newsletter subscriber storage, contact-message storage, 2FA.
- Any change to the public site's colours, theme or content.
