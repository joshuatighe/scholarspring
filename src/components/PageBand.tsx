import type { ReactNode } from 'react'

/** The forest-green band that opens every page. */
export function PageBand({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="bg-band text-band-fg">
      <div className="shell pt-14 pb-24 max-sm:pt-10 max-sm:pb-20">
        {eyebrow && <p className="eyebrow mb-4 text-accent">{eyebrow}</p>}
        <h1 className="max-w-[820px] text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.02]">{title}</h1>
        {children}
      </div>
    </section>
  )
}

/** Content that overlaps the bottom of a PageBand. */
export function PageBody({ children }: { children: ReactNode }) {
  return <div className="shell relative -mt-14 pb-24">{children}</div>
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-card px-6 py-16 text-center">
      <h2 className="text-[1.7rem]">{title}</h2>
      <div className="mx-auto mt-3 flex max-w-[460px] flex-col items-center gap-5 text-muted">{children}</div>
    </div>
  )
}
