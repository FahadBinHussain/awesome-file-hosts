"use client";

import type { SourceBackedRecord } from "@/lib/site-data";

type Props = {
  record: SourceBackedRecord;
  refs?: number[];
  className?: string;
};

export function SourceRefLinks({ record, refs, className }: Props) {
  if (!refs?.length) {
    return null;
  }

  const uniqueRefs = [...new Set(refs)];

  return (
    <span className={className ?? "inline-flex items-center gap-0.5 whitespace-nowrap align-super"}>
      {uniqueRefs.map((ref) => {
        const source = record.sources[ref];
        if (!source) {
          return null;
        }

        return (
          <a
            key={`${record.id}-ref-${ref}`}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center rounded-sm px-0.5 py-0 text-[9px] font-mono leading-none text-[var(--accent)]/90 transition-all hover:text-[var(--accent-hover)] hover:underline hover:decoration-[var(--accent)]/50 hover:underline-offset-2"
            title={source.label}
          >
            [{ref + 1}]
          </a>
        );
      })}
    </span>
  );
}
