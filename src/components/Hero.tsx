import { ArrowRight, Plane } from 'lucide-react'
import { buttonClass } from './button'
import { SparkleMark } from './SparkleMark'

export function Hero({ onSignUp }: { onSignUp: () => void }) {
  return (
    <section
      id="home"
      className="section-shell grid min-h-[530px] grid-cols-2 items-center gap-[35px] max-md:grid-cols-1 max-md:pt-[65px] max-md:pb-10"
    >
      <div>
        <p className="eyebrow">Make your next chapter possible</p>
        <h1 className="mt-0 mb-[25px] max-w-[600px] font-display text-[clamp(2.8rem,5vw,4.7rem)] leading-[1.05] tracking-[-.05em] max-sm:text-[2.8rem]">
          Find funding for the future you’re building.
        </h1>
        <p className="max-w-[480px] text-[1.15rem] leading-[1.65] text-muted">
          Search a thoughtful collection of scholarships matched to your goals, background, and big plans.
        </p>
        <div className="mt-[30px] flex items-center gap-[15px] max-sm:flex-col max-sm:items-stretch">
          <a href="#search" className={buttonClass('primary')}>
            Explore scholarships <ArrowRight aria-hidden className="size-4" />
          </a>
          <button type="button" onClick={onSignUp} className={buttonClass('quiet')}>
            Create a free profile
          </button>
        </div>
        <div className="mt-[42px] flex items-center text-[.78rem] text-[#83908c]">
          <SparkleMark className="mr-2 size-3 text-coral" /> Curated opportunities
          <span className="mx-2 text-coral">·</span> Built for students
        </div>
      </div>
      <HeroArt />
    </section>
  )
}

function HeroArt() {
  return (
    <div
      aria-hidden
      className="relative h-[390px] -rotate-5 overflow-hidden rounded-[50%_48%_52%_42%] bg-mint max-md:mx-auto max-md:w-full max-md:max-w-[570px] max-sm:h-[300px]"
    >
      <div className="absolute top-[15px] -right-[15px] size-[290px] rounded-full bg-[#f7d57a]" />
      <HeroCard label="AWARD" value="$10,000" note="Women in STEM" className="top-[75px] left-[50px] rotate-7 max-sm:top-[45px] max-sm:left-[18px]" />
      <HeroCard label="DEADLINE" value="Apr 30" note="Keep going, Maya." className="right-[42px] bottom-[60px] -rotate-7 max-sm:right-3 max-sm:bottom-[30px]" />
      <Plane className="absolute top-[44%] left-[42%] size-14 rotate-[63deg] fill-coral text-coral" />
      <SparkleMark className="absolute top-[105px] right-[25px] size-7 text-coral" />
      <SparkleMark className="absolute bottom-10 left-20 size-7 text-white" />
    </div>
  )
}

function HeroCard({ label, value, note, className }: { label: string; value: string; note: string; className: string }) {
  return (
    <div className={`absolute flex flex-col gap-[5px] rounded-[7px] bg-paper px-[22px] py-[19px] shadow-soft ${className}`}>
      <span className="text-[.63rem] font-bold tracking-[.13em] text-coral">{label}</span>
      <strong className="font-display text-[1.7rem]">{value}</strong>
      <small className="text-muted">{note}</small>
    </div>
  )
}
