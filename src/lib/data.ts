// The only module that talks to storage: Supabase (Postgres + Auth). Components and hooks
// call these functions and never import the Supabase client directly.
import type { Profile, ProfileDetails, Scholarship } from '../types'
import type { ProfileRow, ScholarshipRow } from './database.types'
import { supabase } from './supabase'

/** A problem the student can fix (wrong password, taken username, …). The message is shown as is. */
export class AuthError extends Error {}

/** Anything else that stopped a request: no connection, Supabase not configured, … */
export class DataError extends Error {}

function client() {
  if (!supabase) throw new DataError('ScholarSpring isn’t connected to its database yet.')
  return supabase
}

const LEGACY_STORAGE_KEY = 'scholarspring-demo'

/** Deletes the accounts the old browser-only version kept in localStorage, passwords included. */
export function clearLegacyStorage(storage: Pick<Storage, 'removeItem'> | undefined = globalThis.localStorage) {
  try {
    storage?.removeItem(LEGACY_STORAGE_KEY)
  } catch {
    // Storage can be unavailable (private mode, blocked site data); there is nothing to clear then.
  }
}

export function toScholarship(row: ScholarshipRow): Scholarship {
  return {
    id: row.id,
    name: row.name,
    provider: row.provider,
    category: row.category,
    amount: row.amount,
    deadline: row.deadline,
    gpa: Number(row.min_gpa),
    majors: row.majors,
    regions: row.regions,
    description: row.description,
    eligibility: row.eligibility,
  }
}

export function toProfile(row: Pick<ProfileRow, 'username' | 'gpa' | 'major' | 'region'>, email: string): Profile {
  return { username: row.username, email, gpa: Number(row.gpa), major: row.major, region: row.region }
}

/** Turns a Supabase Auth error into a sentence for the student. */
export function authErrorMessage(error: { code?: string; message: string }): string {
  switch (error.code) {
    case 'invalid_credentials':
      return 'That email and password don’t match.'
    case 'user_already_exists':
    case 'email_exists':
      return 'An account with that email already exists. Sign in instead.'
    case 'email_not_confirmed':
      return 'Confirm your email first, then sign in.'
    case 'weak_password':
      return 'Choose a stronger password (at least 6 characters).'
    case 'same_password':
      return 'Your new password must be different from your current one.'
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return 'Too many attempts. Wait a minute and try again.'
    case 'validation_failed':
    case 'email_address_invalid':
      return 'Please check your email address.'
    default:
      // The profiles trigger failed, almost always because the username was taken a moment ago.
      if (/database error saving new user/i.test(error.message)) return 'That username was just taken. Try another one.'
      return error.message || 'Something went wrong. Please try again.'
  }
}

const PROFILE_COLUMNS = 'username, gpa, major, region'

async function loadProfile(userId: string, email: string): Promise<Profile> {
  const { data, error } = await client().from('profiles').select(PROFILE_COLUMNS).eq('id', userId).single()
  if (error) throw new DataError('Couldn’t load your profile. Please try again.')
  return toProfile(data, email)
}

async function currentUser() {
  const { data } = await client().auth.getSession()
  return data.session?.user ?? null
}

export async function getScholarships(): Promise<Scholarship[]> {
  const { data, error } = await client().from('scholarships').select('*').order('deadline')
  if (error) throw new DataError('Couldn’t load scholarships.')
  return data.map(toScholarship)
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await currentUser()
  return user ? loadProfile(user.id, user.email ?? '') : null
}

export async function signIn(email: string, password: string): Promise<Profile> {
  const { data, error } = await client().auth.signInWithPassword({ email, password })
  if (error) throw new AuthError(authErrorMessage(error))
  return loadProfile(data.user.id, data.user.email ?? email)
}

/**
 * Creates the account; a database trigger creates the profile from `details`.
 * Returns null when the project requires email confirmation before the first sign-in.
 */
export async function signUp(details: Omit<Profile, 'email'>, email: string, password: string): Promise<Profile | null> {
  const db = client()
  const { data: available, error: lookupError } = await db.rpc('username_available', { name: details.username })
  if (lookupError) throw new DataError('Couldn’t check that username. Please try again.')
  if (!available) throw new AuthError('That username is taken. Try another one.')

  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: { data: { username: details.username, gpa: details.gpa, major: details.major, region: details.region } },
  })
  if (error) throw new AuthError(authErrorMessage(error))
  if (!data.session || !data.user) return null
  return loadProfile(data.user.id, data.user.email ?? email)
}

/** Updates the signed-in student's profile. A blank password keeps the current one. */
export async function updateProfile(details: ProfileDetails, password: string): Promise<Profile> {
  const db = client()
  const user = await currentUser()
  if (!user) throw new AuthError('Please sign in again.')

  // Password first: if it's rejected (too weak, unchanged), nothing has been saved yet.
  if (password) {
    const { error: passwordError } = await db.auth.updateUser({ password })
    if (passwordError) throw new AuthError(authErrorMessage(passwordError))
  }

  const { data, error } = await db
    .from('profiles')
    .update({ gpa: details.gpa, major: details.major, region: details.region })
    .eq('id', user.id)
    .select(PROFILE_COLUMNS)
    .single()
  if (error) throw new DataError('Couldn’t save your profile. Please try again.')
  return toProfile(data, user.email ?? '')
}

export async function signOut(): Promise<void> {
  const { error } = await client().auth.signOut()
  if (error) throw new DataError('Couldn’t sign out. Please try again.')
}

/** Calls `onSignedOut` when the session ends outside the app (expired, or signed out in another tab). */
export function onSignedOut(callback: () => void): () => void {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') callback()
  })
  return () => data.subscription.unsubscribe()
}

export async function getSavedIds(): Promise<string[]> {
  if (!(await currentUser())) return []
  const { data, error } = await client().from('saved_scholarships').select('scholarship_id').order('saved_at')
  if (error) throw new DataError('Couldn’t load your saved scholarships.')
  return data.map((row) => row.scholarship_id)
}

/** Saves or unsaves a scholarship for the signed-in student and returns their saved ids. */
export async function setSaved(id: string, saved: boolean): Promise<string[]> {
  const db = client()
  if (!(await currentUser())) throw new AuthError('Sign in to save scholarships.')
  const { error } = saved
    ? await db.from('saved_scholarships').insert({ scholarship_id: id })
    : await db.from('saved_scholarships').delete().eq('scholarship_id', id)
  // 23505: already saved (e.g. from another tab), which is the state we wanted.
  if (error && error.code !== '23505') throw new DataError('Couldn’t update your saved list. Please try again.')
  return getSavedIds()
}
