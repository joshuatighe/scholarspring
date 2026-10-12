import { useEffect, useState } from 'react'
import * as data from '../lib/data'
import type { Profile } from '../types'

export function useAuth() {
  const [user, setUser] = useState<Profile | null>(null)
  const [ready, setReady] = useState(false)
  const [hasAccounts, setHasAccounts] = useState(false)

  useEffect(() => {
    void Promise.all([data.getCurrentProfile(), data.hasAccounts()]).then(([profile, accounts]) => {
      setUser(profile)
      setHasAccounts(accounts)
      setReady(true)
    })
  }, [])

  return {
    user,
    ready,
    hasAccounts,
    async signIn(username: string, password: string) {
      const profile = await data.signIn(username, password)
      setUser(profile)
      return profile
    },
    async signUp(profile: Profile, password: string) {
      const created = await data.signUp(profile, password)
      setUser(created)
      setHasAccounts(true)
      return created
    },
    async updateProfile(profile: Omit<Profile, 'username'>, password: string) {
      const updated = await data.updateProfile(profile, password)
      setUser(updated)
      return updated
    },
    async signOut() {
      await data.signOut()
      setUser(null)
    },
  }
}
