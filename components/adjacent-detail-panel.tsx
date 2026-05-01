"use client";

import { Database, LinkSimple, Lock, ShieldCheck, TerminalWindow } from "@phosphor-icons/react";
import type { AdjacentRecord } from "@/lib/site-data";
import { SourceRefLinks } from "./source-ref-links";

function InfoPair({
  label,
  value,
  record,
  refs,
  notes
}: {
  label: string;
  value: string;
  record: AdjacentRecord;
  refs?: number[];
  notes?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">
        {label}
      </div>
      <div className="text-sm leading-6 text-[var(--text-primary)]">
        {value}{" "}
        <SourceRefLinks
          record={record}
          refs={refs}
          className="inline-flex items-center gap-0.5 whitespace-nowrap align-super"
        />
      </div>
      {notes && notes !== "-" ? <div className="text-xs italic text-[var(--text-muted)]">{notes}</div> : null}
    </div>
  );
}

function kindLabel(kind: AdjacentRecord["kind"]) {
  if (kind === "alternative") return "Alternative method";
  if (kind === "mirror_uploader") return "Mirror uploader";
  return "Cloud migration";
}

export function AdjacentDetailPanel({ record }: { record: AdjacentRecord | null }) {
  if (!record) {
    return (
      <aside className="rounded-[var(--radius-card)] border border-[var(--line)] bg-gradient-to-br from-[var(--panel)] to-[var(--surface-2)] p-6 backdrop-blur-2xl">
        <div className="flex h-full min-h-[20rem] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--surface-3)] shadow-inner">
              <Database size={32} weight="duotone" className="text-[var(--text-muted)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-muted)]">Select a service to view details</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="group rounded-[var(--radius-card)] border border-[var(--line)] bg-gradient-to-br from-[var(--panel)] to-[var(--surface-2)] p-4 shadow-[var(--shadow-raised)] backdrop-blur-2xl transition-all hover:border-[var(--line-strong)] hover:shadow-[0_32px_100px_-32px_rgba(0,0,0,0.8)] sm:p-5 lg:p-6">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-[var(--radius-pill)] bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
              <div className="text-[9px] font-bold uppercase tracking-[0.35em] text-[var(--text-muted)]">
                {kindLabel(record.kind)}
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)] sm:text-[1.75rem]">
              {record.name}
            </h2>
          </div>
          <a
            href={record.url}
            target="_blank"
            rel="noreferrer"
            className="group/link flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] shadow-sm transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-soft-content)] hover:shadow-[0_0_24px_-4px_var(--accent-glow)]"
          >
            <LinkSimple size={14} weight="bold" className="transition-transform group-hover/link:translate-x-0.5" />
            <span>Open site</span>
          </a>
        </div>

        <p className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-4 text-sm leading-relaxed text-[var(--text-secondary)] backdrop-blur-sm">
          {record.summary}
        </p>

        {record.kind === "alternative" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoPair
              label="Primary use"
              value={record.labels.primaryUse}
              record={record}
              refs={record.profile.primary_use.source_refs}
              notes={record.profile.primary_use.notes}
            />
            <InfoPair
              label="Sharing surface"
              value={record.labels.sharingSurface}
              record={record}
              refs={record.profile.sharing_surface.source_refs}
              notes={record.profile.sharing_surface.notes}
            />
            <InfoPair
              label="Max item size"
              value={record.labels.maxFileSize}
              record={record}
              refs={record.profile.max_file_size.source_refs}
              notes={record.profile.max_file_size.notes}
            />
            <InfoPair
              label="Persistence"
              value={record.labels.persistenceModel}
              record={record}
              refs={record.profile.persistence_model.source_refs}
              notes={record.profile.persistence_model.notes}
            />
            <InfoPair
              label="Storage model"
              value={record.labels.storageModel}
              record={record}
              refs={record.profile.storage_model.source_refs}
              notes={record.profile.storage_model.notes}
            />
            <InfoPair
              label="Bandwidth model"
              value={record.labels.bandwidthModel}
              record={record}
              refs={record.profile.bandwidth_model.source_refs}
              notes={record.profile.bandwidth_model.notes}
            />
          </div>
        ) : null}

        {record.kind === "mirror_uploader" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoPair
              label="Max upload"
              value={record.labels.maxFileSize}
              record={record}
              refs={record.profile.max_file_size.source_refs}
              notes={record.profile.max_file_size.notes}
            />
            <InfoPair
              label="Guest uploads"
              value={record.labels.guestUploads}
              record={record}
              refs={record.profile.guest_uploads.source_refs}
              notes={record.profile.guest_uploads.notes}
            />
            <InfoPair
              label="Remote import"
              value={record.labels.remoteImport}
              record={record}
              refs={record.profile.remote_import.source_refs}
              notes={record.profile.remote_import.notes}
            />
            <InfoPair
              label="Torrent import"
              value={record.labels.torrentImport}
              record={record}
              refs={record.profile.torrent_import.source_refs}
              notes={record.profile.torrent_import.notes}
            />
            <InfoPair
              label="Stores files itself"
              value={record.labels.storesFilesItself}
              record={record}
              refs={record.profile.stores_files_itself.source_refs}
              notes={record.profile.stores_files_itself.notes}
            />
            <InfoPair
              label="Retention model"
              value={record.labels.retentionModel}
              record={record}
              refs={record.profile.retention_model.source_refs}
              notes={record.profile.retention_model.notes}
            />
            <InfoPair
              label="Downstream dependency"
              value={record.labels.downstreamDependency}
              record={record}
              refs={record.profile.downstream_dependency.source_refs}
              notes={record.profile.downstream_dependency.notes}
            />
          </div>
        ) : null}

        {record.kind === "cloud_migration" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoPair
              label="Workflow modes"
              value={record.labels.workflowModes}
              record={record}
              refs={record.profile.workflow_modes.source_refs}
              notes={record.profile.workflow_modes.notes}
            />
            <InfoPair
              label="Execution model"
              value={record.labels.executionModel}
              record={record}
              refs={record.profile.execution_model.source_refs}
              notes={record.profile.execution_model.notes}
            />
            <InfoPair
              label="Item limit"
              value={record.labels.itemLimit}
              record={record}
              refs={record.profile.item_limit.source_refs}
              notes={record.profile.item_limit.notes}
            />
            <InfoPair
              label="Included storage"
              value={record.labels.includedStorage}
              record={record}
              refs={record.profile.included_storage.source_refs}
              notes={record.profile.included_storage.notes}
            />
            <InfoPair
              label="Scheduled runs"
              value={record.labels.scheduledRuns}
              record={record}
              refs={record.profile.scheduled_runs.source_refs}
              notes={record.profile.scheduled_runs.notes}
            />
            <InfoPair
              label="Provider dependency"
              value={record.labels.providerDependency}
              record={record}
              refs={record.profile.provider_dependency.source_refs}
              notes={record.profile.provider_dependency.notes}
            />
            <InfoPair
              label="Bandwidth model"
              value={record.labels.bandwidthModel}
              record={record}
              refs={record.profile.bandwidth_model.source_refs}
              notes={record.profile.bandwidth_model.notes}
            />
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoPair label="Account" value={record.account.benefits} record={record} refs={record.account.source_refs} />
          <InfoPair
            label="Allowed file types"
            value={record.content.allowed_file_types.notes}
            record={record}
            refs={record.content.allowed_file_types.source_refs}
          />
          <InfoPair
            label="Developer support"
            value={`${record.developer.api_available ? "API" : "No API"}, ${record.developer.cli_friendly ? "CLI-friendly" : "No CLI"}`}
            record={record}
            refs={record.developer.source_refs}
          />
          <InfoPair
            label="Security"
            value={record.security.e2ee ? "E2EE" : "No E2EE"}
            record={record}
            refs={record.security.source_refs}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="group/card rounded-[var(--radius-panel)] border border-[var(--line)] bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] p-4 backdrop-blur-sm transition-all hover:border-[var(--accent)]/30 hover:shadow-[0_8px_24px_-8px_var(--accent-glow)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] bg-[var(--accent-soft)] shadow-sm transition-transform group-hover/card:scale-110">
              <TerminalWindow size={20} weight="fill" className="text-[var(--accent)]" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Developer</div>
            <div className="mt-2 text-sm font-medium text-[var(--text-primary)]">
              {record.developer.api_available ? "API Available" : "No Public API"}{" "}
              <SourceRefLinks record={record} refs={record.developer.source_refs} />
            </div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">
              {record.developer.cli_friendly ? "CLI-friendly" : "No CLI"}
            </div>
          </div>
          <div className="group/card rounded-[var(--radius-panel)] border border-[var(--line)] bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] p-4 backdrop-blur-sm transition-all hover:border-[var(--accent)]/30 hover:shadow-[0_8px_24px_-8px_var(--accent-glow)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] bg-[var(--good-soft)] shadow-sm transition-transform group-hover/card:scale-110">
              <ShieldCheck size={20} weight="fill" className="text-[var(--good)]" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Security</div>
            <div className="mt-2 text-sm font-medium text-[var(--text-primary)]">
              {record.security.e2ee ? "E2EE Enabled" : "No E2EE"}{" "}
              <SourceRefLinks record={record} refs={record.security.source_refs} />
            </div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">
              {record.security.https_only ? "HTTPS only" : "Mixed/unknown HTTP policy"}
            </div>
          </div>
          <div className="group/card rounded-[var(--radius-panel)] border border-[var(--line)] bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] p-4 backdrop-blur-sm transition-all hover:border-[var(--accent)]/30 hover:shadow-[0_8px_24px_-8px_var(--accent-glow)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] bg-[var(--warn-soft)] shadow-sm transition-transform group-hover/card:scale-110">
              <Lock size={20} weight="fill" className="text-[var(--warn)]" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Access</div>
            <div className="mt-2 text-sm font-medium text-[var(--text-primary)]">
              {record.accountLabel} <SourceRefLinks record={record} refs={record.account.source_refs} />
            </div>
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
            {record.sources.map((source, index) => (
              <a
                key={`${source.label}-${source.url}`}
                id={`host-source-${record.id}-${index}`}
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
          {record.tags.map((tag) => (
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
