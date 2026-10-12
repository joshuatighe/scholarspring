import type { Profile, Scholarship } from '../types'

export interface Filters {
  query: string
  /** '' means any major. */
  major: string
  /** '' means any region. */
  region: string
  /** The student's GPA as typed; '' means any GPA. */
  gpa: string
}

export const EMPTY_FILTERS: Filters = { query: '', major: '', region: '', gpa: '' }

export function matchesScholarship(s: Scholarship, filters: Filters): boolean {
  const query = filters.query.trim().toLowerCase()
  const studentGpa = filters.gpa.trim() === '' ? null : Number(filters.gpa)
  return (
    (!query || `${s.name} ${s.provider} ${s.category}`.toLowerCase().includes(query)) &&
    (!filters.major || s.majors.includes(filters.major) || s.majors.includes('Any major')) &&
    (!filters.region || s.regions.includes(filters.region) || s.regions.includes('National')) &&
    (studentGpa === null || Number.isNaN(studentGpa) || s.gpa <= studentGpa)
  )
}

/** The major, region and GPA filters a profile implies. "Undecided" and "National" mean no filter. */
export function filtersFromProfile(profile: Profile): Omit<Filters, 'query'> {
  return {
    major: profile.major === 'Undecided' ? '' : profile.major,
    region: profile.region === 'National' ? '' : profile.region,
    gpa: String(profile.gpa),
  }
}

export interface ProfileMatch {
  gpa: boolean
  major: boolean
  region: boolean
  /** True when all three match: the scholarship shows up in the student's profile-filtered results. */
  all: boolean
}

/** How a scholarship lines up with a profile, criterion by criterion (same rules as the profile filters). */
export function profileMatch(s: Scholarship, profile: Profile): ProfileMatch {
  const filters = { ...EMPTY_FILTERS, ...filtersFromProfile(profile) }
  const gpa = matchesScholarship(s, { ...EMPTY_FILTERS, gpa: filters.gpa })
  const major = matchesScholarship(s, { ...EMPTY_FILTERS, major: filters.major })
  const region = matchesScholarship(s, { ...EMPTY_FILTERS, region: filters.region })
  return { gpa, major, region, all: gpa && major && region }
}
