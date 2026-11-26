# Rozgar Raasta Pakistan — Daily Blog Calendar (30 Days)

**Rule:** One new honest guide every day. Every topic is a real question Pakistanis ask. No invented jobs, salaries, deadlines, statistics or testimonials. No guaranteed income. If a deadline/amount/fee is not officially published, the guide must say "check the official site" instead of stating one. Each guide: 800–1,200 words, official source links, step-by-step process, eligibility/limitations, 4+ FAQs, 3 related articles.

**How the daily pipeline works:** the machine-readable queue is `scripts/daily-queue.json` (same topics, same order — keep both in sync). Run `node scripts/publish-daily.mjs` once a day: it picks the next `queued` topic, scaffolds it with `scripts/new-guide.mjs`, then refuses to publish until the body is written to 800+ words (no skeleton goes live), builds, verifies, commits and pushes to `main` — Vercel auto-deploys. See `scripts/README.md` for the exact daily command and the cron line.

**Status:** `done` = published on the site. `queued` = planned, not yet written.

| Day | Date | Slug | Title | Category | Status |
|-----|------|------|-------|----------|--------|
| 1 | 2026-11-27 | how-to-earn-from-youtube-in-pakistan | How to Earn From YouTube in Pakistan: A Realistic Beginner's Guide | earning | done |
| 2 | 2026-11-28 | how-to-get-a-remote-job-in-pakistan-without-experience | How to Get a Remote Job in Pakistan Without Experience | career | done |
| 3 | 2026-11-29 | hec-need-based-scholarship-how-to-apply | HEC Need-Based Scholarship: How to Apply in Pakistan | student | done |
| 4 | 2026-11-30 | how-to-learn-graphic-design-free-and-find-clients | How to Learn Graphic Design Free and Find Clients in Pakistan | skills | done |
| 5 | 2026-12-01 | ppsc-vs-fpsc-which-exam-to-prepare | PPSC vs FPSC: Which Exam Should You Prepare For? | career | done |
| 6 | 2026-12-02 | how-to-sell-on-daraz-in-pakistan | How to Sell on Daraz in Pakistan: A Beginner's Guide | business | done |
| 7 | 2026-12-03 | how-to-write-a-freelance-proposal-that-gets-replies | How to Write a Freelance Proposal That Gets Replies | freelancing | done |
| 8 | 2026-12-04 | how-to-create-a-linkedin-profile-that-gets-recruiter-attention | How to Create a LinkedIn Profile That Gets Recruiter Attention | career | queued |
| 9 | 2026-12-05 | how-to-apply-for-jobs-on-rozee-pk | How to Apply for Jobs on Rozee.pk | career | queued |
| 10 | 2026-12-06 | free-english-speaking-practice-for-job-interviews | Free English Speaking Practice for Job Interviews | skills | queued |
| 11 | 2026-12-07 | how-to-start-a-blog-and-earn-from-it-in-pakistan | How to Start a Blog and Earn From It in Pakistan | earning | queued |
| 12 | 2026-12-08 | navttc-free-courses-how-to-enrol | NAVTTC Free Courses: How to Enrol | skills | queued |
| 13 | 2026-12-09 | how-to-prepare-for-the-css-exam-a-beginners-roadmap | How to Prepare for the CSS Exam: A Beginner's Roadmap | career | queued |
| 14 | 2026-12-10 | how-to-get-paid-through-payoneer-in-pakistan | How to Get Paid Through Payoneer in Pakistan | earning | queued |
| 15 | 2026-12-11 | best-free-tools-for-students-in-pakistan | Best Free Tools for Students in Pakistan | ai-tools | queued |
| 16 | 2026-12-12 | how-to-find-internships-on-linkedin | How to Find Internships on LinkedIn | student | queued |
| 17 | 2026-12-13 | how-to-start-a-youtube-channel-for-education-content | How to Start a YouTube Channel for Education Content | earning | queued |
| 18 | 2026-12-14 | how-to-write-a-cover-letter-for-a-government-job | How to Write a Cover Letter for a Government Job | career | queued |
| 19 | 2026-12-15 | how-to-learn-video-editing-free | How to Learn Video Editing Free | skills | queued |
| 20 | 2026-12-16 | how-to-avoid-freelance-platform-scams | How to Avoid Freelance Platform Scams | earning | queued |
| 21 | 2026-12-17 | how-to-use-google-skillshop-free-certificates | How to Use Google Skillshop Free Certificates | skills | queued |
| 22 | 2026-12-18 | how-to-prepare-a-portfolio-for-a-first-job | How to Prepare a Portfolio for a First Job | career | queued |
| 23 | 2026-12-19 | how-to-earn-by-teaching-online-in-pakistan | How to Earn by Teaching Online in Pakistan | earning | queued |
| 24 | 2026-12-20 | how-to-apply-for-jobs-in-the-gulf-from-pakistan | How to Apply for Jobs in the Gulf From Pakistan | career | queued |
| 25 | 2026-12-21 | how-to-learn-data-entry-and-get-your-first-client | How to Learn Data Entry and Get Your First Client | skills | queued |
| 26 | 2026-12-22 | how-to-use-chatgpt-for-job-applications-honestly | How to Use ChatGPT for Job Applications Honestly | ai-tools | queued |
| 27 | 2026-12-23 | how-to-start-a-home-based-food-business-in-pakistan | How to Start a Home-Based Food Business in Pakistan | business | queued |
| 28 | 2026-12-24 | how-to-check-if-a-job-advertisement-is-real-or-fake | How to Check if a Job Advertisement Is Real or Fake | career | queued |
| 29 | 2026-12-25 | how-to-get-a-scholarship-for-matric-and-inter-students | How to Get a Scholarship for Matric and Inter Students | student | queued |
| 30 | 2026-12-26 | how-to-plan-your-career-in-2027-a-practical-checklist | How to Plan Your Career in 2027: A Practical Checklist | career | queued |

## Topic briefs (angle + official sources)

**Day 8 — LinkedIn profile.** Angle: a recruiter-ready profile with headline, About, experience and skills; no fake experience. Sources: linkedin.com, linkedin.com/jobs.
**Day 9 — Rozee.pk.** Angle: create an account, build a CV on the portal, search and apply, set alerts. Sources: rozee.pk.
**Day 10 — English speaking practice.** Angle: free ways to practise speaking (shadowing, speaking clubs, free apps) aimed at interviews. Sources: British Council free resources (britishcouncil.org), Khan Academy (khanacademy.org).
**Day 11 — Blogging.** Angle: pick a topic, free platform, write useful posts, apply for AdSense only when the site has real content; earnings are slow and never guaranteed. Sources: support.google.com/adsense, wordpress.com, blogger.com.
**Day 12 — NAVTTC courses.** Angle: what NAVTTC offers, who can enrol, how to apply through the official portal. Sources: navttc.gov.pk.
**Day 13 — CSS roadmap.** Angle: what CSS is, eligibility (bachelor's degree), subjects, a realistic 6–12 month study plan; no date/seat claims. Sources: fpsc.gov.pk.
**Day 14 — Payoneer.** Angle: create an account, link a bank, receive payments from freelance platforms; fees vary — check the official fee page. Sources: payoneer.com, upwork.com, fiverr.com.
**Day 15 — Free student tools.** Angle: a curated list of genuinely free tools (Google Docs, Canva, Notion, Grammarly free tier, freeCodeCamp). Sources: the tools' own sites.
**Day 16 — Internships on LinkedIn.** Angle: search filters, applying, following up, what to put in a first CV. Sources: linkedin.com/jobs.
**Day 17 — Education YouTube channel.** Angle: choose a subject, plan lessons, record with a phone, publish consistently; monetisation is covered in the Day 1 guide. Sources: youtube.com, support.google.com/youtube.
**Day 18 — Government-job cover letter.** Angle: formal format, reference the advertisement number, match the job requirements honestly. Sources: ppsc.gop.pk, fpsc.gov.pk, njp.gov.pk.
**Day 19 — Video editing free.** Angle: CapCut, DaVinci Resolve free version, YouTube tutorials, practice by editing sample clips. Sources: blackmagicdesign.com (DaVinci Resolve), capcut.com.
**Day 20 — Freelance platform scams.** Angle: how to spot fake clients, never pay to get work, never share OTPs/passwords, report suspicious accounts. Sources: upwork.com, fiverr.com, freelancer.com (safety pages).
**Day 21 — Google Skillshop.** Angle: free Google courses and certificates, which ones help a CV, how to enrol. Sources: skillshop.withgoogle.com.
**Day 22 — First-job portfolio.** Angle: what a fresh graduate puts in a portfolio (projects, coursework, volunteer work) and how to present it. Sources: behance.net (for design), github.com (for code).
**Day 23 — Teaching online.** Angle: tutoring subjects, platforms, setting a fair price, first students from your own network; no income promise. Sources: Preply (preply.com), Superprof (superprof.com) — present as options, not endorsements.
**Day 24 — Gulf jobs.** Angle: apply through licensed overseas employment promoters and official portals, verify the offer, never pay an agent a large upfront fee. Sources: Bureau of Emigration & Overseas Employment (beoe.gov.pk), jobs.gov.pk.
**Day 25 — Data entry.** Angle: typing accuracy, spreadsheets, where to find beginner data-entry work, building a sample. Sources: digiskills.pk, upwork.com, fiverr.com.
**Day 26 — ChatGPT for applications.** Angle: use AI to draft and improve a CV/cover letter, then edit in your own words and facts — never submit invented experience. Sources: chatgpt.com, openai.com.
**Day 27 — Home food business.** Angle: start small from home, food safety basics, pricing, selling through WhatsApp/Facebook and Daraz; local food licences where required. Sources: daraz.pk, sellercenter.daraz.pk.
**Day 28 — Spotting fake job ads.** Angle: check the employer's official site, no fee for applying, no WhatsApp-only "HR", verify the ad on the official portal. Sources: jobs.gov.pk, njp.gov.pk, ppsc.gop.pk, fpsc.gov.pk.
**Day 29 — Matric/Inter scholarships.** Angle: merit and need-based options for school students, where to check (school, board, PEEF), documents needed. Sources: peef.org.pk, hec.gov.pk.
**Day 30 — 2027 career checklist.** Angle: a practical year plan — one skill, one portfolio, one application routine, monthly review. No promises, just a plan.

## After day 30

Start a new 30-day block: pick the next 30 real questions from reader comments, search trends and the opportunity database. Keep the same honesty rules. Update this file and `scripts/daily-queue.json` together.
