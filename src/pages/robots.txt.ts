import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
	const body = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://rozgar-raasta-pakistan.vercel.app/sitemap-index.xml
`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
