import { useEffect, useState } from 'react'
import { getSavedIds, setSaved } from '../lib/data'
import type { Profile } from '../types'

/** The signed-in student's saved scholarship ids; empty when signed out. */
export function useSavedScholarships(user: Profile | null) {
  const [savedIds, setSavedIds] = useState<string[]>([])
  const username = user?.username

  useEffect(() => {
    if (!username) return
    let current = true
    getSavedIds()
      .then((ids) => {
        if (current) setSavedIds(ids)
      })
      .catch(() => {
        if (current) setSavedIds([])
      })
    return () => {
      current = false
    }
  }, [username])

  return {
    savedIds: user ? savedIds : [],
    /** Saves or unsaves a scholarship and returns whether it is now saved. */
    async toggle(id: string) {
      const next = await setSaved(id, !savedIds.includes(id))
      setSavedIds(next)
      return next.includes(id)
    },
  }
}
