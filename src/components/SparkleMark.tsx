/** The ScholarSpring ✦ mark: the same four-point star as the logo and favicon. Coloured with `text-*`. */
export function SparkleMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      <path fill="currentColor" d="M32 0Q37.12 26.88 64 32Q37.12 37.12 32 64Q26.88 37.12 0 32Q26.88 26.88 32 0Z" />
    </svg>
  )
}
