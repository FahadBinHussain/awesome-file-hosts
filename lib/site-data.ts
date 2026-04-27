import fs from "node:fs";
import path from "node:path";

type LimitField = {
  value: number | null;
  unit: string | null;
  notes: string;
};

type Host = {
  name: string;
  url: string;
  summary: string;
  limits: {
    max_file_size: LimitField;
    retention: LimitField;
    storage: LimitField;
    bandwidth: LimitField;
  };
  account: {
    required: boolean | null;
    benefits: string;
  };
  developer: {
    api_available: boolean;
    api_docs_url: string | null;
    cli_friendly: boolean;
    cli_example: string | null;
    notes: string;
  };
  security: {
    https_only: boolean;
    e2ee: boolean;
    server_side_encryption: boolean | null;
    notes: string;
  };
  tags: string[];
  sources: Array<{
    label: string;
    url: string;
    retrieved_at: string;
    notes: string;
  }>;
  content: {
    allowed_file_types: {
      mode: string;
      notes: string;
    };
  };
};

type Candidate = {
  name: string;
  type: string;
  free_volume: string | null;
  shelf_life: string | null;
  download_count: string | null;
  languages: string[];
  applications: string[];
  verification_status: "pending" | "verified" | "rejected";
  verification_notes?: string | null;
  verification_references?: Array<{
    label: string;
    url: string;
    retrieved_at: string;
  }>;
  source: string;
};

export type HostRecord = Host & {
  id: string;
  accountLabel: "Required" | "Guest" | "Unknown";
  filters: {
    maxFileLabel: string;
    retentionLabel: string;
    storageLabel: string;
    bandwidthLabel: string;
  };
};

export type CandidateRecord = Candidate & {
  id: string;
  hasReferences: boolean;
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
    return "Not published";
  }

  return `${limit.value} ${limit.unit}`;
}

function accountLabel(required: boolean | null): HostRecord["accountLabel"] {
  if (required === true) return "Required";
  if (required === false) return "Guest";
  return "Unknown";
}

export function getSiteData(): SiteData {
  const hosts = readDataFile<Host[]>("hosts.json").map((host) => ({
    ...host,
    id: slugify(host.name),
    accountLabel: accountLabel(host.account.required),
    filters: {
      maxFileLabel: limitLabel(host.limits.max_file_size),
      retentionLabel: limitLabel(host.limits.retention),
      storageLabel: limitLabel(host.limits.storage),
      bandwidthLabel: limitLabel(host.limits.bandwidth)
    }
  }));

  const candidates = readDataFile<Candidate[]>("candidates.json").map((candidate) => ({
    ...candidate,
    id: slugify(candidate.name),
    hasReferences: Boolean(candidate.verification_references?.length)
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
