import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { S as toHttpErrorResponse, b as requireAdmin, t as ADMIN_ROLES } from "./auth_B63A6JLM.mjs";
// src/pages/api/admin/me.ts
var me_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ cookies }) => {
	try {
		const user = await requireAdmin(cookies, ADMIN_ROLES);
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
// \0virtual:astro:page:src/pages/api/admin/me@_@ts
var page = () => me_exports;
export { page };
