import { getGuides, getOpportunities } from '../lib/content';
import { slugOf } from '../data/guides';
import { effectiveStatus } from '../data/opportunities';
import type { APIRoute } from 'astro';

// Server-rendered: the search index is built from the database first
// (src/lib/content.ts), with the static files as fallback.
export const prerender = false;

export const GET: APIRoute = async () => {
	const guides = await getGuides();
	// Only open + verified opportunities are searchable — closed and
	// unverified listings are never offered with an Apply button.
	const opps = (await getOpportunities()).filter((o) => effectiveStatus(o) === 'open');
	const items = [
		...guides.map((g) => ({
			title: g.data.title,
			description: g.data.description,
			url: `/guides/${slugOf(g)}/`,
			type: 'guide',
			category: g.data.category,
			tags: g.data.tags.join(' '),
		})),
		...opps.map((o) => ({
			title: o.title,
			description: `${o.organization} — ${o.location}. ${o.eligibility}`,
			url: o.sourceUrl,
			type: 'opportunity',
			category: o.category,
			tags: '',
			external: true,
		})),
	];
	return new Response(JSON.stringify(items), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
};
