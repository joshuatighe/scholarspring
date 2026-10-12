import { describe, expect, it, vi } from 'vitest'
import { nextPreference, readPreference, resolveTheme, savePreference, THEME_KEY } from './theme'

describe('theme preference', () => {
  it('reads a saved choice and defaults to system', () => {
    expect(readPreference({ getItem: () => 'dark' })).toBe('dark')
    expect(readPreference({ getItem: () => null })).toBe('system')
    expect(readPreference({ getItem: () => 'purple' })).toBe('system')
    expect(
      readPreference({
        getItem: () => {
          throw new Error('blocked')
        },
      }),
    ).toBe('system')
  })

  it('saves light/dark and forgets system', () => {
    const storage = { setItem: vi.fn<(key: string, value: string) => void>(), removeItem: vi.fn<(key: string) => void>() }
    savePreference('dark', storage)
    expect(storage.setItem).toHaveBeenCalledWith(THEME_KEY, 'dark')
    savePreference('system', storage)
    expect(storage.removeItem).toHaveBeenCalledWith(THEME_KEY)
  })

  it('resolves system from the OS setting', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
  })

  it('cycles system → light → dark → system', () => {
    expect(nextPreference('system')).toBe('light')
    expect(nextPreference('light')).toBe('dark')
    expect(nextPreference('dark')).toBe('system')
  })
})
