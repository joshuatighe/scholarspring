import { useEffect, useState } from 'react'
import * as data from '../lib/data'
import type { Profile, ProfileDetails } from '../types'

export function useAuth() {
  const [user, setUser] = useState<Profile | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    data.clearLegacyStorage()
    data
      .getCurrentProfile()
      .catch(() => null)
      .then((profile) => {
        setUser(profile)
        setReady(true)
      })
    return data.onSignedOut(() => setUser(null))
  }, [])

  return {
    user,
    ready,
    async signIn(email: string, password: string) {
      const profile = await data.signIn(email, password)
      setUser(profile)
      return profile
    },
    /** Resolves to null when the account needs email confirmation before signing in. */
    async signUp(profile: Omit<Profile, 'email'>, email: string, password: string) {
      const created = await data.signUp(profile, email, password)
      setUser(created)
      return created
    },
    async updateProfile(details: ProfileDetails, password: string) {
      const updated = await data.updateProfile(details, password)
      setUser(updated)
      return updated
    },
    async signOut() {
      await data.signOut()
      setUser(null)
    },
  }
}
