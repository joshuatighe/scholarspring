export interface Scholarship {
  id: string
  name: string
  provider: string
  category: string
  /** Whole US dollars. */
  amount: number
  /** ISO date, e.g. "2026-04-30". */
  deadline: string
  /** Minimum GPA required to apply. */
  gpa: number
  /** May contain "Any major", which matches every major. */
  majors: string[]
  /** May contain "National", which matches every region. */
  regions: string[]
  description: string
  eligibility: string
}

export interface Profile {
  username: string
  email: string
  gpa: number
  region: string
  major: string
}

/** The parts of a profile a student can change after sign-up. */
export type ProfileDetails = Pick<Profile, 'gpa' | 'region' | 'major'>

export type AuthMode = 'profile' | 'signin'
