import fs from "node:fs";
import path from "node:path";

type LimitField = {
  value: number | null;
  unit: string | null;
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

type HostLikeBase = {
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
  tags: string[];
  sources: SourceRecord[];
  content: {
    allowed_file_types: {
      mode: string;
      notes: string;
    } & SourceRefsField;
  };
};

type Host = HostLikeBase & {
  url: string;
};

type Candidate = HostLikeBase & {
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

export type SiteData = {
  hosts: HostRecord[];
  candidates: CandidateRecord[];
  stats: {
    verifiedHosts: number;
    pendingCandidates: number;
    rejectedCandidates: number;
    apiHosts: number;
    e2eeHosts: number;
    cliHosts: number;
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

function readDataFile<T>(filename: "hosts.json" | "candidates.json"): T {
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
    if (notes.includes("depends") || notes.includes("varies")) return "Conditional";
    if (hasNoAutomaticExpiryNotes(limit.notes)) {
      return "No automatic expiry";
    }
    return "Not published";
  }

  return `${formatComparableNumber(limit.value)} ${formatUnit(limit.value, limit.unit)}`;
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
  if (normalized === "days") return value;
  if (normalized === "hours") return value / 24;
  if (normalized === "months") return value * 30;
  if (normalized === "year") return value * 365;
  if (normalized === "years") return value * 365;

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

function accountLabel(required: boolean | null): HostRecord["accountLabel"] {
  if (required === true) return "Required";
  if (required === false) return "Guest";
  return "Unknown";
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

export function getSiteData(): SiteData {
  const hosts = readDataFile<Host[]>("hosts.json").map((host) => enrichRecord(host));

  const candidates = readDataFile<Candidate[]>("candidates.json").map((candidate) => ({
    ...enrichRecord(candidate),
    hasReferences: candidate.sources.length > 0
  }));

  const tagOptions = [...new Set(hosts.flatMap((host) => host.tags))].sort((a, b) =>
    a.localeCompare(b)
  );

  return {
    hosts,
    candidates,
    stats: {
      verifiedHosts: hosts.length,
      pendingCandidates: candidates.filter((candidate) => candidate.verification_status === "pending").length,
      rejectedCandidates: candidates.filter((candidate) => candidate.verification_status === "rejected").length,
      apiHosts: hosts.filter((host) => host.developer.api_available).length,
      e2eeHosts: hosts.filter((host) => host.security.e2ee).length,
      cliHosts: hosts.filter((host) => host.developer.cli_friendly).length
    },
    tagOptions
  };
}
