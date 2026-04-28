"use client";

import { ArrowRight, Database, GitBranch, ShieldCheck, Sparkle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function HomeHero({ stats }: { stats: { verifiedHosts: number; pendingCandidates: number; rejectedCandidates: number } }) {
  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[20%] h-[500px] w-[500px] animate-pulse rounded-[var(--radius-pill)] bg-[var(--accent)] opacity-[0.08] blur-[120px]" style={{ animationDuration: "8s" }} />
        <div className="absolute right-[15%] top-[40%] h-[400px] w-[400px] animate-pulse rounded-[var(--radius-pill)] bg-[var(--hero-secondary-glow)] opacity-[0.06] blur-[100px]" style={{ animationDuration: "10s", animationDelay: "2s" }} />
        <div className="absolute bottom-[10%] left-[40%] h-[350px] w-[350px] animate-pulse rounded-[var(--radius-pill)] bg-[var(--good)] opacity-[0.05] blur-[90px]" style={{ animationDuration: "12s", animationDelay: "4s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
        {/* Badge */}
        <div className="animate-fade-in-up mb-8 flex justify-center">
          <div className="group inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--hero-surface)] px-4 py-2 backdrop-blur-xl transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--hero-surface-strong)]">
            <Sparkle size={16} weight="fill" className="text-[var(--accent)] animate-pulse" />
            <span className="text-xs font-medium tracking-wide text-[var(--text-secondary)]">
              Source-backed file host intelligence
            </span>
            <div className="h-1 w-1 rounded-[var(--radius-pill)] bg-[var(--accent)] animate-pulse" />
          </div>
        </div>

        {/* Hero headline */}
        <div className="animate-fade-in-up mb-6 text-center" style={{ animationDelay: "0.1s" }}>
          <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-[1.1] tracking-tight text-[var(--hero-heading)] md:text-7xl lg:text-8xl">
            The most comprehensive
            <span className="relative mx-3 inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[var(--accent)] via-[var(--hero-secondary-glow)] to-[var(--accent)] bg-clip-text text-transparent">
                file host
              </span>
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[var(--accent)] via-[var(--hero-secondary-glow)] to-[var(--accent)] opacity-20 blur-2xl" />
            </span>
            dataset on the internet
          </h1>
        </div>

        {/* Subheadline */}
        <p className="animate-fade-in-up mx-auto mb-12 max-w-3xl text-center text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl" style={{ animationDelay: "0.2s" }}>
          Curated, verified, and structured data on {stats.verifiedHosts} file hosting services. 
          Every field backed by public sources. Every decision tracked. Every rejection documented.
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-in-up mb-16 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/dataset"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--accent)]/30 bg-[var(--accent)] px-8 py-4 font-semibold text-[var(--accent-content)] shadow-[0_0_40px_-8px_var(--accent-glow)] transition-all hover:scale-[1.02] hover:shadow-[0_0_60px_-8px_var(--accent-glow)]"
          >
            <span className="relative z-10">Explore Dataset</span>
            <ArrowRight size={20} weight="bold" className="relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          
          <a
            href="https://github.com/yourusername/awesome-file-hosts"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-[var(--radius-2xl)] border border-[var(--line)] bg-[var(--hero-surface)] px-8 py-4 font-semibold text-[var(--hero-heading)] backdrop-blur-xl transition-all hover:border-[var(--line-strong)] hover:bg-[var(--hero-surface-strong)]"
          >
            <GitBranch size={20} weight="bold" />
            <span>View on GitHub</span>
          </a>
        </div>

        {/* Stats grid */}
        <div className="animate-fade-in-up grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ animationDelay: "0.4s" }}>
          {[
            { label: "Verified Hosts", value: stats.verifiedHosts, icon: ShieldCheck, color: "from-[var(--good)] to-emerald-400" },
            { label: "Under Review", value: stats.pendingCandidates, icon: Database, color: "from-[var(--warn)] to-amber-400" },
            { label: "Total Tracked", value: stats.verifiedHosts + stats.pendingCandidates + stats.rejectedCandidates, icon: Sparkle, color: "from-[var(--accent)] to-purple-400" },
            { label: "Rejections Kept", value: stats.rejectedCandidates, icon: Database, color: "from-[var(--bad)] to-rose-400" }
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--line)] bg-[var(--hero-surface)] p-6 backdrop-blur-xl transition-all hover:border-[var(--line-strong)] hover:bg-[var(--hero-surface-strong)]"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <div className="relative z-10">
                <div className={`mb-3 inline-flex rounded-[var(--radius-2xl)] bg-gradient-to-br ${stat.color} p-3 opacity-90`}>
                  <stat.icon size={24} weight="bold" className="text-[var(--accent-content)]" />
                </div>
                <div className="mb-1 text-4xl font-bold tracking-tight text-[var(--hero-heading)]">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-[var(--text-muted)]">{stat.label}</div>
              </div>
              <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-[var(--radius-pill)] bg-gradient-to-br ${stat.color} opacity-0 blur-3xl transition-opacity group-hover:opacity-10`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
