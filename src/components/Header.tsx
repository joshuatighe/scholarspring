import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { useApp } from '../context/AppContext'
import { Brand } from './Brand'
import { buttonClass } from './button'
import { ThemeToggle } from './ThemeToggle'

const navLink = ({ isActive }: { isActive: boolean }) =>
  `relative py-2 font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent after:transition-transform ${
    isActive ? 'text-band-fg after:scale-x-100' : 'text-band-muted hover:text-band-fg after:scale-x-0'
  }`

export function Header() {
  const { auth, savedIds, openAuth, browseLink } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-30 border-b border-band-line bg-band text-band-fg">
      <div className="shell flex h-[72px] items-center gap-6">
        <Link to="/" onClick={close} aria-label="ScholarSpring home">
          <Brand />
        </Link>
        <nav
          aria-label="Main"
          className={`ml-auto flex items-center gap-7 text-[.93rem] ${
            menuOpen
              ? 'max-md:absolute max-md:inset-x-0 max-md:top-[72px] max-md:flex-col max-md:items-start max-md:gap-3 max-md:border-b max-md:border-band-line max-md:bg-band max-md:px-7 max-md:py-5'
              : 'max-md:hidden'
          }`}
        >
          <NavLink to={browseLink} end={false} onClick={close} className={({ isActive }) => navLink({ isActive })}>
            Browse
          </NavLink>
          <NavLink to="/saved" onClick={close} className={navLink}>
            <span className="flex items-center gap-2">
              Saved
              <span className="min-w-6 rounded-full bg-accent px-1.5 py-0.5 text-center text-[.72rem] font-bold text-accent-fg tabular-nums">
                {savedIds.length}
              </span>
            </span>
          </NavLink>
          {auth.user ? (
            <NavLink to="/profile" onClick={close} className={navLink}>
              <span className="flex items-center gap-2">
                <span aria-hidden className="grid size-7 place-items-center rounded-full bg-mint text-[.8rem] font-bold text-mint-fg uppercase">
                  {auth.user.username.slice(0, 1)}
                </span>
                {auth.user.username}
              </span>
            </NavLink>
          ) : (
            <button
              type="button"
              onClick={() => {
                close()
                openAuth('signin')
              }}
              className={buttonClass('primary', { small: true })}
            >
              Sign in
            </button>
          )}
        </nav>
        <div className="flex items-center gap-1 max-md:ml-auto md:-mr-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="hidden size-10 place-items-center rounded-full text-band-fg hover:bg-band-fg/10 max-md:grid"
          >
            {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}
