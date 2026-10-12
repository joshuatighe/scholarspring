import { useCallback, useEffect, useRef, useState } from 'react'

export function useToast(duration = 2600) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const show = useCallback(
    (text: string) => {
      setMessage(text)
      setVisible(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setVisible(false), duration)
    },
    [duration],
  )

  return { message, visible, show }
}
