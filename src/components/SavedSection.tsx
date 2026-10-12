import { ArrowRight, Heart } from 'lucide-react'
import type { Scholarship } from '../types'
import { ScholarshipGrid } from './ScholarshipGrid'
import { SectionHeading } from './SectionHeading'

interface Props {
  saved: Scholarship[]
  savedIds: string[]
  onToggleSave: (id: string) => void
  onShowDetail: (id: string) => void
}

export function SavedSection({ saved, ...grid }: Props) {
  return (
    <section id="saved" className="section-shell pb-[90px]">
      <SectionHeading eyebrow="Keep them close" title="Your saved scholarships." summary={saved.length ? `${saved.length} saved` : ''} />
      {saved.length > 0 ? (
        <ScholarshipGrid scholarships={saved} {...grid} />
      ) : (
        <div className="flex min-h-[150px] items-center justify-center gap-[15px] rounded-lg border border-dashed border-[#b6c9be] text-muted max-sm:flex-col max-sm:p-[25px] max-sm:text-center">
          <Heart aria-hidden className="size-7 text-coral" />
          <p className="m-0">Save scholarships while you browse and they’ll appear here.</p>
          <a href="#search" className="flex items-center gap-1 p-2.5 font-bold text-coral">
            Browse opportunities <ArrowRight aria-hidden className="size-3.5" />
          </a>
        </div>
      )}
    </section>
  )
}
