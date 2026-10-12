import type { Scholarship } from '../types'
import { ScholarshipCard } from './ScholarshipCard'

interface Props {
  scholarships: Scholarship[]
  savedIds: string[]
  onToggleSave: (id: string) => void
  onShowDetail: (id: string) => void
}

export function ScholarshipGrid({ scholarships, savedIds, onToggleSave, onShowDetail }: Props) {
  return (
    <div className="grid grid-cols-3 gap-[18px] max-md:grid-cols-2 max-sm:grid-cols-1">
      {scholarships.map((s) => (
        <ScholarshipCard
          key={s.id}
          scholarship={s}
          saved={savedIds.includes(s.id)}
          onToggleSave={onToggleSave}
          onShowDetail={onShowDetail}
        />
      ))}
    </div>
  )
}
