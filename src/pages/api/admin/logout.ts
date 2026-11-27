import type { APIRoute } from 'astro';
import {
	SESSION_COOKIE,
	clearSessionCookie,
	deleteSessionByTokenHash,
	getClientIp,
	getSessionUser,
	hashToken,
	jsonError,
	logAudit,
	toHttpErrorResponse,
	verifyCsrf,
} from '../../../lib/auth';

// Server endpoint — must not be prerendered (Astro 7 prerenders
// endpoints by default under output: "static").
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
	try {
		if (!verifyCsrf(request.headers, cookies)) {
			return jsonError(403, 'Security check failed. Please reload the page and try again.');
		}
		const rawToken = cookies.get(SESSION_COOKIE)?.value;
		const user = await getSessionUser(cookies);
		if (rawToken) {
			await deleteSessionByTokenHash(hashToken(rawToken));
		}
		clearSessionCookie(cookies);
		if (user) {
			await logAudit(user.id, 'logout', { email: user.email }, getClientIp(request));
		}
		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
