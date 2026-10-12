export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      role="status"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-50 max-w-[calc(100%-32px)] -translate-x-1/2 rounded-full border border-band-line bg-band px-5 py-3 text-[.9rem] font-medium text-band-fg shadow-soft transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {message}
    </div>
  )
}
