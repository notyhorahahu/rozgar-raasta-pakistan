import type { CollectionEntry } from 'astro:content';

/** Derive the URL slug from a content entry's id (e.g. "my-guide.md" -> "my-guide"). */
export function slugOf(entry: CollectionEntry<'guides'>): string {
	return entry.id.replace(/\.md$/, '').replace(/\/index$/, '');
}
