"use client";

import { Database, LinkSimple, Lock, ShieldCheck, TerminalWindow } from "@phosphor-icons/react";
import type { HostRecord } from "@/lib/site-data";
import { SourceRefLinks } from "./source-ref-links";

function InfoPair({
  label,
  value,
  host,
  refs,
  notes
}: {
  label: string;
  value: string;
  host: HostRecord;
  refs?: number[];
  notes?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">{label}</div>
      <div className="text-sm leading-6 text-[var(--text-primary)]">
        {value}{" "}
        <SourceRefLinks record={host} refs={refs} className="inline-flex items-center gap-0.5 whitespace-nowrap align-super" />
      </div>
      {notes && notes !== "-" ? <div className="text-xs italic text-[var(--text-muted)]">{notes}</div> : null}
    </div>
  );
}

export function HostDetailPanel({ host }: { host: HostRecord | null }) {
  if (!host) {
    return (
      <aside className="rounded-[var(--radius-card)] border border-[var(--line)] bg-gradient-to-br from-[var(--panel)] to-[var(--surface-2)] p-6 backdrop-blur-2xl">
        <div className="flex h-full min-h-[20rem] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--surface-3)] shadow-inner">
              <Database size={32} weight="duotone" className="text-[var(--text-muted)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-muted)]">Select a host to view details</p>
          </div>
        </div>
      </aside>
    );
  }

  const guestMaxField =
    host.limits.max_file_size_guest ?? (host.account.required === false ? host.limits.max_file_size : undefined);
  const accountMaxField =
    host.limits.max_file_size_account ??
    (host.account.required === true
      ? host.limits.max_file_size
      : host.account.required === false && host.limits.max_file_size_guest
        ? host.limits.max_file_size_guest
        : undefined);
  const guestStorageField =
    host.limits.storage_guest ?? (host.account.required === false ? host.limits.storage : undefined);
  const accountStorageField =
    host.limits.storage_account ??
    (host.account.required === true
      ? host.limits.storage
      : host.account.required === false && guestStorageField
        ? guestStorageField
        : undefined);

  return (
    <aside className="group rounded-[var(--radius-card)] border border-[var(--line)] bg-gradient-to-br from-[var(--panel)] to-[var(--surface-2)] p-4 shadow-[var(--shadow-raised)] backdrop-blur-2xl transition-all hover:border-[var(--line-strong)] hover:shadow-[0_32px_100px_-32px_rgba(0,0,0,0.8)] sm:p-5 lg:p-6">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-[var(--radius-pill)] bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
              <div className="text-[9px] font-bold uppercase tracking-[0.35em] text-[var(--text-muted)]">
                Host Details
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)] sm:text-[1.75rem]">
              {host.name}
            </h2>
          </div>
          <a
            href={host.url}
            target="_blank"
            rel="noreferrer"
            className="group/link flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] shadow-sm transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-content)] hover:shadow-[0_0_24px_-4px_var(--accent-glow)]"
          >
            <LinkSimple size={14} weight="bold" className="transition-transform group-hover/link:translate-x-0.5" />
            <span>Open site</span>
          </a>
        </div>

        <p className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-4 text-sm leading-relaxed text-[var(--text-secondary)] backdrop-blur-sm">
          {host.summary}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoPair
            label="Max file (guest)"
            value={host.filters.maxFileGuestLabel}
            host={host}
            refs={guestMaxField?.source_refs}
            notes={
              guestMaxField?.notes ??
              (host.account.required === true ? "A free account is required for uploads on this service." : "-")
            }
          />
          <InfoPair
            label="Max file (account)"
            value={host.filters.maxFileAccountLabel}
            host={host}
            refs={accountMaxField?.source_refs}
            notes={
              accountMaxField?.notes ??
              (host.account.required === false && host.limits.max_file_size_guest
                ? "No separate free-account cap is published; the free account appears to use the same ceiling as guest uploads."
                : "-")
            }
          />
          <InfoPair
            label="Storage (guest)"
            value={host.filters.storageGuestLabel}
            host={host}
            refs={guestStorageField?.source_refs}
            notes={
              guestStorageField?.notes ??
              (host.account.required === true ? "A free account is required for persistent storage on this service." : "-")
            }
          />
          <InfoPair
            label="Storage (account)"
            value={host.filters.storageAccountLabel}
            host={host}
            refs={accountStorageField?.source_refs}
            notes={
              accountStorageField?.notes ??
              (host.account.required === false && guestStorageField
                ? "No separate free-account storage quota is published; the free account appears to use the same storage ceiling as guest use."
                : "-")
            }
          />
          <InfoPair
            label="Bandwidth"
            value={host.filters.bandwidthLabel}
            host={host}
            refs={host.limits.bandwidth.source_refs}
            notes={host.limits.bandwidth.notes}
          />
          <InfoPair
            label="Retention"
            value={host.filters.retentionLabel}
            host={host}
            refs={host.limits.retention.source_refs}
            notes={host.limits.retention.notes}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoPair label="Account" value={host.account.benefits} host={host} refs={host.account.source_refs} />
          <InfoPair
            label="Allowed file types"
            value={host.content.allowed_file_types.notes}
            host={host}
            refs={host.content.allowed_file_types.source_refs}
          />
          <InfoPair
            label="Developer support"
            value={`${host.developer.api_available ? "API" : "No API"}, ${host.developer.cli_friendly ? "CLI-friendly" : "No CLI"}`}
            host={host}
            refs={host.developer.source_refs}
          />
          <InfoPair
            label="Security"
            value={host.security.e2ee ? "E2EE" : "No E2EE"}
            host={host}
            refs={host.security.source_refs}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="group/card rounded-[var(--radius-panel)] border border-[var(--line)] bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] p-4 backdrop-blur-sm transition-all hover:border-[var(--accent)]/30 hover:shadow-[0_8px_24px_-8px_var(--accent-glow)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] bg-[var(--accent-soft)] shadow-sm transition-transform group-hover/card:scale-110">
              <TerminalWindow size={20} weight="fill" className="text-[var(--accent)]" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Developer</div>
            <div className="mt-2 text-sm font-medium text-[var(--text-primary)]">
              {host.developer.api_available ? "API Available" : "No Public API"}
            </div>
          </div>
          <div className="group/card rounded-[var(--radius-panel)] border border-[var(--line)] bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] p-4 backdrop-blur-sm transition-all hover:border-[var(--accent)]/30 hover:shadow-[0_8px_24px_-8px_var(--accent-glow)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] bg-[var(--good-soft)] shadow-sm transition-transform group-hover/card:scale-110">
              <ShieldCheck size={20} weight="fill" className="text-[var(--good)]" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Security</div>
            <div className="mt-2 text-sm font-medium text-[var(--text-primary)]">
              {host.security.e2ee ? "E2EE Enabled" : "No E2EE"}
            </div>
          </div>
          <div className="group/card rounded-[var(--radius-panel)] border border-[var(--line)] bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] p-4 backdrop-blur-sm transition-all hover:border-[var(--accent)]/30 hover:shadow-[0_8px_24px_-8px_var(--accent-glow)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] bg-[var(--warn-soft)] shadow-sm transition-transform group-hover/card:scale-110">
              <Lock size={20} weight="fill" className="text-[var(--warn)]" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Access</div>
            <div className="mt-2 text-sm font-medium text-[var(--text-primary)]">{host.accountLabel}</div>
          </div>
        </div>

        <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2.5 text-sm font-bold text-[var(--text-primary)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] bg-[var(--accent-soft)]">
              <Database size={18} weight="fill" className="text-[var(--accent)]" />
            </div>
            <span>Source References</span>
          </div>
          <div className="space-y-2.5">
            {host.sources.map((source, index) => (
              <a
                key={`${source.label}-${source.url}`}
                id={`host-source-${host.id}-${index}`}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="group/source block rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--surface-1)] p-3.5 transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)]/30 hover:shadow-[0_4px_16px_-4px_var(--accent-glow)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-primary)]">
                    <LinkSimple size={16} weight="fill" className="text-[var(--accent)] transition-transform group-hover/source:translate-x-0.5" />
                    <span>
                      [{index + 1}] {source.label}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)]">{source.retrieved_at}</div>
                </div>
                <div className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{source.notes}</div>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {host.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-1)] px-3 py-1.5 text-[11px] text-[var(--text-secondary)] transition-all hover:border-[var(--accent)]/30 hover:text-[var(--text-primary)] hover:shadow-[0_0_12px_-2px_var(--accent-glow)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
