import { useRef } from 'react'
import { X } from 'lucide-react'
import type { MediaRef } from '@/types/content'

/** Opens a certificate in a native dialog, which handles focus and Escape. */
export function CertificateViewer({ image, label }: { image: MediaRef; label: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  return (
    <>
      <button
        type="button"
        aria-label={`View certificate: ${label}`}
        onClick={() => dialogRef.current?.showModal()}
        className="min-h-11 underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
      >
        View certificate
      </button>
      <dialog
        ref={dialogRef}
        aria-label={label}
        onClick={(event) => event.target === dialogRef.current && dialogRef.current.close()}
        className="m-auto max-h-[92vh] w-[min(64rem,calc(100vw-2rem))] border border-line-strong bg-charcoal p-0 text-paper backdrop:bg-ink/90"
      >
        <div className="flex items-center justify-between gap-4 p-3 pl-4">
          <p className="meta">{label}</p>
          <button type="button" aria-label="Close" onClick={() => dialogRef.current?.close()} className="flex size-11 shrink-0 items-center justify-center">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <img src={image.url} alt={image.alt} loading="lazy" className="w-full" />
      </dialog>
    </>
  )
}
