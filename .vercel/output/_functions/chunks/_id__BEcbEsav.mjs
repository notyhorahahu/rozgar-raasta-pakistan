import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { b as addAttribute, m as maybeRenderHead, o as renderComponent, p as renderTemplate, s as Fragment } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
import { t as $$AdminLayout } from "./AdminLayout_ocTkUVmf.mjs";
import { t as $$GuideForm } from "./GuideForm_D4Ul-Zyb.mjs";
import { t as query } from "./db_DDXrkiRw.mjs";
import { d as getOrSetCsrfToken, l as getAdminUser, t as ADMIN_ROLES } from "./auth_B63A6JLM.mjs";
import { n as EDITOR_ROLES, t as DELETE_ROLES } from "./admin-content_D7UgU4LZ.mjs";
// src/pages/admin/guides/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$Id = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const user = await getAdminUser(Astro.cookies, ADMIN_ROLES);
	if (!user) return Astro.redirect("/admin/login");
	const csrfToken = getOrSetCsrfToken(Astro.cookies);
	const canEdit = EDITOR_ROLES.includes(user.role);
	const canDelete = DELETE_ROLES.includes(user.role);
	const id = Astro.params.id ?? "";
	const guide = (await query(`SELECT id, slug, title, description, category, tags, body, featured,
		published, publish_date, seo_title, seo_description, author, image, image_alt
	 FROM guides WHERE id = $1`, [id])).rows[0] ?? null;
	if (!guide) Astro.response.status = 404;
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"user": user,
		"csrfToken": csrfToken,
		"title": guide ? `Edit — ${guide.title}` : "Guide not found",
		"current": "articles"
	}, { "default": ($$result) => renderTemplate`${!guide ? renderTemplate`${maybeRenderHead($$result)}<div class="rounded-lg border border-line bg-white p-6 shadow-sm"><h2 class="text-lg font-extrabold text-ink">404 — Guide not found</h2><p class="mt-2 text-sm leading-relaxed text-body">No guide exists with this id. It may have been deleted.</p><p class="mt-4 text-sm"><a href="/admin/guides" class="font-semibold text-brand-700 hover:underline">← Back to guides</a></p></div>` : !canEdit ? renderTemplate`<div class="rounded-lg border border-line bg-white p-6 shadow-sm"><h2 class="text-lg font-extrabold text-ink">403 — Forbidden</h2><p class="mt-2 text-sm leading-relaxed text-body">Your account (Viewer role) has read-only access. You can browse the guides list, but you cannot edit guides.</p><p class="mt-4 text-sm"><a href="/admin/guides" class="font-semibold text-brand-700 hover:underline">← Back to guides</a></p></div>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<p class="mb-4 text-sm text-muted"><a href="/admin/guides" class="font-semibold text-brand-700 hover:underline">← All guides</a>${" · "}<a${addAttribute(`/guides/${guide.slug}`, "href")} target="_blank" rel="noopener" class="font-semibold text-brand-700 hover:underline">View public page ↗</a></p>${renderComponent($$result, "GuideForm", $$GuideForm, {
		"guide": guide,
		"csrfToken": csrfToken,
		"canDelete": canDelete
	})}` })}`}` })}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin/guides/[id].astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin/guides/[id].astro";
var $$url = "/admin/guides/[id]";
// \0virtual:astro:page:src/pages/admin/guides/[id]@_@astro
var page = () => _id__exports;
export { page };
