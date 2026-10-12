import { ArrowRight } from 'lucide-react'
import { buttonClass } from './button'

export function CtaSection({ onSignUp }: { onSignUp: () => void }) {
  return (
    <section className="section-shell mb-20 flex items-center justify-between rounded-xl bg-ink py-12 text-white max-md:mx-[15px] max-sm:block">
      <div>
        <p className="eyebrow text-yellow">A little help goes a long way</p>
        <h2 className="m-0 font-display text-[2.3rem] tracking-[-.04em]">Ready to make a plan?</h2>
        <p className="max-w-[480px] text-[#c8d4d0]">
          Build your student profile once and let ScholarSpring surface opportunities that make sense for you.
        </p>
      </div>
      <button type="button" onClick={onSignUp} className={`${buttonClass('light')} max-sm:mt-[18px]`}>
        Build my profile <ArrowRight aria-hidden className="size-4" />
      </button>
    </section>
  )
}
