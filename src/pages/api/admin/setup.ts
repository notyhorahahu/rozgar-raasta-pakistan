import type { APIRoute } from 'astro';
import { query } from '../../../lib/db';
import {
	MIN_PASSWORD_LENGTH,
	checkUnknownEmailLockout,
	clearUnknownEmailFailures,
	getClientIp,
	hashPassword,
	isValidEmail,
	jsonError,
	lockoutMessage,
	logAudit,
	recordUnknownEmailFailure,
	toHttpErrorResponse,
	verifyCsrf,
} from '../../../lib/auth';

// One-time setup endpoint — creates the FIRST Super Admin.
//
// This endpoint exists only because the owner sets the password in the
// setup form (the password is never handled by any script or agent).
// It refuses to run once ANY super_admin already exists, so it can
// only ever create one account. Remove this route (and /admin/setup)
// in a follow-up commit once the first Super Admin is created.
//
// Server endpoint — must not be prerendered (Astro 7 prerenders
// endpoints by default under output: "static").
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
	try {
		if (!verifyCsrf(request.headers, cookies)) {
			return jsonError(403, 'Security check failed. Please reload the setup page and try again.');
		}

		// (a) One-time guard: if ANY super_admin already exists, refuse
		// and do nothing. Checked before the body is even read.
		const existing = await query(
			`SELECT id FROM users WHERE role = 'super_admin' LIMIT 1`,
		);
		if (existing.rows.length > 0) {
			return jsonError(403, 'Admin setup is no longer available.');
		}

		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return jsonError(400, 'Invalid request body.');
		}
		const { email: rawEmail, password } = (body ?? {}) as Record<string, unknown>;
		const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

		// (b) Validate.
		if (!email || !isValidEmail(email)) {
			return jsonError(400, 'Enter a valid email address.');
		}
		if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
			// A malformed attempt against a valid email still counts
			// towards that email's rate limit.
			await recordUnknownEmailFailure(email);
			return jsonError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
		}

		// Rate limit (same rules as login: 5 attempts per email per
		// 15 minutes, then a 15-minute lockout). Checked before the
		// expensive bcrypt hash so the endpoint cannot be used to
		// burn CPU.
		const lockout = await checkUnknownEmailLockout(email);
		if (lockout.locked && lockout.lockedUntil) {
			await logAudit(null, 'admin_setup_locked', { email }, getClientIp(request));
			return jsonError(429, lockoutMessage(lockout.lockedUntil));
		}

		// (c) Hash the password with the shared bcrypt helper (cost 12).
		const passwordHash = await hashPassword(password);

		// (d) Insert the Super Admin. The WHERE NOT EXISTS clause makes
		// the one-time guarantee atomic: if two requests race, only the
		// first insert returns a row and the other gets a 403 below.
		const created = await query<{
			id: string;
			email: string;
			role: string;
			created_at: string;
		}>(
			`INSERT INTO users (email, password_hash, role, name, is_active)
			 SELECT $1, $2, 'super_admin', 'Super Admin', true
			 WHERE NOT EXISTS (SELECT 1 FROM users WHERE role = 'super_admin')
			 RETURNING id, email, role, created_at`,
			[email, passwordHash],
		);
		if (created.rows.length === 0) {
			await recordUnknownEmailFailure(email);
			return jsonError(403, 'Admin setup is no longer available.');
		}

		const user = created.rows[0];
		// (e) Audit log.
		await logAudit(user.id, 'admin_setup', { email: user.email }, getClientIp(request));
		await clearUnknownEmailFailures(email);

		// (f) Success. The password and its hash are never returned.
		return new Response(
			JSON.stringify({
				ok: true,
				message: 'Admin account created. You can now log in.',
				user: { email: user.email, role: user.role },
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } },
		);
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
