// Hostname-based separation of the public website and the admin panel.
//
// The public website and the admin panel live in the same codebase and
// the same repository, but they are served from DIFFERENT domains:
//   - Public:  https://rozgar-raasta-pakistan.vercel.app
//   - Admin:    https://rozgar-admin.vercel.app (separate Vercel project,
//               same repo, same DATABASE_URL)
//
// This middleware enforces that separation on the server (hiding a link
// is not security — the routes themselves are unreachable from the wrong
// domain):
//   - On the PUBLIC domain: every /admin/* page and /api/admin/* route
//     returns 404. The admin panel simply does not exist there.
//   - On the ADMIN domain: only /admin/* and /api/admin/* are served.
//     Any other path redirects to the same path on the public domain.
//   - Any other hostname (localhost, preview deployments): everything
//     is allowed, so development and preview builds keep working.
//
// Domains are read from env vars (PUBLIC_DOMAIN / ADMIN_DOMAIN) with
// the production domains as fallbacks, so the same code runs in both
// Vercel projects without a rebuild per domain.
import { defineMiddleware } from 'astro:middleware';

const PUBLIC_DOMAIN =
	import.meta.env.PUBLIC_DOMAIN ?? 'rozgar-raasta-pakistan.vercel.app';
const ADMIN_DOMAIN =
	import.meta.env.ADMIN_DOMAIN ?? 'rozgar-admin.vercel.app';

function isAdminPath(pathname: string): boolean {
	return pathname === '/admin' || pathname.startsWith('/admin/');
}

function isAdminApi(pathname: string): boolean {
	return pathname.startsWith('/api/admin/');
}

export const onRequest = defineMiddleware(async (context, next) => {
	const { url } = context;
	const hostname = url.hostname;

	// Admin domain: only admin routes. Everything else goes to public.
	if (hostname === ADMIN_DOMAIN) {
		if (isAdminPath(url.pathname) || isAdminApi(url.pathname)) {
			return next();
		}
		return context.redirect(
			`https://${PUBLIC_DOMAIN}${url.pathname}${url.search}`,
			302,
		);
	}

	// Public domain: admin routes do not exist here.
	if (hostname === PUBLIC_DOMAIN) {
		if (isAdminPath(url.pathname) || isAdminApi(url.pathname)) {
			return new Response('Not found', { status: 404 });
		}
		return next();
	}

	// Any other host (localhost, preview deployments): allow everything.
	return next();
});
