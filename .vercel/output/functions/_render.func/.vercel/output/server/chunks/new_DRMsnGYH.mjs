import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { m as maybeRenderHead, o as renderComponent, p as renderTemplate, s as Fragment } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
import { t as $$AdminLayout } from "./AdminLayout_ocTkUVmf.mjs";
import { t as $$JobForm } from "./JobForm_Clybm5Kn.mjs";
import { d as getOrSetCsrfToken, l as getAdminUser, t as ADMIN_ROLES } from "./auth_B63A6JLM.mjs";
import { n as EDITOR_ROLES, t as DELETE_ROLES } from "./admin-content_D7UgU4LZ.mjs";
// src/pages/admin/jobs/new.astro
var new_exports = /* @__PURE__ */ __exportAll({
	default: () => $$New,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$New = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$New;
	const user = await getAdminUser(Astro.cookies, ADMIN_ROLES);
	if (!user) return Astro.redirect("/admin/login");
	if (!EDITOR_ROLES.includes(user.role)) Astro.response.status = 403;
	const csrfToken = getOrSetCsrfToken(Astro.cookies);
	const canDelete = DELETE_ROLES.includes(user.role);
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"user": user,
		"csrfToken": csrfToken,
		"title": "New Opportunity"
	}, { "default": ($$result) => renderTemplate`${EDITOR_ROLES.includes(user.role) ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<p class="mb-4 text-sm text-muted"><a href="/admin/jobs" class="font-semibold text-brand-700 hover:underline">← All opportunities</a></p>${renderComponent($$result, "JobForm", $$JobForm, {
		"csrfToken": csrfToken,
		"canDelete": canDelete
	})}` })}` : renderTemplate`<div class="rounded-lg border border-line bg-white p-6 shadow-sm"><h2 class="text-lg font-extrabold text-ink">403 — Forbidden</h2><p class="mt-2 text-sm leading-relaxed text-body">Your account (Viewer role) has read-only access. You can browse the opportunities list, but you cannot create opportunities.</p><p class="mt-4 text-sm"><a href="/admin/jobs" class="font-semibold text-brand-700 hover:underline">← Back to opportunities</a></p></div>`}` })}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin/jobs/new.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin/jobs/new.astro";
var $$url = "/admin/jobs/new";
// \0virtual:astro:page:src/pages/admin/jobs/new@_@astro
var page = () => new_exports;
export { page };
