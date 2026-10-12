import { Brand } from './Brand'

export function Footer() {
  return (
    <footer className="section-shell flex items-center gap-[25px] border-t border-line pt-7 pb-[35px] text-[.78rem] text-muted max-md:flex-wrap max-sm:block max-sm:*:my-3.5">
      <Brand className="mr-auto text-ink max-md:w-full" />
      <p>Tools for the students shaping what’s next.</p>
      <span className="max-sm:block">© 2026 ScholarSpring demo</span>
    </footer>
  )
}
