import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { i as getOpportunities, o as slugOf, r as getGuides } from "./content_GHFQvrqX.mjs";
import { n as effectiveStatus } from "./opportunities_n667ADNq.mjs";
// src/pages/search-index.json.ts
var search_index_json_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	const guides = await getGuides();
	const opps = (await getOpportunities()).filter((o) => effectiveStatus(o) === "open");
	const items = [...guides.map((g) => ({
		title: g.data.title,
		description: g.data.description,
		url: `/guides/${slugOf(g)}/`,
		type: "guide",
		category: g.data.category,
		tags: g.data.tags.join(" ")
	})), ...opps.map((o) => ({
		title: o.title,
		description: `${o.organization} — ${o.location}. ${o.eligibility}`,
		url: o.sourceUrl,
		type: "opportunity",
		category: o.category,
		tags: "",
		external: true
	}))];
	return new Response(JSON.stringify(items), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
// \0virtual:astro:page:src/pages/search-index.json@_@ts
var page = () => search_index_json_exports;
export { page };
