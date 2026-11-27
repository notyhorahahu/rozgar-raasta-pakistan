import type { APIRoute } from 'astro';
import { insertJob, parseJobInput } from '../../../lib/admin-content';
import {
	getClientIp,
	jsonError,
	logAudit,
	requireAdmin,
	toHttpErrorResponse,
	verifyCsrf,
} from '../../../lib/auth';

// Server endpoints — must not be prerendered.
export const prerender = false;

async function readJson(request: Request): Promise<Record<string, unknown>> {
	try {
		const body: unknown = await request.json();
		if (!body || typeof body !== 'object' || Array.isArray(body)) {
			throw new Error('not an object');
		}
		return body as Record<string, unknown>;
	} catch {
		throw new Error('Invalid request body.');
	}
}

/** POST /api/admin/jobs — create an opportunity. Admin only. */
export const POST: APIRoute = async ({ request, cookies }) => {
	try {
		const user = await requireAdmin(cookies);
		if (!verifyCsrf(request.headers, cookies)) {
			return jsonError(403, 'Security check failed. Please reload the page and try again.');
		}
		let body: Record<string, unknown>;
		try {
			body = await readJson(request);
		} catch {
			return jsonError(400, 'Invalid request body.');
		}
		const input = parseJobInput(body);
		const id = await insertJob(input, user.id);
		await logAudit(user.id, 'job_created', { title: input.title, company: input.company }, getClientIp(request), 'opportunity', id);
		return new Response(JSON.stringify({ ok: true, id }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
