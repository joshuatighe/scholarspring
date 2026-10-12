import { describe, expect, it } from 'vitest'
import { browse, browseParams, DEFAULT_BROWSE, parseBrowse, sortScholarships } from './browse'
import { SCHOLARSHIPS } from './fixtures'

const ids = (list: { id: string }[]) => list.map((s) => s.id)

describe('parseBrowse / browseParams', () => {
  it('defaults when the URL is empty', () => {
    expect(parseBrowse(new URLSearchParams())).toEqual(DEFAULT_BROWSE)
    expect(browseParams(DEFAULT_BROWSE).toString()).toBe('')
  })

  it('round-trips every field', () => {
    const state = { query: 'green', major: 'Business', region: 'West', gpa: '3.5', sort: 'amount' as const, showClosed: true }
    const params = browseParams(state)
    expect(params.toString()).toBe('q=green&major=Business&region=West&gpa=3.5&sort=amount&closed=1')
    expect(parseBrowse(params)).toEqual(state)
  })

  it('ignores unknown values', () => {
    expect(parseBrowse(new URLSearchParams('sort=random&closed=yes'))).toMatchObject({ sort: 'deadline', showClosed: false })
  })
})

describe('sortScholarships', () => {
  it('sorts by deadline, soonest first', () => {
    expect(ids(sortScholarships(SCHOLARSHIPS.toReversed(), 'deadline'))).toEqual([
      'stem-forward', 'green-future', 'first-gen', 'future-teachers', 'creative-voice', 'future-founders',
    ])
  })

  it('sorts by amount, highest first', () => {
    expect(ids(sortScholarships(SCHOLARSHIPS, 'amount')).slice(0, 3)).toEqual(['future-founders', 'stem-forward', 'future-teachers'])
  })

  it('does not change the input', () => {
    const before = ids(SCHOLARSHIPS)
    sortScholarships(SCHOLARSHIPS, 'amount')
    expect(ids(SCHOLARSHIPS)).toEqual(before)
  })
})

describe('browse', () => {
  it('hides closed scholarships unless asked, and counts them', () => {
    const today = '2026-06-10' // stem, green and first-gen have closed
    expect(browse(SCHOLARSHIPS, DEFAULT_BROWSE, today)).toMatchObject({ hiddenClosed: 3 })
    expect(ids(browse(SCHOLARSHIPS, DEFAULT_BROWSE, today).results)).toEqual(['future-teachers', 'creative-voice', 'future-founders'])
    expect(browse(SCHOLARSHIPS, { ...DEFAULT_BROWSE, showClosed: true }, today)).toMatchObject({ hiddenClosed: 0 })
  })

  it('applies filters before hiding closed ones', () => {
    const result = browse(SCHOLARSHIPS, { ...DEFAULT_BROWSE, major: 'Education' }, '2026-06-10')
    expect(ids(result.results)).toEqual(['future-teachers', 'creative-voice', 'future-founders'])
    expect(result.hiddenClosed).toBe(2)
  })
})
