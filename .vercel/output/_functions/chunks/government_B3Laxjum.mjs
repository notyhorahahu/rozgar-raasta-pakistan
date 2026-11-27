import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as $$CategoryPage } from "./CategoryPage_BJMpxYJG.mjs";
// src/pages/jobs/government.astro
var government_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Government,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Government = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "CategoryPage", $$CategoryPage, {
		"title": "Pakistan Government Jobs",
		"description": "Verified Pakistan government jobs from PPSC, FPSC, National Job Portal and Punjab Job Portal — with official application links.",
		"intro": "Government jobs in Pakistan — PPSC, FPSC, federal and provincial departments. Every listing is verified on the official portal before it appears here, and expired advertisements are never shown as open.",
		"oppCategories": ["government"],
		"guideCategories": ["career"],
		"guideHeading": "Career Guides",
		"officialLinks": [
			{
				label: "National Job Portal (NJP)",
				href: "https://njp.gov.pk/",
				note: "Federal government jobs in one place."
			},
			{
				label: "National Employment Exchange",
				href: "https://jobs.gov.pk/",
				note: "Government employment exchange."
			},
			{
				label: "Punjab Public Service Commission",
				href: "https://www.ppsc.gop.pk/",
				note: "Punjab provincial government jobs and advertisements."
			},
			{
				label: "Federal Public Service Commission",
				href: "https://www.fpsc.gov.pk/",
				note: "Federal government jobs and CSS-related recruitment."
			},
			{
				label: "Punjab Job Portal",
				href: "https://jobs.punjab.gov.pk/",
				note: "Punjab government department jobs."
			},
			{
				label: "NAVTTC",
				href: "https://navttc.gov.pk/",
				note: "Free technical and vocational training programmes."
			}
		]
	})}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/jobs/government.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/jobs/government.astro";
var $$url = "/jobs/government";
// \0virtual:astro:page:src/pages/jobs/government@_@astro
var page = () => government_exports;
export { page };
