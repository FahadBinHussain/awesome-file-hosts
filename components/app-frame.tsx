import Link from "next/link";
import type { ReactNode } from "react";
import { Database, House, Table } from "@phosphor-icons/react";

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
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
        active
          ? "border-[rgba(73,179,255,0.3)] bg-[var(--accent-soft)] text-white"
          : "border-[var(--line)] bg-[rgba(255,255,255,0.03)] text-[var(--muted)] hover:text-white"
      ].join(" ")}
    >
      {icon}
      {label}
    </Link>
  );
}

export function AppFrame({ children, current }: Props) {
  return (
    <main className="min-h-[100dvh] px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-[1680px] flex-col gap-4 rounded-[2.75rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(7,9,13,0.82)] p-4 shadow-[0_50px_120px_-50px_rgba(0,0,0,0.75)] backdrop-blur-xl md:min-h-[calc(100dvh-3rem)] md:p-6">
        <header className="flex flex-col gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-[var(--soft)]">
              Awesome File Hosts
            </div>
            <div className="mt-2 text-sm text-[var(--muted)]">
              JSON-first dataset, source-backed curation, and a much better lens than a README.
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            <NavLink
              href="/"
              active={current === "home"}
              icon={<House size={16} />}
              label="Explorer"
            />
            <NavLink
              href="/dataset"
              active={current === "dataset"}
              icon={<Table size={16} />}
              label="Dataset"
            />
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-sm text-[var(--muted)]">
              <Database size={16} />
              Source of truth: `data/*.json`
            </div>
          </nav>
        </header>

        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
