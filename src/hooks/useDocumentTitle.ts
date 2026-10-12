import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · ScholarSpring` : 'ScholarSpring · College scholarships for high-school students'
  }, [title])
}
