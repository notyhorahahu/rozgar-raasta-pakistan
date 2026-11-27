import { b as addAttribute, m as maybeRenderHead, p as renderTemplate, x as defineScriptVars } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { t as createAstro } from "./compiler_CFsG9cGQ.mjs";
import { a as OPPORTUNITY_STATUSES, i as JOB_TYPES, o as OPPORTUNITY_TYPES, s as VERIFICATION_STATUSES } from "./admin-content_D7UgU4LZ.mjs";
// src/components/admin/JobForm.astro
createAstro("https://rozgar-raasta-pakistan.vercel.app");
var $$JobForm = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$JobForm;
	const { job = null, csrfToken, canDelete } = Astro.props;
	const isEdit = job !== null;
	const dstr = (d) => {
		if (!d) return "";
		const dt = d instanceof Date ? d : new Date(d);
		return Number.isNaN(dt.getTime()) ? "" : dt.toISOString().slice(0, 10);
	};
	const inputCls = "mt-1 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
	const labelCls = "block text-sm font-semibold text-ink";
	const sectionCls = "rounded-lg border border-line bg-white p-6 shadow-sm";
	return renderTemplate`${maybeRenderHead($$result)}<form id="job-form" class="space-y-6" novalidate><p id="form-error" class="hidden rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert"></p><section${addAttribute(sectionCls, "class")}><h2 class="text-lg font-extrabold text-ink">Basic details</h2><div class="mt-4 grid gap-4 sm:grid-cols-2"><div class="sm:col-span-2"><label for="title"${addAttribute(labelCls, "class")}>Title *</label><input id="title" name="title" required${addAttribute(job?.title ?? "", "value")} placeholder="e.g. PPSC Lecturer (BS-17) — 120 posts"${addAttribute(inputCls, "class")}></div><div><label for="company"${addAttribute(labelCls, "class")}>Company / organisation *</label><input id="company" name="company" required${addAttribute(job?.company ?? "", "value")} placeholder="e.g. Punjab Public Service Commission (PPSC)"${addAttribute(inputCls, "class")}></div><div><label for="department"${addAttribute(labelCls, "class")}>Department</label><input id="department" name="department"${addAttribute(job?.department ?? "", "value")}${addAttribute(inputCls, "class")}></div><div><label for="location"${addAttribute(labelCls, "class")}>Location</label><input id="location" name="location"${addAttribute(job?.location ?? "", "value")} placeholder="e.g. Lahore, Punjab"${addAttribute(inputCls, "class")}></div><div><label for="province"${addAttribute(labelCls, "class")}>Province</label><input id="province" name="province"${addAttribute(job?.province ?? "", "value")} placeholder="e.g. Punjab"${addAttribute(inputCls, "class")}></div><div><label for="job_type"${addAttribute(labelCls, "class")}>Job type *</label><select id="job_type" name="job_type" required${addAttribute(inputCls, "class")}>${JOB_TYPES.map((t) => renderTemplate`<option${addAttribute(t, "value")}${addAttribute(job?.job_type === t, "selected")}>${t}</option>`)}</select></div><div><label for="category"${addAttribute(labelCls, "class")}>Category *</label><select id="category" name="category" required${addAttribute(inputCls, "class")}>${JOB_TYPES.map((t) => renderTemplate`<option${addAttribute(t, "value")}${addAttribute(job?.category === t, "selected")}>${t}</option>`)}</select></div><div><label for="type"${addAttribute(labelCls, "class")}>Type</label><select id="type" name="type"${addAttribute(inputCls, "class")}>${OPPORTUNITY_TYPES.map((t) => renderTemplate`<option${addAttribute(t, "value")}${addAttribute((job?.type ?? "job") === t, "selected")}>${t}</option>`)}</select></div><div><label for="deadline"${addAttribute(labelCls, "class")}>Deadline</label><input id="deadline" name="deadline" type="date"${addAttribute(dstr(job?.deadline ?? null), "value")}${addAttribute(inputCls, "class")}></div><div><label for="salary"${addAttribute(labelCls, "class")}>Salary</label><input id="salary" name="salary"${addAttribute(job?.salary ?? "", "value")} placeholder="e.g. Rs 80,000 – 120,000 / month"${addAttribute(inputCls, "class")}></div><div><label for="education"${addAttribute(labelCls, "class")}>Education</label><input id="education" name="education"${addAttribute(job?.education ?? "", "value")} placeholder="e.g. Bachelor's degree"${addAttribute(inputCls, "class")}></div><div><label for="qualification"${addAttribute(labelCls, "class")}>Qualification</label><input id="qualification" name="qualification"${addAttribute(job?.qualification ?? "", "value")}${addAttribute(inputCls, "class")}></div><div><label for="experience"${addAttribute(labelCls, "class")}>Experience</label><input id="experience" name="experience"${addAttribute(job?.experience ?? "", "value")} placeholder="e.g. 2+ years"${addAttribute(inputCls, "class")}></div></div></section><section${addAttribute(sectionCls, "class")}><h2 class="text-lg font-extrabold text-ink">Source (official link)</h2><div class="mt-4 grid gap-4 sm:grid-cols-2"><div class="sm:col-span-2"><label for="source_url"${addAttribute(labelCls, "class")}>Source URL (official application link) *</label><input id="source_url" name="source_url" type="url" required${addAttribute(job?.source_url ?? "", "value")} placeholder="https://www.ppsc.gop.pk/"${addAttribute(inputCls, "class")}></div><div><label for="source_domain"${addAttribute(labelCls, "class")}>Source domain</label><input id="source_domain" name="source_domain"${addAttribute(job?.source_domain ?? "", "value")} placeholder="Auto-filled from the URL"${addAttribute(inputCls, "class")}><p class="mt-1 text-xs text-muted">Auto-filled from the source URL when left empty.</p></div><div><label for="verified_date"${addAttribute(labelCls, "class")}>Verified date</label><input id="verified_date" name="verified_date" type="date"${addAttribute(dstr(job?.verified_date ?? null), "value")}${addAttribute(inputCls, "class")}></div></div></section><section${addAttribute(sectionCls, "class")}><h2 class="text-lg font-extrabold text-ink">Details</h2><div class="mt-4 space-y-4"><div><label for="description"${addAttribute(labelCls, "class")}>Description</label><textarea id="description" name="description" rows="3"${addAttribute(inputCls, "class")}>${job?.description ?? ""}</textarea></div><div><label for="eligibility"${addAttribute(labelCls, "class")}>Eligibility</label><textarea id="eligibility" name="eligibility" rows="4"${addAttribute(inputCls, "class")}>${job?.eligibility ?? ""}</textarea></div><div><label for="procedure"${addAttribute(labelCls, "class")}>How to apply (procedure)</label><textarea id="procedure" name="procedure" rows="4"${addAttribute(inputCls, "class")}>${job?.procedure ?? ""}</textarea></div><div><label for="fees"${addAttribute(labelCls, "class")}>Fees</label><textarea id="fees" name="fees" rows="2"${addAttribute(inputCls, "class")}>${job?.fees ?? ""}</textarea></div><div><label for="required_documents"${addAttribute(labelCls, "class")}>Required documents</label><textarea id="required_documents" name="required_documents" rows="2"${addAttribute(inputCls, "class")}>${job?.required_documents ?? ""}</textarea></div></div></section><section${addAttribute(sectionCls, "class")}><h2 class="text-lg font-extrabold text-ink">Status</h2><div class="mt-4 grid gap-4 sm:grid-cols-3"><div><label for="status"${addAttribute(labelCls, "class")}>Status</label><select id="status" name="status"${addAttribute(inputCls, "class")}>${OPPORTUNITY_STATUSES.map((s) => renderTemplate`<option${addAttribute(s, "value")}${addAttribute((job?.status ?? "open") === s, "selected")}>${s}</option>`)}</select></div><div><label for="verification_status"${addAttribute(labelCls, "class")}>Verification</label><select id="verification_status" name="verification_status"${addAttribute(inputCls, "class")}>${VERIFICATION_STATUSES.map((s) => renderTemplate`<option${addAttribute(s, "value")}${addAttribute((job?.verification_status ?? "verified") === s, "selected")}>${s}</option>`)}</select></div><div class="flex items-end pb-1"><label class="flex items-center gap-2 text-sm font-semibold text-ink"><input id="published" name="published" type="checkbox"${addAttribute(job?.published ?? true, "checked")} class="h-4 w-4 accent-[#FF4C28]">Published (visible on the public site)</label></div></div></section><div class="flex flex-wrap items-center gap-3"><button id="save-button" type="submit" class="rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">${isEdit ? "Save changes" : "Create opportunity"}</button><a href="/admin/jobs" class="rounded-md border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-50">Cancel</a>${isEdit && canDelete && renderTemplate`<button id="delete-button" type="button" class="ml-auto rounded-md border border-red-300 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100">Delete</button>`}</div></form><script>(function(){${defineScriptVars({
		csrfToken,
		isEdit,
		jobId: job?.id ?? null
	})}
	const form = document.getElementById('job-form');
	const errorBox = document.getElementById('form-error');
	const saveBtn = document.getElementById('save-button');
	const sourceUrl = document.getElementById('source_url');
	const sourceDomain = document.getElementById('source_domain');

	// Auto-fill the domain from the URL when the field is empty.
	sourceUrl.addEventListener('blur', () => {
		if (sourceDomain.value.trim() !== '') return;
		try {
			sourceDomain.value = new URL(sourceUrl.value.trim()).hostname.replace(/^www\\./, '');
		} catch { /* invalid URL — server validation will report it */ }
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
			title: fd.get('title'), company: fd.get('company'), department: fd.get('department'),
			location: fd.get('location'), province: fd.get('province'), education: fd.get('education'),
			qualification: fd.get('qualification'), experience: fd.get('experience'), salary: fd.get('salary'),
			job_type: fd.get('job_type'), category: fd.get('category'), type: fd.get('type'),
			deadline: fd.get('deadline'), source_url: fd.get('source_url'), source_domain: fd.get('source_domain'),
			description: fd.get('description'), eligibility: fd.get('eligibility'), procedure: fd.get('procedure'),
			fees: fd.get('fees'), verified_date: fd.get('verified_date'),
			required_documents: fd.get('required_documents'),
			verification_status: fd.get('verification_status'), status: fd.get('status'),
			published: fd.get('published') === 'on',
		};
		try {
			const res = await fetch(isEdit ? \`/api/admin/jobs/\${jobId}\` : '/api/admin/jobs', {
				method: isEdit ? 'PUT' : 'POST',
				headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
				body: JSON.stringify(body),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				showError(data.error || 'Could not save. Please try again.');
				saveBtn.disabled = false;
				saveBtn.textContent = isEdit ? 'Save changes' : 'Create opportunity';
				return;
			}
			window.location.href = \`/admin/jobs?\${isEdit ? 'updated' : 'created'}=1\`;
		} catch {
			showError('Could not reach the server. Please try again.');
			saveBtn.disabled = false;
			saveBtn.textContent = isEdit ? 'Save changes' : 'Create opportunity';
		}
	});

	const deleteBtn = document.getElementById('delete-button');
	deleteBtn?.addEventListener('click', async () => {
		if (!window.confirm('Delete this opportunity? This cannot be undone. It will disappear from the admin list and the public site.')) return;
		deleteBtn.disabled = true;
		deleteBtn.textContent = 'Deleting…';
		try {
			const res = await fetch(\`/api/admin/jobs/\${jobId}\`, {
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
			window.location.href = '/admin/jobs?deleted=1';
		} catch {
			showError('Could not reach the server. Please try again.');
			deleteBtn.disabled = false;
			deleteBtn.textContent = 'Delete';
		}
	});
})();<\/script>`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/components/admin/JobForm.astro", void 0);
export { $$JobForm as t };
