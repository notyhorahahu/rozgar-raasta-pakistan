import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import rss from "@astrojs/rss";
import { o as slugOf, r as getGuides } from "./content_GHFQvrqX.mjs";
// src/pages/rss.xml.ts
var rss_xml_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async (context) => {
	const guides = (await getGuides()).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
	return rss({
		title: "Rozgar Raasta Pakistan — Latest Articles",
		description: "Learn Skills. Find Opportunities. Build Your Future. Guides, jobs, courses and scholarships for Pakistanis.",
		site: context.site ?? "https://rozgar-raasta-pakistan.vercel.app",
		items: guides.map((g) => ({
			title: g.data.title,
			description: g.data.description,
			pubDate: g.data.date,
			link: `/guides/${slugOf(g)}/`
		}))
	});
};
// \0virtual:astro:page:src/pages/rss.xml@_@ts
var page = () => rss_xml_exports;
export { page };
