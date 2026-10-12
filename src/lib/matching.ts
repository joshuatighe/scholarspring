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

/** "Apr 30, 2026" → "Apr 30", for compact cards. */
export function shortDeadline(deadline: string): string {
  return deadline.replace(/,\s*\d{4}$/, '')
}
