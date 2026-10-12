import { useMemo, useState } from 'react'
import { CtaSection } from './components/CtaSection'
import { DetailDialog } from './components/DetailDialog'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProfileDialog, type ProfileFormValues } from './components/ProfileDialog'
import { SavedSection } from './components/SavedSection'
import { SearchSection } from './components/SearchSection'
import { Toast } from './components/Toast'
import { useAuth } from './hooks/useAuth'
import { useSavedScholarships } from './hooks/useSavedScholarships'
import { useScholarships } from './hooks/useScholarships'
import { useToast } from './hooks/useToast'
import { AuthError } from './lib/data'
import { EMPTY_FILTERS, filtersFromProfile, matchesScholarship, type Filters } from './lib/matching'
import type { AuthMode, Profile } from './types'

export default function App() {
  const auth = useAuth()
  const scholarships = useScholarships()
  const { savedIds, toggle } = useSavedScholarships(auth.user)
  const toast = useToast()
  // null until the student changes a filter: until then, filters come from their profile (or are empty).
  const [customFilters, setCustomFilters] = useState<Filters | null>(null)
  const filters = useMemo(
    () => customFilters ?? (auth.user ? { ...EMPTY_FILTERS, ...filtersFromProfile(auth.user) } : EMPTY_FILTERS),
    [customFilters, auth.user],
  )
  const [authDialog, setAuthDialog] = useState<{ open: boolean; mode: AuthMode; session: number }>({
    open: false,
    mode: 'profile',
    session: 0,
  })
  const [detailId, setDetailId] = useState<string | null>(null)

  const applyProfile = (profile: Profile) => setCustomFilters({ ...filters, ...filtersFromProfile(profile) })

  const results = useMemo(() => scholarships.filter((s) => matchesScholarship(s, filters)), [scholarships, filters])
  const saved = useMemo(() => scholarships.filter((s) => savedIds.includes(s.id)), [scholarships, savedIds])
  const detail = scholarships.find((s) => s.id === detailId) ?? null
  const defaultAuthMode: AuthMode = auth.hasAccounts ? 'signin' : 'profile'

  const openAuth = (mode: AuthMode = 'profile') => setAuthDialog((current) => ({ open: true, mode, session: current.session + 1 }))
  const closeAuth = () => setAuthDialog((current) => ({ ...current, open: false }))

  async function toggleSave(id: string) {
    if (!auth.user) {
      openAuth(defaultAuthMode)
      toast.show('Sign in or create a profile to save scholarships.')
      return
    }
    const nowSaved = await toggle(id)
    toast.show(nowSaved ? 'Saved to your list.' : 'Removed from your saved list.')
  }

  async function submitProfile(values: ProfileFormValues) {
    const username = values.username.trim()
    if (!username) return toast.show('Please enter a username.')
    const details = { gpa: Number(values.gpa), region: values.region, major: values.major }
    try {
      let profile: Profile
      let message: string
      if (auth.user) {
        profile = await auth.updateProfile(details, values.password)
        message = 'Profile saved — your matches are personalized!'
      } else if (authDialog.mode === 'signin') {
        profile = await auth.signIn(username, values.password)
        message = `Welcome back, ${username}!`
      } else {
        profile = await auth.signUp({ username, ...details }, values.password)
        message = 'Profile saved — your matches are personalized!'
      }
      applyProfile(profile)
      closeAuth()
      toast.show(message)
      location.hash = 'search'
    } catch (error) {
      if (error instanceof AuthError) toast.show(error.message)
      else throw error
    }
  }

  async function signOut() {
    await auth.signOut()
    setCustomFilters(null)
    closeAuth()
    toast.show('Signed out. Your saved list will be here when you sign back in.')
  }

  const gridProps = { savedIds, onToggleSave: (id: string) => void toggleSave(id), onShowDetail: setDetailId }

  return (
    <>
      <Toast message={toast.message} visible={toast.visible} />
      <Header user={auth.user} savedCount={savedIds.length} onAuthClick={() => openAuth(defaultAuthMode)} />
      <main>
        <Hero onSignUp={() => openAuth()} />
        <SearchSection
          results={results}
          filters={filters}
          onFiltersChange={setCustomFilters}
          showProfileTip={auth.ready && !auth.user}
          onCompleteProfile={() => openAuth()}
          {...gridProps}
        />
        <SavedSection saved={saved} {...gridProps} />
        <CtaSection onSignUp={() => openAuth()} />
      </main>
      <Footer />
      <ProfileDialog
        open={authDialog.open}
        mode={authDialog.mode}
        formKey={authDialog.session}
        user={auth.user}
        onClose={closeAuth}
        onSwitchMode={() => openAuth(authDialog.mode === 'signin' ? 'profile' : 'signin')}
        onSignOut={() => void signOut()}
        onSubmit={(values) => void submitProfile(values)}
      />
      <DetailDialog
        scholarship={detail}
        saved={detail !== null && savedIds.includes(detail.id)}
        onToggleSave={(id) => void toggleSave(id)}
        onClose={() => setDetailId(null)}
      />
    </>
  )
}
