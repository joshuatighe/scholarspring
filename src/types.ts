export interface Scholarship {
  id: string
  name: string
  provider: string
  category: string
  amount: string
  deadline: string
  /** Minimum GPA required to apply. */
  gpa: number
  /** May contain "Any major", which matches every major. */
  majors: string[]
  /** May contain "National", which matches every region. */
  regions: string[]
  description: string
  eligibility: string
  url: string
}

export interface Profile {
  username: string
  gpa: number
  region: string
  major: string
}

export type AuthMode = 'profile' | 'signin'
