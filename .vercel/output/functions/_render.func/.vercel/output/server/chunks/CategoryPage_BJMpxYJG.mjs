import { b as addAttribute, m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
import { t as $$BaseLayout } from "./BaseLayout_CnFVHXEZ.mjs";
import { t as $$ArticleCard } from "./ArticleCard_yY2VBqLZ.mjs";
import { t as $$OpportunityCard } from "./OpportunityCard_Dd_sEpJ2.mjs";
import { i as getOpportunities, r as getGuides } from "./content_GHFQvrqX.mjs";
import { i as jobPostingsJsonLd, n as effectiveStatus } from "./opportunities_n667ADNq.mjs";
import { n as organizationJsonLd, t as breadcrumbJsonLd } from "./jsonld_CngpLk9T.mjs";
// src/components/CategoryPage.astro
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$CategoryPage = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CategoryPage;
	const { title, description, intro, oppCategories, guideCategories, officialLinks, guideHeading = "Guides", heroImage, heroImageAlt } = Astro.props;
	const opps = (await getOpportunities()).filter((o) => oppCategories.includes(o.category));
	const openOpps = opps.filter((o) => effectiveStatus(o) === "open");
	const closedOpps = opps.filter((o) => effectiveStatus(o) === "closed");
	const unverifiedOpps = opps.filter((o) => effectiveStatus(o) === "unverified");
	const guides = (await getGuides()).filter((g) => guideCategories.includes(g.data.category));
	const siteUrl = "https://rozgar-raasta-pakistan.vercel.app";
	const pageUrl = `${siteUrl}${Astro.url.pathname}`;
	const jsonLd = [
		organizationJsonLd(siteUrl),
		breadcrumbJsonLd([{
			name: "Home",
			url: `${siteUrl}/`
		}, {
			name: title,
			url: pageUrl
		}]),
		...jobPostingsJsonLd(openOpps)
	];
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": title,
		"description": description,
		"jsonLd": jsonLd
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="bg-cream hero-grid border-b border-black/10"><div class="max-w-7xl mx-auto px-4 py-10 md:py-12 flex flex-col md:flex-row md:items-center gap-8"><div class="flex-1"><h1 class="text-3xl md:text-4xl">${title}</h1><p class="mt-3 max-w-3xl text-base md:text-lg leading-relaxed text-body">${intro}</p></div>${heroImage && renderTemplate`<img${addAttribute(heroImage, "src")}${addAttribute(heroImageAlt ?? title, "alt")} loading="lazy" class="hidden md:block w-72 shrink-0 rounded-md object-cover shadow-sm aspect-[3/2]">`}</div></section><section class="max-w-7xl mx-auto px-4 py-10" aria-label="Verified opportunities"><h2 class="text-2xl md:text-3xl">Verified Opportunities</h2>${openOpps.length > 0 ? renderTemplate`<div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">${openOpps.map((opp) => renderTemplate`${renderComponent($$result, "OpportunityCard", $$OpportunityCard, { "opp": opp })}`)}</div>` : renderTemplate`<div class="mt-6 border border-line bg-brand-50 p-5 text-sm leading-relaxed text-ink"><p class="font-bold">No specific opening is listed here right now.</p><p class="mt-2">We only list openings we have verified on the official website. Use the official portals below — they always carry the latest openings.</p></div>`}${closedOpps.length > 0 && renderTemplate`<details class="mt-8 rounded-md border border-line bg-white p-5"><summary class="cursor-pointer text-sm font-bold text-ink">Closed / expired listings (${closedOpps.length}) — shown for reference only</summary><div class="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">${closedOpps.map((opp) => renderTemplate`${renderComponent($$result, "OpportunityCard", $$OpportunityCard, { "opp": opp })}`)}</div></details>`}${unverifiedOpps.length > 0 && renderTemplate`<details class="mt-8 rounded-md border border-line bg-white p-5"><summary class="cursor-pointer text-sm font-bold text-ink">Unverified listings (${unverifiedOpps.length}) — not yet verified against the official source, shown for reference only</summary><div class="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">${unverifiedOpps.map((opp) => renderTemplate`${renderComponent($$result, "OpportunityCard", $$OpportunityCard, { "opp": opp })}`)}</div></details>`}</section><section class="max-w-7xl mx-auto px-4 py-10" aria-label="Official sources"><h2 class="text-2xl md:text-3xl">Official Sources</h2><p class="mt-2 text-sm text-muted">Always apply through the official website. Rozgar Raasta Pakistan never charges for job information.</p><ul class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">${officialLinks.map((l) => renderTemplate`<li class="rounded-md border border-line bg-white p-4"><a${addAttribute(l.href, "href")} target="_blank" rel="noopener noreferrer" class="font-bold text-brand-700 hover:underline">${l.label} ↗</a>${l.note && renderTemplate`<p class="mt-1 text-sm text-body">${l.note}</p>`}</li>`)}</ul></section>${guides.length > 0 && renderTemplate`<section class="max-w-7xl mx-auto px-4 py-10"${addAttribute(guideHeading, "aria-label")}><h2 class="text-2xl md:text-3xl">${guideHeading}</h2><div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">${guides.map((g) => renderTemplate`${renderComponent($$result, "ArticleCard", $$ArticleCard, { "guide": g })}`)}</div></section>`}` })}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/components/CategoryPage.astro", void 0);
export { $$CategoryPage as t };
