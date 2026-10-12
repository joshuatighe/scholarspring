import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useApp, type AuthDialogState } from '../context/AppContext'
import { browseParams } from '../lib/browse'
import { errorMessage } from '../lib/errors'
import { filtersFromProfile } from '../lib/matching'
import { supabaseConfigured } from '../lib/supabase'
import { AuthDialog, type AuthFormValues } from './AuthDialog'
import { ConfigNotice } from './ConfigNotice'
import { Footer } from './Footer'
import { Header } from './Header'
import { Toast } from './Toast'

interface Props {
  authDialog: AuthDialogState
  setAuthDialog: Dispatch<SetStateAction<AuthDialogState>>
  toastState: { message: string; visible: boolean }
  /** Saves a scholarship for the student who just signed in. */
  saveAfterAuth: (id: string) => Promise<boolean>
}

export function Layout({ authDialog, setAuthDialog, toastState, saveAfterAuth }: Props) {
  const { auth, toast, openAuth } = useApp()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [busy, setBusy] = useState(false)

  const close = () => setAuthDialog((current) => ({ ...current, open: false }))

  async function submit(values: AuthFormValues) {
    const email = values.email.trim()
    setBusy(true)
    try {
      const profile =
        authDialog.mode === 'signin'
          ? await auth.signIn(email, values.password)
          : await auth.signUp(
              { username: values.username.trim(), gpa: Number(values.gpa), region: values.region, major: values.major },
              email,
              values.password,
            )
      if (!profile) {
        // The Supabase project requires email confirmation before the first sign-in.
        openAuth('signin', { pendingSaveId: authDialog.pendingSaveId })
        toast('Check your email to confirm your account, then sign in.')
        return
      }
      close()
      if (authDialog.pendingSaveId) {
        await saveAfterAuth(authDialog.pendingSaveId)
        toast(`Saved to your list. Welcome, ${profile.username}!`)
      } else if (authDialog.mode === 'signin') {
        toast(`Welcome back, ${profile.username}!`)
      } else {
        toast('Profile saved — here’s what you qualify for.')
        navigate(`/scholarships?${browseParams(filtersFromProfile(profile))}`)
      }
    } catch (error) {
      toast(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-accent px-4 py-2 font-bold text-accent-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ScrollToTop key={pathname} />
      {!supabaseConfigured && <ConfigNotice />}
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toast message={toastState.message} visible={toastState.visible} />
      <AuthDialog
        open={authDialog.open}
        mode={authDialog.mode}
        formKey={authDialog.session}
        busy={busy}
        onClose={close}
        onSwitchMode={() => openAuth(authDialog.mode === 'signin' ? 'profile' : 'signin', { pendingSaveId: authDialog.pendingSaveId })}
        onSubmit={(values) => void submit(values)}
      />
    </div>
  )
}

/** Remounted on every route change (keyed by path), so each page starts at the top like a full page load. */
function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return null
}
