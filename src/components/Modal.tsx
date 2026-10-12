import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  labelledBy?: string
  children: ReactNode
}

/** A native <dialog> opened with showModal(), so focus trapping and Escape come from the browser. */
export function Modal({ open, onClose, labelledBy, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={labelledBy}
      className="w-[min(480px,calc(100%_-_32px))] rounded-3xl border border-line bg-card p-8 text-fg shadow-soft backdrop:bg-[#0a1714]/70 backdrop:backdrop-blur-[2px] max-sm:p-6"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 grid size-9 place-items-center rounded-full text-muted transition hover:bg-mint hover:text-fg"
      >
        <X aria-hidden className="size-[18px]" />
      </button>
      {children}
    </dialog>
  )
}
