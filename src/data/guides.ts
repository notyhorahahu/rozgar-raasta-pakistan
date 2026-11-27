import type { CollectionEntry } from 'astro:content';

/** Derive the URL slug from a content entry's id (e.g. "my-guide.md" -> "my-guide"). */
export function slugOf(entry: CollectionEntry<'guides'>): string {
	return entry.id.replace(/\.md$/, '').replace(/\/index$/, '');
}

/** Today's calendar date in PKT (Asia/Karachi, UTC+5) as YYYY-MM-DD. */
export function todayPKT(now: Date = new Date()): string {
	const pkt = new Date(now.getTime() + 5 * 60 * 60 * 1000);
	return pkt.toISOString().slice(0, 10);
}

/**
 * True when a guide's publish date is today (PKT) or earlier.
 * Future-dated guides stay hidden until their date — they are not
 * published before their publication date.
 */
export function isPublished(entry: CollectionEntry<'guides'>, now: Date = new Date()): boolean {
	const d = entry.data.date;
	const ds = d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10);
	return ds <= todayPKT(now);
}

/** Keep only guides whose publish date is today (PKT) or earlier. */
export function publishedGuides(
	entries: CollectionEntry<'guides'>[],
	now: Date = new Date()
): CollectionEntry<'guides'>[] {
	return entries.filter((e) => isPublished(e, now));
}
