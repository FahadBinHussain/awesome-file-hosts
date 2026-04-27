"use client";

import type { HostRecord } from "@/lib/site-data";

type Props = {
  host: HostRecord;
  refs?: number[];
  className?: string;
};

export function SourceRefLinks({ host, refs, className }: Props) {
  if (!refs?.length) {
    return null;
  }

  return (
    <span className={className ?? "inline-flex flex-wrap gap-1"}>
      {refs.map((ref) => {
        const source = host.sources[ref];
        if (!source) {
          return null;
        }

        return (
          <a
            key={`${host.id}-ref-${ref}`}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono text-[var(--accent)] transition-all hover:bg-[var(--accent-soft)] hover:text-[var(--accent-hover)] hover:shadow-[0_0_12px_-2px_var(--accent-glow)]"
            title={source.label}
          >
            [{ref + 1}]
          </a>
        );
      })}
    </span>
  );
}
