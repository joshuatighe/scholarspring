import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  labelledBy?: string
  wide?: boolean
  children: ReactNode
}

/** A native <dialog> opened with showModal(), so focus trapping and Escape come from the browser. */
export function Modal({ open, onClose, labelledBy, wide = false, children }: Props) {
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
      className={`rounded-[10px] bg-paper p-[35px] text-ink shadow-[0_20px_70px_#19363140] backdrop:bg-[#19363188] ${
        wide ? 'w-[min(600px,calc(100%_-_32px))]' : 'w-[min(480px,calc(100%_-_32px))]'
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-[18px] right-[18px] grid size-[30px] place-items-center rounded-full bg-cream text-muted"
      >
        <X aria-hidden className="size-4" />
      </button>
      {children}
    </dialog>
  )
}
