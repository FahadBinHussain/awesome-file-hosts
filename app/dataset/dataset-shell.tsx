"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  ArrowsDownUp,
  CheckCircle,
  Eye,
  EyeSlash,
  Funnel,
  GlobeHemisphereWest,
  MagnifyingGlass,
  ShieldCheck,
  TerminalWindow,
  XCircle
} from "@phosphor-icons/react";
import { AppFrame } from "@/components/app-frame";
import { HostDetailPanel } from "@/components/host-detail-panel";
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
  className?: string;
  render: (host: HostRecord) => ReactNode;
};

type QueueColumn = {
  id: string;
  label: string;
  className?: string;
  render: (candidate: CandidateRecord) => ReactNode;
};

const hostColumnDefs: HostColumn[] = [
  {
    id: "name",
    label: "Host",
    className: "min-w-[220px] sticky left-0 z-10 bg-[rgba(11,13,18,0.96)]",
    render: (host) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-white">{host.name}</div>
        <div className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--muted)]">{host.summary}</div>
      </div>
    )
  },
  { id: "max", label: "Max file", render: (host) => host.filters.maxFileLabel },
  { id: "retention", label: "Retention", render: (host) => host.filters.retentionLabel },
  { id: "storage", label: "Storage", render: (host) => host.filters.storageLabel },
  { id: "bandwidth", label: "Bandwidth", render: (host) => host.filters.bandwidthLabel },
  { id: "account", label: "Account", render: (host) => host.accountLabel },
  { id: "api", label: "API", render: (host) => (host.developer.api_available ? "Yes" : "No") },
  { id: "cli", label: "CLI", render: (host) => (host.developer.cli_friendly ? "Yes" : "No") },
  { id: "e2ee", label: "E2EE", render: (host) => (host.security.e2ee ? "Yes" : "No") },
  { id: "https", label: "HTTPS", render: (host) => (host.security.https_only ? "Yes" : "No") },
  {
    id: "tags",
    label: "Tags",
    className: "min-w-[220px]",
    render: (host) => host.tags.slice(0, 3).join(", ")
  },
  { id: "sources", label: "Sources", render: (host) => String(host.sources.length) }
];

const queueColumnDefs: QueueColumn[] = [
  {
    id: "name",
    label: "Candidate",
    className: "min-w-[220px] sticky left-0 z-10 bg-[rgba(11,13,18,0.96)]",
    render: (candidate) => candidate.name
  },
  { id: "type", label: "Type", render: (candidate) => candidate.type },
  { id: "free_volume", label: "Free volume", render: (candidate) => candidate.free_volume ?? "-" },
  { id: "shelf_life", label: "Shelf life", render: (candidate) => candidate.shelf_life ?? "-" },
  {
    id: "download_count",
    label: "Downloads",
    render: (candidate) => candidate.download_count ?? "-"
  },
  {
    id: "languages",
    label: "Languages",
    className: "min-w-[160px]",
    render: (candidate) => candidate.languages.join(", ") || "-"
  },
  {
    id: "applications",
    label: "Apps",
    className: "min-w-[160px]",
    render: (candidate) => candidate.applications.join(", ") || "-"
  },
  {
    id: "status",
    label: "Status",
    render: (candidate) => candidate.verification_status
  },
  {
    id: "notes",
    label: "Why",
    className: "min-w-[260px]",
    render: (candidate) => candidate.verification_notes ?? candidate.source
  }
];

function statusTone(status: CandidateRecord["verification_status"]) {
  if (status === "verified") return "text-[var(--good)] bg-[rgba(99,211,143,0.12)]";
  if (status === "rejected") return "text-[var(--bad)] bg-[rgba(240,106,106,0.12)]";
  return "text-[var(--warn)] bg-[rgba(243,187,91,0.12)]";
}

function ToolbarButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition",
        active
          ? "border-[rgba(73,179,255,0.3)] bg-[var(--accent-soft)] text-white"
          : "border-[var(--line)] bg-[rgba(255,255,255,0.03)] text-[var(--muted)] hover:text-white"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function sortDirectionLabel(direction: "asc" | "desc") {
  return direction === "asc" ? "ascending" : "descending";
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
      <aside className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-5">
        <div className="flex h-full min-h-[18rem] items-center justify-center text-sm text-[var(--muted)]">
          Pick a candidate to inspect.
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-5">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">
              Candidate detail
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{candidate.name}</h2>
          </div>
          <span
            className={[
              "inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize",
              statusTone(candidate.verification_status)
            ].join(" ")}
          >
            {candidate.verification_status}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">Type</div>
            <div className="mt-1 text-sm text-[var(--text)]">{candidate.type}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">Free volume</div>
            <div className="mt-1 text-sm text-[var(--text)]">{candidate.free_volume ?? "Unknown"}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">Shelf life</div>
            <div className="mt-1 text-sm text-[var(--text)]">{candidate.shelf_life ?? "Unknown"}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">Download count</div>
            <div className="mt-1 text-sm text-[var(--text)]">{candidate.download_count ?? "Unknown"}</div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-4 text-sm leading-7 text-[var(--muted)]">
          {candidate.verification_notes ?? candidate.source}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">Languages</div>
            <div className="mt-1 text-sm text-[var(--text)]">
              {candidate.languages.join(", ") || "Unknown"}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">Applications</div>
            <div className="mt-1 text-sm text-[var(--text)]">
              {candidate.applications.join(", ") || "Unknown"}
            </div>
          </div>
        </div>

        {candidate.verification_references?.length ? (
          <div className="rounded-[1.75rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="text-sm font-medium text-white">Evidence trail</div>
            <div className="mt-4 space-y-3">
              {candidate.verification_references.map((reference) => (
                <a
                  key={`${reference.label}-${reference.url}`}
                  href={reference.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-[1.25rem] border border-[rgba(255,255,255,0.06)] px-4 py-3 transition hover:border-[rgba(73,179,255,0.25)] hover:bg-[rgba(73,179,255,0.06)]"
                >
                  <div className="text-sm font-medium text-white">{reference.label}</div>
                  <div className="mt-1 text-xs text-[var(--soft)]">{reference.retrieved_at}</div>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
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
  const [selectedHostId, setSelectedHostId] = useState(data.hosts[0]?.id ?? "");
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    data.candidates[0]?.id ?? ""
  );

  const visibleHostColumns = hostColumnDefs.filter((column) => !hiddenHostColumns.includes(column.id));
  const visibleQueueColumns = queueColumnDefs.filter((column) => !hiddenQueueColumns.includes(column.id));

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
    filteredHosts.find((host) => host.id === selectedHostId) ?? filteredHosts[0] ?? null;
  const selectedCandidate =
    filteredCandidates.find((candidate) => candidate.id === selectedCandidateId) ??
    filteredCandidates[0] ??
    null;

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
    setHostSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  }

  function changeQueueSort(key: QueueSortKey) {
    setQueueSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  }

  return (
    <AppFrame current="dataset">
      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="min-h-0 overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--panel)]">
          <div className="flex flex-col gap-4 border-b border-[rgba(255,255,255,0.08)] p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-[var(--soft)]">
                  Dense dataset view
                </div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  A proper scan-and-compare surface for all the rows and columns.
                </h1>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--soft)]">Rows</div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {mode === "hosts" ? filteredHosts.length : filteredCandidates.length}
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--soft)]">Visible cols</div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {mode === "hosts" ? visibleHostColumns.length : visibleQueueColumns.length}
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--soft)]">Sort</div>
                  <div className="mt-2 text-sm text-white">
                    {mode === "hosts"
                      ? `${hostSort.key} · ${sortDirectionLabel(hostSort.direction)}`
                      : `${queueSort.key} · ${sortDirectionLabel(queueSort.direction)}`}
                  </div>
                </div>
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

              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-3 py-3 xl:max-w-[28rem]">
                <MagnifyingGlass size={18} className="text-[var(--soft)]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={
                    mode === "hosts" ? "Search host, tag, or limit" : "Search candidate, source, or reason"
                  }
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[var(--soft)]"
                />
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
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--muted)] transition hover:text-white"
                      >
                        {hidden ? <EyeSlash size={14} /> : <Eye size={14} />}
                        {column.label}
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
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--muted)] transition hover:text-white"
                      >
                        {hidden ? <EyeSlash size={14} /> : <Eye size={14} />}
                        {column.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="min-h-0 overflow-auto scrollbar-subtle">
            {mode === "hosts" ? (
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead className="sticky top-0 z-20 bg-[rgba(11,13,18,0.96)]">
                  <tr>
                    {visibleHostColumns.map((column) => {
                      const sortable = column.id !== "tags";
                      return (
                        <th
                          key={column.id}
                          className={[
                            "border-b border-[rgba(255,255,255,0.08)] px-4 py-3 text-left text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]",
                            column.className ?? ""
                          ].join(" ")}
                        >
                          {sortable ? (
                            <button
                              onClick={() => changeHostSort(column.id as HostSortKey)}
                              className="inline-flex items-center gap-2 transition hover:text-white"
                            >
                              {column.label}
                              <ArrowsDownUp size={13} />
                            </button>
                          ) : (
                            column.label
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredHosts.map((host) => (
                    <tr
                      key={host.id}
                      onClick={() => setSelectedHostId(host.id)}
                      className="cursor-pointer transition hover:bg-[rgba(255,255,255,0.03)]"
                    >
                      {visibleHostColumns.map((column) => (
                        <td
                          key={`${host.id}-${column.id}`}
                          className={[
                            "border-b border-[rgba(255,255,255,0.06)] px-4 py-3 align-top text-[var(--text)]",
                            selectedHost?.id === host.id ? "bg-[rgba(73,179,255,0.08)]" : "",
                            column.className ?? ""
                          ].join(" ")}
                        >
                          {column.render(host)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead className="sticky top-0 z-20 bg-[rgba(11,13,18,0.96)]">
                  <tr>
                    {visibleQueueColumns.map((column) => {
                      const sortable = column.id !== "notes";
                      return (
                        <th
                          key={column.id}
                          className={[
                            "border-b border-[rgba(255,255,255,0.08)] px-4 py-3 text-left text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]",
                            column.className ?? ""
                          ].join(" ")}
                        >
                          {sortable ? (
                            <button
                              onClick={() => changeQueueSort(column.id as QueueSortKey)}
                              className="inline-flex items-center gap-2 transition hover:text-white"
                            >
                              {column.label}
                              <ArrowsDownUp size={13} />
                            </button>
                          ) : (
                            column.label
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      onClick={() => setSelectedCandidateId(candidate.id)}
                      className="cursor-pointer transition hover:bg-[rgba(255,255,255,0.03)]"
                    >
                      {visibleQueueColumns.map((column) => (
                        <td
                          key={`${candidate.id}-${column.id}`}
                          className={[
                            "border-b border-[rgba(255,255,255,0.06)] px-4 py-3 align-top text-[var(--text)]",
                            selectedCandidate?.id === candidate.id ? "bg-[rgba(73,179,255,0.08)]" : "",
                            column.className ?? ""
                          ].join(" ")}
                        >
                          {column.id === "status" ? (
                            <span
                              className={[
                                "inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                                statusTone(candidate.verification_status)
                              ].join(" ")}
                            >
                              {candidate.verification_status}
                            </span>
                          ) : (
                            column.render(candidate)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {mode === "hosts" ? (
          <HostDetailPanel host={selectedHost} />
        ) : (
          <CandidateDetailPanel candidate={selectedCandidate} />
        )}
      </div>
    </AppFrame>
  );
}
