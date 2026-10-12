type Variant = 'primary' | 'secondary' | 'ghost' | 'onBand'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  /** Coral fill with dark text (AA in both themes). */
  primary: 'bg-accent text-accent-fg shadow-[0_6px_16px_-6px_var(--accent)] hover:bg-accent-hover hover:-translate-y-px',
  secondary: 'border border-line bg-card text-fg hover:border-fg',
  ghost: 'text-fg hover:bg-mint',
  /** Outline for use on the forest bands. */
  onBand: 'border border-band-muted/50 text-band-fg hover:border-band-fg hover:bg-band-fg/10',
}

export function buttonClass(variant: Variant, { small = false, full = false } = {}) {
  const size = small ? 'px-4 py-2 text-[.85rem]' : 'px-6 py-3 text-[.95rem]'
  return [base, variants[variant], size, full && 'w-full'].filter(Boolean).join(' ')
}
