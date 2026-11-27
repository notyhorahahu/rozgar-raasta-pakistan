import type { APIRoute } from 'astro';
import { query } from '../../../../../lib/db';
import { EDITOR_ROLES } from '../../../../../lib/admin-content';
import {
	getClientIp,
	jsonError,
	logAudit,
	requireAdmin,
	toHttpErrorResponse,
	verifyCsrf,
} from '../../../../../lib/auth';

export const prerender = false;

/** POST /api/admin/jobs/[id]/publish — toggle `published`.
 *  Body: { "published": true | false }. Editors and above. */
export const POST: APIRoute = async ({ request, cookies, params }) => {
	try {
		const user = await requireAdmin(cookies, EDITOR_ROLES);
		if (!verifyCsrf(request.headers, cookies)) {
			return jsonError(403, 'Security check failed. Please reload the page and try again.');
		}
		const id = params.id ?? '';
		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return jsonError(400, 'Invalid request body.');
		}
		const published = (body as Record<string, unknown>)?.published;
		if (typeof published !== 'boolean') {
			return jsonError(400, 'Body must be { "published": true | false }.');
		}
		const result = await query<{ title: string }>(
			`UPDATE opportunities SET published = $2 WHERE id = $1 RETURNING title`,
			[id, published],
		);
		if (result.rows.length === 0) return jsonError(404, 'Opportunity not found.');
		await logAudit(
			user.id,
			published ? 'job_published' : 'job_unpublished',
			{ title: result.rows[0].title, published },
			getClientIp(request),
			'opportunity',
			id,
		);
		return new Response(JSON.stringify({ ok: true, id, published }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
