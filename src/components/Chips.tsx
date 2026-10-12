import { Check, Clock } from 'lucide-react'
import { deadlineStatus } from '../lib/deadlines'
import { formatShortDeadline } from '../lib/format'

const chip = 'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[.78rem] font-semibold'

export function DeadlineChip({ deadline, today }: { deadline: string; today: string }) {
  const status = deadlineStatus(deadline, today)
  if (status.state === 'closed') {
    return <span className={`${chip} border border-line text-muted`}>Closed {formatShortDeadline(deadline)}</span>
  }
  if (status.state === 'open') {
    return <span className={`${chip} border border-line text-fg`}>Due {formatShortDeadline(deadline)}</span>
  }
  return (
    <span className={`${chip} ${status.state === 'today' ? 'bg-accent text-accent-fg' : 'bg-yellow text-yellow-fg'}`}>
      <Clock aria-hidden className="size-3.5" />
      {status.label}
    </span>
  )
}

export function MatchChip() {
  return (
    <span className={`${chip} bg-mint text-mint-fg`}>
      <Check aria-hidden className="size-3.5" />
      Matches your profile
    </span>
  )
}
