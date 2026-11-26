# Daily Blog System — Rozgar Raasta Pakistan

One new honest guide every day. No invented jobs, salaries, deadlines or guarantees.

## Files

- `scripts/daily-queue.json` — the machine-readable 30-day queue (keep in sync with `docs/daily-blog-calendar.md`).
- `docs/daily-blog-calendar.md` — the human-readable 30-day calendar with topic briefs + official sources.
- `scripts/new-guide.mjs` — scaffolds one guide file with correct frontmatter + section skeleton.
- `scripts/publish-daily.mjs` — the daily publisher (scaffold → safety gate → build → verify → commit → push).

## Daily workflow (the normal day)

1. Run the publisher (from the project root):
   ```bash
   cd ~/workspace/coding/projects/rozgar-raasta-pakistan
   GITHUB_PAT='<fine-grained PAT, Contents read/write on this repo>' node scripts/publish-daily.mjs
   ```
   It picks the next `queued` topic due today, scaffolds it if missing, then **stops** if the body is not written yet.
2. Write the guide body in `src/content/guides/<slug>.md` — 800–1,200 words, official source links, step-by-step, eligibility/limitations, 4+ FAQs, 3 related articles. No TODO markers left.
3. Run the same command again. It builds, verifies (page exists, sitemap contains it, no broken internal links, no placeholder text), marks the topic `done` in the queue + calendar, commits and pushes to `main`. Vercel auto-deploys.

## One-off: scaffold a single guide manually

```bash
node scripts/new-guide.mjs <slug> --title "..." --category <category> --date YYYY-MM-DD --description "..." --tags "a,b,c"
```

Categories (must match the content schema): `freelancing`, `career`, `student`, `skills`, `earning`, `business`, `ai-tools`.

## Cron (runs daily 09:00 PKT = 04:00 UTC)

```cron
0 4 * * * cd /home/hatch/workspace/coding/projects/rozgar-raasta-pakistan && GITHUB_PAT='<token>' /usr/bin/node scripts/publish-daily.mjs >> /home/hatch/workspace/coding/projects/rozgar-raasta-pakistan/logs/daily.log 2>&1
```

Notes:
- The cron only **publishes** a guide whose body is already written. If the next topic is still a skeleton, the script exits with code 2 and logs "scaffold created" — it never publishes thin content.
- The token is passed through the environment only. Never put it in a file.
- After day 30, add the next 30 topics to `scripts/daily-queue.json` AND `docs/daily-blog-calendar.md` together.

## Safety gates (publish-daily refuses to publish when)

- The guide file still contains a `TODO` marker.
- The body is under 800 words.
- `npm run build` fails.
- The built page is missing from `dist/guides/<slug>/`.
- The sitemap does not contain the new guide URL.
- Any internal link in the new guide is broken.
- Placeholder text (`lorem`, `TODO`, `placeholder`) appears in the built page.
