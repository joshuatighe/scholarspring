import { ArrowRight, Heart } from 'lucide-react'
import { shortDeadline } from '../lib/matching'
import type { Scholarship } from '../types'

interface Props {
  scholarship: Scholarship
  saved: boolean
  onToggleSave: (id: string) => void
  onShowDetail: (id: string) => void
}

export function ScholarshipCard({ scholarship: s, saved, onToggleSave, onShowDetail }: Props) {
  return (
    <article className="relative flex min-h-[270px] flex-col rounded-lg border border-line bg-paper p-[23px] transition-all duration-200 hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-start justify-between">
        <span className="text-[.65rem] font-bold tracking-[.11em] text-coral uppercase">{s.category}</span>
        <button
          type="button"
          onClick={() => onToggleSave(s.id)}
          aria-label={`${saved ? 'Remove' : 'Save'} ${s.name}`}
          aria-pressed={saved}
          className={`grid size-[33px] place-items-center rounded-full ${saved ? 'bg-coral text-white' : 'bg-cream text-ink'}`}
        >
          <Heart aria-hidden className={`size-[17px] ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>
      <h3 className="mt-[22px] mb-2 font-display text-[1.45rem] leading-[1.15]">{s.name}</h3>
      <p className="text-[.82rem] text-muted">{s.provider}</p>
      <div className="mt-auto flex gap-3.5 pt-5 text-[.76rem] text-[#62716d]">
        <div>
          AWARD<strong className="mt-1 block text-[.9rem] text-ink">{s.amount}</strong>
        </div>
        <div>
          DEADLINE<strong className="mt-1 block text-[.9rem] text-ink">{shortDeadline(s.deadline)}</strong>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onShowDetail(s.id)}
        className="flex items-center gap-1 pt-[18px] text-left text-[.8rem] font-bold text-coral"
      >
        View scholarship details <ArrowRight aria-hidden className="size-3.5" />
      </button>
    </article>
  )
}
