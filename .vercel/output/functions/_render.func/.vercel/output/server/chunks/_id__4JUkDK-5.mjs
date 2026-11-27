import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { t as query } from "./db_DDXrkiRw.mjs";
import { f as updateGuide, n as EDITOR_ROLES, t as DELETE_ROLES, u as parseGuideInput } from "./admin-content_D7UgU4LZ.mjs";
import { C as verifyCsrf, S as toHttpErrorResponse, b as requireAdmin, g as jsonError, u as getClientIp, v as logAudit } from "./auth_B63A6JLM.mjs";
// src/pages/api/admin/guides/[id].ts
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	PUT: () => PUT,
	prerender: () => false
});
/** PUT /api/admin/guides/[id] — update a guide. Editors and above. */
var PUT = async ({ request, cookies, params }) => {
	try {
		const user = await requireAdmin(cookies, EDITOR_ROLES);
		if (!verifyCsrf(request.headers, cookies)) return jsonError(403, "Security check failed. Please reload the page and try again.");
		const id = params.id ?? "";
		if ((await query(`SELECT id FROM guides WHERE id = $1`, [id])).rows.length === 0) return jsonError(404, "Guide not found.");
		let body;
		try {
			const parsed = await request.json();
			if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
			body = parsed;
		} catch {
			return jsonError(400, "Invalid request body.");
		}
		const input = await parseGuideInput(body, id);
		await updateGuide(id, input);
		await logAudit(user.id, "guide_updated", {
			title: input.title,
			slug: input.slug
		}, getClientIp(request), "guide", id);
		return new Response(JSON.stringify({
			ok: true,
			id
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
/** DELETE /api/admin/guides/[id] — delete a guide. Super Admin + Content Manager only. */
var DELETE = async ({ request, cookies, params }) => {
	try {
		const user = await requireAdmin(cookies, DELETE_ROLES);
		if (!verifyCsrf(request.headers, cookies)) return jsonError(403, "Security check failed. Please reload the page and try again.");
		const id = params.id ?? "";
		const result = await query(`DELETE FROM guides WHERE id = $1 RETURNING title`, [id]);
		if (result.rows.length === 0) return jsonError(404, "Guide not found.");
		await logAudit(user.id, "guide_deleted", { title: result.rows[0].title }, getClientIp(request), "guide", id);
		return new Response(JSON.stringify({
			ok: true,
			id
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
// \0virtual:astro:page:src/pages/api/admin/guides/[id]@_@ts
var page = () => _id__exports;
export { page };
