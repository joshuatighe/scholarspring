import { useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { AppContext, type AppContextValue, type AuthDialogState } from './context/AppContext'
import { useAuth } from './hooks/useAuth'
import { useSavedScholarships } from './hooks/useSavedScholarships'
import { useScholarships } from './hooks/useScholarships'
import { useToast } from './hooks/useToast'
import { browseParams } from './lib/browse'
import { localToday } from './lib/deadlines'
import { errorMessage } from './lib/errors'
import { filtersFromProfile } from './lib/matching'
import { BrowsePage } from './pages/BrowsePage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProfilePage } from './pages/ProfilePage'
import { SavedPage } from './pages/SavedPage'
import { ScholarshipPage } from './pages/ScholarshipPage'

export default function App() {
  const auth = useAuth()
  const { scholarships, status, retry } = useScholarships()
  const saved = useSavedScholarships(auth.user)
  const toast = useToast()
  const [today] = useState(() => localToday())
  const [authDialog, setAuthDialog] = useState<AuthDialogState>({ open: false, mode: 'signin', session: 0 })

  const browseLink = useMemo(() => {
    const query = auth.user ? browseParams(filtersFromProfile(auth.user)).toString() : ''
    return query ? `/scholarships?${query}` : '/scholarships'
  }, [auth.user])

  const value: AppContextValue = {
    auth,
    scholarships,
    status,
    retry,
    savedIds: saved.savedIds,
    toggleSave(id) {
      if (!auth.user) {
        setAuthDialog((current) => ({ open: true, mode: 'signin', session: current.session + 1, pendingSaveId: id }))
        toast.show('Sign in or create a profile to save scholarships.')
        return
      }
      saved
        .toggle(id)
        .then((nowSaved) => toast.show(nowSaved ? 'Saved to your list.' : 'Removed from your saved list.'))
        .catch((error: unknown) => toast.show(errorMessage(error)))
    },
    openAuth(mode, options) {
      setAuthDialog((current) => ({ open: true, mode, session: current.session + 1, pendingSaveId: options?.pendingSaveId }))
    },
    toast: toast.show,
    today,
    browseLink,
  }

  return (
    <AppContext value={value}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout authDialog={authDialog} setAuthDialog={setAuthDialog} toastState={toast} saveAfterAuth={saved.toggle} />}>
            <Route index element={<HomePage />} />
            <Route path="scholarships" element={<BrowsePage />} />
            <Route path="scholarships/:id" element={<ScholarshipPage />} />
            <Route path="saved" element={<SavedPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext>
  )
}
