import { Heart } from 'lucide-react'
import { formatAmount, formatDeadline } from '../lib/format'
import type { Scholarship } from '../types'
import { buttonClass } from './button'
import { Modal } from './Modal'

interface Props {
  scholarship: Scholarship | null
  saved: boolean
  onToggleSave: (id: string) => void
  onClose: () => void
}

export function DetailDialog({ scholarship: s, saved, onToggleSave, onClose }: Props) {
  return (
    <Modal open={s !== null} onClose={onClose} labelledBy="detail-title" wide>
      {s && (
        <>
          <div className="mb-[22px] rounded-[7px] bg-mint p-[25px]">
            <span className="text-[.65rem] font-bold tracking-[.11em] text-coral uppercase">{s.category}</span>
            <h2 id="detail-title" className="my-2.5 font-display text-[2.2rem] leading-[1.1]">
              {s.name}
            </h2>
            <p>{s.provider}</p>
          </div>
          <p className="leading-[1.65] text-[#53635f]">{s.description}</p>
          <div className="my-[22px] grid grid-cols-3 rounded-md bg-cream p-[15px]">
            <Stat label="Award" value={formatAmount(s.amount)} />
            <Stat label="Deadline" value={formatDeadline(s.deadline)} />
            <Stat label="Minimum GPA" value={String(s.gpa)} />
          </div>
          <p className="leading-[1.65] text-[#53635f]">
            <strong>Who it’s for:</strong> {s.eligibility}
          </p>
          <button
            type="button"
            onClick={() => {
              onToggleSave(s.id)
              onClose()
            }}
            className={buttonClass(saved ? 'outline' : 'primary', { full: true })}
          >
            <Heart aria-hidden className={`size-4 ${saved ? 'fill-current' : ''}`} />
            {saved ? 'Saved — remove' : 'Save this scholarship'}
          </button>
        </>
      )}
    </Modal>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-[.7rem] tracking-[.07em] text-muted uppercase">
      {label}
      <strong className="mt-[5px] block text-[1rem] tracking-normal text-ink normal-case">{value}</strong>
    </div>
  )
}
