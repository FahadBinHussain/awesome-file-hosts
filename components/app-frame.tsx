import Link from "next/link";
import type { ReactNode } from "react";
import { Database, House, Table } from "@phosphor-icons/react/dist/ssr";
import { ThemeSwitcher } from "./theme-switcher";

type Props = {
  children: ReactNode;
  current: "home" | "dataset";
};

function NavLink({
  href,
  active,
  icon,
  label
}: {
  href: "/" | "/dataset";
  active: boolean;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "group relative inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-4 py-2 text-xs font-medium transition-all duration-250",
        active
          ? "rounded-[var(--radius-pill)] border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent-content)] shadow-[0_0_20px_-4px_var(--accent-glow)]"
          : "rounded-[var(--radius-pill)] border-[var(--line)] bg-[var(--surface-1)] text-[var(--text-secondary)] hover:border-[var(--accent)]/40 hover:text-[var(--text-primary)] hover:shadow-[0_0_20px_-6px_var(--accent-glow)]"
      ].join(" ")}
    >
      <span className={[
        "transition-transform duration-250",
        active ? "scale-110" : "group-hover:scale-110"
      ].join(" ")}>
        {icon}
      </span>
      <span>{label}</span>
      {active && (
        <div className="absolute inset-0 rounded-[var(--radius-pill)] bg-gradient-to-r from-[var(--accent)]/5 to-transparent opacity-50" />
      )}
    </Link>
  );
}

export function AppFrame({ children, current }: Props) {
  return (
    <main className="min-h-[100dvh]">
      <div className="mx-auto flex min-h-[100dvh] max-w-[1920px] flex-col">
        <header className="relative z-50 isolate border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--bg)_78%,transparent)] px-4 py-4 backdrop-blur-2xl md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2">
                <div className="h-[18px] w-[2px] rounded-[var(--radius-pill)] bg-gradient-to-b from-[var(--accent)] to-[var(--accent-glow)]" />
                <div className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-muted)] font-semibold">
                  Awesome File Hosts
                </div>
              </div>
              <div className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                JSON-first dataset, source-backed curation, and a clearer lens than a README.
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-2">
              <NavLink
                href="/"
                active={current === "home"}
                icon={<House size={17} weight="fill" />}
                label="Home"
              />
              <NavLink
                href="/dataset"
                active={current === "dataset"}
                icon={<Table size={17} weight="fill" />}
                label="Dataset"
              />
              <div className="ml-1 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-2 text-[11px] text-[var(--text-muted)] font-mono transition-all hover:border-[var(--accent)]/30">
                <Database size={14} weight="duotone" className="text-[var(--accent)]" />
                <span>Source: data/*.json</span>
              </div>
              <ThemeSwitcher />
            </nav>
          </div>
        </header>

        <div className="flex-1 px-4 py-6 md:px-6">{children}</div>
      </div>
    </main>
  );
}
