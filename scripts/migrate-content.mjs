// Seed the content tables (migration 002) from the file sources of truth:
//   - src/data/opportunities.json  -> opportunities (40 records)
//   - src/content/guides/*.md      -> guides (32 files)
//
// Usage (local testing — local PostgreSQL 16, rozgar_test):
//   node --env-file=.env scripts/migrate-content.mjs
//
// Usage (production Neon — direct Postgres from this sandbox is BLOCKED,
// so the Neon path is via the Neon SQL Editor in the browser):
//   node scripts/migrate-content.mjs --print-sql > /tmp/migrate-content.sql
// then paste db/migrations/002-content.sql AND the printed INSERTs into
// the Neon SQL Editor, in that order. See "Content migration
// (migration 002)" in docs/admin-setup.md. --print-sql does NOT touch
// any database. With --sql-file <path> the same SQL is written to that
// file as well (handy because the output is large).
//
// Safety / idempotency:
// - INSERT ... ON CONFLICT DO NOTHING on both tables, so re-running
//   inserts 0 new rows: opportunities dedupe on the unique
//   (title, company) index, guides on the unique slug.
// - NEVER invents data: every nullable field with no source value
//   stays NULL (department, province, education, qualification,
//   experience, salary, required_documents have no source data yet).
// - NEVER changes a value: titles, companies, deadlines, URLs and
//   statuses are copied exactly from the source files.
// - Field mappings (see db/migrations/002-content.sql header):
//   company <- organization; job_type = category <- category;
//   type <- type (needed: type and category do not map 1:1, e.g. 3
//   records are type 'guide'); description = eligibility <- eligibility;
//   verification_status: 'unverified' -> 'unverified', 'open'/'closed'
//   -> 'verified'; source_domain <- hostname of sourceUrl;
//   guides.published <- PKT date gate (date <= today in Asia/Karachi,
//   the same rule as isPublished() in src/data/guides.ts);
//   guides.created_at <- frontmatter date, updated_at <- frontmatter
//   updated; seo_title/seo_description <- title/description.
// - The script needs DATABASE_URL in the environment; it does NOT read
//   .env itself (use `node --env-file=.env ...` locally, as with
//   scripts/create-admin.mjs). It never prints the connection string.
// - All inserts run in one transaction: any failure rolls everything
//   back and the script exits non-zero.

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OPPORTUNITIES_PATH = join(ROOT, 'src', 'data', 'opportunities.json');
const GUIDES_DIR = join(ROOT, 'src', 'content', 'guides');

const args = process.argv.slice(2);
const printSql = args.includes('--print-sql');
const sqlFileIdx = args.indexOf('--sql-file');
const sqlFile = sqlFileIdx >= 0 ? args[sqlFileIdx + 1] : null;
if (sqlFileIdx >= 0 && !sqlFile) {
	console.error('ERROR: --sql-file needs a file path.');
	process.exit(1);
}

const OPP_CATEGORIES = new Set([
	'government', 'private', 'remote', 'internship', 'scholarship',
	'course', 'earning', 'freelancing', 'ai-tools',
]);
const OPP_TYPES = new Set(['job', 'course', 'scholarship', 'internship', 'guide']);
const OPP_STATUSES = new Set(['open', 'closed', 'unverified']);
const GUIDE_CATEGORIES = new Set([
	'freelancing', 'career', 'student', 'skills', 'earning', 'business', 'ai-tools',
]);

/** Today's calendar date in PKT (Asia/Karachi, UTC+5) as YYYY-MM-DD —
// same rule as todayPKT() in src/data/guides.ts. */
function todayPKT(now = new Date()) {
	return new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function isValidDate(s) {
	return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + 'T00:00:00Z'));
}

/** Parse one `key: value` frontmatter line value. Handles double/single
 *  quoted strings, JSON-style string arrays (tags), and booleans. */
function parseFmValue(raw) {
	const v = raw.trim();
	if (v.startsWith('[')) return JSON.parse(v);
	if (v === 'true') return true;
	if (v === 'false') return false;
	if (v.startsWith('"')) return JSON.parse(v);
	if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1);
	return v;
}

/** Split a guide file into { frontmatter, body }. The body is the full
 *  Markdown after the --- frontmatter --- block. */
function parseGuideFile(text, filename) {
	const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) throw new Error(`no frontmatter block found`);
	return { frontmatter: parseFrontmatter(match[1], filename), body: match[2].replace(/\s+$/, '') + '\n' };
}

function parseFrontmatter(block, filename) {
	const data = {};
	for (const line of block.split('\n')) {
		if (!line.trim()) continue;
		const colon = line.indexOf(':');
		if (colon === -1) throw new Error(`bad frontmatter line in ${filename}: ${line}`);
		const key = line.slice(0, colon).trim();
		try {
			data[key] = parseFmValue(line.slice(colon + 1));
		} catch (err) {
			throw new Error(`cannot parse frontmatter ${key} in ${filename}: ${err.message}`);
		}
	}
	return data;
}

// ------------------------------------------------------------------ load
const errors = [];

let opportunitiesRaw;
try {
	opportunitiesRaw = JSON.parse(readFileSync(OPPORTUNITIES_PATH, 'utf8'));
} catch (err) {
	console.error(`ERROR: cannot read ${OPPORTUNITIES_PATH}: ${err.message}`);
	process.exit(1);
}
if (!Array.isArray(opportunitiesRaw)) {
	console.error('ERROR: opportunities.json is not an array.');
	process.exit(1);
}

const opportunities = opportunitiesRaw.map((o, i) => {
	const label = `opportunities.json[${i}] (${o.title ?? 'no title'})`;
	const req = (field) => {
		if (o[field] === undefined || o[field] === null || o[field] === '') {
			errors.push(`${label}: missing required field "${field}"`);
			return false;
		}
		return true;
	};
	req('title');
	req('organization');
	req('sourceUrl');
	if (o.category !== undefined && !OPP_CATEGORIES.has(o.category)) {
		errors.push(`${label}: unknown category "${o.category}"`);
	}
	if (o.type !== undefined && !OPP_TYPES.has(o.type)) {
		errors.push(`${label}: unknown type "${o.type}"`);
	}
	if (o.status !== undefined && !OPP_STATUSES.has(o.status)) {
		errors.push(`${label}: unknown status "${o.status}"`);
	}
	if (o.deadline !== undefined && o.deadline !== null && !isValidDate(o.deadline)) {
		errors.push(`${label}: bad deadline "${o.deadline}"`);
	}
	if (o.verifiedDate !== undefined && o.verifiedDate !== null && !isValidDate(o.verifiedDate)) {
		errors.push(`${label}: bad verifiedDate "${o.verifiedDate}"`);
	}
	let sourceDomain = null;
	if (o.sourceUrl) {
		try {
			sourceDomain = new URL(o.sourceUrl).hostname;
		} catch {
			errors.push(`${label}: bad sourceUrl "${o.sourceUrl}"`);
		}
	}
	return {
		title: o.title ?? null,
		company: o.organization ?? null,
		location: o.location ?? '',
		job_type: o.category ?? null,
		category: o.category ?? null,
		type: o.type ?? 'job',
		status: o.status ?? 'open',
		// Only the records with status 'unverified' are unverified;
		// 'open'/'closed' records were verified on their verifiedDate.
		verification_status: o.status === 'unverified' ? 'unverified' : 'verified',
		deadline: o.deadline ?? null,
		source_url: o.sourceUrl ?? null,
		source_domain: sourceDomain,
		description: o.eligibility ?? null,
		eligibility: o.eligibility ?? null,
		procedure: o.procedure ?? null,
		fees: o.fees ?? null,
		verified_date: o.verifiedDate ?? null,
	};
});

const guideFiles = readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.md')).sort();
const guides = guideFiles.map((file) => {
	const slug = file.replace(/\.md$/, '');
	const label = `guides/${file}`;
	let parsed;
	try {
		parsed = parseGuideFile(readFileSync(join(GUIDES_DIR, file), 'utf8'), file);
	} catch (err) {
		errors.push(`${label}: ${err.message}`);
		return null;
	}
	const fm = parsed.frontmatter;
	const req = (field) => {
		if (fm[field] === undefined || fm[field] === null || fm[field] === '') {
			errors.push(`${label}: missing required frontmatter "${field}"`);
			return false;
		}
		return true;
	};
	req('title');
	req('description');
	req('date');
	if (fm.category !== undefined && !GUIDE_CATEGORIES.has(fm.category)) {
		errors.push(`${label}: unknown category "${fm.category}"`);
	}
	if (fm.date !== undefined && !isValidDate(String(fm.date))) {
		errors.push(`${label}: bad date "${fm.date}"`);
	}
	if (fm.updated !== undefined && !isValidDate(String(fm.updated))) {
		errors.push(`${label}: bad updated "${fm.updated}"`);
	}
	if (!parsed.body.trim()) errors.push(`${label}: empty body`);
	const dateStr = String(fm.date).slice(0, 10);
	const updatedStr = fm.updated ? String(fm.updated).slice(0, 10) : dateStr;
	return {
		slug,
		title: fm.title ?? null,
		description: fm.description ?? null,
		category: fm.category ?? null,
		tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
		body: parsed.body,
		featured: fm.featured === true,
		// PKT date gate — same rule as isPublished() in src/data/guides.ts.
		published: dateStr <= todayPKT(),
		publish_date: dateStr,
		seo_title: fm.title ?? null,
		seo_description: fm.description ?? null,
		author: fm.author ?? 'Rozgar Raasta Team',
		image: fm.image ?? null,
		image_alt: fm.imageAlt ?? null,
		// Keep the content's real dates, not the import date.
		created_at: `${dateStr}T00:00:00+05:00`,
		updated_at: `${updatedStr}T00:00:00+05:00`,
	};
}).filter(Boolean);

if (errors.length > 0) {
	console.error(`ERROR: ${errors.length} validation error(s) — nothing was inserted:`);
	for (const e of errors) console.error(`  - ${e}`);
	process.exit(1);
}

// ------------------------------------------------------- SQL generation
// Used by --print-sql / --sql-file so the same rows can be pasted into
// the Neon SQL Editor (direct Postgres from this sandbox is blocked).
// Literals are escaped by doubling single quotes; NULL stays NULL.
function lit(v) {
	if (v === null || v === undefined) return 'NULL';
	if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
	return `'${String(v).replace(/'/g, "''")}'`;
}
function textArrayLit(arr) {
	if (!arr || arr.length === 0) return `'{}'::text[]`;
	return `ARRAY[${arr.map((s) => `'${String(s).replace(/'/g, "''")}'`).join(', ')}]::text[]`;
}

const OPP_COLUMNS = [
	'title', 'company', 'location', 'job_type', 'category', 'type', 'status',
	'verification_status', 'deadline', 'source_url', 'source_domain',
	'description', 'eligibility', 'procedure', 'fees', 'verified_date',
];
const GUIDE_COLUMNS = [
	'slug', 'title', 'description', 'category', 'tags', 'body', 'featured',
	'published', 'publish_date', 'seo_title', 'seo_description', 'author',
	'image', 'image_alt', 'created_at', 'updated_at',
];

function opportunitySql(o) {
	const vals = OPP_COLUMNS.map((c) => (c === 'deadline' || c === 'verified_date' ? lit(o[c]) : lit(o[c])));
	return `INSERT INTO opportunities (${OPP_COLUMNS.join(', ')}) VALUES (${vals.join(', ')}) ON CONFLICT (title, company) DO NOTHING;`;
}
function guideSql(g) {
	const vals = GUIDE_COLUMNS.map((c) => {
		if (c === 'tags') return textArrayLit(g.tags);
		if (c === 'featured' || c === 'published') return lit(g[c]);
		if (c === 'created_at' || c === 'updated_at') return `${lit(g[c])}::timestamptz`;
		return lit(g[c]);
	});
	return `INSERT INTO guides (${GUIDE_COLUMNS.join(', ')}) VALUES (${vals.join(', ')}) ON CONFLICT (slug) DO NOTHING;`;
}

const sqlLines = [
	'-- Rozgar Raasta Pakistan — content seed (migration 002 data).',
	'-- Generated by scripts/migrate-content.mjs --print-sql.',
	'-- Apply AFTER db/migrations/002-content.sql, in the same database.',
	'-- Safe to re-run: every statement is ON CONFLICT DO NOTHING.',
	`-- Generated ${new Date().toISOString()} (PKT date gate evaluated at generation time: today = ${todayPKT()}).`,
	'',
	...opportunities.map(opportunitySql),
	'',
	...guides.map(guideSql),
	'',
	`-- Expected after this file: ${opportunities.length} opportunities, ${guides.length} guides (before dedupe).`,
];

if (printSql) {
	const out = sqlLines.join('\n');
	if (sqlFile) {
		const { writeFileSync } = await import('node:fs');
		writeFileSync(sqlFile, out + '\n', 'utf8');
		console.log(`Wrote ${opportunities.length} opportunity + ${guides.length} guide INSERTs to ${sqlFile}`);
		console.log(`Guides with published = false (future-dated, PKT today ${todayPKT()}): ${guides.filter((g) => !g.published).map((g) => g.slug).join(', ')}`);
	} else {
		console.log(out);
	}
	process.exit(0);
}

// ------------------------------------------------------------- DB insert
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
	console.error('ERROR: DATABASE_URL is not set. Set it to the database you want to seed (local: node --env-file=.env scripts/migrate-content.mjs).');
	process.exit(1);
}
const isLocal = DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1');
const pool = new pg.Pool({
	connectionString: DATABASE_URL,
	ssl: isLocal ? false : { rejectUnauthorized: false },
});

const OPP_INSERT = `INSERT INTO opportunities (${OPP_COLUMNS.join(', ')})
	VALUES (${OPP_COLUMNS.map((_, i) => `$${i + 1}`).join(', ')})
	ON CONFLICT (title, company) DO NOTHING`;
const GUIDE_INSERT = `INSERT INTO guides (${GUIDE_COLUMNS.join(', ')})
	VALUES (${GUIDE_COLUMNS.map((_, i) => `$${i + 1}`).join(', ')})
	ON CONFLICT (slug) DO NOTHING`;

try {
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		let oppInserted = 0;
		for (const o of opportunities) {
			const r = await client.query(OPP_INSERT, OPP_COLUMNS.map((c) => o[c]));
			oppInserted += r.rowCount;
		}
		let guideInserted = 0;
		for (const g of guides) {
			const r = await client.query(GUIDE_INSERT, GUIDE_COLUMNS.map((c) => g[c]));
			guideInserted += r.rowCount;
		}
		await client.query('COMMIT');
		const futureGuides = guides.filter((g) => !g.published).map((g) => g.slug);
		console.log('Content migration complete.');
		console.log(`Opportunities: ${oppInserted} inserted, ${opportunities.length - oppInserted} skipped (already present), ${opportunities.length} total in source.`);
		console.log(`Guides: ${guideInserted} inserted, ${guides.length - guideInserted} skipped (already present), ${guides.length} total in source.`);
		console.log(`Guides with published = false (future-dated, PKT today ${todayPKT()}): ${futureGuides.length ? futureGuides.join(', ') : '(none)'}`);
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
} catch (err) {
	console.error('ERROR: content migration failed (rolled back):', err.message);
	process.exit(1);
} finally {
	await pool.end();
}
