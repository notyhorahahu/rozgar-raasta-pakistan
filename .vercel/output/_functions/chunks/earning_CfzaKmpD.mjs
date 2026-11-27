import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as $$CategoryPage } from "./CategoryPage_BJMpxYJG.mjs";
// src/pages/earning.astro
var earning_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Earning,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Earning = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "CategoryPage", $$CategoryPage, {
		"heroImage": "/images/cat-earning.jpg",
		"heroImageAlt": "A young Pakistani man planning his work at a small home desk with a laptop and notebook",
		"title": "Online Earning in Pakistan",
		"description": "Honest, realistic guides to earning money online in Pakistan — real methods, real risks, no guaranteed income promises.",
		"intro": "Online earning is real — but it is not quick and it is never guaranteed. Here we explain the methods that actually work in Pakistan, what they pay in practice, the fees involved, and the scams to avoid.",
		"oppCategories": ["earning"],
		"guideCategories": ["earning", "freelancing"],
		"guideHeading": "Earning Guides",
		"officialLinks": [
			{
				label: "DigiSkills",
				href: "https://digiskills.pk/",
				note: "Free government training in freelancing skills."
			},
			{
				label: "Upwork",
				href: "https://www.upwork.com/",
				note: "Freelance marketplace."
			},
			{
				label: "Fiverr",
				href: "https://www.fiverr.com/",
				note: "Sell services as gigs."
			},
			{
				label: "How to avoid job scams",
				href: "/guides/how-to-avoid-job-scams-in-pakistan",
				note: "Essential reading before you pay anyone."
			}
		]
	})}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/earning.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/earning.astro";
var $$url = "/earning";
// \0virtual:astro:page:src/pages/earning@_@astro
var page = () => earning_exports;
export { page };
