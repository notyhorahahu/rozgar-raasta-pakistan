import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { c as insertGuide, n as EDITOR_ROLES, u as parseGuideInput } from "./admin-content_D7UgU4LZ.mjs";
import { C as verifyCsrf, S as toHttpErrorResponse, b as requireAdmin, g as jsonError, u as getClientIp, v as logAudit } from "./auth_B63A6JLM.mjs";
// src/pages/api/admin/guides.ts
var guides_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
/** POST /api/admin/guides — create a guide. Editors and above. */
var POST = async ({ request, cookies }) => {
	try {
		const user = await requireAdmin(cookies, EDITOR_ROLES);
		if (!verifyCsrf(request.headers, cookies)) return jsonError(403, "Security check failed. Please reload the page and try again.");
		let body;
		try {
			const parsed = await request.json();
			if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
			body = parsed;
		} catch {
			return jsonError(400, "Invalid request body.");
		}
		const input = await parseGuideInput(body);
		const id = await insertGuide(input, user.id);
		await logAudit(user.id, "guide_created", {
			title: input.title,
			slug: input.slug
		}, getClientIp(request), "guide", id);
		return new Response(JSON.stringify({
			ok: true,
			id
		}), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
// \0virtual:astro:page:src/pages/api/admin/guides@_@ts
var page = () => guides_exports;
export { page };
