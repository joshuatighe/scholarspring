import { createContext, useContext } from 'react'
import type { useAuth } from '../hooks/useAuth'
import type { LoadStatus } from '../hooks/useScholarships'
import type { AuthMode, Scholarship } from '../types'

export interface AuthDialogState {
  open: boolean
  mode: AuthMode
  /** Changes every time the dialog opens, so its form starts fresh. */
  session: number
  /** A scholarship to save once the student has signed in. */
  pendingSaveId?: string
}

export interface AppContextValue {
  auth: ReturnType<typeof useAuth>
  scholarships: Scholarship[]
  status: LoadStatus
  retry: () => void
  savedIds: string[]
  /** Saves or unsaves; when signed out, opens sign-in and saves once the student is in. */
  toggleSave: (id: string) => void
  openAuth: (mode: AuthMode, options?: { pendingSaveId?: string }) => void
  toast: (message: string) => void
  /** Today's local date, "YYYY-MM-DD", for deadline cues. */
  today: string
  /** Browse URL for this student: profile filters when signed in. */
  browseLink: string
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp(): AppContextValue {
  const value = useContext(AppContext)
  if (!value) throw new Error('useApp must be used inside <AppProvider>')
  return value
}
