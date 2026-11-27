import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { query } from './db';

// ---------------------------------------------------------------------------
// Auth for Rozgar Raasta Pakistan (admin panel + future public accounts).
//
// Design:
// - Passwords: bcrypt, cost factor 12. Minimum password length 8.
// - Sessions: a random 32-byte token is generated on login. ONLY its
//   SHA-256 hex hash is stored in sessions.token_hash; the raw token
//   lives in the httpOnly cookie `rrp_admin_session`. Sessions last
//   7 days and expiry is enforced server-side (expired rows are
//   rejected and deleted). The same session system serves the single
//   admin and the future `public_user` role — the next milestone does
//   not rebuild auth.
// - There is exactly ONE admin (role 'admin'). There is no role
//   hierarchy: no Super Admin, no Content Manager, no Editor, no
//   Viewer (removed 27 Nov 2026, migration 003). The single admin can
//   do everything. `public_user` is reserved for future candidate
//   accounts and is NOT an admin — it is rejected from /admin/*.
// - CSRF: double-submit cookie pattern. A random token is issued in
//   the `rrp_admin_csrf` cookie (readable by page JS, SameSite=Lax)
//   and must be sent back in the `x-csrf-token` header on every
//   state-changing admin API call. The server compares the two with
//   timingSafeEqual. SameSite=Lax on the session cookie is a second
//   layer, not the defence itself.
// - Rate limiting: max 5 failed attempts per email per 15 minutes,
//   then a 15-minute lockout. Known emails use users.failed_login_attempts
//   / users.locked_until; unknown emails use the login_attempts table
//   (same limits) so the endpoint behaves identically for real and
//   fake emails and cannot be used to enumerate accounts.
// - All queries are parameterised. No secrets ever reach frontend code.
// - Logins, logouts, failed logins and lockouts are written to audit_logs.
// ---------------------------------------------------------------------------

export const SESSION_COOKIE = 'rrp_admin_session';
export const CSRF_COOKIE = 'rrp_admin_csrf';
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;
export const BCRYPT_COST = 12;
export const MIN_PASSWORD_LENGTH = 8;

/** The one and only admin role. There is no role hierarchy. */
export const ADMIN_ROLE = 'admin';
export type Role = 'admin' | 'public_user';

export interface AdminUser {
	id: string;
	email: string;
	name: string | null;
	role: Role;
	is_active: boolean;
	created_at: string;
	last_login_at: string | null;
}

interface CookieLike {
	get(name: string): { value: string } | undefined;
	set(
		name: string,
		value: string,
		options?: Record<string, unknown>,
	): void;
	delete(name: string, options?: Record<string, unknown>): void;
}

export function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, BCRYPT_COST);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

export function hashToken(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

function isProd(): boolean {
	return import.meta.env.PROD === true;
}

function baseCookieOptions() {
	return { path: '/', sameSite: 'lax' as const, secure: isProd() };
}

export function setSessionCookie(cookies: CookieLike, rawToken: string): void {
	cookies.set(SESSION_COOKIE, rawToken, {
		...baseCookieOptions(),
		httpOnly: true,
		maxAge: SESSION_MAX_AGE_SECONDS,
	});
}

export function clearSessionCookie(cookies: CookieLike): void {
	cookies.delete(SESSION_COOKIE, baseCookieOptions());
}

// --- CSRF (double-submit cookie) -------------------------------------------

export function getOrSetCsrfToken(cookies: CookieLike): string {
	const existing = cookies.get(CSRF_COOKIE)?.value;
	if (existing && /^[A-Za-z0-9_-]{32,}$/.test(existing)) return existing;
	const token = randomBytes(32).toString('base64url');
	cookies.set(CSRF_COOKIE, token, {
		...baseCookieOptions(),
		httpOnly: false, // page JS must read it to send the header
		maxAge: SESSION_MAX_AGE_SECONDS,
	});
	return token;
}

export function verifyCsrf(headers: Headers, cookies: CookieLike): boolean {
	const headerToken = headers.get('x-csrf-token');
	const cookieToken = cookies.get(CSRF_COOKIE)?.value;
	if (!headerToken || !cookieToken) return false;
	const a = Buffer.from(headerToken);
	const b = Buffer.from(cookieToken);
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

// --- Sessions ---------------------------------------------------------------

export async function createSession(
	userId: string,
	ip: string | null,
	userAgent: string | null,
): Promise<{ rawToken: string; expiresAt: Date }> {
	const rawToken = randomBytes(32).toString('hex');
	const tokenHash = hashToken(rawToken);
	const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
	await query(
		`INSERT INTO sessions (user_id, token_hash, expires_at, ip, user_agent)
		 VALUES ($1, $2, $3, $4, $5)`,
		[userId, tokenHash, expiresAt.toISOString(), ip, userAgent],
	);
	return { rawToken, expiresAt };
}

export async function deleteSessionByTokenHash(tokenHash: string): Promise<void> {
	await query(`DELETE FROM sessions WHERE token_hash = $1`, [tokenHash]);
}

/** Look up the session behind a request's cookie. Returns null for a
 *  missing, unknown or expired session; expired rows are deleted. */
export async function getSessionUser(cookies: CookieLike): Promise<AdminUser | null> {
	const rawToken = cookies.get(SESSION_COOKIE)?.value;
	if (!rawToken) return null;
	const tokenHash = hashToken(rawToken);
	const result = await query<AdminUser & { expires_at: string; session_id: string }>(
		`SELECT s.id AS session_id, s.expires_at, u.id, u.email, u.name, u.role, u.is_active, u.created_at, u.last_login_at
		 FROM sessions s JOIN users u ON u.id = s.user_id
		 WHERE s.token_hash = $1`,
		[tokenHash],
	);
	if (result.rows.length === 0) return null;
	const row = result.rows[0];
	if (new Date(row.expires_at).getTime() <= Date.now() || !row.is_active) {
		await deleteSessionByTokenHash(tokenHash);
		return null;
	}
	return {
		id: row.id,
		email: row.email,
		name: row.name,
		role: row.role as Role,
		is_active: row.is_active,
		created_at: row.created_at,
		last_login_at: row.last_login_at,
	};
}

// --- Guards ------------------------------------------------------------------

export class HttpError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

/**
 * Guard for protected admin API routes and pages.
 * 401 when there is no / invalid / expired session (or the account is
 * inactive); 403 when the user is not the single admin (role 'admin').
 * A `public_user` account is never an admin and is always rejected.
 * Throws HttpError — API routes catch it and return the JSON error.
 */
export async function requireAdmin(cookies: CookieLike): Promise<AdminUser> {
	const user = await getSessionUser(cookies);
	if (!user) throw new HttpError(401, 'Unauthenticated. Please log in.');
	if (user.role !== ADMIN_ROLE) {
		throw new HttpError(403, 'Forbidden. This account does not have access to the admin panel.');
	}
	return user;
}

/** Same as requireAdmin but returns null instead of throwing — for pages
 *  that redirect to /admin/login when unauthenticated. */
export async function getAdminUser(cookies: CookieLike): Promise<AdminUser | null> {
	try {
		return await requireAdmin(cookies);
	} catch {
		return null;
	}
}

// --- Audit -------------------------------------------------------------------

export async function logAudit(
	userId: string | null,
	action: string,
	details: Record<string, unknown>,
	ip: string | null,
	resourceType?: string,
	resourceId?: string,
): Promise<void> {
	try {
		await query(
			`INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip)
			 VALUES ($1, $2, $3, $4, $5, $6)`,
			[userId, action, resourceType ?? null, resourceId ?? null, JSON.stringify(details), ip],
		);
	} catch (err) {
		console.error('[auth] failed to write audit log', action, err);
	}
}

// --- Login rate limiting ------------------------------------------------------

export function lockoutMessage(lockedUntil: Date): string {
	const minutes = Math.max(1, Math.ceil((lockedUntil.getTime() - Date.now()) / 60000));
	return `Too many failed login attempts. Account locked — try again in about ${minutes} minute${minutes === 1 ? '' : 's'}.`;
}

export interface LockoutCheck {
	locked: boolean;
	lockedUntil: Date | null;
}

/** Check the lockout state for an email that has no user row. Uses the
 *  login_attempts table so unknown emails are limited exactly like
 *  known ones (5 per 15-minute window, then 15-minute lockout). */
export async function checkUnknownEmailLockout(email: string): Promise<LockoutCheck> {
	const result = await query<{ attempts: number; window_start: string; locked_until: string | null }>(
		`SELECT attempts, window_start, locked_until FROM login_attempts WHERE email = $1`,
		[email],
	);
	if (result.rows.length === 0) return { locked: false, lockedUntil: null };
	const row = result.rows[0];
	if (row.locked_until && new Date(row.locked_until).getTime() > Date.now()) {
		return { locked: true, lockedUntil: new Date(row.locked_until) };
	}
	// Window expired — reset it.
	if (new Date(row.window_start).getTime() + LOCKOUT_MINUTES * 60 * 1000 <= Date.now()) {
		await query(
			`UPDATE login_attempts SET attempts = 0, window_start = now(), locked_until = NULL WHERE email = $1`,
			[email],
		);
	}
	return { locked: false, lockedUntil: null };
}

export async function recordUnknownEmailFailure(email: string): Promise<boolean> {
	// Returns true when this failure triggered a lockout.
	const result = await query<{ attempts: number; locked_until: string | null }>(
		`INSERT INTO login_attempts (email, attempts, window_start)
		 VALUES ($1, 1, now())
		 ON CONFLICT (email) DO UPDATE
		 SET attempts = CASE
			 WHEN login_attempts.window_start + ($2::text || ' minutes')::interval <= now()
			 THEN 1 ELSE login_attempts.attempts + 1 END,
			 window_start = CASE
			 WHEN login_attempts.window_start + ($2::text || ' minutes')::interval <= now()
			 THEN now() ELSE login_attempts.window_start END,
			 locked_until = NULL
		 RETURNING attempts, locked_until`,
		[email, String(LOCKOUT_MINUTES)],
	);
	const attempts = result.rows[0]?.attempts ?? 0;
	if (attempts >= MAX_FAILED_ATTEMPTS) {
		const lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
		await query(
			`UPDATE login_attempts SET locked_until = $2 WHERE email = $1`,
			[email, lockedUntil.toISOString()],
		);
		return true;
	}
	return false;
}

export async function clearUnknownEmailFailures(email: string): Promise<void> {
	await query(`DELETE FROM login_attempts WHERE email = $1`, [email]);
}

export function getClientIp(request: Request): string | null {
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) return forwarded.split(',')[0].trim();
	return request.headers.get('x-real-ip');
}

export function jsonError(status: number, message: string): Response {
	return new Response(JSON.stringify({ error: message }), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export function toHttpErrorResponse(err: unknown): Response {
	if (err instanceof HttpError) return jsonError(err.status, err.message);
	console.error('[admin api] unexpected error', err);
	return jsonError(500, 'Something went wrong. Please try again.');
}
