import type { APIRoute } from 'astro';
import { ADMIN_ROLES, requireAdmin, toHttpErrorResponse } from '../../../lib/auth';

// Server endpoint — must not be prerendered (Astro 7 prerenders
// endpoints by default under output: "static").
export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
	try {
		const user = await requireAdmin(cookies, ADMIN_ROLES);
		return new Response(
			JSON.stringify({
				ok: true,
				user: { id: user.id, email: user.email, name: user.name, role: user.role },
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } },
		);
	} catch (err) {
		return toHttpErrorResponse(err);
	}
};
