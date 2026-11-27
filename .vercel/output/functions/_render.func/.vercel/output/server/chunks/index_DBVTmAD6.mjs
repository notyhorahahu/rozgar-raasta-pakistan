import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { b as addAttribute, m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as renderScript } from "./script_vaY0uwzx.mjs";
import { t as $$BaseLayout } from "./BaseLayout_CnFVHXEZ.mjs";
import { t as $$ArticleCard } from "./ArticleCard_yY2VBqLZ.mjs";
import { t as $$OpportunityCard } from "./OpportunityCard_Dd_sEpJ2.mjs";
import { i as getOpportunities, o as slugOf, r as getGuides } from "./content_GHFQvrqX.mjs";
import { n as effectiveStatus } from "./opportunities_n667ADNq.mjs";
// src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => ""
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const allGuides = await getGuides();
	const opps = await getOpportunities();
	const openOpps = opps.filter((o) => effectiveStatus(o) === "open");
	const openPct = Math.round(openOpps.length / opps.length * 100);
	const openJobs = openOpps.filter((o) => o.type === "job");
	const latestJobs = openJobs.slice(0, 7);
	const hiringNow = [];
	for (const o of openJobs) {
		if (!hiringNow.some((h) => h.organization === o.organization)) hiringNow.push(o);
		if (hiringNow.length >= 3) break;
	}
	const courses = opps.filter((o) => o.category === "course").slice(0, 4);
	const scholarships = opps.filter((o) => o.category === "scholarship").slice(0, 4);
	const freelancingGuides = allGuides.filter((g) => g.data.category === "freelancing").slice(0, 3);
	const aiGuides = allGuides.filter((g) => g.data.category === "ai-tools").slice(0, 3);
	const latestArticles = allGuides.slice(0, 6);
	const latestSlugs = new Set(latestArticles.map((g) => slugOf(g)));
	const popular = [...allGuides.filter((g) => g.data.featured && !latestSlugs.has(slugOf(g))), ...allGuides.filter((g) => !g.data.featured && !latestSlugs.has(slugOf(g)) && (g.data.category === "career" || g.data.category === "earning"))].slice(0, 4);
	const countFor = (cat) => allGuides.filter((g) => g.data.category === cat).length;
	const tiles = [
		{
			slug: "freelancing",
			label: "Freelancing",
			href: "/freelancing",
			img: "/images/cat-freelancing.jpg"
		},
		{
			slug: "career",
			label: "Career & CV",
			href: "/career-preparation",
			img: "/images/cat-career.jpg"
		},
		{
			slug: "student",
			label: "Student Guides",
			href: "/student-guides",
			img: "/images/cat-student.jpg"
		},
		{
			slug: "skills",
			label: "Skills & Courses",
			href: "/skills",
			img: "/images/cat-skills.jpg"
		},
		{
			slug: "earning",
			label: "Online Earning",
			href: "/earning",
			img: "/images/cat-earning.jpg"
		}
	];
	const officialSources = [
		{
			name: "National Job Portal",
			domain: "njp.gov.pk",
			href: "https://njp.gov.pk/"
		},
		{
			name: "National Employment Exchange",
			domain: "jobs.gov.pk",
			href: "https://jobs.gov.pk/"
		},
		{
			name: "Punjab Public Service Commission",
			domain: "ppsc.gop.pk",
			href: "https://www.ppsc.gop.pk/"
		},
		{
			name: "Federal Public Service Commission",
			domain: "fpsc.gov.pk",
			href: "https://www.fpsc.gov.pk/"
		},
		{
			name: "Higher Education Commission",
			domain: "hec.gov.pk",
			href: "https://www.hec.gov.pk/"
		},
		{
			name: "DigiSkills",
			domain: "digiskills.pk",
			href: "https://digiskills.pk/"
		},
		{
			name: "NAVTTC",
			domain: "navttc.gov.pk",
			href: "https://navttc.gov.pk/"
		},
		{
			name: "Punjab Job Portal",
			domain: "jobs.punjab.gov.pk",
			href: "https://jobs.punjab.gov.pk/"
		}
	];
	const trustSlides = [
		{
			quote: "Every opportunity is verified on the official source before it is listed.",
			fact: `${opps.length} opportunities · ${openOpps.length} currently open`
		},
		{
			quote: "No fees. No fake jobs. We never ask for CNIC or bank details.",
			fact: `${allGuides.length} free guides · Official sources only`
		},
		{
			quote: "Learn a skill, build a CV, and apply with confidence.",
			fact: "Freelancing · Courses · Scholarships · Career guides"
		}
	];
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": "Rozgar Raasta Pakistan",
		"description": "Find genuine government and private jobs, remote work, freelancing guides, free courses, scholarships and internships in Pakistan — verified from official sources.",
		"jsonLd": {
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: "Rozgar Raasta Pakistan",
			url: "https://rozgar-raasta-pakistan.vercel.app",
			description: "Learn Skills. Find Opportunities. Build Your Future.",
			potentialAction: {
				"@type": "SearchAction",
				target: "https://rozgar-raasta-pakistan.vercel.app/search?q={search_term_string}",
				"query-input": "required name=search_term_string"
			}
		}
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="bg-cream hero-grid border-b border-black/10"><div class="max-w-7xl mx-auto px-4 py-12 md:py-16 grid gap-12 lg:grid-cols-2 lg:items-center"><div><p class="inline-block bg-brand-600 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white rounded-full">Pakistan's Job Finder</p><h1 class="mt-5 text-[44px] leading-[1.04] sm:text-6xl lg:text-[64px]">Find your<br>career path<br>in Pakistan</h1><p class="mt-5 max-w-md text-sm md:text-base leading-relaxed text-body">Genuine government and private jobs, free courses, scholarships and freelancing guides — every listing verified on the official source. No fake jobs. No fees to apply.</p><form action="/search" method="get" role="search" class="mt-7 flex max-w-md items-center"><label for="hero-search" class="sr-only">Search jobs, courses and guides</label><input id="hero-search" type="search" name="q" placeholder="Find your dream job" class="w-full border border-line border-r-0 bg-white px-4 py-3.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-brand-600"><button type="submit" class="bg-brand-600 px-6 py-3.5 text-sm md:text-base font-bold text-white hover:bg-brand-700">Go</button></form><div class="mt-8 flex items-center gap-3"><div class="flex shrink-0"><img src="/images/hero-home.jpg" alt="" class="h-9 w-9 rounded-full border-2 border-cream object-cover"><img src="/images/cat-freelancing.jpg" alt="" class="-ml-2 h-9 w-9 rounded-full border-2 border-cream object-cover"><img src="/images/cat-career.jpg" alt="" class="-ml-2 h-9 w-9 rounded-full border-2 border-cream object-cover"></div><div><p class="text-lg font-extrabold leading-none text-brand-600">${openOpps.length}</p><p class="mt-1 text-xs text-muted">verified opportunities listed</p></div></div></div><!-- Photo collage + stat cards --><div class="relative"><div class="grid gap-0"><div class="bg-sky-panel p-3"><img src="/images/hero-home.jpg" alt="A young Pakistani man working on his laptop at a simple desk by a window" loading="eager" class="aspect-[16/10] w-full object-cover"></div><div class="bg-pink-panel p-3"><img src="/images/cat-career.jpg" alt="A Pakistani professional preparing for a job interview" loading="lazy" class="aspect-[16/10] w-full object-cover"></div></div><!-- Applicants / open-rate card --><div class="shadow-hard mt-4 w-full max-w-[280px] bg-brand-600 p-5 text-white md:absolute md:left-[-24px] md:top-6 md:mt-0 md:w-56"><p class="flex items-center gap-2 text-xs font-bold"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"></path></svg>${opps.length} opportunities</p><div class="mt-4 flex items-center gap-4"><svg viewBox="0 0 100 100" class="h-24 w-24 shrink-0" role="img"${addAttribute(`${openPct}% of opportunities are currently open`, "aria-label")}><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="10"></circle><circle cx="50" cy="50" r="40" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round"${addAttribute(`${openPct / 100 * 251.33} 251.33`, "stroke-dasharray")} transform="rotate(-90 50 50)"></circle><text x="50" y="48" text-anchor="middle" fill="#ffffff" font-size="20" font-weight="800">${openPct}%</text><text x="50" y="64" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="9" font-weight="600">Open now</text></svg><p class="text-xs leading-relaxed text-white/90">${openOpps.length} of ${opps.length} listings are open now.</p></div></div><!-- Now hiring card --><div class="shadow-hard mt-4 w-full max-w-[280px] bg-brand-600 p-5 text-white md:absolute md:bottom-8 md:right-[-8px] md:mt-0 md:w-60"><p class="text-sm font-bold">Now hiring</p><ul class="mt-3 space-y-3">${hiringNow.map((o) => renderTemplate`<li class="flex items-center gap-3"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-extrabold text-white" aria-hidden="true">${o.organization.trim().charAt(0).toUpperCase()}</span><span class="min-w-0"><span class="block truncate text-sm font-bold">${o.organization.replace(/ \(via.*$/, "").replace(/,.*$/, "")}</span><span class="block truncate text-xs text-white/80">${o.title.split(" — ")[0].slice(0, 40)}</span></span></li>`)}</ul></div></div></div></section><section class="max-w-7xl mx-auto px-4 py-16" aria-label="Browse by category"><h2 class="text-center text-3xl md:text-4xl">One platform, every opportunity</h2><div class="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-6">${tiles.map((t, i) => renderTemplate`<a${addAttribute(t.href, "href")}${addAttribute(`group relative block overflow-hidden ${i === 0 ? "col-span-2 h-[300px] sm:h-[360px] lg:col-span-2 lg:h-[460px]" : "h-[300px] sm:h-[360px] lg:h-[460px]"}`, "class")}><img${addAttribute(t.img, "src")} alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"><div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" aria-hidden="true"></div>${i === 0 ? renderTemplate`<div class="absolute bottom-0 left-0 right-0 p-5"><h3 class="text-2xl font-extrabold leading-tight text-white">${t.label}</h3><p class="mt-1 text-sm text-white/85">${countFor(t.slug)} guides</p></div>` : renderTemplate`<div class="absolute inset-0 flex items-end justify-center pb-6"><span class="vertical-title text-2xl lg:text-[28px] font-extrabold tracking-wide text-white">${t.label}</span></div>`}</a>`)}</div><p class="mt-6 text-center text-sm text-muted">More:<a href="/business-guides" class="font-semibold text-ink hover:text-brand-700">Business Guides</a> ·<a href="/ai-tools" class="font-semibold text-ink hover:text-brand-700">AI Tools</a> ·<a href="/opportunities" class="font-semibold text-ink hover:text-brand-700">All Opportunities →</a></p></section><section class="max-w-7xl mx-auto px-4 py-8" aria-label="Latest verified jobs"><div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><h2 class="text-3xl md:text-4xl leading-tight">Latest verified<br>jobs for you.</h2><p class="max-w-xs text-sm leading-relaxed text-muted">Verified openings for you. Choose a job that suits your skills — every listing links to the official source.</p></div>${latestJobs.length > 0 ? renderTemplate`<div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">${latestJobs.map((opp) => renderTemplate`${renderComponent($$result, "OpportunityCard", $$OpportunityCard, { "opp": opp })}`)}<a href="/opportunities" class="group flex flex-col rounded-md bg-brand-600 p-6 text-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"><h3 class="text-2xl font-extrabold leading-snug text-white">Want to see more jobs in Pakistan?</h3><span class="mt-auto pt-8"><span class="block bg-ink px-5 py-3 text-center text-sm font-bold text-white group-hover:bg-black">See more jobs.</span></span></a></div>` : renderTemplate`<p class="mt-8 border border-line bg-brand-50 p-5 text-sm text-ink">We are verifying today's openings against the official portals. Meanwhile, browse the official portals directly:<a href="https://jobs.gov.pk/" target="_blank" rel="noopener" class="font-semibold underline">jobs.gov.pk</a> ·<a href="https://njp.gov.pk/" target="_blank" rel="noopener" class="font-semibold underline">njp.gov.pk</a> ·<a href="https://www.ppsc.gop.pk/" target="_blank" rel="noopener" class="font-semibold underline">ppsc.gop.pk</a> ·<a href="https://www.fpsc.gov.pk/" target="_blank" rel="noopener" class="font-semibold underline">fpsc.gov.pk</a></p>`}</section><section class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 gap-10 lg:grid-cols-2" aria-label="Courses and scholarships"><div><div class="flex items-end justify-between gap-4"><h2 class="text-2xl md:text-3xl">Free Courses</h2><a href="/skills" class="shrink-0 text-sm font-bold text-brand-700 hover:underline">View all →</a></div>${courses.length > 0 ? renderTemplate`<div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">${courses.map((opp) => renderTemplate`${renderComponent($$result, "OpportunityCard", $$OpportunityCard, { "opp": opp })}`)}</div>` : renderTemplate`<p class="mt-6 border border-line bg-brand-50 p-5 text-sm text-ink">Free courses from DigiSkills, NAVTTC, Coursera, Google Skillshop and Microsoft Learn are being verified.<a href="/skills" class="font-semibold underline">See the Skills &amp; Courses page</a>.</p>`}</div><div><div class="flex items-end justify-between gap-4"><h2 class="text-2xl md:text-3xl">Scholarships</h2><a href="/scholarships" class="shrink-0 text-sm font-bold text-brand-700 hover:underline">View all →</a></div>${scholarships.length > 0 ? renderTemplate`<div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">${scholarships.map((opp) => renderTemplate`${renderComponent($$result, "OpportunityCard", $$OpportunityCard, { "opp": opp })}`)}</div>` : renderTemplate`<p class="mt-6 border border-line bg-brand-50 p-5 text-sm text-ink">Scholarship programmes from HEC and other official bodies are being verified.<a href="/scholarships" class="font-semibold underline">See the Scholarships page</a>.</p>`}</div></section><section class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 gap-10 lg:grid-cols-2" aria-label="Freelancing and AI tools guides"><div><div class="flex items-end justify-between gap-4"><h2 class="text-2xl md:text-3xl">Freelancing Guides</h2><a href="/freelancing" class="shrink-0 text-sm font-bold text-brand-700 hover:underline">View all →</a></div><div class="mt-6 grid gap-5 sm:grid-cols-1">${freelancingGuides.map((g) => renderTemplate`${renderComponent($$result, "ArticleCard", $$ArticleCard, { "guide": g })}`)}</div></div><div><div class="flex items-end justify-between gap-4"><h2 class="text-2xl md:text-3xl">AI Tools</h2><a href="/ai-tools" class="shrink-0 text-sm font-bold text-brand-700 hover:underline">View all →</a></div><div class="mt-6 grid gap-5 sm:grid-cols-1">${aiGuides.map((g) => renderTemplate`${renderComponent($$result, "ArticleCard", $$ArticleCard, { "guide": g })}`)}</div></div></section><section class="max-w-7xl mx-auto px-4 py-8" aria-label="Latest articles"><div class="flex items-end justify-between gap-4"><h2 class="text-2xl md:text-3xl">Latest Articles</h2><a href="/guides" class="shrink-0 text-sm font-bold text-brand-700 hover:underline">All guides →</a></div><div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">${latestArticles.map((g) => renderTemplate`${renderComponent($$result, "ArticleCard", $$ArticleCard, { "guide": g })}`)}</div></section>${popular.length > 0 && renderTemplate`<section class="max-w-7xl mx-auto px-4 py-8" aria-label="Popular guides"><h2 class="text-2xl md:text-3xl">Popular Guides</h2><div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">${popular.map((g) => renderTemplate`${renderComponent($$result, "ArticleCard", $$ArticleCard, { "guide": g })}`)}</div></section>`}<section class="bg-brand-600 stripes mt-8" aria-label="Why Rozgar Raasta Pakistan"><div class="max-w-4xl mx-auto px-4 py-14 text-center"><img src="/logo-mark.svg" alt="" class="mx-auto h-10 w-10" width="40" height="40"><p class="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-white/85">Rozgar Raasta Pakistan</p><div id="trust-slides" class="mt-6">${trustSlides.map((s, i) => renderTemplate`<div${addAttribute(`trust-slide ${i === 0 ? "" : "hidden"}`, "class")}${addAttribute(i, "data-slide")}><p class="text-2xl md:text-[32px] font-extrabold leading-snug text-white">${s.quote}</p><p class="mt-4 text-sm text-white/80">${s.fact}</p></div>`)}</div><div class="mt-8 flex items-center justify-center gap-2" role="tablist" aria-label="Trust statements">${trustSlides.map((_, i) => renderTemplate`<button type="button"${addAttribute(`trust-dot h-1 ${i === 0 ? "w-8 bg-white" : "w-2 bg-white/50"}`, "class")}${addAttribute(i, "data-dot")}${addAttribute(`Show statement ${i + 1}`, "aria-label")}></button>`)}</div></div></section><section class="bg-grey-bg" aria-label="Official sources"><div class="max-w-7xl mx-auto px-4 py-14"><h2 class="text-center text-2xl md:text-3xl">More than <span class="text-brand-600">${opps.length}</span> opportunities from official sources</h2><div class="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">${officialSources.map((s) => renderTemplate`<a${addAttribute(s.href, "href")} target="_blank" rel="noopener noreferrer" class="group text-center"><span class="block text-base font-extrabold leading-snug text-ink group-hover:text-brand-700">${s.name}</span><span class="mt-1 block text-xs text-muted">${s.domain}</span></a>`)}</div></div></section><section class="bg-cta-navy topo" aria-label="Get started"><div class="max-w-3xl mx-auto px-4 py-16 text-center"><h2 class="text-3xl md:text-4xl leading-tight text-white">Find your dream job<br>in Pakistan</h2><p class="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70">Browse verified jobs, free courses and scholarships — no fees, no fake listings. Start with the latest openings, or learn a skill first.</p><a href="/opportunities" class="mt-7 inline-block bg-brand-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-brand-700">Start now</a></div></section>` })}${renderScript($$result, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/index.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/index.astro";
// \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
export { page };
