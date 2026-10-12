import { useEffect, useState } from 'react'
import { nextPreference, readPreference, resolveTheme, savePreference, type ThemePreference } from '../lib/theme'

const media = () => globalThis.matchMedia?.('(prefers-color-scheme: dark)')

/** The viewer's theme preference; keeps the `dark` class on <html> in sync with it and the OS setting. */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() => readPreference())

  useEffect(() => {
    const query = media()
    const apply = () => document.documentElement.classList.toggle('dark', resolveTheme(preference, Boolean(query?.matches)) === 'dark')
    apply()
    if (preference !== 'system' || !query) return
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [preference])

  return {
    preference,
    cycle() {
      const next = nextPreference(preference)
      savePreference(next)
      setPreference(next)
    },
  }
}
