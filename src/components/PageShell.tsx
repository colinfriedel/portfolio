import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";

/** Layout for every inner page: shared header plus a readable panel over the background photo. */
export function PageShell({
  title,
  intro,
  actions,
  children,
}: {
  title: string;
  intro?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="px-4 pt-6 pb-16 sm:px-6 md:px-10 md:pt-10">
        <article className="mx-auto max-w-5xl rounded-2xl bg-paper/90 p-5 shadow-lg backdrop-blur-md sm:p-8 md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">{title}</h1>
              {intro && <p className="mt-2 max-w-prose text-ink-soft">{intro}</p>}
            </div>
            {actions}
          </div>
          <div className="mt-8 space-y-8">{children}</div>
        </article>
      </main>
    </>
  );
}

/** Dashed box marking content that hasn't been written yet. */
export function Placeholder({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border-2 border-dashed border-line p-5">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-ink-soft italic">{children}</p>
    </section>
  );
}
