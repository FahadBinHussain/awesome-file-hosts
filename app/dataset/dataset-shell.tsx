"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
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
};

const NO_EXPIRY_RETENTION_SORT_VALUE = 9_999_999;

type ServiceMode = "hosts" | "alternatives" | "mirrors" | "migration";
type DatasetMode = ServiceMode;
type HostSortKey =
  | "name"
  | "max_guest"
  | "max_account"
  | "storage_guest"
  | "storage_account"
  | "retention"
  | "bandwidth"
  | "public_sharing"
  | "api"
  | "cli"
  | "e2ee"
  | "https"
  | "sources";
type QueueSortKey =
  | "name"
  | "max_guest"
  | "max_account"
  | "storage_guest"
  | "storage_account"
  | "retention"
  | "bandwidth"
  | "public_sharing"
  | "api"
  | "cli"
  | "e2ee"
  | "https"
  | "sources"
  | "status";
type AdjacentQueueSortKey =
  | "name"
  | "kind"
  | "status"
  | "account"
  | "api"
  | "cli"
  | "e2ee"
  | "https"
  | "sources";

type SortState<T extends string> = {
  key: T;
  direction: "asc" | "desc";
};

type HostColumn = {
  id: string;
  label: string;
  width: string;
  className?: string;
  render: (host: HostRecord) => ReactNode;
};

type QueueColumn = {
  id: string;
  label: string;
  width: string;
  className?: string;
  render: (candidate: CandidateRecord) => ReactNode;
};

type AdjacentQueueColumn = {
  id: AdjacentQueueSortKey | "notes";
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
    id: "public_sharing",
    label: "Public share",
    width: "118px",
    render: (host) => (
      <CitedValue
        value={booleanFieldLabel(host.content.public_sharing?.value)}
        record={host}
        refs={host.content.public_sharing?.source_refs}
      />
    )
  },
  {
    id: "bandwidth",
    label: "Bandwidth",
    width: "134px",
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
  { id: "sources", label: "Sources", width: "68px", render: (host) => String(host.sources.length) }
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
    width: "134px",
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
    id: "public_sharing",
    label: "Public share",
    width: "118px",
    render: (candidate) => (
      <CitedValue
        value={booleanFieldLabel(candidate.content.public_sharing?.value)}
        record={candidate}
        refs={candidate.content.public_sharing?.source_refs}
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
    width: "68px",
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
    width: "68px",
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
        "group relative inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3.5 py-2 text-xs font-medium transition-all duration-200",
        active
          ? "border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent-content)] shadow-[0_0_24px_-6px_var(--accent-glow)]"
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

function gridTemplate(columns: Array<{ width: string }>) {
  return columns.map((column) => column.width).join(" ");
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

function CitedValue({
  value,
  record,
  refs
}: {
  value: string;
  record: SourceBackedRecord;
  refs?: number[];
}) {
  return (
    <div className="min-w-0 leading-6 text-[var(--text-primary)]">
      <span>{value}</span>
      {refs?.length ? " " : null}
      <SourceRefLinks
        record={record}
        refs={refs}
        className="inline-flex items-center gap-0.5 whitespace-nowrap align-super"
      />
    </div>
  );
}

function hostSortValue(host: HostRecord, key: HostSortKey) {
  switch (key) {
    case "name":
      return host.name.toLowerCase();
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
    case "api":
      return host.developer.api_available ? 1 : 0;
    case "cli":
      return host.developer.cli_friendly ? 1 : 0;
    case "e2ee":
      return host.security.e2ee ? 1 : 0;
    case "https":
      return host.security.https_only ? 1 : 0;
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
    case "status":
      return candidate.verification_status;
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
                className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-1)] px-3 py-2 text-[11px] font-semibold text-[var(--text-secondary)] transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-content)]"
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
                className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-1)] px-3 py-2 text-[11px] font-semibold text-[var(--text-secondary)] transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-content)]"
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

export function DatasetApp({ data }: Props) {
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
        host.datasetLabels.maxFileGuestLabel,
        host.datasetLabels.maxFileAccountLabel,
        host.filters.retentionLabel,
        host.datasetLabels.storageGuestLabel,
        host.datasetLabels.storageAccountLabel,
        host.filters.bandwidthLabel,
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

        if (leftRank.kind === "infinite" && rightRank.kind === "finite") {
          return hostSort.direction === "asc" ? 1 : -1;
        }

        if (leftRank.kind === "finite" && rightRank.kind === "infinite") {
          return hostSort.direction === "asc" ? -1 : 1;
        }

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
        candidate.filters.maxFileGuestLabel,
        candidate.filters.maxFileAccountLabel,
        candidate.filters.retentionLabel,
        candidate.datasetLabels.storageGuestLabel,
        candidate.datasetLabels.storageAccountLabel,
        candidate.filters.bandwidthLabel,
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
        if (leftRank.kind === "infinite" && rightRank.kind === "finite") {
          return queueSort.direction === "asc" ? 1 : -1;
        }
        if (leftRank.kind === "finite" && rightRank.kind === "infinite") {
          return queueSort.direction === "asc" ? -1 : 1;
        }
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

  return (
    <AppFrame current="dataset">
      <div className="min-h-0 flex-1 px-4 py-6 md:px-6">
        <section className="min-h-0 overflow-visible bg-transparent">
          <div className="relative z-20 flex flex-col gap-4 border-b border-[var(--line)] p-4">
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

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-2">
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

              <div className="relative flex min-w-0 w-full flex-1 items-center gap-3 rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-2.5 shadow-sm xl:max-w-[28rem]">
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
                          "group relative inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200",
                          hidden
                            ? "border-[var(--line)] bg-transparent text-[var(--text-muted)] hover:border-[var(--text-muted)]/40 hover:text-[var(--text-secondary)]"
                            : "border-[var(--accent)]/20 bg-[var(--accent-soft)] text-[var(--accent-content)]"
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
                          "group relative inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200",
                          hidden
                            ? "border-[var(--line)] bg-transparent text-[var(--text-muted)] hover:border-[var(--text-muted)]/40 hover:text-[var(--text-secondary)]"
                            : "border-[var(--accent)]/20 bg-[var(--accent-soft)] text-[var(--accent-content)]"
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
          </div>

          <div className="relative z-0">
            {!isQueueMode && mode === "hosts" ? (
              <>
                <div className="grid gap-3 md:hidden">
                  {filteredHosts.map((host) => (
                    <MobileHostCard
                      key={host.id}
                      host={host}
                      active={selectedHostId === host.id}
                      onSelect={() => setSelectedHostId(host.id)}
                    />
                  ))}
                </div>
                <div className="hidden min-w-max text-sm md:block">
                <div className="sticky top-16 z-30 border-b border-[var(--line)] bg-[var(--bg-elevated)] shadow-[var(--shadow-soft)] backdrop-blur-xl">
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

                        const sortable = column.id !== "tags";
                        const isSorted = hostSort.key === column.id;

                        return (
                          <div
                            key={column.id}
                            style={{ gridColumn: String(index + 1), gridRow: "1 / span 2" }}
                            className={[
                              "flex items-center px-4 py-4 text-left text-xs uppercase tracking-[0.3em] font-bold transition-colors whitespace-nowrap",
                              column.id === "name" ? "sticky left-0 z-20 bg-[var(--bg-elevated)]" : "",
                              isSorted ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                            ].join(" ")}
                          >
                            {sortable ? (
                              <button
                                onClick={() => changeHostSort(column.id as HostSortKey)}
                                className="inline-flex items-center gap-1.5 transition-all hover:opacity-80"
                              >
                                {hostHeaderLabel(column)}
                                {isSorted ? (
                                  <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--accent-soft)] text-[11px]">
                                    {hostSort.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                ) : (
                                  <ArrowsDownUp size={11} />
                                )}
                              </button>
                            ) : (
                              hostHeaderLabel(column)
                            )}
                          </div>
                        );
                      })}

                      {showGroupedMaxHeader ? (
                        <div
                          style={{ gridColumn: `${maxGuestColumnIndex + 1} / span 2`, gridRow: "1" }}
                          className="flex items-center justify-center border-x border-b border-[var(--line)]/60 px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]"
                        >
                          Max file size
                        </div>
                      ) : null}

                      {showGroupedStorageHeader ? (
                        <div
                          style={{ gridColumn: `${storageGuestColumnIndex + 1} / span 2`, gridRow: "1" }}
                          className="flex items-center justify-center border-x border-b border-[var(--line)]/60 px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]"
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
                              className={[
                                "px-4 py-3 text-left text-[11px] uppercase tracking-[0.25em] font-bold transition-colors whitespace-nowrap",
                                isSorted ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                              ].join(" ")}
                            >
                              <button
                                onClick={() => changeHostSort(column.id as HostSortKey)}
                                className="inline-flex items-center gap-1.5 transition-all hover:opacity-80"
                              >
                                {hostHeaderLabel(column)}
                                {isSorted ? (
                                  <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--accent-soft)] text-[11px]">
                                    {hostSort.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                ) : (
                                  <ArrowsDownUp size={11} />
                                )}
                              </button>
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
                        const sortable = column.id !== "tags";
                        const isSorted = hostSort.key === column.id;
                        return (
                          <div
                            key={column.id}
                            className={[
                              "px-4 py-4 text-left text-xs uppercase tracking-[0.3em] font-bold transition-colors whitespace-nowrap",
                              column.id === "name" ? "sticky left-0 z-20 bg-[var(--bg-elevated)]" : "",
                              isSorted ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                            ].join(" ")}
                          >
                            {sortable ? (
                              <button
                                onClick={() => changeHostSort(column.id as HostSortKey)}
                                className="inline-flex items-center gap-1.5 transition-all hover:opacity-80"
                              >
                                {hostHeaderLabel(column)}
                                {isSorted ? (
                                  <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--accent-soft)] text-[11px]">
                                    {hostSort.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                ) : (
                                  <ArrowsDownUp size={11} />
                                )}
                              </button>
                            ) : (
                              hostHeaderLabel(column)
                            )}
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
                    className={[
                      "group relative grid w-full cursor-pointer border-b border-[var(--line)]/50 text-left transition-all duration-200 row-enter",
                      selectedHostId === host.id
                        ? "bg-[var(--accent-soft)]/50 hover:bg-[var(--accent-soft)]/70"
                        : "hover:-translate-x-0.5 hover:bg-[var(--surface-2)]"
                    ].join(" ")}
                    style={{ 
                      gridTemplateColumns: hostGridTemplate,
                      animationDelay: `${Math.min(index * 0.012, 0.5)}s`
                    }}
                  >
                    <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[var(--accent)] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    {visibleHostColumns.map((column) => (
                      <div
                        key={`${host.id}-${column.id}`}
                        className={[
                          "px-3 py-2.5 align-top text-[var(--text-primary)] transition-colors",
                          selectedHostId === host.id ? "bg-[var(--accent-soft)]/20" : "",
                          column.id === "name" ? "sticky left-0 z-10 bg-[var(--bg-elevated)]" : ""
                        ].join(" ")}
                      >
                        {column.render(host)}
                      </div>
                    ))}
                  </button>
                ))}
                </div>
              </>
            ) : !isQueueMode && isAdjacentMode ? (
              <>
                <div className="grid gap-3 md:hidden">
                  {filteredAdjacentRows.map((record) => (
                    <MobileAdjacentCard
                      key={record.id}
                      record={record}
                      active={selectedHostId === record.id}
                      onSelect={() => setSelectedHostId(record.id)}
                    />
                  ))}
                </div>
                <div className="hidden min-w-max text-sm md:block">
                  <div className="sticky top-16 z-30 border-b border-[var(--line)] bg-[var(--bg-elevated)] shadow-[var(--shadow-soft)] backdrop-blur-xl">
                    <div className="grid" style={{ gridTemplateColumns: adjacentGridTemplate }}>
                      {visibleAdjacentColumns.map((column) => {
                        const isSorted = adjacentSort.key === column.id;
                        return (
                          <div
                            key={column.id}
                            className={[
                              "px-4 py-4 text-left text-xs uppercase tracking-[0.3em] font-bold transition-colors whitespace-nowrap",
                              column.id === "name" ? "sticky left-0 z-20 bg-[var(--bg-elevated)]" : "",
                              isSorted ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                            ].join(" ")}
                          >
                            <button
                              onClick={() => changeAdjacentSort(column.id)}
                              className="inline-flex items-center gap-1.5 transition-all hover:opacity-80"
                            >
                              {column.label}
                              {isSorted ? (
                                <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--accent-soft)] text-[11px]">
                                  {adjacentSort.direction === "asc" ? "↑" : "↓"}
                                </span>
                              ) : (
                                <ArrowsDownUp size={11} />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {filteredAdjacentRows.map((record, index) => (
                    <button
                      key={record.id}
                      onClick={() => setSelectedHostId(record.id)}
                      className={[
                        "group relative grid w-full cursor-pointer border-b border-[var(--line)]/50 text-left transition-all duration-200 row-enter",
                        selectedHostId === record.id
                          ? "bg-[var(--accent-soft)]/50 hover:bg-[var(--accent-soft)]/70"
                          : "hover:-translate-x-0.5 hover:bg-[var(--surface-2)]"
                      ].join(" ")}
                      style={{
                        gridTemplateColumns: adjacentGridTemplate,
                        animationDelay: `${Math.min(index * 0.012, 0.5)}s`
                      }}
                    >
                      <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[var(--accent)] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      {visibleAdjacentColumns.map((column) => (
                        <div
                          key={`${record.id}-${column.id}`}
                          className={[
                            "px-3 py-2.5 align-top text-[var(--text-primary)] transition-colors",
                            selectedHostId === record.id ? "bg-[var(--accent-soft)]/20" : "",
                            column.id === "name" ? "sticky left-0 z-10 bg-[var(--bg-elevated)]" : ""
                          ].join(" ")}
                        >
                          {column.render(record as never)}
                        </div>
                      ))}
                    </button>
                  ))}
                </div>
              </>
            ) : mode === "hosts" ? (
              <>
                <div className="grid gap-3 md:hidden">
                  {filteredCandidates.map((candidate) => (
                    <MobileQueueCard
                      key={candidate.id}
                      candidate={candidate}
                      active={selectedCandidateId === candidate.id}
                      onSelect={() => setSelectedCandidateId(candidate.id)}
                    />
                  ))}
                </div>
                <div className="hidden min-w-max text-sm md:block">
                <div className="sticky top-16 z-10 border-b border-[var(--line)] bg-[var(--bg-elevated)] shadow-[var(--shadow-soft)] backdrop-blur-xl">
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

                        const sortable = column.id !== "notes" && column.id !== "tags";
                        const isSorted = queueSort.key === column.id;

                        return (
                          <div
                            key={column.id}
                            style={{ gridColumn: String(index + 1), gridRow: "1 / span 2" }}
                            className={[
                              "flex items-center px-4 py-4 text-left text-xs uppercase tracking-[0.3em] font-bold transition-colors whitespace-nowrap",
                              column.id === "name" ? "sticky left-0 z-20 bg-[var(--bg-elevated)]" : "",
                              isSorted ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                            ].join(" ")}
                          >
                            {sortable ? (
                              <button
                                onClick={() => changeQueueSort(column.id as QueueSortKey)}
                                className="inline-flex items-center gap-1.5 transition-all hover:opacity-80"
                              >
                                {queueHeaderLabel(column)}
                                {isSorted ? (
                                  <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--accent-soft)] text-[11px]">
                                    {queueSort.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                ) : (
                                  <ArrowsDownUp size={11} />
                                )}
                              </button>
                            ) : (
                              queueHeaderLabel(column)
                            )}
                          </div>
                        );
                      })}

                      {showGroupedQueueMaxHeader ? (
                        <div
                          style={{ gridColumn: `${queueMaxGuestColumnIndex + 1} / span 2`, gridRow: "1" }}
                          className="flex items-center justify-center border-x border-b border-[var(--line)]/60 px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]"
                        >
                          Max file size
                        </div>
                      ) : null}

                      {showGroupedQueueStorageHeader ? (
                        <div
                          style={{ gridColumn: `${queueStorageGuestColumnIndex + 1} / span 2`, gridRow: "1" }}
                          className="flex items-center justify-center border-x border-b border-[var(--line)]/60 px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]"
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
                              className={[
                                "px-4 py-3 text-left text-[11px] uppercase tracking-[0.25em] font-bold transition-colors whitespace-nowrap",
                                isSorted ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                              ].join(" ")}
                            >
                              <button
                                onClick={() => changeQueueSort(column.id as QueueSortKey)}
                                className="inline-flex items-center gap-1.5 transition-all hover:opacity-80"
                              >
                                {queueHeaderLabel(column)}
                                {isSorted ? (
                                  <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--accent-soft)] text-[11px]">
                                    {queueSort.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                ) : (
                                  <ArrowsDownUp size={11} />
                                )}
                              </button>
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
                        const sortable = column.id !== "notes" && column.id !== "tags";
                        const isSorted = queueSort.key === column.id;
                        return (
                          <div
                            key={column.id}
                            className={[
                              "px-4 py-4 text-left text-xs uppercase tracking-[0.3em] font-bold transition-colors whitespace-nowrap",
                              column.id === "name" ? "sticky left-0 z-20 bg-[var(--bg-elevated)]" : "",
                              isSorted ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                            ].join(" ")}
                          >
                            {sortable ? (
                              <button
                                onClick={() => changeQueueSort(column.id as QueueSortKey)}
                                className="inline-flex items-center gap-1.5 transition-all hover:opacity-80"
                              >
                                {queueHeaderLabel(column)}
                                {isSorted ? (
                                  <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--accent-soft)] text-[11px]">
                                    {queueSort.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                ) : (
                                  <ArrowsDownUp size={11} />
                                )}
                              </button>
                            ) : (
                              queueHeaderLabel(column)
                            )}
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
                    className={[
                      "group relative grid w-full cursor-pointer border-b border-[var(--line)]/50 text-left transition-all duration-200 row-enter",
                      selectedCandidateId === candidate.id
                        ? "bg-[var(--accent-soft)]/50 hover:bg-[var(--accent-soft)]/70"
                        : "hover:-translate-x-0.5 hover:bg-[var(--surface-2)]"
                    ].join(" ")}
                    style={{ 
                      gridTemplateColumns: queueGridTemplate,
                      animationDelay: `${Math.min(index * 0.012, 0.5)}s`
                    }}
                  >
                    <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[var(--accent)] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    {visibleQueueColumns.map((column) => (
                      <div
                        key={`${candidate.id}-${column.id}`}
                        className={[
                          "px-3 py-2.5 align-top text-[var(--text-primary)] transition-colors",
                          selectedCandidateId === candidate.id ? "bg-[var(--accent-soft)]/20" : "",
                          column.id === "name" ? "sticky left-0 z-10 bg-[var(--bg-elevated)]" : ""
                        ].join(" ")}
                      >
                        {column.id === "status" ? (
                          <span
                            className={[
                              "inline-flex rounded-[var(--radius-pill)] px-2.5 py-1 text-[10px] font-medium capitalize backdrop-blur-sm border",
                              statusTone(candidate.verification_status)
                            ].join(" ")}
                          >
                            {candidate.verification_status}
                          </span>
                        ) : (
                          column.render(candidate)
                        )}
                      </div>
                    ))}
                  </button>
                ))}
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-3 md:hidden">
                  {filteredAdjacentCandidates.map((candidate) => (
                    <MobileAdjacentQueueCard
                      key={candidate.id}
                      candidate={candidate}
                      active={selectedCandidateId === candidate.id}
                      onSelect={() => setSelectedCandidateId(candidate.id)}
                    />
                  ))}
                </div>
                <div className="hidden min-w-max text-sm md:block">
                  <div className="sticky top-16 z-10 border-b border-[var(--line)] bg-[var(--bg-elevated)] shadow-[var(--shadow-soft)] backdrop-blur-xl">
                    <div className="grid" style={{ gridTemplateColumns: adjacentQueueGridTemplate }}>
                      {visibleAdjacentQueueColumns.map((column) => {
                        const sortable = column.id !== "notes";
                        const isSorted = adjacentQueueSort.key === column.id;
                        return (
                          <div
                            key={column.id}
                            className={[
                              "px-4 py-4 text-left text-xs uppercase tracking-[0.3em] font-bold transition-colors whitespace-nowrap",
                              column.id === "name" ? "sticky left-0 z-20 bg-[var(--bg-elevated)]" : "",
                              isSorted ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                            ].join(" ")}
                          >
                            {sortable ? (
                              <button
                                onClick={() => changeAdjacentQueueSort(column.id as AdjacentQueueSortKey)}
                                className="inline-flex items-center gap-1.5 transition-all hover:opacity-80"
                              >
                                {column.label}
                                {isSorted ? (
                                  <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--accent-soft)] text-[11px]">
                                    {adjacentQueueSort.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                ) : (
                                  <ArrowsDownUp size={11} />
                                )}
                              </button>
                            ) : (
                              column.label
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {filteredAdjacentCandidates.map((candidate, index) => (
                    <button
                      key={candidate.id}
                      onClick={() => setSelectedCandidateId(candidate.id)}
                      className={[
                        "group relative grid w-full cursor-pointer border-b border-[var(--line)]/50 text-left transition-all duration-200 row-enter",
                        selectedCandidateId === candidate.id
                          ? "bg-[var(--accent-soft)]/50 hover:bg-[var(--accent-soft)]/70"
                          : "hover:-translate-x-0.5 hover:bg-[var(--surface-2)]"
                      ].join(" ")}
                      style={{
                        gridTemplateColumns: adjacentQueueGridTemplate,
                        animationDelay: `${Math.min(index * 0.012, 0.5)}s`
                      }}
                    >
                      <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[var(--accent)] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      {visibleAdjacentQueueColumns.map((column) => (
                        <div
                          key={`${candidate.id}-${column.id}`}
                          className={[
                            "px-3 py-2.5 align-top text-[var(--text-primary)] transition-colors",
                            selectedCandidateId === candidate.id ? "bg-[var(--accent-soft)]/20" : "",
                            column.id === "name" ? "sticky left-0 z-10 bg-[var(--bg-elevated)]" : ""
                          ].join(" ")}
                        >
                          {column.id === "status" ? (
                            <span
                              className={[
                                "inline-flex rounded-[var(--radius-pill)] px-2.5 py-1 text-[10px] font-medium capitalize backdrop-blur-sm border",
                                statusTone(candidate.verification_status)
                              ].join(" ")}
                            >
                              {candidate.verification_status}
                            </span>
                          ) : (
                            column.render(candidate)
                          )}
                        </div>
                      ))}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
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
