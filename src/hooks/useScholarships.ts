import { useEffect, useState } from 'react'
import { getScholarships } from '../lib/data'
import type { Scholarship } from '../types'

export function useScholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])

  useEffect(() => {
    void getScholarships().then(setScholarships)
  }, [])

  return scholarships
}
