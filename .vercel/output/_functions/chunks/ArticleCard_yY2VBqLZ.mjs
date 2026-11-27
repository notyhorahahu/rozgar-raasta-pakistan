import { b as addAttribute, m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
import { o as slugOf } from "./content_GHFQvrqX.mjs";
// src/components/CategoryThumb.astro
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$CategoryThumb = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CategoryThumb;
	const { category, label, class: className = "" } = Astro.props;
	const images = {
		"freelancing": "/images/cat-freelancing.jpg",
		"career": "/images/cat-career.jpg",
		"student": "/images/cat-student.jpg",
		"skills": "/images/cat-skills.jpg",
		"earning": "/images/cat-earning.jpg",
		"business": "/images/cat-business.jpg",
		"ai-tools": "/images/cat-ai-tools.jpg",
		"scholarship": "/images/cat-student.jpg",
		"course": "/images/cat-skills.jpg",
		"government": "/images/cat-career.jpg",
		"private": "/images/cat-career.jpg",
		"remote": "/images/cat-freelancing.jpg",
		"internship": "/images/cat-career.jpg"
	};
	const image = images[category] ?? images["career"];
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(`relative overflow-hidden bg-grey-bg ${className}`, "class")} role="img"${addAttribute(`${label} — Rozgar Raasta Pakistan`, "aria-label")}><img${addAttribute(image, "src")} alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover"><div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/5" aria-hidden="true"></div><div class="relative flex h-full flex-col items-start justify-end p-4"><span class="text-base font-bold leading-snug text-white">${label}</span></div></div>`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/components/CategoryThumb.astro", void 0);
// src/components/ArticleCard.astro
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$ArticleCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ArticleCard;
	const { guide } = Astro.props;
	const { title, description, category, updated } = guide.data;
	const href = `/guides/${slugOf(guide)}`;
	const shown = new Date(updated).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
	return renderTemplate`${maybeRenderHead($$result)}<article class="group flex min-w-0 flex-col overflow-hidden rounded-md border border-line bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"><a${addAttribute(href, "href")} class="block" tabindex="-1" aria-hidden="true">${renderComponent($$result, "CategoryThumb", $$CategoryThumb, {
		"category": category,
		"label": title,
		"class": "aspect-[16/9] w-full"
	})}</a><div class="flex flex-1 flex-col p-5"><div class="flex items-center gap-2 text-xs"><span class="bg-brand-50 px-2.5 py-1 font-bold capitalize text-brand-700">${category.replace("-", " ")}</span><time${addAttribute(new Date(updated).toISOString(), "datetime")} class="text-muted">${shown}</time></div><h3 class="mt-3 text-lg font-extrabold leading-snug text-ink"><a${addAttribute(href, "href")} class="text-ink group-hover:text-brand-700 group-hover:underline">${title}</a></h3><p class="mt-2 flex-1 text-sm leading-relaxed text-body line-clamp-3">${description}</p><a${addAttribute(href, "href")} class="mt-4 flex items-center justify-center bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700">Read guide</a></div></article>`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/components/ArticleCard.astro", void 0);
export { $$ArticleCard as t };
