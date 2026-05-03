const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "data", "hosts.json");
const candidatesPath = path.join(root, "data", "candidates.json");
const alternativesPath = path.join(root, "data", "alternatives.json");
const alternativeCandidatesPath = path.join(root, "data", "alternatives_candidates.json");
const mirrorUploadersPath = path.join(root, "data", "mirror_uploaders.json");
const mirrorUploaderCandidatesPath = path.join(root, "data", "mirror_uploaders_candidates.json");
const cloudMigrationPath = path.join(root, "data", "cloud_migration.json");
const cloudMigrationCandidatesPath = path.join(root, "data", "cloud_migration_candidates.json");
const readmePath = path.join(root, "README.md");
const schemaPath = path.join(root, "schema", "hosts.schema.json");
const candidatesSchemaPath = path.join(root, "schema", "candidates.schema.json");
const adjacentSchemaPath = path.join(root, "schema", "adjacent.schema.json");
const adjacentCandidatesSchemaPath = path.join(root, "schema", "adjacent-candidates.schema.json");

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
  if (field.status !== undefined) {
    assert(
      [
        "published",
        "unlimited",
        "no-automatic-expiry",
        "conditional",
        "not-published",
        "not-applicable"
      ].includes(field.status),
      `${name}.status must be a known limit status`
    );
  }
  validateSourceRefs(`${name}.source_refs`, field.source_refs);
}

function validateStructuredNullLimit(name, field) {
  if (!field || (field.value !== null && field.unit !== null)) return;
  assert(field.status !== undefined, `${name}.status is required when this storage/retention limit is null`);
}

function validateTextField(name, field) {
  assert(field && typeof field === "object", `${name} must be an object`);
  assert(
    field.value === null || typeof field.value === "string",
    `${name}.value must be a string or null`
  );
  assert(typeof field.notes === "string", `${name}.notes must be a string`);
  validateSourceRefs(`${name}.source_refs`, field.source_refs);
}

function validateBooleanField(name, field) {
  assert(field && typeof field === "object", `${name} must be an object`);
  assert(
    field.value === null || typeof field.value === "boolean",
    `${name}.value must be a boolean or null`
  );
  assert(typeof field.notes === "string", `${name}.notes must be a string`);
  validateSourceRefs(`${name}.source_refs`, field.source_refs);
}

function validateFreeModelField(name, field) {
  assert(field && typeof field === "object", `${name} must be an object`);
  assert(
    ["free-forever", "free-trial", "credit-card-trial", "paid-only", "unknown"].includes(field.value),
    `${name}.value must be a valid free model`
  );
  assert(typeof field.notes === "string", `${name}.notes must be a string`);
  validateSourceRefs(`${name}.source_refs`, field.source_refs);
}

function validateOptionalBooleanField(name, field) {
  if (field === undefined) {
    return;
  }
  validateBooleanField(name, field);
}

function validateSourceRefs(name, refs) {
  if (refs === undefined) {
    return;
  }

  assert(Array.isArray(refs) && refs.length > 0, `${name} must be a non-empty array when present`);
  assert(new Set(refs).size === refs.length, `${name} must not contain duplicate refs`);
  for (const ref of refs) {
    assert(Number.isInteger(ref) && ref >= 0, `${name} must contain non-negative integers`);
  }
}

function validateExtensionList(name, extensions) {
  assert(Array.isArray(extensions), `${name} must be an array`);

  const seen = new Set();
  for (const extension of extensions) {
    assert(typeof extension === "string", `${name} must contain strings`);
    assert(
      /^\.[A-Za-z0-9][A-Za-z0-9+._*-]*$/.test(extension),
      `${name} entries must be dot-prefixed extensions`
    );
    assert(!seen.has(extension), `${name} must contain unique entries`);
    seen.add(extension);
  }
}

function validateSharedServiceFields(record, options = {}) {
  const { allowNullUrl = false, allowEmptySources = false } = options;

  assert(typeof record.name === "string" && record.name.trim(), "name must be a non-empty string");
  if (allowNullUrl) {
    assert(
      record.url === null || (typeof record.url === "string" && /^https:\/\//.test(record.url)),
      `${record.name}.url must be null or an https URL`
    );
  } else {
    assert(typeof record.url === "string" && /^https:\/\//.test(record.url), "url must be an https URL");
  }
  assert(typeof record.summary === "string" && record.summary.trim(), "summary must be a non-empty string");

  assert(
    record.account.required === null || typeof record.account.required === "boolean",
    `${record.name}.account.required must be boolean or null`
  );
  assert(typeof record.account.benefits === "string", `${record.name}.account.benefits must be a string`);
  validateSourceRefs(`${record.name}.account.source_refs`, record.account.source_refs);

  assert(typeof record.developer.api_available === "boolean", `${record.name}.developer.api_available must be boolean`);
  assert(
    record.developer.api_docs_url === null || /^https:\/\//.test(record.developer.api_docs_url),
    `${record.name}.developer.api_docs_url must be null or an https URL`
  );
  assert(typeof record.developer.cli_friendly === "boolean", `${record.name}.developer.cli_friendly must be boolean`);
  assert(
    record.developer.cli_example === null || typeof record.developer.cli_example === "string",
    `${record.name}.developer.cli_example must be string or null`
  );
  assert(typeof record.developer.notes === "string", `${record.name}.developer.notes must be a string`);
  validateSourceRefs(`${record.name}.developer.source_refs`, record.developer.source_refs);

  assert(record.content && typeof record.content === "object", `${record.name}.content must be an object`);
  assert(
    record.content.allowed_file_types && typeof record.content.allowed_file_types === "object",
    `${record.name}.content.allowed_file_types must be an object`
  );
  assert(
    typeof record.content.allowed_file_types.mode === "string" &&
      record.content.allowed_file_types.mode.trim(),
    `${record.name}.content.allowed_file_types.mode must be a non-empty string`
  );
  assert(
    typeof record.content.allowed_file_types.notes === "string",
    `${record.name}.content.allowed_file_types.notes must be a string`
  );
  validateExtensionList(
    `${record.name}.content.allowed_file_types.allowed_extensions`,
    record.content.allowed_file_types.allowed_extensions
  );
  validateExtensionList(
    `${record.name}.content.allowed_file_types.blocked_extensions`,
    record.content.allowed_file_types.blocked_extensions
  );
  validateSourceRefs(
    `${record.name}.content.allowed_file_types.source_refs`,
    record.content.allowed_file_types.source_refs
  );
  validateOptionalBooleanField(
    `${record.name}.content.public_sharing`,
    record.content.public_sharing
  );

  assert(typeof record.security.https_only === "boolean", `${record.name}.security.https_only must be boolean`);
  assert(typeof record.security.e2ee === "boolean", `${record.name}.security.e2ee must be boolean`);
  assert(
    record.security.server_side_encryption === null ||
      typeof record.security.server_side_encryption === "boolean",
    `${record.name}.security.server_side_encryption must be boolean or null`
  );
  assert(typeof record.security.notes === "string", `${record.name}.security.notes must be a string`);
  validateSourceRefs(`${record.name}.security.source_refs`, record.security.source_refs);

  assert(Array.isArray(record.tags) && record.tags.length > 0, `${record.name}.tags must be a non-empty array`);
  for (const tag of record.tags) {
    assert(typeof tag === "string" && tag.trim(), `${record.name}.tags must contain non-empty strings`);
  }

  assert(Array.isArray(record.sources), `${record.name}.sources must be an array`);
  if (!allowEmptySources) {
    assert(record.sources.length > 0, `${record.name}.sources must be a non-empty array`);
  }
  for (const source of record.sources) {
    assert(typeof source.label === "string" && source.label.trim(), `${record.name}.sources.label is required`);
    assert(typeof source.url === "string" && /^https:\/\//.test(source.url), `${record.name}.sources.url must be an https URL`);
    assert(
      typeof source.retrieved_at === "string" && /^\d{4}-\d{2}-\d{2}$/.test(source.retrieved_at),
      `${record.name}.sources.retrieved_at must be YYYY-MM-DD`
    );
    assert(typeof source.notes === "string", `${record.name}.sources.notes must be a string`);
  }
}

function validateRefRange(record, refsList) {
  const maxSourceIndex = record.sources.length - 1;
  for (const refs of refsList) {
    for (const ref of refs || []) {
      assert(ref <= maxSourceIndex, `${record.name} source ref ${ref} is out of range`);
    }
  }
}

function validateHost(host) {
  const requiredTopLevel = [
    "name",
    "url",
    "summary",
    "free_model",
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
  validateFreeModelField(`${host.name}.free_model`, host.free_model);

  validateLimitField(`${host.name}.limits.max_file_size`, host.limits.max_file_size);
  if (host.limits.max_file_size_guest !== undefined) {
    validateLimitField(`${host.name}.limits.max_file_size_guest`, host.limits.max_file_size_guest);
  }
  if (host.limits.max_file_size_account !== undefined) {
    validateLimitField(`${host.name}.limits.max_file_size_account`, host.limits.max_file_size_account);
  }
  validateLimitField(`${host.name}.limits.retention`, host.limits.retention);
  validateStructuredNullLimit(`${host.name}.limits.retention`, host.limits.retention);
  validateLimitField(`${host.name}.limits.storage`, host.limits.storage);
  validateStructuredNullLimit(`${host.name}.limits.storage`, host.limits.storage);
  if (host.limits.storage_guest !== undefined) {
    validateLimitField(`${host.name}.limits.storage_guest`, host.limits.storage_guest);
    validateStructuredNullLimit(`${host.name}.limits.storage_guest`, host.limits.storage_guest);
  }
  if (host.limits.storage_account !== undefined) {
    validateLimitField(`${host.name}.limits.storage_account`, host.limits.storage_account);
    validateStructuredNullLimit(`${host.name}.limits.storage_account`, host.limits.storage_account);
  }
  validateLimitField(`${host.name}.limits.bandwidth`, host.limits.bandwidth);

  assert(
    host.account.required === null || typeof host.account.required === "boolean",
    `${host.name}.account.required must be boolean or null`
  );
  assert(typeof host.account.benefits === "string", `${host.name}.account.benefits must be a string`);
  validateSourceRefs(`${host.name}.account.source_refs`, host.account.source_refs);

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
  validateSourceRefs(`${host.name}.developer.source_refs`, host.developer.source_refs);

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
  validateExtensionList(
    `${host.name}.content.allowed_file_types.allowed_extensions`,
    host.content.allowed_file_types.allowed_extensions
  );
  validateExtensionList(
    `${host.name}.content.allowed_file_types.blocked_extensions`,
    host.content.allowed_file_types.blocked_extensions
  );
  validateSourceRefs(
    `${host.name}.content.allowed_file_types.source_refs`,
    host.content.allowed_file_types.source_refs
  );
  validateOptionalBooleanField(`${host.name}.content.public_sharing`, host.content.public_sharing);

  assert(typeof host.security.https_only === "boolean", `${host.name}.security.https_only must be boolean`);
  assert(typeof host.security.e2ee === "boolean", `${host.name}.security.e2ee must be boolean`);
  assert(
    host.security.server_side_encryption === null ||
      typeof host.security.server_side_encryption === "boolean",
    `${host.name}.security.server_side_encryption must be boolean or null`
  );
  assert(typeof host.security.notes === "string", `${host.name}.security.notes must be a string`);
  validateSourceRefs(`${host.name}.security.source_refs`, host.security.source_refs);

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

  const maxSourceIndex = host.sources.length - 1;
  for (const refs of [
    host.free_model.source_refs,
    host.limits.max_file_size.source_refs,
    host.limits.max_file_size_guest?.source_refs,
    host.limits.max_file_size_account?.source_refs,
    host.limits.retention.source_refs,
    host.limits.storage.source_refs,
    host.limits.storage_guest?.source_refs,
    host.limits.storage_account?.source_refs,
    host.limits.bandwidth.source_refs,
    host.account.source_refs,
    host.developer.source_refs,
    host.security.source_refs,
    host.content.allowed_file_types.source_refs,
    host.content.public_sharing?.source_refs
  ]) {
    for (const ref of refs || []) {
      assert(ref <= maxSourceIndex, `${host.name} source ref ${ref} is out of range`);
    }
  }
}

function validateAlternativeProfile(record) {
  assert(record.kind === "alternative", `${record.name}.kind must be "alternative"`);
  assert(record.profile && typeof record.profile === "object", `${record.name}.profile must be an object`);
  validateTextField(`${record.name}.profile.primary_use`, record.profile.primary_use);
  validateTextField(`${record.name}.profile.sharing_surface`, record.profile.sharing_surface);
  validateLimitField(`${record.name}.profile.max_file_size`, record.profile.max_file_size);
  validateTextField(`${record.name}.profile.persistence_model`, record.profile.persistence_model);
  validateTextField(`${record.name}.profile.storage_model`, record.profile.storage_model);
  validateTextField(`${record.name}.profile.bandwidth_model`, record.profile.bandwidth_model);
  validateRefRange(record, [
    record.account.source_refs,
    record.developer.source_refs,
    record.security.source_refs,
    record.content.allowed_file_types.source_refs,
    record.content.public_sharing?.source_refs,
    record.profile.primary_use.source_refs,
    record.profile.sharing_surface.source_refs,
    record.profile.max_file_size.source_refs,
    record.profile.persistence_model.source_refs,
    record.profile.storage_model.source_refs,
    record.profile.bandwidth_model.source_refs
  ]);
}

function validateMirrorProfile(record) {
  assert(record.kind === "mirror_uploader", `${record.name}.kind must be "mirror_uploader"`);
  assert(record.profile && typeof record.profile === "object", `${record.name}.profile must be an object`);
  validateLimitField(`${record.name}.profile.max_file_size`, record.profile.max_file_size);
  validateBooleanField(`${record.name}.profile.guest_uploads`, record.profile.guest_uploads);
  validateBooleanField(`${record.name}.profile.remote_import`, record.profile.remote_import);
  validateBooleanField(`${record.name}.profile.torrent_import`, record.profile.torrent_import);
  validateBooleanField(`${record.name}.profile.stores_files_itself`, record.profile.stores_files_itself);
  validateTextField(`${record.name}.profile.retention_model`, record.profile.retention_model);
  validateTextField(`${record.name}.profile.downstream_dependency`, record.profile.downstream_dependency);
  validateRefRange(record, [
    record.account.source_refs,
    record.developer.source_refs,
    record.security.source_refs,
    record.content.allowed_file_types.source_refs,
    record.content.public_sharing?.source_refs,
    record.profile.max_file_size.source_refs,
    record.profile.guest_uploads.source_refs,
    record.profile.remote_import.source_refs,
    record.profile.torrent_import.source_refs,
    record.profile.stores_files_itself.source_refs,
    record.profile.retention_model.source_refs,
    record.profile.downstream_dependency.source_refs
  ]);
}

function validateCloudMigrationProfile(record) {
  assert(record.kind === "cloud_migration", `${record.name}.kind must be "cloud_migration"`);
  assert(record.profile && typeof record.profile === "object", `${record.name}.profile must be an object`);
  validateTextField(`${record.name}.profile.workflow_modes`, record.profile.workflow_modes);
  validateTextField(`${record.name}.profile.execution_model`, record.profile.execution_model);
  validateLimitField(`${record.name}.profile.item_limit`, record.profile.item_limit);
  validateLimitField(`${record.name}.profile.included_storage`, record.profile.included_storage);
  validateBooleanField(`${record.name}.profile.scheduled_runs`, record.profile.scheduled_runs);
  validateTextField(`${record.name}.profile.provider_dependency`, record.profile.provider_dependency);
  validateTextField(`${record.name}.profile.bandwidth_model`, record.profile.bandwidth_model);
  validateRefRange(record, [
    record.account.source_refs,
    record.developer.source_refs,
    record.security.source_refs,
    record.content.allowed_file_types.source_refs,
    record.content.public_sharing?.source_refs,
    record.profile.workflow_modes.source_refs,
    record.profile.execution_model.source_refs,
    record.profile.item_limit.source_refs,
    record.profile.included_storage.source_refs,
    record.profile.scheduled_runs.source_refs,
    record.profile.provider_dependency.source_refs,
    record.profile.bandwidth_model.source_refs
  ]);
}

function validateAdjacentService(record) {
  validateSharedServiceFields(record, { allowNullUrl: false });
  if (record.kind === "alternative") {
    validateAlternativeProfile(record);
    return;
  }
  if (record.kind === "mirror_uploader") {
    validateMirrorProfile(record);
    return;
  }
  if (record.kind === "cloud_migration") {
    validateCloudMigrationProfile(record);
    return;
  }
  throw new Error(`${record.name}.kind must be one of alternative, mirror_uploader, cloud_migration`);
}

function validateCandidate(candidate) {
  const requiredTopLevel = [
    "name",
    "url",
    "summary",
    "free_model",
    "limits",
    "account",
    "developer",
    "content",
    "security",
    "tags",
    "sources",
    "verification_status",
    "reason"
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
    candidate.url === null || (typeof candidate.url === "string" && /^https:\/\//.test(candidate.url)),
    `${candidate.name}.url must be null or an https URL`
  );
  assert(
    typeof candidate.summary === "string" && candidate.summary.trim(),
    `${candidate.name}.summary must be a non-empty string`
  );
  validateFreeModelField(`${candidate.name}.free_model`, candidate.free_model);

  validateLimitField(`${candidate.name}.limits.max_file_size`, candidate.limits.max_file_size);
  if (candidate.limits.max_file_size_guest !== undefined) {
    validateLimitField(`${candidate.name}.limits.max_file_size_guest`, candidate.limits.max_file_size_guest);
  }
  if (candidate.limits.max_file_size_account !== undefined) {
    validateLimitField(`${candidate.name}.limits.max_file_size_account`, candidate.limits.max_file_size_account);
  }
  validateLimitField(`${candidate.name}.limits.retention`, candidate.limits.retention);
  validateStructuredNullLimit(`${candidate.name}.limits.retention`, candidate.limits.retention);
  validateLimitField(`${candidate.name}.limits.storage`, candidate.limits.storage);
  validateStructuredNullLimit(`${candidate.name}.limits.storage`, candidate.limits.storage);
  if (candidate.limits.storage_guest !== undefined) {
    validateLimitField(`${candidate.name}.limits.storage_guest`, candidate.limits.storage_guest);
    validateStructuredNullLimit(`${candidate.name}.limits.storage_guest`, candidate.limits.storage_guest);
  }
  if (candidate.limits.storage_account !== undefined) {
    validateLimitField(`${candidate.name}.limits.storage_account`, candidate.limits.storage_account);
    validateStructuredNullLimit(`${candidate.name}.limits.storage_account`, candidate.limits.storage_account);
  }
  validateLimitField(`${candidate.name}.limits.bandwidth`, candidate.limits.bandwidth);

  assert(
    candidate.account.required === null || typeof candidate.account.required === "boolean",
    `${candidate.name}.account.required must be boolean or null`
  );
  assert(typeof candidate.account.benefits === "string", `${candidate.name}.account.benefits must be a string`);
  validateSourceRefs(`${candidate.name}.account.source_refs`, candidate.account.source_refs);

  assert(typeof candidate.developer.api_available === "boolean", `${candidate.name}.developer.api_available must be boolean`);
  assert(
    candidate.developer.api_docs_url === null || /^https:\/\//.test(candidate.developer.api_docs_url),
    `${candidate.name}.developer.api_docs_url must be null or an https URL`
  );
  assert(typeof candidate.developer.cli_friendly === "boolean", `${candidate.name}.developer.cli_friendly must be boolean`);
  assert(
    candidate.developer.cli_example === null || typeof candidate.developer.cli_example === "string",
    `${candidate.name}.developer.cli_example must be string or null`
  );
  assert(typeof candidate.developer.notes === "string", `${candidate.name}.developer.notes must be a string`);
  validateSourceRefs(`${candidate.name}.developer.source_refs`, candidate.developer.source_refs);

  assert(candidate.content && typeof candidate.content === "object", `${candidate.name}.content must be an object`);
  assert(
    candidate.content.allowed_file_types &&
      typeof candidate.content.allowed_file_types === "object",
    `${candidate.name}.content.allowed_file_types must be an object`
  );
  assert(
    typeof candidate.content.allowed_file_types.mode === "string" &&
      candidate.content.allowed_file_types.mode.trim(),
    `${candidate.name}.content.allowed_file_types.mode must be a non-empty string`
  );
  assert(
    typeof candidate.content.allowed_file_types.notes === "string",
    `${candidate.name}.content.allowed_file_types.notes must be a string`
  );
  validateExtensionList(
    `${candidate.name}.content.allowed_file_types.allowed_extensions`,
    candidate.content.allowed_file_types.allowed_extensions
  );
  validateExtensionList(
    `${candidate.name}.content.allowed_file_types.blocked_extensions`,
    candidate.content.allowed_file_types.blocked_extensions
  );
  validateSourceRefs(
    `${candidate.name}.content.allowed_file_types.source_refs`,
    candidate.content.allowed_file_types.source_refs
  );
  validateOptionalBooleanField(
    `${candidate.name}.content.public_sharing`,
    candidate.content.public_sharing
  );

  assert(typeof candidate.security.https_only === "boolean", `${candidate.name}.security.https_only must be boolean`);
  assert(typeof candidate.security.e2ee === "boolean", `${candidate.name}.security.e2ee must be boolean`);
  assert(
    candidate.security.server_side_encryption === null ||
      typeof candidate.security.server_side_encryption === "boolean",
    `${candidate.name}.security.server_side_encryption must be boolean or null`
  );
  assert(typeof candidate.security.notes === "string", `${candidate.name}.security.notes must be a string`);
  validateSourceRefs(`${candidate.name}.security.source_refs`, candidate.security.source_refs);

  assert(Array.isArray(candidate.tags), `${candidate.name}.tags must be an array`);
  for (const tag of candidate.tags) {
    assert(typeof tag === "string" && tag.trim(), `${candidate.name}.tags must contain non-empty strings`);
  }

  assert(Array.isArray(candidate.sources), `${candidate.name}.sources must be an array`);
  for (const source of candidate.sources) {
    assert(typeof source.label === "string" && source.label.trim(), `${candidate.name}.sources.label is required`);
    assert(typeof source.url === "string" && /^https:\/\//.test(source.url), `${candidate.name}.sources.url must be an https URL`);
    assert(
      typeof source.retrieved_at === "string" && /^\d{4}-\d{2}-\d{2}$/.test(source.retrieved_at),
      `${candidate.name}.sources.retrieved_at must be YYYY-MM-DD`
    );
    assert(typeof source.notes === "string", `${candidate.name}.sources.notes must be a string`);
  }

  assert(
    typeof candidate.verification_status === "string",
    `${candidate.name}.verification_status must be a string`
  );
  assert(
    candidate.reason === null || typeof candidate.reason === "string",
    `${candidate.name}.reason must be a string or null`
  );

  const maxSourceIndex = candidate.sources.length - 1;
  for (const refs of [
    candidate.free_model.source_refs,
    candidate.limits.max_file_size.source_refs,
    candidate.limits.max_file_size_guest?.source_refs,
    candidate.limits.max_file_size_account?.source_refs,
    candidate.limits.retention.source_refs,
    candidate.limits.storage.source_refs,
    candidate.limits.storage_guest?.source_refs,
    candidate.limits.storage_account?.source_refs,
    candidate.limits.bandwidth.source_refs,
    candidate.account.source_refs,
    candidate.developer.source_refs,
    candidate.security.source_refs,
    candidate.content.allowed_file_types.source_refs,
    candidate.content.public_sharing?.source_refs
  ]) {
    for (const ref of refs || []) {
      assert(ref <= maxSourceIndex, `${candidate.name} source ref ${ref} is out of range`);
    }
  }
}

function validateAdjacentCandidate(candidate) {
  validateSharedServiceFields(candidate, { allowNullUrl: true, allowEmptySources: true });
  assert(
    typeof candidate.verification_status === "string" &&
      ["pending", "verified", "rejected"].includes(candidate.verification_status),
    `${candidate.name}.verification_status must be pending, verified, or rejected`
  );
  assert(
    candidate.reason === null || typeof candidate.reason === "string",
    `${candidate.name}.reason must be a string or null`
  );

  if (candidate.kind === "alternative") {
    validateAlternativeProfile(candidate);
    return;
  }
  if (candidate.kind === "mirror_uploader") {
    validateMirrorProfile(candidate);
    return;
  }
  if (candidate.kind === "cloud_migration") {
    validateCloudMigrationProfile(candidate);
    return;
  }

  throw new Error(`${candidate.name}.kind must be one of alternative, mirror_uploader, cloud_migration`);
}

function formatLimit(field) {
  if (field.value === null || field.unit === null) {
    if (field.status) {
      const labels = {
        unlimited: "Unlimited",
        "no-automatic-expiry": "No automatic expiry",
        conditional: "Conditional",
        "not-published": "Not published",
        "not-applicable": "Not applicable"
      };
      return labels[field.status] || "Not published";
    }

    const notes = field.notes.toLowerCase();

    if (notes.includes("unlimited")) {
      return "Unlimited";
    }

    if (
      notes.includes("no automatic expiry") ||
      notes.includes("remain until the user deletes them") ||
      notes.includes("remain until the user deletes") ||
      notes.includes("remaining until the user deletes them") ||
      notes.includes("files remain until deleted") ||
      notes.includes("remain until deleted") ||
      notes.includes("kept forever") ||
      notes.includes("stored forever")
    ) {
      return "No automatic expiry";
    }

    if (
      notes.includes("conditional") ||
      notes.includes("depends") ||
      notes.includes("varies") ||
      notes.includes("different") ||
      notes.includes("while") ||
      notes.includes("or after") ||
      notes.includes("based on") ||
      notes.includes("download") ||
      notes.includes("inactivity")
    ) {
      return "Conditional";
    }

    if (
      notes.includes("do not publish") ||
      notes.includes("do not state") ||
      notes.includes("do not clearly publish") ||
      notes.includes("do not clearly state") ||
      notes.includes("do not clearly document") ||
      notes.includes("does not publish") ||
      notes.includes("does not state") ||
      notes.includes("does not clearly publish") ||
      notes.includes("does not clearly state") ||
      notes.includes("does not clearly document") ||
      notes.includes("not publish") ||
      notes.includes("not stated") ||
      notes.includes("not documented")
    ) {
      return "Not published";
    }

    return "Not published";
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

function formatFreeModel(host) {
  const labels = {
    "free-forever": "Free forever",
    "free-trial": "Free trial",
    "credit-card-trial": "Credit-card trial",
    "paid-only": "Paid only",
    unknown: "Unknown"
  };

  return labels[host.free_model.value] ?? "Unknown";
}

function formatFeatureSummary(host) {
  const parts = [
    `Free: ${formatFreeModel(host)}`,
    `Max: ${formatLimit(host.limits.max_file_size)}`,
    `Retention: ${formatLimit(host.limits.retention)}`,
    `Account: ${formatAccount(host.account.required)}`
  ];

  if (host.developer.api_available) {
    parts.push("API");
  }

  if (host.developer.cli_friendly) {
    parts.push("CLI");
  }

  if (host.security.e2ee) {
    parts.push("E2EE");
  }

  return parts.join(" | ");
}

function buildReadme(
  hosts,
  candidates,
  alternativeCandidates,
  mirrorUploaderCandidates,
  cloudMigrationCandidates
) {
  const sortedHosts = [...hosts].sort((a, b) => a.name.localeCompare(b.name));
  const lastUpdated = new Date().toISOString().slice(0, 10);
  const pendingCount = candidates.filter((candidate) => candidate.verification_status === "pending").length;
  const rejectedCount = candidates.filter((candidate) => candidate.verification_status === "rejected").length;
  const pendingAlternativeCandidates = alternativeCandidates.filter(
    (candidate) => candidate.verification_status === "pending"
  ).length;
  const pendingMirrorCandidates = mirrorUploaderCandidates.filter(
    (candidate) => candidate.verification_status === "pending"
  ).length;
  const pendingCloudMigrationCandidates = cloudMigrationCandidates.filter(
    (candidate) => candidate.verification_status === "pending"
  ).length;

  const lines = [];
  lines.push("# awesome-file-hosts");
  lines.push("");
  lines.push("[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)");
  lines.push("");
  lines.push("> A free-first, source-backed directory of file hosts with structured data, a usable explorer, and a bias toward open-source-friendly services.");
  lines.push("");
  lines.push("The repo is JSON-first: [`data/hosts.json`](data/hosts.json) is the source of truth, [`README.md`](README.md) is generated, and the site carries the dense dataset view.");
  lines.push("");
  lines.push("Explore the full interface in the site app at `/` and the spreadsheet-style dataset view at `/dataset`.");
  lines.push("");
  lines.push("## Contents");
  lines.push("");
  lines.push("- [What this includes](#what-this-includes)");
  lines.push("- [Hosts](#hosts)");
  lines.push("- [Data](#data)");
  lines.push("- [Contributing](#contributing)");
  lines.push("- [License](#license)");
  lines.push("");
  lines.push("## What this includes");
  lines.push("");
  lines.push(`- ${sortedHosts.length} verified hosts checked against current public sources as of ${lastUpdated}.`);
  lines.push(`- ${pendingCount} main-host leads still in review and ${rejectedCount} rejected entries preserved in [` + "`data/candidates.json`" + "](data/candidates.json) with reasons and references.");
  lines.push(
    `- ${pendingAlternativeCandidates} other-ways-to-share candidates, ${pendingMirrorCandidates} mirror-uploader candidates, and ${pendingCloudMigrationCandidates} cloud-migration candidates staged in their own pending files.`
  );
  lines.push("- A free-first dataset that prioritizes genuinely usable free tiers, guest flows, and honest headline limits.");
  lines.push("- A source-backed dataset designed for both human browsing and machine reuse.");
  lines.push("- A bias toward open-source, open-protocol, and automation-friendly services when the evidence supports them.");
  lines.push("- A site UI for filtering, comparison, and dense spreadsheet-style inspection.");
  lines.push("");
  lines.push("### Inclusion bar");
  lines.push("");
  lines.push("- Supports HTTPS.");
  lines.push("- Is meaningfully usable today.");
  lines.push("- Treats the practical free tier as the main story; paid-only upgrades should not dominate headline fields.");
  lines.push("- Has enough current public evidence to support structured facts.");
  lines.push("- Prefers open-source, open standards, and transparent developer tooling when services are otherwise comparable.");
  lines.push("- Avoids obvious spam, malware traps, and dead services.");
  lines.push("");
  lines.push("## Hosts");
  lines.push("");
  for (const host of sortedHosts) {
    lines.push(`- [${host.name}](${host.url}) - ${host.summary} _(${formatFeatureSummary(host)})_`);
  }
  lines.push("");
  lines.push("## Data");
  lines.push("");
  lines.push("- Dataset: [`data/hosts.json`](data/hosts.json)");
  lines.push("- Candidate backlog: [`data/candidates.json`](data/candidates.json)");
  lines.push("- Other ways to share: [`data/alternatives.json`](data/alternatives.json)");
  lines.push("- Other ways to share candidates: [`data/alternatives_candidates.json`](data/alternatives_candidates.json)");
  lines.push("- Mirror uploaders: [`data/mirror_uploaders.json`](data/mirror_uploaders.json)");
  lines.push("- Mirror uploader candidates: [`data/mirror_uploaders_candidates.json`](data/mirror_uploaders_candidates.json)");
  lines.push("- Cloud migration tools: [`data/cloud_migration.json`](data/cloud_migration.json)");
  lines.push("- Cloud migration candidates: [`data/cloud_migration_candidates.json`](data/cloud_migration_candidates.json)");
  lines.push("- Schema: [`schema/hosts.schema.json`](schema/hosts.schema.json)");
  lines.push("- Candidate schema: [`schema/candidates.schema.json`](schema/candidates.schema.json)");
  lines.push("- Adjacent schema: [`schema/adjacent.schema.json`](schema/adjacent.schema.json)");
  lines.push("- Adjacent candidate schema: [`schema/adjacent-candidates.schema.json`](schema/adjacent-candidates.schema.json)");
  lines.push("- Generator: [`scripts/generate-readme.js`](scripts/generate-readme.js)");
  lines.push("");
  lines.push("The site is the best place to explore all columns, notes, references, queue status, and layout controls. The README stays intentionally compact so the list still reads like an awesome list instead of a database dump.");
  lines.push("");
  lines.push("### Generate");
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
  const alternatives = readJson(alternativesPath);
  const alternativeCandidates = readJson(alternativeCandidatesPath);
  const mirrorUploaders = readJson(mirrorUploadersPath);
  const mirrorUploaderCandidates = readJson(mirrorUploaderCandidatesPath);
  const cloudMigration = readJson(cloudMigrationPath);
  const cloudMigrationCandidates = readJson(cloudMigrationCandidatesPath);
  const schema = readJson(schemaPath);
  const candidatesSchema = readJson(candidatesSchemaPath);
  const adjacentSchema = readJson(adjacentSchemaPath);
  const adjacentCandidatesSchema = readJson(adjacentCandidatesSchemaPath);

  assert(Array.isArray(hosts), "Dataset must be an array");
  assert(Array.isArray(candidates), "Candidate dataset must be an array");
  assert(Array.isArray(alternatives), "Alternatives dataset must be an array");
  assert(Array.isArray(alternativeCandidates), "Alternative candidates dataset must be an array");
  assert(Array.isArray(mirrorUploaders), "Mirror uploaders dataset must be an array");
  assert(Array.isArray(mirrorUploaderCandidates), "Mirror uploader candidates dataset must be an array");
  assert(Array.isArray(cloudMigration), "Cloud migration dataset must be an array");
  assert(Array.isArray(cloudMigrationCandidates), "Cloud migration candidates dataset must be an array");
  assert(schema && typeof schema === "object", "Schema must be valid JSON");
  assert(candidatesSchema && typeof candidatesSchema === "object", "Candidate schema must be valid JSON");
  assert(adjacentSchema && typeof adjacentSchema === "object", "Adjacent schema must be valid JSON");
  assert(
    adjacentCandidatesSchema && typeof adjacentCandidatesSchema === "object",
    "Adjacent candidate schema must be valid JSON"
  );
  assert(hosts.length > 0, "Dataset must contain at least one host");
  assert(alternatives.length > 0, "Alternatives dataset must contain at least one item");
  assert(mirrorUploaders.length > 0, "Mirror uploaders dataset must contain at least one item");
  assert(cloudMigration.length > 0, "Cloud migration dataset must contain at least one item");

  for (const host of hosts) {
    validateHost(host);
  }

  for (const service of alternatives) {
    validateAdjacentService(service);
  }

  for (const service of mirrorUploaders) {
    validateAdjacentService(service);
  }

  for (const service of cloudMigration) {
    validateAdjacentService(service);
  }

  for (const candidate of candidates) {
    validateCandidate(candidate);
  }

  for (const candidate of alternativeCandidates) {
    validateAdjacentCandidate(candidate);
  }

  for (const candidate of mirrorUploaderCandidates) {
    validateAdjacentCandidate(candidate);
  }

  for (const candidate of cloudMigrationCandidates) {
    validateAdjacentCandidate(candidate);
  }

  const names = hosts.map((host) => host.name);
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  assert(
    JSON.stringify(names) === JSON.stringify(sorted),
    "Hosts must be kept in alphabetical order by name"
  );

  for (const [label, collection] of [
    ["Alternatives", alternatives],
    ["Mirror uploaders", mirrorUploaders],
    ["Cloud migration tools", cloudMigration]
  ]) {
    const collectionNames = collection.map((item) => item.name);
    const collectionSorted = [...collectionNames].sort((a, b) => a.localeCompare(b));
    assert(
      JSON.stringify(collectionNames) === JSON.stringify(collectionSorted),
      `${label} must be kept in alphabetical order by name`
    );
  }

  for (const [label, collection] of [
    ["Alternative candidates", alternativeCandidates],
    ["Mirror uploader candidates", mirrorUploaderCandidates],
    ["Cloud migration candidates", cloudMigrationCandidates]
  ]) {
    const collectionNames = collection.map((item) => item.name);
    const collectionSorted = [...collectionNames].sort((a, b) => a.localeCompare(b));
    assert(
      JSON.stringify(collectionNames) === JSON.stringify(collectionSorted),
      `${label} must be kept in alphabetical order by name`
    );
  }

  const nextReadme = buildReadme(
    hosts,
    candidates,
    alternativeCandidates,
    mirrorUploaderCandidates,
    cloudMigrationCandidates
  );
  const checkMode = process.argv.includes("--check");

  if (checkMode) {
    const currentReadme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf8") : "";
    assert(currentReadme === nextReadme, "README.md is out of date. Run `npm run generate`.");
    return;
  }

  fs.writeFileSync(readmePath, nextReadme, "utf8");
}

main();
