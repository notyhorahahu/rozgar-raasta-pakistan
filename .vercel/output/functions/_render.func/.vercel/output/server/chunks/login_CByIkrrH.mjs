import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { t as query } from "./db_DDXrkiRw.mjs";
import { C as verifyCsrf, S as toHttpErrorResponse, _ as lockoutMessage, g as jsonError, h as isValidEmail, i as checkUnknownEmailLockout, o as clearUnknownEmailFailures, s as createSession, u as getClientIp, v as logAudit, w as verifyPassword, x as setSessionCookie, y as recordUnknownEmailFailure } from "./auth_B63A6JLM.mjs";
// src/pages/api/admin/login.ts
var login_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, cookies }) => {
	try {
		if (!verifyCsrf(request.headers, cookies)) return jsonError(403, "Security check failed. Please reload the login page and try again.");
		let body;
		try {
			body = await request.json();
		} catch {
			return jsonError(400, "Invalid request body.");
		}
		const { email: rawEmail, password } = body ?? {};
		const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
		if (!email || !isValidEmail(email)) return jsonError(400, "Enter a valid email address.");
		if (typeof password !== "string" || password.length === 0) return jsonError(400, "Enter your password.");
		if (password.length < 8) return jsonError(400, `Password must be at least 8 characters.`);
		const ip = getClientIp(request);
		const userAgent = request.headers.get("user-agent");
		const genericFailure = () => jsonError(401, "Invalid email or password.");
		const userResult = await query(`SELECT id, email, name, role, password_hash, failed_login_attempts, locked_until, is_active
			 FROM users WHERE lower(email) = $1`, [email]);
		if (userResult.rows.length === 0) {
			const lockout = await checkUnknownEmailLockout(email);
			if (lockout.locked && lockout.lockedUntil) {
				await logAudit(null, "login_locked", { email }, ip);
				return jsonError(429, lockoutMessage(lockout.lockedUntil));
			}
			await recordUnknownEmailFailure(email);
			await logAudit(null, "login_failed", {
				email,
				reason: "unknown_email"
			}, ip);
			return genericFailure();
		}
		const user = userResult.rows[0];
		if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
			await logAudit(user.id, "login_locked", { email }, ip);
			return jsonError(429, lockoutMessage(new Date(user.locked_until)));
		}
		if (!(user.is_active && await verifyPassword(password, user.password_hash))) {
			const attempts = user.failed_login_attempts + 1;
			const lockedUntil = attempts >= 5 ? new Date(Date.now() + 9e5) : null;
			await query(`UPDATE users SET failed_login_attempts = $2, locked_until = $3 WHERE id = $1`, [
				user.id,
				attempts,
				lockedUntil ? lockedUntil.toISOString() : null
			]);
			await logAudit(user.id, "login_failed", {
				email,
				reason: "bad_password",
				attempts
			}, ip);
			if (lockedUntil) {
				await logAudit(user.id, "account_locked", {
					email,
					attempts
				}, ip);
				return jsonError(429, lockoutMessage(lockedUntil));
			}
			return genericFailure();
		}
		await query(`UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = now() WHERE id = $1`, [user.id]);
		await clearUnknownEmailFailures(email);
		const { rawToken } = await createSession(user.id, ip, userAgent);
		setSessionCookie(cookies, rawToken);
		await logAudit(user.id, "login", {
			email,
			role: user.role
		}, ip);
		return new Response(JSON.stringify({
			ok: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role
			}
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
// \0virtual:astro:page:src/pages/api/admin/login@_@ts
var page = () => login_exports;
export { page };
