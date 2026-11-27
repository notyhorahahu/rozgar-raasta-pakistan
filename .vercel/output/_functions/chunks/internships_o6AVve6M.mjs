import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as $$CategoryPage } from "./CategoryPage_BJMpxYJG.mjs";
// src/pages/internships.astro
var internships_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Internships,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Internships = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "CategoryPage", $$CategoryPage, {
		"title": "Internships for Fresh Graduates",
		"description": "Internships for fresh graduates in Pakistan — how to find them, how to apply, and what to expect.",
		"intro": "An internship is the fastest way from a degree to a first job. We explain where real internships are advertised, how to apply, and how to make the most of one.",
		"oppCategories": ["internship"],
		"guideCategories": ["student", "career"],
		"guideHeading": "Student & Career Guides",
		"officialLinks": [
			{
				label: "National Job Portal (NJP)",
				href: "https://njp.gov.pk/",
				note: "Government internships are often listed here."
			},
			{
				label: "LinkedIn Jobs",
				href: "https://www.linkedin.com/jobs/",
				note: "Search \"internship Pakistan\" for company programmes."
			},
			{
				label: "How to apply for internships",
				href: "/guides/how-to-apply-for-internships-in-pakistan",
				note: "Step-by-step application guide."
			}
		]
	})}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/internships.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/internships.astro";
var $$url = "/internships";
// \0virtual:astro:page:src/pages/internships@_@astro
var page = () => internships_exports;
export { page };
