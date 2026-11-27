// ONE-TIME database fix (27 Nov 2026) — DELETE AFTER USE.
// Applies db/fix-2026-11-27-linkedin-and-guides.sql server-side because
// the Neon SQL Editor paste is blocked in the cloud browser and the
// owner declined the manual paste. This route:
//   1) deletes the LinkedIn opportunity (mission excludes LinkedIn),
//   2) upserts ALL 32 guides from the content collection (current .md
//      text) so guides 1-19 + 21-27 stop being the stale seeded copy.
// Protected by a one-time random key in the POST body. The whole fix
// runs in one transaction — any failure rolls everything back.
// DELETE THIS FILE (and redeploy) immediately after a successful run.
import { getCollection } from 'astro:content';
import { getPool } from '../../../lib/db';
import { slugOf, todayPKT } from '../../../data/guides';

export const prerender = false;

const ONE_TIME_KEY = '33a4476905c75b673ae71b0676b7a3c42ac76d7402729c29';

const GUIDE_COLUMNS = [
	'slug', 'title', 'description', 'category', 'tags', 'body', 'featured',
	'published', 'publish_date', 'seo_title', 'seo_description', 'author',
	'image', 'image_alt', 'created_at', 'updated_at',
];

const GUIDE_UPSERT = `INSERT INTO guides (${GUIDE_COLUMNS.join(', ')})
	VALUES (${GUIDE_COLUMNS.map((_, i) => `$${i + 1}`).join(', ')})
	ON CONFLICT (slug) DO UPDATE SET
		title = EXCLUDED.title,
		description = EXCLUDED.description,
		category = EXCLUDED.category,
		tags = EXCLUDED.tags,
		body = EXCLUDED.body,
		featured = EXCLUDED.featured,
		published = EXCLUDED.published,
		publish_date = EXCLUDED.publish_date,
		seo_title = EXCLUDED.seo_title,
		seo_description = EXCLUDED.seo_description,
		author = EXCLUDED.author,
		image = EXCLUDED.image,
		image_alt = EXCLUDED.image_alt,
		created_at = EXCLUDED.created_at,
		updated_at = EXCLUDED.updated_at`;

function dateStr(d: unknown): string {
	if (d instanceof Date) return d.toISOString().slice(0, 10);
	return String(d).slice(0, 10);
}

export async function GET({ url }: { url: URL }) {
	if (url.searchParams.get('key') !== ONE_TIME_KEY) {
		return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403 });
	}
	const pool = getPool();
	const rows = await pool.query<{ slug: string; title: string; published: boolean; publish_date: string }>(
		`SELECT slug, title, published, publish_date::text AS publish_date FROM guides ORDER BY slug`,
	);
	return new Response(JSON.stringify({ ok: true, count: rows.rows.length, guides: rows.rows }), { status: 200 });
}

export async function POST({ request }: { request: Request }) {
	let body: any = {};
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'invalid JSON body' }), { status: 400 });
	}
	if (body?.key !== ONE_TIME_KEY) {
		return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 403 });
	}

	const today = todayPKT();
	const entries = (await getCollection('guides')).sort((a, b) => a.id.localeCompare(b.id));
	const guides = entries.map((entry) => {
		const date = dateStr(entry.data.date);
		const updated = entry.data.updated ? dateStr(entry.data.updated) : date;
		const rawBody = entry.body ?? '';
		return {
			slug: slugOf(entry),
			title: entry.data.title ?? null,
			description: entry.data.description ?? null,
			category: entry.data.category ?? null,
			tags: Array.isArray(entry.data.tags) ? entry.data.tags.map(String) : [],
			body: rawBody.replace(/\s+$/, '') + '\n',
			featured: entry.data.featured === true,
			published: date <= today,
			publish_date: date,
			seo_title: entry.data.title ?? null,
			seo_description: entry.data.description ?? null,
			author: (entry.data as any).author ?? 'Rozgar Raasta Team',
			image: (entry.data as any).image ?? null,
			image_alt: (entry.data as any).imageAlt ?? null,
			created_at: `${date}T00:00:00+05:00`,
			updated_at: `${updated}T00:00:00+05:00`,
		};
	});

	const pool = getPool();
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		const del = await client.query(
			`DELETE FROM opportunities WHERE source_url ILIKE '%linkedin.com%'`,
		);
		let upserted = 0;
		for (const g of guides) {
			const r = await client.query(GUIDE_UPSERT, GUIDE_COLUMNS.map((c) => (g as any)[c]));
			upserted += r.rowCount;
		}
		const counts = await client.query(
			`SELECT (SELECT count(*) FROM opportunities) AS opportunities,
				(SELECT count(*) FROM guides) AS guides`,
		);
		await client.query('COMMIT');
		return new Response(
			JSON.stringify({
				ok: true,
				linkedinDeleted: del.rowCount,
				guidesUpserted: upserted,
				guidesInSource: guides.length,
				opportunities: Number(counts.rows[0].opportunities),
				guides: Number(counts.rows[0].guides),
			}),
			{ status: 200 },
		);
	} catch (err: any) {
		await client.query('ROLLBACK');
		return new Response(JSON.stringify({ ok: false, error: err?.message ?? String(err) }), { status: 500 });
	} finally {
		client.release();
	}
}
