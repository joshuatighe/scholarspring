import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { CardSkeletons, ScholarshipGrid } from '../components/ScholarshipCard'
import { buttonClass } from '../components/button'
import { useApp } from '../context/AppContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { sortScholarships } from '../lib/browse'
import { isOpen } from '../lib/deadlines'
import { formatAmount } from '../lib/format'

const steps = [
  ['Build your profile', 'Your high-school GPA, the major you’re planning and where you want to study. It takes a minute.'],
  ['See what fits', 'Every scholarship is checked against your profile, so you know which ones you qualify for before you start an essay.'],
  ['Keep a shortlist', 'Save the ones worth applying to and keep an eye on their deadlines. Your list follows you from your phone to the school library.'],
] as const

export function HomePage() {
  const { auth, scholarships, status, today, browseLink, openAuth, savedIds } = useApp()
  useDocumentTitle('')
  const open = scholarships.filter((s) => isOpen(s.deadline, today))
  const shown = open.length > 0 ? open : scholarships
  const total = shown.reduce((sum, s) => sum + s.amount, 0)
  const featured = open.length > 0 ? sortScholarships(open, 'deadline').slice(0, 3) : sortScholarships(scholarships, 'amount').slice(0, 3)

  return (
    <>
      <section className="relative overflow-hidden bg-band text-band-fg">
        <svg aria-hidden viewBox="0 0 64 64" className="pointer-events-none absolute -top-24 -right-24 size-[460px] text-band-fg/[0.04] max-md:hidden">
          <path fill="currentColor" d="M32 0Q37.12 26.88 64 32Q37.12 37.12 32 64Q26.88 37.12 0 32Q26.88 26.88 32 0Z" />
        </svg>
        <div className="shell relative grid grid-cols-[1.25fr_1fr] items-end gap-12 pt-20 pb-24 max-md:grid-cols-1 max-md:gap-10 max-sm:pt-14 max-sm:pb-16">
          <div>
            <p className="eyebrow text-accent">For high-school students heading to college</p>
            <h1 className="mt-5 text-[clamp(2.7rem,5.6vw,4.6rem)] leading-[0.98]">Find the scholarships that get you to college.</h1>
            <p className="mt-6 max-w-[520px] text-[1.12rem] leading-relaxed text-band-muted">
              Tell us your GPA, the major you’re planning and where you want to study. We’ll show which scholarships you
              qualify for and keep your shortlist in one place.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3 max-sm:flex-col max-sm:items-stretch">
              <Link to={browseLink} className={buttonClass('primary')}>
                Find yours <ArrowRight aria-hidden className="size-4" />
              </Link>
              {auth.user ? (
                <Link to="/saved" className={buttonClass('onBand')}>
                  Your saved list ({savedIds.length})
                </Link>
              ) : (
                <button type="button" onClick={() => openAuth('profile')} className={buttonClass('onBand')}>
                  Create a free profile
                </button>
              )}
            </div>
          </div>
          <div className="border-l border-band-line pl-10 max-md:border-t max-md:border-l-0 max-md:pt-8 max-md:pl-0">
            <p className="font-display text-[clamp(3.6rem,8vw,6.5rem)] leading-none font-extrabold tracking-[-0.04em] tabular-nums">
              {status === 'ready' ? formatAmount(total) : '—'}
            </p>
            <p className="mt-3 text-[1.05rem] text-band-muted">
              {status !== 'ready'
                ? 'Loading scholarships…'
                : open.length > 0
                  ? `waiting across ${open.length} open scholarship${open.length === 1 ? '' : 's'}.`
                  : `listed across ${scholarships.length} scholarships. New ones are added as they open.`}
            </p>
          </div>
        </div>
      </section>

      <section className="shell py-20 max-sm:py-14">
        <div className="mb-8 flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start">
          <div>
            <p className="eyebrow text-accent-text">{open.length > 0 ? 'Closing soon' : 'Largest awards'}</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,2.8rem)] leading-tight">
              {open.length > 0 ? 'Don’t miss these.' : 'A look at what’s here.'}
            </h2>
          </div>
          <Link to={browseLink} className={buttonClass('secondary', { small: true })}>
            See all scholarships <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        {status === 'ready' ? <ScholarshipGrid scholarships={featured} /> : <CardSkeletons />}
      </section>

      <section className="border-y border-line bg-card">
        <ol className="shell grid grid-cols-3 gap-10 py-16 max-md:grid-cols-1 max-md:gap-8">
          {steps.map(([title, body], index) => (
            <li key={title}>
              <span className="font-display text-[3.4rem] leading-none font-extrabold text-accent tabular-nums">0{index + 1}</span>
              <h3 className="mt-3 text-[1.45rem]">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {!auth.user && (
        <section className="shell py-20 max-sm:py-14">
          <div className="flex items-center justify-between gap-8 rounded-[2rem] bg-band px-12 py-14 text-band-fg max-md:flex-col max-md:items-start max-sm:px-7 max-sm:py-10">
            <div>
              <p className="eyebrow text-accent">Senior year moves fast</p>
              <h2 className="mt-3 text-[clamp(2rem,4vw,2.8rem)] leading-tight">Ready to start applying?</h2>
              <p className="mt-3 max-w-[480px] text-band-muted">Build your profile once and see every scholarship you qualify for.</p>
            </div>
            <button type="button" onClick={() => openAuth('profile')} className={buttonClass('primary')}>
              Build my profile <ArrowRight aria-hidden className="size-4" />
            </button>
          </div>
        </section>
      )}
    </>
  )
}
