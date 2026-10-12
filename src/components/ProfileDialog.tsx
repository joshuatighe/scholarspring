import { ArrowRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { PROFILE_MAJORS, REGIONS } from '../lib/options'
import type { AuthMode, Profile } from '../types'
import { buttonClass } from './button'
import { Modal } from './Modal'
import { SparkleMark } from './SparkleMark'

export interface ProfileFormValues {
  email: string
  username: string
  password: string
  gpa: string
  region: string
  major: string
}

interface Props {
  open: boolean
  /** 'profile' creates a profile, or updates it when signed in; 'signin' asks for email and password only. */
  mode: AuthMode
  /** Changes every time the dialog opens, so the form starts fresh. */
  formKey: number
  user: Profile | null
  /** True while a request is in flight; disables the submit button. */
  busy: boolean
  onClose: () => void
  onSwitchMode: () => void
  onSignOut: () => void
  onSubmit: (values: ProfileFormValues) => void
}

const initialValues = (user: Profile | null): ProfileFormValues => ({
  email: user?.email ?? '',
  username: user?.username ?? '',
  password: '',
  gpa: user ? String(user.gpa) : '',
  region: user?.region ?? 'National',
  major: user?.major ?? 'Computer Science',
})

export function ProfileDialog({ open, mode, formKey, user, busy, onClose, onSwitchMode, onSignOut, onSubmit }: Props) {
  const signin = mode === 'signin' && !user

  const [title, subtitle] = user
    ? ['Update your profile', 'Keep your preferences up to date.']
    : signin
      ? ['Welcome back', 'Sign in to see your saved scholarships.']
      : ['Create your profile', 'Tell us a little about yourself to get personalized matches.']

  return (
    <Modal open={open} onClose={onClose} labelledBy="auth-title">
      <div className="mx-[15px] mt-1 mb-[26px] text-center">
        <SparkleMark className="mx-auto mb-2 size-7 text-coral" />
        <p className="eyebrow">Welcome to ScholarSpring</p>
        <h2 id="auth-title" className="m-2 font-display text-[2rem]">
          {title}
        </h2>
        <p className="text-[.88rem] leading-[1.5] text-muted">{subtitle}</p>
      </div>

      <ProfileForm key={formKey} signin={signin} user={user} busy={busy} onSubmit={onSubmit} />

      <button
        type="button"
        onClick={user ? onSignOut : onSwitchMode}
        disabled={busy}
        className="mx-auto mt-5 block text-[.8rem] text-coral disabled:opacity-50"
      >
        {user ? 'Sign out' : signin ? 'New here? Create a profile' : 'Already have a profile? Sign in'}
      </button>
    </Modal>
  )
}

interface FormProps {
  signin: boolean
  user: Profile | null
  busy: boolean
  onSubmit: Props['onSubmit']
}

function ProfileForm({ signin, user, busy, onSubmit }: FormProps) {
  const [values, setValues] = useState(() => initialValues(user))

  const set = (key: keyof ProfileFormValues) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [key]: event.target.value }))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-[15px] [&_label]:flex [&_label]:flex-col [&_label]:gap-1.5 [&_label]:text-[.78rem] [&_label]:font-bold"
    >
      <label>
        Email
        <input
          required
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={set('email')}
          readOnly={Boolean(user)}
        />
      </label>
      {!signin && (
        <label>
          Username
          <input
            required
            autoComplete="username"
            placeholder="e.g. maya.chen"
            pattern="[A-Za-z0-9._\-]{2,30}"
            title="2–30 letters, numbers, dots, dashes or underscores"
            value={values.username}
            onChange={set('username')}
            readOnly={Boolean(user)}
          />
        </label>
      )}
      <label>
        Password
        <input
          type="password"
          required={!user}
          minLength={6}
          autoComplete={signin ? 'current-password' : 'new-password'}
          placeholder={user ? 'Leave blank to keep your password' : 'At least 6 characters'}
          value={values.password}
          onChange={set('password')}
        />
      </label>
      {!signin && (
        <>
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <label>
              High-school GPA
              <input required type="number" min="0" max="4" step="0.01" placeholder="3.7" value={values.gpa} onChange={set('gpa')} />
            </label>
            <label>
              Preferred region
              <select value={values.region} onChange={set('region')}>
                {REGIONS.map((region) => (
                  <option key={region}>{region}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Intended major
            <select value={values.major} onChange={set('major')}>
              {PROFILE_MAJORS.map((major) => (
                <option key={major}>{major}</option>
              ))}
            </select>
          </label>
        </>
      )}
      <button type="submit" disabled={busy} className={`${buttonClass('primary', { full: true })} disabled:opacity-60`}>
        {busy ? 'One moment…' : signin ? 'Sign in' : 'Save my profile'}
        {!busy && <ArrowRight aria-hidden className="size-4" />}
      </button>
    </form>
  )
}
