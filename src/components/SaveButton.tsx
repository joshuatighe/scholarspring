import { Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Scholarship } from '../types'

export function SaveButton({ scholarship, className = '' }: { scholarship: Scholarship; className?: string }) {
  const { savedIds, toggleSave } = useApp()
  const saved = savedIds.includes(scholarship.id)
  return (
    <button
      type="button"
      onClick={() => toggleSave(scholarship.id)}
      aria-label={`${saved ? 'Remove' : 'Save'} ${scholarship.name}`}
      aria-pressed={saved}
      className={`grid size-10 shrink-0 place-items-center rounded-full border transition ${
        saved ? 'border-accent bg-accent text-accent-fg' : 'border-line bg-card text-fg hover:border-accent hover:text-accent-text'
      } ${className}`}
    >
      <Heart aria-hidden className={`size-[18px] ${saved ? 'fill-current' : ''}`} />
    </button>
  )
}
