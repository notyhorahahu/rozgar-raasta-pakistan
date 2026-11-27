// src/data/opportunities.ts
var CATEGORY_LABELS = {
	"government": "Government Jobs",
	"private": "Private Jobs",
	"remote": "Remote Jobs",
	"earning": "Online Earning",
	"freelancing": "Freelancing",
	"scholarship": "Scholarships",
	"internship": "Internships",
	"course": "Skills & Courses",
	"ai-tools": "AI Tools"
};
function formatDate(iso) {
	if (!iso) return "No fixed deadline — check the official page";
	const d = /* @__PURE__ */ new Date(iso + "T00:00:00");
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric"
	});
}
function isExpired(opp) {
	if (!opp.deadline) return false;
	return /* @__PURE__ */ new Date(opp.deadline + "T23:59:59") < /* @__PURE__ */ new Date();
}
function effectiveStatus(opp) {
	if (opp.status === "closed" || isExpired(opp)) return "closed";
	return opp.status;
}
/**
* JobPosting JSON-LD for ONE opportunity — only for open + verified jobs
* and internships. Returns null for closed/unverified records and for
* non-job types (courses, scholarships, guides). Only real fields from
* the record are used: no datePosted is invented (verifiedDate is the
* date we checked the listing, not the date the employer posted it),
* and no salary or employment type is claimed where the data has none.
*/
function jobPostingJsonLd(opp) {
	if (effectiveStatus(opp) !== "open") return null;
	if (opp.type !== "job" && opp.type !== "internship") return null;
	const orgShort = opp.organization.replace(/\s*\(.*$/, "").replace(/,.*$/, "");
	const posting = {
		"@type": "JobPosting",
		title: opp.title,
		description: opp.eligibility,
		hiringOrganization: {
			"@type": "Organization",
			name: orgShort
		},
		jobLocation: {
			"@type": "Place",
			address: {
				"@type": "PostalAddress",
				addressLocality: opp.location
			}
		},
		url: opp.sourceUrl
	};
	if (opp.type === "internship") posting.employmentType = "INTERN";
	if (opp.deadline) posting.validThrough = opp.deadline;
	return posting;
}
/** JobPosting JSON-LD for every open + verified job/internship in a list. */
function jobPostingsJsonLd(opps) {
	return opps.map((o) => jobPostingJsonLd(o)).filter((p) => p !== null).map((p) => ({
		"@context": "https://schema.org",
		...p
	}));
}
export { jobPostingsJsonLd as i, effectiveStatus as n, formatDate as r, CATEGORY_LABELS as t };
