import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as $$CategoryPage } from "./CategoryPage_BJMpxYJG.mjs";
// src/pages/scholarships.astro
var scholarships_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Scholarships,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Scholarships = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "CategoryPage", $$CategoryPage, {
		"heroImage": "/images/cat-student.jpg",
		"heroImageAlt": "Pakistani university students studying together at a library table",
		"title": "Scholarships for Pakistani Students",
		"description": "Scholarships for Pakistani students — HEC, provincial funds and international programmes. Verified official links only, no invented deadlines.",
		"intro": "Scholarships can fund your education in Pakistan or abroad. We list programmes with links to the official body, and we never invent deadlines — always confirm the current status on the official website.",
		"oppCategories": ["scholarship"],
		"guideCategories": ["student"],
		"guideHeading": "Student Guides",
		"officialLinks": [
			{
				label: "Higher Education Commission (HEC)",
				href: "https://www.hec.gov.pk/",
				note: "Pakistan's main scholarship body."
			},
			{
				label: "Punjab Educational Endowment Fund (PEEF)",
				href: "https://www.peef.org.pk/",
				note: "Scholarships for Punjab students."
			},
			{
				label: "Chevening Scholarships",
				href: "https://www.chevening.org/",
				note: "UK government scholarships for future leaders."
			},
			{
				label: "Commonwealth Scholarships",
				href: "https://cscuk.fcdo.gov.uk/",
				note: "UK Commonwealth scholarships."
			}
		]
	})}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/scholarships.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/scholarships.astro";
var $$url = "/scholarships";
// \0virtual:astro:page:src/pages/scholarships@_@astro
var page = () => scholarships_exports;
export { page };
