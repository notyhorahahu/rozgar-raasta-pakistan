// publish-daily.mjs — the daily blog publisher for Rozgar Raasta Pakistan.
// Picks the next queued topic from scripts/daily-queue.json, scaffolds it,
// then SAFETY-GATES the publish: it will NOT publish a skeleton or a short
// guide. The writer must fill the body to 800+ words first (no TODO markers).
// Then it builds, verifies the new page + sitemap + internal links, marks the
// topic done (queue + calendar), commits and pushes to main. Vercel
// auto-deploys from GitHub main.
//
// Daily command (run from the project root):
//   GITHUB_PAT='<fine-grained PAT for this repo>' node scripts/publish-daily.mjs
// Cron example (runs daily 09:00 PKT = 04:00 UTC):
//   0 4 * * * cd /home/hatch/workspace/coding/projects/rozgar-raasta-pakistan && GITHUB_PAT='<token>' /usr/bin/node scripts/publish-daily.mjs >> /home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/logs/daily.log 2>&1
// The PAT needs Contents read/write on this repo only. Never put the token in
// a file — pass it through the environment.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execSync, spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE_FILE = join(ROOT, 'scripts', 'daily-queue.json');
const CALENDAR_FILE = join(ROOT, 'docs', 'daily-blog-calendar.md');
const GUIDES_DIR = join(ROOT, 'src', 'content', 'guides');
const MIN_WORDS = 800;

function log(msg) {
	console.log(`[publish-daily ${new Date().toISOString()}] ${msg}`);
}
function fail(msg) {
	console.error(`[publish-daily] ERROR: ${msg}`);
	process.exit(1);
}
function run(cmd, opts = {}) {
	log(`$ ${cmd}`);
	try {
		execSync(cmd, { cwd: ROOT, stdio: 'inherit', ...opts });
	} catch {
		fail(`command failed: ${cmd}`);
	}
}
// Pakistan date (UTC+5) — the audience and the calendar run on PKT.
function todayPKT() {
	return new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
function wordCount(text) {
	const body = text.replace(/^---[\s\S]*?---/, '').replace(/<!--[\s\S]*?-->/g, '');
	return body.split(/\s+/).filter(Boolean).length;
}

const queue = JSON.parse(readFileSync(QUEUE_FILE, 'utf8'));
const today = todayPKT();
const next = queue.items.find((i) => i.status === 'queued' && i.date <= today);
if (!next) {
	log(`No queued topic due on or before ${today}. Nothing to publish.`);
	process.exit(0);
}
log(`Next topic: day ${next.day} (${next.date}) — ${next.title} [${next.slug}]`);

const guideFile = join(GUIDES_DIR, `${next.slug}.md`);
if (!existsSync(guideFile)) {
	log('Guide file does not exist — scaffolding it now. Fill in the body, then re-run.');
	const tags = [next.category, ...next.slug.split('-').filter((w) => w.length > 3)].slice(0, 5).join(',');
	const r = spawnSync(
		process.execPath,
		[
			join(ROOT, 'scripts', 'new-guide.mjs'),
			next.slug,
			'--title', next.title,
			'--category', next.category,
			'--date', next.date,
			'--description', next.title,
			'--tags', tags,
		],
		{ cwd: ROOT, stdio: 'inherit' },
	);
	if (r.status !== 0) fail('scaffolding failed');
	console.log('publish-daily: scaffold created. Write the 800+ word body, then run this script again.');
	process.exit(2);
}

// Safety gate: never publish a skeleton or a thin guide.
const content = readFileSync(guideFile, 'utf8');
const words = wordCount(content);
if (content.includes('TODO')) fail(`guide still contains TODO markers — finish writing it first (${guideFile})`);
if (words < MIN_WORDS) fail(`guide is only ${words} words — minimum is ${MIN_WORDS}. Finish writing it first.`);
log(`Guide word count: ${words} (minimum ${MIN_WORDS}) — OK`);

// Build + verify.
run('npm run build');
const builtPage = join(ROOT, 'dist', 'guides', next.slug, 'index.html');
if (!existsSync(builtPage)) fail(`built page missing: dist/guides/${next.slug}/index.html`);
const sitemap = readFileSync(join(ROOT, 'dist', 'sitemap-index.xml'), 'utf8');
if (!sitemap.includes(next.slug)) fail('new guide URL missing from sitemap-index.xml');
const html = readFileSync(builtPage, 'utf8');
const links = [...html.matchAll(/href="(\/[^"#"]+)"/g)].map((m) => m[1]);
const broken = [...new Set(links)].filter((href) => {
	const clean = href.replace(/\/$/, '') || '/';
	const target = join(ROOT, 'dist', clean === '/' ? 'index.html' : `${clean}/index.html`);
	const fileTarget = join(ROOT, 'dist', clean);
	return !existsSync(target) && !existsSync(fileTarget) && !existsSync(`${fileTarget}.html`);
});
if (broken.length > 0) fail(`broken internal links in new guide: ${broken.join(', ')}`);
if (/lorem|TODO|placeholder/i.test(html)) fail('placeholder text found in built page');
log('Build + sitemap + internal-link checks passed.');

// Mark done in the queue and the calendar.
next.status = 'done';
writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2) + '\n');
const cal = readFileSync(CALENDAR_FILE, 'utf8');
const calRow = new RegExp(`(\\| ${next.day} \\| ${next.date} \\| ${next.slug} \\|[^|]*\\|[^|]*\\|) queued`);
if (!calRow.test(cal)) fail('calendar row not found — update docs/daily-blog-calendar.md manually');
writeFileSync(CALENDAR_FILE, cal.replace(calRow, '$1 done'));
log('Queue + calendar marked done.');

// Commit + push (Vercel auto-deploys from main).
run('git add src/content/guides scripts/daily-queue.json docs/daily-blog-calendar.md');
const msg = `Daily blog day ${next.day}: ${next.title}`;
run(`git commit -m ${JSON.stringify(msg)}`);
if (!process.env.GITHUB_PAT) {
	log('WARNING: GITHUB_PAT is not set — attempting plain push (will fail without credentials).');
	run('git push origin main');
} else {
	run('git -c credential.helper=\'!f() { echo "username=notyhorahahu"; echo "password=$GITHUB_PAT"; }; f\' push origin main');
}
log(`Published: https://rozgar-raasta-pakistan.vercel.app/guides/${next.slug}`);
log('Done.');
