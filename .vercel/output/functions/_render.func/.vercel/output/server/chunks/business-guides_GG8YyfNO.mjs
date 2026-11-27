import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as $$CategoryPage } from "./CategoryPage_BJMpxYJG.mjs";
// src/pages/business-guides.astro
var business_guides_exports = /* @__PURE__ */ __exportAll({
	default: () => $$BusinessGuides,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$BusinessGuides = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "CategoryPage", $$CategoryPage, {
		"heroImage": "/images/cat-business.jpg",
		"heroImageAlt": "A small online business owner in Pakistan packing a parcel at a home workspace",
		"title": "Business Guides",
		"description": "How to start a small business or online shop in Pakistan — registration, costs, marketing and realistic expectations.",
		"intro": "Starting a small business in Pakistan is possible with modest capital — but it needs a real plan. These guides explain registration, costs, online selling and the risks, honestly.",
		"oppCategories": [],
		"guideCategories": ["business"],
		"guideHeading": "Business Guides",
		"officialLinks": [
			{
				label: "SECP — Company Registration",
				href: "https://www.secp.gov.pk/",
				note: "Register a company or business in Pakistan."
			},
			{
				label: "FBR — Tax Registration",
				href: "https://www.fbr.gov.pk/",
				note: "NTN and tax registration."
			},
			{
				label: "SMEDA",
				href: "https://smeda.org/",
				note: "Small and medium enterprise support and guidance."
			}
		]
	})}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/business-guides.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/business-guides.astro";
var $$url = "/business-guides";
// \0virtual:astro:page:src/pages/business-guides@_@astro
var page = () => business_guides_exports;
export { page };
