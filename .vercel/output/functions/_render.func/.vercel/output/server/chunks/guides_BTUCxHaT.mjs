import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { b as addAttribute, m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as $$BaseLayout } from "./BaseLayout_CnFVHXEZ.mjs";
import { t as $$ArticleCard } from "./ArticleCard_yY2VBqLZ.mjs";
import { r as getGuides } from "./content_GHFQvrqX.mjs";
// src/data/site.ts
var GUIDE_CATEGORIES = [
	{
		slug: "freelancing",
		label: "Freelancing",
		href: "/freelancing",
		blurb: "Start earning online with real skills and honest platform guidance."
	},
	{
		slug: "career",
		label: "Career & CV",
		href: "/career-preparation",
		blurb: "CVs, interviews and career preparation that actually work in Pakistan."
	},
	{
		slug: "student",
		label: "Student Guides",
		href: "/student-guides",
		blurb: "Scholarships, internships and study guidance for Pakistani students."
	},
	{
		slug: "skills",
		label: "Skills & Courses",
		href: "/skills",
		blurb: "Free and affordable courses to build job-ready skills."
	},
	{
		slug: "earning",
		label: "Online Earning",
		href: "/earning",
		blurb: "Realistic, honest guides to earning online — no fake promises."
	},
	{
		slug: "business",
		label: "Business Guides",
		href: "/business-guides",
		blurb: "Start a small business or online shop in Pakistan, step by step."
	},
	{
		slug: "ai-tools",
		label: "AI Tools",
		href: "/ai-tools",
		blurb: "Free AI tools that help students and job seekers work smarter."
	}
];
// src/pages/guides.astro
var guides_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Guides,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Guides = createComponent(async ($$result, $$props, $$slots) => {
	const allGuides = await getGuides();
	const counts = {};
	for (const g of allGuides) counts[g.data.category] = (counts[g.data.category] ?? 0) + 1;
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": "All Guides",
		"description": "Practical, honest guides for Pakistani job seekers, students and freelancers — CVs, interviews, freelancing, scholarships, skills and online earning."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="bg-cream hero-grid border-b border-black/10"><div class="max-w-7xl mx-auto px-4 py-10 md:py-12"><h1 class="text-3xl md:text-4xl">All Guides</h1><p class="mt-3 max-w-3xl text-base md:text-lg leading-relaxed">Practical guides written for Pakistanis — no copied content, no fake promises, no invented credentials. Every guide links to the official source it talks about.</p></div></section><section class="max-w-7xl mx-auto px-4 py-8"><div class="flex flex-wrap gap-2"><a href="/guides" class="bg-ink px-4 py-2 text-sm font-semibold text-white">All (${allGuides.length})</a>${GUIDE_CATEGORIES.map((c) => renderTemplate`<a${addAttribute(c.href, "href")} class="border border-line bg-white px-4 py-2 text-sm font-semibold text-navy-900 hover:border-brand-600">${c.label} (${counts[c.slug] ?? 0})</a>`)}</div><div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">${allGuides.map((g) => renderTemplate`${renderComponent($$result, "ArticleCard", $$ArticleCard, { "guide": g })}`)}</div></section>` })}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/guides.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/guides.astro";
var $$url = "/guides";
// \0virtual:astro:page:src/pages/guides@_@astro
var page = () => guides_exports;
export { page };
