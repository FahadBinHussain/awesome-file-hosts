"use client";

import { ArrowRight, GitBranch } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function HomeCTA() {
  return (
    <section className="relative w-full overflow-hidden px-4 py-20 md:py-32">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-pill)] bg-[var(--accent)] opacity-[0.12] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[calc(var(--radius-card)*1.5)] border border-[var(--line)] bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-1)] p-6 backdrop-blur-2xl sm:p-8 md:p-12 lg:p-16">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-2">
              <div className="h-2 w-2 rounded-[var(--radius-pill)] bg-[var(--accent)] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-content)]">
                Ready to explore
              </span>
            </div>

            {/* Headline */}
            <h2 className="mb-5 text-3xl font-bold tracking-tight text-[var(--hero-heading)] sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl">
              Start exploring the dataset
            </h2>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg md:mb-10">
              Browse verified hosts, inspect evidence trails, filter by capabilities, 
              and explore the review queue. Everything is transparent, structured, and ready to use.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                href="/dataset"
                className="group relative inline-flex min-h-[52px] items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--accent)]/30 bg-[var(--accent)] px-6 py-3.5 text-center font-semibold text-[var(--accent-content)] shadow-[0_0_40px_-8px_var(--accent-glow)] transition-all hover:scale-[1.02] hover:shadow-[0_0_60px_-8px_var(--accent-glow)] sm:px-8 sm:py-4"
              >
                <span className="relative z-10">View Full Dataset</span>
                <ArrowRight size={20} weight="bold" className="relative z-10 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>

              <a
                href="https://github.com/FahadBinHussain/awesome-file-hosts"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[var(--radius-2xl)] border border-[var(--line)] bg-[var(--surface-1)] px-6 py-3.5 text-center font-semibold text-[var(--text-primary)] backdrop-blur-xl transition-all hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)] sm:px-8 sm:py-4"
              >
                <GitBranch size={20} weight="bold" />
                <span>Contribute on GitHub</span>
              </a>
            </div>

            {/* Stats footer */}
            <div className="mt-10 flex flex-col items-center justify-center gap-5 border-t border-[var(--line)] pt-6 sm:flex-row sm:flex-wrap sm:gap-8 sm:pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--hero-heading)]">100%</div>
                <div className="text-sm text-[var(--text-muted)]">Open Source</div>
              </div>
              <div className="hidden h-12 w-px bg-[var(--line)] sm:block" />
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--hero-heading)]">MIT</div>
                <div className="text-sm text-[var(--text-muted)]">Licensed</div>
              </div>
              <div className="hidden h-12 w-px bg-[var(--line)] sm:block" />
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--hero-heading)]">JSON</div>
                <div className="text-sm text-[var(--text-muted)]">First</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
