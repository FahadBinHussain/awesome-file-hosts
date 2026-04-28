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

export function ThemeSwitcher() {
  const [theme, setTheme] = useState("dark");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative z-[120] isolate">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--line)] bg-[var(--surface-2)] px-3 text-xs font-medium text-[var(--text-secondary)] backdrop-blur-xl transition-all hover:border-[var(--line-strong)] hover:bg-[var(--surface-4)] hover:text-[var(--text-primary)]"
        aria-label="Change theme"
      >
        <Palette size={14} weight="fill" />
        <span className="hidden capitalize sm:inline">{theme}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9999] bg-[color-mix(in_oklab,black_18%,transparent)]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-[10001] isolate max-h-96 w-48 overflow-auto rounded-[var(--radius-card)] border border-[var(--line-strong)] bg-[var(--bg)] p-2 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.92),0_0_0_1px_var(--line)] scrollbar-subtle">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => changeTheme(t)}
                className={[
                  "w-full rounded-[var(--radius-control)] px-4 py-2 text-left text-sm capitalize transition-all",
                  theme === t
                    ? "bg-[var(--accent-soft)] text-[var(--accent-content)] font-medium"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)]"
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
