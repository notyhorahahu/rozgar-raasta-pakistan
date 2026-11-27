import type { APIRoute } from 'astro';
import { query } from '../../../../lib/db';
import {
	DELETE_ROLES,
	EDITOR_ROLES,
	parseGuideInput,
	updateGuide,
} from '../../../../lib/admin-content';
import {
	getClientIp,
	jsonError,
	logAudit,
	requireAdmin,
	toHttpErrorResponse,
	verifyCsrf,
} from '../../../../lib/auth';

export const prerender = false;

/** PUT /api/admin/guides/[id] — update a guide. Editors and above. */
export const PUT: APIRoute = async ({ request, cookies, params }) => {
	try {
		const user = await requireAdmin(cookies, EDITOR_ROLES);
		if (!verifyCsrf(request.headers, cookies)) {
			return jsonError(403, 'Security check failed. Please reload the page and try again.');
		}
		const id = params.id ?? '';
		const existing = await query<{ id: string }>(`SELECT id FROM guides WHERE id = $1`, [id]);
		if (existing.rows.length === 0) return jsonError(404, 'Guide not found.');
		let body: Record<string, unknown>;
		try {
			const parsed: unknown = await request.json();
			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
			body = parsed as Record<string, unknown>;
		} catch {
			return jsonError(400, 'Invalid request body.');
		}
		const input = await parseGuideInput(body, id);
		await updateGuide(id, input);
		await logAudit(user.id, 'guide_updated', { title: input.title, slug: input.slug }, getClientIp(request), 'guide', id);
		return new Response(JSON.stringify({ ok: true, id }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};

/** DELETE /api/admin/guides/[id] — delete a guide. Super Admin + Content Manager only. */
export const DELETE: APIRoute = async ({ request, cookies, params }) => {
	try {
		const user = await requireAdmin(cookies, DELETE_ROLES);
		if (!verifyCsrf(request.headers, cookies)) {
			return jsonError(403, 'Security check failed. Please reload the page and try again.');
		}
		const id = params.id ?? '';
		const result = await query<{ title: string }>(
			`DELETE FROM guides WHERE id = $1 RETURNING title`,
			[id],
		);
		if (result.rows.length === 0) return jsonError(404, 'Guide not found.');
		await logAudit(user.id, 'guide_deleted', { title: result.rows[0].title }, getClientIp(request), 'guide', id);
		return new Response(JSON.stringify({ ok: true, id }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
