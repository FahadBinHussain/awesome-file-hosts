"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { CandidateRecord, HostRecord, SiteData } from "@/lib/site-data";
import {
  ArrowsClockwise,
  CaretRight,
  CheckCircle,
  Database,
  FileText,
  Funnel,
  GlobeHemisphereWest,
  Lock,
  MagnifyingGlass,
  ShieldCheck,
  TerminalWindow,
  XCircle
} from "@phosphor-icons/react";

type Props = {
  data: SiteData;
};

type ViewMode = "hosts" | "queue" | "method";

const statusTone: Record<CandidateRecord["verification_status"], string> = {
  pending: "text-[var(--warn)] bg-[rgba(243,187,91,0.12)] border-[rgba(243,187,91,0.18)]",
  verified: "text-[var(--good)] bg-[rgba(99,211,143,0.12)] border-[rgba(99,211,143,0.18)]",
  rejected: "text-[var(--bad)] bg-[rgba(240,106,106,0.12)] border-[rgba(240,106,106,0.18)]"
};

function StatTile({
  label,
  value,
  helper
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] px-5 py-4 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)]">
      <div className="text-xs uppercase tracking-[0.24em] text-[var(--soft)]">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mt-1 text-sm text-[var(--muted)]">{helper}</div>
    </div>
  );
}

function PillButton({
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
        "rounded-full border px-4 py-2 text-sm transition duration-300",
        active
          ? "border-[rgba(73,179,255,0.3)] bg-[var(--accent-soft)] text-white"
          : "border-[var(--line)] bg-[rgba(255,255,255,0.02)] text-[var(--muted)] hover:border-[rgba(255,255,255,0.16)] hover:text-white"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">{label}</div>
      <div className="text-sm leading-6 text-[var(--text)]">{value}</div>
    </div>
  );
}

function HostRow({
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
        "grid w-full grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.6fr)] gap-4 border-b border-[rgba(255,255,255,0.06)] px-4 py-4 text-left transition duration-300",
        active ? "bg-[rgba(73,179,255,0.12)]" : "hover:bg-[rgba(255,255,255,0.03)]"
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-white">{host.name}</div>
        <div className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{host.summary}</div>
      </div>
      <div className="text-sm text-[var(--text)]">{host.filters.maxFileLabel}</div>
      <div className="text-sm text-[var(--text)]">{host.filters.retentionLabel}</div>
      <div className="flex items-center justify-between gap-2 text-sm text-[var(--text)]">
        <span>{host.accountLabel}</span>
        <CaretRight size={14} className="text-[var(--soft)]" />
      </div>
    </button>
  );
}

function CandidateRow({ candidate }: { candidate: CandidateRecord }) {
  return (
    <div className="grid gap-3 border-b border-[rgba(255,255,255,0.06)] px-4 py-4 md:grid-cols-[minmax(0,1.2fr)_120px_140px_minmax(0,1fr)]">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-white">{candidate.name}</div>
        <div className="mt-1 text-sm text-[var(--muted)]">{candidate.type}</div>
      </div>
      <div className="text-sm text-[var(--text)]">{candidate.free_volume ?? "Unknown"}</div>
      <div>
        <span
          className={[
            "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
            statusTone[candidate.verification_status]
          ].join(" ")}
        >
          {candidate.verification_status}
        </span>
      </div>
      <div className="text-sm text-[var(--muted)]">
        {candidate.verification_notes ?? candidate.source}
      </div>
    </div>
  );
}

export function ExplorerApp({ data }: Props) {
  const [view, setView] = useState<ViewMode>("hosts");
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [apiOnly, setApiOnly] = useState(false);
  const [guestOnly, setGuestOnly] = useState(false);
  const [e2eeOnly, setE2eeOnly] = useState(false);
  const [selectedHostId, setSelectedHostId] = useState<string>(data.hosts[0]?.id ?? "");

  const filteredHosts = useMemo(() => {
    return data.hosts.filter((host) => {
      const haystack = `${host.name} ${host.summary} ${host.tags.join(" ")}`.toLowerCase();
      const matchesSearch = search.trim() === "" || haystack.includes(search.trim().toLowerCase());
      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((tag) => host.tags.includes(tag));
      const matchesApi = !apiOnly || host.developer.api_available;
      const matchesGuest = !guestOnly || host.account.required === false;
      const matchesE2ee = !e2eeOnly || host.security.e2ee;

      return matchesSearch && matchesTags && matchesApi && matchesGuest && matchesE2ee;
    });
  }, [apiOnly, data.hosts, e2eeOnly, guestOnly, search, selectedTags]);

  const selectedHost =
    filteredHosts.find((host) => host.id === selectedHostId) ?? filteredHosts[0] ?? null;

  const queueGroups = useMemo(
    () => ({
      pending: data.candidates.filter((candidate) => candidate.verification_status === "pending"),
      rejected: data.candidates.filter((candidate) => candidate.verification_status === "rejected"),
      verified: data.candidates.filter((candidate) => candidate.verification_status === "verified")
    }),
    [data.candidates]
  );

  return (
    <main className="min-h-[100dvh] px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-[1600px] flex-col gap-4 rounded-[2.75rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(7,9,13,0.82)] p-4 shadow-[0_50px_120px_-50px_rgba(0,0,0,0.75)] backdrop-blur-xl md:min-h-[calc(100dvh-3rem)] md:p-6">
        <section className="grid gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(520px,1fr)]">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs uppercase tracking-[0.28em] text-[var(--soft)]">
              Structured host intelligence
            </div>
            <div className="max-w-4xl">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl">
                The dataset outgrew the README, so now it has a proper control room.
              </h1>
            </div>
            <p className="max-w-[68ch] text-base leading-7 text-[var(--muted)]">
              Explore verified file hosts, inspect the evidence behind every field, and keep the
              review queue visible without making the public interface feel like a spreadsheet dump.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatTile label="Verified" value={data.stats.verifiedHosts} helper="Source-checked hosts in the live explorer." />
            <StatTile label="Pending" value={data.stats.pendingCandidates} helper="Leads still waiting on a hard decision." />
            <StatTile label="Rejected" value={data.stats.rejectedCandidates} helper="Tracked with reasons and references." />
            <StatTile label="API" value={data.stats.apiHosts} helper="Hosts with public API support." />
            <StatTile label="E2EE" value={data.stats.e2eeHosts} helper="Hosts with end-to-end encryption claims." />
            <StatTile label="CLI" value={data.stats.cliHosts} helper="Hosts with CLI-friendly flows or examples." />
          </div>
        </section>

        <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)_420px]">
          <aside className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Funnel size={18} />
              Explorer controls
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <PillButton active={view === "hosts"} onClick={() => setView("hosts")}>
                Hosts
              </PillButton>
              <PillButton active={view === "queue"} onClick={() => setView("queue")}>
                Review queue
              </PillButton>
              <PillButton active={view === "method"} onClick={() => setView("method")}>
                Method
              </PillButton>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">
                Search
              </label>
              <div className="flex items-center gap-3 rounded-[1.25rem] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-3 py-3">
                <MagnifyingGlass size={18} className="text-[var(--soft)]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Host, tag, behavior"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[var(--soft)]"
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <button
                onClick={() => setApiOnly((value) => !value)}
                className={`flex w-full items-center justify-between rounded-[1.2rem] border px-3 py-3 text-sm transition ${
                  apiOnly
                    ? "border-[rgba(73,179,255,0.3)] bg-[var(--accent-soft)] text-white"
                    : "border-[var(--line)] text-[var(--muted)] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <TerminalWindow size={18} />
                  API available
                </span>
                {apiOnly ? <CheckCircle size={16} /> : <ArrowsClockwise size={16} />}
              </button>
              <button
                onClick={() => setGuestOnly((value) => !value)}
                className={`flex w-full items-center justify-between rounded-[1.2rem] border px-3 py-3 text-sm transition ${
                  guestOnly
                    ? "border-[rgba(73,179,255,0.3)] bg-[var(--accent-soft)] text-white"
                    : "border-[var(--line)] text-[var(--muted)] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <GlobeHemisphereWest size={18} />
                  Guest uploads
                </span>
                {guestOnly ? <CheckCircle size={16} /> : <ArrowsClockwise size={16} />}
              </button>
              <button
                onClick={() => setE2eeOnly((value) => !value)}
                className={`flex w-full items-center justify-between rounded-[1.2rem] border px-3 py-3 text-sm transition ${
                  e2eeOnly
                    ? "border-[rgba(73,179,255,0.3)] bg-[var(--accent-soft)] text-white"
                    : "border-[var(--line)] text-[var(--muted)] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={18} />
                  End-to-end encryption
                </span>
                {e2eeOnly ? <CheckCircle size={16} /> : <ArrowsClockwise size={16} />}
              </button>
            </div>

            <div className="mt-5">
              <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">
                Tags
              </div>
              <div className="flex max-h-[28rem] flex-wrap gap-2 overflow-auto pr-2 scrollbar-subtle">
                {data.tagOptions.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() =>
                        setSelectedTags((current) =>
                          active ? current.filter((item) => item !== tag) : [...current, tag]
                        )
                      }
                      className={[
                        "rounded-full border px-3 py-1.5 text-xs transition",
                        active
                          ? "border-[rgba(99,211,143,0.3)] bg-[rgba(99,211,143,0.14)] text-white"
                          : "border-[var(--line)] text-[var(--muted)] hover:text-white"
                      ].join(" ")}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="min-h-0 overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--panel)]">
            {view === "hosts" && (
              <div className="flex h-full min-h-0 flex-col">
                <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.6fr)] gap-4 border-b border-[rgba(255,255,255,0.08)] px-4 py-4 text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">
                  <div>Host</div>
                  <div>Max file size</div>
                  <div>Retention</div>
                  <div>Account</div>
                </div>
                <div className="min-h-0 overflow-auto scrollbar-subtle">
                  {filteredHosts.map((host) => (
                    <HostRow
                      key={host.id}
                      host={host}
                      active={selectedHost?.id === host.id}
                      onSelect={() => setSelectedHostId(host.id)}
                    />
                  ))}
                  {filteredHosts.length === 0 && (
                    <div className="px-6 py-14 text-center text-sm text-[var(--muted)]">
                      No hosts matched the current filters.
                    </div>
                  )}
                </div>
              </div>
            )}

            {view === "queue" && (
              <div className="flex h-full min-h-0 flex-col">
                <div className="grid grid-cols-[minmax(0,1.2fr)_120px_140px_minmax(0,1fr)] gap-3 border-b border-[rgba(255,255,255,0.08)] px-4 py-4 text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">
                  <div>Candidate</div>
                  <div>Imported limit</div>
                  <div>Status</div>
                  <div>Why it sits there</div>
                </div>
                <div className="min-h-0 overflow-auto scrollbar-subtle">
                  {[...queueGroups.pending, ...queueGroups.rejected.slice(0, 40), ...queueGroups.verified.slice(0, 20)].map((candidate) => (
                    <CandidateRow key={candidate.id} candidate={candidate} />
                  ))}
                </div>
              </div>
            )}

            {view === "method" && (
              <div className="grid gap-6 p-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="text-sm font-medium text-white">What counts as verified</div>
                  <div className="rounded-[1.75rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-5 text-sm leading-7 text-[var(--muted)]">
                    The explorer only promotes hosts into the live dataset when the current public
                    source trail is strong enough to support structured facts. If a service is live
                    but slippery, it stays in the queue until the evidence improves.
                  </div>
                  <div className="rounded-[1.75rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-5 text-sm leading-7 text-[var(--muted)]">
                    Rejected entries are not deleted. They keep their rejection reason and
                    references so the queue does not forget why a domain was moved out.
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-sm font-medium text-white">How to read the fields</div>
                  <div className="grid gap-4">
                    <InfoPair label="Not published" value="The source pages do not expose a reliable current number." />
                    <InfoPair label="Conditional" value="The limit depends on account type, downloads, inactivity, or another rule in the notes." />
                    <InfoPair label="Yes*" value="The host is CLI-friendly and the detail panel includes a concrete example." />
                    <InfoPair label="Queue" value="Pending names are leads, not promises. Some will be promoted, and many will be rejected." />
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-5">
            {selectedHost ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">
                      Host detail
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                      {selectedHost.name}
                    </h2>
                  </div>
                  <a
                    href={selectedHost.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[var(--line)] px-3 py-2 text-xs text-[var(--muted)] transition hover:text-white"
                  >
                    Open site
                  </a>
                </div>

                <p className="text-sm leading-7 text-[var(--muted)]">{selectedHost.summary}</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoPair label="Max file size" value={`${selectedHost.filters.maxFileLabel} - ${selectedHost.limits.max_file_size.notes}`} />
                  <InfoPair label="Retention" value={`${selectedHost.filters.retentionLabel} - ${selectedHost.limits.retention.notes}`} />
                  <InfoPair label="Storage" value={`${selectedHost.filters.storageLabel} - ${selectedHost.limits.storage.notes}`} />
                  <InfoPair label="Bandwidth" value={`${selectedHost.filters.bandwidthLabel} - ${selectedHost.limits.bandwidth.notes}`} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoPair label="Account" value={selectedHost.account.benefits} />
                  <InfoPair label="Allowed file types" value={selectedHost.content.allowed_file_types.notes} />
                  <InfoPair
                    label="Developer support"
                    value={`${selectedHost.developer.api_available ? "API" : "No API"}, ${selectedHost.developer.cli_friendly ? "CLI-friendly" : "no CLI"} - ${selectedHost.developer.notes}`}
                  />
                  <InfoPair
                    label="Security"
                    value={`${selectedHost.security.e2ee ? "E2EE" : "No E2EE"} - ${selectedHost.security.notes}`}
                  />
                </div>

                <div className="rounded-[1.75rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Database size={18} />
                    Source references
                  </div>
                  <div className="mt-4 space-y-3">
                    {selectedHost.sources.map((source) => (
                      <a
                        key={`${source.label}-${source.url}`}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-[1.25rem] border border-[rgba(255,255,255,0.06)] px-4 py-3 transition hover:border-[rgba(73,179,255,0.25)] hover:bg-[rgba(73,179,255,0.06)]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium text-white">{source.label}</div>
                          <div className="text-xs text-[var(--soft)]">{source.retrieved_at}</div>
                        </div>
                        <div className="mt-2 text-sm leading-6 text-[var(--muted)]">{source.notes}</div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedHost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
                Pick a host to inspect.
              </div>
            )}
          </aside>
        </section>

        <footer className="grid gap-3 border-t border-[rgba(255,255,255,0.08)] pt-4 text-sm text-[var(--muted)] md:grid-cols-[1fr_auto]">
          <div className="max-w-[70ch]">
            The JSON files remain the source of truth. This interface is only a better lens for the
            same research, evidence, and structured decisions.
          </div>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em]">
            <span className="inline-flex items-center gap-2">
              <Lock size={14} />
              Evidence-first
            </span>
            <span className="inline-flex items-center gap-2">
              <FileText size={14} />
              Queue-aware
            </span>
            <span className="inline-flex items-center gap-2">
              <XCircle size={14} />
              Rejections kept
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
