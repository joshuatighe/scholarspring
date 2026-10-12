import { useCallback, useEffect, useState } from 'react'
import { getScholarships } from '../lib/data'
import type { Scholarship } from '../types'

export type LoadStatus = 'loading' | 'ready' | 'error'

export function useScholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')

  const load = useCallback((isCurrent: () => boolean = () => true) => {
    getScholarships()
      .then((list) => {
        if (!isCurrent()) return
        setScholarships(list)
        setStatus('ready')
      })
      .catch(() => {
        if (isCurrent()) setStatus('error')
      })
  }, [])

  useEffect(() => {
    let current = true
    load(() => current)
    return () => {
      current = false
    }
  }, [load])

  const retry = useCallback(() => {
    setStatus('loading')
    load()
  }, [load])

  return { scholarships, status, retry }
}
