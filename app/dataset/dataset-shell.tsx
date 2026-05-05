"use client";

import type { ReactNode, UIEvent } from "react";
import { Children, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowsDownUp,
  CheckCircle,
  Database,
  Eye,
  EyeSlash,
  Funnel,
  GlobeHemisphereWest,
  LinkSimple,
  MagnifyingGlass,
  ShieldCheck,
  Table,
  TerminalWindow,
  X,
  XCircle
} from "@phosphor-icons/react";
import { AppFrame } from "@/components/app-frame";
import { AdjacentDetailPanel } from "@/components/adjacent-detail-panel";
import { HostDetailPanel } from "@/components/host-detail-panel";
import { SourceRefLinks } from "@/components/source-ref-links";
import type {
  AdjacentCandidateRecord,
  AdjacentRecord,
  AlternativeRecord,
  CandidateRecord,
  CloudMigrationRecord,
  HostRecord,
  MirrorUploaderRecord,
  SiteData,
  SourceBackedRecord
} from "@/lib/site-data";

type Props = {
  data: SiteData;
  initialViewMode: DatasetViewMode;
  initialViewModeFromUrl: boolean;
};

const NO_EXPIRY_RETENTION_SORT_VALUE = 9_999_999;
const UNLIMITED_RETENTION_SORT_VALUE = NO_EXPIRY_RETENTION_SORT_VALUE + 1;
const DATASET_VIEW_MODE_STORAGE_KEY = "awesome-file-hosts:dataset-view-mode";

type ServiceMode = "hosts" | "alternatives" | "mirrors" | "migration";
type DatasetMode = ServiceMode;
type DatasetViewMode = "full" | "simple" | "guided";
type GuidedIntent = "quick" | "large" | "private" | "developer" | "durable";
type HostSortKey =
  | "name"
  | "free_model"
  | "max_guest"
  | "max_account"
  | "storage_guest"
  | "storage_account"
  | "retention"
  | "bandwidth"
  | "public_sharing"
  | "allowed_extensions"
  | "blocked_extensions"
  | "api"
  | "cli"
  | "e2ee"
  | "https"
  | "tags"
  | "sources";
type QueueSortKey =
  | "name"
  | "free_model"
  | "max_guest"
  | "max_account"
  | "storage_guest"
  | "storage_account"
  | "retention"
  | "bandwidth"
  | "public_sharing"
  | "allowed_extensions"
  | "blocked_extensions"
  | "api"
  | "cli"
  | "e2ee"
  | "https"
  | "tags"
  | "sources"
  | "status"
  | "notes";
type AdjacentQueueSortKey =
  | "name"
  | "kind"
  | "status"
  | "account"
  | "allowed_extensions"
  | "blocked_extensions"
  | "api"
  | "cli"
  | "e2ee"
  | "https"
  | "sources"
  | "notes";

type SortState<T extends string> = {
  key: T;
  direction: "asc" | "desc";
};

type HostColumn = {
  id: HostSortKey;
  label: string;
  width: string;
  className?: string;
  render: (host: HostRecord) => ReactNode;
};

type QueueColumn = {
  id: QueueSortKey;
  label: string;
  width: string;
  className?: string;
  render: (candidate: CandidateRecord) => ReactNode;
};

type AdjacentQueueColumn = {
  id: AdjacentQueueSortKey;
  label: string;
  width: string;
  className?: string;
  render: (candidate: AdjacentCandidateRecord) => ReactNode;
};

type AdjacentSortKey = string;

type AdjacentColumn<T extends AdjacentRecord> = {
  id: AdjacentSortKey;
  label: string;
  width: string;
  className?: string;
  render: (record: T) => ReactNode;
  sortValue?: (record: T) => string | number | null;
};

const hostColumnDefs: HostColumn[] = [
  {
    id: "name",
    label: "Service",
    width: "180px",
    className: "min-w-[170px] sticky left-0 z-10 bg-[var(--bg-elevated)] before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-gradient-to-b before:from-[var(--accent)] before:to-transparent before:content-['']",
    render: (host) => (
      <div className="min-w-0">
        <a
          href={host.url}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="block truncate font-medium text-[var(--text-primary)] transition-all hover:translate-x-[2px] hover:text-[var(--accent)]"
        >
          {host.name}
        </a>
      </div>
    )
  },
  {
    id: "max_guest",
    label: "Max (guest)",
    width: "124px",
    render: (host) => (
      <CitedValue
        value={host.datasetLabels.maxFileGuestLabel}
        record={host}
        refs={
          host.limits.max_file_size_guest?.source_refs ??
          (host.account.required === false ? host.limits.max_file_size.source_refs : undefined)
        }
      />
    )
  },
  {
    id: "max_account",
    label: "Max (acct)",
    width: "124px",
    render: (host) => (
      <CitedValue
        value={host.datasetLabels.maxFileAccountLabel}
        record={host}
        refs={
          (
            host.limits.max_file_size_account ??
            (host.account.required === true ? host.limits.max_file_size : host.limits.max_file_size_guest)
          )?.source_refs
        }
      />
    )
  },
  {
    id: "storage_guest",
    label: "Storage (guest)",
    width: "124px",
    render: (host) => (
      <CitedValue
        value={host.datasetLabels.storageGuestLabel}
        record={host}
        refs={
          host.limits.storage_guest?.source_refs ??
          (host.account.required === false ? host.limits.storage.source_refs : undefined)
        }
      />
    )
  },
  {
    id: "storage_account",
    label: "Storage (acct)",
    width: "124px",
    render: (host) => (
      <CitedValue
        value={host.datasetLabels.storageAccountLabel}
        record={host}
        refs={
          (
            host.limits.storage_account ??
            (host.account.required === true ? host.limits.storage : host.limits.storage_guest)
          )?.source_refs
        }
      />
    )
  },
  {
    id: "retention",
    label: "Retention",
    width: "122px",
    render: (host) => (
      <CitedValue value={host.filters.retentionLabel} record={host} refs={host.limits.retention.source_refs} />
    )
  },
  {
    id: "api",
    label: "API",
    width: "92px",
    render: (host) => (
      <CitedValue
        value={host.developer.api_available ? "Yes" : "No"}
        record={host}
        refs={host.developer.source_refs}
      />
    )
  },
  {
    id: "free_model",
    label: "Free model",
    width: "152px",
    render: (host) => (
      <CitedValue
        value={host.filters.freeModelLabel}
        record={host}
        refs={host.free_model.source_refs}
      />
    )
  },
  {
    id: "public_sharing",
    label: "Public share",
    width: "160px",
    render: (host) => (
      <CitedValue
        value={booleanFieldLabel(host.content.public_sharing?.value)}
        record={host}
        refs={host.content.public_sharing?.source_refs}
      />
    )
  },
  {
    id: "allowed_extensions",
    label: "Allowed ext",
    width: "180px",
    render: (host) => (
      <CitedValue
        value={allowedExtensionLabel(host)}
        record={host}
        refs={host.content.allowed_file_types.source_refs}
      />
    )
  },
  {
    id: "blocked_extensions",
    label: "Blocked ext",
    width: "180px",
    render: (host) => (
      <CitedValue
        value={blockedExtensionLabel(host)}
        record={host}
        refs={host.content.allowed_file_types.source_refs}
      />
    )
  },
  {
    id: "bandwidth",
    label: "Bandwidth",
    width: "150px",
    render: (host) => (
      <CitedValue value={host.filters.bandwidthLabel} record={host} refs={host.limits.bandwidth.source_refs} />
    )
  },
  {
    id: "cli",
    label: "CLI",
    width: "92px",
    render: (host) => (
      <CitedValue
        value={host.developer.cli_friendly ? "Yes" : "No"}
        record={host}
        refs={host.developer.source_refs}
      />
    )
  },
  {
    id: "e2ee",
    label: "E2EE",
    width: "92px",
    render: (host) => (
      <CitedValue value={host.security.e2ee ? "Yes" : "No"} record={host} refs={host.security.source_refs} />
    )
  },
  {
    id: "https",
    label: "HTTPS",
    width: "92px",
    render: (host) => (
      <CitedValue
        value={host.security.https_only ? "Yes" : "No"}
        record={host}
        refs={host.security.source_refs}
      />
    )
  },
  {
    id: "tags",
    label: "Tags",
    width: "240px",
    className: "min-w-[160px]",
    render: (host) => (
      <span className="block truncate" title={host.tags.join(", ")}>
        {host.tags.slice(0, 3).join(", ")}
      </span>
    )
  },
  { id: "sources", label: "Sources", width: "104px", render: (host) => String(host.sources.length) }
];

const queueColumnDefs: QueueColumn[] = [
  {
    id: "name",
    label: "Candidate",
    width: "clamp(132px, 28vw, 180px)",
    className: "min-w-[132px] sticky left-0 z-10 bg-[var(--bg-elevated)] before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-gradient-to-b before:from-[var(--accent)] before:to-transparent before:content-['']",
    render: (candidate) => (
      <div className="truncate text-[14px] font-medium text-[var(--text-primary)] sm:text-[15px]">
        {candidate.name}
      </div>
    )
  },
  {
    id: "max_guest",
    label: "Max (guest)",
    width: "124px",
    render: (candidate) => (
      <CitedValue
        value={candidate.datasetLabels.maxFileGuestLabel}
        record={candidate}
        refs={
          candidate.limits.max_file_size_guest?.source_refs ??
          (candidate.account.required === false ? candidate.limits.max_file_size.source_refs : undefined)
        }
      />
    )
  },
  {
    id: "max_account",
    label: "Max (acct)",
    width: "124px",
    render: (candidate) => (
      <CitedValue
        value={candidate.datasetLabels.maxFileAccountLabel}
        record={candidate}
        refs={
          (
            candidate.limits.max_file_size_account ??
            (candidate.account.required === true
              ? candidate.limits.max_file_size
              : candidate.limits.max_file_size_guest)
          )?.source_refs
        }
      />
    )
  },
  {
    id: "storage_guest",
    label: "Storage (guest)",
    width: "124px",
    render: (candidate) => (
      <CitedValue
        value={candidate.datasetLabels.storageGuestLabel}
        record={candidate}
        refs={
          (
            candidate.limits.storage_guest ??
            (candidate.account.required === false ? candidate.limits.storage : undefined)
          )?.source_refs
        }
      />
    )
  },
  {
    id: "storage_account",
    label: "Storage (acct)",
    width: "124px",
    render: (candidate) => (
      <CitedValue
        value={candidate.datasetLabels.storageAccountLabel}
        record={candidate}
        refs={
          (
            candidate.limits.storage_account ??
            (candidate.account.required === true ? candidate.limits.storage : candidate.limits.storage_guest)
          )?.source_refs
        }
      />
    )
  },
  {
    id: "retention",
    label: "Retention",
    width: "122px",
    render: (candidate) => (
      <CitedValue
        value={candidate.filters.retentionLabel}
        record={candidate}
        refs={candidate.limits.retention.source_refs}
      />
    )
  },
  {
    id: "bandwidth",
    label: "Bandwidth",
    width: "150px",
    render: (candidate) => (
      <CitedValue
        value={candidate.filters.bandwidthLabel}
        record={candidate}
        refs={candidate.limits.bandwidth.source_refs}
      />
    )
  },
  {
    id: "api",
    label: "API",
    width: "92px",
    render: (candidate) => (
      <CitedValue
        value={candidate.developer.api_available ? "Yes" : "No"}
        record={candidate}
        refs={candidate.developer.source_refs}
      />
    )
  },
  {
    id: "free_model",
    label: "Free model",
    width: "152px",
    render: (candidate) => (
      <CitedValue
        value={candidate.filters.freeModelLabel}
        record={candidate}
        refs={candidate.free_model.source_refs}
      />
    )
  },
  {
    id: "public_sharing",
    label: "Public share",
    width: "160px",
    render: (candidate) => (
      <CitedValue
        value={booleanFieldLabel(candidate.content.public_sharing?.value)}
        record={candidate}
        refs={candidate.content.public_sharing?.source_refs}
      />
    )
  },
  {
    id: "allowed_extensions",
    label: "Allowed ext",
    width: "180px",
    render: (candidate) => (
      <CitedValue
        value={allowedExtensionLabel(candidate)}
        record={candidate}
        refs={candidate.content.allowed_file_types.source_refs}
      />
    )
  },
  {
    id: "blocked_extensions",
    label: "Blocked ext",
    width: "180px",
    render: (candidate) => (
      <CitedValue
        value={blockedExtensionLabel(candidate)}
        record={candidate}
        refs={candidate.content.allowed_file_types.source_refs}
      />
    )
  },
  {
    id: "cli",
    label: "CLI",
    width: "92px",
    render: (candidate) => (
      <CitedValue
        value={candidate.developer.cli_friendly ? "Yes" : "No"}
        record={candidate}
        refs={candidate.developer.source_refs}
      />
    )
  },
  {
    id: "e2ee",
    label: "E2EE",
    width: "92px",
    render: (candidate) => (
      <CitedValue
        value={candidate.security.e2ee ? "Yes" : "No"}
        record={candidate}
        refs={candidate.security.source_refs}
      />
    )
  },
  {
    id: "https",
    label: "HTTPS",
    width: "92px",
    render: (candidate) => (
      <CitedValue
        value={candidate.security.https_only ? "Yes" : "No"}
        record={candidate}
        refs={candidate.security.source_refs}
      />
    )
  },
  {
    id: "tags",
    label: "Tags",
    width: "240px",
    className: "min-w-[160px]",
    render: (candidate) => (
      <span className="block truncate" title={candidate.tags.join(", ")}>
        {candidate.tags.slice(0, 3).join(", ")}
      </span>
    )
  },
  {
    id: "sources",
    label: "Sources",
    width: "104px",
    render: (candidate) => String(candidate.sources.length)
  },
  {
    id: "status",
    label: "Status",
    width: "112px",
    render: (candidate) => candidate.verification_status
  },
  {
    id: "notes",
    label: "Why",
    width: "260px",
    className: "min-w-[220px]",
    render: (candidate) => (
      <span className="block truncate" title={candidate.reason ?? candidate.summary}>
        {candidate.reason ?? candidate.summary}
      </span>
    )
  }
];

const adjacentQueueColumnDefs: AdjacentQueueColumn[] = [
  {
    id: "name",
    label: "Candidate",
    width: "180px",
    className:
      "min-w-[170px] sticky left-0 z-10 bg-[var(--bg-elevated)] before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-gradient-to-b before:from-[var(--accent)] before:to-transparent before:content-['']",
    render: (candidate) => (
      <div className="min-w-0">
        {candidate.url ? (
          <a
            href={candidate.url}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="block truncate font-medium text-[var(--text-primary)] transition-all hover:translate-x-[2px] hover:text-[var(--accent)]"
          >
            {candidate.name}
          </a>
        ) : (
          <span className="block truncate font-medium text-[var(--text-primary)]">{candidate.name}</span>
        )}
      </div>
    )
  },
  {
    id: "kind",
    label: "Section",
    width: "148px",
    render: (candidate) => adjacentKindLabel(candidate.kind)
  },
  {
    id: "status",
    label: "Status",
    width: "112px",
    render: (candidate) => candidate.verification_status
  },
  {
    id: "account",
    label: "Account",
    width: "112px",
    render: (candidate) => (
      <CitedValue value={candidate.accountLabel} record={candidate} refs={candidate.account.source_refs} />
    )
  },
  {
    id: "allowed_extensions",
    label: "Allowed ext",
    width: "180px",
    render: (candidate) => (
      <CitedValue
        value={allowedExtensionLabel(candidate)}
        record={candidate}
        refs={candidate.content.allowed_file_types.source_refs}
      />
    )
  },
  {
    id: "blocked_extensions",
    label: "Blocked ext",
    width: "180px",
    render: (candidate) => (
      <CitedValue
        value={blockedExtensionLabel(candidate)}
        record={candidate}
        refs={candidate.content.allowed_file_types.source_refs}
      />
    )
  },
  {
    id: "api",
    label: "API",
    width: "92px",
    render: (candidate) => (
      <CitedValue
        value={candidate.developer.api_available ? "Yes" : "No"}
        record={candidate}
        refs={candidate.developer.source_refs}
      />
    )
  },
  {
    id: "cli",
    label: "CLI",
    width: "92px",
    render: (candidate) => (
      <CitedValue
        value={candidate.developer.cli_friendly ? "Yes" : "No"}
        record={candidate}
        refs={candidate.developer.source_refs}
      />
    )
  },
  {
    id: "e2ee",
    label: "E2EE",
    width: "92px",
    render: (candidate) => (
      <CitedValue value={candidate.security.e2ee ? "Yes" : "No"} record={candidate} refs={candidate.security.source_refs} />
    )
  },
  {
    id: "https",
    label: "HTTPS",
    width: "92px",
    render: (candidate) => (
      <CitedValue
        value={candidate.security.https_only ? "Yes" : "No"}
        record={candidate}
        refs={candidate.security.source_refs}
      />
    )
  },
  {
    id: "sources",
    label: "Sources",
    width: "104px",
    render: (candidate) => String(candidate.sources.length)
  },
  {
    id: "notes",
    label: "Why",
    width: "280px",
    className: "min-w-[220px]",
    render: (candidate) => (
      <span className="block truncate" title={candidate.reason ?? candidate.summary}>
        {candidate.reason ?? candidate.summary}
      </span>
    )
  }
];

const alternativeColumnDefs: AdjacentColumn<AlternativeRecord>[] = [
  {
    id: "name",
    label: "Service",
    width: "180px",
    className:
      "min-w-[170px] sticky left-0 z-10 bg-[var(--bg-elevated)] before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-gradient-to-b before:from-[var(--accent)] before:to-transparent before:content-['']",
    render: (record) => (
      <div className="min-w-0">
        <a
          href={record.url}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="block truncate font-medium text-[var(--text-primary)] transition-all hover:translate-x-[2px] hover:text-[var(--accent)]"
        >
          {record.name}
        </a>
      </div>
    ),
    sortValue: (record) => record.name.toLowerCase()
  },
  {
    id: "primary_use",
    label: "Method",
    width: "148px",
    render: (record) => (
      <CitedValue
        value={record.labels.primaryUse}
        record={record}
        refs={record.profile.primary_use.source_refs}
      />
    ),
    sortValue: (record) => record.labels.primaryUse.toLowerCase()
  },
  {
    id: "sharing_surface",
    label: "Share via",
    width: "164px",
    render: (record) => (
      <CitedValue
        value={record.labels.sharingSurface}
        record={record}
        refs={record.profile.sharing_surface.source_refs}
      />
    ),
    sortValue: (record) => record.labels.sharingSurface.toLowerCase()
  },
  {
    id: "max_file_size",
    label: "Max item",
    width: "118px",
    render: (record) => (
      <CitedValue
        value={record.labels.maxFileSize}
        record={record}
        refs={record.profile.max_file_size.source_refs}
      />
    ),
    sortValue: (record) => record.sortMetrics.maxFileMb
  },
  {
    id: "allowed_extensions",
    label: "Allowed ext",
    width: "180px",
    render: (record) => (
      <CitedValue
        value={allowedExtensionLabel(record)}
        record={record}
        refs={record.content.allowed_file_types.source_refs}
      />
    ),
    sortValue: (record) => allowedExtensionLabel(record).toLowerCase()
  },
  {
    id: "blocked_extensions",
    label: "Blocked ext",
    width: "180px",
    render: (record) => (
      <CitedValue
        value={blockedExtensionLabel(record)}
        record={record}
        refs={record.content.allowed_file_types.source_refs}
      />
    ),
    sortValue: (record) => blockedExtensionLabel(record).toLowerCase()
  },
  {
    id: "persistence_model",
    label: "Persistence",
    width: "146px",
    render: (record) => (
      <CitedValue
        value={record.labels.persistenceModel}
        record={record}
        refs={record.profile.persistence_model.source_refs}
      />
    ),
    sortValue: (record) => record.labels.persistenceModel.toLowerCase()
  },
  {
    id: "storage_model",
    label: "Storage model",
    width: "164px",
    render: (record) => (
      <CitedValue
        value={record.labels.storageModel}
        record={record}
        refs={record.profile.storage_model.source_refs}
      />
    ),
    sortValue: (record) => record.labels.storageModel.toLowerCase()
  },
  {
    id: "api",
    label: "API",
    width: "92px",
    render: (record) => (
      <CitedValue
        value={record.developer.api_available ? "Yes" : "No"}
        record={record}
        refs={record.developer.source_refs}
      />
    ),
    sortValue: (record) => (record.developer.api_available ? 1 : 0)
  },
  {
    id: "e2ee",
    label: "E2EE",
    width: "92px",
    render: (record) => (
      <CitedValue
        value={record.security.e2ee ? "Yes" : "No"}
        record={record}
        refs={record.security.source_refs}
      />
    ),
    sortValue: (record) => (record.security.e2ee ? 1 : 0)
  }
];

const mirrorColumnDefs: AdjacentColumn<MirrorUploaderRecord>[] = [
  {
    id: "name",
    label: "Service",
    width: "180px",
    className:
      "min-w-[170px] sticky left-0 z-10 bg-[var(--bg-elevated)] before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-gradient-to-b before:from-[var(--accent)] before:to-transparent before:content-['']",
    render: (record) => (
      <div className="min-w-0">
        <a
          href={record.url}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="block truncate font-medium text-[var(--text-primary)] transition-all hover:translate-x-[2px] hover:text-[var(--accent)]"
        >
          {record.name}
        </a>
      </div>
    ),
    sortValue: (record) => record.name.toLowerCase()
  },
  {
    id: "max_file_size",
    label: "Max upload",
    width: "122px",
    render: (record) => (
      <CitedValue
        value={record.labels.maxFileSize}
        record={record}
        refs={record.profile.max_file_size.source_refs}
      />
    ),
    sortValue: (record) => record.sortMetrics.maxFileMb
  },
  {
    id: "allowed_extensions",
    label: "Allowed ext",
    width: "180px",
    render: (record) => (
      <CitedValue
        value={allowedExtensionLabel(record)}
        record={record}
        refs={record.content.allowed_file_types.source_refs}
      />
    ),
    sortValue: (record) => allowedExtensionLabel(record).toLowerCase()
  },
  {
    id: "blocked_extensions",
    label: "Blocked ext",
    width: "180px",
    render: (record) => (
      <CitedValue
        value={blockedExtensionLabel(record)}
        record={record}
        refs={record.content.allowed_file_types.source_refs}
      />
    ),
    sortValue: (record) => blockedExtensionLabel(record).toLowerCase()
  },
  {
    id: "guest_uploads",
    label: "Guest",
    width: "96px",
    render: (record) => (
      <CitedValue
        value={record.labels.guestUploads}
        record={record}
        refs={record.profile.guest_uploads.source_refs}
      />
    ),
    sortValue: (record) => record.sortMetrics.guestUploads
  },
  {
    id: "remote_import",
    label: "Remote URL",
    width: "112px",
    render: (record) => (
      <CitedValue
        value={record.labels.remoteImport}
        record={record}
        refs={record.profile.remote_import.source_refs}
      />
    ),
    sortValue: (record) => record.sortMetrics.remoteImport
  },
  {
    id: "torrent_import",
    label: "Torrent",
    width: "104px",
    render: (record) => (
      <CitedValue
        value={record.labels.torrentImport}
        record={record}
        refs={record.profile.torrent_import.source_refs}
      />
    ),
    sortValue: (record) => record.sortMetrics.torrentImport
  },
  {
    id: "stores_files_itself",
    label: "Stores files",
    width: "118px",
    render: (record) => (
      <CitedValue
        value={record.labels.storesFilesItself}
        record={record}
        refs={record.profile.stores_files_itself.source_refs}
      />
    ),
    sortValue: (record) => record.sortMetrics.storesFilesItself
  },
  {
    id: "api",
    label: "API",
    width: "92px",
    render: (record) => (
      <CitedValue
        value={record.developer.api_available ? "Yes" : "No"}
        record={record}
        refs={record.developer.source_refs}
      />
    ),
    sortValue: (record) => (record.developer.api_available ? 1 : 0)
  },
  {
    id: "cli",
    label: "CLI",
    width: "92px",
    render: (record) => (
      <CitedValue
        value={record.developer.cli_friendly ? "Yes" : "No"}
        record={record}
        refs={record.developer.source_refs}
      />
    ),
    sortValue: (record) => (record.developer.cli_friendly ? 1 : 0)
  }
];

const migrationColumnDefs: AdjacentColumn<CloudMigrationRecord>[] = [
  {
    id: "name",
    label: "Service",
    width: "180px",
    className:
      "min-w-[170px] sticky left-0 z-10 bg-[var(--bg-elevated)] before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-gradient-to-b before:from-[var(--accent)] before:to-transparent before:content-['']",
    render: (record) => (
      <div className="min-w-0">
        <a
          href={record.url}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="block truncate font-medium text-[var(--text-primary)] transition-all hover:translate-x-[2px] hover:text-[var(--accent)]"
        >
          {record.name}
        </a>
      </div>
    ),
    sortValue: (record) => record.name.toLowerCase()
  },
  {
    id: "workflow_modes",
    label: "Modes",
    width: "148px",
    render: (record) => (
      <CitedValue
        value={record.labels.workflowModes}
        record={record}
        refs={record.profile.workflow_modes.source_refs}
      />
    ),
    sortValue: (record) => record.labels.workflowModes.toLowerCase()
  },
  {
    id: "execution_model",
    label: "Execution",
    width: "156px",
    render: (record) => (
      <CitedValue
        value={record.labels.executionModel}
        record={record}
        refs={record.profile.execution_model.source_refs}
      />
    ),
    sortValue: (record) => record.labels.executionModel.toLowerCase()
  },
  {
    id: "item_limit",
    label: "Item limit",
    width: "118px",
    render: (record) => (
      <CitedValue
        value={record.labels.itemLimit}
        record={record}
        refs={record.profile.item_limit.source_refs}
      />
    ),
    sortValue: (record) => record.sortMetrics.itemLimitMb
  },
  {
    id: "allowed_extensions",
    label: "Allowed ext",
    width: "180px",
    render: (record) => (
      <CitedValue
        value={allowedExtensionLabel(record)}
        record={record}
        refs={record.content.allowed_file_types.source_refs}
      />
    ),
    sortValue: (record) => allowedExtensionLabel(record).toLowerCase()
  },
  {
    id: "blocked_extensions",
    label: "Blocked ext",
    width: "180px",
    render: (record) => (
      <CitedValue
        value={blockedExtensionLabel(record)}
        record={record}
        refs={record.content.allowed_file_types.source_refs}
      />
    ),
    sortValue: (record) => blockedExtensionLabel(record).toLowerCase()
  },
  {
    id: "included_storage",
    label: "Included storage",
    width: "144px",
    render: (record) => (
      <CitedValue
        value={record.labels.includedStorage}
        record={record}
        refs={record.profile.included_storage.source_refs}
      />
    ),
    sortValue: (record) => record.sortMetrics.includedStorageMb
  },
  {
    id: "scheduled_runs",
    label: "Scheduling",
    width: "114px",
    render: (record) => (
      <CitedValue
        value={record.labels.scheduledRuns}
        record={record}
        refs={record.profile.scheduled_runs.source_refs}
      />
    ),
    sortValue: (record) => record.sortMetrics.scheduledRuns
  },
  {
    id: "api",
    label: "API",
    width: "92px",
    render: (record) => (
      <CitedValue
        value={record.developer.api_available ? "Yes" : "No"}
        record={record}
        refs={record.developer.source_refs}
      />
    ),
    sortValue: (record) => (record.developer.api_available ? 1 : 0)
  },
  {
    id: "cli",
    label: "CLI",
    width: "92px",
    render: (record) => (
      <CitedValue
        value={record.developer.cli_friendly ? "Yes" : "No"}
        record={record}
        refs={record.developer.source_refs}
      />
    ),
    sortValue: (record) => (record.developer.cli_friendly ? 1 : 0)
  }
];

function statusTone(status: CandidateRecord["verification_status"]) {
  if (status === "verified") return "text-[var(--good)] bg-[var(--good-soft)] border-[var(--good)]/20 shadow-[0_0_16px_-4px_var(--good-soft)]";
  if (status === "rejected") return "text-[var(--bad)] bg-[var(--bad-soft)] border-[var(--bad)]/20 shadow-[0_0_16px_-4px_var(--bad-soft)]";
  return "text-[var(--warn)] bg-[var(--warn-soft)] border-[var(--warn)]/20 shadow-[0_0_16px_-4px_var(--warn-soft)]";
}

function adjacentKindLabel(kind: AdjacentRecord["kind"]) {
  if (kind === "alternative") return "Other way to share";
  if (kind === "mirror_uploader") return "Mirror uploader";
  return "Cloud migration";
}

function serviceModeLabel(mode: ServiceMode) {
  if (mode === "hosts") return "Hosts";
  if (mode === "alternatives") return "Other ways to share";
  if (mode === "mirrors") return "Mirror uploaders";
  return "Cloud migration";
}

function normalizeDatasetViewMode(value: string | null | undefined): DatasetViewMode | null {
  if (value === "simple" || value === "guided" || value === "full") return value;
  return null;
}

function DatasetViewModeToggle({
  mode,
  onChange,
  className = ""
}: {
  mode: DatasetViewMode;
  onChange: (mode: DatasetViewMode) => void;
  className?: string;
}) {
  return (
    <div
      className={[
        "inline-flex rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-2)] p-1",
        className
      ].join(" ")}
      aria-label="Dataset view mode"
      role="group"
    >
      {([
        { id: "full", label: "Full", icon: <Database size={14} weight="fill" /> },
        { id: "simple", label: "Simple", icon: <Table size={14} weight="fill" /> },
        { id: "guided", label: "Guided", icon: <Funnel size={14} weight="fill" /> }
      ] satisfies Array<{ id: DatasetViewMode; label: string; icon: ReactNode }>).map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={mode === option.id}
          className={[
            "inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 text-xs font-medium transition-colors",
            mode === option.id
              ? "bg-[var(--bg)] text-[var(--text-primary)] shadow-[var(--shadow-soft)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          ].join(" ")}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
  icon
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "dataset-toolbar-button group relative inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3.5 py-2 text-xs font-medium transition-all duration-200",
        active
          ? "border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent-soft-content)] shadow-[0_0_24px_-6px_var(--accent-glow)]"
          : "border-[var(--line)] bg-[var(--surface-1)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50 hover:text-[var(--text-primary)] hover:shadow-[0_0_20px_-6px_var(--accent-glow)]"
      ].join(" ")}
    >
      {icon && <span className={["transition-transform", active ? "scale-110" : "group-hover:scale-110"].join(" ")}>{icon}</span>}
      {children}
      {active && (
        <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-pill)] bg-gradient-to-r from-[var(--accent)]/8 to-transparent opacity-60" />
      )}
    </button>
  );
}

function sortDirectionLabel(direction: "asc" | "desc") {
  return direction === "asc" 
    ? "↑ Ascending" 
    : "↓ Descending";
}

function booleanFieldLabel(value: boolean | null | undefined) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "Unknown";
}

function booleanSortValue(value: boolean | null | undefined) {
  if (value === true) return 1;
  if (value === false) return 0;
  return null;
}

type ExtensionAwareRecord = SourceBackedRecord & {
  content: {
    allowed_file_types: {
      mode: string;
      notes: string;
      allowed_extensions: string[];
      blocked_extensions: string[];
      source_refs?: number[];
    };
  };
};

function extensionListLabel(extensions: string[]) {
  return extensions.join(", ");
}

function allowedExtensionLabel(record: ExtensionAwareRecord) {
  const fileTypes = record.content.allowed_file_types;
  const mode = fileTypes.mode.toLowerCase();
  const notes = fileTypes.notes.toLowerCase();

  if (fileTypes.allowed_extensions.length > 0) {
    return extensionListLabel(fileTypes.allowed_extensions);
  }

  if (mode.includes("all") || mode.includes("any")) return "All / see notes";
  if (mode.includes("image")) return "Images / see notes";
  if (mode.includes("video")) return "Videos / see notes";
  if (mode.includes("media")) return "Media / see notes";
  if (mode.includes("backup")) return "Backup / see notes";
  if (mode.includes("mod")) return "Mods / see notes";
  if (mode.includes("alias")) return "Alias / see notes";
  if (mode.includes("generic") || mode.includes("general")) return "General / see notes";
  if (mode.includes("configurable")) return "Configurable";
  if (
    mode.includes("unavailable") ||
    mode.includes("retired") ||
    mode.includes("not-usable") ||
    mode.includes("not_usable") ||
    mode.includes("shutdown") ||
    mode.includes("dead") ||
    mode.includes("repurposed") ||
    mode.includes("misclassified") ||
    mode.includes("not_applicable")
  ) {
    return "Unavailable";
  }
  if (mode.includes("unidentified")) return "Unidentified";
  if (mode.includes("rejected")) return "Rejected / see notes";
  if (mode.includes("unverified")) return "Unverified";
  if (
    mode.includes("conditional") ||
    mode.includes("dependent") ||
    mode.includes("provider_dependent") ||
    mode.includes("provider-dependent") ||
    notes.includes("conditional") ||
    notes.includes("depends") ||
    notes.includes("depend") ||
    notes.includes("varies") ||
    notes.includes("downstream") ||
    notes.includes("provider-dependent") ||
    notes.includes("provider dependent")
  ) {
    return "Conditional";
  }
  return "Not published";
}

function blockedExtensionLabel(record: ExtensionAwareRecord) {
  const extensions = record.content.allowed_file_types.blocked_extensions;
  return extensions.length > 0 ? extensionListLabel(extensions) : "None published";
}

function freeModelSortValue(value: HostRecord["free_model"]["value"]) {
  switch (value) {
    case "free-forever":
      return 0;
    case "free-trial":
      return 1;
    case "credit-card-trial":
      return 2;
    case "paid-only":
      return 3;
    case "unknown":
      return 4;
  }
}

function gridTemplate(columns: Array<{ width: string }>) {
  return columns.map((column) => column.width).join(" ");
}

function SpreadsheetScroller({ children }: { children: ReactNode }) {
  const headerScrollerRef = useRef<HTMLDivElement>(null);
  const [header, ...rows] = Children.toArray(children);

  function syncHeaderScroll(event: UIEvent<HTMLDivElement>) {
    if (headerScrollerRef.current) {
      headerScrollerRef.current.scrollLeft = event.currentTarget.scrollLeft;
    }
  }

  return (
    <>
      <div className="sticky top-16 z-30 overflow-hidden">
        <div ref={headerScrollerRef} className="overflow-hidden">
          <div className="min-w-max text-sm">{header}</div>
        </div>
      </div>
      <div className="w-full overflow-x-auto [overflow-y:clip] scrollbar-subtle" onScroll={syncHeaderScroll}>
        <div className="min-w-max text-sm">{rows}</div>
      </div>
    </>
  );
}

function hostHeaderLabel(column: HostColumn) {
  if (column.id === "max_guest") return "w/o acc";
  if (column.id === "max_account") return "w/ acc";
  if (column.id === "storage_guest") return "w/o acc";
  if (column.id === "storage_account") return "w/ acc";
  return column.label;
}

function queueHeaderLabel(column: QueueColumn) {
  if (column.id === "max_guest") return "w/o acc";
  if (column.id === "max_account") return "w/ acc";
  if (column.id === "storage_guest") return "w/o acc";
  if (column.id === "storage_account") return "w/ acc";
  return column.label;
}

function SortHeaderButton({
  direction,
  isSorted,
  label,
  onClick
}: {
  direction: "asc" | "desc";
  isSorted: boolean;
  label: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={typeof label === "string" ? label : undefined}
      className="inline-flex max-w-full min-w-0 items-center gap-1.5 transition-all hover:opacity-80"
    >
      <span className="whitespace-nowrap tracking-normal">{label}</span>
      {isSorted ? (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[var(--accent-soft)] text-[11px]">
          {direction === "asc" ? "↑" : "↓"}
        </span>
      ) : (
        <ArrowsDownUp size={11} className="shrink-0" />
      )}
    </button>
  );
}

function CitedValue({
  value,
  record,
  refs,
  title
}: {
  value: string;
  record: SourceBackedRecord;
  refs?: number[];
  title?: string;
}) {
  return (
    <div className="cited-value min-w-0 leading-6 text-[var(--text-primary)]">
      <span className="inline-block max-w-full truncate align-bottom" title={title ?? value}>
        {value}
      </span>
      {refs?.length ? " " : null}
      <SourceRefLinks
        record={record}
        refs={refs}
        className="inline-flex items-center gap-0.5 whitespace-nowrap align-super"
      />
    </div>
  );
}

function bestMaxFileMb(host: HostRecord) {
  const values = [
    host.sortMetrics.maxFileGuestMb,
    host.sortMetrics.maxFileAccountMb
  ].filter((value): value is number => typeof value === "number");
  return values.length ? Math.max(...values) : null;
}

function bestStorageMb(host: HostRecord) {
  const values = [
    host.sortMetrics.storageGuestMb,
    host.sortMetrics.storageAccountMb
  ].filter((value): value is number => typeof value === "number");
  return values.length ? Math.max(...values) : null;
}

function bandScore(value: number | null, bands: Array<[number, number]>) {
  if (value === null) return 0;
  return bands.reduce((score, [minimum, points]) => (value >= minimum ? points : score), 0);
}

function freeFirstScore(host: HostRecord) {
  if (host.free_model.value === "free-forever") return 4;
  if (host.free_model.value === "free-trial") return 1;
  if (host.free_model.value === "credit-card-trial") return -1;
  if (host.free_model.value === "paid-only") return -3;
  return 0;
}

function retentionScore(host: HostRecord) {
  const rank = retentionSortRank(host);
  if (rank.kind === "unknown") return 0;
  if (rank.value >= NO_EXPIRY_RETENTION_SORT_VALUE) return 5;
  if (rank.value >= 365) return 4;
  if (rank.value >= 90) return 3;
  if (rank.value >= 30) return 2;
  return 1;
}

function scoreGuidedHost(host: HostRecord, intent: GuidedIntent) {
  let score = freeFirstScore(host);

  if (host.security.https_only) score += 1;
  if (host.sources.length >= 2) score += 1;

  if (intent === "quick") {
    score += host.account.required === false ? 5 : host.account.required === null ? 1 : -2;
    score += host.content.public_sharing?.value === true ? 3 : 0;
    score += bandScore(host.sortMetrics.maxFileGuestMb, [
      [25, 1],
      [100, 2],
      [500, 3],
      [1024, 4]
    ]);
    score += retentionScore(host) >= 2 ? 1 : 0;
  }

  if (intent === "large") {
    score += bandScore(bestMaxFileMb(host), [
      [100, 1],
      [512, 2],
      [1024, 3],
      [5120, 5],
      [10240, 6]
    ]);
    score += bandScore(bestStorageMb(host), [
      [1024, 1],
      [10240, 2],
      [102400, 3]
    ]);
    score += host.content.public_sharing?.value === true ? 1 : 0;
  }

  if (intent === "private") {
    score += host.security.e2ee ? 6 : 0;
    score += host.security.https_only ? 2 : -2;
    score += host.account.required === false ? 1 : 0;
    score += host.content.public_sharing?.value === false ? 1 : 0;
  }

  if (intent === "developer") {
    score += host.developer.api_available ? 6 : -3;
    score += host.developer.cli_friendly ? 3 : 0;
    score += host.security.https_only ? 1 : 0;
    score += retentionScore(host) >= 2 ? 1 : 0;
  }

  if (intent === "durable") {
    score += retentionScore(host) * 2;
    score += bandScore(bestStorageMb(host), [
      [1024, 1],
      [10240, 2],
      [102400, 3]
    ]);
    score += host.account.required === true ? 1 : 0;
    score += host.free_model.value === "free-forever" ? 2 : 0;
  }

  return score;
}

function guidedReasons(host: HostRecord, intent: GuidedIntent) {
  const reasons: string[] = [];

  if (host.free_model.value === "free-forever") reasons.push("Free-first");
  if (host.account.required === false) reasons.push("Guest uploads");
  if (host.content.public_sharing?.value === true) reasons.push("Public sharing");
  if (host.security.e2ee) reasons.push("E2EE");
  if (host.developer.api_available) reasons.push("API");
  if (host.developer.cli_friendly) reasons.push("CLI-friendly");

  if (intent === "large" && bestMaxFileMb(host) !== null) reasons.unshift("Large-file fit");
  if (intent === "durable" && retentionScore(host) >= 3) reasons.unshift("Better retention");
  if (intent === "private" && host.security.https_only) reasons.unshift("HTTPS-only");
  if (intent === "developer" && host.developer.api_available) reasons.unshift("Automation-ready");

  return Array.from(new Set(reasons)).slice(0, 4);
}

function guidedCautions(host: HostRecord, intent: GuidedIntent) {
  const cautions: string[] = [];

  if (host.account.required === true) cautions.push("Account required");
  if (bestMaxFileMb(host) === null) cautions.push("Max file size unclear");
  if (host.sortMetrics.retentionDays === null) cautions.push("Retention unclear");
  if (intent === "private" && !host.security.e2ee) cautions.push("No E2EE claim");
  if (intent === "developer" && !host.developer.api_available) cautions.push("No API listed");
  if (intent === "quick" && host.account.required !== false) cautions.push("May not be a fast guest upload");

  return cautions.slice(0, 3);
}

function GuidedDatasetMode({
  hosts,
  intent,
  onIntentChange,
  onShowSpreadsheet,
  onSelectHost,
  selectedHostId
}: {
  hosts: HostRecord[];
  intent: GuidedIntent;
  onIntentChange: (intent: GuidedIntent) => void;
  onShowSpreadsheet: () => void;
  onSelectHost: (hostId: string) => void;
  selectedHostId: string | null;
}) {
  const intentOptions: Array<{
    id: GuidedIntent;
    label: string;
    helper: string;
    icon: ReactNode;
  }> = [
    {
      id: "quick",
      label: "Quick upload",
      helper: "No-account uploads and easy public sharing.",
      icon: <GlobeHemisphereWest size={16} weight="fill" />
    },
    {
      id: "large",
      label: "Large files",
      helper: "Bigger max file limits and useful storage.",
      icon: <Database size={16} weight="fill" />
    },
    {
      id: "private",
      label: "Private sharing",
      helper: "Encryption and stricter security signals.",
      icon: <ShieldCheck size={16} weight="fill" />
    },
    {
      id: "developer",
      label: "Developer/API",
      helper: "API, CLI, and automation-friendly workflows.",
      icon: <TerminalWindow size={16} weight="fill" />
    },
    {
      id: "durable",
      label: "Long-term storage",
      helper: "Retention and storage matter more than speed.",
      icon: <CheckCircle size={16} weight="fill" />
    }
  ];
  const recommendations = useMemo(() => {
    return hosts
      .map((host) => ({ host, score: scoreGuidedHost(host, intent) }))
      .sort((left, right) => right.score - left.score || left.host.name.localeCompare(right.host.name))
      .slice(0, 8);
  }, [hosts, intent]);
  const topScore = Math.max(...recommendations.map((item) => item.score), 1);

  return (
    <section className="dataset-guided px-3 py-4 md:px-6">
      <div className="mx-auto grid w-full max-w-[1320px] gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="min-w-0">
          <div className="sticky top-20 space-y-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Pick a need
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                Find a host without learning every filter first.
              </h1>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Choose the closest goal. The results use the same verified records as the spreadsheet.
              </p>
            </div>

            <div className="grid gap-2">
              {intentOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onIntentChange(option.id)}
                  className={[
                    "group flex w-full items-start gap-3 rounded-[var(--radius-control)] border p-3 text-left transition-colors",
                    intent === option.id
                      ? "border-[var(--accent)]/35 bg-[var(--accent-soft)] text-[var(--text-primary)]"
                      : "border-[var(--line)] bg-[var(--surface-1)] text-[var(--text-secondary)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
                  ].join(" ")}
                >
                  <span className="mt-0.5 text-[var(--accent)]">{option.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{option.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-[var(--text-muted)]">{option.helper}</span>
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onShowSpreadsheet}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--text-primary)]"
            >
              <Table size={16} weight="fill" />
              Show spreadsheet
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Recommended matches
              </div>
              <div className="mt-1 text-sm text-[var(--text-secondary)]">
                Top {recommendations.length} verified hosts ranked for {intentOptions.find((item) => item.id === intent)?.label.toLowerCase()}.
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {recommendations.map(({ host, score }, index) => (
              <GuidedHostCard
                key={host.id}
                host={host}
                score={score}
                topScore={topScore}
                intent={intent}
                rank={index + 1}
                active={selectedHostId === host.id}
                onSelect={() => onSelectHost(host.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GuidedHostCard({
  host,
  score,
  topScore,
  intent,
  rank,
  active,
  onSelect
}: {
  host: HostRecord;
  score: number;
  topScore: number;
  intent: GuidedIntent;
  rank: number;
  active: boolean;
  onSelect: () => void;
}) {
  const fit = Math.max(2, Math.min(5, Math.round((score / topScore) * 5)));
  const accountMaxField =
    host.limits.max_file_size_account ??
    (host.account.required === true ? host.limits.max_file_size : host.limits.max_file_size_guest);
  const accountStorageField =
    host.limits.storage_account ??
    (host.account.required === true ? host.limits.storage : host.limits.storage_guest);
  const reasons = guidedReasons(host, intent);
  const cautions = guidedCautions(host, intent);

  return (
    <article
      className={[
        "rounded-[var(--radius-panel)] border bg-[var(--surface-1)] p-4 transition-colors",
        active ? "border-[var(--accent)]/45 bg-[var(--accent-soft)]/30" : "border-[var(--line)] hover:border-[var(--line-strong)]"
      ].join(" ")}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-[var(--radius-control)] bg-[var(--bg-elevated)] px-2 py-1 text-xs font-semibold text-[var(--text-muted)]">
              #{rank}
            </span>
            <span className="rounded-[var(--radius-control)] bg-[var(--accent-soft)] px-2 py-1 text-xs font-semibold text-[var(--accent-soft-content)]">
              {fit}/5 fit
            </span>
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--text-primary)]">{host.name}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">{host.summary}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {reasons.map((reason) => (
              <span
                key={reason}
                className="rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--bg)] px-2 py-1 text-xs text-[var(--text-secondary)]"
              >
                {reason}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <a
            href={host.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--text-primary)]"
          >
            <LinkSimple size={15} weight="bold" />
            Visit
          </a>
          <button
            type="button"
            onClick={onSelect}
            className="rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--text-primary)]"
          >
            Details
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 xl:grid-cols-4">
        <GuidedFact label="Account">
          <CitedValue value={host.accountLabel} record={host} refs={host.account.source_refs} />
        </GuidedFact>
        <GuidedFact label="Max file">
          <CitedValue value={host.datasetLabels.maxFileAccountLabel} record={host} refs={accountMaxField?.source_refs} />
        </GuidedFact>
        <GuidedFact label="Retention">
          <CitedValue value={host.filters.retentionLabel} record={host} refs={host.limits.retention.source_refs} />
        </GuidedFact>
        <GuidedFact label="Storage">
          <CitedValue value={host.datasetLabels.storageAccountLabel} record={host} refs={accountStorageField?.source_refs} />
        </GuidedFact>
      </div>

      {cautions.length ? (
        <div className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
          Watch: {cautions.join(" / ")}
        </div>
      ) : null}
    </article>
  );
}

function GuidedFact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--bg)] px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</div>
      <div className="mt-1 min-w-0">{children}</div>
    </div>
  );
}

function hostSortValue(host: HostRecord, key: HostSortKey) {
  switch (key) {
    case "name":
      return host.name.toLowerCase();
    case "free_model":
      return freeModelSortValue(host.free_model.value);
    case "max_guest":
      return host.sortMetrics.maxFileGuestMb;
    case "max_account":
      return host.sortMetrics.maxFileAccountMb;
    case "retention":
      return host.sortMetrics.retentionDays;
    case "storage_guest":
      return host.sortMetrics.storageGuestMb;
    case "storage_account":
      return host.sortMetrics.storageAccountMb;
    case "bandwidth":
      return host.sortMetrics.bandwidthMb;
    case "public_sharing":
      return booleanSortValue(host.content.public_sharing?.value);
    case "allowed_extensions":
      return allowedExtensionLabel(host).toLowerCase();
    case "blocked_extensions":
      return blockedExtensionLabel(host).toLowerCase();
    case "api":
      return host.developer.api_available ? 1 : 0;
    case "cli":
      return host.developer.cli_friendly ? 1 : 0;
    case "e2ee":
      return host.security.e2ee ? 1 : 0;
    case "https":
      return host.security.https_only ? 1 : 0;
    case "tags":
      return host.tags.join(" ").toLowerCase();
    case "sources":
      return host.sources.length;
  }
}

function compareHostSortValues(leftValue: ReturnType<typeof hostSortValue>, rightValue: ReturnType<typeof hostSortValue>) {
  const leftMissing = leftValue === null || leftValue === undefined;
  const rightMissing = rightValue === null || rightValue === undefined;

  if (leftMissing && rightMissing) return 0;
  if (leftMissing) return 1;
  if (rightMissing) return -1;

  return leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
}

function retentionSortRank(host: HostRecord) {
  const metric = host.sortMetrics.retentionDays;
  if (metric === null || metric === undefined) {
    return { kind: "unknown" as const, value: Number.POSITIVE_INFINITY };
  }

  if (metric === UNLIMITED_RETENTION_SORT_VALUE || host.filters.retentionLabel === "Unlimited") {
    return { kind: "unlimited" as const, value: UNLIMITED_RETENTION_SORT_VALUE };
  }

  if (
    metric === NO_EXPIRY_RETENTION_SORT_VALUE ||
    host.filters.retentionLabel === "No automatic expiry"
  ) {
    return { kind: "infinite" as const, value: NO_EXPIRY_RETENTION_SORT_VALUE };
  }

  return { kind: "finite" as const, value: metric };
}

function queueSortValue(candidate: CandidateRecord, key: QueueSortKey) {
  switch (key) {
    case "name":
      return candidate.name.toLowerCase();
    case "free_model":
      return freeModelSortValue(candidate.free_model.value);
    case "max_guest":
      return candidate.sortMetrics.maxFileGuestMb;
    case "max_account":
      return candidate.sortMetrics.maxFileAccountMb;
    case "storage_guest":
      return candidate.sortMetrics.storageGuestMb;
    case "storage_account":
      return candidate.sortMetrics.storageAccountMb;
    case "retention":
      return candidate.sortMetrics.retentionDays;
    case "bandwidth":
      return candidate.sortMetrics.bandwidthMb;
    case "public_sharing":
      return booleanSortValue(candidate.content.public_sharing?.value);
    case "allowed_extensions":
      return allowedExtensionLabel(candidate).toLowerCase();
    case "blocked_extensions":
      return blockedExtensionLabel(candidate).toLowerCase();
    case "api":
      return candidate.developer.api_available ? 1 : 0;
    case "cli":
      return candidate.developer.cli_friendly ? 1 : 0;
    case "e2ee":
      return candidate.security.e2ee ? 1 : 0;
    case "https":
      return candidate.security.https_only ? 1 : 0;
    case "tags":
      return candidate.tags.join(" ").toLowerCase();
    case "sources":
      return candidate.sources.length;
    case "status":
      return candidate.verification_status;
    case "notes":
      return (candidate.reason ?? candidate.summary).toLowerCase();
  }
}

function adjacentQueueSortValue(candidate: AdjacentCandidateRecord, key: AdjacentQueueSortKey) {
  switch (key) {
    case "name":
      return candidate.name.toLowerCase();
    case "kind":
      return adjacentKindLabel(candidate.kind).toLowerCase();
    case "status":
      return candidate.verification_status;
    case "account":
      return candidate.accountLabel;
    case "allowed_extensions":
      return allowedExtensionLabel(candidate).toLowerCase();
    case "blocked_extensions":
      return blockedExtensionLabel(candidate).toLowerCase();
    case "api":
      return candidate.developer.api_available ? 1 : 0;
    case "cli":
      return candidate.developer.cli_friendly ? 1 : 0;
    case "e2ee":
      return candidate.security.e2ee ? 1 : 0;
    case "https":
      return candidate.security.https_only ? 1 : 0;
    case "sources":
      return candidate.sources.length;
    case "notes":
      return (candidate.reason ?? candidate.summary).toLowerCase();
  }
}

function CandidateDetailPanel({ candidate }: { candidate: CandidateRecord | null }) {
  if (!candidate) {
    return (
      <aside className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--panel)] p-5">
        <div className="flex h-full min-h-[18rem] items-center justify-center text-sm text-[var(--text-muted)]">
          Pick a candidate to inspect.
        </div>
      </aside>
    );
  }

  const guestMaxField =
    candidate.limits.max_file_size_guest ??
    (candidate.account.required === false ? candidate.limits.max_file_size : undefined);
  const accountMaxField =
    candidate.limits.max_file_size_account ??
    (candidate.account.required === true
      ? candidate.limits.max_file_size
      : candidate.account.required === false && candidate.limits.max_file_size_guest
        ? candidate.limits.max_file_size_guest
        : undefined);
  const guestStorageField =
    candidate.limits.storage_guest ??
    (candidate.account.required === false ? candidate.limits.storage : undefined);
  const accountStorageField =
    candidate.limits.storage_account ??
    (candidate.account.required === true
      ? candidate.limits.storage
      : candidate.account.required === false && guestStorageField
        ? guestStorageField
        : undefined);

  return (
    <aside className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--panel)] p-5">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-[var(--radius-pill)] bg-[var(--accent)] animate-pulse" style={{ animationDuration: "2s" }} />
              <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">
                Candidate detail
              </div>
              </div>
              <h2 className="mt-2.5 text-xl font-semibold tracking-tight text-[var(--text-primary)]">{candidate.name}</h2>
            </div>
          <div className="flex items-center gap-2">
            {candidate.url ? (
              <a
                href={candidate.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-1)] px-3 py-2 text-[11px] font-semibold text-[var(--text-secondary)] transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-soft-content)]"
              >
                <LinkSimple size={14} weight="bold" />
                <span>Open site</span>
              </a>
            ) : null}
            <span
              className={[
                "inline-flex rounded-[var(--radius-pill)] px-3 py-1 text-[10px] font-medium capitalize backdrop-blur-sm border",
                statusTone(candidate.verification_status)
              ].join(" ")}
            >
              {candidate.verification_status}
            </span>
          </div>
        </div>

        <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-4 text-sm leading-7 text-[var(--text-secondary)] backdrop-blur-sm">
          {candidate.summary}
        </div>

        {candidate.reason ? (
          <div className="rounded-[var(--radius-panel)] border border-[var(--bad)]/20 bg-[var(--bad-soft)]/30 p-4 text-sm leading-7 text-[var(--text-secondary)] backdrop-blur-sm">
            {candidate.reason}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Free model</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.filters.freeModelLabel} <SourceRefLinks record={candidate} refs={candidate.free_model.source_refs} />
            </div>
            <div className="text-xs italic text-[var(--text-muted)]">{candidate.free_model.notes}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Max file (guest)</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.filters.maxFileGuestLabel} <SourceRefLinks record={candidate} refs={guestMaxField?.source_refs} />
            </div>
            <div className="text-xs italic text-[var(--text-muted)]">{guestMaxField?.notes ?? "-"}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Max file (account)</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.filters.maxFileAccountLabel} <SourceRefLinks record={candidate} refs={accountMaxField?.source_refs} />
            </div>
            <div className="text-xs italic text-[var(--text-muted)]">{accountMaxField?.notes ?? "-"}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Storage (guest)</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.filters.storageGuestLabel} <SourceRefLinks record={candidate} refs={guestStorageField?.source_refs} />
            </div>
            <div className="text-xs italic text-[var(--text-muted)]">{guestStorageField?.notes ?? "-"}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Storage (account)</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.filters.storageAccountLabel} <SourceRefLinks record={candidate} refs={accountStorageField?.source_refs} />
            </div>
            <div className="text-xs italic text-[var(--text-muted)]">{accountStorageField?.notes ?? "-"}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Retention</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.filters.retentionLabel} <SourceRefLinks record={candidate} refs={candidate.limits.retention.source_refs} />
            </div>
            <div className="text-xs italic text-[var(--text-muted)]">{candidate.limits.retention.notes}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Bandwidth</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.filters.bandwidthLabel} <SourceRefLinks record={candidate} refs={candidate.limits.bandwidth.source_refs} />
            </div>
            <div className="text-xs italic text-[var(--text-muted)]">{candidate.limits.bandwidth.notes}</div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Account</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.account.benefits} <SourceRefLinks record={candidate} refs={candidate.account.source_refs} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Allowed file types</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.content.allowed_file_types.notes} <SourceRefLinks record={candidate} refs={candidate.content.allowed_file_types.source_refs} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Allowed extensions</div>
            <div className="text-sm text-[var(--text-primary)]">
              {allowedExtensionLabel(candidate)} <SourceRefLinks record={candidate} refs={candidate.content.allowed_file_types.source_refs} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Blocked extensions</div>
            <div className="text-sm text-[var(--text-primary)]">
              {blockedExtensionLabel(candidate)} <SourceRefLinks record={candidate} refs={candidate.content.allowed_file_types.source_refs} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Public sharing</div>
            <div className="text-sm text-[var(--text-primary)]">
              {booleanFieldLabel(candidate.content.public_sharing?.value)}{" "}
              <SourceRefLinks record={candidate} refs={candidate.content.public_sharing?.source_refs} />
            </div>
            <div className="text-xs italic text-[var(--text-muted)]">
              {candidate.content.public_sharing?.notes ?? "Public link or share-page support has not been verified yet."}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Developer</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.developer.api_available ? "API available" : "No public API"}{candidate.developer.cli_friendly ? ", CLI-friendly" : ""} <SourceRefLinks record={candidate} refs={candidate.developer.source_refs} />
            </div>
            <div className="text-xs italic text-[var(--text-muted)]">{candidate.developer.notes}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Security</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.security.e2ee ? "E2EE" : "No E2EE"} <SourceRefLinks record={candidate} refs={candidate.security.source_refs} />
            </div>
            <div className="text-xs italic text-[var(--text-muted)]">{candidate.security.notes}</div>
          </div>
        </div>

        {candidate.sources.length ? (
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Database size={16} weight="fill" />
              Evidence trail
            </div>
            <div className="mt-4 space-y-3">
              {candidate.sources.map((reference, index) => (
                <a
                  key={`${reference.label}-${reference.url}-${index}`}
                  href={reference.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-3 transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--accent-soft)]/50 hover:shadow-[0_0_20px_-4px_var(--accent-glow)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                      <LinkSimple size={16} weight="fill" />
                      <span>[{index + 1}] {reference.label}</span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-mono">{reference.retrieved_at}</div>
                  </div>
                  <div className="mt-2 text-xs text-[var(--text-secondary)]">{reference.notes}</div>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

type CandidateProfileField = {
  value: string | number | boolean | null;
  unit?: string | null;
  notes: string;
  source_refs?: number[];
};

function profileFieldLabel(field: CandidateProfileField) {
  if (field.value === true) return "Yes";
  if (field.value === false) return "No";
  if (typeof field.value === "number") {
    return field.unit ? `${field.value.toLocaleString()} ${field.unit}` : field.value.toLocaleString();
  }
  if (typeof field.value === "string" && field.value.trim()) return field.value;

  const notes = field.notes.toLowerCase();
  if (notes.includes("conditional") || notes.includes("depends") || notes.includes("varies")) return "Conditional";
  if (notes.includes("unlimited")) return "Unlimited";
  return "Not published";
}

function adjacentCandidateProfileRows(candidate: AdjacentCandidateRecord) {
  if (candidate.kind === "alternative") {
    return [
      { label: "Primary use", field: candidate.profile.primary_use },
      { label: "Sharing surface", field: candidate.profile.sharing_surface },
      { label: "Max item", field: candidate.profile.max_file_size },
      { label: "Persistence", field: candidate.profile.persistence_model },
      { label: "Storage model", field: candidate.profile.storage_model },
      { label: "Bandwidth", field: candidate.profile.bandwidth_model }
    ];
  }

  if (candidate.kind === "mirror_uploader") {
    return [
      { label: "Max upload", field: candidate.profile.max_file_size },
      { label: "Guest uploads", field: candidate.profile.guest_uploads },
      { label: "Remote URL", field: candidate.profile.remote_import },
      { label: "Torrent", field: candidate.profile.torrent_import },
      { label: "Stores files", field: candidate.profile.stores_files_itself },
      { label: "Retention", field: candidate.profile.retention_model },
      { label: "Downstream", field: candidate.profile.downstream_dependency }
    ];
  }

  return [
    { label: "Modes", field: candidate.profile.workflow_modes },
    { label: "Execution", field: candidate.profile.execution_model },
    { label: "Item limit", field: candidate.profile.item_limit },
    { label: "Included storage", field: candidate.profile.included_storage },
    { label: "Scheduling", field: candidate.profile.scheduled_runs },
    { label: "Provider dependency", field: candidate.profile.provider_dependency },
    { label: "Bandwidth", field: candidate.profile.bandwidth_model }
  ];
}

function AdjacentCandidateDetailPanel({ candidate }: { candidate: AdjacentCandidateRecord | null }) {
  if (!candidate) {
    return (
      <aside className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--panel)] p-5">
        <div className="flex h-full min-h-[18rem] items-center justify-center text-sm text-[var(--text-muted)]">
          Pick a candidate to inspect.
        </div>
      </aside>
    );
  }

  const profileRows = adjacentCandidateProfileRows(candidate);

  return (
    <aside className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--panel)] p-5">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">
              {adjacentKindLabel(candidate.kind)} candidate
            </div>
            <h2 className="mt-2.5 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
              {candidate.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {candidate.url ? (
              <a
                href={candidate.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-1)] px-3 py-2 text-[11px] font-semibold text-[var(--text-secondary)] transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-soft-content)]"
              >
                <LinkSimple size={14} weight="bold" />
                <span>Open site</span>
              </a>
            ) : null}
            <span
              className={[
                "inline-flex rounded-[var(--radius-pill)] px-3 py-1 text-[10px] font-medium capitalize backdrop-blur-sm border",
                statusTone(candidate.verification_status)
              ].join(" ")}
            >
              {candidate.verification_status}
            </span>
          </div>
        </div>

        <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-4 text-sm leading-7 text-[var(--text-secondary)] backdrop-blur-sm">
          {candidate.summary}
        </div>

        {candidate.reason ? (
          <div className="rounded-[var(--radius-panel)] border border-[var(--bad)]/20 bg-[var(--bad-soft)]/30 p-4 text-sm leading-7 text-[var(--text-secondary)] backdrop-blur-sm">
            {candidate.reason}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {profileRows.map(({ label, field }) => (
            <div key={label} className="space-y-1.5">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">
                {label}
              </div>
              <div className="text-sm text-[var(--text-primary)]">
                {profileFieldLabel(field)} <SourceRefLinks record={candidate} refs={field.source_refs} />
              </div>
              <div className="text-xs italic text-[var(--text-muted)]">{field.notes}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Account</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.account.benefits} <SourceRefLinks record={candidate} refs={candidate.account.source_refs} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Allowed file types</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.content.allowed_file_types.notes}{" "}
              <SourceRefLinks record={candidate} refs={candidate.content.allowed_file_types.source_refs} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Allowed extensions</div>
            <div className="text-sm text-[var(--text-primary)]">
              {allowedExtensionLabel(candidate)}{" "}
              <SourceRefLinks record={candidate} refs={candidate.content.allowed_file_types.source_refs} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Blocked extensions</div>
            <div className="text-sm text-[var(--text-primary)]">
              {blockedExtensionLabel(candidate)}{" "}
              <SourceRefLinks record={candidate} refs={candidate.content.allowed_file_types.source_refs} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Developer</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.developer.api_available ? "API available" : "No public API"}
              {candidate.developer.cli_friendly ? ", CLI-friendly" : ""}{" "}
              <SourceRefLinks record={candidate} refs={candidate.developer.source_refs} />
            </div>
            <div className="text-xs italic text-[var(--text-muted)]">{candidate.developer.notes}</div>
          </div>
        </div>

        {candidate.sources.length ? (
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Database size={16} weight="fill" />
              Evidence trail
            </div>
            <div className="mt-4 space-y-3">
              {candidate.sources.map((reference, index) => (
                <a
                  key={`${reference.label}-${reference.url}-${index}`}
                  href={reference.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-3 transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--accent-soft)]/50 hover:shadow-[0_0_20px_-4px_var(--accent-glow)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                      <LinkSimple size={16} weight="fill" />
                      <span>[{index + 1}] {reference.label}</span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-mono">{reference.retrieved_at}</div>
                  </div>
                  <div className="mt-2 text-xs text-[var(--text-secondary)]">{reference.notes}</div>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function FloatingInspector({
  onClose,
  children
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 top-20 z-40 flex items-start justify-end sm:inset-x-auto sm:right-4 sm:top-28 sm:w-[min(460px,calc(100vw-2rem))] md:right-6 md:top-32 md:bottom-6 md:w-[min(460px,calc(100vw-3rem))]">
      <div className="pointer-events-auto relative max-h-full w-full overflow-auto rounded-[var(--radius-card)] border border-[var(--line)] bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] pt-16 p-4 shadow-[var(--shadow-raised),0_0_0_1px_var(--line)] backdrop-blur-2xl animate-slide-in-right">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-1)] text-[var(--text-muted)] shadow-[var(--shadow-soft)] transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--accent-soft)] hover:text-[var(--text-primary)] hover:shadow-[0_0_16px_-4px_var(--accent-glow)]"
          aria-label="Close inspector"
        >
          <X size={16} weight="bold" />
        </button>
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function MobileHostCard({
  host,
  active,
  onSelect
}: {
  host: HostRecord;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={[
        "w-full rounded-[var(--radius-card)] border p-4 text-left transition-all",
        active
          ? "border-[var(--accent)]/30 bg-[var(--accent-soft)]/40 shadow-[0_0_20px_-8px_var(--accent-glow)]"
          : "border-[var(--line)] bg-[var(--surface-1)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]"
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <a
            href={host.url}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="block truncate text-base font-semibold text-[var(--text-primary)] hover:text-[var(--accent)]"
          >
            {host.name}
          </a>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">{host.summary}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Free model</div>
          <div className="mt-1 text-[var(--text-primary)]">
            <CitedValue value={host.filters.freeModelLabel} record={host} refs={host.free_model.source_refs} />
          </div>
        </div>
        <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Max file</div>
          <div className="mt-1 text-[var(--text-primary)]">
            <CitedValue
              value={host.datasetLabels.maxFileAccountLabel}
              record={host}
              refs={
                (
                  host.limits.max_file_size_account ??
                  (host.account.required === true ? host.limits.max_file_size : host.limits.max_file_size_guest)
                )?.source_refs
              }
            />
          </div>
        </div>
        <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Storage</div>
          <div className="mt-1 text-[var(--text-primary)]">
            <CitedValue
              value={host.datasetLabels.storageAccountLabel}
              record={host}
              refs={
                (
                  host.limits.storage_account ??
                  (host.account.required === true ? host.limits.storage : host.limits.storage_guest)
                )?.source_refs
              }
            />
          </div>
        </div>
        <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Retention</div>
          <div className="mt-1 text-[var(--text-primary)]">
            <CitedValue value={host.filters.retentionLabel} record={host} refs={host.limits.retention.source_refs} />
          </div>
        </div>
        <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">API</div>
          <div className="mt-1 text-[var(--text-primary)]">
            <CitedValue
              value={host.developer.api_available ? "Yes" : "No"}
              record={host}
              refs={host.developer.source_refs}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

function MobileQueueCard({
  candidate,
  active,
  onSelect
}: {
  candidate: CandidateRecord;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={[
        "w-full rounded-[var(--radius-card)] border p-4 text-left transition-all",
        active
          ? "border-[var(--accent)]/30 bg-[var(--accent-soft)]/40 shadow-[0_0_20px_-8px_var(--accent-glow)]"
          : "border-[var(--line)] bg-[var(--surface-1)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]"
      ].join(" ")}
    >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-[var(--text-primary)]">{candidate.name}</div>
            <div className="mt-1 text-sm text-[var(--text-secondary)]">{candidate.summary}</div>
          </div>
          <span
          className={[
            "inline-flex rounded-[var(--radius-pill)] px-2.5 py-1 text-[10px] font-medium capitalize border",
            statusTone(candidate.verification_status)
          ].join(" ")}
        >
          {candidate.verification_status}
        </span>
      </div>
        <div className="mt-4 grid gap-2 text-sm text-[var(--text-secondary)]">
          <div>
            <span className="mr-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Free model</span>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue
                value={candidate.filters.freeModelLabel}
                record={candidate}
                refs={candidate.free_model.source_refs}
              />
            </div>
          </div>
          <div>
            <span className="mr-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Retention</span>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue
                value={candidate.filters.retentionLabel}
                record={candidate}
                refs={candidate.limits.retention.source_refs}
              />
            </div>
          </div>
          <div className="line-clamp-3">
            <span className="mr-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Why</span>
            <span>{candidate.reason ?? candidate.summary}</span>
          </div>
        </div>
      </button>
  );
}

function MobileAdjacentQueueCard({
  candidate,
  active,
  onSelect
}: {
  candidate: AdjacentCandidateRecord;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={[
        "w-full rounded-[var(--radius-card)] border p-4 text-left transition-all",
        active
          ? "border-[var(--accent)]/30 bg-[var(--accent-soft)]/40 shadow-[0_0_20px_-8px_var(--accent-glow)]"
          : "border-[var(--line)] bg-[var(--surface-1)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]"
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-[var(--text-primary)]">{candidate.name}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {adjacentKindLabel(candidate.kind)}
          </div>
          <div className="mt-2 line-clamp-2 text-sm text-[var(--text-secondary)]">{candidate.summary}</div>
        </div>
        <span
          className={[
            "inline-flex rounded-[var(--radius-pill)] px-2.5 py-1 text-[10px] font-medium capitalize border",
            statusTone(candidate.verification_status)
          ].join(" ")}
        >
          {candidate.verification_status}
        </span>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-[var(--text-secondary)]">
        <div>
          <span className="mr-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Account</span>
          <span className="text-[var(--text-primary)]">{candidate.accountLabel}</span>
        </div>
        <div className="line-clamp-3">
          <span className="mr-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Why</span>
          <span>{candidate.reason ?? candidate.summary}</span>
        </div>
      </div>
    </button>
  );
}

function MobileAdjacentCard({
  record,
  active,
  onSelect
}: {
  record: AdjacentRecord;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={[
        "w-full rounded-[var(--radius-card)] border p-4 text-left transition-all",
        active
          ? "border-[var(--accent)]/30 bg-[var(--accent-soft)]/40 shadow-[0_0_20px_-8px_var(--accent-glow)]"
          : "border-[var(--line)] bg-[var(--surface-1)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)]"
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <a
            href={record.url}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="block truncate text-base font-semibold text-[var(--text-primary)] hover:text-[var(--accent)]"
          >
            {record.name}
          </a>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">{record.summary}</p>
        </div>
      </div>

      {record.kind === "alternative" ? (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Method</div>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue value={record.labels.primaryUse} record={record} refs={record.profile.primary_use.source_refs} />
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Max item</div>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue
                value={record.labels.maxFileSize}
                record={record}
                refs={record.profile.max_file_size.source_refs}
              />
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Persistence</div>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue
                value={record.labels.persistenceModel}
                record={record}
                refs={record.profile.persistence_model.source_refs}
              />
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">API</div>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue
                value={record.developer.api_available ? "Yes" : "No"}
                record={record}
                refs={record.developer.source_refs}
              />
            </div>
          </div>
        </div>
      ) : null}

      {record.kind === "mirror_uploader" ? (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Max upload</div>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue
                value={record.labels.maxFileSize}
                record={record}
                refs={record.profile.max_file_size.source_refs}
              />
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Guest</div>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue
                value={record.labels.guestUploads}
                record={record}
                refs={record.profile.guest_uploads.source_refs}
              />
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Remote URL</div>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue
                value={record.labels.remoteImport}
                record={record}
                refs={record.profile.remote_import.source_refs}
              />
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Stores files</div>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue
                value={record.labels.storesFilesItself}
                record={record}
                refs={record.profile.stores_files_itself.source_refs}
              />
            </div>
          </div>
        </div>
      ) : null}

      {record.kind === "cloud_migration" ? (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Modes</div>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue
                value={record.labels.workflowModes}
                record={record}
                refs={record.profile.workflow_modes.source_refs}
              />
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Item limit</div>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue
                value={record.labels.itemLimit}
                record={record}
                refs={record.profile.item_limit.source_refs}
              />
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Included storage</div>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue
                value={record.labels.includedStorage}
                record={record}
                refs={record.profile.included_storage.source_refs}
              />
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Schedule</div>
            <div className="mt-1 text-[var(--text-primary)]">
              <CitedValue
                value={record.labels.scheduledRuns}
                record={record}
                refs={record.profile.scheduled_runs.source_refs}
              />
            </div>
          </div>
        </div>
      ) : null}
    </button>
  );
}

export function DatasetApp({ data, initialViewMode, initialViewModeFromUrl }: Props) {
  const [viewMode, setViewMode] = useState<DatasetViewMode>(initialViewMode);
  const [viewModeReady, setViewModeReady] = useState(initialViewModeFromUrl);
  const [mode, setMode] = useState<DatasetMode>("hosts");
  const [queueOpen, setQueueOpen] = useState(false);
  const [hostSort, setHostSort] = useState<SortState<HostSortKey>>({
    key: "name",
    direction: "asc"
  });
  const [adjacentSort, setAdjacentSort] = useState<SortState<AdjacentSortKey>>({
    key: "name",
    direction: "asc"
  });
  const [queueSort, setQueueSort] = useState<SortState<QueueSortKey>>({
    key: "name",
    direction: "asc"
  });
  const [adjacentQueueSort, setAdjacentQueueSort] = useState<SortState<AdjacentQueueSortKey>>({
    key: "name",
    direction: "asc"
  });
  const [search, setSearch] = useState("");
  const [apiOnly, setApiOnly] = useState(false);
  const [guestOnly, setGuestOnly] = useState(false);
  const [e2eeOnly, setE2eeOnly] = useState(false);
  const [queueStatus, setQueueStatus] = useState<"all" | CandidateRecord["verification_status"]>("all");
  const [hiddenHostColumns, setHiddenHostColumns] = useState<string[]>([]);
  const [hiddenAdjacentColumns, setHiddenAdjacentColumns] = useState<string[]>([]);
  const [hiddenQueueColumns, setHiddenQueueColumns] = useState<string[]>([]);
  const [hiddenAdjacentQueueColumns, setHiddenAdjacentQueueColumns] = useState<string[]>([]);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [guidedIntent, setGuidedIntent] = useState<GuidedIntent>("quick");
  const isSimpleMode = viewMode === "simple";
  const isGuidedMode = viewMode === "guided";
  const isPlainDatasetMode = isSimpleMode || isGuidedMode;

  useEffect(() => {
    let savedMode: DatasetViewMode | null = null;
    try {
      savedMode = initialViewModeFromUrl
        ? null
        : normalizeDatasetViewMode(localStorage.getItem(DATASET_VIEW_MODE_STORAGE_KEY));
    } catch {}
    setViewMode(savedMode ?? initialViewMode);
    setViewModeReady(true);
  }, [initialViewMode, initialViewModeFromUrl]);

  useEffect(() => {
    if (!viewModeReady) return;

    try {
      localStorage.setItem(DATASET_VIEW_MODE_STORAGE_KEY, viewMode);
      document.documentElement.setAttribute("data-dataset-mode", viewMode);

      const url = new URL(window.location.href);
      if (viewMode === "simple" || viewMode === "guided") {
        url.searchParams.set("mode", viewMode);
      } else {
        url.searchParams.delete("mode");
      }
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    } catch {
      document.documentElement.setAttribute("data-dataset-mode", viewMode);
    }

    return () => {
      if (document.documentElement.getAttribute("data-dataset-mode") === viewMode) {
        document.documentElement.removeAttribute("data-dataset-mode");
      }
    };
  }, [viewMode, viewModeReady]);

  const adjacentCollections: Record<Exclude<ServiceMode, "hosts">, AdjacentRecord[]> = {
    alternatives: data.alternatives,
    mirrors: data.mirrorUploaders,
    migration: data.cloudMigration
  };
  const adjacentCandidateCollections: Record<Exclude<ServiceMode, "hosts">, AdjacentCandidateRecord[]> = {
    alternatives: data.alternativeCandidates,
    mirrors: data.mirrorUploaderCandidates,
    migration: data.cloudMigrationCandidates
  };
  const adjacentColumnDefsByMode: Record<Exclude<ServiceMode, "hosts">, AdjacentColumn<any>[]> = {
    alternatives: alternativeColumnDefs,
    mirrors: mirrorColumnDefs,
    migration: migrationColumnDefs
  };
  const isQueueMode = queueOpen;
  const isAdjacentMode = mode === "alternatives" || mode === "mirrors" || mode === "migration";
  const currentHostRows = mode === "hosts" && !isQueueMode ? data.hosts : [];
  const currentAdjacentRows =
    mode === "alternatives"
      ? adjacentCollections.alternatives
      : mode === "mirrors"
        ? adjacentCollections.mirrors
        : mode === "migration"
          ? adjacentCollections.migration
          : [];
  const currentAdjacentColumns =
    mode === "alternatives"
      ? adjacentColumnDefsByMode.alternatives
      : mode === "mirrors"
        ? adjacentColumnDefsByMode.mirrors
        : mode === "migration"
          ? adjacentColumnDefsByMode.migration
          : [];
  const currentAdjacentCandidateRows =
    mode === "alternatives"
      ? adjacentCandidateCollections.alternatives
      : mode === "mirrors"
        ? adjacentCandidateCollections.mirrors
        : mode === "migration"
          ? adjacentCandidateCollections.migration
          : [];
  const currentSearchPlaceholder: Record<DatasetMode, string> = {
    hosts: isQueueMode ? "Search host candidate, source, or reason..." : "Search host, tag, or limit...",
    alternatives: isQueueMode ? "Search sharing candidate, source, or reason..." : "Search service, tag, or behavior...",
    mirrors: isQueueMode ? "Search mirror candidate, source, or reason..." : "Search mirror, host coverage, or capability...",
    migration: isQueueMode ? "Search migration candidate, provider, or reason..." : "Search migration tool, provider, or workflow..."
  };

  const visibleHostColumns = hostColumnDefs.filter((column) => !hiddenHostColumns.includes(column.id));
  const visibleAdjacentColumns = currentAdjacentColumns.filter(
    (column) => !hiddenAdjacentColumns.includes(column.id)
  );
  const visibleQueueColumns = queueColumnDefs.filter((column) => !hiddenQueueColumns.includes(column.id));
  const visibleAdjacentQueueColumns = adjacentQueueColumnDefs.filter(
    (column) => !hiddenAdjacentQueueColumns.includes(column.id)
  );
  const hostGridTemplate = gridTemplate(visibleHostColumns);
  const adjacentGridTemplate = gridTemplate(visibleAdjacentColumns);
  const queueGridTemplate = gridTemplate(visibleQueueColumns);
  const adjacentQueueGridTemplate = gridTemplate(visibleAdjacentQueueColumns);
  const maxGuestColumnIndex = visibleHostColumns.findIndex((column) => column.id === "max_guest");
  const maxAccountColumnIndex = visibleHostColumns.findIndex((column) => column.id === "max_account");
  const storageGuestColumnIndex = visibleHostColumns.findIndex((column) => column.id === "storage_guest");
  const storageAccountColumnIndex = visibleHostColumns.findIndex((column) => column.id === "storage_account");
  const showGroupedMaxHeader =
    maxGuestColumnIndex !== -1 && maxAccountColumnIndex === maxGuestColumnIndex + 1;
  const showGroupedStorageHeader =
    storageGuestColumnIndex !== -1 && storageAccountColumnIndex === storageGuestColumnIndex + 1;
  const queueMaxGuestColumnIndex = visibleQueueColumns.findIndex((column) => column.id === "max_guest");
  const queueMaxAccountColumnIndex = visibleQueueColumns.findIndex((column) => column.id === "max_account");
  const queueStorageGuestColumnIndex = visibleQueueColumns.findIndex((column) => column.id === "storage_guest");
  const queueStorageAccountColumnIndex = visibleQueueColumns.findIndex((column) => column.id === "storage_account");
  const showGroupedQueueMaxHeader =
    queueMaxGuestColumnIndex !== -1 && queueMaxAccountColumnIndex === queueMaxGuestColumnIndex + 1;
  const showGroupedQueueStorageHeader =
    queueStorageGuestColumnIndex !== -1 &&
    queueStorageAccountColumnIndex === queueStorageGuestColumnIndex + 1;

  const filteredHosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = currentHostRows.filter((host) => {
      const haystack = [
        host.name,
        host.summary,
        host.tags.join(" "),
        host.filters.freeModelLabel,
        host.free_model.notes,
        host.datasetLabels.maxFileGuestLabel,
        host.datasetLabels.maxFileAccountLabel,
        host.filters.retentionLabel,
        host.datasetLabels.storageGuestLabel,
        host.datasetLabels.storageAccountLabel,
        host.filters.bandwidthLabel,
        allowedExtensionLabel(host),
        blockedExtensionLabel(host),
        host.content.allowed_file_types.allowed_extensions.join(" "),
        host.content.allowed_file_types.blocked_extensions.join(" "),
        booleanFieldLabel(host.content.public_sharing?.value)
      ]
        .join(" ")
        .toLowerCase();

      return (
        (query === "" || haystack.includes(query)) &&
        (!apiOnly || host.developer.api_available) &&
        (!guestOnly || host.account.required === false) &&
        (!e2eeOnly || host.security.e2ee)
      );
    });

    return [...rows].sort((left, right) => {
      if (hostSort.key === "retention") {
        const leftRank = retentionSortRank(left);
        const rightRank = retentionSortRank(right);

        if (leftRank.kind === "unknown" && rightRank.kind === "unknown") return 0;
        if (leftRank.kind === "unknown") return 1;
        if (rightRank.kind === "unknown") return -1;

        const comparison =
          leftRank.value < rightRank.value ? -1 : leftRank.value > rightRank.value ? 1 : 0;
        return hostSort.direction === "asc" ? comparison : comparison * -1;
      }

      const leftValue = hostSortValue(left, hostSort.key);
      const rightValue = hostSortValue(right, hostSort.key);
      const leftMissing = leftValue === null || leftValue === undefined;
      const rightMissing = rightValue === null || rightValue === undefined;

      if (leftMissing && rightMissing) return 0;
      if (leftMissing) return 1;
      if (rightMissing) return -1;

      const comparison = compareHostSortValues(leftValue, rightValue);
      return hostSort.direction === "asc" ? comparison : comparison * -1;
    });
  }, [apiOnly, currentHostRows, e2eeOnly, guestOnly, hostSort, search]);

  const filteredAdjacentRows = useMemo(() => {
    if (!isAdjacentMode) {
      return [];
    }

    const query = search.trim().toLowerCase();
    const rows = currentAdjacentRows.filter((record) => {
      return (
        (query === "" || record.searchText.includes(query)) &&
        (!apiOnly || record.developer.api_available) &&
        (!guestOnly || record.account.required === false) &&
        (!e2eeOnly || record.security.e2ee)
      );
    });

    return [...rows].sort((left, right) => {
      const sortColumn =
        currentAdjacentColumns.find((column) => column.id === adjacentSort.key) ??
        currentAdjacentColumns[0];
      const leftValue = sortColumn?.sortValue ? sortColumn.sortValue(left as never) : left.name.toLowerCase();
      const rightValue =
        sortColumn?.sortValue ? sortColumn.sortValue(right as never) : right.name.toLowerCase();
      const leftMissing = leftValue === null || leftValue === undefined;
      const rightMissing = rightValue === null || rightValue === undefined;

      if (leftMissing && rightMissing) return 0;
      if (leftMissing) return 1;
      if (rightMissing) return -1;

      const comparison = leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
      return adjacentSort.direction === "asc" ? comparison : comparison * -1;
    });
  }, [
    adjacentSort,
    apiOnly,
    currentAdjacentColumns,
    currentAdjacentRows,
    e2eeOnly,
    guestOnly,
    isAdjacentMode,
    search
  ]);

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = data.candidates.filter((candidate) => {
      const haystack = [
        candidate.name,
        candidate.summary,
        candidate.reason ?? "",
        candidate.tags.join(" "),
        candidate.filters.freeModelLabel,
        candidate.free_model.notes,
        candidate.filters.maxFileGuestLabel,
        candidate.filters.maxFileAccountLabel,
        candidate.filters.retentionLabel,
        candidate.datasetLabels.storageGuestLabel,
        candidate.datasetLabels.storageAccountLabel,
        candidate.filters.bandwidthLabel,
        allowedExtensionLabel(candidate),
        blockedExtensionLabel(candidate),
        candidate.content.allowed_file_types.allowed_extensions.join(" "),
        candidate.content.allowed_file_types.blocked_extensions.join(" "),
        booleanFieldLabel(candidate.content.public_sharing?.value)
      ]
        .join(" ")
        .toLowerCase();

      return (
        (query === "" || haystack.includes(query)) &&
        (queueStatus === "all" || candidate.verification_status === queueStatus)
      );
    });

    return [...rows].sort((left, right) => {
      const leftValue = queueSortValue(left, queueSort.key);
      const rightValue = queueSortValue(right, queueSort.key);

      if (queueSort.key === "retention") {
        const leftRank = retentionSortRank(left as HostRecord);
        const rightRank = retentionSortRank(right as HostRecord);

        if (leftRank.kind === "unknown" && rightRank.kind === "unknown") return 0;
        if (leftRank.kind === "unknown") return 1;
        if (rightRank.kind === "unknown") return -1;
        const comparison = leftRank.value - rightRank.value;
        return queueSort.direction === "asc" ? comparison : comparison * -1;
      }

      const leftMissing = leftValue === null || leftValue === undefined;
      const rightMissing = rightValue === null || rightValue === undefined;
      if (leftMissing && rightMissing) return 0;
      if (leftMissing) return 1;
      if (rightMissing) return -1;

      const comparison = leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
      return queueSort.direction === "asc" ? comparison : comparison * -1;
    });
  }, [data.candidates, queueSort, queueStatus, search]);

  const filteredAdjacentCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = currentAdjacentCandidateRows.filter((candidate) => {
      return (
        (query === "" || candidate.searchText.includes(query)) &&
        (queueStatus === "all" || candidate.verification_status === queueStatus)
      );
    });

    return [...rows].sort((left, right) => {
      const leftValue = adjacentQueueSortValue(left, adjacentQueueSort.key);
      const rightValue = adjacentQueueSortValue(right, adjacentQueueSort.key);
      const leftMissing = leftValue === null || leftValue === undefined;
      const rightMissing = rightValue === null || rightValue === undefined;

      if (leftMissing && rightMissing) return 0;
      if (leftMissing) return 1;
      if (rightMissing) return -1;

      const comparison = leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
      return adjacentQueueSort.direction === "asc" ? comparison : comparison * -1;
    });
  }, [adjacentQueueSort, currentAdjacentCandidateRows, queueStatus, search]);

  const selectedHost =
    selectedHostId === null
      ? null
      : isGuidedMode
        ? data.hosts.find((host) => host.id === selectedHostId) ?? null
        : filteredHosts.find((host) => host.id === selectedHostId) ?? null;
  const selectedAdjacent =
    selectedHostId === null
      ? null
      : filteredAdjacentRows.find((record) => record.id === selectedHostId) ?? null;
  const selectedCandidate =
    selectedCandidateId === null
      ? null
      : filteredCandidates.find((candidate) => candidate.id === selectedCandidateId) ?? null;
  const selectedAdjacentCandidate =
    selectedCandidateId === null
      ? null
      : filteredAdjacentCandidates.find((candidate) => candidate.id === selectedCandidateId) ?? null;

  function toggleHostColumn(id: string) {
    setHiddenHostColumns((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function toggleAdjacentColumn(id: string) {
    setHiddenAdjacentColumns((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function toggleAdjacentQueueColumn(id: string) {
    setHiddenAdjacentQueueColumns((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function toggleQueueColumn(id: string) {
    setHiddenQueueColumns((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function changeHostSort(key: HostSortKey) {
    setHostSort((current) => {
      if (current.key !== key) return { key, direction: "asc" };
      return { key, direction: current.direction === "asc" ? "desc" : "asc" };
    });
  }

  function changeAdjacentSort(key: AdjacentSortKey) {
    setAdjacentSort((current) => {
      if (current.key !== key) return { key, direction: "asc" };
      return { key, direction: current.direction === "asc" ? "desc" : "asc" };
    });
  }

  function changeQueueSort(key: QueueSortKey) {
    setQueueSort((current) => {
      if (current.key !== key) return { key, direction: "asc" };
      return { key, direction: current.direction === "asc" ? "desc" : "asc" };
    });
  }

  function changeAdjacentQueueSort(key: AdjacentQueueSortKey) {
    setAdjacentQueueSort((current) => {
      if (current.key !== key) return { key, direction: "asc" };
      return { key, direction: current.direction === "asc" ? "desc" : "asc" };
    });
  }

  function selectMode(nextMode: DatasetMode) {
    setMode(nextMode);
    setQueueOpen(false);
    setSelectedHostId(null);
    setSelectedCandidateId(null);
  }

  function changeViewMode(nextMode: DatasetViewMode) {
    setViewMode(nextMode);
    setViewModeReady(true);
    if (nextMode === "guided") {
      setMode("hosts");
      setQueueOpen(false);
      setSelectedCandidateId(null);
    }
  }

  const renderViewModeToggle = (className = "") => (
    <DatasetViewModeToggle mode={viewMode} onChange={changeViewMode} className={className} />
  );
  const tableHeaderClass = [
    "dataset-table-header border-b border-[var(--line)] bg-[var(--bg-elevated)]",
    isSimpleMode ? "" : "shadow-[var(--shadow-soft)] backdrop-blur-xl"
  ].join(" ");
  const headerCellClass = ({
    isSorted,
    sticky = false,
    grouped = false,
    flex = false
  }: {
    isSorted: boolean;
    sticky?: boolean;
    grouped?: boolean;
    flex?: boolean;
  }) =>
    [
      "dataset-header-cell min-w-0 overflow-hidden text-left uppercase transition-colors whitespace-nowrap",
      flex ? "flex items-center" : "",
      isSimpleMode
        ? grouped
          ? "px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em]"
          : "px-3 py-2 text-[11px] font-semibold tracking-[0.12em]"
        : grouped
          ? "px-4 py-3 text-[11px] font-bold tracking-[0.25em]"
          : "px-4 py-4 text-xs font-bold tracking-[0.3em]",
      sticky ? "sticky left-0 z-20 bg-[var(--bg-elevated)]" : "",
      isSorted ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
    ].join(" ");
  const groupHeaderCellClass = [
    "dataset-group-header-cell flex items-center justify-center border-x border-b border-[var(--line)]/60 text-center uppercase text-[var(--text-muted)]",
    isSimpleMode
      ? "px-3 py-1 text-[10px] font-semibold tracking-[0.12em]"
      : "px-4 py-2 text-[11px] font-bold tracking-[0.3em]"
  ].join(" ");
  const rowButtonClass = (active: boolean, index: number) =>
    [
      "dataset-row group relative grid w-full cursor-pointer border-b border-[var(--line)]/50 text-left",
      isSimpleMode ? "transition-colors duration-100" : "transition-all duration-200 row-enter",
      isSimpleMode ? (index % 2 === 0 ? "dataset-row-even" : "dataset-row-odd") : "",
      active
        ? "dataset-row-active bg-[var(--accent-soft)]/50 hover:bg-[var(--accent-soft)]/70"
        : isSimpleMode
          ? "hover:bg-[var(--surface-1)]"
          : "hover:-translate-x-0.5 hover:bg-[var(--surface-2)]"
    ].join(" ");
  const rowAccentClass = [
    "dataset-row-accent absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[var(--accent)] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100",
    isSimpleMode ? "hidden" : ""
  ].join(" ");
  const rowCellClass = (active: boolean, sticky = false) =>
    [
      "dataset-row-cell align-top text-[var(--text-primary)] transition-colors",
      isSimpleMode ? "px-3 py-1.5 text-[13px] leading-5" : "px-3 py-2.5",
      active ? "bg-[var(--accent-soft)]/20" : "",
      sticky ? "sticky left-0 z-10 bg-[var(--bg-elevated)]" : ""
    ].join(" ");
  const statusBadgeClass = (status: CandidateRecord["verification_status"]) =>
    [
      "dataset-status-badge inline-flex font-medium capitalize border",
      isSimpleMode
        ? "rounded-[var(--radius-control)] px-2 py-0.5 text-[10px]"
        : "rounded-[var(--radius-pill)] px-2.5 py-1 text-[10px] backdrop-blur-sm",
      statusTone(status)
    ].join(" ");

  return (
    <AppFrame current="dataset" actions={renderViewModeToggle()}>
      <div
        className={[
          "min-h-0 flex-1",
          isPlainDatasetMode ? "dataset-simple px-0 py-0" : "px-4 py-6 md:px-6"
        ].join(" ")}
      >
        <section className="min-h-0 overflow-visible bg-transparent">
          <div
            className={[
              "relative z-20 flex flex-col border-b border-[var(--line)]",
              isPlainDatasetMode ? "gap-2 bg-[var(--bg)] px-3 py-2" : "gap-4 p-4"
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3 lg:hidden">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                View
              </div>
              {renderViewModeToggle("shrink-0")}
            </div>

            {!isPlainDatasetMode ? (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <div className="h-[16px] w-[3px] rounded-[var(--radius-pill)] bg-gradient-to-b from-[var(--accent)] to-[var(--accent-glow)]" />
                  <div className="text-[9px] uppercase tracking-[0.4em] text-[var(--text-muted)] font-semibold">
                    Dataset view
                  </div>
                </div>
                <h1 className="mt-2.5 text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl">
                  Scan, compare, and explore the full dataset with precision.
                </h1>
              </div>
              
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                {[
                  {
                    label: "Rows",
                    value: isQueueMode
                      ? mode === "hosts"
                        ? filteredCandidates.length
                        : filteredAdjacentCandidates.length
                      : isAdjacentMode
                        ? filteredAdjacentRows.length
                        : filteredHosts.length
                  },
                  {
                    label: "Visible cols",
                    value: isQueueMode
                      ? mode === "hosts"
                        ? visibleQueueColumns.length
                        : visibleAdjacentQueueColumns.length
                      : isAdjacentMode
                        ? visibleAdjacentColumns.length
                        : visibleHostColumns.length
                  },
                  {
                    label: "Sort",
                    value: isQueueMode
                      ? mode === "hosts"
                        ? `${queueSort.key} - ${sortDirectionLabel(queueSort.direction)}`
                        : `${adjacentQueueSort.key} - ${sortDirectionLabel(adjacentQueueSort.direction)}`
                      : isAdjacentMode
                        ? `${adjacentSort.key} - ${sortDirectionLabel(adjacentSort.direction)}`
                        : `${hostSort.key} - ${sortDirectionLabel(hostSort.direction)}`
                  }
                ].map((stat, i) => (
                  <div 
                    key={stat.label} 
                    className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface-1)] px-3.5 py-2.5 backdrop-blur-sm transition-all hover:border-[var(--line-strong)] hover:bg-[var(--surface-3)] animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-medium">
                      {stat.label}
                    </div>
                    <div className="mt-1.5 text-xl font-semibold text-[var(--text-primary)] tracking-tight">
                      {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            ) : null}

            {!isGuidedMode ? (
            <>
            <div
              className={[
                "flex flex-col xl:flex-row xl:items-center xl:justify-between",
                isSimpleMode ? "gap-2" : "gap-3"
              ].join(" ")}
            >
              <div className="flex flex-wrap items-center gap-2">
                <ToolbarButton active={mode === "hosts"} onClick={() => selectMode("hosts")}>
                  Verified hosts
                </ToolbarButton>
                <ToolbarButton active={mode === "alternatives"} onClick={() => selectMode("alternatives")}>
                  Other ways to share
                </ToolbarButton>
                <ToolbarButton active={mode === "mirrors"} onClick={() => selectMode("mirrors")}>
                  Mirror uploaders
                </ToolbarButton>
                <ToolbarButton active={mode === "migration"} onClick={() => selectMode("migration")}>
                  Cloud migration
                </ToolbarButton>
                <ToolbarButton
                  active={queueOpen}
                  onClick={() => {
                    setQueueOpen((value) => !value);
                    setSelectedHostId(null);
                    setSelectedCandidateId(null);
                  }}
                >
                  {serviceModeLabel(mode)} review queue
                </ToolbarButton>
              </div>

              <div
                className={[
                  "relative flex min-w-0 w-full flex-1 items-center gap-3 border border-[var(--line)] bg-[var(--surface-1)] xl:max-w-[28rem]",
                  isSimpleMode
                    ? "rounded-[var(--radius-control)] px-3 py-1.5"
                    : "rounded-[var(--radius-card)] px-4 py-2.5 shadow-sm"
                ].join(" ")}
              >
                <MagnifyingGlass size={18} className="text-[var(--text-muted)]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={
                    currentSearchPlaceholder[mode]
                  }
                  className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-subtle)]"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="rounded-[var(--radius-pill)] p-1 text-[var(--text-muted)] transition hover:bg-[var(--surface-4)] hover:text-[var(--text-primary)]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {mode === "mirrors" && data.stats.mirrorUploaderCandidates > 0 ? (
              <div className="text-sm text-[var(--text-secondary)]">
                Mirror-uploader candidates are parked in <code>data/mirror_uploaders_candidates.json</code> until we
                verify them.
              </div>
            ) : null}

            {mode === "migration" && data.stats.cloudMigrationCandidates > 0 ? (
              <div className="text-sm text-[var(--text-secondary)]">
                Cloud-migration candidates are parked in <code>data/cloud_migration_candidates.json</code> until we
                verify them.
              </div>
            ) : null}

            {!isQueueMode ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  <ToolbarButton active={apiOnly} onClick={() => setApiOnly((value) => !value)}>
                    <TerminalWindow size={16} />
                    API only
                  </ToolbarButton>
                  <ToolbarButton active={guestOnly} onClick={() => setGuestOnly((value) => !value)}>
                    <GlobeHemisphereWest size={16} />
                    Guest uploads
                  </ToolbarButton>
                  <ToolbarButton active={e2eeOnly} onClick={() => setE2eeOnly((value) => !value)}>
                    <ShieldCheck size={16} />
                    E2EE only
                  </ToolbarButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(isAdjacentMode ? currentAdjacentColumns : hostColumnDefs).map((column) => {
                    const hidden = isAdjacentMode
                      ? hiddenAdjacentColumns.includes(column.id)
                      : hiddenHostColumns.includes(column.id);
                    return (
                      <button
                        key={column.id}
                        onClick={() =>
                          isAdjacentMode ? toggleAdjacentColumn(column.id) : toggleHostColumn(column.id)
                        }
                        className={[
                          "dataset-column-chip group relative inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200",
                          hidden
                            ? "border-[var(--line)] bg-transparent text-[var(--text-muted)] hover:border-[var(--text-muted)]/40 hover:text-[var(--text-secondary)]"
                            : "border-[var(--accent)]/20 bg-[var(--accent-soft)] text-[var(--accent-soft-content)]"
                        ].join(" ")}
                      >
                        {hidden ? <EyeSlash size={13} /> : <Eye size={13} />}
                        <span>{column.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  <ToolbarButton active={queueStatus === "all"} onClick={() => setQueueStatus("all")}>
                    <Funnel size={16} />
                    All
                  </ToolbarButton>
                  <ToolbarButton
                    active={queueStatus === "pending"}
                    onClick={() => setQueueStatus("pending")}
                  >
                    Pending
                  </ToolbarButton>
                  <ToolbarButton
                    active={queueStatus === "verified"}
                    onClick={() => setQueueStatus("verified")}
                  >
                    <CheckCircle size={16} />
                    Verified
                  </ToolbarButton>
                  <ToolbarButton
                    active={queueStatus === "rejected"}
                    onClick={() => setQueueStatus("rejected")}
                  >
                    <XCircle size={16} />
                    Rejected
                  </ToolbarButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(mode === "hosts" ? queueColumnDefs : adjacentQueueColumnDefs).map((column) => {
                    const hidden =
                      mode === "hosts"
                        ? hiddenQueueColumns.includes(column.id)
                        : hiddenAdjacentQueueColumns.includes(column.id);
                    return (
                      <button
                        key={column.id}
                        onClick={() =>
                          mode === "hosts"
                            ? toggleQueueColumn(column.id)
                            : toggleAdjacentQueueColumn(column.id)
                        }
                        className={[
                          "dataset-column-chip group relative inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200",
                          hidden
                            ? "border-[var(--line)] bg-transparent text-[var(--text-muted)] hover:border-[var(--text-muted)]/40 hover:text-[var(--text-secondary)]"
                            : "border-[var(--accent)]/20 bg-[var(--accent-soft)] text-[var(--accent-soft-content)]"
                        ].join(" ")}
                      >
                        {hidden ? <EyeSlash size={13} /> : <Eye size={13} />}
                        <span>{column.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            </>
            ) : null}
          </div>

          {isGuidedMode ? (
            <GuidedDatasetMode
              hosts={data.hosts}
              intent={guidedIntent}
              onIntentChange={setGuidedIntent}
              onShowSpreadsheet={() => changeViewMode("simple")}
              onSelectHost={setSelectedHostId}
              selectedHostId={selectedHostId}
            />
          ) : (
          <div className={isSimpleMode ? "relative z-0 pb-0" : "relative z-0 -mx-4 pb-2 md:mx-0"}>
            {!isQueueMode && mode === "hosts" ? (
              <>
                <SpreadsheetScroller>
                <div className={tableHeaderClass}>
                  {showGroupedMaxHeader || showGroupedStorageHeader ? (
                    <div
                      className="grid"
                      style={{ gridTemplateColumns: hostGridTemplate, gridTemplateRows: "auto auto" }}
                    >
                      {visibleHostColumns.map((column, index) => {
                        if (
                          (showGroupedMaxHeader && (column.id === "max_guest" || column.id === "max_account")) ||
                          (showGroupedStorageHeader && (column.id === "storage_guest" || column.id === "storage_account"))
                        ) {
                          return null;
                        }

                        const isSorted = hostSort.key === column.id;

                        return (
                          <div
                            key={column.id}
                            style={{ gridColumn: String(index + 1), gridRow: "1 / span 2" }}
                            className={headerCellClass({
                              isSorted,
                              sticky: column.id === "name",
                              flex: true
                            })}
                          >
                            <SortHeaderButton
                              direction={hostSort.direction}
                              isSorted={isSorted}
                              label={hostHeaderLabel(column)}
                              onClick={() => changeHostSort(column.id)}
                            />
                          </div>
                        );
                      })}

                      {showGroupedMaxHeader ? (
                        <div
                          style={{ gridColumn: `${maxGuestColumnIndex + 1} / span 2`, gridRow: "1" }}
                          className={groupHeaderCellClass}
                        >
                          Max file size
                        </div>
                      ) : null}

                      {showGroupedStorageHeader ? (
                        <div
                          style={{ gridColumn: `${storageGuestColumnIndex + 1} / span 2`, gridRow: "1" }}
                          className={groupHeaderCellClass}
                        >
                          Storage
                        </div>
                      ) : null}

                      {visibleHostColumns
                        .filter(
                          (column) =>
                            (showGroupedMaxHeader && (column.id === "max_guest" || column.id === "max_account")) ||
                            (showGroupedStorageHeader &&
                              (column.id === "storage_guest" || column.id === "storage_account"))
                        )
                        .map((column) => {
                          const isSorted = hostSort.key === column.id;
                          const columnIndex = visibleHostColumns.findIndex((item) => item.id === column.id);

                          return (
                            <div
                              key={column.id}
                              style={{ gridColumn: String(columnIndex + 1), gridRow: "2" }}
                              className={headerCellClass({ isSorted, grouped: true })}
                            >
                              <SortHeaderButton
                                direction={hostSort.direction}
                                isSorted={isSorted}
                                label={hostHeaderLabel(column)}
                                onClick={() => changeHostSort(column.id)}
                              />
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div
                      className="grid"
                      style={{ gridTemplateColumns: hostGridTemplate }}
                    >
                      {visibleHostColumns.map((column) => {
                        const isSorted = hostSort.key === column.id;
                        return (
                          <div
                            key={column.id}
                            className={headerCellClass({ isSorted, sticky: column.id === "name" })}
                          >
                            <SortHeaderButton
                              direction={hostSort.direction}
                              isSorted={isSorted}
                              label={hostHeaderLabel(column)}
                              onClick={() => changeHostSort(column.id)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {filteredHosts.map((host, index) => (
                  <button
                    key={host.id}
                    onClick={() => setSelectedHostId(host.id)}
                    className={rowButtonClass(selectedHostId === host.id, index)}
                    style={{ 
                      gridTemplateColumns: hostGridTemplate,
                      animationDelay: `${Math.min(index * 0.012, 0.5)}s`
                    }}
                  >
                    <div className={rowAccentClass} />
                    {visibleHostColumns.map((column) => (
                      <div
                        key={`${host.id}-${column.id}`}
                        className={rowCellClass(selectedHostId === host.id, column.id === "name")}
                      >
                        {column.render(host)}
                      </div>
                    ))}
                  </button>
                ))}
                </SpreadsheetScroller>
              </>
            ) : !isQueueMode && isAdjacentMode ? (
              <>
                <SpreadsheetScroller>
                  <div className={tableHeaderClass}>
                    <div className="grid" style={{ gridTemplateColumns: adjacentGridTemplate }}>
                      {visibleAdjacentColumns.map((column) => {
                        const isSorted = adjacentSort.key === column.id;
                        return (
                          <div
                            key={column.id}
                            className={headerCellClass({ isSorted, sticky: column.id === "name" })}
                          >
                            <SortHeaderButton
                              direction={adjacentSort.direction}
                              isSorted={isSorted}
                              label={column.label}
                              onClick={() => changeAdjacentSort(column.id)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {filteredAdjacentRows.map((record, index) => (
                    <button
                      key={record.id}
                      onClick={() => setSelectedHostId(record.id)}
                      className={rowButtonClass(selectedHostId === record.id, index)}
                      style={{
                        gridTemplateColumns: adjacentGridTemplate,
                        animationDelay: `${Math.min(index * 0.012, 0.5)}s`
                      }}
                    >
                      <div className={rowAccentClass} />
                      {visibleAdjacentColumns.map((column) => (
                        <div
                          key={`${record.id}-${column.id}`}
                          className={rowCellClass(selectedHostId === record.id, column.id === "name")}
                        >
                          {column.render(record as never)}
                        </div>
                      ))}
                    </button>
                  ))}
                </SpreadsheetScroller>
              </>
            ) : mode === "hosts" ? (
              <>
                <SpreadsheetScroller>
                <div className={tableHeaderClass}>
                  {showGroupedQueueMaxHeader || showGroupedQueueStorageHeader ? (
                    <div
                      className="grid"
                      style={{ gridTemplateColumns: queueGridTemplate, gridTemplateRows: "auto auto" }}
                    >
                      {visibleQueueColumns.map((column, index) => {
                        if (
                          (showGroupedQueueMaxHeader && (column.id === "max_guest" || column.id === "max_account")) ||
                          (showGroupedQueueStorageHeader &&
                            (column.id === "storage_guest" || column.id === "storage_account"))
                        ) {
                          return null;
                        }

                        const isSorted = queueSort.key === column.id;

                        return (
                          <div
                            key={column.id}
                            style={{ gridColumn: String(index + 1), gridRow: "1 / span 2" }}
                            className={headerCellClass({
                              isSorted,
                              sticky: column.id === "name",
                              flex: true
                            })}
                          >
                            <SortHeaderButton
                              direction={queueSort.direction}
                              isSorted={isSorted}
                              label={queueHeaderLabel(column)}
                              onClick={() => changeQueueSort(column.id)}
                            />
                          </div>
                        );
                      })}

                      {showGroupedQueueMaxHeader ? (
                        <div
                          style={{ gridColumn: `${queueMaxGuestColumnIndex + 1} / span 2`, gridRow: "1" }}
                          className={groupHeaderCellClass}
                        >
                          Max file size
                        </div>
                      ) : null}

                      {showGroupedQueueStorageHeader ? (
                        <div
                          style={{ gridColumn: `${queueStorageGuestColumnIndex + 1} / span 2`, gridRow: "1" }}
                          className={groupHeaderCellClass}
                        >
                          Storage
                        </div>
                      ) : null}

                      {visibleQueueColumns
                        .filter(
                          (column) =>
                            (showGroupedQueueMaxHeader &&
                              (column.id === "max_guest" || column.id === "max_account")) ||
                            (showGroupedQueueStorageHeader &&
                              (column.id === "storage_guest" || column.id === "storage_account"))
                        )
                        .map((column) => {
                          const isSorted = queueSort.key === column.id;
                          const columnIndex = visibleQueueColumns.findIndex((item) => item.id === column.id);

                          return (
                            <div
                              key={column.id}
                              style={{ gridColumn: String(columnIndex + 1), gridRow: "2" }}
                              className={headerCellClass({ isSorted, grouped: true })}
                            >
                              <SortHeaderButton
                                direction={queueSort.direction}
                                isSorted={isSorted}
                                label={queueHeaderLabel(column)}
                                onClick={() => changeQueueSort(column.id)}
                              />
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div
                      className="grid"
                      style={{ gridTemplateColumns: queueGridTemplate }}
                    >
                      {visibleQueueColumns.map((column) => {
                        const isSorted = queueSort.key === column.id;
                        return (
                          <div
                            key={column.id}
                            className={headerCellClass({ isSorted, sticky: column.id === "name" })}
                          >
                            <SortHeaderButton
                              direction={queueSort.direction}
                              isSorted={isSorted}
                              label={queueHeaderLabel(column)}
                              onClick={() => changeQueueSort(column.id)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {filteredCandidates.map((candidate, index) => (
                  <button
                    key={candidate.id}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    className={rowButtonClass(selectedCandidateId === candidate.id, index)}
                    style={{ 
                      gridTemplateColumns: queueGridTemplate,
                      animationDelay: `${Math.min(index * 0.012, 0.5)}s`
                    }}
                  >
                    <div className={rowAccentClass} />
                    {visibleQueueColumns.map((column) => (
                      <div
                        key={`${candidate.id}-${column.id}`}
                        className={rowCellClass(selectedCandidateId === candidate.id, column.id === "name")}
                      >
                        {column.id === "status" ? (
                          <span className={statusBadgeClass(candidate.verification_status)}>
                            {candidate.verification_status}
                          </span>
                        ) : (
                          column.render(candidate)
                        )}
                      </div>
                    ))}
                  </button>
                ))}
                </SpreadsheetScroller>
              </>
            ) : (
              <>
                <SpreadsheetScroller>
                  <div className={tableHeaderClass}>
                    <div className="grid" style={{ gridTemplateColumns: adjacentQueueGridTemplate }}>
                      {visibleAdjacentQueueColumns.map((column) => {
                        const isSorted = adjacentQueueSort.key === column.id;
                        return (
                          <div
                            key={column.id}
                            className={headerCellClass({ isSorted, sticky: column.id === "name" })}
                          >
                            <SortHeaderButton
                              direction={adjacentQueueSort.direction}
                              isSorted={isSorted}
                              label={column.label}
                              onClick={() => changeAdjacentQueueSort(column.id)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {filteredAdjacentCandidates.map((candidate, index) => (
                    <button
                      key={candidate.id}
                      onClick={() => setSelectedCandidateId(candidate.id)}
                      className={rowButtonClass(selectedCandidateId === candidate.id, index)}
                      style={{
                        gridTemplateColumns: adjacentQueueGridTemplate,
                        animationDelay: `${Math.min(index * 0.012, 0.5)}s`
                      }}
                    >
                      <div className={rowAccentClass} />
                      {visibleAdjacentQueueColumns.map((column) => (
                        <div
                          key={`${candidate.id}-${column.id}`}
                          className={rowCellClass(selectedCandidateId === candidate.id, column.id === "name")}
                        >
                          {column.id === "status" ? (
                            <span className={statusBadgeClass(candidate.verification_status)}>
                              {candidate.verification_status}
                            </span>
                          ) : (
                            column.render(candidate)
                          )}
                        </div>
                      ))}
                    </button>
                  ))}
                </SpreadsheetScroller>
              </>
            )}
          </div>
          )}
        </section>

      </div>
      {mode === "hosts" && !isQueueMode && selectedHost ? (
        <FloatingInspector onClose={() => setSelectedHostId(null)}>
          <HostDetailPanel host={selectedHost} />
        </FloatingInspector>
      ) : null}
      {isAdjacentMode && !isQueueMode && selectedAdjacent ? (
        <FloatingInspector onClose={() => setSelectedHostId(null)}>
          <AdjacentDetailPanel record={selectedAdjacent} />
        </FloatingInspector>
      ) : null}
      {mode === "hosts" && isQueueMode && selectedCandidate ? (
        <FloatingInspector onClose={() => setSelectedCandidateId(null)}>
          <CandidateDetailPanel candidate={selectedCandidate} />
        </FloatingInspector>
      ) : null}
      {isAdjacentMode && isQueueMode && selectedAdjacentCandidate ? (
        <FloatingInspector onClose={() => setSelectedCandidateId(null)}>
          <AdjacentCandidateDetailPanel candidate={selectedAdjacentCandidate} />
        </FloatingInspector>
      ) : null}
    </AppFrame>
  );
}
