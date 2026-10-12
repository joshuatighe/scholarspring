import { describe, expect, it, vi } from 'vitest'
import * as data from './data'
import type { ScholarshipRow } from './database.types'

const row: ScholarshipRow = {
  id: 'stem-forward',
  name: 'STEM Forward Scholarship',
  provider: 'Bright Futures Foundation',
  category: 'STEM & Innovation',
  amount: 10000,
  deadline: '2026-04-30',
  min_gpa: 3.2,
  majors: ['Computer Science'],
  regions: ['National'],
  description: 'd',
  eligibility: 'e',
  url: null,
  created_at: '2026-10-12T00:00:00Z',
}

describe('toScholarship', () => {
  it('maps a database row to the app shape', () => {
    expect(data.toScholarship(row)).toEqual({
      id: 'stem-forward',
      name: 'STEM Forward Scholarship',
      provider: 'Bright Futures Foundation',
      category: 'STEM & Innovation',
      amount: 10000,
      deadline: '2026-04-30',
      gpa: 3.2,
      majors: ['Computer Science'],
      regions: ['National'],
      description: 'd',
      eligibility: 'e',
    })
  })

  it('accepts numeric columns that arrive as strings', () => {
    expect(data.toScholarship({ ...row, min_gpa: '3.20' as unknown as number }).gpa).toBe(3.2)
  })
})

describe('toProfile', () => {
  it('adds the email and never includes anything else', () => {
    expect(data.toProfile({ username: 'maya', gpa: 3.7, major: 'Business', region: 'West' }, 'maya@example.com')).toEqual({
      username: 'maya',
      email: 'maya@example.com',
      gpa: 3.7,
      major: 'Business',
      region: 'West',
    })
  })
})

describe('authErrorMessage', () => {
  it('explains common Supabase Auth errors', () => {
    expect(data.authErrorMessage({ code: 'invalid_credentials', message: 'Invalid login credentials' })).toBe(
      'That email and password don’t match.',
    )
    expect(data.authErrorMessage({ code: 'user_already_exists', message: 'User already registered' })).toMatch(/already exists/)
    expect(data.authErrorMessage({ code: 'weak_password', message: 'weak' })).toMatch(/stronger password/)
    expect(data.authErrorMessage({ code: 'over_request_rate_limit', message: 'rate' })).toMatch(/Too many attempts/)
  })

  it('explains a sign-up that lost a race for the username', () => {
    expect(data.authErrorMessage({ code: 'unexpected_failure', message: 'Database error saving new user' })).toBe(
      'That username was just taken. Try another one.',
    )
  })

  it('falls back to the original message, then a generic one', () => {
    expect(data.authErrorMessage({ code: 'something_new', message: 'Specific detail' })).toBe('Specific detail')
    expect(data.authErrorMessage({ message: '' })).toBe('Something went wrong. Please try again.')
  })
})

describe('clearLegacyStorage', () => {
  it('removes the old browser-only accounts', () => {
    const storage = { removeItem: vi.fn<(key: string) => void>() }
    data.clearLegacyStorage(storage)
    expect(storage.removeItem).toHaveBeenCalledWith('scholarspring-demo')
  })

  it('ignores storage that throws', () => {
    expect(() =>
      data.clearLegacyStorage({
        removeItem: () => {
          throw new Error('blocked')
        },
      }),
    ).not.toThrow()
  })
})

describe('without Supabase configured', () => {
  it('rejects with a DataError instead of crashing', async () => {
    await expect(data.getScholarships()).rejects.toBeInstanceOf(data.DataError)
    await expect(data.signIn('a@b.c', 'secret1')).rejects.toBeInstanceOf(data.DataError)
  })

  it('treats the student as signed out', () => {
    const unsubscribe = data.onSignedOut(() => {})
    expect(unsubscribe).toBeTypeOf('function')
  })
})
