import { Menu } from 'lucide-react'
import { useState } from 'react'
import type { Profile } from '../types'
import { Brand } from './Brand'
import { buttonClass } from './button'

interface Props {
  user: Profile | null
  savedCount: number
  onAuthClick: () => void
}

export function Header({ user, savedCount, onAuthClick }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-5 flex h-[76px] items-center justify-between border-b border-line bg-paper px-[max(28px,calc((100vw_-_1180px)/2))]">
      <a href="#home" aria-label="ScholarSpring home">
        <Brand />
      </a>
      <nav
        aria-label="Main navigation"
        className={`flex items-center gap-[30px] text-[.91rem] font-semibold ${
          menuOpen
            ? 'max-md:absolute max-md:inset-x-0 max-md:top-[76px] max-md:flex-col max-md:items-start max-md:border-b max-md:border-line max-md:bg-paper max-md:px-7 max-md:py-5'
            : 'max-md:hidden'
        }`}
      >
        <a href="#search" className="text-[#53635f]">
          Browse scholarships
        </a>
        <a href="#saved" className="text-[#53635f]">
          Saved <span className="ml-[3px] rounded-[20px] bg-mint px-[7px] py-[3px] text-[.7rem]">{savedCount}</span>
        </a>
        <button type="button" onClick={onAuthClick} className={buttonClass(user ? 'primary' : 'outline', { small: true })}>
          {user ? `Hi, ${user.username}` : 'Sign in'}
        </button>
      </nav>
      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="hidden bg-transparent max-md:block"
      >
        <Menu className="size-6" />
      </button>
    </header>
  )
}
