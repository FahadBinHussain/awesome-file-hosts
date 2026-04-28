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
        "group relative inline-flex items-center gap-1.5 px-2 py-2 text-sm font-medium transition-all duration-200 sm:gap-2 sm:px-3",
        active
          ? "text-[var(--text-primary)]"
          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      ].join(" ")}
    >
      <span className={[
        "transition-all duration-200",
        active ? "text-[var(--accent)]" : "group-hover:text-[var(--accent)]"
      ].join(" ")}>
        {icon}
      </span>
      <span className="hidden text-xs sm:inline sm:text-sm">{label}</span>
      {active && (
        <div className="absolute -bottom-3 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
      )}
    </Link>
  );
}

export function AppFrame({ children, current }: Props) {
  return (
    <main className="min-h-[100dvh] w-full">
      <div className="flex min-h-[100dvh] w-full flex-col">
        <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-[var(--line)] bg-[var(--bg)]/88 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
            <Link href="/" className="group flex shrink-0 items-center gap-2 transition-all sm:gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-control)] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] shadow-[0_0_20px_-4px_var(--accent-glow)] transition-all group-hover:shadow-[0_0_24px_-2px_var(--accent-glow)] sm:h-8 sm:w-8">
                <Database size={16} weight="bold" className="text-white sm:h-[18px] sm:w-[18px]" />
              </div>
              <span className="text-xs font-semibold text-[var(--text-primary)] sm:text-sm md:text-base">
                Awesome File Hosts
              </span>
            </Link>

            <nav className="flex shrink-0 items-center gap-1">
              <NavLink
                href="/"
                active={current === "home"}
                icon={<House size={18} weight={current === "home" ? "fill" : "regular"} />}
                label="Home"
              />
              <NavLink
                href="/dataset"
                active={current === "dataset"}
                icon={<Table size={18} weight={current === "dataset" ? "fill" : "regular"} />}
                label="Dataset"
              />
              <div className="ml-2 h-6 w-[1px] bg-[var(--line)] sm:ml-4" />
              <ThemeSwitcher />
            </nav>
          </div>
        </header>

        <div className="flex-1 pt-16">{children}</div>
      </div>
    </main>
  );
}
