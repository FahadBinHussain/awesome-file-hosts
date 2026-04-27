"use client";

import { Database, LinkSimple, Lock, ShieldCheck, TerminalWindow } from "@phosphor-icons/react";
import type { HostRecord } from "@/lib/site-data";

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">{label}</div>
      <div className="text-sm leading-6 text-[var(--text)]">{value}</div>
    </div>
  );
}

export function HostDetailPanel({ host }: { host: HostRecord | null }) {
  if (!host) {
    return (
      <aside className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-5">
        <div className="flex h-full min-h-[18rem] items-center justify-center text-sm text-[var(--muted)]">
          Pick a host to inspect.
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-5">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--soft)]">
              Host detail
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{host.name}</h2>
          </div>
          <a
            href={host.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[var(--line)] px-3 py-2 text-xs text-[var(--muted)] transition hover:text-white"
          >
            Open site
          </a>
        </div>

        <p className="text-sm leading-7 text-[var(--muted)]">{host.summary}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoPair
            label="Max file size"
            value={`${host.filters.maxFileLabel} - ${host.limits.max_file_size.notes}`}
          />
          <InfoPair
            label="Retention"
            value={`${host.filters.retentionLabel} - ${host.limits.retention.notes}`}
          />
          <InfoPair
            label="Storage"
            value={`${host.filters.storageLabel} - ${host.limits.storage.notes}`}
          />
          <InfoPair
            label="Bandwidth"
            value={`${host.filters.bandwidthLabel} - ${host.limits.bandwidth.notes}`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoPair label="Account" value={host.account.benefits} />
          <InfoPair label="Allowed file types" value={host.content.allowed_file_types.notes} />
          <InfoPair
            label="Developer support"
            value={`${host.developer.api_available ? "API" : "No API"}, ${host.developer.cli_friendly ? "CLI-friendly" : "no CLI"} - ${host.developer.notes}`}
          />
          <InfoPair
            label="Security"
            value={`${host.security.e2ee ? "E2EE" : "No E2EE"} - ${host.security.notes}`}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <TerminalWindow size={16} />
              Dev
            </div>
            <div className="mt-3 text-sm text-[var(--muted)]">
              {host.developer.api_available ? "API available" : "No public API"}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <ShieldCheck size={16} />
              Encryption
            </div>
            <div className="mt-3 text-sm text-[var(--muted)]">
              {host.security.e2ee ? "End-to-end claims present" : "No E2EE claim"}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Lock size={16} />
              Access
            </div>
            <div className="mt-3 text-sm text-[var(--muted)]">{host.accountLabel}</div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Database size={18} />
            Source references
          </div>
          <div className="mt-4 space-y-3">
            {host.sources.map((source) => (
              <a
                key={`${source.label}-${source.url}`}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-[1.25rem] border border-[rgba(255,255,255,0.06)] px-4 py-3 transition hover:border-[rgba(73,179,255,0.25)] hover:bg-[rgba(73,179,255,0.06)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <LinkSimple size={16} />
                    {source.label}
                  </div>
                  <div className="text-xs text-[var(--soft)]">{source.retrieved_at}</div>
                </div>
                <div className="mt-2 text-sm leading-6 text-[var(--muted)]">{source.notes}</div>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {host.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
