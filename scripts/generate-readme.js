const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "data", "hosts.json");
const candidatesPath = path.join(root, "data", "candidates.json");
const readmePath = path.join(root, "README.md");
const schemaPath = path.join(root, "schema", "hosts.schema.json");
const candidatesSchemaPath = path.join(root, "schema", "candidates.schema.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateLimitField(name, field) {
  assert(field && typeof field === "object", `${name} must be an object`);
  assert(Object.prototype.hasOwnProperty.call(field, "value"), `${name}.value is required`);
  assert(
    field.value === null || typeof field.value === "number",
    `${name}.value must be a number or null`
  );
  assert(
    field.unit === null || typeof field.unit === "string",
    `${name}.unit must be a string or null`
  );
  assert(typeof field.notes === "string", `${name}.notes must be a string`);
}

function validateHost(host) {
  const requiredTopLevel = [
    "name",
    "url",
    "summary",
    "limits",
    "account",
    "developer",
    "content",
    "security",
    "tags",
    "sources"
  ];

  for (const key of requiredTopLevel) {
    assert(Object.prototype.hasOwnProperty.call(host, key), `Missing required field: ${key}`);
  }

  assert(typeof host.name === "string" && host.name.trim(), "name must be a non-empty string");
  assert(typeof host.url === "string" && /^https:\/\//.test(host.url), "url must be an https URL");
  assert(typeof host.summary === "string" && host.summary.trim(), "summary must be a non-empty string");

  validateLimitField(`${host.name}.limits.max_file_size`, host.limits.max_file_size);
  validateLimitField(`${host.name}.limits.retention`, host.limits.retention);
  validateLimitField(`${host.name}.limits.storage`, host.limits.storage);
  validateLimitField(`${host.name}.limits.bandwidth`, host.limits.bandwidth);

  assert(
    host.account.required === null || typeof host.account.required === "boolean",
    `${host.name}.account.required must be boolean or null`
  );
  assert(typeof host.account.benefits === "string", `${host.name}.account.benefits must be a string`);

  assert(typeof host.developer.api_available === "boolean", `${host.name}.developer.api_available must be boolean`);
  assert(
    host.developer.api_docs_url === null || /^https:\/\//.test(host.developer.api_docs_url),
    `${host.name}.developer.api_docs_url must be null or an https URL`
  );
  assert(typeof host.developer.cli_friendly === "boolean", `${host.name}.developer.cli_friendly must be boolean`);
  assert(
    host.developer.cli_example === null || typeof host.developer.cli_example === "string",
    `${host.name}.developer.cli_example must be string or null`
  );
  assert(typeof host.developer.notes === "string", `${host.name}.developer.notes must be a string`);

  assert(host.content && typeof host.content === "object", `${host.name}.content must be an object`);
  assert(
    host.content.allowed_file_types &&
      typeof host.content.allowed_file_types === "object",
    `${host.name}.content.allowed_file_types must be an object`
  );
  assert(
    typeof host.content.allowed_file_types.mode === "string" &&
      host.content.allowed_file_types.mode.trim(),
    `${host.name}.content.allowed_file_types.mode must be a non-empty string`
  );
  assert(
    typeof host.content.allowed_file_types.notes === "string",
    `${host.name}.content.allowed_file_types.notes must be a string`
  );

  assert(typeof host.security.https_only === "boolean", `${host.name}.security.https_only must be boolean`);
  assert(typeof host.security.e2ee === "boolean", `${host.name}.security.e2ee must be boolean`);
  assert(
    host.security.server_side_encryption === null ||
      typeof host.security.server_side_encryption === "boolean",
    `${host.name}.security.server_side_encryption must be boolean or null`
  );
  assert(typeof host.security.notes === "string", `${host.name}.security.notes must be a string`);

  assert(Array.isArray(host.tags) && host.tags.length > 0, `${host.name}.tags must be a non-empty array`);
  for (const tag of host.tags) {
    assert(typeof tag === "string" && tag.trim(), `${host.name}.tags must contain non-empty strings`);
  }

  assert(
    Array.isArray(host.sources) && host.sources.length > 0,
    `${host.name}.sources must be a non-empty array`
  );
  for (const source of host.sources) {
    assert(typeof source.label === "string" && source.label.trim(), `${host.name}.sources.label is required`);
    assert(typeof source.url === "string" && /^https:\/\//.test(source.url), `${host.name}.sources.url must be an https URL`);
    assert(
      typeof source.retrieved_at === "string" && /^\d{4}-\d{2}-\d{2}$/.test(source.retrieved_at),
      `${host.name}.sources.retrieved_at must be YYYY-MM-DD`
    );
    assert(typeof source.notes === "string", `${host.name}.sources.notes must be a string`);
  }
}

function validateCandidate(candidate) {
  const requiredTopLevel = [
    "name",
    "type",
    "free_volume",
    "shelf_life",
    "download_count",
    "languages",
    "applications",
    "verification_status",
    "source"
  ];

  for (const key of requiredTopLevel) {
    assert(
      Object.prototype.hasOwnProperty.call(candidate, key),
      `Missing required candidate field: ${key}`
    );
  }

  assert(
    typeof candidate.name === "string" && candidate.name.trim(),
    "candidate name must be a non-empty string"
  );
  assert(
    typeof candidate.type === "string" && candidate.type.trim(),
    "candidate type must be a non-empty string"
  );
  assert(
    candidate.free_volume === null || typeof candidate.free_volume === "string",
    `${candidate.name}.free_volume must be a string or null`
  );
  assert(
    candidate.shelf_life === null || typeof candidate.shelf_life === "string",
    `${candidate.name}.shelf_life must be a string or null`
  );
  assert(
    candidate.download_count === null || typeof candidate.download_count === "string",
    `${candidate.name}.download_count must be a string or null`
  );
  assert(Array.isArray(candidate.languages), `${candidate.name}.languages must be an array`);
  assert(Array.isArray(candidate.applications), `${candidate.name}.applications must be an array`);
  assert(
    typeof candidate.verification_status === "string",
    `${candidate.name}.verification_status must be a string`
  );
  assert(typeof candidate.source === "string" && candidate.source.trim(), `${candidate.name}.source must be a non-empty string`);
}

function formatLimit(field) {
  if (field.value === null) {
    return "See notes";
  }

  if (field.unit) {
    if (field.value === 1 && field.unit.endsWith("s")) {
      return `1 ${field.unit.slice(0, -1)}`;
    }
    return `${field.value} ${field.unit}`;
  }

  return String(field.value);
}

function formatAccount(required) {
  if (required === true) {
    return "Yes";
  }
  if (required === false) {
    return "No";
  }
  return "Unknown";
}

function formatBool(value) {
  return value ? "Yes" : "No";
}

function formatApi(host) {
  if (!host.developer.api_available) {
    return "No";
  }

  if (host.developer.api_docs_url) {
    return `[Yes](${host.developer.api_docs_url})`;
  }

  return "Yes";
}

function formatCli(host) {
  if (!host.developer.cli_friendly) {
    return "No";
  }

  if (host.developer.cli_example) {
    return "Yes*";
  }

  return "Yes";
}

function buildReadme(hosts, candidates) {
  const sortedHosts = [...hosts].sort((a, b) => a.name.localeCompare(b.name));
  const publicCandidates = candidates.filter(
    (candidate) => candidate.verification_status !== "rejected"
  );
  const sortedCandidates = [...publicCandidates].sort((a, b) => a.name.localeCompare(b.name));
  const lastUpdated = new Date().toISOString().slice(0, 10);

  const lines = [];
  lines.push("# awesome-file-hosts");
  lines.push("");
  lines.push("> A JSON-first awesome list of file hosting services. `data/hosts.json` is the source of truth; `README.md` is generated.");
  lines.push("");
  lines.push("## Why this repo exists");
  lines.push("");
  lines.push("- Keep file host metadata structured and reviewable.");
  lines.push("- Generate a human-friendly awesome-list style README from JSON.");
  lines.push("- Make contributions safer by pushing edits through schema-backed data instead of ad hoc Markdown.");
  lines.push("");
  lines.push("## Current hosts");
  lines.push("");
  lines.push(`Seeded with ${sortedHosts.length} hosts for now, with facts checked against official public pages on ${lastUpdated}.`);
  lines.push("");
  lines.push("| Name | Max file size | Retention | Bandwidth | Account required | API | CLI-friendly | E2EE | Tags |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const host of sortedHosts) {
    lines.push(
      `| [${host.name}](${host.url}) | ${formatLimit(host.limits.max_file_size)} | ${formatLimit(host.limits.retention)} | ${formatLimit(host.limits.bandwidth)} | ${formatAccount(host.account.required)} | ${formatApi(host)} | ${formatCli(host)} | ${formatBool(host.security.e2ee)} | ${host.tags.join(", ")} |`
    );
  }
  lines.push("");
  lines.push("`Yes*` in the CLI-friendly column means a concrete command or access example is included in the notes.");
  lines.push("");
  lines.push("## Notes");
  lines.push("");
  for (const host of sortedHosts) {
    lines.push(`### ${host.name}`);
    lines.push("");
    lines.push(host.summary);
    lines.push("");
    lines.push(`- Max file size: ${host.limits.max_file_size.notes}`);
    lines.push(`- Retention: ${host.limits.retention.notes}`);
    lines.push(`- Bandwidth: ${host.limits.bandwidth.notes}`);
    lines.push(`- Account: ${host.account.benefits}`);
    lines.push(`- Allowed file types: ${host.content.allowed_file_types.notes}`);
    if (host.developer.cli_example) {
      lines.push(`- CLI example: \`${host.developer.cli_example}\``);
    }
    lines.push(`- Developer support: ${host.developer.notes}`);
    lines.push(`- Security: ${host.security.notes}`);
    lines.push(
      `- Sources: ${host.sources
        .map((source) => `[${source.label}](${source.url})`)
        .join(", ")}`
    );
    lines.push("");
  }
  lines.push("## Data model");
  lines.push("");
  lines.push("- Dataset: [`data/hosts.json`](data/hosts.json)");
  lines.push("- Candidate backlog: [`data/candidates.json`](data/candidates.json)");
  lines.push("- Schema: [`schema/hosts.schema.json`](schema/hosts.schema.json)");
  lines.push("- Candidate schema: [`schema/candidates.schema.json`](schema/candidates.schema.json)");
  lines.push("- Generator: [`scripts/generate-readme.js`](scripts/generate-readme.js)");
  lines.push("");
  lines.push("## Candidate backlog");
  lines.push("");
  lines.push(
    `Captured ${sortedCandidates.length} user-submitted candidates that are still pending review or have already been verified and promoted. Rejected entries stay in \`data/candidates.json\` but are omitted from this README.`
  );
  lines.push("");
  lines.push("| Name | Type | Free volume | Shelf life | Download count | Languages | Apps | Status |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const candidate of sortedCandidates) {
    lines.push(
      `| ${candidate.name} | ${candidate.type} | ${candidate.free_volume ?? "-"} | ${candidate.shelf_life ?? "-"} | ${candidate.download_count ?? "-"} | ${candidate.languages.join(", ") || "-"} | ${candidate.applications.join(", ") || "-"} | ${candidate.verification_status} |`
    );
  }
  lines.push("");
  lines.push("## Usage");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run generate");
  lines.push("npm run check");
  lines.push("```");
  lines.push("");
  lines.push("## Contributing");
  lines.push("");
  lines.push("Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a PR.");
  lines.push("");
  lines.push("## Automation");
  lines.push("");
  lines.push("- Pull requests run `npm run check` to make sure generated output stays in sync.");
  lines.push("- Pushes to `main` regenerate `README.md` automatically and commit the result when needed.");
  lines.push("");
  lines.push("## License");
  lines.push("");
  lines.push("MIT via [`LICENSE`](LICENSE).");
  lines.push("");

  return lines.join("\n");
}

function main() {
  const hosts = readJson(dataPath);
  const candidates = readJson(candidatesPath);
  const schema = readJson(schemaPath);
  const candidatesSchema = readJson(candidatesSchemaPath);

  assert(Array.isArray(hosts), "Dataset must be an array");
  assert(Array.isArray(candidates), "Candidate dataset must be an array");
  assert(schema && typeof schema === "object", "Schema must be valid JSON");
  assert(candidatesSchema && typeof candidatesSchema === "object", "Candidate schema must be valid JSON");
  assert(hosts.length > 0, "Dataset must contain at least one host");

  for (const host of hosts) {
    validateHost(host);
  }

  for (const candidate of candidates) {
    validateCandidate(candidate);
  }

  const names = hosts.map((host) => host.name);
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  assert(
    JSON.stringify(names) === JSON.stringify(sorted),
    "Hosts must be kept in alphabetical order by name"
  );

  const nextReadme = buildReadme(hosts, candidates);
  const checkMode = process.argv.includes("--check");

  if (checkMode) {
    const currentReadme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf8") : "";
    assert(currentReadme === nextReadme, "README.md is out of date. Run `npm run generate`.");
    return;
  }

  fs.writeFileSync(readmePath, nextReadme, "utf8");
}

main();
