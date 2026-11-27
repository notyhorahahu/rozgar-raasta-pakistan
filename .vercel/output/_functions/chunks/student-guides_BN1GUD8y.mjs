import { t as __exportAll } from "./rolldown-runtime_D3KUYPsf.mjs";
import { o as renderComponent, p as renderTemplate } from "./server_D5ItN1nv.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import "./compiler_CFsG9cGQ.mjs";
import { t as $$CategoryPage } from "./CategoryPage_BJMpxYJG.mjs";
// src/pages/student-guides.astro
var student_guides_exports = /* @__PURE__ */ __exportAll({
	default: () => $$StudentGuides,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$StudentGuides = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "CategoryPage", $$CategoryPage, {
		"heroImage": "/images/cat-student.jpg",
		"heroImageAlt": "Pakistani university students studying together at a library table",
		"title": "Student Guides",
		"description": "Guides for Pakistani students — scholarships, internships, choosing a career after Matric and Inter, and free courses.",
		"intro": "You are a student in Pakistan and you want a clear path — what to study, where to get funding, and how to get your first job. These guides answer those questions honestly, with official links.",
		"oppCategories": ["scholarship", "internship"],
		"guideCategories": ["student"],
		"guideHeading": "Student Guides",
		"officialLinks": [
			{
				label: "Higher Education Commission (HEC)",
				href: "https://www.hec.gov.pk/",
				note: "Scholarships and higher education in Pakistan."
			},
			{
				label: "DigiSkills",
				href: "https://digiskills.pk/",
				note: "Free digital skills training."
			},
			{
				label: "Khan Academy",
				href: "https://www.khanacademy.org/",
				note: "Free courses for school and university students."
			},
			{
				label: "NAVTTC",
				href: "https://navttc.gov.pk/",
				note: "Free technical and vocational training."
			}
		]
	})}`;
}, "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/student-guides.astro", void 0);
var $$file = "/home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/src/pages/student-guides.astro";
var $$url = "/student-guides";
// \0virtual:astro:page:src/pages/student-guides@_@astro
var page = () => student_guides_exports;
export { page };
