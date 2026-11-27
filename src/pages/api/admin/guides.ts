import type { APIRoute } from 'astro';
import { insertGuide, parseGuideInput } from '../../../lib/admin-content';
import {
	getClientIp,
	jsonError,
	logAudit,
	requireAdmin,
	toHttpErrorResponse,
	verifyCsrf,
} from '../../../lib/auth';

export const prerender = false;

/** POST /api/admin/guides — create a guide. Admin only. */
export const POST: APIRoute = async ({ request, cookies }) => {
	try {
		const user = await requireAdmin(cookies);
		if (!verifyCsrf(request.headers, cookies)) {
			return jsonError(403, 'Security check failed. Please reload the page and try again.');
		}
		let body: Record<string, unknown>;
		try {
			const parsed: unknown = await request.json();
			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
			body = parsed as Record<string, unknown>;
		} catch {
			return jsonError(400, 'Invalid request body.');
		}
		const input = await parseGuideInput(body);
		const id = await insertGuide(input, user.id);
		await logAudit(user.id, 'guide_created', { title: input.title, slug: input.slug }, getClientIp(request), 'guide', id);
		return new Response(JSON.stringify({ ok: true, id }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
