-- Rozgar Raasta Pakistan — migration 002: content tables
-- Tables: opportunities, guides
-- Run against the database named by DATABASE_URL, e.g.:
--   psql "$DATABASE_URL" -f db/migrations/002-content.sql
-- Safe to re-run: every statement is IF NOT EXISTS / OR REPLACE /
-- ON CONFLICT-safe. Requires migration 001 (users table + the
-- set_updated_at() trigger function) to have run first.
--
-- Production (Neon): direct Postgres connections from the sandbox are
-- BLOCKED by the network egress, so this file is applied to Neon via
-- the Neon SQL Editor in the browser — see "Content migration
-- (migration 002)" in docs/admin-setup.md. Never run it against Neon
-- from this sandbox; verify it against the local test database
-- (rozgar_test, PostgreSQL 16 on localhost:5432) instead.
--
-- Data rules (enforced by scripts/migrate-content.mjs, which seeds
-- these tables from src/data/opportunities.json and
-- src/content/guides/*.md):
-- - Nothing is invented: every nullable column with no source value
--   stays NULL (department, province, education, qualification,
--   experience, salary, required_documents have no source data yet).
-- - opportunities.description is the same descriptive text as
--   eligibility (the JSON source has no separate description field).
-- - verification_status is mapped from the JSON status: 'unverified'
--   -> 'unverified'; 'open' or 'closed' -> 'verified' (those records
--   were verified on their verifiedDate; only the 2 records with
--   status 'unverified' are unverified).
-- - guides.published follows the PKT date gate in src/data/guides.ts
--   (isPublished: date <= today in Asia/Karachi): future-dated guides
--   are inserted with published = false. The gate is computed in the
--   migration script, not in this SQL.
-- - guides.seo_title / seo_description default to title / description
--   (a column DEFAULT cannot reference another column, so the script
--   sets them explicitly on insert).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------------------------------------- opportunities
-- One row per record in src/data/opportunities.json.
-- job_type and category hold the same JSON "category" value: job_type
-- is the field the admin panel filters/sorts on, category is the value
-- the existing public sections group by. They are kept as two columns
-- (not one) so the admin panel can change one without touching the
-- other later.
-- type is a separate column because type and category do not map 1:1
-- (e.g. 3 records are type 'guide' with category 'freelancing').
-- procedure / fees / verified_date preserve fields from the JSON that
-- the public pages already show; without them the admin panel could
-- not round-trip the content.
CREATE TABLE IF NOT EXISTS opportunities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    company text NOT NULL,
    department text,
    location text NOT NULL DEFAULT '',
    province text,
    education text,
    qualification text,
    experience text,
    salary text,
    job_type text NOT NULL CHECK (job_type IN ('government', 'private', 'remote', 'internship', 'scholarship', 'course', 'earning', 'freelancing', 'ai-tools')),
    category text NOT NULL CHECK (category IN ('government', 'private', 'remote', 'internship', 'scholarship', 'course', 'earning', 'freelancing', 'ai-tools')),
    type text NOT NULL DEFAULT 'job' CHECK (type IN ('job', 'course', 'scholarship', 'internship', 'guide')),
    status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'unverified')),
    verification_status text NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'pending', 'unverified')),
    deadline date,
    source_url text NOT NULL,
    source_domain text,
    description text,
    eligibility text,
    procedure text,
    fees text,
    verified_date date,
    required_documents text,
    published boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid REFERENCES users (id) ON DELETE SET NULL
);

-- Dedupe key for the seed script: the JSON source has no id, and
-- (title, company) is unique across all 40 records, so the script
-- inserts ON CONFLICT (title, company) DO NOTHING and is safe to re-run.
CREATE UNIQUE INDEX IF NOT EXISTS opportunities_title_company_unique
    ON opportunities (title, company);
CREATE INDEX IF NOT EXISTS opportunities_category_idx ON opportunities (category);
CREATE INDEX IF NOT EXISTS opportunities_status_idx ON opportunities (status);
CREATE INDEX IF NOT EXISTS opportunities_verification_status_idx ON opportunities (verification_status);
CREATE INDEX IF NOT EXISTS opportunities_deadline_idx ON opportunities (deadline);
CREATE INDEX IF NOT EXISTS opportunities_job_type_idx ON opportunities (job_type);

DROP TRIGGER IF EXISTS opportunities_set_updated_at ON opportunities;
CREATE TRIGGER opportunities_set_updated_at
    BEFORE UPDATE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------------ guides
-- One row per file in src/content/guides/*.md. body is the full
-- Markdown body after the frontmatter block (the whole file content
-- minus the --- frontmatter --- block). image / image_alt preserve the
-- frontmatter hero image; the schema allows them but only 10 of the
-- 32 guides have one — the rest stay NULL, nothing is invented.
-- seo_title / seo_description are set to title / description by the
-- seed script (see the header comment: a DEFAULT cannot reference
-- another column). created_at is set from frontmatter "date" and
-- updated_at from frontmatter "updated" by the seed script, so the
-- rows keep the content's real dates instead of the import date.
CREATE TABLE IF NOT EXISTS guides (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    description text NOT NULL,
    category text NOT NULL CHECK (category IN ('freelancing', 'career', 'student', 'skills', 'earning', 'business', 'ai-tools')),
    tags text[] NOT NULL DEFAULT '{}',
    body text NOT NULL,
    featured boolean NOT NULL DEFAULT false,
    published boolean NOT NULL DEFAULT true,
    publish_date date NOT NULL,
    seo_title text,
    seo_description text,
    author text NOT NULL DEFAULT 'Rozgar Raasta Team',
    image text,
    image_alt text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid REFERENCES users (id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS guides_slug_unique ON guides (slug);

DROP TRIGGER IF EXISTS guides_set_updated_at ON guides;
CREATE TRIGGER guides_set_updated_at
    BEFORE UPDATE ON guides
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
