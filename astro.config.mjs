// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { readdirSync, readFileSync } from 'node:fs';

// ---------------------------------------------------------------------------
// Sitemap: the public listing + guide pages are server-rendered
// (`prerender = false`) so admin edits appear at once, which means
// @astrojs/sitemap no longer sees them at build time. They are added
// back here via `customPages`.
// - Guide URLs come from the guide files in src/content/guides with the
//   same PKT date gate the site uses (future-dated guides stay out
//   until their publish date). The database holds the same guides;
//   a guide created only in the admin panel joins the sitemap on the
//   next build.
// - Listing pages are a fixed list (their URLs never change).
// ---------------------------------------------------------------------------
const SITE = 'https://rozgar-raasta-pakistan.vercel.app';

function publishedGuideUrls() {
	const todayPKT = new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
	const urls = [];
	for (const file of readdirSync('./src/content/guides')) {
		if (!file.endsWith('.md')) continue;
		const text = readFileSync(`./src/content/guides/${file}`, 'utf-8');
		const date = text.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m)?.[1];
		if (!date || date > todayPKT) continue;
		urls.push(`${SITE}/guides/${file.replace(/\.md$/, '')}/`);
	}
	return urls.sort();
}

const DYNAMIC_PAGES = [
	'/',
	'/opportunities',
	'/guides',
	'/jobs/government',
	'/jobs/private',
	'/jobs/remote',
	'/earning',
	'/freelancing',
	'/skills',
	'/scholarships',
	'/internships',
	'/ai-tools',
	'/student-guides',
	'/business-guides',
	'/career-preparation',
].map((p) => (p === '/' ? `${SITE}/` : `${SITE}${p}/`));

// https://astro.build/config
export default defineConfig({
	site: SITE,
	// Static output (the default) now behaves like the old "hybrid":
	// most public pages prerender to static HTML exactly as before;
	// only pages/routes marked `prerender = false` (the /admin/* pages,
	// /api/* routes, and the DB-backed public pages) run on the server.
	adapter: vercel(),
	integrations: [
		sitemap({
			filter: (page) => !page.includes('/admin'),
			customPages: [...DYNAMIC_PAGES, ...publishedGuideUrls()],
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
