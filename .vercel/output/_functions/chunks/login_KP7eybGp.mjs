import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { h as renderHead, p as renderTemplate, x as defineScriptVars } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
/* empty css                 */
import { d as getOrSetCsrfToken } from "./auth_B63A6JLM.mjs";
// src/pages/admin/login.astro
var login_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Login,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$Login = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Login;
	const csrfToken = getOrSetCsrfToken(Astro.cookies);
	const error = Astro.url.searchParams.get("error");
	return renderTemplate`<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>Admin Login | Rozgar Raasta Pakistan</title><meta name="description" content="Admin login for Rozgar Raasta Pakistan. Admin accounts are created by a Super Admin only."><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">${renderHead($$result)}</head><body class="min-h-screen bg-cream font-sans text-body antialiased"><main class="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10"><div class="text-center"><div class="inline-flex items-center gap-2"><img src="/logo-mark.svg" alt="Rozgar Raasta Pakistan logo" class="h-10 w-10"><span class="text-lg font-extrabold tracking-tight text-ink">Rozgar Raasta Pakistan</span></div><p class="mt-1 text-xs font-semibold uppercase tracking-widest text-brand-600">Admin Panel</p></div><div class="mt-8 rounded-lg border border-line bg-white p-6 shadow-sm sm:p-8"><h1 class="text-2xl font-extrabold text-ink">Admin login</h1><p class="mt-1 text-sm text-muted">Sign in to manage the website. Admin accounts are created by a Super Admin only — there is no public registration.</p>${error === "forbidden" && renderTemplate`<p class="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">Your account does not have access to the admin panel.</p>`}<p id="form-error" class="mt-4 hidden rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert"></p><form id="login-form" class="mt-6 space-y-4" novalidate><div><label for="email" class="block text-sm font-semibold text-ink">Email</label><input id="email" name="email" type="email" required autocomplete="username" placeholder="you@example.com" class="mt-1 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"></div><div><label for="password" class="block text-sm font-semibold text-ink">Password</label><input id="password" name="password" type="password" required minlength="8" autocomplete="current-password" placeholder="Your password" class="mt-1 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"></div><button id="login-button" type="submit" class="w-full rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">Log in</button></form><p class="mt-5 text-center text-xs leading-relaxed text-muted">Admin accounts are created by a Super Admin only.<br>No sign-up link exists. Locked out after 5 failed attempts for 15 minutes.</p></div></main><script>(function(){${defineScriptVars({ csrfToken })}
			const form = document.getElementById('login-form');
			const errorBox = document.getElementById('form-error');
			const button = document.getElementById('login-button');
			form.addEventListener('submit', async (event) => {
				event.preventDefault();
				errorBox.classList.add('hidden');
				errorBox.textContent = '';
				button.disabled = true;
				button.textContent = 'Logging in…';
				const email = document.getElementById('email').value.trim();
				const password = document.getElementById('password').value;
				try {
					const res = await fetch('/api/admin/login', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
						body: JSON.stringify({ email, password }),
					});
					const data = await res.json().catch(() => ({}));
					if (!res.ok) {
						errorBox.textContent = data.error || 'Login failed. Please try again.';
						errorBox.classList.remove('hidden');
						button.disabled = false;
						button.textContent = 'Log in';
						return;
					}
					// The API set the httpOnly session cookie; redirect server-side
					// via a full navigation so the dashboard request carries it.
					window.location.href = '/admin/dashboard';
				} catch {
					errorBox.textContent = 'Could not reach the server. Please try again.';
					errorBox.classList.remove('hidden');
					button.disabled = false;
					button.textContent = 'Log in';
				}
			});
		})();<\/script></body></html>`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin/login.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/admin/login.astro";
var $$url = "/admin/login";
// \0virtual:astro:page:src/pages/admin/login@_@astro
var page = () => login_exports;
export { page };
