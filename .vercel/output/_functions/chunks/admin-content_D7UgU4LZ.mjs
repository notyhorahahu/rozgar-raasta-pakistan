import { t as query } from "./db_DDXrkiRw.mjs";
import { n as HttpError } from "./auth_B63A6JLM.mjs";
// src/lib/admin-content.ts
var JOB_TYPES = [
	"government",
	"private",
	"remote",
	"internship",
	"scholarship",
	"course",
	"earning",
	"freelancing",
	"ai-tools"
];
var OPPORTUNITY_TYPES = [
	"job",
	"course",
	"scholarship",
	"internship",
	"guide"
];
var OPPORTUNITY_STATUSES = [
	"open",
	"closed",
	"unverified"
];
var VERIFICATION_STATUSES = [
	"verified",
	"pending",
	"unverified"
];
var GUIDE_CATEGORIES = [
	"freelancing",
	"career",
	"student",
	"skills",
	"earning",
	"business",
	"ai-tools"
];
var EDITOR_ROLES = [
	"super_admin",
	"content_manager",
	"editor"
];
var DELETE_ROLES = ["super_admin", "content_manager"];
function asString(v) {
	return typeof v === "string" ? v.trim() : "";
}
function asNullable(v) {
	const s = asString(v);
	return s === "" ? null : s;
}
function asDate(v) {
	const s = asString(v);
	if (!s) return null;
	if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new HttpError(400, "Dates must be in YYYY-MM-DD format.");
	const d = /* @__PURE__ */ new Date(`${s}T00:00:00Z`);
	if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) throw new HttpError(400, `Invalid date: ${s}.`);
	return s;
}
function asBool(v) {
	return v === true || v === "true" || v === "on" || v === "1";
}
function asEnum(v, allowed, field) {
	const s = asString(v);
	if (!allowed.includes(s)) throw new HttpError(400, `Invalid ${field}: ${s || "(empty)"}.`);
	return s;
}
function domainOf(url) {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return null;
	}
}
/** Validate a job create/update body. Throws HttpError(400) on bad input. */
function parseJobInput(body) {
	const title = asString(body.title);
	const company = asString(body.company);
	const source_url = asString(body.source_url);
	if (!title) throw new HttpError(400, "Title is required.");
	if (!company) throw new HttpError(400, "Company / organisation is required.");
	if (!source_url) throw new HttpError(400, "Source URL (official application link) is required.");
	let parsed;
	try {
		parsed = new URL(source_url);
	} catch {
		throw new HttpError(400, "Source URL must be a valid URL.");
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new HttpError(400, "Source URL must start with http:// or https://.");
	const job_type = asEnum(body.job_type, JOB_TYPES, "job type");
	const category = asEnum(body.category, JOB_TYPES, "category");
	const type = asEnum(body.type ?? "job", OPPORTUNITY_TYPES, "type");
	const status = asEnum(body.status ?? "open", OPPORTUNITY_STATUSES, "status");
	const verification_status = asEnum(body.verification_status ?? "verified", VERIFICATION_STATUSES, "verification status");
	return {
		title,
		company,
		department: asNullable(body.department),
		location: asString(body.location),
		province: asNullable(body.province),
		education: asNullable(body.education),
		qualification: asNullable(body.qualification),
		experience: asNullable(body.experience),
		salary: asNullable(body.salary),
		job_type,
		category,
		type,
		deadline: asDate(body.deadline),
		source_url,
		source_domain: asNullable(body.source_domain) ?? domainOf(source_url),
		description: asNullable(body.description),
		eligibility: asNullable(body.eligibility),
		procedure: asNullable(body.procedure),
		fees: asNullable(body.fees),
		verified_date: asDate(body.verified_date),
		required_documents: asNullable(body.required_documents),
		verification_status,
		status,
		published: body.published === void 0 ? true : asBool(body.published)
	};
}
/** Validate a guide create/update body. Throws HttpError(400) on bad input.
*  `excludeId` is the row being edited — the slug-uniqueness check
*  ignores that row. */
async function parseGuideInput(body, excludeId) {
	const title = asString(body.title);
	const slug = asString(body.slug);
	const description = asString(body.description);
	const b = asString(body.body);
	const publish_date = asDate(body.publish_date);
	if (!title) throw new HttpError(400, "Title is required.");
	if (!slug) throw new HttpError(400, "Slug is required.");
	if (!/^[a-z0-9-]+$/.test(slug)) throw new HttpError(400, "Slug may only contain lowercase letters, numbers and hyphens.");
	if (!description) throw new HttpError(400, "Description is required.");
	if (!b) throw new HttpError(400, "Body (Markdown) is required.");
	if (!publish_date) throw new HttpError(400, "Publish date is required.");
	const category = asEnum(body.category, GUIDE_CATEGORIES, "category");
	const tags = asString(body.tags).split(",").map((t) => t.trim()).filter(Boolean);
	const existing = await query(`SELECT id FROM guides WHERE slug = $1`, [slug]);
	if (existing.rows.length > 0 && existing.rows[0].id !== excludeId) throw new HttpError(400, `Slug "${slug}" is already used by another guide.`);
	return {
		title,
		slug,
		description,
		category,
		tags,
		body: b,
		featured: asBool(body.featured),
		published: body.published === void 0 ? true : asBool(body.published),
		publish_date,
		seo_title: asNullable(body.seo_title) ?? title,
		seo_description: asNullable(body.seo_description) ?? description,
		author: asString(body.author) || "Rozgar Raasta Team",
		image: asNullable(body.image),
		image_alt: asNullable(body.image_alt)
	};
}
var JOB_COLUMNS = `title, company, department, location, province, education,
	qualification, experience, salary, job_type, category, type, deadline,
	source_url, source_domain, description, eligibility, procedure, fees,
	verified_date, required_documents, verification_status, status, published,
	created_by`;
async function insertJob(input, createdBy) {
	const values = [
		input.title,
		input.company,
		input.department,
		input.location,
		input.province,
		input.education,
		input.qualification,
		input.experience,
		input.salary,
		input.job_type,
		input.category,
		input.type,
		input.deadline,
		input.source_url,
		input.source_domain,
		input.description,
		input.eligibility,
		input.procedure,
		input.fees,
		input.verified_date,
		input.required_documents,
		input.verification_status,
		input.status,
		input.published,
		createdBy
	];
	return (await query(`INSERT INTO opportunities (${JOB_COLUMNS})
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
		 RETURNING id`, values)).rows[0].id;
}
async function updateJob(id, input) {
	return ((await query(`UPDATE opportunities SET
			title = $2, company = $3, department = $4, location = $5, province = $6,
			education = $7, qualification = $8, experience = $9, salary = $10,
			job_type = $11, category = $12, type = $13, deadline = $14,
			source_url = $15, source_domain = $16, description = $17,
			eligibility = $18, procedure = $19, fees = $20, verified_date = $21,
			required_documents = $22, verification_status = $23, status = $24,
			published = $25
		 WHERE id = $1`, [
		id,
		input.title,
		input.company,
		input.department,
		input.location,
		input.province,
		input.education,
		input.qualification,
		input.experience,
		input.salary,
		input.job_type,
		input.category,
		input.type,
		input.deadline,
		input.source_url,
		input.source_domain,
		input.description,
		input.eligibility,
		input.procedure,
		input.fees,
		input.verified_date,
		input.required_documents,
		input.verification_status,
		input.status,
		input.published
	])).rowCount ?? 0) > 0;
}
async function insertGuide(input, createdBy) {
	return (await query(`INSERT INTO guides (slug, title, description, category, tags, body, featured,
			published, publish_date, seo_title, seo_description, author, image, image_alt, created_by)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
		 RETURNING id`, [
		input.slug,
		input.title,
		input.description,
		input.category,
		input.tags,
		input.body,
		input.featured,
		input.published,
		input.publish_date,
		input.seo_title,
		input.seo_description,
		input.author,
		input.image,
		input.image_alt,
		createdBy
	])).rows[0].id;
}
async function updateGuide(id, input) {
	return ((await query(`UPDATE guides SET
			slug = $2, title = $3, description = $4, category = $5, tags = $6,
			body = $7, featured = $8, published = $9, publish_date = $10,
			seo_title = $11, seo_description = $12, author = $13, image = $14,
			image_alt = $15
		 WHERE id = $1`, [
		id,
		input.slug,
		input.title,
		input.description,
		input.category,
		input.tags,
		input.body,
		input.featured,
		input.published,
		input.publish_date,
		input.seo_title,
		input.seo_description,
		input.author,
		input.image,
		input.image_alt
	])).rowCount ?? 0) > 0;
}
export { OPPORTUNITY_STATUSES as a, insertGuide as c, parseJobInput as d, updateGuide as f, JOB_TYPES as i, insertJob as l, EDITOR_ROLES as n, OPPORTUNITY_TYPES as o, updateJob as p, GUIDE_CATEGORIES as r, VERIFICATION_STATUSES as s, DELETE_ROLES as t, parseGuideInput as u };
