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
            href={`#host-source-${host.id}-${ref}`}
            className="text-xs text-[var(--accent)] transition hover:text-white"
            title={source.label}
          >
            [{ref + 1}]
          </a>
        );
      })}
    </span>
  );
}
