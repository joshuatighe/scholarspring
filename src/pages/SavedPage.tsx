import { Link } from 'react-router'
import { buttonClass } from '../components/button'
import { EmptyState, PageBand, PageBody } from '../components/PageBand'
import { CardSkeletons, ScholarshipGrid } from '../components/ScholarshipCard'
import { useApp } from '../context/AppContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { sortScholarships } from '../lib/browse'

export function SavedPage() {
  const { auth, scholarships, status, savedIds, openAuth, browseLink } = useApp()
  useDocumentTitle('Saved scholarships')
  const saved = sortScholarships(
    scholarships.filter((s) => savedIds.includes(s.id)),
    'deadline',
  )

  return (
    <>
      <PageBand eyebrow="Keep them close" title="Your saved scholarships.">
        {auth.user && status === 'ready' && (
          <p className="mt-4 text-[1.05rem] text-band-muted">
            {saved.length} saved · soonest deadline first
          </p>
        )}
      </PageBand>
      <PageBody>
        {!auth.ready || status === 'loading' ? (
          <CardSkeletons />
        ) : !auth.user ? (
          <EmptyState title="Sign in to see your list">
            <p>Your saved scholarships are stored with your account, so they’re here on any device.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => openAuth('signin')} className={buttonClass('primary')}>
                Sign in
              </button>
              <button type="button" onClick={() => openAuth('profile')} className={buttonClass('secondary')}>
                Create a profile
              </button>
            </div>
          </EmptyState>
        ) : saved.length === 0 ? (
          <EmptyState title="Nothing saved yet">
            <p>Tap the heart on any scholarship and it will appear here.</p>
            <Link to={browseLink} className={buttonClass('primary')}>
              Browse scholarships
            </Link>
          </EmptyState>
        ) : (
          <ScholarshipGrid scholarships={saved} />
        )}
      </PageBody>
    </>
  )
}
