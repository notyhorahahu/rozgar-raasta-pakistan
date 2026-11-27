// Public-site data layer — the single place public pages read content.
//
// Database first, static fallback second:
// - Opportunities: SELECT from the opportunities table (published only).
//   If the query throws OR the table is empty, fall back to
//   src/data/opportunities.json. The public site must never go blank
//   because the database is down.
// - Guides: SELECT from the guides table (published only, PKT date gate
//   applied in JS with todayPKT() — the same rule as src/data/guides.ts).
//   If the query throws OR the table is empty, fall back to the
//   content collection filtered by publishedGuides().
// - Every DB read is parameterised. Fallbacks are automatic and silent
//   for visitors (a console warning only).
//
// Guide entries are returned in the CollectionEntry<'guides'> shape
// (id / data / body) so ArticleCard and the guide page work unchanged;
// DB rows carry source: 'database', collection rows source: 'collection'.
import { getCollection, type CollectionEntry } from 'astro:content';
import { parseDocument, DomUtils } from 'htmlparser2';
import render from 'dom-serializer';
import { marked } from 'marked';
import opportunitiesData from '../data/opportunities.json';
import { publishedGuides, slugOf, todayPKT } from '../data/guides';
import type { Opportunity } from '../data/opportunities';
import { query } from './db';

export type ContentSource = 'database' | 'static' | 'collection';

/** A guide in the shape public components expect, plus its source. */
export type GuideEntry = CollectionEntry<'guides'> & {
	slug: string;
	body: string;
	source: 'database' | 'collection';
	/** The real collection entry, only set for source === 'collection'. */
	collectionEntry?: CollectionEntry<'guides'>;
};

interface OpportunityRow {
	title: string;
	company: string;
	department: string | null;
	location: string;
	province: string | null;
	education: string | null;
	qualification: string | null;
	experience: string | null;
	salary: string | null;
	job_type: Opportunity['category'];
	category: Opportunity['category'];
	type: Opportunity['type'];
	status: Opportunity['status'];
	verification_status: string;
	deadline: Date | string | null;
	source_url: string;
	source_domain: string | null;
	description: string | null;
	eligibility: string | null;
	procedure: string | null;
	fees: string | null;
	verified_date: Date | string | null;
	required_documents: string | null;
	published: boolean;
	created_at: string;
	updated_at: string;
}

interface GuideRow {
	id: string;
	slug: string;
	title: string;
	description: string;
	category: GuideEntry['data']['category'];
	tags: string[];
	body: string;
	featured: boolean;
	published: boolean;
	publish_date: Date | string;
	seo_title: string | null;
	seo_description: string | null;
	author: string;
	image: string | null;
	image_alt: string | null;
	created_at: string;
	updated_at: string;
}

const OPPORTUNITY_COLUMNS = `title, company, department, location, province, education,
	qualification, experience, salary, job_type, category, type, status,
	verification_status, deadline, source_url, source_domain, description,
	eligibility, procedure, fees, verified_date, required_documents,
	published, created_at, updated_at`;

const GUIDE_COLUMNS = `id, slug, title, description, category, tags, body, featured,
	published, publish_date, seo_title, seo_description, author, image,
	image_alt, created_at, updated_at`;

function dateStr(d: Date | string | null): string | null {
	if (!d) return null;
	const dt = d instanceof Date ? d : new Date(d);
	if (Number.isNaN(dt.getTime())) return null;
	return dt.toISOString().slice(0, 10);
}

function toDate(d: Date | string): Date {
	return d instanceof Date ? d : new Date(d);
}

/** Map one opportunities row onto the Opportunity interface the public
 *  components (OpportunityCard / CategoryPage / jobPostingJsonLd) expect. */
export function mapOpportunityRow(row: OpportunityRow): Opportunity {
	return {
		title: row.title,
		organization: row.company,
		category: row.category,
		type: row.type,
		location: row.location ?? '',
		deadline: dateStr(row.deadline),
		sourceUrl: row.source_url,
		eligibility: row.eligibility ?? row.description ?? '',
		procedure: row.procedure ?? '',
		fees: row.fees ?? '',
		verifiedDate: dateStr(row.verified_date) ?? '',
		status: row.status,
	};
}

function mapGuideRow(row: GuideRow): GuideEntry {
	const date = toDate(row.publish_date);
	const updated = toDate(row.updated_at);
	const entry = {
		id: `${row.slug}.md`,
		slug: row.slug,
		collection: 'guides',
		data: {
			title: row.title,
			description: row.description,
			category: row.category,
			tags: row.tags ?? [],
			date,
			updated,
			author: row.author ?? 'Rozgar Raasta Team',
			featured: row.featured,
			...(row.image ? { image: row.image } : {}),
			...(row.image_alt ? { imageAlt: row.image_alt } : {}),
		},
		body: row.body,
		source: 'database' as const,
	} as unknown as GuideEntry;
	return entry;
}

function mapCollectionGuide(entry: CollectionEntry<'guides'>): GuideEntry {
	const mapped = {
		...entry,
		slug: slugOf(entry),
		body: entry.body ?? '',
		source: 'collection' as const,
		collectionEntry: entry,
	} as unknown as GuideEntry;
	return mapped;
}

function staticOpportunities(): Opportunity[] {
	return opportunitiesData as Opportunity[];
}

async function staticGuides(): Promise<GuideEntry[]> {
	const entries = publishedGuides(
		(await getCollection('guides')).sort((a, b) => b.data.updated.valueOf() - a.data.updated.valueOf()),
	);
	return entries.map(mapCollectionGuide);
}

// --- Public reads ------------------------------------------------------------

/** All published opportunities, DB first, static JSON fallback. */
export async function getOpportunities(): Promise<Opportunity[]> {
	try {
		const result = await query<OpportunityRow>(
			`SELECT ${OPPORTUNITY_COLUMNS} FROM opportunities
			 WHERE published = true ORDER BY created_at DESC`,
		);
		if (result.rows.length > 0) return result.rows.map(mapOpportunityRow);
		console.warn('[content] opportunities table is empty — using static fallback');
	} catch (err) {
		console.warn('[content] opportunities DB read failed — using static fallback', err);
	}
	return staticOpportunities();
}

/** All published guides (PKT date gate), DB first, collection fallback.
 *  Sorted by updated date, newest first — same order as before. */
export async function getGuides(): Promise<GuideEntry[]> {
	const today = todayPKT();
	try {
		const result = await query<GuideRow>(
			`SELECT ${GUIDE_COLUMNS} FROM guides
			 WHERE published = true ORDER BY publish_date DESC`,
		);
		if (result.rows.length > 0) {
			return result.rows
				.filter((row) => (dateStr(row.publish_date) ?? '') <= today)
				.map(mapGuideRow)
				.sort((a, b) => b.data.updated.valueOf() - a.data.updated.valueOf());
		}
		console.warn('[content] guides table is empty — using static fallback');
	} catch (err) {
		console.warn('[content] guides DB read failed — using static fallback', err);
	}
	return staticGuides();
}

/** One published guide by slug, DB first, collection fallback.
 *  Returns null when the slug exists in neither (the page then 404s). */
export async function getGuideBySlug(slug: string): Promise<GuideEntry | null> {
	const today = todayPKT();
	try {
		const result = await query<GuideRow>(
			`SELECT ${GUIDE_COLUMNS} FROM guides WHERE slug = $1 AND published = true`,
			[slug],
		);
		if (result.rows.length > 0) {
			const row = result.rows[0];
			if ((dateStr(row.publish_date) ?? '') <= today) return mapGuideRow(row);
			return null; // Future-dated: hidden until its date, even from the DB.
		}
	} catch (err) {
		console.warn('[content] guide DB read failed — using static fallback', err);
	}
	const entries = await getCollection('guides');
	const entry = entries.find((e) => slugOf(e) === slug);
	if (!entry) return null;
	const [published] = publishedGuides([entry]);
	if (!published) return null;
	return mapCollectionGuide(published);
}

// --- Dashboard counts ---------------------------------------------------------

export interface DashboardCounts {
	source: 'database' | 'static';
	totalOpportunities: number;
	openOpportunities: number;
	closedOpportunities: number;
	unverifiedOpportunities: number;
	totalGuides: number;
	publishedGuides: number;
	unpublishedGuides: number;
}

/** Real counts for the admin dashboard. Falls back to the static files
 *  (labelled 'static') so the dashboard never errors when the DB is down. */
export async function getDashboardCounts(): Promise<DashboardCounts> {
	try {
		const opps = await query<{ status: string; count: string }>(
			`SELECT status, count(*) AS count FROM opportunities GROUP BY status`,
		);
		const oppTotals = await query<{ total: string; published: string }>(
			`SELECT count(*) AS total, count(*) FILTER (WHERE published) AS published FROM opportunities`,
		);
		const guides = await query<{ published: boolean; count: string }>(
			`SELECT published, count(*) AS count FROM guides GROUP BY published`,
		);
		const totalOpps = Number(oppTotals.rows[0]?.total ?? 0);
		if (totalOpps === 0 && (await query(`SELECT count(*) AS c FROM guides`)).rows[0]?.c === '0') {
			throw new Error('content tables are empty');
		}
		const byStatus = new Map(opps.rows.map((r) => [r.status, Number(r.count)]));
		const guideCounts = new Map(guides.rows.map((r) => [r.published, Number(r.count)]));
		const published = guideCounts.get(true) ?? 0;
		const unpublished = guideCounts.get(false) ?? 0;
		return {
			source: 'database',
			totalOpportunities: totalOpps,
			openOpportunities: byStatus.get('open') ?? 0,
			closedOpportunities: byStatus.get('closed') ?? 0,
			unverifiedOpportunities: byStatus.get('unverified') ?? 0,
			totalGuides: published + unpublished,
			publishedGuides: published,
			unpublishedGuides: unpublished,
		};
	} catch (err) {
		console.warn('[content] dashboard counts DB read failed — using static fallback', err);
		const opps = staticOpportunities();
		const guides = await staticGuides();
		const allCollection = await getCollection('guides').catch(() => []);
		return {
			source: 'static',
			totalOpportunities: opps.length,
			openOpportunities: opps.filter((o) => o.status === 'open').length,
			closedOpportunities: opps.filter((o) => o.status === 'closed').length,
			unverifiedOpportunities: opps.filter((o) => o.status === 'unverified').length,
			totalGuides: allCollection.length,
			publishedGuides: guides.length,
			unpublishedGuides: allCollection.length - guides.length,
		};
	}
}

// --- Guide Markdown rendering -------------------------------------------------

/**
 * Render a DB guide's Markdown body to HTML. Only admins author guides,
 * but the HTML is still sanitised with a real DOM-based sanitiser built
 * on htmlparser2 (ESM — works in the Vercel serverless runtime, unlike
 * sanitize-html, whose CommonJS build require()s the ESM htmlparser2
 * and crashes every server-rendered page with ERR_REQUIRE_ESM).
 *
 * The sanitiser parses the HTML into a DOM, drops dangerous tags
 * entirely (script, iframe, object, embed, form, style, link, meta,
 * base, svg, math and anything not on the allowlist), strips every
 * event-handler attribute, and only allows http/https/mailto URLs.
 * This closes the vectors the old regex approach missed
 * (xlink:href="javascript:…", formaction, data:text/html, <svg>/<math>
 * payloads, entity-encoded schemes) because the parser — not a regex —
 * decides what is a tag and what is an attribute.
 */
const SAFE_TAGS = new Set([
	'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
	'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
	'em', 'strong', 'b', 'i', 'u', 's', 'a', 'img',
	'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
	'div', 'span', 'section', 'article',
]);
const SAFE_ATTRS: Record<string, Set<string>> = {
	a: new Set(['href', 'title']),
	img: new Set(['src', 'alt', 'title', 'width', 'height']),
};
const SAFE_SCHEMES = ['http:', 'https:', 'mailto:'];

function sanitiseNode(node: any): void {
	if (!node || typeof node !== 'object') return;
	// Text / comment / directive nodes have no children to clean, but
	// comments are dropped (they can hide conditional-IE payloads).
	if (node.type === 'comment') {
		DomUtils.removeElement(node);
		return;
	}
	if (node.type !== 'tag' && node.type !== 'script' && node.type !== 'style') {
		// Text nodes: recurse into children if any (directives etc.).
		if (Array.isArray(node.children)) {
			for (const child of [...node.children]) sanitiseNode(child);
		}
		return;
	}
	const name = (node.name ?? '').toLowerCase();
	if (!SAFE_TAGS.has(name)) {
		// Dangerous or unknown tag: drop it AND its children entirely.
		DomUtils.removeElement(node);
		return;
	}
	// Safe tag: strip every attribute that is not explicitly allowlisted,
	// and validate URL attributes against the safe schemes.
	const allowed = SAFE_ATTRS[name] ?? new Set<string>();
	for (const attr of Object.keys(node.attribs ?? {})) {
		const lower = attr.toLowerCase();
		if (lower.startsWith('on') || !allowed.has(lower)) {
			delete node.attribs[attr];
			continue;
		}
		if (lower === 'href' || lower === 'src') {
			const value = (node.attribs[attr] ?? '').trim().toLowerCase();
			const ok = SAFE_SCHEMES.some((s) => value.startsWith(s));
			if (!ok) delete node.attribs[attr];
		}
	}
	if (Array.isArray(node.children)) {
		for (const child of [...node.children]) sanitiseNode(child);
	}
}

export function sanitiseHtml(html: string): string {
	const dom = parseDocument(html);
	for (const child of [...dom.children]) sanitiseNode(child);
	return render(dom);
}

export function renderGuideBody(markdown: string): string {
	const raw = marked.parse(markdown, { async: false }) as string;
	return sanitiseHtml(raw);
}
