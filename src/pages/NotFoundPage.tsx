import { Link } from 'react-router'
import { buttonClass } from '../components/button'
import { EmptyState, PageBand, PageBody } from '../components/PageBand'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <>
      <PageBand eyebrow="404" title="This page doesn’t exist." />
      <PageBody>
        <EmptyState title="Let’s get you back on track">
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/" className={buttonClass('primary')}>
              Home
            </Link>
            <Link to="/scholarships" className={buttonClass('secondary')}>
              Browse scholarships
            </Link>
          </div>
        </EmptyState>
      </PageBody>
    </>
  )
}
