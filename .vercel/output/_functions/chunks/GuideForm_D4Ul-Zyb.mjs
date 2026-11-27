import { b as addAttribute, m as maybeRenderHead, p as renderTemplate, x as defineScriptVars } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
import { r as GUIDE_CATEGORIES } from "./admin-content_D7UgU4LZ.mjs";
// src/components/admin/GuideForm.astro
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$GuideForm = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$GuideForm;
	const { guide = null, csrfToken, canDelete } = Astro.props;
	const isEdit = guide !== null;
	const dstr = (d) => {
		if (!d) return "";
		const dt = d instanceof Date ? d : new Date(d);
		return Number.isNaN(dt.getTime()) ? "" : dt.toISOString().slice(0, 10);
	};
	const inputCls = "mt-1 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
	const labelCls = "block text-sm font-semibold text-ink";
	const sectionCls = "rounded-lg border border-line bg-white p-6 shadow-sm";
	return renderTemplate`${maybeRenderHead($$result)}<form id="guide-form" class="space-y-6" novalidate><p id="form-error" class="hidden rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert"></p><section${addAttribute(sectionCls, "class")}><h2 class="text-lg font-extrabold text-ink">Basic details</h2><div class="mt-4 space-y-4"><div><label for="title"${addAttribute(labelCls, "class")}>Title *</label><input id="title" name="title" required${addAttribute(guide?.title ?? "", "value")} placeholder="e.g. How to Start Freelancing in Pakistan"${addAttribute(inputCls, "class")}></div><div class="grid gap-4 sm:grid-cols-2"><div><label for="slug"${addAttribute(labelCls, "class")}>Slug *</label><input id="slug" name="slug" required${addAttribute(guide?.slug ?? "", "value")} placeholder="how-to-start-freelancing-in-pakistan"${addAttribute(inputCls, "class")}><p class="mt-1 text-xs text-muted">Auto-generated from the title; you can edit it. Only lowercase letters, numbers and hyphens.</p></div><div><label for="category"${addAttribute(labelCls, "class")}>Category *</label><select id="category" name="category" required${addAttribute(inputCls, "class")}>${GUIDE_CATEGORIES.map((c) => renderTemplate`<option${addAttribute(c, "value")}${addAttribute(guide?.category === c, "selected")}>${c}</option>`)}</select></div></div><div><label for="description"${addAttribute(labelCls, "class")}>Description *</label><textarea id="description" name="description" required rows="3"${addAttribute(inputCls, "class")}>${guide?.description ?? ""}</textarea></div><div class="grid gap-4 sm:grid-cols-2"><div><label for="tags"${addAttribute(labelCls, "class")}>Tags (comma-separated)</label><input id="tags" name="tags"${addAttribute((guide?.tags ?? []).join(", "), "value")} placeholder="freelancing, fiverr, upwork"${addAttribute(inputCls, "class")}></div><div><label for="author"${addAttribute(labelCls, "class")}>Author</label><input id="author" name="author"${addAttribute(guide?.author ?? "Rozgar Raasta Team", "value")}${addAttribute(inputCls, "class")}></div></div><div class="grid gap-4 sm:grid-cols-3"><div><label for="publish_date"${addAttribute(labelCls, "class")}>Publish date *</label><input id="publish_date" name="publish_date" type="date" required${addAttribute(dstr(guide?.publish_date ?? null), "value")}${addAttribute(inputCls, "class")}></div><div class="flex items-end pb-1"><label class="flex items-center gap-2 text-sm font-semibold text-ink"><input id="published" name="published" type="checkbox"${addAttribute(guide?.published ?? true, "checked")} class="h-4 w-4 accent-[#FF4C28]">Published (visible on the public site)</label></div><div class="flex items-end pb-1"><label class="flex items-center gap-2 text-sm font-semibold text-ink"><input id="featured" name="featured" type="checkbox"${addAttribute(guide?.featured ?? false, "checked")} class="h-4 w-4 accent-[#FF4C28]">Featured (Popular Guides)</label></div></div></div></section><section${addAttribute(sectionCls, "class")}><h2 class="text-lg font-extrabold text-ink">Body (Markdown)</h2><p class="mt-1 text-sm text-muted">Plain Markdown — headings, lists, links and tables. No rich-text editor yet; that is a later milestone.</p><div class="mt-4"><label for="body" class="sr-only">Body (Markdown) *</label><textarea id="body" name="body" required rows="18"${addAttribute(`${inputCls} font-mono text-[13px] leading-relaxed`, "class")}>${guide?.body ?? ""}</textarea></div></section><section${addAttribute(sectionCls, "class")}><h2 class="text-lg font-extrabold text-ink">SEO &amp; image</h2><div class="mt-4 space-y-4"><div><label for="seo_title"${addAttribute(labelCls, "class")}>SEO title</label><input id="seo_title" name="seo_title"${addAttribute(guide?.seo_title ?? "", "value")} placeholder="Defaults to the title"${addAttribute(inputCls, "class")}></div><div><label for="seo_description"${addAttribute(labelCls, "class")}>SEO description</label><textarea id="seo_description" name="seo_description" rows="2"${addAttribute(inputCls, "class")}>${guide?.seo_description ?? ""}</textarea></div><div class="grid gap-4 sm:grid-cols-2"><div><label for="image"${addAttribute(labelCls, "class")}>Hero image path</label><input id="image" name="image"${addAttribute(guide?.image ?? "", "value")} placeholder="e.g. /images/cat-freelancing.jpg"${addAttribute(inputCls, "class")}></div><div><label for="image_alt"${addAttribute(labelCls, "class")}>Hero image alt text</label><input id="image_alt" name="image_alt"${addAttribute(guide?.image_alt ?? "", "value")}${addAttribute(inputCls, "class")}></div></div></div></section><div class="flex flex-wrap items-center gap-3"><button id="save-button" type="submit" class="rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">${isEdit ? "Save changes" : "Create guide"}</button><a href="/admin/guides" class="rounded-md border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-50">Cancel</a>${isEdit && canDelete && renderTemplate`<button id="delete-button" type="button" class="ml-auto rounded-md border border-red-300 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100">Delete</button>`}</div></form><script>(function(){${defineScriptVars({
		csrfToken,
		isEdit,
		guideId: guide?.id ?? null
	})}
	const form = document.getElementById('guide-form');
	const errorBox = document.getElementById('form-error');
	const saveBtn = document.getElementById('save-button');
	const titleInput = document.getElementById('title');
	const slugInput = document.getElementById('slug');
	let slugTouched = slugInput.value.trim() !== '';

	// Auto-generate the slug from the title until the editor edits it by hand.
	slugInput.addEventListener('input', () => { slugTouched = true; });
	titleInput.addEventListener('input', () => {
		if (slugTouched) return;
		slugInput.value = titleInput.value
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 100);
	});

	const showError = (msg) => {
		errorBox.textContent = msg;
		errorBox.classList.remove('hidden');
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		errorBox.classList.add('hidden');
		saveBtn.disabled = true;
		saveBtn.textContent = isEdit ? 'Saving…' : 'Creating…';
		const fd = new FormData(form);
		const body = {
			title: fd.get('title'), slug: fd.get('slug'), description: fd.get('description'),
			category: fd.get('category'), tags: fd.get('tags'), body: fd.get('body'),
			featured: fd.get('featured') === 'on', published: fd.get('published') === 'on',
			publish_date: fd.get('publish_date'), seo_title: fd.get('seo_title'),
			seo_description: fd.get('seo_description'), author: fd.get('author'),
			image: fd.get('image'), image_alt: fd.get('image_alt'),
		};
		try {
			const res = await fetch(isEdit ? \`/api/admin/guides/\${guideId}\` : '/api/admin/guides', {
				method: isEdit ? 'PUT' : 'POST',
				headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
				body: JSON.stringify(body),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				showError(data.error || 'Could not save. Please try again.');
				saveBtn.disabled = false;
				saveBtn.textContent = isEdit ? 'Save changes' : 'Create guide';
				return;
			}
			window.location.href = \`/admin/guides?\${isEdit ? 'updated' : 'created'}=1\`;
		} catch {
			showError('Could not reach the server. Please try again.');
			saveBtn.disabled = false;
			saveBtn.textContent = isEdit ? 'Save changes' : 'Create guide';
		}
	});

	const deleteBtn = document.getElementById('delete-button');
	deleteBtn?.addEventListener('click', async () => {
		if (!window.confirm('Delete this guide? This cannot be undone. It will disappear from the admin list and the public site.')) return;
		deleteBtn.disabled = true;
		deleteBtn.textContent = 'Deleting…';
		try {
			const res = await fetch(\`/api/admin/guides/\${guideId}\`, {
				method: 'DELETE',
				headers: { 'x-csrf-token': csrfToken },
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				showError(data.error || 'Could not delete. Please try again.');
				deleteBtn.disabled = false;
				deleteBtn.textContent = 'Delete';
				return;
			}
			window.location.href = '/admin/guides?deleted=1';
		} catch {
			showError('Could not reach the server. Please try again.');
			deleteBtn.disabled = false;
			deleteBtn.textContent = 'Delete';
		}
	});
})();<\/script>`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/components/admin/GuideForm.astro", void 0);
export { $$GuideForm as t };
