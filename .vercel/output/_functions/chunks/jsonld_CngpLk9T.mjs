// src/data/jsonld.ts
/** Shared JSON-LD builders. Only real site data is used — nothing is fabricated. */
function organizationJsonLd(siteUrl) {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Rozgar Raasta Pakistan",
		url: siteUrl,
		logo: `${siteUrl}/logo.svg`,
		slogan: "Learn Skills. Find Opportunities. Build Your Future.",
		sameAs: []
	};
}
function breadcrumbJsonLd(items) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			item: item.url
		}))
	};
}
export { organizationJsonLd as n, breadcrumbJsonLd as t };
