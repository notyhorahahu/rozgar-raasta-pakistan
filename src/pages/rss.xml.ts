import rss from '@astrojs/rss';
import { getGuides } from '../lib/content';
import { slugOf } from '../data/guides';
import type { APIRoute } from 'astro';

// Server-rendered: the feed is built from the database first
// (src/lib/content.ts), with the static collection as fallback.
export const prerender = false;

export const GET: APIRoute = async (context) => {
	const guides = (await getGuides()).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);
	return rss({
		title: 'Rozgar Raasta Pakistan — Latest Articles',
		description: 'Learn Skills. Find Opportunities. Build Your Future. Guides, jobs, courses and scholarships for Pakistanis.',
		site: context.site ?? 'https://rozgar-raasta-pakistan.vercel.app',
		items: guides.map((g) => ({
			title: g.data.title,
			description: g.data.description,
			pubDate: g.data.date,
			link: `/guides/${slugOf(g)}/`,
		})),
	});
};
