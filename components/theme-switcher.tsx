"use client";

import { Palette } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

const themes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave",
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua",
  "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
  "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter",
  "dim", "nord", "sunset"
];

const themeChoices = ["system", ...themes];

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function normalizeThemeChoice(theme: string | null) {
  if (!theme) return "system";
  return themeChoices.includes(theme) ? theme : "system";
}

function applyThemeChoice(theme: string) {
  const resolvedTheme = theme === "system" ? systemTheme() : theme;
  document.documentElement.setAttribute("data-theme", resolvedTheme);
  return resolvedTheme;
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState("system");
  const [resolvedTheme, setResolvedTheme] = useState("dark");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = normalizeThemeChoice(localStorage.getItem("theme"));
    setTheme(savedTheme);
    setResolvedTheme(applyThemeChoice(savedTheme));

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const updateSystemTheme = () => {
      const currentTheme = normalizeThemeChoice(localStorage.getItem("theme"));
      if (currentTheme === "system") {
        setResolvedTheme(applyThemeChoice(currentTheme));
      }
    };

    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    setResolvedTheme(applyThemeChoice(newTheme));
    setIsOpen(false);
  };

  const buttonLabel = theme === "system" ? `system (${resolvedTheme})` : theme;

  return (
    <div className="relative z-[120] isolate">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-2)] px-3 text-xs font-medium text-[var(--text-secondary)] backdrop-blur-xl transition-all hover:border-[var(--line-strong)] hover:bg-[var(--surface-4)] hover:text-[var(--text-primary)]"
        aria-label="Change theme"
      >
        <Palette size={14} weight="fill" />
        <span className="hidden capitalize sm:inline">{buttonLabel}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9999] bg-[color-mix(in_oklab,black_18%,transparent)]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-[10001] isolate max-h-96 w-48 overflow-auto rounded-[var(--radius-card)] border border-[var(--line-strong)] bg-[var(--bg)] p-2 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.92),0_0_0_1px_var(--line)] scrollbar-subtle">
            {themeChoices.map((t) => (
              <button
                key={t}
                onClick={() => changeTheme(t)}
                className={[
                  "w-full rounded-[var(--radius-control)] px-4 py-2 text-left text-sm capitalize transition-all",
                  theme === t
                    ? "bg-[var(--accent-soft)] text-[var(--accent-soft-content)] font-medium"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)]"
                ].join(" ")}
              >
                <span>{t}</span>
                {t === "system" ? (
                  <span className="ml-1 text-xs text-[var(--text-muted)]">({resolvedTheme})</span>
                ) : null}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
