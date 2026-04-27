"use client";

import { ArrowRight, GitBranch } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function HomeCTA() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] opacity-[0.12] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4">
        <div className="overflow-hidden rounded-[calc(var(--radius-card)*1.5)] border border-[var(--line)] bg-gradient-to-br from-[rgba(255,255,255,0.04)] to-[rgba(255,255,255,0.01)] p-12 backdrop-blur-2xl md:p-16">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                Ready to explore
              </span>
            </div>

            {/* Headline */}
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Start exploring the dataset
            </h2>

            {/* Description */}
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
              Browse verified hosts, inspect evidence trails, filter by capabilities, 
              and explore the review queue. Everything is transparent, structured, and ready to use.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dataset"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--accent)]/30 bg-[var(--accent)] px-8 py-4 font-semibold text-white shadow-[0_0_40px_-8px_var(--accent-glow)] transition-all hover:scale-[1.02] hover:shadow-[0_0_60px_-8px_var(--accent-glow)]"
              >
                <span className="relative z-10">View Full Dataset</span>
                <ArrowRight size={20} weight="bold" className="relative z-10 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>

              <a
                href="https://github.com/yourusername/awesome-file-hosts"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-[var(--radius-2xl)] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-8 py-4 font-semibold text-white backdrop-blur-xl transition-all hover:border-[var(--line-strong)] hover:bg-[rgba(255,255,255,0.06)]"
              >
                <GitBranch size={20} weight="bold" />
                <span>Contribute on GitHub</span>
              </a>
            </div>

            {/* Stats footer */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-[var(--line)] pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-[var(--text-muted)]">Open Source</div>
              </div>
              <div className="h-12 w-px bg-[var(--line)]" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">MIT</div>
                <div className="text-sm text-[var(--text-muted)]">Licensed</div>
              </div>
              <div className="h-12 w-px bg-[var(--line)]" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">JSON</div>
                <div className="text-sm text-[var(--text-muted)]">First</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
