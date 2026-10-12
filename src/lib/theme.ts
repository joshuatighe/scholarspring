// Light/dark theme preference. Kept in localStorage per viewer; index.html applies it before first paint.
export type ThemePreference = 'system' | 'light' | 'dark'
export type Theme = 'light' | 'dark'

export const THEME_KEY = 'scholarspring-theme'

export function readPreference(storage: Pick<Storage, 'getItem'> | undefined = globalThis.localStorage): ThemePreference {
  try {
    const value = storage?.getItem(THEME_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

export function savePreference(preference: ThemePreference, storage: Pick<Storage, 'setItem' | 'removeItem'> | undefined = globalThis.localStorage) {
  try {
    if (preference === 'system') storage?.removeItem(THEME_KEY)
    else storage?.setItem(THEME_KEY, preference)
  } catch {
    // Storage can be blocked; the choice then lasts for this visit only.
  }
}

export function resolveTheme(preference: ThemePreference, systemPrefersDark: boolean): Theme {
  return preference === 'system' ? (systemPrefersDark ? 'dark' : 'light') : preference
}

/** The toggle cycles system → light → dark → system. */
export function nextPreference(preference: ThemePreference): ThemePreference {
  return preference === 'system' ? 'light' : preference === 'light' ? 'dark' : 'system'
}
