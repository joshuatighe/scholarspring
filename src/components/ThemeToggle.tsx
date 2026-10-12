import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const labels = { system: 'Theme: match system', light: 'Theme: light', dark: 'Theme: dark' } as const

export function ThemeToggle() {
  const { preference, cycle } = useTheme()
  const Icon = preference === 'light' ? Sun : preference === 'dark' ? Moon : Monitor
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`${labels[preference]}. Click to change.`}
      title={labels[preference]}
      className="grid size-10 place-items-center rounded-full text-band-fg transition hover:bg-band-fg/10"
    >
      <Icon aria-hidden className="size-[18px]" />
    </button>
  )
}
