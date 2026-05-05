import { Database } from "@phosphor-icons/react/dist/ssr";
import { AppFrame } from "@/components/app-frame";

export default function DatasetLoading() {
  return (
    <AppFrame current="dataset">
      <section className="min-h-[calc(100dvh-4rem)] px-4 py-6 md:px-6">
        <div className="mx-auto flex min-h-[52vh] w-full max-w-[1120px] flex-col justify-center">
          <div className="rounded-[var(--radius-panel)] border border-[var(--line)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-soft)] md:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] bg-[var(--accent-soft)] text-[var(--accent-soft-content)]">
                <Database size={20} weight="fill" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">Loading Dataset…</div>
                <div className="mt-1 text-xs text-[var(--text-muted)]">
                  Preparing the spreadsheet and recommendation views.
                </div>
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-[var(--radius-pill)] bg-[var(--surface-3)]">
              <div className="route-loading-bar h-full rounded-[var(--radius-pill)] bg-[var(--accent)]" />
            </div>

            <div className="mt-5 grid gap-2">
              <div className="h-9 rounded-[var(--radius-control)] bg-[var(--surface-2)] skeleton-shimmer" />
              <div className="h-9 rounded-[var(--radius-control)] bg-[var(--surface-2)] skeleton-shimmer" />
              <div className="h-9 rounded-[var(--radius-control)] bg-[var(--surface-2)] skeleton-shimmer" />
            </div>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
