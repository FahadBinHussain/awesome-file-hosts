import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Awesome File Hosts",
  description: "A searchable explorer for verified file hosting services and the review queue behind them."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
