import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as $$CategoryPage } from "./CategoryPage_BJMpxYJG.mjs";
// src/pages/jobs/private.astro
var private_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Private,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Private = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "CategoryPage", $$CategoryPage, {
		"title": "Private Jobs in Pakistan",
		"description": "Verified private-sector jobs in Pakistan — how to find genuine openings, apply safely and avoid job scams.",
		"intro": "Private jobs across Pakistan's banks, telecom, IT, manufacturing and services sectors. We link only to the employer's own careers page or a trusted official listing — never to a paid middleman.",
		"oppCategories": ["private"],
		"guideCategories": ["career"],
		"guideHeading": "Career Guides",
		"officialLinks": [
			{
				label: "LinkedIn Jobs — Pakistan",
				href: "https://www.linkedin.com/jobs/",
				note: "Search verified employer postings; apply on the employer site."
			},
			{
				label: "National Job Portal (NJP)",
				href: "https://njp.gov.pk/",
				note: "Also lists some private-sector openings."
			},
			{
				label: "How to avoid job scams",
				href: "/guides/how-to-avoid-job-scams-in-pakistan",
				note: "Read this before paying anyone for a job."
			}
		]
	})}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/jobs/private.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/jobs/private.astro";
var $$url = "/jobs/private";
// \0virtual:astro:page:src/pages/jobs/private@_@astro
var page = () => private_exports;
export { page };
