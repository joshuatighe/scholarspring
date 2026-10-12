// The only module that touches storage. Today it uses localStorage; in step 5 these
// functions switch to Supabase, so they are async and the rest of the app doesn't change.
import type { Profile, Scholarship } from '../types'
import { SCHOLARSHIPS } from './seed'

export const STORAGE_KEY = 'scholarspring-demo'

interface StoredAccount extends Profile {
  password: string
  saved: string[]
}

export interface StoredState {
  accounts: Record<string, StoredAccount>
  /** Username of whoever is signed in. */
  current: string | null
}

export class AuthError extends Error {}

/** Accepts anything read from storage and returns the current shape, upgrading the original `{ user, saved }` format. */
export function migrateState(raw: unknown): StoredState {
  if (isObject(raw) && isObject(raw.accounts)) {
    return { accounts: raw.accounts as StoredState['accounts'], current: typeof raw.current === 'string' ? raw.current : null }
  }
  const state: StoredState = { accounts: {}, current: null }
  if (isObject(raw) && isObject(raw.user) && typeof raw.user.username === 'string') {
    const { username, password, gpa, region, major } = raw.user as Record<string, unknown>
    state.accounts[username as string] = {
      username: username as string,
      password: String(password ?? ''),
      gpa: Number(gpa),
      region: String(region),
      major: String(major),
      saved: Array.isArray(raw.saved) ? raw.saved.filter((id): id is string => typeof id === 'string') : [],
    }
    state.current = username as string
  }
  return state
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function read(): StoredState {
  let raw: unknown = null
  try {
    raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
  } catch {
    raw = null
  }
  const state = migrateState(raw)
  write(state)
  return state
}

function write(state: StoredState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function toProfile({ username, gpa, region, major }: StoredAccount): Profile {
  return { username, gpa, region, major }
}

function currentAccount(state: StoredState): StoredAccount | null {
  return state.current ? (state.accounts[state.current] ?? null) : null
}

export async function getScholarships(): Promise<Scholarship[]> {
  return SCHOLARSHIPS
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const account = currentAccount(read())
  return account ? toProfile(account) : null
}

export async function hasAccounts(): Promise<boolean> {
  return Object.keys(read().accounts).length > 0
}

export async function signIn(username: string, password: string): Promise<Profile> {
  const state = read()
  const account = state.accounts[username]
  if (!account || account.password !== password) throw new AuthError('That username and password don’t match.')
  state.current = username
  write(state)
  return toProfile(account)
}

export async function signUp(profile: Profile, password: string): Promise<Profile> {
  const state = read()
  if (state.accounts[profile.username]) throw new AuthError('That username is taken. Sign in instead.')
  state.accounts[profile.username] = { ...profile, password, saved: [] }
  state.current = profile.username
  write(state)
  return profile
}

/** Updates the signed-in profile. The username can't change; a blank password keeps the current one. */
export async function updateProfile(profile: Omit<Profile, 'username'>, password: string): Promise<Profile> {
  const state = read()
  const account = currentAccount(state)
  if (!account) throw new AuthError('Please sign in again.')
  Object.assign(account, profile, password ? { password } : {})
  write(state)
  return toProfile(account)
}

export async function signOut(): Promise<void> {
  const state = read()
  state.current = null
  write(state)
}

export async function getSavedIds(): Promise<string[]> {
  return currentAccount(read())?.saved ?? []
}

export async function setSaved(id: string, saved: boolean): Promise<string[]> {
  const state = read()
  const account = currentAccount(state)
  if (!account) throw new AuthError('Sign in to save scholarships.')
  account.saved = saved ? [...new Set([...account.saved, id])] : account.saved.filter((savedId) => savedId !== id)
  write(state)
  return account.saved
}
