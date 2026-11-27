import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { t as query } from "./db_DDXrkiRw.mjs";
import { d as parseJobInput, n as EDITOR_ROLES, p as updateJob, t as DELETE_ROLES } from "./admin-content_D7UgU4LZ.mjs";
import { C as verifyCsrf, S as toHttpErrorResponse, b as requireAdmin, g as jsonError, u as getClientIp, v as logAudit } from "./auth_B63A6JLM.mjs";
// src/pages/api/admin/jobs/[id].ts
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	PUT: () => PUT,
	prerender: () => false
});
async function readJson(request) {
	try {
		const body = await request.json();
		if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("not an object");
		return body;
	} catch {
		throw new Error("Invalid request body.");
	}
}
/** PUT /api/admin/jobs/[id] — update an opportunity. Editors and above. */
var PUT = async ({ request, cookies, params }) => {
	try {
		const user = await requireAdmin(cookies, EDITOR_ROLES);
		if (!verifyCsrf(request.headers, cookies)) return jsonError(403, "Security check failed. Please reload the page and try again.");
		const id = params.id ?? "";
		if ((await query(`SELECT id, title FROM opportunities WHERE id = $1`, [id])).rows.length === 0) return jsonError(404, "Opportunity not found.");
		let body;
		try {
			body = await readJson(request);
		} catch {
			return jsonError(400, "Invalid request body.");
		}
		const input = parseJobInput(body);
		await updateJob(id, input);
		await logAudit(user.id, "job_updated", {
			title: input.title,
			company: input.company
		}, getClientIp(request), "opportunity", id);
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
/** DELETE /api/admin/jobs/[id] — delete an opportunity. Super Admin + Content Manager only. */
var DELETE = async ({ request, cookies, params }) => {
	try {
		const user = await requireAdmin(cookies, DELETE_ROLES);
		if (!verifyCsrf(request.headers, cookies)) return jsonError(403, "Security check failed. Please reload the page and try again.");
		const id = params.id ?? "";
		const result = await query(`DELETE FROM opportunities WHERE id = $1 RETURNING title`, [id]);
		if (result.rows.length === 0) return jsonError(404, "Opportunity not found.");
		await logAudit(user.id, "job_deleted", { title: result.rows[0].title }, getClientIp(request), "opportunity", id);
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
// \0virtual:astro:page:src/pages/api/admin/jobs/[id]@_@ts
var page = () => _id__exports;
export { page };
