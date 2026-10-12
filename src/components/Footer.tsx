import { Link } from 'react-router'
import { Brand } from './Brand'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="shell flex flex-wrap items-center gap-x-8 gap-y-4 py-10 text-[.85rem] text-muted">
        <Brand className="mr-auto text-fg" />
        <nav aria-label="Footer" className="flex gap-6">
          <Link to="/scholarships" className="hover:text-fg">
            Browse
          </Link>
          <Link to="/saved" className="hover:text-fg">
            Saved
          </Link>
          <Link to="/profile" className="hover:text-fg">
            Profile
          </Link>
        </nav>
        <span>© 2026 ScholarSpring · College scholarships for high-school students.</span>
      </div>
    </footer>
  )
}
