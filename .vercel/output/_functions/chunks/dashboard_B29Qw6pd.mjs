import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
import { t as $$AdminLayout } from "./AdminLayout_ocTkUVmf.mjs";
import { t as query } from "./db_DDXrkiRw.mjs";
import { d as getOrSetCsrfToken, l as getAdminUser, t as ADMIN_ROLES } from "./auth_B63A6JLM.mjs";
import { t as getDashboardCounts } from "./content_GHFQvrqX.mjs";
// src/pages/admin/dashboard.astro
var dashboard_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Dashboard,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Dashboard;
	const user = await getAdminUser(Astro.cookies, ADMIN_ROLES);
	if (!user) return Astro.redirect("/admin/login");
	const csrfToken = getOrSetCsrfToken(Astro.cookies);
	const usersByRole = await query(`SELECT role, count(*) AS count FROM users GROUP BY role ORDER BY count DESC`);
	const totalUsers = usersByRole.rows.reduce((sum, r) => sum + Number(r.count), 0);
	const activeSessions = await query(`SELECT count(*) AS count FROM sessions WHERE expires_at > now()`);
	const recentLogs = await query(`SELECT a.action, u.email, a.ip, a.created_at, a.details
	 FROM audit_logs a LEFT JOIN users u ON u.id = a.user_id
	 ORDER BY a.created_at DESC LIMIT 10`);
	const counts = await getDashboardCounts();
	const contentSource = counts.source === "database" ? "database" : "static fallback";
	const fmtDate = (iso) => new Date(iso).toLocaleString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"user": user,
		"csrfToken": csrfToken,
		"title": "Dashboard Overview",
		"current": "dashboard"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div class="rounded-lg border border-line bg-white p-5 shadow-sm"><p class="text-3xl font-extrabold text-ink">${totalUsers}</p><p class="mt-1 text-sm text-muted">Total users (database)</p></div><div class="rounded-lg border border-line bg-white p-5 shadow-sm"><p class="text-3xl font-extrabold text-ink">${Number(activeSessions.rows[0]?.count ?? 0)}</p><p class="mt-1 text-sm text-muted">Active sessions (database)</p></div><div class="rounded-lg border border-line bg-white p-5 shadow-sm"><p class="text-3xl font-extrabold text-ink">${counts.totalOpportunities}</p><p class="mt-1 text-sm text-muted">Opportunities (${contentSource})</p></div><div class="rounded-lg border border-line bg-white p-5 shadow-sm"><p class="text-3xl font-extrabold text-ink">${counts.totalGuides}</p><p class="mt-1 text-sm text-muted">Guides (${contentSource})</p></div></div><section class="mt-6 rounded-lg border border-line bg-white p-6 shadow-sm"><h2 class="text-lg font-extrabold text-ink">Content — ${contentSource}</h2><p class="mt-1 text-sm text-muted">${counts.source === "database" ? "These numbers are read live from the opportunities and guides tables. Edits in the admin panel appear on the public site immediately." : "The database could not be reached, so these numbers come from the static files (src/data/opportunities.json and the guides collection). The public site is showing the same fallback."}</p><ul class="mt-4 grid gap-2 text-sm sm:grid-cols-2"><li class="flex justify-between border-b border-line pb-2"><span>Total opportunities</span><strong class="text-ink">${counts.totalOpportunities}</strong></li><li class="flex justify-between border-b border-line pb-2"><span>Open opportunities</span><strong class="text-ink">${counts.openOpportunities}</strong></li><li class="flex justify-between border-b border-line pb-2"><span>Closed opportunities</span><strong class="text-ink">${counts.closedOpportunities}</strong></li><li class="flex justify-between border-b border-line pb-2"><span>Unverified opportunities</span><strong class="text-ink">${counts.unverifiedOpportunities}</strong></li><li class="flex justify-between border-b border-line pb-2"><span>Total guides</span><strong class="text-ink">${counts.totalGuides}</strong></li><li class="flex justify-between border-b border-line pb-2"><span>Published guides</span><strong class="text-ink">${counts.publishedGuides}</strong></li><li class="flex justify-between border-b border-line pb-2"><span>Unpublished guides</span><strong class="text-ink">${counts.unpublishedGuides}</strong></li></ul><div class="mt-5 flex flex-wrap gap-3"><a href="/admin/jobs" class="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Manage opportunities →</a><a href="/admin/guides" class="rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-50">Manage guides →</a></div></section><section class="mt-6 rounded-lg border border-line bg-white p-6 shadow-sm"><h2 class="text-lg font-extrabold text-ink">Users by role</h2><p class="mt-1 text-sm text-muted">Real counts from the users table.</p>${usersByRole.rows.length === 0 ? renderTemplate`<p class="mt-4 text-sm">No users yet.</p>` : renderTemplate`<ul class="mt-4 space-y-2 text-sm">${usersByRole.rows.map((r) => renderTemplate`<li class="flex justify-between border-b border-line pb-2"><span class="capitalize">${r.role.replace("_", " ")}</span><strong class="text-ink">${Number(r.count)}</strong></li>`)}</ul>`}</section><section class="mt-6 rounded-lg border border-line bg-white p-6 shadow-sm"><h2 class="text-lg font-extrabold text-ink">Recent security events</h2><p class="mt-1 text-sm text-muted">Latest 10 entries from the audit log (logins, logouts, failed logins, lockouts, content changes).</p>${recentLogs.rows.length === 0 ? renderTemplate`<p class="mt-4 text-sm">No audit log entries yet.</p>` : renderTemplate`<div class="mt-4 overflow-x-auto"><table class="w-full min-w-[560px] text-left text-sm"><thead><tr class="border-b border-line text-xs uppercase tracking-wide text-muted"><th class="py-2 pr-3">When</th><th class="py-2 pr-3">Event</th><th class="py-2 pr-3">User</th><th class="py-2">IP</th></tr></thead><tbody>${recentLogs.rows.map((log) => renderTemplate`<tr class="border-b border-line last:border-0"><td class="py-2 pr-3 whitespace-nowrap">${fmtDate(log.created_at)}</td><td class="py-2 pr-3 font-medium text-ink">${log.action}</td><td class="py-2 pr-3">${log.email ?? "—"}</td><td class="py-2">${log.ip ?? "—"}</td></tr>`)}</tbody></table></div>`}</section><section class="mt-6 rounded-lg border border-dashed border-line bg-white p-6 shadow-sm"><h2 class="text-lg font-extrabold text-ink">More sections — coming soon</h2><p class="mt-1 text-sm leading-relaxed text-muted">Jobs and Articles are live above. The remaining sections are part of the next milestone — nothing here is demo or fake data.</p><ul class="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">${[
		"Manage Categories",
		"Manage CV Builder Templates",
		"Manage Newsletter Subscribers",
		"Manage Contact Messages",
		"Manage Users",
		"SEO Management",
		"Website Settings",
		"Analytics",
		"Security Logs",
		"Admin Profile",
		"Backup and Recovery"
	].map((name) => renderTemplate`<li class="flex items-center justify-between rounded-md bg-cream px-3 py-2"><span class="font-medium text-ink">${name}</span><span class="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">Coming soon</span></li>`)}</ul></section>` })}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin/dashboard.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin/dashboard.astro";
var $$url = "/admin/dashboard";
// \0virtual:astro:page:src/pages/admin/dashboard@_@astro
var page = () => dashboard_exports;
export { page };
