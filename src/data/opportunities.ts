export interface Opportunity {
	title: string;
	organization: string;
	category:
		| 'government'
		| 'private'
		| 'remote'
		| 'earning'
		| 'freelancing'
		| 'scholarship'
		| 'internship'
		| 'course'
		| 'ai-tools';
	type: 'job' | 'course' | 'scholarship' | 'internship' | 'guide';
	location: string;
	deadline: string | null;
	sourceUrl: string;
	eligibility: string;
	procedure: string;
	fees: string;
	verifiedDate: string;
	status: 'open' | 'closed' | 'unverified';
}

export const CATEGORY_LABELS: Record<Opportunity['category'], string> = {
	'government': 'Government Jobs',
	'private': 'Private Jobs',
	'remote': 'Remote Jobs',
	'earning': 'Online Earning',
	'freelancing': 'Freelancing',
	'scholarship': 'Scholarships',
	'internship': 'Internships',
	'course': 'Skills & Courses',
	'ai-tools': 'AI Tools',
};

export const CATEGORY_HREFS: Record<Opportunity['category'], string> = {
	'government': '/jobs/government',
	'private': '/jobs/private',
	'remote': '/jobs/remote',
	'earning': '/earning',
	'freelancing': '/freelancing',
	'scholarship': '/scholarships',
	'internship': '/internships',
	'course': '/skills',
	'ai-tools': '/ai-tools',
};

export function formatDate(iso: string | null): string {
	if (!iso) return 'No fixed deadline — check the official page';
	const d = new Date(iso + 'T00:00:00');
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function isExpired(opp: Opportunity): boolean {
	if (!opp.deadline) return false;
	return new Date(opp.deadline + 'T23:59:59') < new Date();
}

export function effectiveStatus(opp: Opportunity): 'open' | 'closed' | 'unverified' {
	if (opp.status === 'closed' || isExpired(opp)) return 'closed';
	return opp.status;
}
