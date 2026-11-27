import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { t as query } from "./db_DDXrkiRw.mjs";
import { C as verifyCsrf, S as toHttpErrorResponse, _ as lockoutMessage, g as jsonError, h as isValidEmail, i as checkUnknownEmailLockout, o as clearUnknownEmailFailures, p as hashPassword, u as getClientIp, v as logAudit, y as recordUnknownEmailFailure } from "./auth_B63A6JLM.mjs";
// src/pages/api/admin/setup.ts
var setup_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, cookies }) => {
	try {
		if (!verifyCsrf(request.headers, cookies)) return jsonError(403, "Security check failed. Please reload the setup page and try again.");
		if ((await query(`SELECT id FROM users WHERE role = 'super_admin' LIMIT 1`)).rows.length > 0) return jsonError(403, "Admin setup is no longer available.");
		let body;
		try {
			body = await request.json();
		} catch {
			return jsonError(400, "Invalid request body.");
		}
		const { email: rawEmail, password } = body ?? {};
		const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
		if (!email || !isValidEmail(email)) return jsonError(400, "Enter a valid email address.");
		if (typeof password !== "string" || password.length < 8) {
			await recordUnknownEmailFailure(email);
			return jsonError(400, `Password must be at least 8 characters.`);
		}
		const lockout = await checkUnknownEmailLockout(email);
		if (lockout.locked && lockout.lockedUntil) {
			await logAudit(null, "admin_setup_locked", { email }, getClientIp(request));
			return jsonError(429, lockoutMessage(lockout.lockedUntil));
		}
		const passwordHash = await hashPassword(password);
		const created = await query(`INSERT INTO users (email, password_hash, role, name, is_active)
			 SELECT $1, $2, 'super_admin', 'Super Admin', true
			 WHERE NOT EXISTS (SELECT 1 FROM users WHERE role = 'super_admin')
			 RETURNING id, email, role, created_at`, [email, passwordHash]);
		if (created.rows.length === 0) {
			await recordUnknownEmailFailure(email);
			return jsonError(403, "Admin setup is no longer available.");
		}
		const user = created.rows[0];
		await logAudit(user.id, "admin_setup", { email: user.email }, getClientIp(request));
		await clearUnknownEmailFailures(email);
		return new Response(JSON.stringify({
			ok: true,
			message: "Admin account created. You can now log in.",
			user: {
				email: user.email,
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
// \0virtual:astro:page:src/pages/api/admin/setup@_@ts
var page = () => setup_exports;
export { page };
