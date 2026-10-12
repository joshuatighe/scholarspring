import { describe, expect, it } from 'vitest'
import { SCHOLARSHIPS } from './fixtures'
import { EMPTY_FILTERS, filtersFromProfile, matchesScholarship, type Filters } from './matching'

const ids = (filters: Partial<Filters>) =>
  SCHOLARSHIPS.filter((s) => matchesScholarship(s, { ...EMPTY_FILTERS, ...filters })).map((s) => s.id)

describe('matchesScholarship', () => {
  it('matches everything with empty filters', () => {
    expect(ids({})).toHaveLength(6)
  })

  it('searches name, provider and category, ignoring case and spaces', () => {
    expect(ids({ query: '  green ' })).toEqual(['green-future'])
    expect(ids({ query: 'northstar' })).toEqual(['first-gen'])
    expect(ids({ query: 'LEADERSHIP' })).toEqual(['women-build'])
  })

  // Round 1 bug: the filter kept scholarships whose minimum GPA was ABOVE the student's.
  it('keeps only scholarships whose minimum GPA is at or below the student GPA', () => {
    expect(ids({ gpa: '3.7' })).toHaveLength(6)
    expect(ids({ gpa: '3.0' }).toSorted()).toEqual(['creative-voice', 'first-gen', 'future-teachers', 'green-future'])
    expect(ids({ gpa: '2.6' })).toEqual(['creative-voice'])
    expect(ids({ gpa: '2.0' })).toEqual([])
  })

  it('treats a blank or invalid GPA as any GPA', () => {
    expect(ids({ gpa: '  ' })).toHaveLength(6)
    expect(ids({ gpa: 'abc' })).toHaveLength(6)
  })

  it('lets "Any major" scholarships match every major', () => {
    expect(ids({ major: 'Education' }).toSorted()).toEqual(['creative-voice', 'first-gen', 'future-teachers', 'green-future', 'women-build'])
  })

  it('lets "National" scholarships match every region', () => {
    expect(ids({ region: 'South' })).toHaveLength(6)
  })

  it('combines filters', () => {
    expect(ids({ major: 'Computer Science', region: 'Midwest', gpa: '3.7' })).toHaveLength(5)
  })
})

describe('filtersFromProfile', () => {
  it('maps a profile to filters', () => {
    expect(filtersFromProfile({ username: 'maya', email: 'maya@example.com', gpa: 3.7, major: 'Computer Science', region: 'Midwest' })).toEqual({
      major: 'Computer Science',
      region: 'Midwest',
      gpa: '3.7',
    })
  })

  it('treats Undecided and National as no filter', () => {
    expect(filtersFromProfile({ username: 'sam', email: 'sam@example.com', gpa: 2.6, major: 'Undecided', region: 'National' })).toEqual({
      major: '',
      region: '',
      gpa: '2.6',
    })
  })
})
