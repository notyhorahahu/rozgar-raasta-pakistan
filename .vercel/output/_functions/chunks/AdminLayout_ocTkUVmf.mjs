import { b as addAttribute, h as renderHead, p as renderTemplate, t as spreadAttributes, u as renderSlot } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
import { t as renderScript } from "./script_vaY0uwzx.mjs";
/* empty css                 */
// src/layouts/AdminLayout.astro
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AdminLayout;
	const { user, csrfToken, title, subtitle, current = null } = Astro.props;
	return renderTemplate`<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>${title} | Rozgar Raasta Pakistan</title><meta name="description" content="Admin panel for Rozgar Raasta Pakistan."><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">${renderHead($$result)}</head><body class="min-h-screen bg-cream font-sans text-body antialiased"><div class="flex min-h-screen"><!-- Sidebar --><aside class="hidden w-64 shrink-0 flex-col bg-ink text-white md:flex"><div class="flex items-center gap-2 px-5 pb-4 pt-6"><img src="/logo-mark.svg" alt="" class="h-8 w-8"><div><p class="text-sm font-extrabold leading-tight tracking-tight">Rozgar Raasta</p><p class="text-[11px] font-semibold uppercase tracking-widest text-brand-500">Admin Panel</p></div></div><nav class="flex-1 overflow-y-auto px-3 pb-4" aria-label="Admin sections"><ul class="space-y-1 text-sm">${[
		{
			name: "Dashboard Overview",
			slug: "dashboard",
			href: "/admin/dashboard"
		},
		{
			name: "Manage Government Jobs",
			slug: "government-jobs",
			href: "/admin/jobs?category=government"
		},
		{
			name: "Manage Private Jobs",
			slug: "private-jobs",
			href: "/admin/jobs?category=private"
		},
		{
			name: "Manage Remote Jobs",
			slug: "remote-jobs",
			href: "/admin/jobs?category=remote"
		},
		{
			name: "Manage Scholarships",
			slug: "scholarships",
			href: "/admin/jobs?category=scholarship"
		},
		{
			name: "Manage Free Courses",
			slug: "free-courses",
			href: "/admin/jobs?category=course"
		},
		{
			name: "Manage Internships",
			slug: "internships",
			href: "/admin/jobs?category=internship"
		},
		{
			name: "Manage Articles",
			slug: "articles",
			href: "/admin/guides"
		},
		{
			name: "Manage Categories",
			slug: "categories"
		},
		{
			name: "Manage AI Tools",
			slug: "ai-tools",
			href: "/admin/jobs?category=ai-tools"
		},
		{
			name: "Manage CV Builder Templates",
			slug: "cv-templates"
		},
		{
			name: "Manage Newsletter Subscribers",
			slug: "newsletter-subscribers"
		},
		{
			name: "Manage Contact Messages",
			slug: "contact-messages"
		},
		{
			name: "Manage Users",
			slug: "users"
		},
		{
			name: "SEO Management",
			slug: "seo"
		},
		{
			name: "Website Settings",
			slug: "settings"
		},
		{
			name: "Analytics",
			slug: "analytics"
		},
		{
			name: "Security Logs",
			slug: "security-logs"
		},
		{
			name: "Admin Profile",
			slug: "profile"
		},
		{
			name: "Backup and Recovery",
			slug: "backup"
		}
	].map((s) => renderTemplate`<li>${s.href ? renderTemplate`<a${addAttribute(s.href, "href")}${addAttribute(`flex items-center justify-between rounded-md px-3 py-2 ${s.slug === current ? "bg-brand-600 font-semibold text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`, "class")}${spreadAttributes(s.slug === current ? { "aria-current": "page" } : {})}>${s.name}</a>` : renderTemplate`<span class="flex items-center justify-between rounded-md px-3 py-2 text-white/70" title="Coming soon — part of the next milestone">${s.name}<span class="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/70">Soon</span></span>`}</li>`)}</ul></nav><div class="border-t border-white/10 px-5 py-4 text-xs leading-relaxed text-white/70"><p class="font-semibold text-white">${user.name ?? user.email}</p><p>${user.email}</p><p class="mt-1 capitalize">Role: ${user.role.replace("_", " ")}</p></div></aside><!-- Main --><div class="flex min-w-0 flex-1 flex-col"><header class="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 sm:px-6"><div class="min-w-0"><h1 class="truncate text-xl font-extrabold text-ink sm:text-2xl">${title}</h1><p class="truncate text-xs text-muted sm:text-sm">${subtitle ?? `Signed in as ${user.email} · ${user.role.replace("_", " ")}`}</p></div><button id="logout-button"${addAttribute(csrfToken, "data-csrf")} class="shrink-0 rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-50">Log out</button></header><!-- Mobile nav (sidebar is hidden below md) --><nav class="flex gap-2 overflow-x-auto border-b border-line bg-white px-4 py-2 text-sm md:hidden" aria-label="Admin sections"><a href="/admin/dashboard" class="shrink-0 rounded-md bg-cream px-3 py-1.5 font-semibold text-ink">Dashboard</a><a href="/admin/jobs" class="shrink-0 rounded-md bg-cream px-3 py-1.5 font-semibold text-ink">Jobs</a><a href="/admin/guides" class="shrink-0 rounded-md bg-cream px-3 py-1.5 font-semibold text-ink">Articles</a></nav><main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">${renderSlot($$result, $$slots["default"])}</main></div></div>${renderScript($$result, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/layouts/AdminLayout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/layouts/AdminLayout.astro", void 0);
export { $$AdminLayout as t };
