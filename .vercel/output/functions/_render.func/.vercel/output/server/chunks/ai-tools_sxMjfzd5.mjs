import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as $$CategoryPage } from "./CategoryPage_BJMpxYJG.mjs";
// src/pages/ai-tools.astro
var ai_tools_exports = /* @__PURE__ */ __exportAll({
	default: () => $$AiTools,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$AiTools = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "CategoryPage", $$CategoryPage, {
		"heroImage": "/images/cat-ai-tools.jpg",
		"heroImageAlt": "A young Pakistani student using a laptop with an AI assistant, taking notes",
		"title": "AI Tools for Students and Job Seekers",
		"description": "Free AI tools that help Pakistani students and job seekers — CV writing, learning, research and productivity.",
		"intro": "AI tools can speed up learning, CV writing and job searching — if you use them honestly and check their output. We list genuinely free tools and explain their limits.",
		"oppCategories": ["ai-tools"],
		"guideCategories": ["ai-tools"],
		"guideHeading": "AI Tools Guides",
		"officialLinks": [
			{
				label: "Google Skillshop — AI courses",
				href: "https://skillshop.withgoogle.com/",
				note: "Free Google AI and digital skills training."
			},
			{
				label: "Microsoft Learn — AI",
				href: "https://learn.microsoft.com/",
				note: "Free AI learning paths."
			},
			{
				label: "Khan Academy — AI",
				href: "https://www.khanacademy.org/",
				note: "Free learning with AI-powered tutoring."
			}
		]
	})}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/ai-tools.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/ai-tools.astro";
var $$url = "/ai-tools";
// \0virtual:astro:page:src/pages/ai-tools@_@astro
var page = () => ai_tools_exports;
export { page };
