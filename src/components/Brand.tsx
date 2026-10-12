import { SparkleMark } from './SparkleMark'

export function Brand({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 text-[1.15rem] font-bold tracking-[-.03em] ${className}`}>
      <SparkleMark className="size-[22px] text-coral" /> ScholarSpring
    </span>
  )
}
