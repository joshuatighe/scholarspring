type Variant = 'primary' | 'outline' | 'quiet' | 'light'

const base = 'inline-flex items-center justify-center gap-2.5 rounded-md font-bold transition-all duration-200'

const variants: Record<Variant, string> = {
  primary: 'bg-coral text-white shadow-[0_5px_12px_#ec795f33] hover:-translate-y-px hover:bg-[#d96850]',
  outline: 'border border-[#b9c9c1] bg-transparent text-ink hover:bg-mint',
  quiet: 'bg-transparent text-ink',
  light: 'bg-white text-ink',
}

/** Class names for the original `.button` styles. */
export function buttonClass(variant: Variant, { small = false, full = false } = {}) {
  const size = variant === 'quiet' ? 'p-2.5' : small ? 'px-[15px] py-[9px] text-[.85rem]' : 'px-5 py-[13px]'
  return [base, variants[variant], size, full && 'mt-2 w-full'].filter(Boolean).join(' ')
}
