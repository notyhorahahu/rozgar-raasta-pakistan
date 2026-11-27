// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
	site: 'https://rozgar-raasta-pakistan.vercel.app',
	// Static output (the default) now behaves like the old "hybrid":
	// public pages prerender to static HTML exactly as before; only
	// pages/routes marked `prerender = false` (the /admin/* pages
	// and /api/* routes) run on the server.
	adapter: vercel(),
	integrations: [
		sitemap({
			filter: (page) => !page.includes('/admin'),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
