import { describe, expect, it } from 'vitest'
import { formatAmount, formatDeadline, formatShortDeadline } from './format'

// Tests run in America/Los_Angeles (vite.config.ts), where a plain `new Date('2026-04-30')` shows as Apr 29.

describe('formatAmount', () => {
  it('formats whole dollars', () => {
    expect(formatAmount(10000)).toBe('$10,000')
    expect(formatAmount(500)).toBe('$500')
  })
})

describe('formatDeadline', () => {
  it('formats ISO dates without shifting the day', () => {
    expect(formatDeadline('2026-04-30')).toBe('Apr 30, 2026')
    expect(formatDeadline('2027-01-01')).toBe('Jan 1, 2027')
  })

  it('has a short form without the year', () => {
    expect(formatShortDeadline('2026-06-01')).toBe('Jun 1')
  })
})

it('runs in a time zone behind UTC', () => {
  expect(new Date('2026-04-30T00:00:00Z').getDate()).toBe(29)
})
