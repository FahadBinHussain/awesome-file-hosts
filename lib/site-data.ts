import fs from "node:fs";
import path from "node:path";

export type LimitField = {
  value: number | null;
  unit: string | null;
  notes: string;
  source_refs?: number[];
};

export type TextField = {
  value: string | null;
  notes: string;
  source_refs?: number[];
};

export type BooleanField = {
  value: boolean | null;
  notes: string;
  source_refs?: number[];
};

type SourceRefsField = {
  source_refs?: number[];
};

type SourceRecord = {
  label: string;
  url: string;
  retrieved_at: string;
  notes: string;
};

type SharedServiceFields = {
  account: {
    required: boolean | null;
    benefits: string;
  } & SourceRefsField;
  developer: {
    api_available: boolean;
    api_docs_url: string | null;
    cli_friendly: boolean;
    cli_example: string | null;
    notes: string;
  } & SourceRefsField;
  security: {
    https_only: boolean;
    e2ee: boolean;
    server_side_encryption: boolean | null;
    notes: string;
  } & SourceRefsField;
  content: {
    allowed_file_types: {
      mode: string;
      notes: string;
    } & SourceRefsField;
    public_sharing?: BooleanField;
  };
  tags: string[];
  sources: SourceRecord[];
};

type HostLikeBase = SharedServiceFields & {
  name: string;
  url: string | null;
  summary: string;
  limits: {
    max_file_size: LimitField;
    max_file_size_guest?: LimitField;
    max_file_size_account?: LimitField;
    retention: LimitField;
    storage: LimitField;
    storage_guest?: LimitField;
    storage_account?: LimitField;
    bandwidth: LimitField;
  };
};

type Host = HostLikeBase & {
  url: string;
};

type Candidate = HostLikeBase & {
  verification_status: "pending" | "verified" | "rejected";
  reason: string | null;
};

type AlternativeProfile = {
  primary_use: TextField;
  sharing_surface: TextField;
  max_file_size: LimitField;
  persistence_model: TextField;
  storage_model: TextField;
  bandwidth_model: TextField;
};

type MirrorProfile = {
  max_file_size: LimitField;
  guest_uploads: BooleanField;
  remote_import: BooleanField;
  torrent_import: BooleanField;
  stores_files_itself: BooleanField;
  retention_model: TextField;
  downstream_dependency: TextField;
};

type CloudMigrationProfile = {
  workflow_modes: TextField;
  execution_model: TextField;
  item_limit: LimitField;
  included_storage: LimitField;
  scheduled_runs: BooleanField;
  provider_dependency: TextField;
  bandwidth_model: TextField;
};

type AlternativeServiceBase = SharedServiceFields & {
  kind: "alternative";
  name: string;
  url: string | null;
  summary: string;
  profile: AlternativeProfile;
};

type MirrorUploaderServiceBase = SharedServiceFields & {
  kind: "mirror_uploader";
  name: string;
  url: string | null;
  summary: string;
  profile: MirrorProfile;
};

type CloudMigrationServiceBase = SharedServiceFields & {
  kind: "cloud_migration";
  name: string;
  url: string | null;
  summary: string;
  profile: CloudMigrationProfile;
};

type AlternativeService = AlternativeServiceBase & {
  url: string;
};

type MirrorUploaderService = MirrorUploaderServiceBase & {
  url: string;
};

type CloudMigrationService = CloudMigrationServiceBase & {
  url: string;
};

type AlternativeCandidate = AlternativeServiceBase & {
  verification_status: "pending" | "verified" | "rejected";
  reason: string | null;
};

type MirrorUploaderCandidate = MirrorUploaderServiceBase & {
  verification_status: "pending" | "verified" | "rejected";
  reason: string | null;
};

type CloudMigrationCandidate = CloudMigrationServiceBase & {
  verification_status: "pending" | "verified" | "rejected";
  reason: string | null;
};

export type HostRecord = Host & {
  id: string;
  accountLabel: "Required" | "Guest" | "Unknown";
  filters: {
    maxFileLabel: string;
    maxFileGuestLabel: string;
    maxFileAccountLabel: string;
    retentionLabel: string;
    storageLabel: string;
    storageGuestLabel: string;
    storageAccountLabel: string;
    bandwidthLabel: string;
  };
  datasetLabels: {
    maxFileGuestLabel: string;
    maxFileAccountLabel: string;
    storageGuestLabel: string;
    storageAccountLabel: string;
  };
  sortMetrics: {
    maxFileGuestMb: number | null;
    maxFileAccountMb: number | null;
    storageGuestMb: number | null;
    storageAccountMb: number | null;
    bandwidthMb: number | null;
    retentionDays: number | null;
  };
};

export type SourceBackedRecord = {
  id: string;
  sources: SourceRecord[];
};

export type CandidateRecord = Candidate &
  SourceBackedRecord & {
    hasReferences: boolean;
    accountLabel: "Required" | "Guest" | "Unknown";
    filters: {
      maxFileLabel: string;
      maxFileGuestLabel: string;
      maxFileAccountLabel: string;
      retentionLabel: string;
      storageLabel: string;
      storageGuestLabel: string;
      storageAccountLabel: string;
      bandwidthLabel: string;
    };
    datasetLabels: {
      maxFileGuestLabel: string;
      maxFileAccountLabel: string;
      storageGuestLabel: string;
      storageAccountLabel: string;
    };
    sortMetrics: {
      maxFileGuestMb: number | null;
      maxFileAccountMb: number | null;
      storageGuestMb: number | null;
      storageAccountMb: number | null;
      bandwidthMb: number | null;
      retentionDays: number | null;
    };
};

type AdjacentRecordCommon = SourceBackedRecord & {
  accountLabel: "Required" | "Guest" | "Unknown";
  searchText: string;
};

export type AlternativeRecord = AlternativeService &
  AdjacentRecordCommon & {
    labels: {
      primaryUse: string;
      sharingSurface: string;
      maxFileSize: string;
      persistenceModel: string;
      storageModel: string;
      bandwidthModel: string;
    };
    sortMetrics: {
      maxFileMb: number | null;
    };
  };

export type MirrorUploaderRecord = MirrorUploaderService &
  AdjacentRecordCommon & {
    labels: {
      maxFileSize: string;
      guestUploads: string;
      remoteImport: string;
      torrentImport: string;
      storesFilesItself: string;
      retentionModel: string;
      downstreamDependency: string;
    };
    sortMetrics: {
      maxFileMb: number | null;
      guestUploads: number | null;
      remoteImport: number | null;
      torrentImport: number | null;
      storesFilesItself: number | null;
    };
  };

export type CloudMigrationRecord = CloudMigrationService &
  AdjacentRecordCommon & {
    labels: {
      workflowModes: string;
      executionModel: string;
      itemLimit: string;
      includedStorage: string;
      scheduledRuns: string;
      providerDependency: string;
      bandwidthModel: string;
    };
    sortMetrics: {
      itemLimitMb: number | null;
      includedStorageMb: number | null;
      scheduledRuns: number | null;
    };
  };

export type AdjacentRecord = AlternativeRecord | MirrorUploaderRecord | CloudMigrationRecord;

export type AlternativeCandidateRecord = AlternativeCandidate &
  SourceBackedRecord & {
    hasReferences: boolean;
    accountLabel: "Required" | "Guest" | "Unknown";
    searchText: string;
  };

export type MirrorUploaderCandidateRecord = MirrorUploaderCandidate &
  SourceBackedRecord & {
    hasReferences: boolean;
    accountLabel: "Required" | "Guest" | "Unknown";
    searchText: string;
  };

export type CloudMigrationCandidateRecord = CloudMigrationCandidate &
  SourceBackedRecord & {
    hasReferences: boolean;
    accountLabel: "Required" | "Guest" | "Unknown";
    searchText: string;
  };

export type AdjacentCandidateRecord =
  | AlternativeCandidateRecord
  | MirrorUploaderCandidateRecord
  | CloudMigrationCandidateRecord;

export type SiteData = {
  hosts: HostRecord[];
  candidates: CandidateRecord[];
  alternatives: AlternativeRecord[];
  alternativeCandidates: AlternativeCandidateRecord[];
  mirrorUploaders: MirrorUploaderRecord[];
  mirrorUploaderCandidates: MirrorUploaderCandidateRecord[];
  cloudMigration: CloudMigrationRecord[];
  cloudMigrationCandidates: CloudMigrationCandidateRecord[];
  stats: {
    verifiedHosts: number;
    pendingCandidates: number;
    rejectedCandidates: number;
    apiHosts: number;
    e2eeHosts: number;
    cliHosts: number;
    alternativeMethods: number;
    alternativeCandidates: number;
    mirrorUploaders: number;
    mirrorUploaderCandidates: number;
    cloudMigrationTools: number;
    cloudMigrationCandidates: number;
  };
  tagOptions: string[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const NO_EXPIRY_RETENTION_SORT_VALUE = 9_999_999;

function hasNoAutomaticExpiryNotes(notes: string) {
  const normalized = notes.toLowerCase();
  return (
    normalized.includes("no automatic expiry") ||
    normalized.includes("remain until the user deletes them") ||
    normalized.includes("remain until the user deletes") ||
    normalized.includes("remaining until the user deletes them") ||
    normalized.includes("files remain until deleted") ||
    normalized.includes("remain until deleted") ||
    normalized.includes("kept forever") ||
    normalized.includes("stored forever")
  );
}

function readDataFile<T>(
  filename:
    | "hosts.json"
    | "candidates.json"
    | "alternatives.json"
    | "alternatives_candidates.json"
    | "mirror_uploaders.json"
    | "mirror_uploaders_candidates.json"
    | "cloud_migration.json"
    | "cloud_migration_candidates.json"
): T {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), "utf8")) as T;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function limitLabel(limit: LimitField) {
  if (limit.value === null || limit.unit === null) {
    const notes = limit.notes.toLowerCase();
    if (notes.includes("unlimited")) return "Unlimited";
    if (hasNoAutomaticExpiryNotes(limit.notes)) {
      return "No automatic expiry";
    }
    if (notes.includes("conditional") || notes.includes("depends") || notes.includes("varies")) {
      return "Conditional";
    }
    return "Not published";
  }

  return `${formatComparableNumber(limit.value)} ${formatUnit(limit.value, limit.unit)}`;
}

function textFieldLabel(field: TextField) {
  if (field.value && field.value.trim()) {
    return field.value.trim();
  }

  const notes = field.notes.toLowerCase();
  if (notes.includes("unlimited")) return "Unlimited";
  if (hasNoAutomaticExpiryNotes(field.notes)) return "No automatic expiry";
  if (
    notes.includes("conditional") ||
    notes.includes("depends") ||
    notes.includes("varies") ||
    notes.includes("plan-dependent") ||
    notes.includes("provider-dependent") ||
    notes.includes("downstream") ||
    notes.includes("pending")
  ) {
    return "Conditional";
  }

  return "Not published";
}

function booleanFieldLabel(field: BooleanField) {
  if (field.value === true) return "Yes";
  if (field.value === false) return "No";

  const notes = field.notes.toLowerCase();
  if (notes.includes("conditional") || notes.includes("depends") || notes.includes("varies")) {
    return "Conditional";
  }

  return "Not published";
}

function mbComparableLabel(limit: LimitField) {
  if (limit.value === null || limit.unit === null) {
    return limitLabel(limit);
  }

  const valueInMb = normalizeToMb(limit.value, limit.unit);
  if (valueInMb === null) {
    return limitLabel(limit);
  }

  if (valueInMb >= 1024 * 1024) {
    return `${formatComparableNumber(valueInMb / (1024 * 1024))} TB`;
  }

  if (valueInMb >= 1024) {
    return `${formatComparableNumber(valueInMb / 1024)} GB`;
  }

  return `${formatComparableNumber(valueInMb)} MB`;
}

function retentionLabel(limit: LimitField) {
  if (limit.value === null || limit.unit === null) {
    return limitLabel(limit);
  }

  const normalizedDays = normalizeRetentionToDays(limit.value, limit.unit);
  if (normalizedDays !== null) {
    if (normalizedDays >= 365 && normalizedDays % 365 === 0) {
      const years = normalizedDays / 365;
      return `${formatComparableNumber(years)} ${formatUnit(years, "year")}`;
    }

    if (normalizedDays >= 60 && normalizedDays % 30 === 0) {
      const months = normalizedDays / 30;
      return `${formatComparableNumber(months)} ${formatUnit(months, "month")}`;
    }

    if (normalizedDays < 1) {
      const hours = normalizedDays * 24;
      if (Number.isInteger(hours)) {
        return `${formatComparableNumber(hours)} ${formatUnit(hours, "hour")}`;
      }
    }

    if (Number.isInteger(normalizedDays)) {
      return `${formatComparableNumber(normalizedDays)} ${formatUnit(normalizedDays, "day")}`;
    }
  }

  return `${formatComparableNumber(limit.value)} ${formatUnit(limit.value, limit.unit)}`;
}

function formatComparableNumber(value: number) {
  if (Number.isInteger(value)) {
    return value.toLocaleString();
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

function formatUnit(value: number, unit: string) {
  const normalized = unit.trim().toLowerCase();
  const singularMap: Record<string, string> = {
    hour: "hour",
    hours: "hour",
    day: "day",
    days: "day",
    month: "month",
    months: "month",
    year: "year",
    years: "year"
  };

  if (normalized in singularMap) {
    const base = singularMap[normalized];
    return Math.abs(value) === 1 ? base : `${base}s`;
  }

  return unit;
}

function normalizeToMb(value: number | null, unit: string | null) {
  if (value === null || unit === null) return null;

  const normalized = unit.toUpperCase();
  if (normalized === "MB") return value;
  if (normalized === "GB") return value * 1024;
  if (normalized === "TB") return value * 1024 * 1024;

  const baseUnit = normalized.split("/")[0];
  if (baseUnit === "MB") return value;
  if (baseUnit === "GB") return value * 1024;
  if (baseUnit === "TB") return value * 1024 * 1024;

  return null;
}

function normalizeRetentionToDays(value: number | null, unit: string | null) {
  if (value === null || unit === null) return null;

  const normalized = unit.toLowerCase();
  if (normalized === "days" || normalized === "day") return value;
  if (normalized === "hours" || normalized === "hour") return value / 24;
  if (normalized === "months" || normalized === "month") return value * 30;
  if (normalized === "year" || normalized === "years") return value * 365;

  return null;
}

function retentionSortValue(limit: LimitField) {
  const numericDays = normalizeRetentionToDays(limit.value, limit.unit);
  if (numericDays !== null) {
    return numericDays;
  }

  if (hasNoAutomaticExpiryNotes(limit.notes)) {
    return NO_EXPIRY_RETENTION_SORT_VALUE;
  }

  return null;
}

function booleanMetric(value: boolean | null) {
  if (value === null) return null;
  return value ? 1 : 0;
}

function accountLabel(required: boolean | null): HostRecord["accountLabel"] {
  if (required === true) return "Required";
  if (required === false) return "Guest";
  return "Unknown";
}

function hasAccountVariant(record: HostLikeBase) {
  if (record.account.required === true) return true;
  if (record.limits.max_file_size_account || record.limits.storage_account) return true;

  const benefits = record.account.benefits.toLowerCase();
  const accountSignals = [
    "free account",
    "registered",
    "creating an account",
    "create an account",
    "account holders",
    "account holder",
    "accounts add",
    "account-managed",
    "signed-in",
    "signed in",
    "login and sign-up",
    "login and sign up",
    "user gardens",
    "dashboard",
    "statistics",
    "user key",
    "api key",
    "paid account",
    "paid accounts",
    "paid plan",
    "paid plans",
    "paid tier",
    "paid tiers",
    "premium",
    "subscriber",
    "subscribers",
    "file management"
  ];

  return accountSignals.some((signal) => benefits.includes(signal));
}

function guestMaxField(record: HostLikeBase) {
  if (record.limits.max_file_size_guest) return record.limits.max_file_size_guest;
  if (record.account.required === false) return record.limits.max_file_size;
  return null;
}

function accountMaxField(record: HostLikeBase) {
  if (record.limits.max_file_size_account) return record.limits.max_file_size_account;
  if (record.account.required === true) return record.limits.max_file_size;
  if (record.account.required === false && record.limits.max_file_size_guest) {
    return record.limits.max_file_size_guest;
  }
  return null;
}

function guestMaxLabel(record: HostLikeBase) {
  const field = guestMaxField(record);
  if (field) return limitLabel(field);
  if (record.account.required === true) return "Account only";
  return "Not published";
}

function accountMaxLabel(record: HostLikeBase) {
  const explicit = record.limits.max_file_size_account;
  if (explicit) return limitLabel(explicit);
  if (record.account.required === true) return limitLabel(record.limits.max_file_size);
  if (record.account.required === false && record.limits.max_file_size_guest) {
    return limitLabel(record.limits.max_file_size_guest);
  }
  if (record.account.required === false && !hasAccountVariant(record)) {
    return "No account";
  }
  return "Not published";
}

function guestMaxComparableLabel(record: HostLikeBase) {
  const field = guestMaxField(record);
  if (field) return mbComparableLabel(field);
  return guestMaxLabel(record);
}

function accountMaxComparableLabel(record: HostLikeBase) {
  const explicit = record.limits.max_file_size_account;
  if (explicit) return mbComparableLabel(explicit);
  if (record.account.required === true) return mbComparableLabel(record.limits.max_file_size);
  if (record.account.required === false && record.limits.max_file_size_guest) {
    return mbComparableLabel(record.limits.max_file_size_guest);
  }
  if (record.account.required === false && !hasAccountVariant(record)) {
    return "No account";
  }
  return "Not published";
}

function guestStorageField(record: HostLikeBase) {
  if (record.limits.storage_guest) return record.limits.storage_guest;
  if (record.account.required === false) return record.limits.storage;
  return null;
}

function accountStorageField(record: HostLikeBase) {
  if (record.limits.storage_account) return record.limits.storage_account;
  if (record.account.required === true) return record.limits.storage;
  if (record.account.required === false && guestStorageField(record)) return guestStorageField(record);
  return null;
}

function guestStorageLabel(record: HostLikeBase) {
  const field = guestStorageField(record);
  if (field) return limitLabel(field);
  if (record.account.required === true) return "Account only";
  return "Not published";
}

function accountStorageLabel(record: HostLikeBase) {
  const explicit = record.limits.storage_account;
  if (explicit) return limitLabel(explicit);
  if (record.account.required === true) return limitLabel(record.limits.storage);
  if (record.account.required === false && guestStorageField(record)) {
    return limitLabel(guestStorageField(record)!);
  }
  if (record.account.required === false && !hasAccountVariant(record)) {
    return "No account";
  }
  return "Not published";
}

function guestStorageComparableLabel(record: HostLikeBase) {
  const field = guestStorageField(record);
  if (field) return mbComparableLabel(field);
  return guestStorageLabel(record);
}

function accountStorageComparableLabel(record: HostLikeBase) {
  const explicit = record.limits.storage_account;
  if (explicit) return mbComparableLabel(explicit);
  if (record.account.required === true) return mbComparableLabel(record.limits.storage);
  if (record.account.required === false && guestStorageField(record)) {
    return mbComparableLabel(guestStorageField(record)!);
  }
  if (record.account.required === false && !hasAccountVariant(record)) {
    return "No account";
  }
  return "Not published";
}

function enrichRecord<T extends HostLikeBase>(record: T) {
  return {
    ...record,
    id: slugify(record.name),
    accountLabel: accountLabel(record.account.required),
    filters: {
      maxFileLabel: limitLabel(record.limits.max_file_size),
      maxFileGuestLabel: guestMaxLabel(record),
      maxFileAccountLabel: accountMaxLabel(record),
      retentionLabel: retentionLabel(record.limits.retention),
      storageLabel: limitLabel(record.limits.storage),
      storageGuestLabel: guestStorageLabel(record),
      storageAccountLabel: accountStorageLabel(record),
      bandwidthLabel: limitLabel(record.limits.bandwidth)
    },
    datasetLabels: {
      maxFileGuestLabel: guestMaxComparableLabel(record),
      maxFileAccountLabel: accountMaxComparableLabel(record),
      storageGuestLabel: guestStorageComparableLabel(record),
      storageAccountLabel: accountStorageComparableLabel(record)
    },
    sortMetrics: {
      maxFileGuestMb: normalizeToMb(
        guestMaxField(record)?.value ?? null,
        guestMaxField(record)?.unit ?? null
      ),
      maxFileAccountMb: normalizeToMb(
        accountMaxField(record)?.value ?? null,
        accountMaxField(record)?.unit ?? null
      ),
      storageGuestMb: normalizeToMb(
        guestStorageField(record)?.value ?? null,
        guestStorageField(record)?.unit ?? null
      ),
      storageAccountMb: normalizeToMb(
        accountStorageField(record)?.value ?? null,
        accountStorageField(record)?.unit ?? null
      ),
      bandwidthMb: normalizeToMb(record.limits.bandwidth.value, record.limits.bandwidth.unit),
      retentionDays: retentionSortValue(record.limits.retention)
    }
  };
}

function enrichAlternative(record: AlternativeService): AlternativeRecord {
  const labels = {
    primaryUse: textFieldLabel(record.profile.primary_use),
    sharingSurface: textFieldLabel(record.profile.sharing_surface),
    maxFileSize: mbComparableLabel(record.profile.max_file_size),
    persistenceModel: textFieldLabel(record.profile.persistence_model),
    storageModel: textFieldLabel(record.profile.storage_model),
    bandwidthModel: textFieldLabel(record.profile.bandwidth_model)
  };

  return {
    ...record,
    id: slugify(record.name),
    accountLabel: accountLabel(record.account.required),
    labels,
    sortMetrics: {
      maxFileMb: normalizeToMb(record.profile.max_file_size.value, record.profile.max_file_size.unit)
    },
    searchText: [
      record.name,
      record.summary,
      record.tags.join(" "),
      labels.primaryUse,
      labels.sharingSurface,
      labels.maxFileSize,
      labels.persistenceModel,
      labels.storageModel,
      labels.bandwidthModel
    ]
      .join(" ")
      .toLowerCase()
  };
}

function enrichMirror(record: MirrorUploaderService): MirrorUploaderRecord {
  const labels = {
    maxFileSize: mbComparableLabel(record.profile.max_file_size),
    guestUploads: booleanFieldLabel(record.profile.guest_uploads),
    remoteImport: booleanFieldLabel(record.profile.remote_import),
    torrentImport: booleanFieldLabel(record.profile.torrent_import),
    storesFilesItself: booleanFieldLabel(record.profile.stores_files_itself),
    retentionModel: textFieldLabel(record.profile.retention_model),
    downstreamDependency: textFieldLabel(record.profile.downstream_dependency)
  };

  return {
    ...record,
    id: slugify(record.name),
    accountLabel: accountLabel(record.account.required),
    labels,
    sortMetrics: {
      maxFileMb: normalizeToMb(record.profile.max_file_size.value, record.profile.max_file_size.unit),
      guestUploads: booleanMetric(record.profile.guest_uploads.value),
      remoteImport: booleanMetric(record.profile.remote_import.value),
      torrentImport: booleanMetric(record.profile.torrent_import.value),
      storesFilesItself: booleanMetric(record.profile.stores_files_itself.value)
    },
    searchText: [
      record.name,
      record.summary,
      record.tags.join(" "),
      labels.maxFileSize,
      labels.guestUploads,
      labels.remoteImport,
      labels.torrentImport,
      labels.storesFilesItself,
      labels.retentionModel,
      labels.downstreamDependency
    ]
      .join(" ")
      .toLowerCase()
  };
}

function enrichCloudMigration(record: CloudMigrationService): CloudMigrationRecord {
  const labels = {
    workflowModes: textFieldLabel(record.profile.workflow_modes),
    executionModel: textFieldLabel(record.profile.execution_model),
    itemLimit: mbComparableLabel(record.profile.item_limit),
    includedStorage: mbComparableLabel(record.profile.included_storage),
    scheduledRuns: booleanFieldLabel(record.profile.scheduled_runs),
    providerDependency: textFieldLabel(record.profile.provider_dependency),
    bandwidthModel: textFieldLabel(record.profile.bandwidth_model)
  };

  return {
    ...record,
    id: slugify(record.name),
    accountLabel: accountLabel(record.account.required),
    labels,
    sortMetrics: {
      itemLimitMb: normalizeToMb(record.profile.item_limit.value, record.profile.item_limit.unit),
      includedStorageMb: normalizeToMb(
        record.profile.included_storage.value,
        record.profile.included_storage.unit
      ),
      scheduledRuns: booleanMetric(record.profile.scheduled_runs.value)
    },
    searchText: [
      record.name,
      record.summary,
      record.tags.join(" "),
      labels.workflowModes,
      labels.executionModel,
      labels.itemLimit,
      labels.includedStorage,
      labels.scheduledRuns,
      labels.providerDependency,
      labels.bandwidthModel
    ]
      .join(" ")
      .toLowerCase()
  };
}

function enrichAdjacentCandidate<
  T extends {
    name: string;
    summary: string;
    reason: string | null;
    tags: string[];
    sources: SourceRecord[];
    account: { required: boolean | null };
    profile: unknown;
  }
>(record: T) {
  return {
    ...record,
    id: slugify(record.name),
    hasReferences: record.sources.length > 0,
    accountLabel: accountLabel(record.account.required),
    searchText: [
      record.name,
      record.summary,
      record.reason ?? "",
      record.tags.join(" "),
      JSON.stringify(record.profile),
      record.sources.map((source) => `${source.label} ${source.notes}`).join(" ")
    ]
      .join(" ")
      .toLowerCase()
  };
}

export function getSiteData(): SiteData {
  const hosts = readDataFile<Host[]>("hosts.json").map((host) => enrichRecord(host));
  const candidates = readDataFile<Candidate[]>("candidates.json").map((candidate) => ({
    ...enrichRecord(candidate),
    hasReferences: candidate.sources.length > 0
  }));
  const alternatives = readDataFile<AlternativeService[]>("alternatives.json").map((service) =>
    enrichAlternative(service)
  );
  const alternativeCandidates = readDataFile<AlternativeCandidate[]>(
    "alternatives_candidates.json"
  ).map((candidate) => enrichAdjacentCandidate(candidate));
  const mirrorUploaders = readDataFile<MirrorUploaderService[]>("mirror_uploaders.json").map(
    (service) => enrichMirror(service)
  );
  const mirrorUploaderCandidates = readDataFile<MirrorUploaderCandidate[]>(
    "mirror_uploaders_candidates.json"
  ).map((candidate) => enrichAdjacentCandidate(candidate));
  const cloudMigration = readDataFile<CloudMigrationService[]>("cloud_migration.json").map(
    (service) => enrichCloudMigration(service)
  );
  const cloudMigrationCandidates = readDataFile<CloudMigrationCandidate[]>(
    "cloud_migration_candidates.json"
  ).map((candidate) => enrichAdjacentCandidate(candidate));

  const tagOptions = [
    ...new Set(
      [hosts, alternatives, mirrorUploaders, cloudMigration].flatMap((collection) =>
        collection.flatMap((record) => record.tags)
      )
    )
  ].sort((a, b) => a.localeCompare(b));

  return {
    hosts,
    candidates,
    alternatives,
    alternativeCandidates,
    mirrorUploaders,
    mirrorUploaderCandidates,
    cloudMigration,
    cloudMigrationCandidates,
    stats: {
      verifiedHosts: hosts.length,
      pendingCandidates: candidates.filter((candidate) => candidate.verification_status === "pending").length,
      rejectedCandidates: candidates.filter((candidate) => candidate.verification_status === "rejected").length,
      apiHosts: hosts.filter((host) => host.developer.api_available).length,
      e2eeHosts: hosts.filter((host) => host.security.e2ee).length,
      cliHosts: hosts.filter((host) => host.developer.cli_friendly).length,
      alternativeMethods: alternatives.length,
      alternativeCandidates: alternativeCandidates.filter(
        (candidate) => candidate.verification_status === "pending"
      ).length,
      mirrorUploaders: mirrorUploaders.length,
      mirrorUploaderCandidates: mirrorUploaderCandidates.filter(
        (candidate) => candidate.verification_status === "pending"
      ).length,
      cloudMigrationTools: cloudMigration.length,
      cloudMigrationCandidates: cloudMigrationCandidates.filter(
        (candidate) => candidate.verification_status === "pending"
      ).length
    },
    tagOptions
  };
}
