import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as $$CategoryPage } from "./CategoryPage_BJMpxYJG.mjs";
// src/pages/jobs/remote.astro
var remote_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Remote,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Remote = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "CategoryPage", $$CategoryPage, {
		"title": "Remote Jobs for Pakistanis",
		"description": "Remote and work-from-home jobs open to Pakistanis — how to find them, what employers expect, and how to get paid.",
		"intro": "Remote jobs let Pakistanis work for companies anywhere in the world. We explain how remote hiring works, which platforms are real, and how payment works — with no promise of guaranteed income.",
		"oppCategories": ["remote"],
		"guideCategories": ["freelancing", "career"],
		"guideHeading": "Remote Work Guides",
		"officialLinks": [
			{
				label: "LinkedIn Jobs — Remote",
				href: "https://www.linkedin.com/jobs/",
				note: "Filter by Remote to find work-from-anywhere roles."
			},
			{
				label: "Upwork",
				href: "https://www.upwork.com/",
				note: "Freelance marketplace — fees and payment methods explained in our guides."
			},
			{
				label: "Fiverr",
				href: "https://www.fiverr.com/",
				note: "Sell services as gigs; read our Fiverr profile guide first."
			},
			{
				label: "Freelancer.com",
				href: "https://www.freelancer.com/",
				note: "Bid on projects; understand fees before you start."
			}
		]
	})}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/jobs/remote.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/jobs/remote.astro";
var $$url = "/jobs/remote";
// \0virtual:astro:page:src/pages/jobs/remote@_@astro
var page = () => remote_exports;
export { page };
