import { LogOut } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { buttonClass } from '../components/button'
import { EmptyState, PageBand, PageBody } from '../components/PageBand'
import { fieldLabel, ProfileFields, type ProfileFieldValues } from '../components/ProfileFields'
import { useApp } from '../context/AppContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { errorMessage } from '../lib/errors'
import type { Profile } from '../types'

export function ProfilePage() {
  const { auth, openAuth } = useApp()
  useDocumentTitle('Your profile')
  return (
    <>
      <PageBand eyebrow="Account" title={auth.user ? `Hi, ${auth.user.username}.` : 'Your profile.'}>
        {auth.user && <p className="mt-4 text-[1.05rem] text-band-muted">{auth.user.email}</p>}
      </PageBand>
      <PageBody>
        {!auth.ready ? null : auth.user ? (
          <ProfileForm key={auth.user.username} user={auth.user} />
        ) : (
          <EmptyState title="You’re signed out">
            <p>Sign in to update your profile, or create one to see what you qualify for.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => openAuth('signin')} className={buttonClass('primary')}>
                Sign in
              </button>
              <button type="button" onClick={() => openAuth('profile')} className={buttonClass('secondary')}>
                Create a profile
              </button>
            </div>
          </EmptyState>
        )}
      </PageBody>
    </>
  )
}

function ProfileForm({ user }: { user: Profile }) {
  const { auth, toast } = useApp()
  const navigate = useNavigate()
  const [fields, setFields] = useState<ProfileFieldValues>({ gpa: String(user.gpa), region: user.region, major: user.major })
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function save(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    try {
      await auth.updateProfile({ gpa: Number(fields.gpa), region: fields.region, major: fields.major }, password)
      setPassword('')
      toast('Profile saved — your matches are updated.')
    } catch (error) {
      toast(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    setBusy(true)
    try {
      await auth.signOut()
      toast('Signed out. Your saved list will be here when you sign back in.')
      navigate('/')
    } catch (error) {
      toast(errorMessage(error))
      setBusy(false)
    }
  }

  return (
    <div className="grid grid-cols-[1fr_300px] items-start gap-8 max-md:grid-cols-1">
      <form onSubmit={save} className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-8 shadow-soft max-sm:p-6">
        <h2 className="text-[1.6rem]">Your details</h2>
        <p className="-mt-2 text-[.92rem] text-muted">These decide which scholarships are marked as a match.</p>
        <ProfileFields values={fields} onChange={setFields} />
        <label className={fieldLabel}>
          New password
          <input
            type="password"
            minLength={6}
            autoComplete="new-password"
            placeholder="Leave blank to keep your current password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit" disabled={busy} className={`${buttonClass('primary')} mt-2 self-start max-sm:self-stretch`}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </form>
      <aside className="rounded-3xl border border-line bg-card p-7">
        <dl className="grid gap-4 text-[.92rem]">
          <div>
            <dt className="text-muted">Username</dt>
            <dd className="mt-1 font-bold">{user.username}</dd>
          </div>
          <div>
            <dt className="text-muted">Email</dt>
            <dd className="mt-1 font-bold break-all">{user.email}</dd>
          </div>
        </dl>
        <button type="button" onClick={() => void signOut()} disabled={busy} className={`${buttonClass('secondary', { full: true })} mt-6`}>
          <LogOut aria-hidden className="size-4" /> Sign out
        </button>
      </aside>
    </div>
  )
}
