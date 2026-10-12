import { useMemo, useState } from 'react'
import { ConfigNotice } from './components/ConfigNotice'
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
import { AuthError, DataError } from './lib/data'
import { EMPTY_FILTERS, filtersFromProfile, matchesScholarship, type Filters } from './lib/matching'
import { supabaseConfigured } from './lib/supabase'
import type { AuthMode, Profile } from './types'

const PROFILE_SAVED = 'Profile saved — your matches are personalized!'

export default function App() {
  const auth = useAuth()
  const { scholarships, status, retry } = useScholarships()
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
  const [busy, setBusy] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)

  const results = useMemo(() => scholarships.filter((s) => matchesScholarship(s, filters)), [scholarships, filters])
  const saved = useMemo(() => scholarships.filter((s) => savedIds.includes(s.id)), [scholarships, savedIds])
  const detail = scholarships.find((s) => s.id === detailId) ?? null

  const applyProfile = (profile: Profile) => setCustomFilters({ ...filters, ...filtersFromProfile(profile) })
  const openAuth = (mode: AuthMode = 'profile') => setAuthDialog((current) => ({ open: true, mode, session: current.session + 1 }))
  const closeAuth = () => setAuthDialog((current) => ({ ...current, open: false }))

  /** Shows the message of an expected error; anything else gets a generic message. */
  function showError(error: unknown) {
    if (error instanceof AuthError || error instanceof DataError) return toast.show(error.message)
    console.error(error)
    toast.show('Something went wrong. Please try again.')
  }

  async function toggleSave(id: string) {
    if (!auth.user) {
      openAuth('signin')
      toast.show('Sign in or create a profile to save scholarships.')
      return
    }
    try {
      const nowSaved = await toggle(id)
      toast.show(nowSaved ? 'Saved to your list.' : 'Removed from your saved list.')
    } catch (error) {
      showError(error)
    }
  }

  async function submitProfile(values: ProfileFormValues) {
    const email = values.email.trim()
    const username = values.username.trim()
    const details = { gpa: Number(values.gpa), region: values.region, major: values.major }
    setBusy(true)
    try {
      let profile: Profile | null
      let message: string
      if (auth.user) {
        profile = await auth.updateProfile(details, values.password)
        message = PROFILE_SAVED
      } else if (authDialog.mode === 'signin') {
        profile = await auth.signIn(email, values.password)
        message = `Welcome back, ${profile.username}!`
      } else {
        profile = await auth.signUp({ username, ...details }, email, values.password)
        message = PROFILE_SAVED
      }
      if (!profile) {
        // The Supabase project requires email confirmation before the first sign-in.
        openAuth('signin')
        toast.show('Check your email to confirm your account, then sign in.')
        return
      }
      applyProfile(profile)
      closeAuth()
      toast.show(message)
      location.hash = 'search'
    } catch (error) {
      showError(error)
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    setBusy(true)
    try {
      await auth.signOut()
      setCustomFilters(null)
      closeAuth()
      toast.show('Signed out. Your saved list will be here when you sign back in.')
    } catch (error) {
      showError(error)
    } finally {
      setBusy(false)
    }
  }

  const gridProps = { savedIds, onToggleSave: (id: string) => void toggleSave(id), onShowDetail: setDetailId }

  return (
    <>
      <Toast message={toast.message} visible={toast.visible} />
      {!supabaseConfigured && <ConfigNotice />}
      <Header user={auth.user} savedCount={savedIds.length} onAuthClick={() => openAuth(auth.user ? 'profile' : 'signin')} />
      <main>
        <Hero onSignUp={() => openAuth()} />
        <SearchSection
          status={status}
          onRetry={retry}
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
        busy={busy}
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
