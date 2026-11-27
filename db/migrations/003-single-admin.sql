-- Rozgar Raasta Pakistan — migration 003: single admin (no role hierarchy)
-- Run against the database named by DATABASE_URL, e.g.:
--   psql "$DATABASE_URL" -f db/migrations/003-single-admin.sql
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / guarded).
-- Requires migration 001 (users table).
--
-- Production (Neon): direct Postgres connections from the sandbox are
-- BLOCKED by the network egress, so this file is applied to Neon via
-- the Neon SQL Editor in the browser — see "Single admin (migration
-- 003)" in docs/admin-setup.md. Verify it against the local test
-- database (rozgar_test, PostgreSQL 16 on localhost:5432) instead.
--
-- What this does (owner order, 27 Nov 2026: "Ek e admin hona chahiya
-- srf srf ek koi super nai koi kuch nai"):
-- 1. Every existing admin role (super_admin, content_manager, editor,
--    viewer) becomes 'admin'. The public_user role is untouched — it is
--    reserved for future candidate accounts and is NOT an admin.
-- 2. The role CHECK is tightened so a user can only be 'admin' or
--    'public_user'. The old CHECK must be dropped BEFORE the UPDATE,
--    because 'admin' is not in the old allowed list.
-- 3. A partial unique index guarantees at most ONE admin row exists:
--    a second INSERT with role='admin' fails at the database level.
--
-- Order matters: drop old CHECK -> migrate roles -> add new CHECK ->
-- create the single-admin index.

-- 1. Drop the old role CHECK (auto-named users_role_check in 001).
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Defensive: drop any other CHECK on users that still mentions the old
-- role names (in case the constraint was ever renamed).
DO $$
DECLARE
	r record;
BEGIN
	FOR r IN
		SELECT conname FROM pg_constraint
		WHERE conrelid = 'users'::regclass AND contype = 'c'
			AND pg_get_constraintdef(oid) LIKE '%super_admin%'
	LOOP
		EXECUTE 'ALTER TABLE users DROP CONSTRAINT ' || quote_ident(r.conname);
	END LOOP;
END $$;

-- 2. Migrate every old admin role to 'admin'. public_user is untouched.
UPDATE users SET role = 'admin'
WHERE role IN ('super_admin', 'content_manager', 'editor', 'viewer');

-- 3. Tighten the CHECK: only 'admin' or 'public_user' from now on.
-- Guarded so the migration is safe to re-run.
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'users_role_check' AND conrelid = 'users'::regclass
	) THEN
		ALTER TABLE users ADD CONSTRAINT users_role_check
			CHECK (role IN ('admin', 'public_user'));
	END IF;
END $$;

-- 4. At most one admin: a partial unique index on a constant, so any
--    two rows with role='admin' collide and the second insert fails.
CREATE UNIQUE INDEX IF NOT EXISTS users_single_admin_idx
	ON users ((1)) WHERE role = 'admin';
