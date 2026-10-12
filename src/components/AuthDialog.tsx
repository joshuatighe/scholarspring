import { ArrowRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { AuthMode } from '../types'
import { buttonClass } from './button'
import { Modal } from './Modal'
import { fieldLabel, ProfileFields } from './ProfileFields'
import { SparkleMark } from './SparkleMark'

export interface AuthFormValues {
  email: string
  username: string
  password: string
  gpa: string
  region: string
  major: string
}

interface Props {
  open: boolean
  /** 'signin' asks for email and password; 'profile' creates an account with a profile. */
  mode: AuthMode
  /** Changes every time the dialog opens, so the form starts fresh. */
  formKey: number
  busy: boolean
  onClose: () => void
  onSwitchMode: () => void
  onSubmit: (values: AuthFormValues) => void
}

export function AuthDialog({ open, mode, formKey, busy, onClose, onSwitchMode, onSubmit }: Props) {
  const signin = mode === 'signin'
  return (
    <Modal open={open} onClose={onClose} labelledBy="auth-title">
      <div className="mb-7 text-center">
        <SparkleMark className="mx-auto mb-3 size-7 text-accent" />
        <h2 id="auth-title" className="text-[2rem] leading-tight">
          {signin ? 'Welcome back' : 'Create your profile'}
        </h2>
        <p className="mt-2 text-[.92rem] text-muted">
          {signin ? 'Sign in to see your saved scholarships.' : 'Tell us a little about yourself and we’ll show what you qualify for.'}
        </p>
      </div>
      <AuthForm key={`${formKey}-${mode}`} signin={signin} busy={busy} onSubmit={onSubmit} />
      <p className="mt-6 text-center text-[.88rem] text-muted">
        {signin ? 'New here?' : 'Already have a profile?'}{' '}
        <button type="button" onClick={onSwitchMode} disabled={busy} className="font-bold text-accent-text underline-offset-4 hover:underline">
          {signin ? 'Create a profile' : 'Sign in'}
        </button>
      </p>
    </Modal>
  )
}

function AuthForm({ signin, busy, onSubmit }: { signin: boolean; busy: boolean; onSubmit: Props['onSubmit'] }) {
  const [values, setValues] = useState<AuthFormValues>({
    email: '',
    username: '',
    password: '',
    gpa: '',
    region: 'National',
    major: 'Computer Science',
  })
  const set = (key: keyof AuthFormValues) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [key]: event.target.value }))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className={fieldLabel}>
        Email
        <input required type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={set('email')} />
      </label>
      {!signin && (
        <label className={fieldLabel}>
          Username
          <input
            required
            autoComplete="username"
            placeholder="e.g. maya.chen"
            pattern="[A-Za-z0-9._\-]{2,30}"
            title="2–30 letters, numbers, dots, dashes or underscores"
            value={values.username}
            onChange={set('username')}
          />
        </label>
      )}
      <label className={fieldLabel}>
        Password
        <input
          required
          type="password"
          minLength={6}
          autoComplete={signin ? 'current-password' : 'new-password'}
          placeholder="At least 6 characters"
          value={values.password}
          onChange={set('password')}
        />
      </label>
      {!signin && <ProfileFields values={values} onChange={(fields) => setValues((current) => ({ ...current, ...fields }))} />}
      <button type="submit" disabled={busy} className={`${buttonClass('primary', { full: true })} mt-2`}>
        {busy ? 'One moment…' : signin ? 'Sign in' : 'Create my profile'}
        {!busy && <ArrowRight aria-hidden className="size-4" />}
      </button>
    </form>
  )
}
