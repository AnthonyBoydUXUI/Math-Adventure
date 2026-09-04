import type { ReactNode } from 'react'

export function PermissionSheet({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string
  body: ReactNode
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="permission-title"
        className="panel w-full max-w-md rounded-sm p-5"
      >
        <h2 id="permission-title" className="font-display text-2xl font-semibold">
          {title}
        </h2>
        <div className="mt-2 text-sm font-medium text-ink">{body}</div>
        <div className="mt-5 grid gap-2">
          <button
            type="button"
            className="press min-h-11 w-full rounded-xl bg-sky font-semibold text-chrome"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <button type="button" className="min-h-11 w-full text-sm font-medium text-ink" onClick={onCancel}>
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
