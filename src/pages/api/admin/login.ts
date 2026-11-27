import type { APIRoute } from 'astro';
import { query } from '../../../lib/db';
import {
	MAX_FAILED_ATTEMPTS,
	MIN_PASSWORD_LENGTH,
	LOCKOUT_MINUTES,
	checkUnknownEmailLockout,
	clearUnknownEmailFailures,
	createSession,
	getClientIp,
	hashToken,
	isValidEmail,
	jsonError,
	lockoutMessage,
	logAudit,
	recordUnknownEmailFailure,
	setSessionCookie,
	toHttpErrorResponse,
	verifyCsrf,
	verifyPassword,
} from '../../../lib/auth';

// Server endpoint — must not be prerendered (Astro 7 prerenders
// endpoints by default under output: "static").
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
	try {
		if (!verifyCsrf(request.headers, cookies)) {
			return jsonError(403, 'Security check failed. Please reload the login page and try again.');
		}

		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return jsonError(400, 'Invalid request body.');
		}
		const { email: rawEmail, password } = (body ?? {}) as Record<string, unknown>;
		const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
		if (!email || !isValidEmail(email)) {
			return jsonError(400, 'Enter a valid email address.');
		}
		if (typeof password !== 'string' || password.length === 0) {
			return jsonError(400, 'Enter your password.');
		}
		if (password.length < MIN_PASSWORD_LENGTH) {
			return jsonError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
		}

		const ip = getClientIp(request);
		const userAgent = request.headers.get('user-agent');

		// Generic failure message everywhere below — the response never
		// reveals whether the email exists.
		const genericFailure = () => jsonError(401, 'Invalid email or password.');

		const userResult = await query<{
			id: string;
			email: string;
			name: string | null;
			role: string;
			password_hash: string;
			failed_login_attempts: number;
			locked_until: string | null;
			is_active: boolean;
		}>(
			`SELECT id, email, name, role, password_hash, failed_login_attempts, locked_until, is_active
			 FROM users WHERE lower(email) = $1`,
			[email],
		);

		if (userResult.rows.length === 0) {
			const lockout = await checkUnknownEmailLockout(email);
			if (lockout.locked && lockout.lockedUntil) {
				await logAudit(null, 'login_locked', { email }, ip);
				return jsonError(429, lockoutMessage(lockout.lockedUntil));
			}
			await recordUnknownEmailFailure(email);
			await logAudit(null, 'login_failed', { email, reason: 'unknown_email' }, ip);
			return genericFailure();
		}

		const user = userResult.rows[0];

		if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
			await logAudit(user.id, 'login_locked', { email }, ip);
			return jsonError(429, lockoutMessage(new Date(user.locked_until)));
		}

		const passwordOk = user.is_active && (await verifyPassword(password, user.password_hash));
		if (!passwordOk) {
			const attempts = user.failed_login_attempts + 1;
			const lockedUntil =
				attempts >= MAX_FAILED_ATTEMPTS
					? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
					: null;
			await query(
				`UPDATE users SET failed_login_attempts = $2, locked_until = $3 WHERE id = $1`,
				[user.id, attempts, lockedUntil ? lockedUntil.toISOString() : null],
			);
			await logAudit(user.id, 'login_failed', { email, reason: 'bad_password', attempts }, ip);
			if (lockedUntil) {
				await logAudit(user.id, 'account_locked', { email, attempts }, ip);
				return jsonError(429, lockoutMessage(lockedUntil));
			}
			return genericFailure();
		}

		// Success: reset the counters, record the login, create a session.
		// Only the single admin (role 'admin') may log in here. A
		// public_user with the right password is still rejected with the
		// same generic error, so the response never reveals that the
		// email has an account.
		if (user.role !== 'admin') {
			await logAudit(user.id, 'login_failed', { email, reason: 'not_admin' }, ip);
			return genericFailure();
		}
		await query(
			`UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = now() WHERE id = $1`,
			[user.id],
		);
		await clearUnknownEmailFailures(email);
		const { rawToken } = await createSession(user.id, ip, userAgent);
		setSessionCookie(cookies, rawToken);
		await logAudit(user.id, 'login', { email, role: user.role }, ip);

		return new Response(
			JSON.stringify({
				ok: true,
				user: { id: user.id, email: user.email, name: user.name, role: user.role },
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } },
		);
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
