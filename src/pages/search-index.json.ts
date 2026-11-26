import { getCollection } from 'astro:content';
import opportunitiesData from '../data/opportunities.json';
import { slugOf } from '../data/guides';
import type { APIRoute } from 'astro';
import type { Opportunity } from '../data/opportunities';

export const GET: APIRoute = async () => {
	const guides = await getCollection('guides');
	const opps = opportunitiesData as Opportunity[];
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
