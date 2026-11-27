import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as $$BaseLayout } from "./BaseLayout_CnFVHXEZ.mjs";
import { t as $$OpportunityCard } from "./OpportunityCard_Dd_sEpJ2.mjs";
import { i as getOpportunities } from "./content_GHFQvrqX.mjs";
import { i as jobPostingsJsonLd, n as effectiveStatus } from "./opportunities_n667ADNq.mjs";
import { n as organizationJsonLd, t as breadcrumbJsonLd } from "./jsonld_CngpLk9T.mjs";
// src/pages/opportunities.astro
var opportunities_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Opportunities,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Opportunities = createComponent(async ($$result, $$props, $$slots) => {
	const openOpps = (await getOpportunities()).filter((o) => effectiveStatus(o) === "open");
	const siteUrl = "https://rozgar-raasta-pakistan.vercel.app";
	const jsonLd = [
		organizationJsonLd(siteUrl),
		breadcrumbJsonLd([{
			name: "Home",
			url: `${siteUrl}/`
		}, {
			name: "Latest Opportunities",
			url: `${siteUrl}/opportunities`
		}]),
		...jobPostingsJsonLd(openOpps)
	];
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": "Latest Opportunities",
		"description": "All verified jobs, courses, scholarships and internships in Pakistan — checked against official sources.",
		"jsonLd": jsonLd
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="bg-cream hero-grid border-b border-black/10"><div class="max-w-7xl mx-auto px-4 py-10 md:py-12"><h1 class="text-3xl md:text-4xl">Latest Opportunities</h1><p class="mt-3 max-w-3xl text-base md:text-lg leading-relaxed text-body">Every verified opportunity in one place — government jobs, private jobs, remote work, free courses, scholarships and internships. We never list an expired opening as active.</p></div></section><section class="max-w-7xl mx-auto px-4 py-10"><div class="flex flex-wrap gap-2" role="group" aria-label="Filter by category"><a href="/opportunities" class="bg-ink px-4 py-2 text-sm font-bold text-white">All</a><a href="/jobs/government" class="border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-brand-600">Government</a><a href="/jobs/private" class="border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-brand-600">Private</a><a href="/jobs/remote" class="border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-brand-600">Remote</a><a href="/skills" class="border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-brand-600">Courses</a><a href="/scholarships" class="border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-brand-600">Scholarships</a><a href="/internships" class="border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-brand-600">Internships</a></div>${openOpps.length > 0 ? renderTemplate`<div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">${openOpps.map((opp) => renderTemplate`${renderComponent($$result, "OpportunityCard", $$OpportunityCard, { "opp": opp })}`)}</div>` : renderTemplate`<p class="mt-6 border border-line bg-brand-50 p-5 text-sm text-ink">No specific opening is verified right now. Check the official portals: <a href="https://jobs.gov.pk/" target="_blank" rel="noopener" class="font-semibold underline">jobs.gov.pk</a> · <a href="https://njp.gov.pk/" target="_blank" rel="noopener" class="font-semibold underline">njp.gov.pk</a> · <a href="https://www.ppsc.gop.pk/" target="_blank" rel="noopener" class="font-semibold underline">ppsc.gop.pk</a> · <a href="https://www.fpsc.gov.pk/" target="_blank" rel="noopener" class="font-semibold underline">fpsc.gov.pk</a></p>`}</section>` })}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/opportunities.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/opportunities.astro";
var $$url = "/opportunities";
// \0virtual:astro:page:src/pages/opportunities@_@astro
var page = () => opportunities_exports;
export { page };
