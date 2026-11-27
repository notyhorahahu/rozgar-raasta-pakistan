import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { C as verifyCsrf, S as toHttpErrorResponse, a as clearSessionCookie, c as deleteSessionByTokenHash, f as getSessionUser, g as jsonError, m as hashToken, r as SESSION_COOKIE, u as getClientIp, v as logAudit } from "./auth_B63A6JLM.mjs";
// src/pages/api/admin/logout.ts
var logout_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, cookies }) => {
	try {
		if (!verifyCsrf(request.headers, cookies)) return jsonError(403, "Security check failed. Please reload the page and try again.");
		const rawToken = cookies.get(SESSION_COOKIE)?.value;
		const user = await getSessionUser(cookies);
		if (rawToken) await deleteSessionByTokenHash(hashToken(rawToken));
		clearSessionCookie(cookies);
		if (user) await logAudit(user.id, "logout", { email: user.email }, getClientIp(request));
		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
// \0virtual:astro:page:src/pages/api/admin/logout@_@ts
var page = () => logout_exports;
export { page };
