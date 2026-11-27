import { C as unescapeHTML, b as addAttribute, h as renderHead, m as maybeRenderHead, o as renderComponent, p as renderTemplate, u as renderSlot } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
import { t as renderScript } from "./script_vaY0uwzx.mjs";
/* empty css                 */
// src/components/Header.astro
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$Header = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Header;
	const navItems = [
		{
			label: "Home",
			href: "/"
		},
		{
			label: "Browse Jobs",
			href: "/opportunities"
		},
		{
			label: "Scholarships",
			href: "/scholarships"
		},
		{
			label: "Guides",
			href: "/guides"
		},
		{
			label: "CV Builder",
			href: "/cv-builder"
		}
	];
	const moreLinks = [
		{
			label: "Government Jobs",
			href: "/jobs/government"
		},
		{
			label: "Private Jobs",
			href: "/jobs/private"
		},
		{
			label: "Remote Jobs",
			href: "/jobs/remote"
		},
		{
			label: "Internships",
			href: "/internships"
		},
		{
			label: "Freelancing",
			href: "/freelancing"
		},
		{
			label: "Skills & Courses",
			href: "/skills"
		},
		{
			label: "Online Earning",
			href: "/earning"
		},
		{
			label: "Student Guides",
			href: "/student-guides"
		},
		{
			label: "Business Guides",
			href: "/business-guides"
		},
		{
			label: "Career Preparation",
			href: "/career-preparation"
		},
		{
			label: "AI Tools",
			href: "/ai-tools"
		},
		{
			label: "About Us",
			href: "/about"
		},
		{
			label: "Contact Us",
			href: "/contact"
		},
		{
			label: "Advertise With Us",
			href: "/advertise"
		}
	];
	const current = Astro.url.pathname;
	const isActive = (href) => href === "/" ? current === "/" : current === href || current.startsWith(href + "/");
	return renderTemplate`${maybeRenderHead($$result)}<header class="bg-cream border-b border-black/10"><div class="max-w-7xl mx-auto px-4"><div class="flex items-center justify-between gap-4 py-4"><a href="/" class="flex items-center gap-2.5 shrink-0" aria-label="Rozgar Raasta Pakistan — Home"><img src="/logo-mark.svg" alt="" class="h-9 w-9 shrink-0" width="36" height="36"><span class="text-[15px] sm:text-lg font-extrabold leading-none text-ink">Rozgar Raasta Pakistan</span></a><nav class="hidden lg:block" aria-label="Main navigation"><ul class="flex items-center gap-7">${navItems.map((item) => renderTemplate`<li><a${addAttribute(item.href, "href")}${addAttribute(isActive(item.href) ? "page" : void 0, "aria-current")}${addAttribute(`text-sm ${isActive(item.href) ? "font-bold text-ink border-b-[3px] border-brand-600 pb-1" : "font-medium text-muted hover:text-ink"}`, "class")}>${item.label}</a></li>`)}<li class="relative group"><button type="button" class="text-sm font-medium text-muted hover:text-ink" aria-haspopup="true">More ▾</button><ul class="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block group-focus-within:block bg-white border border-line shadow-lg py-2 w-56 z-50">${moreLinks.map((item) => renderTemplate`<li><a${addAttribute(item.href, "href")} class="block px-4 py-2 text-sm font-medium text-ink hover:bg-cream hover:text-brand-700">${item.label}</a></li>`)}</ul></li></ul></nav><div class="flex items-center gap-5"><a href="/cv-builder" class="hidden md:inline-block text-sm font-bold text-ink hover:text-brand-700">CV Builder</a><a href="/opportunities" class="hidden sm:inline-block bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Find Jobs</a><a href="/search" class="lg:hidden p-2 text-ink" aria-label="Search"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path stroke-linecap="round" d="M21 21l-4.3-4.3"></path></svg></a><button id="menu-btn" type="button" class="p-2 text-ink lg:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"></path></svg></button></div></div></div><!-- Mobile menu --><div id="mobile-menu" class="hidden lg:hidden border-t border-black/10 bg-cream" aria-label="Mobile navigation"><div class="max-w-7xl mx-auto px-4 py-4"><form action="/search" method="get" role="search" class="flex items-center"><label for="mobile-search" class="sr-only">Search jobs, courses and guides</label><input id="mobile-search" type="search" name="q" placeholder="Find your dream job" class="w-full border border-line border-r-0 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"><button type="submit" class="bg-brand-600 px-5 py-2.5 text-sm font-bold text-white">Go</button></form><ul class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1">${[...navItems, ...moreLinks].map((item) => renderTemplate`<li><a${addAttribute(item.href, "href")}${addAttribute(`block px-3 py-2 text-sm font-medium ${isActive(item.href) ? "font-bold text-brand-700" : "text-ink hover:text-brand-700"}`, "class")}>${item.label}</a></li>`)}</ul><a href="/opportunities" class="mt-4 block bg-brand-600 px-5 py-3 text-center text-sm font-bold text-white">Find Jobs</a></div></div></header>${renderScript($$result, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/components/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/components/Header.astro", void 0);
// src/components/Footer.astro
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	const navLinks = [
		{
			label: "Home",
			href: "/"
		},
		{
			label: "Opportunities",
			href: "/opportunities"
		},
		{
			label: "Government Jobs",
			href: "/jobs/government"
		},
		{
			label: "Guides",
			href: "/guides"
		},
		{
			label: "CV Builder",
			href: "/cv-builder"
		},
		{
			label: "Contact Us",
			href: "/contact"
		}
	];
	const companyLinks = [
		{
			label: "Privacy Policy",
			href: "/privacy"
		},
		{
			label: "Terms & Conditions",
			href: "/terms"
		},
		{
			label: "Disclaimer",
			href: "/disclaimer"
		},
		{
			label: "Editorial Policy",
			href: "/editorial-policy"
		},
		{
			label: "Corrections Policy",
			href: "/corrections-policy"
		},
		{
			label: "Advertise With Us",
			href: "/advertise"
		}
	];
	const learnLinks = [
		{
			label: "Freelancing",
			href: "/freelancing"
		},
		{
			label: "Skills & Courses",
			href: "/skills"
		},
		{
			label: "Online Earning",
			href: "/earning"
		},
		{
			label: "AI Tools",
			href: "/ai-tools"
		},
		{
			label: "Scholarships",
			href: "/scholarships"
		},
		{
			label: "Student Guides",
			href: "/student-guides"
		}
	];
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return renderTemplate`${maybeRenderHead($$result)}<!-- Newsletter --><section class="border-t border-line bg-white" aria-label="Newsletter"><div class="max-w-7xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-2 md:items-center"><div><h2 class="text-ink text-2xl font-extrabold">Be first to know about new opportunities</h2><p class="mt-2 text-sm text-body">Leave your email and we will add email updates soon. For now, your address is saved only on this device — no emails are sent yet. No spam, no selling your data.</p></div><form id="newsletter-form" class="flex flex-col sm:flex-row gap-0" novalidate><label for="newsletter-email" class="sr-only">Email address</label><input id="newsletter-email" type="email" name="email" required placeholder="Your email address" class="flex-1 border border-line border-b-0 sm:border-b sm:border-r-0 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-600"><button type="submit" class="bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700">Subscribe</button></form><p id="newsletter-msg" class="md:col-span-2 text-sm text-emerald-700 hidden" role="status"></p></div></section><footer class="bg-[#101010] text-[#9a9a9a]"><div class="max-w-7xl mx-auto px-4 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"><div><a href="/" class="flex items-center gap-2.5"><img src="/logo-mark.svg" alt="" class="h-9 w-9 shrink-0" width="36" height="36"><span class="text-base font-extrabold leading-none text-white">Rozgar Raasta Pakistan</span></a><p class="mt-4 text-sm leading-relaxed">Learn Skills. Find Opportunities. Build Your Future. Genuine jobs, free courses, scholarships and practical career guidance for Pakistanis.</p><p class="mt-3 text-xs">We never charge for job listings and never ask for CNIC or bank details.</p><div class="mt-5 flex items-center gap-3"><a href="https://www.facebook.com/profile.php?id=61596652844442" target="_blank" rel="noopener noreferrer" aria-label="Rozgar Raasta Pakistan on Facebook" class="text-white hover:text-brand-500"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg></a><a href="https://www.pinterest.com/calchub_/" target="_blank" rel="noopener noreferrer" aria-label="Rozgar Raasta Pakistan on Pinterest" class="text-white hover:text-brand-500"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.749-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641 0 12.017 0z"></path></svg></a></div></div><nav aria-label="Navigation"><h3 class="text-white font-bold mb-4">Navigation</h3><ul class="space-y-2.5 text-sm">${navLinks.map((l) => renderTemplate`<li><a${addAttribute(l.href, "href")} class="text-[#9a9a9a] hover:text-white">${l.label}</a></li>`)}</ul></nav><nav aria-label="Company"><h3 class="text-white font-bold mb-4">Company</h3><ul class="space-y-2.5 text-sm">${companyLinks.map((l) => renderTemplate`<li><a${addAttribute(l.href, "href")} class="text-[#9a9a9a] hover:text-white">${l.label}</a></li>`)}</ul></nav><nav aria-label="Learning"><h3 class="text-white font-bold mb-4">Learning</h3><ul class="space-y-2.5 text-sm">${learnLinks.map((l) => renderTemplate`<li><a${addAttribute(l.href, "href")} class="text-[#9a9a9a] hover:text-white">${l.label}</a></li>`)}</ul></nav></div><div class="border-t border-white/10"><div class="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"><p>All opportunities are verified against official sources. Always confirm details on the official website before applying.</p><p>Copyright © ${year} Rozgar Raasta Pakistan</p></div></div></footer>${renderScript($$result, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/components/Footer.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/components/Footer.astro", void 0);
// node_modules/@vercel/analytics/dist/astro/index.astro
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$Index = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const propsStr = JSON.stringify(Astro.props);
	const paramsStr = JSON.stringify(Astro.params);
	return renderTemplate`${renderComponent($$result, "vercel-analytics", "vercel-analytics", {
		"data-props": propsStr,
		"data-params": paramsStr,
		"data-pathname": Astro.url.pathname
	})}${renderScript($$result, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/node_modules/@vercel/analytics/dist/astro/index.astro", void 0);
// src/layouts/BaseLayout.astro
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { title, description, canonical, ogImage = "/og-default.svg", type = "website", publishedTime, modifiedTime, jsonLd, noindex = false } = Astro.props;
	const siteUrl = Astro.site?.toString().replace(/\/$/, "") ?? "https://rozgar-raasta-pakistan.vercel.app";
	const canonicalUrl = canonical ?? new URL(Astro.url.pathname, siteUrl).toString();
	const fullTitle = title === "Rozgar Raasta Pakistan" ? "Rozgar Raasta Pakistan — Jobs, Scholarships & Freelancing in Pakistan" : `${title} | Rozgar Raasta Pakistan`;
	const defaultJsonLd = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Rozgar Raasta Pakistan",
		url: siteUrl,
		logo: `${siteUrl}/logo.svg`,
		slogan: "Learn Skills. Find Opportunities. Build Your Future.",
		sameAs: []
	};
	return renderTemplate`<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${fullTitle}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonicalUrl, "href")}>${noindex && renderTemplate`<meta name="robots" content="noindex, nofollow">`}<link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta property="og:type"${addAttribute(type, "content")}><meta property="og:site_name" content="Rozgar Raasta Pakistan"><meta property="og:title"${addAttribute(fullTitle, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonicalUrl, "content")}><meta property="og:image"${addAttribute(`${siteUrl}${ogImage}`, "content")}><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(fullTitle, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(`${siteUrl}${ogImage}`, "content")}>${publishedTime && renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>`}${modifiedTime && renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedTime, "content")}>`}<link rel="alternate" type="application/rss+xml" title="Rozgar Raasta Pakistan — Latest Articles" href="/rss.xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet"><script type="application/ld+json">${unescapeHTML(JSON.stringify(jsonLd ?? defaultJsonLd))}<\/script>${renderComponent($$result, "Analytics", $$Index, {})}${renderHead($$result)}</head><body class="min-h-screen flex flex-col">${renderComponent($$result, "Header", $$Header, {})}<main class="flex-1">${renderSlot($$result, $$slots["default"])}</main>${renderComponent($$result, "Footer", $$Footer, {})}${renderScript($$result, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/layouts/BaseLayout.astro", void 0);
export { $$BaseLayout as t };
