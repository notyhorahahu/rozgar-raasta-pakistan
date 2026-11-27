import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as $$CategoryPage } from "./CategoryPage_BJMpxYJG.mjs";
// src/pages/freelancing.astro
var freelancing_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Freelancing,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Freelancing = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "CategoryPage", $$CategoryPage, {
		"heroImage": "/images/cat-freelancing.jpg",
		"heroImageAlt": "A young Pakistani woman freelancing from home on her laptop",
		"title": "Freelancing in Pakistan",
		"description": "How to start freelancing in Pakistan — Fiverr, Upwork, skills, profiles, portfolios and getting paid. Honest, step-by-step guides.",
		"intro": "Freelancing is Pakistan's most realistic online income route — but only with a real skill, a strong profile and patience. Our guides walk you through Fiverr, Upwork, payments and portfolios, step by step.",
		"oppCategories": ["freelancing"],
		"guideCategories": ["freelancing"],
		"guideHeading": "Freelancing Guides",
		"officialLinks": [
			{
				label: "Fiverr",
				href: "https://www.fiverr.com/",
				note: "Create gigs and sell services."
			},
			{
				label: "Upwork",
				href: "https://www.upwork.com/",
				note: "Apply for freelance projects worldwide."
			},
			{
				label: "Freelancer.com",
				href: "https://www.freelancer.com/",
				note: "Bid on freelance projects."
			},
			{
				label: "DigiSkills",
				href: "https://digiskills.pk/",
				note: "Free freelancing training from the Government of Pakistan."
			}
		]
	})}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/freelancing.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/freelancing.astro";
var $$url = "/freelancing";
// \0virtual:astro:page:src/pages/freelancing@_@astro
var page = () => freelancing_exports;
export { page };
