import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Awesome File Hosts",
  description: "A searchable explorer for verified file hosting services and the review queue behind them."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              const savedTheme = localStorage.getItem('theme') || 'system';
              const theme = savedTheme === 'system'
                ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
                : savedTheme;
              document.documentElement.setAttribute('data-theme', theme);
            } catch {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          `}
        </Script>
        <Script id="dataset-mode-init" strategy="beforeInteractive">
          {`
            try {
              const path = window.location.pathname.replace(/\\/$/, '');
              if (path === '/dataset') {
                const params = new URLSearchParams(window.location.search);
                const requestedMode = params.get('mode');
                const savedMode = localStorage.getItem('awesome-file-hosts:dataset-view-mode');
                const mode = requestedMode === 'simple' || requestedMode === 'full' ? requestedMode : savedMode;
                if (mode === 'simple') {
                  document.documentElement.setAttribute('data-dataset-mode', 'simple');
                }
              }
            } catch {}
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
