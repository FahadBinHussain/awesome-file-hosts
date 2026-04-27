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
        <SourceRefLinks host={host} refs={refs} className="inline-flex flex-wrap gap-1 align-middle" />
      </div>
      {notes && notes !== "-" ? <div className="text-xs italic text-[var(--text-muted)]">{notes}</div> : null}
    </div>
  );
}

export function HostDetailPanel({ host }: { host: HostRecord | null }) {
  if (!host) {
    return (
      <aside className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--panel)] p-5">
        <div className="flex h-full min-h-[18rem] items-center justify-center text-sm text-[var(--text-muted)]">
          Pick a host to inspect.
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
    <aside className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--panel)] p-5">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
              <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
                Host detail
              </div>
            </div>
            <h2 className="mt-2.5 text-xl font-semibold tracking-tight text-[var(--text-primary)]">{host.name}</h2>
          </div>
          <a
            href={host.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-1)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--accent)]/30 hover:text-[var(--text-primary)] hover:shadow-[0_0_20px_-4px_var(--accent-glow)]"
          >
            Open site
          </a>
        </div>

        <p className="text-sm leading-7 text-[var(--text-secondary)]">{host.summary}</p>

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

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-4 backdrop-blur-sm transition-all hover:border-[var(--line-strong)] hover:bg-[var(--surface-3)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <TerminalWindow size={16} weight="fill" />
              Dev
            </div>
            <div className="mt-2.5 text-sm text-[var(--text-secondary)]">
              {host.developer.api_available ? "API available" : "No public API"}
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-4 backdrop-blur-sm transition-all hover:border-[var(--line-strong)] hover:bg-[var(--surface-3)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <ShieldCheck size={16} weight="fill" />
              Encryption
            </div>
            <div className="mt-2.5 text-sm text-[var(--text-secondary)]">
              {host.security.e2ee ? "End-to-end claims present" : "No E2EE claim"}
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-4 backdrop-blur-sm transition-all hover:border-[var(--line-strong)] hover:bg-[var(--surface-3)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Lock size={16} weight="fill" />
              Access
            </div>
            <div className="mt-2.5 text-sm text-[var(--text-secondary)]">{host.accountLabel}</div>
          </div>
        </div>

        <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <Database size={18} weight="fill" />
            Source references
          </div>
          <div className="mt-4 space-y-3">
            {host.sources.map((source, index) => (
              <a
                key={`${source.label}-${source.url}`}
                id={`host-source-${host.id}-${index}`}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-3 transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--accent-soft)]/40 hover:shadow-[0_0_20px_-4px_var(--accent-glow)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                    <LinkSimple size={16} weight="fill" />
                    <span>
                      [{index + 1}] {source.label}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-[var(--text-muted)]">{source.retrieved_at}</div>
                </div>
                <div className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{source.notes}</div>
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
