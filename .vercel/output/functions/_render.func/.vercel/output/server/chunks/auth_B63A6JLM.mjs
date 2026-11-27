import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { t as query } from "./db_DDXrkiRw.mjs";
// src/lib/auth.ts
var SESSION_COOKIE = "rrp_admin_session";
var CSRF_COOKIE = "rrp_admin_csrf";
var SESSION_MAX_AGE_SECONDS = 604800;
var ADMIN_ROLES = [
	"super_admin",
	"content_manager",
	"editor",
	"viewer"
];
function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
async function hashPassword(password) {
	return bcrypt.hash(password, 12);
}
async function verifyPassword(password, hash) {
	return bcrypt.compare(password, hash);
}
function hashToken(token) {
	return createHash("sha256").update(token).digest("hex");
}
function isProd() {
	return true;
}
function baseCookieOptions() {
	return {
		path: "/",
		sameSite: "lax",
		secure: isProd()
	};
}
function setSessionCookie(cookies, rawToken) {
	cookies.set(SESSION_COOKIE, rawToken, {
		...baseCookieOptions(),
		httpOnly: true,
		maxAge: SESSION_MAX_AGE_SECONDS
	});
}
function clearSessionCookie(cookies) {
	cookies.delete(SESSION_COOKIE, baseCookieOptions());
}
function getOrSetCsrfToken(cookies) {
	const existing = cookies.get(CSRF_COOKIE)?.value;
	if (existing && /^[A-Za-z0-9_-]{32,}$/.test(existing)) return existing;
	const token = randomBytes(32).toString("base64url");
	cookies.set(CSRF_COOKIE, token, {
		...baseCookieOptions(),
		httpOnly: false,
		maxAge: SESSION_MAX_AGE_SECONDS
	});
	return token;
}
function verifyCsrf(headers, cookies) {
	const headerToken = headers.get("x-csrf-token");
	const cookieToken = cookies.get(CSRF_COOKIE)?.value;
	if (!headerToken || !cookieToken) return false;
	const a = Buffer.from(headerToken);
	const b = Buffer.from(cookieToken);
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}
async function createSession(userId, ip, userAgent) {
	const rawToken = randomBytes(32).toString("hex");
	const tokenHash = hashToken(rawToken);
	const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1e3);
	await query(`INSERT INTO sessions (user_id, token_hash, expires_at, ip, user_agent)
		 VALUES ($1, $2, $3, $4, $5)`, [
		userId,
		tokenHash,
		expiresAt.toISOString(),
		ip,
		userAgent
	]);
	return {
		rawToken,
		expiresAt
	};
}
async function deleteSessionByTokenHash(tokenHash) {
	await query(`DELETE FROM sessions WHERE token_hash = $1`, [tokenHash]);
}
/** Look up the session behind a request's cookie. Returns null for a
*  missing, unknown or expired session; expired rows are deleted. */
async function getSessionUser(cookies) {
	const rawToken = cookies.get(SESSION_COOKIE)?.value;
	if (!rawToken) return null;
	const tokenHash = hashToken(rawToken);
	const result = await query(`SELECT s.id AS session_id, s.expires_at, u.id, u.email, u.name, u.role, u.is_active, u.created_at, u.last_login_at
		 FROM sessions s JOIN users u ON u.id = s.user_id
		 WHERE s.token_hash = $1`, [tokenHash]);
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
		role: row.role,
		is_active: row.is_active,
		created_at: row.created_at,
		last_login_at: row.last_login_at
	};
}
var HttpError = class extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
	}
};
/**
* Guard for protected admin API routes and pages.
* 401 when there is no / invalid / expired session (or the account is
* inactive); 403 when the user's role is not in `allowedRoles`.
* Throws HttpError — API routes catch it and return the JSON error.
*/
async function requireAdmin(cookies, allowedRoles = ADMIN_ROLES) {
	const user = await getSessionUser(cookies);
	if (!user) throw new HttpError(401, "Unauthenticated. Please log in.");
	if (!allowedRoles.includes(user.role)) throw new HttpError(403, "Forbidden. Your account does not have access to the admin panel.");
	return user;
}
/** Same as requireAdmin but returns null instead of throwing — for pages
*  that redirect to /admin/login when unauthenticated. */
async function getAdminUser(cookies, allowedRoles = ADMIN_ROLES) {
	try {
		return await requireAdmin(cookies, allowedRoles);
	} catch {
		return null;
	}
}
async function logAudit(userId, action, details, ip, resourceType, resourceId) {
	try {
		await query(`INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip)
			 VALUES ($1, $2, $3, $4, $5, $6)`, [
			userId,
			action,
			resourceType ?? null,
			resourceId ?? null,
			JSON.stringify(details),
			ip
		]);
	} catch (err) {
		console.error("[auth] failed to write audit log", action, err);
	}
}
function lockoutMessage(lockedUntil) {
	const minutes = Math.max(1, Math.ceil((lockedUntil.getTime() - Date.now()) / 6e4));
	return `Too many failed login attempts. Account locked — try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}
/** Check the lockout state for an email that has no user row. Uses the
*  login_attempts table so unknown emails are limited exactly like
*  known ones (5 per 15-minute window, then 15-minute lockout). */
async function checkUnknownEmailLockout(email) {
	const result = await query(`SELECT attempts, window_start, locked_until FROM login_attempts WHERE email = $1`, [email]);
	if (result.rows.length === 0) return {
		locked: false,
		lockedUntil: null
	};
	const row = result.rows[0];
	if (row.locked_until && new Date(row.locked_until).getTime() > Date.now()) return {
		locked: true,
		lockedUntil: new Date(row.locked_until)
	};
	if (new Date(row.window_start).getTime() + 9e5 <= Date.now()) await query(`UPDATE login_attempts SET attempts = 0, window_start = now(), locked_until = NULL WHERE email = $1`, [email]);
	return {
		locked: false,
		lockedUntil: null
	};
}
async function recordUnknownEmailFailure(email) {
	if (((await query(`INSERT INTO login_attempts (email, attempts, window_start)
		 VALUES ($1, 1, now())
		 ON CONFLICT (email) DO UPDATE
		 SET attempts = CASE
			 WHEN login_attempts.window_start + ($2::text || ' minutes')::interval <= now()
			 THEN 1 ELSE login_attempts.attempts + 1 END,
			 window_start = CASE
			 WHEN login_attempts.window_start + ($2::text || ' minutes')::interval <= now()
			 THEN now() ELSE login_attempts.window_start END,
			 locked_until = NULL
		 RETURNING attempts, locked_until`, [email, String(15)])).rows[0]?.attempts ?? 0) >= 5) {
		const lockedUntil = new Date(Date.now() + 9e5);
		await query(`UPDATE login_attempts SET locked_until = $2 WHERE email = $1`, [email, lockedUntil.toISOString()]);
		return true;
	}
	return false;
}
async function clearUnknownEmailFailures(email) {
	await query(`DELETE FROM login_attempts WHERE email = $1`, [email]);
}
function getClientIp(request) {
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) return forwarded.split(",")[0].trim();
	return request.headers.get("x-real-ip");
}
function jsonError(status, message) {
	return new Response(JSON.stringify({ error: message }), {
		status,
		headers: { "Content-Type": "application/json" }
	});
}
function toHttpErrorResponse(err) {
	if (err instanceof HttpError) return jsonError(err.status, err.message);
	console.error("[admin api] unexpected error", err);
	return jsonError(500, "Something went wrong. Please try again.");
}
export { verifyCsrf as C, toHttpErrorResponse as S, lockoutMessage as _, clearSessionCookie as a, requireAdmin as b, deleteSessionByTokenHash as c, getOrSetCsrfToken as d, getSessionUser as f, jsonError as g, isValidEmail as h, checkUnknownEmailLockout as i, getAdminUser as l, hashToken as m, HttpError as n, clearUnknownEmailFailures as o, hashPassword as p, SESSION_COOKIE as r, createSession as s, ADMIN_ROLES as t, getClientIp as u, logAudit as v, verifyPassword as w, setSessionCookie as x, recordUnknownEmailFailure as y };
