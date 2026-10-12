/** Deadlines within this many days count as closing soon. */
export const CLOSING_SOON_DAYS = 14

export type DeadlineState = 'open' | 'soon' | 'today' | 'closed'

export interface DeadlineStatus {
  state: DeadlineState
  /** Whole days from today to the deadline; negative once it has passed. */
  daysLeft: number
  /** Short label for a chip, e.g. "Closes in 5 days". */
  label: string
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Today's calendar date where the student is, as "YYYY-MM-DD". */
export function localToday(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

const dayNumber = (isoDate: string) => Date.UTC(+isoDate.slice(0, 4), +isoDate.slice(5, 7) - 1, +isoDate.slice(8, 10)) / 86_400_000

/** Where a deadline stands relative to `today`. A scholarship is open through the end of its deadline day. */
export function deadlineStatus(deadline: string, today: string): DeadlineStatus {
  const daysLeft = Math.round(dayNumber(deadline) - dayNumber(today))
  if (daysLeft < 0) return { state: 'closed', daysLeft, label: 'Closed' }
  if (daysLeft === 0) return { state: 'today', daysLeft, label: 'Closes today' }
  if (daysLeft <= CLOSING_SOON_DAYS) {
    return { state: 'soon', daysLeft, label: daysLeft === 1 ? 'Closes tomorrow' : `Closes in ${daysLeft} days` }
  }
  return { state: 'open', daysLeft, label: 'Open' }
}

export const isOpen = (deadline: string, today: string) => deadlineStatus(deadline, today).state !== 'closed'
