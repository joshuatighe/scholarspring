import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as data from './data'

function memoryStorage() {
  const items = new Map<string, string>()
  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
    removeItem: (key: string) => void items.delete(key),
    clear: () => items.clear(),
  }
}

const maya = { username: 'maya', gpa: 3.7, major: 'Computer Science', region: 'Midwest' }
const stored = () => JSON.parse(localStorage.getItem(data.STORAGE_KEY) ?? 'null')

beforeEach(() => {
  vi.stubGlobal('localStorage', memoryStorage())
})

describe('migrateState', () => {
  it('returns an empty state for nothing or junk', () => {
    expect(data.migrateState(null)).toEqual({ accounts: {}, current: null })
    expect(data.migrateState('junk')).toEqual({ accounts: {}, current: null })
  })

  it('upgrades the original { user, saved } shape', () => {
    const migrated = data.migrateState({
      user: { username: 'old', password: 'pw1234', gpa: 3.3, region: 'West', major: 'Business', profileApplied: true },
      saved: ['green-future'],
    })
    expect(migrated).toEqual({
      accounts: { old: { username: 'old', password: 'pw1234', gpa: 3.3, region: 'West', major: 'Business', saved: ['green-future'] } },
      current: 'old',
    })
  })

  it('keeps the current shape as is', () => {
    const state = { accounts: { maya: { ...maya, password: 'x', saved: [] } }, current: null }
    expect(data.migrateState(state)).toEqual(state)
  })
})

describe('accounts', () => {
  it('signs up, signs out and signs back in without losing saved scholarships', async () => {
    await data.signUp(maya, 'secret1')
    await data.setSaved('stem-forward', true)
    await data.signOut()
    expect(await data.getCurrentProfile()).toBeNull()
    expect(await data.hasAccounts()).toBe(true)

    expect(await data.signIn('maya', 'secret1')).toEqual(maya)
    expect(await data.getSavedIds()).toEqual(['stem-forward'])
  })

  it('never returns the password', async () => {
    const profile = await data.signUp(maya, 'secret1')
    expect(profile).not.toHaveProperty('password')
    expect(await data.getCurrentProfile()).not.toHaveProperty('password')
  })

  it('rejects a wrong password and a taken username', async () => {
    await data.signUp(maya, 'secret1')
    await data.signOut()
    await expect(data.signIn('maya', 'nope')).rejects.toBeInstanceOf(data.AuthError)
    await expect(data.signIn('nobody', 'secret1')).rejects.toBeInstanceOf(data.AuthError)
    await expect(data.signUp(maya, 'other')).rejects.toBeInstanceOf(data.AuthError)
  })

  it('updates the profile and keeps the password when left blank', async () => {
    await data.signUp(maya, 'secret1')
    await data.updateProfile({ gpa: 3.9, major: 'Business', region: 'West' }, '')
    expect(await data.getCurrentProfile()).toEqual({ username: 'maya', gpa: 3.9, major: 'Business', region: 'West' })
    await data.signOut()
    await expect(data.signIn('maya', 'secret1')).resolves.toBeTruthy()
  })

  it('keeps saved lists separate per account', async () => {
    await data.signUp(maya, 'secret1')
    await data.setSaved('stem-forward', true)
    await data.signOut()
    await data.signUp({ ...maya, username: 'sam' }, 'secret2')
    expect(await data.getSavedIds()).toEqual([])
  })

  it('saves and unsaves without duplicates', async () => {
    await data.signUp(maya, 'secret1')
    await data.setSaved('first-gen', true)
    await data.setSaved('first-gen', true)
    expect(await data.getSavedIds()).toEqual(['first-gen'])
    await data.setSaved('first-gen', false)
    expect(await data.getSavedIds()).toEqual([])
  })

  it('refuses to save while signed out', async () => {
    await expect(data.setSaved('first-gen', true)).rejects.toBeInstanceOf(data.AuthError)
  })

  it('writes migrated state back in the new shape', async () => {
    localStorage.setItem(data.STORAGE_KEY, JSON.stringify({ user: { ...maya, password: 'pw' }, saved: [] }))
    await data.getCurrentProfile()
    expect(stored()).toHaveProperty('accounts.maya')
    expect(stored()).toHaveProperty('current', 'maya')
  })
})
