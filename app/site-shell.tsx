"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { CandidateRecord, HostRecord, SiteData } from "@/lib/site-data";
import { AppFrame } from "@/components/app-frame";
import { HostDetailPanel } from "@/components/host-detail-panel";
import {
  ArrowsClockwise,
  CaretRight,
  CheckCircle,
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
  pending: "text-[var(--warn)] bg-[var(--warn-soft)] border-[var(--warn)]/20",
  verified: "text-[var(--good)] bg-[var(--good-soft)] border-[var(--good)]/20",
  rejected: "text-[var(--bad)] bg-[var(--bad-soft)] border-[var(--bad)]/20"
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
    <div className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--panel)] px-5 py-4 shadow-[var(--shadow-soft)]">
      <div className="text-xs uppercase tracking-[0.24em] text-[var(--soft)]">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{value}</div>
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
        "rounded-[var(--radius-pill)] border px-4 py-2 text-sm transition duration-300",
        active
          ? "rounded-[var(--radius-pill)] border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent-content)]"
          : "rounded-[var(--radius-pill)] border-[var(--line)] bg-[var(--surface-1)] text-[var(--muted)] hover:border-[var(--line-strong)] hover:text-[var(--text-primary)]"
      ].join(" ")}
    >
      {children}
    </button>
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
        "grid w-full gap-3 border-b border-[var(--line)] px-4 py-4 text-left transition duration-300 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.6fr)] md:gap-4",
        active ? "bg-[var(--accent-soft)]" : "hover:bg-[var(--surface-2)]"
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-[var(--text-primary)]">{host.name}</div>
        <div className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{host.summary}</div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-[var(--muted)] md:contents md:text-sm md:text-[var(--text)]">
        <div>
          <div className="mb-1 uppercase tracking-[0.18em] md:hidden">Max</div>
          <div className="text-sm text-[var(--text)]">{host.filters.maxFileLabel}</div>
        </div>
        <div>
          <div className="mb-1 uppercase tracking-[0.18em] md:hidden">Retention</div>
          <div className="text-sm text-[var(--text)]">{host.filters.retentionLabel}</div>
        </div>
        <div className="md:hidden">
          <div className="mb-1 uppercase tracking-[0.18em]">Account</div>
          <div className="text-sm text-[var(--text)]">{host.accountLabel}</div>
        </div>
      </div>
      <div className="hidden items-center justify-between gap-2 text-sm text-[var(--text)] md:flex">
        <span>{host.accountLabel}</span>
        <CaretRight size={14} className="text-[var(--soft)]" />
      </div>
      <div className="flex items-center justify-end md:hidden">
        <CaretRight size={14} className="text-[var(--soft)]" />
      </div>
    </button>
  );
}

function CandidateRow({ candidate }: { candidate: CandidateRecord }) {
  return (
    <div className="grid gap-3 border-b border-[var(--line)] px-4 py-4 md:grid-cols-[minmax(0,1.2fr)_120px_140px_minmax(0,1fr)]">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-[var(--text-primary)]">{candidate.name}</div>
        <div className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{candidate.summary}</div>
      </div>
      <div className="text-sm text-[var(--text)]">
        <span className="mr-2 text-[11px] uppercase tracking-[0.18em] text-[var(--soft)] md:hidden">Max</span>
        {candidate.filters.maxFileLabel}
      </div>
      <div>
        <span
          className={[
            "inline-flex rounded-[var(--radius-pill)] border px-2.5 py-1 text-xs font-medium capitalize",
            statusTone[candidate.verification_status]
          ].join(" ")}
        >
          {candidate.verification_status}
        </span>
      </div>
      <div className="text-sm text-[var(--muted)]">
        <span className="mr-2 text-[11px] uppercase tracking-[0.18em] text-[var(--soft)] md:hidden">Notes</span>
        {candidate.reason ?? candidate.summary}
      </div>
    </div>
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
    <AppFrame current="home">
        <section className="grid gap-4 border-b border-[var(--line)] pb-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="inline-flex rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1 text-xs uppercase tracking-[0.28em] text-[var(--soft)]">
              Structured host intelligence
            </div>
            <div className="max-w-4xl">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-[var(--text-primary)] md:text-6xl">
                The dataset outgrew the README, so now it has a proper control room.
              </h1>
            </div>
            <p className="max-w-[68ch] text-base leading-7 text-[var(--muted)]">
              Explore verified file hosts, inspect the evidence behind every field, and keep the
              review queue visible without making the public interface feel like a spreadsheet dump.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <StatTile label="Verified" value={data.stats.verifiedHosts} helper="Source-checked hosts in the live explorer." />
            <StatTile label="Pending" value={data.stats.pendingCandidates} helper="Leads still waiting on a hard decision." />
            <StatTile label="Rejected" value={data.stats.rejectedCandidates} helper="Tracked with reasons and references." />
            <StatTile label="API" value={data.stats.apiHosts} helper="Hosts with public API support." />
            <StatTile label="E2EE" value={data.stats.e2eeHosts} helper="Hosts with end-to-end encryption claims." />
            <StatTile label="CLI" value={data.stats.cliHosts} helper="Hosts with CLI-friendly flows or examples." />
          </div>
        </section>

        <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_380px] 2xl:grid-cols-[300px_minmax(0,1fr)_420px]">
          <aside className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--panel)] p-4 xl:sticky xl:top-24 xl:self-start">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
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
              <div className="flex items-center gap-3 rounded-[var(--radius-xl)] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-3">
                <MagnifyingGlass size={18} className="text-[var(--soft)]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Host, tag, behavior"
                  className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--soft)]"
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <button
                onClick={() => setApiOnly((value) => !value)}
                className={`flex w-full items-center justify-between rounded-[var(--radius-panel)] border px-3 py-3 text-sm transition ${
                  apiOnly
                    ? "border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent-content)]"
                    : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--text-primary)]"
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
                className={`flex w-full items-center justify-between rounded-[var(--radius-panel)] border px-3 py-3 text-sm transition ${
                  guestOnly
                    ? "border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent-content)]"
                    : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--text-primary)]"
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
                className={`flex w-full items-center justify-between rounded-[var(--radius-panel)] border px-3 py-3 text-sm transition ${
                  e2eeOnly
                    ? "border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent-content)]"
                    : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--text-primary)]"
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
                        "rounded-[var(--radius-pill)] border px-3 py-1.5 text-xs transition",
                        active
                          ? "border-[var(--good)]/30 bg-[var(--good-soft)] text-[var(--good-content)]"
                          : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--text-primary)]"
                      ].join(" ")}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="min-h-0 rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--panel)]">
            {view === "hosts" && (
              <div className="flex h-full min-h-0 flex-col">
                <div className="sticky top-0 z-10 hidden grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.6fr)] gap-4 border-b border-[var(--line)] bg-[var(--panel)] px-4 py-4 text-[11px] uppercase tracking-[0.22em] text-[var(--soft)] backdrop-blur-sm md:grid">
                  <div>Host</div>
                  <div>Max file size</div>
                  <div>Retention</div>
                  <div>Account</div>
                </div>
                <div>
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
                <div className="sticky top-0 z-10 hidden grid-cols-[minmax(0,1.2fr)_120px_140px_minmax(0,1fr)] gap-3 border-b border-[var(--line)] bg-[var(--panel)] px-4 py-4 text-[11px] uppercase tracking-[0.22em] text-[var(--soft)] backdrop-blur-sm md:grid">
                  <div>Candidate</div>
                  <div>Max file</div>
                  <div>Status</div>
                  <div>Reason</div>
                </div>
                <div>
                  {[...queueGroups.pending, ...queueGroups.rejected.slice(0, 40), ...queueGroups.verified.slice(0, 20)].map((candidate) => (
                    <CandidateRow key={candidate.id} candidate={candidate} />
                  ))}
                </div>
              </div>
            )}

            {view === "method" && (
              <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="text-sm font-medium text-[var(--text-primary)]">What counts as verified</div>
                  <div className="rounded-[var(--radius-3xl)] border border-[var(--line)] bg-[var(--surface-1)] p-5 text-sm leading-7 text-[var(--muted)]">
                    The explorer only promotes hosts into the live dataset when the current public
                    source trail is strong enough to support structured facts. If a service is live
                    but slippery, it stays in the queue until the evidence improves.
                  </div>
                  <div className="rounded-[var(--radius-3xl)] border border-[var(--line)] bg-[var(--surface-1)] p-5 text-sm leading-7 text-[var(--muted)]">
                    Rejected entries are not deleted. They keep their rejection reason and
                    references so the queue does not forget why a domain was moved out.
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-sm font-medium text-[var(--text-primary)]">How to read the fields</div>
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

          <div className="xl:sticky xl:top-24 xl:self-start">
            <HostDetailPanel host={selectedHost} />
          </div>
        </section>

        <footer className="grid gap-3 border-t border-[var(--line)] pt-4 text-sm text-[var(--muted)] md:grid-cols-[1fr_auto]">
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
    </AppFrame>
  );
}
