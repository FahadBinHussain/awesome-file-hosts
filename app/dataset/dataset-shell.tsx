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
import { HostDetailPanel } from "@/components/host-detail-panel";
import { SourceRefLinks } from "@/components/source-ref-links";
import type { CandidateRecord, HostRecord, SiteData } from "@/lib/site-data";

type Props = {
  data: SiteData;
};

type DatasetMode = "hosts" | "queue";
type HostSortKey =
  | "name"
  | "max"
  | "retention"
  | "storage"
  | "bandwidth"
  | "account"
  | "api"
  | "cli"
  | "e2ee"
  | "https"
  | "sources";
type QueueSortKey =
  | "name"
  | "type"
  | "free_volume"
  | "shelf_life"
  | "download_count"
  | "languages"
  | "applications"
  | "status";

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

const hostColumnDefs: HostColumn[] = [
  {
    id: "name",
    label: "Host",
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
    id: "max",
    label: "Max file",
    width: "118px",
    render: (host) => (
      <div className="flex items-center gap-1.5">
        <span>{host.filters.maxFileLabel}</span>
        <SourceRefLinks host={host} refs={host.limits.max_file_size.source_refs} className="inline-flex gap-1" />
      </div>
    )
  },
  {
    id: "retention",
    label: "Retention",
    width: "122px",
    render: (host) => (
      <div className="flex items-center gap-1.5">
        <span>{host.filters.retentionLabel}</span>
        <SourceRefLinks host={host} refs={host.limits.retention.source_refs} className="inline-flex gap-1" />
      </div>
    )
  },
  {
    id: "storage",
    label: "Storage",
    width: "122px",
    render: (host) => (
      <div className="flex items-center gap-1.5">
        <span>{host.filters.storageLabel}</span>
        <SourceRefLinks host={host} refs={host.limits.storage.source_refs} className="inline-flex gap-1" />
      </div>
    )
  },
  {
    id: "bandwidth",
    label: "Bandwidth",
    width: "134px",
    render: (host) => (
      <div className="flex items-center gap-1.5">
        <span>{host.filters.bandwidthLabel}</span>
        <SourceRefLinks host={host} refs={host.limits.bandwidth.source_refs} className="inline-flex gap-1" />
      </div>
    )
  },
  { id: "account", label: "Account", width: "96px", render: (host) => host.accountLabel },
  { id: "api", label: "API", width: "72px", render: (host) => (host.developer.api_available ? "Yes" : "No") },
  { id: "cli", label: "CLI", width: "72px", render: (host) => (host.developer.cli_friendly ? "Yes" : "No") },
  { id: "e2ee", label: "E2EE", width: "72px", render: (host) => (host.security.e2ee ? "Yes" : "No") },
  { id: "https", label: "HTTPS", width: "72px", render: (host) => (host.security.https_only ? "Yes" : "No") },
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
  { id: "type", label: "Type", width: "122px", render: (candidate) => candidate.type },
  { id: "free_volume", label: "Free volume", width: "118px", render: (candidate) => candidate.free_volume ?? "-" },
  { id: "shelf_life", label: "Shelf life", width: "118px", render: (candidate) => candidate.shelf_life ?? "-" },
  {
    id: "download_count",
    label: "Downloads",
    width: "102px",
    render: (candidate) => candidate.download_count ?? "-"
  },
  {
    id: "languages",
    label: "Languages",
    width: "156px",
    className: "min-w-[140px]",
    render: (candidate) => (
      <span className="block truncate" title={candidate.languages.join(", ")}>
        {candidate.languages.join(", ") || "-"}
      </span>
    )
  },
  {
    id: "applications",
    label: "Apps",
    width: "156px",
    className: "min-w-[140px]",
    render: (candidate) => (
      <span className="block truncate" title={candidate.applications.join(", ")}>
        {candidate.applications.join(", ") || "-"}
      </span>
    )
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
      <span className="block truncate" title={candidate.verification_notes ?? candidate.source}>
        {candidate.verification_notes ?? candidate.source}
      </span>
    )
  }
];

function statusTone(status: CandidateRecord["verification_status"]) {
  if (status === "verified") return "text-[var(--good)] bg-[var(--good-soft)] border-[var(--good)]/20 shadow-[0_0_16px_-4px_var(--good-soft)]";
  if (status === "rejected") return "text-[var(--bad)] bg-[var(--bad-soft)] border-[var(--bad)]/20 shadow-[0_0_16px_-4px_var(--bad-soft)]";
  return "text-[var(--warn)] bg-[var(--warn-soft)] border-[var(--warn)]/20 shadow-[0_0_16px_-4px_var(--warn-soft)]";
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
        "group relative inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-200",
        active
          ? "border-[var(--accent)]/30 bg-[var(--accent-soft)] text-white shadow-[0_0_24px_-6px_var(--accent-glow)]"
          : "border-[var(--line)] bg-[var(--surface-1)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50 hover:text-white hover:shadow-[0_0_20px_-6px_var(--accent-glow)]"
      ].join(" ")}
    >
      {icon && <span className={["transition-transform", active ? "scale-110" : "group-hover:scale-110"].join(" ")}>{icon}</span>}
      {children}
      {active && (
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent)]/8 to-transparent opacity-60" />
      )}
    </button>
  );
}

function sortDirectionLabel(direction: "asc" | "desc") {
  return direction === "asc" 
    ? "↑ Ascending" 
    : "↓ Descending";
}

function gridTemplate(columns: Array<{ width: string }>) {
  return columns.map((column) => column.width).join(" ");
}

function hostSortValue(host: HostRecord, key: HostSortKey) {
  switch (key) {
    case "name":
      return host.name.toLowerCase();
    case "max":
      return host.limits.max_file_size.value ?? -1;
    case "retention":
      return host.limits.retention.value ?? -1;
    case "storage":
      return host.limits.storage.value ?? -1;
    case "bandwidth":
      return host.limits.bandwidth.value ?? -1;
    case "account":
      return host.accountLabel;
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

function queueSortValue(candidate: CandidateRecord, key: QueueSortKey) {
  switch (key) {
    case "name":
      return candidate.name.toLowerCase();
    case "type":
      return candidate.type.toLowerCase();
    case "free_volume":
      return (candidate.free_volume ?? "").toLowerCase();
    case "shelf_life":
      return (candidate.shelf_life ?? "").toLowerCase();
    case "download_count":
      return (candidate.download_count ?? "").toLowerCase();
    case "languages":
      return candidate.languages.join(", ").toLowerCase();
    case "applications":
      return candidate.applications.join(", ").toLowerCase();
    case "status":
      return candidate.verification_status;
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

  return (
    <aside className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--panel)] p-5">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-[var(--accent)] animate-pulse" style={{ animationDuration: "2s" }} />
              <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">
                Candidate detail
              </div>
            </div>
            <h2 className="mt-2.5 text-xl font-semibold tracking-tight text-[var(--text-primary)]">{candidate.name}</h2>
          </div>
          <span
            className={[
              "inline-flex rounded-full px-3 py-1 text-[10px] font-medium capitalize backdrop-blur-sm border",
              statusTone(candidate.verification_status)
            ].join(" ")}
          >
            {candidate.verification_status}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Type</div>
            <div className="text-sm text-[var(--text-primary)]">{candidate.type}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Free volume</div>
            <div className="text-sm text-[var(--text-primary)]">{candidate.free_volume ?? "Unknown"}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Shelf life</div>
            <div className="text-sm text-[var(--text-primary)]">{candidate.shelf_life ?? "Unknown"}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Download count</div>
            <div className="text-sm text-[var(--text-primary)]">{candidate.download_count ?? "Unknown"}</div>
          </div>
        </div>

        <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-4 text-sm leading-7 text-[var(--text-secondary)] backdrop-blur-sm">
          {candidate.verification_notes ?? candidate.source}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Languages</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.languages.join(", ") || "Unknown"}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">Applications</div>
            <div className="text-sm text-[var(--text-primary)]">
              {candidate.applications.join(", ") || "Unknown"}
            </div>
          </div>
        </div>

        {candidate.verification_references?.length ? (
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Database size={16} weight="fill" />
              Evidence trail
            </div>
            <div className="mt-4 space-y-3">
              {candidate.verification_references.map((reference) => (
                <a
                  key={`${reference.label}-${reference.url}`}
                  href={reference.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-3 transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--accent-soft)]/50 hover:shadow-[0_0_20px_-4px_var(--accent-glow)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                      <LinkSimple size={16} weight="fill" />
                      <span>{reference.label}</span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-mono">{reference.retrieved_at}</div>
                  </div>
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
  title,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="pointer-events-none fixed inset-y-6 right-6 z-40 flex w-[min(460px,calc(100vw-2rem))] items-start justify-end">
      <div className="pointer-events-auto max-h-[calc(100dvh-3rem)] w-full overflow-auto rounded-[var(--radius-card)] border border-[var(--line)] bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] p-4 shadow-[var(--shadow-raised),0_0_0_1px_var(--line)] backdrop-blur-2xl animate-slide-in-right">
        <div className="mb-4 flex items-center justify-between rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-[var(--accent)] animate-pulse" style={{ animationDuration: "2s" }} />
            <div className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">{title}</div>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--line)] text-[var(--text-muted)] transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--accent-soft)] hover:text-[var(--text-primary)] hover:shadow-[0_0_16px_-4px_var(--accent-glow)]"
            aria-label="Close inspector"
          >
            <X size={16} weight="bold" />
          </button>
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function DatasetApp({ data }: Props) {
  const [mode, setMode] = useState<DatasetMode>("hosts");
  const [hostSort, setHostSort] = useState<SortState<HostSortKey>>({
    key: "name",
    direction: "asc"
  });
  const [queueSort, setQueueSort] = useState<SortState<QueueSortKey>>({
    key: "name",
    direction: "asc"
  });
  const [search, setSearch] = useState("");
  const [apiOnly, setApiOnly] = useState(false);
  const [guestOnly, setGuestOnly] = useState(false);
  const [e2eeOnly, setE2eeOnly] = useState(false);
  const [queueStatus, setQueueStatus] = useState<"all" | CandidateRecord["verification_status"]>("all");
  const [hiddenHostColumns, setHiddenHostColumns] = useState<string[]>([]);
  const [hiddenQueueColumns, setHiddenQueueColumns] = useState<string[]>([]);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const visibleHostColumns = hostColumnDefs.filter((column) => !hiddenHostColumns.includes(column.id));
  const visibleQueueColumns = queueColumnDefs.filter((column) => !hiddenQueueColumns.includes(column.id));
  const hostGridTemplate = gridTemplate(visibleHostColumns);
  const queueGridTemplate = gridTemplate(visibleQueueColumns);

  const filteredHosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = data.hosts.filter((host) => {
      const haystack = [
        host.name,
        host.summary,
        host.tags.join(" "),
        host.filters.maxFileLabel,
        host.filters.retentionLabel,
        host.filters.storageLabel,
        host.filters.bandwidthLabel
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
      const leftValue = hostSortValue(left, hostSort.key);
      const rightValue = hostSortValue(right, hostSort.key);
      const comparison = leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
      return hostSort.direction === "asc" ? comparison : comparison * -1;
    });
  }, [apiOnly, data.hosts, e2eeOnly, guestOnly, hostSort, search]);

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = data.candidates.filter((candidate) => {
      const haystack = [
        candidate.name,
        candidate.type,
        candidate.source,
        candidate.verification_notes ?? "",
        candidate.languages.join(" "),
        candidate.applications.join(" ")
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
      const comparison = leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
      return queueSort.direction === "asc" ? comparison : comparison * -1;
    });
  }, [data.candidates, queueSort, queueStatus, search]);

  const selectedHost =
    selectedHostId === null
      ? null
      : filteredHosts.find((host) => host.id === selectedHostId) ?? null;
  const selectedCandidate =
    selectedCandidateId === null
      ? null
      : filteredCandidates.find((candidate) => candidate.id === selectedCandidateId) ?? null;

  function toggleHostColumn(id: string) {
    setHiddenHostColumns((current) =>
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

  function changeQueueSort(key: QueueSortKey) {
    setQueueSort((current) => {
      if (current.key !== key) return { key, direction: "asc" };
      return { key, direction: current.direction === "asc" ? "desc" : "asc" };
    });
  }

  return (
    <AppFrame current="dataset">
      <div className="min-h-0 flex-1">
        <section className="min-h-0 overflow-visible rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--panel)]">
          <div className="relative z-20 flex flex-col gap-4 border-b border-[var(--line)] p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <div className="h-[16px] w-[3px] rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent-glow)]" />
                  <div className="text-[9px] uppercase tracking-[0.4em] text-[var(--text-muted)] font-semibold">
                    Dataset view
                  </div>
                </div>
                <h1 className="mt-2.5 text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl">
                  Scan, compare, and explore the full dataset with precision.
                </h1>
              </div>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { label: "Rows", value: mode === "hosts" ? filteredHosts.length : filteredCandidates.length },
                  { label: "Visible cols", value: mode === "hosts" ? visibleHostColumns.length : visibleQueueColumns.length },
                  { label: "Sort", value: mode === "hosts" ? `${hostSort.key} · ${sortDirectionLabel(hostSort.direction)}` : `${queueSort.key} · ${sortDirectionLabel(queueSort.direction)}` }
                ].map((stat, i) => (
                  <div 
                    key={stat.label} 
                    className="rounded-2xl border border-[var(--line)] bg-[var(--surface-1)] px-3.5 py-2.5 backdrop-blur-sm transition-all hover:border-[var(--line-strong)] hover:bg-[var(--surface-3)] animate-fade-in-up"
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
                <ToolbarButton active={mode === "hosts"} onClick={() => setMode("hosts")}>
                  Verified hosts
                </ToolbarButton>
                <ToolbarButton active={mode === "queue"} onClick={() => setMode("queue")}>
                  Review queue
                </ToolbarButton>
              </div>

              <div className="relative flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-1)] px-4 py-2.5 shadow-sm xl:max-w-[28rem]">
                <MagnifyingGlass size={18} className="text-[var(--text-muted)]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={
                    mode === "hosts" ? "Search host, tag, or limit…" : "Search candidate, source, or reason…"
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

            {mode === "hosts" ? (
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
                  {hostColumnDefs.map((column) => {
                    const hidden = hiddenHostColumns.includes(column.id);
                    return (
                      <button
                        key={column.id}
                        onClick={() => toggleHostColumn(column.id)}
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
                  {queueColumnDefs.map((column) => {
                    const hidden = hiddenQueueColumns.includes(column.id);
                    return (
                      <button
                        key={column.id}
                        onClick={() => toggleQueueColumn(column.id)}
                        className={[
                          "group relative inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200",
                          hidden
                            ? "border-[var(--line)] bg-transparent text-[var(--text-muted)] hover:border-[var(--text-muted)]/40 hover:text-[var(--text-secondary)]"
                            : "border-[var(--accent)]/20 bg-[var(--accent-soft)] text-white"
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
            {mode === "hosts" ? (
              <div className="min-w-max text-sm">
                <div
                  className="sticky top-0 z-10 grid border-b border-[var(--line)] bg-[var(--bg-elevated)] shadow-[var(--shadow-soft)] backdrop-blur-xl"
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
                            {column.label}
                            {isSorted ? (
                              <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--accent-soft)] text-[11px]">
                                {hostSort.direction === "asc" ? "↑" : "↓"}
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
            ) : (
              <div className="min-w-max text-sm">
                <div
                  className="sticky top-0 z-10 grid border-b border-[var(--line)] bg-[var(--bg-elevated)] shadow-[var(--shadow-soft)] backdrop-blur-xl"
                  style={{ gridTemplateColumns: queueGridTemplate }}
                >
                  {visibleQueueColumns.map((column) => {
                    const sortable = column.id !== "notes";
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
                            {column.label}
                            {isSorted ? (
                              <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--accent-soft)] text-[11px]">
                                {queueSort.direction === "asc" ? "↑" : "↓"}
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
                              "inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium capitalize backdrop-blur-sm border",
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
            )}
          </div>
        </section>

      </div>
      {mode === "hosts" && selectedHost ? (
        <FloatingInspector title={selectedHost.name} onClose={() => setSelectedHostId(null)}>
          <HostDetailPanel host={selectedHost} />
        </FloatingInspector>
      ) : null}
      {mode === "queue" && selectedCandidate ? (
        <FloatingInspector title={selectedCandidate.name} onClose={() => setSelectedCandidateId(null)}>
          <CandidateDetailPanel candidate={selectedCandidate} />
        </FloatingInspector>
      ) : null}
    </AppFrame>
  );
}
