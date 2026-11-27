-- Rozgar Raasta Pakistan — migration 001: auth foundation
-- Tables: users, sessions, audit_logs, login_attempts
-- Run against the database named by DATABASE_URL, e.g.:
--   psql "$DATABASE_URL" -f db/migrations/001-init.sql
-- Safe to re-run: every statement is IF NOT EXISTS / OR REPLACE / ON CONFLICT-safe.
-- No content tables (jobs / scholarships / articles / subscribers / messages)
-- are created here — those come in the next milestone.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------- users
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    password_hash text NOT NULL,
    role text NOT NULL CHECK (role IN ('super_admin', 'content_manager', 'editor', 'viewer', 'public_user')),
    name text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    last_login_at timestamptz,
    failed_login_attempts int NOT NULL DEFAULT 0,
    locked_until timestamptz,
    is_active boolean NOT NULL DEFAULT true
);

-- Emails are stored lower-cased by the application code; the unique index
-- on lower(email) makes the uniqueness check case-insensitive without
-- needing the citext extension.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_unique ON users (lower(email));
CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);

-- Keep updated_at current on every row update.
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------- sessions
-- Only the SHA-256 hash of the session token is stored. The raw token
-- lives only in the httpOnly cookie; a database leak alone cannot be
-- used to impersonate a session.
CREATE TABLE IF NOT EXISTS sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash text NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    ip text,
    user_agent text
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions (expires_at);

-- ----------------------------------------------------------- audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users (id) ON DELETE SET NULL,
    action text NOT NULL,
    resource_type text,
    resource_id text,
    details jsonb,
    ip text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx ON audit_logs (user_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs (action);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs (created_at DESC);

-- -------------------------------------------------------- login_attempts
-- Why this table exists: the per-user lockout (users.failed_login_attempts
-- / users.locked_until) only works for emails that exist in the users
-- table. Without this table, an attacker could hammer a non-existent
-- email forever (no lockout possible) and, worse, the difference in
-- behaviour between "known email, locked after 5 tries" and "unknown
-- email, never locked" would let them enumerate which emails have
-- accounts. This table rate-limits unknown emails the same way (5 failed
-- attempts per 15-minute window, then a 15-minute lockout), so the login
-- endpoint behaves identically for real and fake emails.
CREATE TABLE IF NOT EXISTS login_attempts (
    email text PRIMARY KEY,
    attempts int NOT NULL DEFAULT 0,
    window_start timestamptz NOT NULL DEFAULT now(),
    locked_until timestamptz
);
