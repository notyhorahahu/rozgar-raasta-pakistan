import { b as addAttribute, m as maybeRenderHead, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
import { n as effectiveStatus, r as formatDate, t as CATEGORY_LABELS } from "./opportunities_n667ADNq.mjs";
// src/components/OpportunityCard.astro
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$OpportunityCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$OpportunityCard;
	const { opp } = Astro.props;
	const status = effectiveStatus(opp);
	const isOpen = status === "open";
	const domain = (() => {
		try {
			return new URL(opp.sourceUrl).hostname.replace(/^www\./, "");
		} catch {
			return opp.sourceUrl;
		}
	})();
	const initial = opp.organization.trim().charAt(0).toUpperCase();
	const orgShort = opp.organization.replace(/\s*\(.*$/, "").replace(/,.*$/, "");
	const saveId = opp.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
	const btnLabel = opp.type === "job" ? "Apply job" : opp.type === "course" ? "View course" : opp.type === "scholarship" ? "Apply now" : opp.type === "internship" ? "Apply now" : "Read guide";
	return renderTemplate`${maybeRenderHead($$result)}<article class="relative flex min-w-0 flex-col rounded-md border border-line bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"><button type="button" class="save-job absolute right-4 top-4 p-1 text-brand-600 hover:text-brand-700"${addAttribute(saveId, "data-id")}${addAttribute(`Save ${opp.title}`, "aria-label")} aria-pressed="false" title="Save this opportunity"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4.5L4 21V4a1 1 0 0 1 1-1z"></path></svg></button><div class="flex items-start gap-3 pr-7"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-600 text-lg font-extrabold text-white" aria-hidden="true">${initial}</span><div class="min-w-0"><p class="truncate text-sm font-bold text-brand-600">${orgShort}</p><p class="truncate text-xs text-muted">${opp.location}</p></div></div><h3 class="mt-4 text-lg font-extrabold leading-snug text-ink line-clamp-2">${opp.title}</h3><p class="mt-1 text-xs font-medium text-muted">${CATEGORY_LABELS[opp.category]}${!isOpen && renderTemplate`<span class="font-bold text-red-600"> · ${status === "closed" ? "Closed" : "Unverified"}</span>`}</p><p class="mt-2 flex-1 text-sm leading-relaxed text-body line-clamp-3">${opp.eligibility}</p><p class="mt-3 text-sm font-bold text-brand-600">Deadline: ${formatDate(opp.deadline)}</p>${isOpen ? renderTemplate`<a${addAttribute(opp.sourceUrl, "href")} target="_blank" rel="noopener noreferrer" class="mt-3 flex items-center justify-center gap-1 bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700">${btnLabel} <span aria-hidden="true">↗</span></a>` : renderTemplate`<span class="mt-3 flex cursor-not-allowed items-center justify-center gap-1 bg-slate-200 px-4 py-3 text-sm font-bold text-slate-500" aria-disabled="true">${status === "closed" ? "Closed" : "Unverified"}</span>`}<p class="mt-2 text-center text-[11px] text-muted">${opp.status === "open" ? `Verified ${opp.verifiedDate}` : `Last checked ${opp.verifiedDate}`} · Source: ${domain}</p></article>`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/components/OpportunityCard.astro", void 0);
export { $$OpportunityCard as t };
