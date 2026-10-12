const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

/** 10000 → "$10,000" */
export function formatAmount(amount: number): string {
  return dollars.format(amount)
}

// Deadlines are calendar dates ("2026-04-30"); format them in UTC so the day never shifts with the viewer's time zone.
const longDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

/** "2026-04-30" → "Apr 30, 2026" */
export function formatDeadline(isoDate: string): string {
  return longDate.format(new Date(`${isoDate}T00:00:00Z`))
}

/** "2026-04-30" → "Apr 30" */
export function formatShortDeadline(isoDate: string): string {
  return shortDate.format(new Date(`${isoDate}T00:00:00Z`))
}
