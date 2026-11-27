/** Shared JSON-LD builders. Only real site data is used — nothing is fabricated. */

export function organizationJsonLd(siteUrl: string): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Rozgar Raasta Pakistan',
		url: siteUrl,
		logo: `${siteUrl}/logo.svg`,
		slogan: 'Learn Skills. Find Opportunities. Build Your Future.',
		sameAs: [],
	};
}

export function breadcrumbJsonLd(
	items: { name: string; url: string }[]
): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: item.url,
		})),
	};
}
