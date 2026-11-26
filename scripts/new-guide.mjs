// new-guide.mjs — scaffold a new Rozgar Raasta Pakistan guide.
// Usage:
//   node scripts/new-guide.mjs <slug> --title "..." --category <category> --date YYYY-MM-DD \
//     [--description "..."] [--tags "a,b,c"]
// Creates src/content/guides/<slug>.md with correct frontmatter and the full
// required section skeleton. The body sections contain HTML-comment prompts
// (invisible in the rendered page) — the writer fills them in. Refuses to
// overwrite an existing file. Exit code 0 on success, 1 on error.

import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const CATEGORIES = ['freelancing', 'career', 'student', 'skills', 'earning', 'business', 'ai-tools'];

function fail(msg) {
	console.error(`new-guide: error: ${msg}`);
	process.exit(1);
}

function parseArgs(argv) {
	const args = { _: [] };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a.startsWith('--')) {
			const key = a.slice(2);
			const val = argv[i + 1];
			if (val === undefined || val.startsWith('--')) fail(`missing value for --${key}`);
			args[key] = val;
			i++;
		} else {
			args._.push(a);
		}
	}
	return args;
}

const args = parseArgs(process.argv.slice(2));
const slug = args._[0];
if (!slug) fail('usage: node scripts/new-guide.mjs <slug> --title "..." --category <category> --date YYYY-MM-DD [--description "..."] [--tags "a,b,c"]');
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(`bad slug "${slug}" — use lowercase letters, numbers and hyphens only`);
const title = args.title || fail('missing --title');
const category = args.category || fail('missing --category');
if (!CATEGORIES.includes(category)) fail(`bad category "${category}" — must be one of: ${CATEGORIES.join(', ')}`);
const date = args.date || fail('missing --date YYYY-MM-DD');
if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) fail(`bad date "${date}" — use YYYY-MM-DD`);
const description = args.description || title;
const tags = (args.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
if (tags.length === 0) fail('missing --tags (comma-separated, e.g. "freelancing,beginners,pakistan")');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'content', 'guides');
const outFile = join(outDir, `${slug}.md`);
if (existsSync(outFile)) fail(`file already exists: src/content/guides/${slug}.md`);

const frontmatter = [
	'---',
	`title: "${title.replace(/"/g, '\\"')}"`,
	`description: "${description.replace(/"/g, '\\"')}"`,
	`category: ${category}`,
	`tags: [${tags.map((t) => `"${t}"`).join(', ')}]`,
	`date: ${date}`,
	`updated: ${date}`,
	'author: "Rozgar Raasta Team"',
	'featured: false',
	'---',
	'',
].join('\n');

const body = `# ${title}

<!-- TODO: write a 2–3 sentence introduction. State what the guide covers and the honest outcome (no income or job guarantees). -->

## The Reader's Actual Problem

<!-- TODO: describe the reader's real problem in their own words, then promise what this guide answers. -->

## What You Need to Know First

<!-- TODO: explain the topic plainly — what it is, how it works, what it does NOT do. No invented numbers. -->

## Step-by-Step: How to Do It

<!-- TODO: numbered steps. Each step: what to do, where (official site), and what to expect. -->

### Step 1: <!-- first step -->

<!-- TODO -->

### Step 2: <!-- second step -->

<!-- TODO -->

### Step 3: <!-- third step -->

<!-- TODO -->

## Eligibility and Limitations

<!-- TODO: who can apply/use this, what is required, and the honest limits (fees, competition, no guarantees). -->

## Common Mistakes to Avoid

<!-- TODO: 3–5 real mistakes, including scams to watch for. -->

## Examples

<!-- TODO: realistic general examples only — NO invented named people, NO invented earnings. -->

## Official Sources

<!-- TODO: bulleted links to official sites only, e.g. - [Name](https://example.com) -->

## FAQs

<!-- TODO: at least 4 questions with honest answers. -->

### <!-- question 1 -->

<!-- TODO: answer. -->

### <!-- question 2 -->

<!-- TODO: answer. -->

### <!-- question 3 -->

<!-- TODO: answer. -->

### <!-- question 4 -->

<!-- TODO: answer. -->

## Related Articles

<!-- TODO: 3 bullet links to existing guides, e.g. - [Title](/guides/slug) -->
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, frontmatter + body);
console.log(`new-guide: created src/content/guides/${slug}.md`);
console.log('new-guide: fill in every TODO section (800–1,200 words), then run: npm run build');
