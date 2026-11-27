import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as $$CategoryPage } from "./CategoryPage_BJMpxYJG.mjs";
// src/pages/career-preparation.astro
var career_preparation_exports = /* @__PURE__ */ __exportAll({
	default: () => $$CareerPreparation,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$CareerPreparation = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "CategoryPage", $$CategoryPage, {
		"heroImage": "/images/cat-career.jpg",
		"heroImageAlt": "A job interview in a modest office in Pakistan",
		"title": "Career Preparation",
		"description": "CV writing, interview preparation, cover letters and career planning for Pakistani job seekers.",
		"intro": "A good CV and a calm interview can change your career. These guides show you exactly how to write a CV, prepare for interviews and plan your next step — with examples that work in Pakistan.",
		"oppCategories": [],
		"guideCategories": ["career"],
		"guideHeading": "Career Guides",
		"officialLinks": [
			{
				label: "CV Builder",
				href: "/cv-builder",
				note: "Build a professional CV in your browser, free."
			},
			{
				label: "National Job Portal (NJP)",
				href: "https://njp.gov.pk/",
				note: "Apply for federal government jobs."
			},
			{
				label: "LinkedIn Jobs",
				href: "https://www.linkedin.com/jobs/",
				note: "Build a profile employers actually find."
			}
		]
	})}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/career-preparation.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/career-preparation.astro";
var $$url = "/career-preparation";
// \0virtual:astro:page:src/pages/career-preparation@_@astro
var page = () => career_preparation_exports;
export { page };
