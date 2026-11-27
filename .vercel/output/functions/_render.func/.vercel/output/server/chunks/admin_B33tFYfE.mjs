import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
// src/pages/admin.astro
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Admin,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$Admin = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Admin;
	return Astro.redirect("/admin/login");
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin.astro";
var $$url = "/admin";
// \0virtual:astro:page:src/pages/admin@_@astro
var page = () => admin_exports;
export { page };
