"use client";

import { CheckCircle, Code, Database, FileText, GitBranch, Lock, MagnifyingGlass, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

const features = [
  {
    icon: Database,
    title: "JSON-First Architecture",
    description: "The dataset lives in structured JSON files. The README is generated. The site is a lens, not the source.",
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    icon: ShieldCheck,
    title: "Source-Backed Verification",
    description: "Every field links to public evidence. No guesswork, no assumptions, no stale data presented as fact.",
    gradient: "from-emerald-500 to-teal-400"
  },
  {
    icon: Lock,
    title: "Transparent Review Queue",
    description: "Pending candidates and rejected entries stay visible with reasons and references. Nothing disappears.",
    gradient: "from-purple-500 to-pink-400"
  },
  {
    icon: MagnifyingGlass,
    title: "Advanced Filtering",
    description: "Filter by API availability, guest uploads, E2EE, tags, and more. Find exactly what you need.",
    gradient: "from-amber-500 to-orange-400"
  },
  {
    icon: Code,
    title: "Developer-Friendly",
    description: "JSON schemas, TypeScript types, and a clean data structure ready for automation and integration.",
    gradient: "from-rose-500 to-red-400"
  },
  {
    icon: GitBranch,
    title: "Open Contribution",
    description: "Submit hosts, challenge decisions, improve evidence. The dataset grows through community verification.",
    gradient: "from-indigo-500 to-blue-400"
  }
];

export function HomeFeatures() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-4 py-2 backdrop-blur-xl">
            <div className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Why This Exists
            </span>
          </div>
          <h2 className="mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
            Built for reliability, designed for humans
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)]">
            Most file host lists are unmaintained GitHub READMEs with dead links and zero evidence. 
            This is different.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-8 backdrop-blur-xl transition-all hover:border-[var(--line-strong)] hover:bg-[rgba(255,255,255,0.04)] animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative z-10">
                <div className={`mb-5 inline-flex rounded-[var(--radius-2xl)] bg-gradient-to-br ${feature.gradient} p-4 shadow-lg`}>
                  <feature.icon size={28} weight="bold" className="text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
                <p className="leading-relaxed text-[var(--text-secondary)]">{feature.description}</p>
              </div>
              <div className={`absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-3xl transition-opacity group-hover:opacity-[0.08]`} />
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            { icon: FileText, label: "Evidence-First", value: "Every claim sourced" },
            { icon: CheckCircle, label: "Queue-Aware", value: "Rejections preserved" },
            { icon: Database, label: "Machine-Readable", value: "JSON + TypeScript" }
          ].map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-[var(--radius-2xl)] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-6 backdrop-blur-xl animate-fade-in-up"
              style={{ animationDelay: `${0.6 + i * 0.1}s` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-2xl)] bg-[var(--accent-soft)]">
                <item.icon size={24} weight="bold" className="text-[var(--accent)]" />
              </div>
              <div>
                <div className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {item.label}
                </div>
                <div className="text-lg font-bold text-white">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
