import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { t as query } from "./db_DDXrkiRw.mjs";
import { n as EDITOR_ROLES } from "./admin-content_D7UgU4LZ.mjs";
import { C as verifyCsrf, S as toHttpErrorResponse, b as requireAdmin, g as jsonError, u as getClientIp, v as logAudit } from "./auth_B63A6JLM.mjs";
// src/pages/api/admin/guides/[id]/publish.ts
var publish_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
/** POST /api/admin/guides/[id]/publish — toggle `published`.
*  Body: { "published": true | false }. Editors and above. */
var POST = async ({ request, cookies, params }) => {
	try {
		const user = await requireAdmin(cookies, EDITOR_ROLES);
		if (!verifyCsrf(request.headers, cookies)) return jsonError(403, "Security check failed. Please reload the page and try again.");
		const id = params.id ?? "";
		let body;
		try {
			body = await request.json();
		} catch {
			return jsonError(400, "Invalid request body.");
		}
		const published = body?.published;
		if (typeof published !== "boolean") return jsonError(400, "Body must be { \"published\": true | false }.");
		const result = await query(`UPDATE guides SET published = $2 WHERE id = $1 RETURNING title, slug`, [id, published]);
		if (result.rows.length === 0) return jsonError(404, "Guide not found.");
		await logAudit(user.id, published ? "guide_published" : "guide_unpublished", {
			title: result.rows[0].title,
			slug: result.rows[0].slug,
			published
		}, getClientIp(request), "guide", id);
		return new Response(JSON.stringify({
			ok: true,
			id,
			published
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
// \0virtual:astro:page:src/pages/api/admin/guides/[id]/publish@_@ts
var page = () => publish_exports;
export { page };
