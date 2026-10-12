import { describe, expect, it } from 'vitest'
import { deadlineStatus, isOpen, localToday } from './deadlines'

describe('deadlineStatus', () => {
  const today = '2026-10-12'

  it('is open well before the deadline', () => {
    expect(deadlineStatus('2026-12-01', today)).toEqual({ state: 'open', daysLeft: 50, label: 'Open' })
  })

  it('is closing soon within two weeks', () => {
    expect(deadlineStatus('2026-10-26', today)).toMatchObject({ state: 'soon', daysLeft: 14, label: 'Closes in 14 days' })
    expect(deadlineStatus('2026-10-27', today).state).toBe('open')
    expect(deadlineStatus('2026-10-13', today).label).toBe('Closes tomorrow')
  })

  it('is open through the end of the deadline day', () => {
    expect(deadlineStatus('2026-10-12', today)).toMatchObject({ state: 'today', daysLeft: 0, label: 'Closes today' })
    expect(isOpen('2026-10-12', today)).toBe(true)
  })

  it('is closed the day after', () => {
    expect(deadlineStatus('2026-10-11', today)).toMatchObject({ state: 'closed', daysLeft: -1, label: 'Closed' })
    expect(isOpen('2026-04-30', today)).toBe(false)
  })

  it('counts days correctly across a daylight-saving change', () => {
    expect(deadlineStatus('2026-11-03', '2026-10-30').daysLeft).toBe(4)
  })
})

describe('localToday', () => {
  it('uses the local calendar date, not UTC', () => {
    // 11pm on Oct 12 in Los Angeles (the test time zone) is already Oct 13 in UTC.
    expect(localToday(new Date('2026-10-13T06:00:00Z'))).toBe('2026-10-12')
  })
})
