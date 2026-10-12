export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      role="status"
      className={`pointer-events-none fixed top-[90px] right-[25px] z-20 rounded-[5px] bg-ink px-[18px] py-[13px] text-[.85rem] text-white transition-all duration-[250ms] ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-[15px] opacity-0'
      }`}
    >
      {message}
    </div>
  )
}
