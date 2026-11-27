import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { b as addAttribute, m as maybeRenderHead, o as renderComponent, p as renderTemplate, x as defineScriptVars } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
import { t as $$AdminLayout } from "./AdminLayout_ocTkUVmf.mjs";
import { t as query } from "./db_DDXrkiRw.mjs";
import { d as getOrSetCsrfToken, l as getAdminUser, t as ADMIN_ROLES } from "./auth_B63A6JLM.mjs";
import { n as EDITOR_ROLES, r as GUIDE_CATEGORIES, t as DELETE_ROLES } from "./admin-content_D7UgU4LZ.mjs";
// src/pages/admin/guides.astro
var guides_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Guides,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$Guides = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Guides;
	const user = await getAdminUser(Astro.cookies, ADMIN_ROLES);
	if (!user) return Astro.redirect("/admin/login");
	const csrfToken = getOrSetCsrfToken(Astro.cookies);
	const canMutate = EDITOR_ROLES.includes(user.role);
	const canDelete = DELETE_ROLES.includes(user.role);
	const params = Astro.url.searchParams;
	const q = params.get("q")?.trim() ?? "";
	const category = params.get("category") ?? "";
	const publishedFilter = params.get("published") ?? "";
	const flash = params.get("created") ? "Guide created." : params.get("updated") ? "Guide updated." : params.get("deleted") ? "Guide deleted." : null;
	const counts = await query(`SELECT count(*) AS total,
		count(*) FILTER (WHERE published) AS published_c,
		count(*) FILTER (WHERE NOT published) AS unpublished_c,
		count(*) FILTER (WHERE featured) AS featured_c
	 FROM guides`);
	const conditions = [];
	const values = [];
	if (q) {
		values.push(`%${q}%`);
		conditions.push(`(title ILIKE $${values.length} OR slug ILIKE $${values.length})`);
	}
	if (category && GUIDE_CATEGORIES.includes(category)) {
		values.push(category);
		conditions.push(`category = $${values.length}`);
	}
	if (publishedFilter === "true" || publishedFilter === "false") {
		values.push(publishedFilter === "true");
		conditions.push(`published = $${values.length}`);
	}
	const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
	const rows = await query(`SELECT id, title, slug, category, publish_date, published, featured
	 FROM guides ${where} ORDER BY publish_date DESC, created_at DESC`, values);
	const fmtDate = (d) => (/* @__PURE__ */ new Date(`${d}T00:00:00`)).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"user": user,
		"csrfToken": csrfToken,
		"title": "Manage Articles",
		"current": "articles"
	}, { "default": async ($$result) => renderTemplate`${flash && renderTemplate`${maybeRenderHead($$result)}<p class="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">${flash}</p>`}${!canMutate && renderTemplate`<p class="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800" role="note">You have read-only access (Viewer role). You can browse and search, but you cannot create, edit, publish or delete guides.</p>`}<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div class="rounded-lg border border-line bg-white p-4 shadow-sm"><p class="text-2xl font-extrabold text-ink">${Number(counts.rows[0]?.total ?? 0)}</p><p class="mt-1 text-sm text-muted">Total guides</p></div><div class="rounded-lg border border-line bg-white p-4 shadow-sm"><p class="text-2xl font-extrabold text-ink">${Number(counts.rows[0]?.published_c ?? 0)}</p><p class="mt-1 text-sm text-muted">Published</p></div><div class="rounded-lg border border-line bg-white p-4 shadow-sm"><p class="text-2xl font-extrabold text-ink">${Number(counts.rows[0]?.unpublished_c ?? 0)}</p><p class="mt-1 text-sm text-muted">Unpublished</p></div><div class="rounded-lg border border-line bg-white p-4 shadow-sm"><p class="text-2xl font-extrabold text-ink">${Number(counts.rows[0]?.featured_c ?? 0)}</p><p class="mt-1 text-sm text-muted">Featured</p></div></div><div class="mt-6 flex flex-wrap items-center justify-between gap-3"><form method="get" action="/admin/guides" class="flex flex-wrap items-center gap-2" role="search"><label for="q" class="sr-only">Search by title or slug</label><input id="q" name="q" type="search"${addAttribute(q, "value")} placeholder="Search title or slug…" class="w-56 rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"><label for="category" class="sr-only">Category</label><select id="category" name="category" class="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-600"><option value="">All categories</option>${GUIDE_CATEGORIES.map((c) => renderTemplate`<option${addAttribute(c, "value")}${addAttribute(category === c, "selected")}>${c}</option>`)}</select><label for="published" class="sr-only">Published</label><select id="published" name="published" class="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-600"><option value="">Published + unpublished</option><option value="true"${addAttribute(publishedFilter === "true", "selected")}>Published only</option><option value="false"${addAttribute(publishedFilter === "false", "selected")}>Unpublished only</option></select><button type="submit" class="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-black">Filter</button>${(q || category || publishedFilter) && renderTemplate`<a href="/admin/guides" class="rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-50">Clear</a>`}</form>${canMutate && renderTemplate`<a href="/admin/guides/new" class="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">+ New guide</a>`}</div><section class="mt-4 overflow-x-auto rounded-lg border border-line bg-white shadow-sm">${rows.rows.length === 0 ? renderTemplate`<p class="p-6 text-sm">No guides match these filters.</p>` : renderTemplate`<table class="w-full min-w-[820px] text-left text-sm"><thead><tr class="border-b border-line text-xs uppercase tracking-wide text-muted"><th class="px-4 py-3">Title</th><th class="px-4 py-3">Slug</th><th class="px-4 py-3">Category</th><th class="px-4 py-3">Publish date</th><th class="px-4 py-3">Published</th><th class="px-4 py-3">Featured</th><th class="px-4 py-3">Actions</th></tr></thead><tbody>${rows.rows.map((r) => renderTemplate`<tr class="border-b border-line last:border-0 hover:bg-brand-50/40"><td class="max-w-[300px] px-4 py-3 font-medium text-ink">${r.title}</td><td class="max-w-[220px] truncate px-4 py-3 font-mono text-xs">${r.slug}</td><td class="whitespace-nowrap px-4 py-3 capitalize">${r.category}</td><td class="whitespace-nowrap px-4 py-3">${fmtDate(r.publish_date)}</td><td class="whitespace-nowrap px-4 py-3">${r.published ? "Yes" : "No"}</td><td class="whitespace-nowrap px-4 py-3">${r.featured ? "Yes" : "No"}</td><td class="whitespace-nowrap px-4 py-3"><div class="flex items-center gap-2">${canMutate && renderTemplate`<a${addAttribute(`/admin/guides/${r.id}`, "href")} class="font-semibold text-brand-700 hover:underline">Edit</a>`}${canMutate && renderTemplate`<button type="button" class="publish-btn font-semibold text-brand-700 hover:underline"${addAttribute(r.id, "data-id")}${addAttribute(String(r.published), "data-published")}>${r.published ? "Unpublish" : "Publish"}</button>`}${canDelete && renderTemplate`<button type="button" class="delete-btn font-semibold text-red-700 hover:underline"${addAttribute(r.id, "data-id")}${addAttribute(r.title, "data-title")}>Delete</button>`}${r.published && renderTemplate`<a${addAttribute(`/guides/${r.slug}`, "href")} target="_blank" rel="noopener" class="font-semibold text-muted hover:underline">View ↗</a>`}</div></td></tr>`)}</tbody></table>`}</section><p class="mt-3 text-sm text-muted">${rows.rows.length} shown.</p><script>(function(){${defineScriptVars({ csrfToken })}
		const errorAlert = (msg) => alert(msg);
		document.querySelectorAll('.publish-btn').forEach((btn) => {
			btn.addEventListener('click', async () => {
				const id = btn.getAttribute('data-id');
				const currently = btn.getAttribute('data-published') === 'true';
				btn.disabled = true;
				try {
					const res = await fetch(\`/api/admin/guides/\${id}/publish\`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
						body: JSON.stringify({ published: !currently }),
					});
					const data = await res.json().catch(() => ({}));
					if (!res.ok) { errorAlert(data.error || 'Could not change publish state.'); btn.disabled = false; return; }
					window.location.reload();
				} catch {
					errorAlert('Could not reach the server.');
					btn.disabled = false;
				}
			});
		});
		document.querySelectorAll('.delete-btn').forEach((btn) => {
			btn.addEventListener('click', async () => {
				const id = btn.getAttribute('data-id');
				const title = btn.getAttribute('data-title') ?? 'this guide';
				if (!window.confirm(\`Delete "\${title}"? This cannot be undone.\`)) return;
				btn.disabled = true;
				try {
					const res = await fetch(\`/api/admin/guides/\${id}\`, {
						method: 'DELETE',
						headers: { 'x-csrf-token': csrfToken },
					});
					const data = await res.json().catch(() => ({}));
					if (!res.ok) { errorAlert(data.error || 'Could not delete.'); btn.disabled = false; return; }
					window.location.href = '/admin/guides?deleted=1';
				} catch {
					errorAlert('Could not reach the server.');
					btn.disabled = false;
				}
			});
		});
	})();<\/script>` })}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin/guides.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin/guides.astro";
var $$url = "/admin/guides";
// \0virtual:astro:page:src/pages/admin/guides@_@astro
var page = () => guides_exports;
export { page };
