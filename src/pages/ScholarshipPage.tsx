import { ArrowLeft, Check, Heart, X } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { buttonClass } from '../components/button'
import { DeadlineChip, MatchChip } from '../components/Chips'
import { EmptyState, PageBand, PageBody } from '../components/PageBand'
import { useApp } from '../context/AppContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatAmount, formatDeadline } from '../lib/format'
import { profileMatch } from '../lib/matching'

export function ScholarshipPage() {
  const { id } = useParams()
  const { auth, scholarships, status, today, savedIds, toggleSave, openAuth } = useApp()
  const s = scholarships.find((item) => item.id === id)
  useDocumentTitle(s?.name ?? (status === 'loading' ? 'Loading…' : 'Scholarship not found'))

  if (!s) {
    return (
      <>
        <PageBand eyebrow="Scholarship" title={status === 'loading' ? 'Loading…' : 'We couldn’t find that scholarship.'} />
        <PageBody>
          {status !== 'loading' && (
            <EmptyState title="It may have been removed">
              <Link to="/scholarships" className={buttonClass('primary')}>
                Browse scholarships
              </Link>
            </EmptyState>
          )}
        </PageBody>
      </>
    )
  }

  const saved = savedIds.includes(s.id)
  const match = auth.user ? profileMatch(s, auth.user) : null
  const criteria = match
    ? ([
        ['GPA', match.gpa, `Minimum ${s.gpa.toFixed(1)}; yours is ${auth.user?.gpa.toFixed(2)}`],
        ['Major', match.major, s.majors.join(', ')],
        ['Region', match.region, s.regions.join(', ')],
      ] as const)
    : []

  return (
    <>
      <PageBand eyebrow={s.category} title={s.name}>
        <p className="mt-4 text-[1.1rem] text-band-muted">{s.provider}</p>
      </PageBand>
      <PageBody>
        <div className="grid grid-cols-[1fr_360px] items-start gap-8 max-md:grid-cols-1">
          <aside className="order-2 rounded-3xl border border-line bg-card p-7 shadow-soft md:sticky md:top-24 max-md:order-1">
            <p className="eyebrow text-muted">Award</p>
            <p className="mt-2 font-display text-[3.4rem] leading-none font-extrabold tracking-[-0.04em] tabular-nums">{formatAmount(s.amount)}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-[.92rem]">
              <div>
                <dt className="text-muted">Deadline</dt>
                <dd className="mt-1 font-bold">{formatDeadline(s.deadline)}</dd>
              </div>
              <div>
                <dt className="text-muted">Minimum GPA</dt>
                <dd className="mt-1 font-bold tabular-nums">{s.gpa.toFixed(1)}</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <DeadlineChip deadline={s.deadline} today={today} />
              {match?.all && <MatchChip />}
            </div>
            <button type="button" onClick={() => toggleSave(s.id)} aria-pressed={saved} className={`${buttonClass(saved ? 'secondary' : 'primary', { full: true })} mt-6`}>
              <Heart aria-hidden className={`size-4 ${saved ? 'fill-current text-accent-text' : ''}`} />
              {saved ? 'Saved — remove' : 'Save this scholarship'}
            </button>
          </aside>

          <div className="order-1 rounded-3xl border border-line bg-card p-8 max-md:order-2 max-sm:p-6">
            <Link to="/scholarships" className="inline-flex items-center gap-2 text-[.9rem] font-semibold text-muted hover:text-fg">
              <ArrowLeft aria-hidden className="size-4" /> All scholarships
            </Link>
            <p className="mt-6 text-[1.2rem] leading-relaxed">{s.description}</p>
            <h2 className="mt-10 text-[1.6rem]">Who it’s for</h2>
            <p className="mt-3 leading-relaxed text-muted">{s.eligibility}</p>

            <h2 className="mt-10 text-[1.6rem]">{match ? 'How you match' : 'Requirements'}</h2>
            {match ? (
              <ul className="mt-4 divide-y divide-line rounded-2xl border border-line">
                {criteria.map(([label, ok, detail]) => (
                  <li key={label} className="flex items-start gap-3 px-5 py-4">
                    <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${ok ? 'bg-mint text-mint-fg' : 'bg-yellow text-yellow-fg'}`}>
                      {ok ? <Check aria-hidden className="size-3.5" /> : <X aria-hidden className="size-3.5" />}
                    </span>
                    <span>
                      <span className="font-bold">{label}</span>
                      <span className="sr-only">{ok ? ': matches' : ': does not match'}</span>
                      <span className="block text-[.9rem] text-muted">{detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <dl className="mt-4 grid gap-3 text-[.95rem]">
                  <div>
                    <dt className="inline font-bold">Majors: </dt>
                    <dd className="inline text-muted">{s.majors.join(', ')}</dd>
                  </div>
                  <div>
                    <dt className="inline font-bold">Regions: </dt>
                    <dd className="inline text-muted">{s.regions.join(', ')}</dd>
                  </div>
                </dl>
                <p className="mt-5 rounded-2xl bg-mint px-5 py-4 text-[.92rem] text-mint-fg">
                  <button type="button" onClick={() => openAuth('signin')} className="font-bold underline underline-offset-4">
                    Sign in
                  </button>{' '}
                  to see how this matches your profile.
                </p>
              </>
            )}
          </div>
        </div>
      </PageBody>
    </>
  )
}
