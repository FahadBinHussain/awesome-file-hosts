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
            const theme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', theme);
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
