import type { APIRoute } from 'astro';
import { query } from '../../../../lib/db';
import { parseJobInput, updateJob } from '../../../../lib/admin-content';
import {
	getClientIp,
	jsonError,
	logAudit,
	requireAdmin,
	toHttpErrorResponse,
	verifyCsrf,
} from '../../../../lib/auth';

export const prerender = false;

async function readJson(request: Request): Promise<Record<string, unknown>> {
	try {
		const body: unknown = await request.json();
		if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('not an object');
		return body as Record<string, unknown>;
	} catch {
		throw new Error('Invalid request body.');
	}
}

/** PUT /api/admin/jobs/[id] — update an opportunity. Admin only. */
export const PUT: APIRoute = async ({ request, cookies, params }) => {
	try {
		const user = await requireAdmin(cookies);
		if (!verifyCsrf(request.headers, cookies)) {
			return jsonError(403, 'Security check failed. Please reload the page and try again.');
		}
		const id = params.id ?? '';
		const existing = await query<{ id: string; title: string }>(
			`SELECT id, title FROM opportunities WHERE id = $1`,
			[id],
		);
		if (existing.rows.length === 0) return jsonError(404, 'Opportunity not found.');
		let body: Record<string, unknown>;
		try {
			body = await readJson(request);
		} catch {
			return jsonError(400, 'Invalid request body.');
		}
		const input = parseJobInput(body);
		await updateJob(id, input);
		await logAudit(user.id, 'job_updated', { title: input.title, company: input.company }, getClientIp(request), 'opportunity', id);
		return new Response(JSON.stringify({ ok: true, id }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};

/** DELETE /api/admin/jobs/[id] — delete an opportunity. Admin only. */
export const DELETE: APIRoute = async ({ request, cookies, params }) => {
	try {
		const user = await requireAdmin(cookies);
		if (!verifyCsrf(request.headers, cookies)) {
			return jsonError(403, 'Security check failed. Please reload the page and try again.');
		}
		const id = params.id ?? '';
		const result = await query<{ title: string }>(
			`DELETE FROM opportunities WHERE id = $1 RETURNING title`,
			[id],
		);
		if (result.rows.length === 0) return jsonError(404, 'Opportunity not found.');
		await logAudit(user.id, 'job_deleted', { title: result.rows[0].title }, getClientIp(request), 'opportunity', id);
		return new Response(JSON.stringify({ ok: true, id }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
