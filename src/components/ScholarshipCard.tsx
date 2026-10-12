import { Link } from 'react-router'
import { useApp } from '../context/AppContext'
import { formatAmount } from '../lib/format'
import { profileMatch } from '../lib/matching'
import type { Scholarship } from '../types'
import { DeadlineChip, MatchChip } from './Chips'
import { SaveButton } from './SaveButton'

export function ScholarshipCard({ scholarship: s }: { scholarship: Scholarship }) {
  const { auth, today } = useApp()
  const matches = auth.user ? profileMatch(s, auth.user).all : false
  return (
    <article className="group relative flex min-h-[290px] flex-col rounded-3xl border border-line bg-card p-6 transition duration-200 hover:-translate-y-1 hover:border-fg/30 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <p className="eyebrow pt-1 text-accent-text">{s.category}</p>
        <SaveButton scholarship={s} className="relative z-10" />
      </div>
      <p className="mt-3 font-display text-[2.7rem] leading-none font-bold tracking-[-0.03em] tabular-nums">{formatAmount(s.amount)}</p>
      <h3 className="mt-4 text-[1.3rem] leading-tight">
        <Link to={`/scholarships/${s.id}`} className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent">
          {s.name}
        </Link>
      </h3>
      <p className="mt-1.5 text-[.88rem] text-muted">{s.provider}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        <DeadlineChip deadline={s.deadline} today={today} />
        {matches && <MatchChip />}
      </div>
    </article>
  )
}

export function ScholarshipGrid({ scholarships }: { scholarships: Scholarship[] }) {
  return (
    <div className="grid grid-cols-3 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1">
      {scholarships.map((s) => (
        <ScholarshipCard key={s.id} scholarship={s} />
      ))}
    </div>
  )
}

export function CardSkeletons({ count = 3 }: { count?: number }) {
  return (
    <div aria-busy aria-label="Loading scholarships" className="grid grid-cols-3 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1">
      {Array.from({ length: count }, (_, n) => (
        <div key={n} className="min-h-[290px] animate-pulse rounded-3xl border border-line bg-card" />
      ))}
    </div>
  )
}
