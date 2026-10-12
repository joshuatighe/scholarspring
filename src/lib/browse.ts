import type { Scholarship } from '../types'
import { EMPTY_FILTERS, matchesScholarship, type Filters } from './matching'
import { isOpen } from './deadlines'

export type SortOrder = 'deadline' | 'amount'

/** Everything the Browse page shows, as kept in its URL. */
export interface BrowseState extends Filters {
  sort: SortOrder
  showClosed: boolean
}

export const DEFAULT_BROWSE: BrowseState = { ...EMPTY_FILTERS, sort: 'deadline', showClosed: false }

/** Reads Browse state from URL search params; unknown or missing values fall back to defaults. */
export function parseBrowse(params: URLSearchParams): BrowseState {
  return {
    query: params.get('q') ?? '',
    major: params.get('major') ?? '',
    region: params.get('region') ?? '',
    gpa: params.get('gpa') ?? '',
    sort: params.get('sort') === 'amount' ? 'amount' : 'deadline',
    showClosed: params.get('closed') === '1',
  }
}

/** The inverse of parseBrowse, leaving out defaults so URLs stay short. */
export function browseParams(state: Partial<BrowseState>): URLSearchParams {
  const full = { ...DEFAULT_BROWSE, ...state }
  const params = new URLSearchParams()
  if (full.query.trim()) params.set('q', full.query)
  if (full.major) params.set('major', full.major)
  if (full.region) params.set('region', full.region)
  if (full.gpa.trim()) params.set('gpa', full.gpa.trim())
  if (full.sort !== 'deadline') params.set('sort', full.sort)
  if (full.showClosed) params.set('closed', '1')
  return params
}

export function sortScholarships(list: Scholarship[], sort: SortOrder): Scholarship[] {
  return list.toSorted((a, b) =>
    sort === 'amount' ? b.amount - a.amount || a.deadline.localeCompare(b.deadline) : a.deadline.localeCompare(b.deadline) || b.amount - a.amount,
  )
}

export interface BrowseResult {
  results: Scholarship[]
  /** Matches hidden only because they've closed. */
  hiddenClosed: number
}

export function browse(list: Scholarship[], state: BrowseState, today: string): BrowseResult {
  const matching = list.filter((s) => matchesScholarship(s, state))
  const visible = state.showClosed ? matching : matching.filter((s) => isOpen(s.deadline, today))
  return { results: sortScholarships(visible, state.sort), hiddenClosed: matching.length - visible.length }
}
