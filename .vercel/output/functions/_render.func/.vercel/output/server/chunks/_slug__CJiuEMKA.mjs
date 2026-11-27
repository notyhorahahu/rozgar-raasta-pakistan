import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { C as unescapeHTML, b as addAttribute, m as maybeRenderHead, o as renderComponent, p as renderTemplate, s as Fragment } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
import { t as renderScript } from "./script_vaY0uwzx.mjs";
import { t as $$BaseLayout } from "./BaseLayout_CnFVHXEZ.mjs";
import { t as $$ArticleCard } from "./ArticleCard_yY2VBqLZ.mjs";
import { a as renderGuideBody, n as getGuideBySlug, o as slugOf, r as getGuides, s as render } from "./content_GHFQvrqX.mjs";
import { t as breadcrumbJsonLd } from "./jsonld_CngpLk9T.mjs";
// src/pages/guides/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	const slug = Astro.params.slug ?? "";
	const guide = await getGuideBySlug(slug);
	if (!guide) Astro.response.status = 404;
	const siteUrl = "https://rozgar-raasta-pakistan.vercel.app";
	let Content = null;
	let bodyHtml = null;
	if (guide?.source === "collection" && guide.collectionEntry) ({Content} = await render(guide.collectionEntry));
	else if (guide) bodyHtml = renderGuideBody(guide.body);
	const title = guide?.data.title ?? "Guide not found";
	const description = guide?.data.description ?? "This guide does not exist or is no longer published.";
	const category = guide?.data.category ?? "";
	const date = guide?.data.date ?? /* @__PURE__ */ new Date(0);
	const updated = guide?.data.updated ?? /* @__PURE__ */ new Date(0);
	const author = guide?.data.author ?? "Rozgar Raasta Team";
	const image = guide?.data.image;
	const imageAlt = guide?.data.imageAlt;
	const video = guide?.data.video;
	const videoTitle = guide?.data.videoTitle;
	const videoChannel = guide?.data.videoChannel;
	const videoUrl = guide?.data.videoUrl;
	const videoNote = guide?.data.videoNote;
	const allGuides = guide ? (await getGuides()).filter((g) => slugOf(g) !== slugOf(guide) && (g.data.category === category || g.data.tags.some((t) => guide.data.tags.includes(t)))).sort((a, b) => b.data.updated.valueOf() - a.data.updated.valueOf()).slice(0, 3) : [];
	const fmt = (d) => d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric"
	});
	const jsonLd = guide ? [{
		"@context": "https://schema.org",
		"@type": "Article",
		headline: title,
		description,
		author: {
			"@type": "Organization",
			name: author
		},
		publisher: {
			"@type": "Organization",
			name: "Rozgar Raasta Pakistan",
			logo: {
				"@type": "ImageObject",
				url: "https://rozgar-raasta-pakistan.vercel.app/logo.svg"
			}
		},
		datePublished: date.toISOString(),
		dateModified: updated.toISOString(),
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `https://rozgar-raasta-pakistan.vercel.app/guides/${slugOf(guide)}`
		},
		...image ? { image: `${siteUrl}${image}` } : {},
		...video ? { video: {
			"@type": "VideoObject",
			name: videoTitle ?? `Watch: ${title}`,
			description: videoNote ?? description,
			thumbnailUrl: image ? `${siteUrl}${image}` : `${siteUrl}/og-default.svg`,
			contentUrl: `${siteUrl}${video}`,
			uploadDate: date.toISOString().split("T")[0]
		} } : {}
	}, breadcrumbJsonLd([
		{
			name: "Home",
			url: `${siteUrl}/`
		},
		{
			name: "Guides",
			url: `${siteUrl}/guides`
		},
		{
			name: title,
			url: `${siteUrl}/guides/${slugOf(guide)}`
		}
	])] : [];
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": title,
		"description": description,
		"type": "article",
		"publishedTime": guide ? date.toISOString() : void 0,
		"modifiedTime": guide ? updated.toISOString() : void 0,
		"jsonLd": jsonLd
	}, { "default": ($$result) => renderTemplate`${!guide ? renderTemplate`${maybeRenderHead($$result)}<article class="max-w-3xl mx-auto px-4 py-16"><h1 class="text-3xl md:text-4xl leading-tight">Guide not found</h1><p class="mt-4 text-lg leading-relaxed text-body">This guide does not exist, or it has been unpublished. Browse the <a href="/guides" class="font-semibold text-brand-700 hover:underline">full guides list</a> to find what you were looking for.</p></article>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<article class="max-w-3xl mx-auto px-4 py-10"><nav aria-label="Breadcrumb" class="text-sm text-muted"><a href="/" class="hover:underline">Home</a> / <a href="/guides" class="hover:underline">Guides</a> / <span class="text-navy-900 capitalize">${category.replace("-", " ")}</span></nav><h1 class="mt-4 text-3xl md:text-4xl leading-tight">${title}</h1><p class="mt-4 text-lg leading-relaxed text-body">${description}</p><div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-3 text-sm text-muted"><span>By <strong class="text-navy-900">${author}</strong></span><span>Published <time${addAttribute(date.toISOString(), "datetime")}>${fmt(date)}</time></span><span>Last verified <time${addAttribute(updated.toISOString(), "datetime")}>${fmt(updated)}</time></span><span class="bg-brand-50 px-2.5 py-1 font-semibold capitalize text-brand-700">${category.replace("-", " ")}</span></div>${image && renderTemplate`<figure class="mt-6"><img${addAttribute(image, "src")}${addAttribute(imageAlt ?? title, "alt")} loading="lazy" class="w-full rounded-md object-cover shadow-sm"></figure>`}${Content ? renderTemplate`<div class="prose-rrp mt-6">${renderComponent($$result, "Content", Content, {})}</div>` : renderTemplate`<div class="prose-rrp mt-6">${unescapeHTML(bodyHtml)}</div>`}${video && renderTemplate`<section class="mt-10" aria-label="Watch: how to apply"><h2 class="text-2xl md:text-3xl">Watch: how to apply</h2><div class="mt-4 overflow-hidden rounded-md border border-line bg-black shadow-sm"><video controls preload="metadata"${addAttribute(image, "poster")} class="aspect-video w-full"><source${addAttribute(video, "src")} type="video/mp4">Your browser does not support the video player. You can watch the original video on YouTube instead.</video></div><p class="mt-3 text-sm leading-relaxed text-body">${videoTitle && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<strong class="text-navy-900">${videoTitle}</strong>${videoChannel && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate` — ${videoChannel}` })}`}. ` })}`}${videoNote}${videoUrl && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate` Clip taken from the original video: <a${addAttribute(videoUrl, "href")} target="_blank" rel="noopener noreferrer" class="font-semibold text-brand-700 hover:underline">watch the full video on YouTube ↗</a>.` })}`}</p></section>`}<div class="mt-10 rounded-md border border-line bg-brand-50 p-5"><h2 class="text-lg">Share this guide</h2><p class="mt-1 text-sm text-body">Help someone else find a real opportunity — share the link, not a screenshot.</p><div class="mt-3 flex flex-wrap gap-2"><a${addAttribute(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://rozgar-raasta-pakistan.vercel.app/guides/${slugOf(guide)}`)}`, "href")} target="_blank" rel="noopener noreferrer" class=" bg-[#1877f2] px-4 py-2 text-sm font-semibold text-white">Share on Facebook</a><a${addAttribute(`https://www.reddit.com/submit?url=${encodeURIComponent(`https://rozgar-raasta-pakistan.vercel.app/guides/${slugOf(guide)}`)}&title=${encodeURIComponent(title)}`, "href")} target="_blank" rel="noopener noreferrer" class=" bg-[#ff4500] px-4 py-2 text-sm font-semibold text-white">Share on Reddit</a><a${addAttribute(`https://www.quora.com/share?url=${encodeURIComponent(`https://rozgar-raasta-pakistan.vercel.app/guides/${slugOf(guide)}`)}`, "href")} target="_blank" rel="noopener noreferrer" class=" bg-[#b92b27] px-4 py-2 text-sm font-semibold text-white">Share on Quora</a><button id="copy-link" type="button" class=" border border-line bg-white px-4 py-2 text-sm font-semibold text-navy-900">Copy link</button></div><p id="copy-msg" class="mt-2 hidden text-sm text-emerald-700" role="status">Link copied to clipboard.</p></div></article>${allGuides.length > 0 && renderTemplate`<section class="max-w-7xl mx-auto px-4 pb-10" aria-label="Related articles"><h2 class="text-2xl md:text-3xl">Related Articles</h2><div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">${allGuides.map((g) => renderTemplate`${renderComponent($$result, "ArticleCard", $$ArticleCard, { "guide": g })}`)}</div></section>`}` })}`}` })}${renderScript($$result, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/guides/[slug].astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/guides/[slug].astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/guides/[slug].astro";
var $$url = "/guides/[slug]";
// \0virtual:astro:page:src/pages/guides/[slug]@_@astro
var page = () => _slug__exports;
export { page };
