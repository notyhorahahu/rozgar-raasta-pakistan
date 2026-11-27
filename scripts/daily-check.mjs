// Daily maintenance check for Rozgar Raasta Pakistan.
// Run every morning:  node scripts/daily-check.mjs
// Exits 0 when everything passes, 1 when any check fails.
// Checks:
//   1. Live site: homepage + all main pages + sitemap + robots + RSS return 200.
//   2. Local build: `npm run build` succeeds (catches broken code/content).
//   3. Broken internal links in dist/ (ignores JS template literals).
//   4. Stale opportunities: deadline passed but status is still "open".
//   5. Guide count + content sanity (every guide has title/description/dates).
// No dependencies. Uses global fetch (Node 18+).

import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SITE = process.env.RRP_SITE_URL || 'https://rozgar-raasta-pakistan.vercel.app';
const TODAY = new Date().toISOString().slice(0, 10);

let failures = [];
let passes = [];
const fail = (msg) => { failures.push(msg); console.log(`  FAIL  ${msg}`); };
const pass = (msg) => { passes.push(msg); console.log(`  ok    ${msg}`); };

async function headOk(url, timeoutMs = 15000) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal });
    clearTimeout(t);
    return res.status;
  } catch {
    return 0;
  }
}

async function checkLive() {
  console.log('\n[1] Live site checks — ' + SITE);
  const pages = [
    '', 'about', 'contact', 'privacy', 'terms', 'disclaimer',
    'editorial-policy', 'corrections-policy', 'advertise',
    'opportunities', 'jobs/government', 'jobs/private', 'jobs/remote',
    'earning', 'freelancing', 'skills', 'scholarships', 'internships',
    'ai-tools', 'student-guides', 'business-guides', 'cv-builder',
    'career-preparation', 'guides', 'search', 'admin',
    'sitemap-index.xml', 'robots.txt', 'rss.xml', 'favicon.svg',
  ];
  for (const p of pages) {
    const url = `${SITE}/${p}`;
    const status = await headOk(url);
    if (status === 200) pass(`GET /${p} -> 200`);
    else fail(`GET /${p} -> ${status || 'no response'} (expected 200)`);
  }
  // 404 must stay 404
  const s404 = await headOk(`${SITE}/this-page-does-not-exist-xyz/`);
  if (s404 === 404) pass('GET /this-page-does-not-exist-xyz/ -> 404 (correct)');
  else fail(`GET /this-page-does-not-exist-xyz/ -> ${s404} (expected 404)`);
}

function checkBuild() {
  console.log('\n[2] Local build — npm run build');
  try {
    const out = execSync('npm run build', { cwd: ROOT, stdio: 'pipe', timeout: 180000 }).toString();
    const m = out.match(/(\d+) page\(s\) built/);
    if (m) pass(`build passed — ${m[1]} pages built`);
    else pass('build passed');
  } catch (e) {
    const tail = (e.stdout?.toString() || '') + (e.stderr?.toString() || '');
    fail('npm run build FAILED:\n' + tail.slice(-1500));
  }
}

function collectRoutes(dist) {
  const routes = new Set(['/']);
  const assets = new Set();
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) { walk(p); continue; }
      const rel = '/' + relative(dist, p).split(/[/\\]/).join('/');
      if (name.endsWith('.html')) {
        let r = rel.slice(0, -5);
        if (r.endsWith('/index')) r = r.slice(0, -6) || '/';
        routes.add(r === '' ? '/' : r);
      } else {
        assets.add(rel);
      }
    }
  };
  walk(dist);
  return { routes, assets };
}

function checkLinks() {
  console.log('\n[3] Broken internal links in dist/');
  // With the @astrojs/vercel adapter, static output lives in dist/client/
  // (dist/ itself only holds client/ + server/). Without an adapter it is
  // dist/ directly. Prefer dist/client when it exists.
  const dist = existsSync(join(ROOT, 'dist', 'client')) ? join(ROOT, 'dist', 'client') : join(ROOT, 'dist');
  if (!existsSync(dist)) { fail('dist/ does not exist — run the build first'); return; }
  const { routes, assets } = collectRoutes(dist);
  // Server-rendered routes (prerender = false) have no HTML file in
  // dist/ but are real pages served by the Vercel adapter — the admin
  // CRUD milestone made the homepage, listings, guides, search index
  // and RSS server-rendered so admin edits appear at once.
  const dynamicRoutes = new Set([
    '/', '/opportunities', '/guides', '/jobs/government', '/jobs/private',
    '/jobs/remote', '/earning', '/freelancing', '/skills', '/scholarships',
    '/internships', '/ai-tools', '/student-guides', '/business-guides',
    '/career-preparation', '/search', '/search-index.json', '/rss.xml',
  ]);
  const isDynamic = (cand) => dynamicRoutes.has(cand) || cand.startsWith('/guides/');
  const broken = [];
  let checked = 0;
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) { walk(p); continue; }
      if (!name.endsWith('.html')) continue;
      const html = readFileSync(p, 'utf-8');
      // strip <script> blocks: hrefs inside JS template literals are not real links
      const noScript = html.replace(/<script[\s\S]*?<\/script>/g, '');
      for (const m of noScript.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const u = m[1];
        if (/^(https?:|mailto:|tel:|#|data:|javascript:|\/\/)/i.test(u)) continue;
        if (u.includes('${')) continue;
        let path = u.split(/[?#]/)[0];
        if (!path) continue;
        checked++;
        const cand = path.replace(/\/$/, '') || '/';
        const file = join(dist, path.replace(/^\//, ''));
        const idx = join(dist, path.replace(/^\//, ''), 'index.html');
        if (routes.has(cand) || assets.has(path) || isDynamic(cand) || existsSync(file) || existsSync(idx)) continue;
        broken.push(`${relative(dist, p)} -> ${u}`);
      }
    }
  };
  walk(dist);
  if (broken.length === 0) pass(`${checked} internal links checked, 0 broken`);
  else {
    for (const b of broken.slice(0, 20)) fail('broken link: ' + b);
    if (broken.length > 20) fail(`...and ${broken.length - 20} more broken links`);
  }
}

function checkOpportunities() {
  console.log('\n[4] Opportunities data freshness');
  const file = join(ROOT, 'src/data/opportunities.json');
  if (!existsSync(file)) { fail('src/data/opportunities.json missing'); return; }
  const ops = JSON.parse(readFileSync(file, 'utf-8'));
  let stale = 0;
  for (const o of ops) {
    if (o.status === 'open' && o.deadline && o.deadline < TODAY) {
      stale++;
      fail(`stale opportunity still "open": "${o.title}" (${o.organization}) deadline ${o.deadline} — set status to "closed"`);
    }
    for (const k of ['title', 'organization', 'category', 'sourceUrl', 'status', 'verifiedDate']) {
      if (!o[k]) fail(`opportunity missing ${k}: ${JSON.stringify(o.title)}`);
    }
  }
  const open = ops.filter((o) => o.status === 'open').length;
  if (stale === 0) pass(`${ops.length} opportunities (${open} open), none past deadline`);
}

function checkGuides() {
  console.log('\n[5] Guide content sanity');
  const dir = join(ROOT, 'src/content/guides');
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  let bad = 0;
  for (const f of files) {
    const t = readFileSync(join(dir, f), 'utf-8');
    const fm = t.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) { fail(`guide ${f}: no frontmatter`); bad++; continue; }
    for (const k of ['title', 'description', 'category', 'date', 'updated']) {
      if (!new RegExp(`^${k}:`, 'm').test(fm[1])) { fail(`guide ${f}: missing frontmatter ${k}`); bad++; }
    }
    const words = t.replace(/^---[\s\S]*?---/, '').trim().split(/\s+/).length;
    if (words < 500) { fail(`guide ${f}: only ${words} words (too thin)`); bad++; }
    if (/lorem ipsum|TODO|placeholder/i.test(t)) { fail(`guide ${f}: contains placeholder text`); bad++; }
  }
  if (bad === 0) pass(`${files.length} guides, all have frontmatter + 500+ words, no placeholders`);
}

async function main() {
  console.log(`Rozgar Raasta Pakistan — daily check (${TODAY})`);
  await checkLive();
  checkBuild();
  checkLinks();
  checkOpportunities();
  checkGuides();
  console.log(`\nRESULT: ${passes.length} passed, ${failures.length} failed`);
  if (failures.length) {
    console.log('\nFailures to fix:');
    failures.forEach((f, i) => console.log(` ${i + 1}. ${f.split('\n')[0]}`));
    process.exit(1);
  }
  console.log('All green. Site is healthy.');
}

main().catch((e) => { console.error('daily-check crashed:', e); process.exit(1); });
