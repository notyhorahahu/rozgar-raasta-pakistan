import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { m as maybeRenderHead, o as renderComponent, p as renderTemplate, s as Fragment } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
import { t as $$AdminLayout } from "./AdminLayout_ocTkUVmf.mjs";
import { t as $$JobForm } from "./JobForm_Clybm5Kn.mjs";
import { t as query } from "./db_DDXrkiRw.mjs";
import { d as getOrSetCsrfToken, l as getAdminUser, t as ADMIN_ROLES } from "./auth_B63A6JLM.mjs";
import { n as EDITOR_ROLES, t as DELETE_ROLES } from "./admin-content_D7UgU4LZ.mjs";
// src/pages/admin/jobs/[id].astro
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
	const job = (await query(`SELECT id, title, company, department, location, province, education,
		qualification, experience, salary, job_type, category, type, deadline,
		source_url, source_domain, description, eligibility, procedure, fees,
		verified_date, required_documents, verification_status, status, published
	 FROM opportunities WHERE id = $1`, [id])).rows[0] ?? null;
	if (!job) Astro.response.status = 404;
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"user": user,
		"csrfToken": csrfToken,
		"title": job ? `Edit — ${job.title}` : "Opportunity not found"
	}, { "default": ($$result) => renderTemplate`${!job ? renderTemplate`${maybeRenderHead($$result)}<div class="rounded-lg border border-line bg-white p-6 shadow-sm"><h2 class="text-lg font-extrabold text-ink">404 — Opportunity not found</h2><p class="mt-2 text-sm leading-relaxed text-body">No opportunity exists with this id. It may have been deleted.</p><p class="mt-4 text-sm"><a href="/admin/jobs" class="font-semibold text-brand-700 hover:underline">← Back to opportunities</a></p></div>` : !canEdit ? renderTemplate`<div class="rounded-lg border border-line bg-white p-6 shadow-sm"><h2 class="text-lg font-extrabold text-ink">403 — Forbidden</h2><p class="mt-2 text-sm leading-relaxed text-body">Your account (Viewer role) has read-only access. You can browse the opportunities list, but you cannot edit opportunities.</p><p class="mt-4 text-sm"><a href="/admin/jobs" class="font-semibold text-brand-700 hover:underline">← Back to opportunities</a></p></div>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<p class="mb-4 text-sm text-muted"><a href="/admin/jobs" class="font-semibold text-brand-700 hover:underline">← All opportunities</a></p>${renderComponent($$result, "JobForm", $$JobForm, {
		"job": job,
		"csrfToken": csrfToken,
		"canDelete": canDelete
	})}` })}`}` })}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin/jobs/[id].astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin/jobs/[id].astro";
var $$url = "/admin/jobs/[id]";
// \0virtual:astro:page:src/pages/admin/jobs/[id]@_@astro
var page = () => _id__exports;
export { page };
