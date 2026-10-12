import { Search, SlidersHorizontal, UserRound, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { buttonClass } from '../components/button'
import { EmptyState, PageBand, PageBody } from '../components/PageBand'
import { CardSkeletons, ScholarshipGrid } from '../components/ScholarshipCard'
import { useApp } from '../context/AppContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { browse, browseParams, DEFAULT_BROWSE, parseBrowse, type BrowseState } from '../lib/browse'
import { filtersFromProfile } from '../lib/matching'
import { FILTER_MAJORS, REGIONS } from '../lib/options'

export function BrowsePage() {
  const { auth, scholarships, status, retry, today, openAuth } = useApp()
  const [params, setParams] = useSearchParams()
  const state = parseBrowse(params)
  const { results, hiddenClosed } = browse(scholarships, state, today)
  useDocumentTitle('Browse scholarships')

  const update = (changes: Partial<BrowseState>) => setParams(browseParams({ ...state, ...changes }), { replace: true })
  const set = (key: 'query' | 'major' | 'region' | 'gpa' | 'sort') => (event: { target: { value: string } }) =>
    update({ [key]: event.target.value })

  const profileFilters = auth.user ? filtersFromProfile(auth.user) : null
  const usingProfile =
    profileFilters !== null &&
    state.major === profileFilters.major &&
    state.region === profileFilters.region &&
    state.gpa === profileFilters.gpa
  const filtered = Boolean(state.query || state.major || state.region || state.gpa)

  return (
    <>
      <PageBand eyebrow="Browse" title="Find a scholarship that fits.">
        <p className="mt-4 text-[1.05rem] text-band-muted" aria-live="polite">
          {status === 'loading'
            ? 'Loading scholarships…'
            : status === 'error'
              ? ' '
              : `${results.length} ${results.length === 1 ? 'scholarship' : 'scholarships'}${usingProfile ? ' matching your profile' : ''}`}
        </p>
      </PageBand>
      <PageBody>
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="grid grid-cols-[2fr_1fr_1fr_.8fr_1fr] gap-3 rounded-3xl border border-line bg-card p-4 shadow-soft max-md:grid-cols-2 max-sm:grid-cols-1"
        >
          <label className="relative flex items-center max-md:col-span-full">
            <Search aria-hidden className="absolute left-4 size-[18px] text-muted" />
            <input type="search" aria-label="Search scholarships" placeholder="Search by name or keyword" value={state.query} onChange={set('query')} className="pl-11" />
          </label>
          <Field label="Major">
            <select value={state.major} onChange={set('major')}>
              <option value="">All majors</option>
              {FILTER_MAJORS.map((major) => (
                <option key={major}>{major}</option>
              ))}
            </select>
          </Field>
          <Field label="Region">
            <select value={state.region} onChange={set('region')}>
              <option value="">Any region</option>
              {REGIONS.map((region) => (
                <option key={region}>{region}</option>
              ))}
            </select>
          </Field>
          <Field label="Your GPA">
            <input type="number" min="0" max="4" step="0.01" placeholder="Any" value={state.gpa} onChange={set('gpa')} />
          </Field>
          <Field label="Sort by">
            <select value={state.sort} onChange={set('sort')}>
              <option value="deadline">Soonest deadline</option>
              <option value="amount">Largest award</option>
            </select>
          </Field>
        </form>

        <div className="mt-5 mb-8 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-[.9rem] font-semibold">
            <input
              type="checkbox"
              checked={state.showClosed}
              onChange={(event) => update({ showClosed: event.target.checked })}
              className="size-[18px] w-auto accent-[var(--accent)]"
            />
            Show closed scholarships
          </label>
          <span className="flex-1" />
          {profileFilters && !usingProfile && (
            <button type="button" onClick={() => update({ ...profileFilters, query: '' })} className={buttonClass('secondary', { small: true })}>
              <UserRound aria-hidden className="size-4" /> Use my profile
            </button>
          )}
          {filtered && (
            <button type="button" onClick={() => update({ ...DEFAULT_BROWSE, sort: state.sort, showClosed: state.showClosed })} className={buttonClass('ghost', { small: true })}>
              <X aria-hidden className="size-4" /> Clear filters
            </button>
          )}
          {!auth.user && auth.ready && (
            <p className="flex w-full items-center gap-3 rounded-2xl bg-mint px-4 py-3 text-[.9rem] text-mint-fg">
              <SlidersHorizontal aria-hidden className="size-4 shrink-0" />
              <span>Sign in to see which scholarships match your profile.</span>
              <button type="button" onClick={() => openAuth('signin')} className="ml-auto font-bold underline underline-offset-4">
                Sign in
              </button>
            </p>
          )}
        </div>

        {status === 'loading' ? (
          <CardSkeletons count={6} />
        ) : status === 'error' ? (
          <EmptyState title="Couldn’t load scholarships">
            <p>Check your connection and try again.</p>
            <button type="button" onClick={retry} className={buttonClass('secondary')}>
              Try again
            </button>
          </EmptyState>
        ) : results.length > 0 ? (
          <>
            <ScholarshipGrid scholarships={results} />
            {hiddenClosed > 0 && (
              <p className="mt-8 text-center text-[.9rem] text-muted">
                {hiddenClosed} closed {hiddenClosed === 1 ? 'scholarship' : 'scholarships'} hidden.{' '}
                <button type="button" onClick={() => update({ showClosed: true })} className="font-bold text-accent-text underline underline-offset-4">
                  Show {hiddenClosed === 1 ? 'it' : 'them'}
                </button>
              </p>
            )}
          </>
        ) : (
          <EmptyState title={hiddenClosed > 0 ? 'Everything that matches has closed' : 'No scholarships found'}>
            <p>
              {hiddenClosed > 0
                ? `${hiddenClosed} matching ${hiddenClosed === 1 ? 'scholarship has' : 'scholarships have'} passed ${hiddenClosed === 1 ? 'its' : 'their'} deadline.`
                : 'Try changing your search or filters to see more opportunities.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {hiddenClosed > 0 && (
                <button type="button" onClick={() => update({ showClosed: true })} className={buttonClass('primary')}>
                  Show closed scholarships
                </button>
              )}
              {filtered && (
                <button type="button" onClick={() => update({ ...DEFAULT_BROWSE, sort: state.sort, showClosed: state.showClosed })} className={buttonClass('secondary')}>
                  Clear filters
                </button>
              )}
            </div>
          </EmptyState>
        )}
      </PageBody>
    </>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="eyebrow text-[.68rem] text-muted">{label}</span>
      {children}
    </label>
  )
}
