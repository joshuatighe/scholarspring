import { ArrowRight, Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { EMPTY_FILTERS, type Filters } from '../lib/matching'
import { FILTER_MAJORS, REGIONS } from '../lib/options'
import type { Scholarship } from '../types'
import { buttonClass } from './button'
import { SparkleMark } from './SparkleMark'
import { ScholarshipGrid } from './ScholarshipGrid'
import { SectionHeading } from './SectionHeading'

interface Props {
  results: Scholarship[]
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  showProfileTip: boolean
  onCompleteProfile: () => void
  savedIds: string[]
  onToggleSave: (id: string) => void
  onShowDetail: (id: string) => void
}

export function SearchSection({ results, filters, onFiltersChange, showProfileTip, onCompleteProfile, ...grid }: Props) {
  const set = (key: keyof Filters) => (event: { target: { value: string } }) =>
    onFiltersChange({ ...filters, [key]: event.target.value })

  return (
    <section id="search" className="section-shell pt-[84px] pb-20">
      <SectionHeading
        eyebrow="Your opportunities"
        title="Find a scholarship that fits."
        summary={`${results.length} ${results.length === 1 ? 'opportunity' : 'opportunities'} found`}
      />

      <div className="mb-[18px] grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 rounded-lg bg-paper p-4 shadow-soft max-md:grid-cols-2 max-sm:grid-cols-1">
        <label className="relative flex flex-col justify-center gap-[7px] max-md:col-span-full">
          <Search aria-hidden className="absolute left-[13px] size-[18px] text-muted" />
          <input
            type="search"
            aria-label="Search scholarships"
            placeholder="Search by scholarship name or keyword"
            value={filters.query}
            onChange={set('query')}
            className="pl-10"
          />
        </label>
        <Field label="Major">
          <select value={filters.major} onChange={set('major')}>
            <option value="">All majors</option>
            {FILTER_MAJORS.map((major) => (
              <option key={major}>{major}</option>
            ))}
          </select>
        </Field>
        <Field label="Region">
          <select value={filters.region} onChange={set('region')}>
            <option value="">Any region</option>
            {REGIONS.map((region) => (
              <option key={region}>{region}</option>
            ))}
          </select>
        </Field>
        <Field label="Your GPA">
          <input type="number" min="0" max="4" step="0.1" placeholder="Any GPA" value={filters.gpa} onChange={set('gpa')} />
        </Field>
      </div>

      {showProfileTip && (
        <div className="mb-[18px] flex items-center gap-2.5 rounded-md bg-[#eef6ed] px-4 py-[11px] text-[.88rem] text-[#49645b]">
          <SparkleMark className="size-4 shrink-0 text-coral" />
          <p className="m-0">Tell us about yourself and we’ll personalize these results.</p>
          <button type="button" onClick={onCompleteProfile} className="ml-auto flex items-center gap-1 p-[5px] font-bold text-ink">
            Complete profile <ArrowRight aria-hidden className="size-3.5" />
          </button>
        </div>
      )}

      {results.length > 0 ? (
        <ScholarshipGrid scholarships={results} {...grid} />
      ) : (
        <div className="px-[15px] py-[70px] text-center">
          <Search aria-hidden className="mx-auto size-9 text-coral" />
          <h3 className="m-2.5 font-display text-[1.7rem]">No scholarships found</h3>
          <p className="text-muted">Try changing your search or filters to see more opportunities.</p>
          <button
            type="button"
            onClick={() => onFiltersChange(EMPTY_FILTERS)}
            className={buttonClass('outline')}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-[7px]">
      <span className="text-[.7rem] font-bold tracking-[.07em] text-muted uppercase">{label}</span>
      {children}
    </label>
  )
}
