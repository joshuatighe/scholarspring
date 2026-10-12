import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · ScholarSpring` : 'ScholarSpring | Find funding for what’s next'
  }, [title])
}
