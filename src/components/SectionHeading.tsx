export function SectionHeading({ eyebrow, title, summary }: { eyebrow: string; title: string; summary: string }) {
  return (
    <div className="mb-7 flex items-end justify-between max-sm:block">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="m-0 font-display text-[2.4rem] tracking-[-.04em]">{title}</h2>
      </div>
      <p className="text-[.9rem] text-muted max-sm:mt-2.5">{summary}</p>
    </div>
  )
}
