import { SparkleMark } from './SparkleMark'

export function Brand({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 font-display text-[1.3rem] font-bold tracking-[-.02em] ${className}`}>
      <SparkleMark className="size-[22px] text-accent" /> ScholarSpring
    </span>
  )
}
