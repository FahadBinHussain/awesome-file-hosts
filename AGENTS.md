# AGENTS.md — awesome-file-hosts

Project-local agent runbook. Read this before adding new hosts or rechecking existing ones. Scope: this repo only. Mirrors conventions in `README.md` and `CONTRIBUTING.md` — when those conflict with this file, `CONTRIBUTING.md` wins on data shape / field semantics and this file wins on workflow steps.

## Repo facts

- `data/hosts.json` = source of truth for verified hosts. README and site are downstream.
- `data/candidates.json` = backlog of unverified leads + rejected entries (rejected entries kept with `reason` + supporting `sources`).
- `data/alternatives_candidates.json`, `data/mirror_uploaders_candidates.json`, `data/cloud_migration_candidates.json` = pending entries for the three adjacent catalogs (`alternatives.json`, `mirror_uploaders.json`, `cloud_migration.json`).
- `schema/hosts.schema.json` + `schema/candidates.schema.json` + adjacent schemas = JSON Schema for each record type.
- `scripts/generate-readme.js` = generates README from data and validates every record against schema rules on every run. Also computes the "as of" freshness date automatically (see below).
- `README.md` = **generated, never hand-edit**.
- JavaScript: npm is the canonical package manager (`pnpm-lock.yaml` exists too, but `package.json` scripts are the gate). Run `npm install` once if `node_modules` is missing.

## Two commands that gate every change

```bash
npm run generate   # regenerate README.md from data and validate all records
npm run check      # fail if README.md is stale relative to data (CI-style guard)
```

`npm run generate` does:
1. Parses every JSON file.
2. Validates each record against the schema rules embedded in the script (not the standalone `*.schema.json` files — the script has its own assertions that are stricter).
3. Computes `lastUpdated` = the latest `sources[].retrieved_at` across **all** host sources (`getLatestRetrievedAt` in `scripts/generate-readme.js:816`), then prints it into the README's "What this includes" line as "checked against current public sources as of {date}".
4. Writes `README.md` (unless `--check`).

Implication: **the freshness date is bumped automatically by adding/updating a `sources[].retrieved_at` value** when you recheck a host. Do not hand-edit the date in README — it is regenerated.

## Workflow A — add a new site as a verified host

Use only when official/public sources already support every field. Otherwise start in Workflow C (candidate).

1. Check it is not already present (search `data/hosts.json` and `data/candidates.json` by `url` and `name`).
2. Open the host's official pages (pricing/plans, FAQ, terms, API docs, CLI docs, security/privacy page). Prefer official vendor pages. Use archived/secondary sources only for shutdowns or when first-party is gone.
3. Build the record following `CONTRIBUTING.md` Field guide + the `schema/hosts.schema.json` shape. Hard rules from `scripts/generate-readme.js`:
   - `url` must be `https://`.
   - `summary` non-empty.
   - `free_model.value` in `{free-forever, free-trial, credit-card-trial, paid-only, unknown}`.
   - `limits.max_file_size`, `limits.retention`, `limits.storage`, `limits.bandwidth` required; each holds `{value, unit, notes}` and optional `source_refs`.
   - When `storage` or `retention` has `value=null` and `unit=null`, you **must** add `status` in `{published, unlimited, no-automatic-expiry, conditional, not-published, not-applicable}` (see `validateStructuredNullLimit` at `scripts/generate-readme.js:57`). Optional for `max_file_size`/`bandwidth` but recommended.
   - `account.required` is boolean or null; `account.benefits` is a string.
   - `developer.api_available` boolean; `developer.api_docs_url` null or `https` URL; `developer.cli_friendly` boolean; `developer.cli_example` string or null; `developer.notes` string.
   - `content.allowed_file_types.mode` non-empty string; `allowed_extensions` and `blocked_extensions` are arrays of **dot-prefixed** extension strings (`^\.[A-Za-z0-9][A-Za-z0-9+._*-]*$`, no duplicates). Do not infer from what the uploader accepts — only document rules from official terms/FAQ/help.
   - `security.{https_only, e2ee}` boolean; `security.server_side_encryption` boolean or null; `security.notes` string.
   - `tags` non-empty array of non-empty unique strings.
   - `sources` non-empty array; each entry `{label, url, retrieved_at("YYYY-MM-DD"), notes}`. `url` must be `https://`.
   - Every `source_refs` array (if present on a subfield) must be non-empty, deduped, non-negative integers, and within range of `sources.length`.
4. Insert alphabetically by `name` into `data/hosts.json` (array stays sorted — the generator also sorts, but keep it tidy).
5. Run `npm run generate` and read any assertion error → fix and re-run.
6. Run `npm run check` and confirm it passes (README matches generated output).
7. Commit with a normal lowercase message in your style, e.g. `Add <host name> to file hosts catalog`. Do not mention AI/agent/tooling in the commit. Do not commit unless explicitly asked.

## Workflow B — recheck existing hosts (freshness sweep)

Goal: bump `sources[].retrieved_at` for hosts whose facts still match the current public source, and fix or retire hosts that changed. Each rechecked host that still holds gets a **new** `retrieved_at` = today's date on its re-verified sources (the auto-computed "as of" date in README moves forward with these).

Baseline cadence: aim for a sweep roughly every 2-3 months, or sooner if a specific host is suspected to have changed (shutdown, free tier dropped, size limit changed). The README's own "as of" date is the staleness signal — when it is more than ~10 weeks old, queue a sweep.

Per host:
1. Open the most recent source URL(s) cited in that host's `sources` array. Re-fetch the current public pages.
2. Compare published free limits, retention, storage, bandwidth, account requirement, API/CLI availability, file-type policy, E2EE/security posture vs the recorded values.
3. If everything still matches:
   - Add a **new** source entry to `sources` with the current official URL and `retrieved_at` = today (or bump the existing source's `retrieved_at` if it is the same URL — prefer a fresh dated entry so the audit trail is visible).
   - Optionally update `notes` on relevant subfields to cite the new ref via `source_refs`.
   - Do not change the facts themselves.
4. If a fact changed:
   - Update the `value`/`unit`/`notes` to match current source.
   - Update or add `source_refs` to point to the new source.
   - If the change is large (free tier removed, service shutdown, paid-only pivot) → move the host to `data/candidates.json` with `verification_status: "rejected"` and a `reason` instead of silently keeping it verified (see Workflow D).
5. If the host is gone (domain dead / service discontinued) → Workflow D.
6. Re-run `npm run generate` after every batch (it validates structure). `npm run check` to confirm README regeneration matches.

Sweep hygiene:
- Work in batches (e.g. 25-50 hosts per session) to keep the diff reviewable.
- One commit per batch is fine, e.g. `refresh <range> hosts against current sources`.
- If a research session stalls (paywall, country block with no workaround, broken upstream), state the specific blocker instead of guessing the fact. Leave `value: null` + a `notes` pointer to the gap rather than backfilling from memory.
- Do not resubmit a host with the same facts under a new `retrieved_at` unless you actually opened the cited source this session.

## Workflow C — add a new site as a candidate (unverified)

Use when the service looks promising but you have not yet confirmed every required field from official sources, or when someone submits a lead that needs review.

1. Confirm it isn't already in `data/hosts.json` or `data/candidates.json`.
2. Build a candidate record following `schema/candidates.schema.json` (same core shape as `hosts.json` plus `verification_status: "verified" | "rejected" | "pending"` and a nullable `reason`).
3. Fill every field you can from the lead; leave gaps as `null` with a `notes` pointer to the missing evidence.
4. Insert into the appropriate candidates file:
   - `data/candidates.json` — main file hosts
   - `data/alternatives_candidates.json` — other-ways-to-share (Pixelfed-style)
   - `data/mirror_uploaders_candidates.json` — mirror uploader tools
   - `data/cloud_migration_candidates.json` — cloud migration target helpers
5. Run `npm run generate` (validates candidate shape too) then `npm run check`.
6. Triage later in Workflow D.

## Workflow D — promote or reject a candidate

Promote (candidate → verified host):
1. Open every current official source cited in the candidate.
2. Verify each required hosts-schema field against the live source (same hard rules as Workflow A).
3. If everything checks out: remove the entry from `data/candidates.json` (or other `*_candidates.json`), build the canonical hosts-schema record, insert alphabetically into `data/hosts.json` (or `alternatives.json`/`mirror_uploaders.json`/`cloud_migration.json` if it is an adjacent-catalog entry — drop the `verification_status`/`reason` fields), add a fresh `sources[].retrieved_at` = today.

Reject (candidate stays in candidates, marked rejected):
1. Set `verification_status: "rejected"`.
2. Fill `reason` with one of the short reasons already used in the repo: `Service discontinued`, `Free tier no longer exists`, `Product is not actually a public file host`, `Not enough public evidence to verify`, `Corrupt import`, etc. Keep it short and factual.
3. Keep supporting URLs inside `sources` — never delete them, even on rejection.
4. Move on; do not delete the record. Rejected entries are preserved on purpose so they are not rediscovered later.

Leave pending (`verification_status: "pending"`):
- Use for leads you have not had time to verify yet. The README's "N main-host leads still in review" count is derived from these — keep the count honest.

## Workflow E — fix a host (e.g. a broken or wrong fact)

1. Open the cited source. Confirm the recorded value is wrong vs current source (do not trust memory — open the URL).
2. Fix the value/unit/notes, add a new dated `sources` entry pointing at the current source, and update `source_refs` on the corrected subfield.
3. Run `npm run generate` then `npm run check`.
4. Commit message style: `correct <host> <field> against <source>` or `fix <host> …`.

## Doing this from a non-interactive agent shell

- `git push` from an agent shell does not work without setup — see global rule 70 in the top-level AGENTS.md (`C:\Users\Admin\AGENTS.md`). Only push when the user explicitly asks; otherwise stop after `npm run check` passes and report back.
- Webfetch each official source URL rather than scraping blindly. If a needed source is blocked (paywall, region), name the blocked URL/action instead of guessing the fact (global rule 25).
- For vision needs (PDF pricing pages, screenshots of ToS) use the `opencode/mimo-v2.5-free` flow from global rule 3 — do not skip vision just because the page is an image.
- Do not edit `README.md` directly — it is regenerated. If you find a typo in README, fix the underlying data and regenerate.

## Gotchas

- `npm run check` false-positives on Windows clones with `git config core.autocrlf true`: the generated README is LF while the checked-out README is CRLF, so it reports "README.md is out of date" even on a clean tree. Confirm with `git diff README.md` after `npm run generate` — an empty diff means line-endings, not stale data. CI on ubuntu is unaffected; setting `core.autocrlf false` in the clone also fixes it.
- `npm run generate` will refuse silent drift: if any record breaks a schema assertion it throws and writes nothing. Do not "just remove a field to make it pass" without checking the schema - the assertions encode real dataset invariants.
- `storage` and `retention` nulls require a `status`; `max_file_size` and `bandwidth` nulls do not. Easy to mix up.
- Extension strings must be dot-prefixed (`.zip`, not `zip`) and unique within each list.
- `retrieved_at` must be `YYYY-MM-DD` (regex-validated); today = `2026-07-31` for this session.
- Source refs are 0-indexed offsets into that record's own `sources` array.
- Do not move entries between `alternatives`/`mirror_uploaders`/`cloud_migration`/`hosts` without confirming the rule for that catalog — those have adjacent schemas (`schema/adjacent.schema.json`, `schema/adjacent-candidates.schema.json`) and different shape additions (e.g. `kind`, `profile`).
- The auto-freshness date only looks at `data/hosts.json`'s `retrieved_at` values — rechecking a candidates-only entry does not bump README freshness.
