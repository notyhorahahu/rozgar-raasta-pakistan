export const SITE = {
	name: 'Rozgar Raasta Pakistan',
	tagline: 'Learn Skills. Find Opportunities. Build Your Future.',
	url: 'https://rozgarraasta.pages.dev',
	description:
		'Rozgar Raasta Pakistan helps Pakistanis find genuine government and private jobs, remote work, freelancing opportunities, free courses, scholarships and internships — with verified official sources.',
	email: 'hello@rozgarraasta.pages.dev',
};

export const GUIDE_CATEGORIES = [
	{ slug: 'freelancing', label: 'Freelancing', href: '/freelancing', blurb: 'Start earning online with real skills and honest platform guidance.' },
	{ slug: 'career', label: 'Career & CV', href: '/career-preparation', blurb: 'CVs, interviews and career preparation that actually work in Pakistan.' },
	{ slug: 'student', label: 'Student Guides', href: '/student-guides', blurb: 'Scholarships, internships and study guidance for Pakistani students.' },
	{ slug: 'skills', label: 'Skills & Courses', href: '/skills', blurb: 'Free and affordable courses to build job-ready skills.' },
	{ slug: 'earning', label: 'Online Earning', href: '/earning', blurb: 'Realistic, honest guides to earning online — no fake promises.' },
	{ slug: 'business', label: 'Business Guides', href: '/business-guides', blurb: 'Start a small business or online shop in Pakistan, step by step.' },
	{ slug: 'ai-tools', label: 'AI Tools', href: '/ai-tools', blurb: 'Free AI tools that help students and job seekers work smarter.' },
] as const;
