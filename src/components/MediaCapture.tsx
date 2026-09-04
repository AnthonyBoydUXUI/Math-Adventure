import { useRef, useState, type ReactNode } from 'react'
import { CAMERA_PREAMBLE } from '../content/legal.ts'
import { usePlayerStore } from '../store.ts'
import { PermissionSheet } from './PermissionSheet.tsx'

export function MediaCapture({
  label,
  className,
  capture,
  onPhoto,
}: {
  label: ReactNode
  className?: string
  capture?: boolean
  onPhoto: (dataUrl: string) => void
}) {
  const explained = usePlayerStore((s) => s.permissions.cameraExplained)
  const markPermissionExplained = usePlayerStore((s) => s.markPermissionExplained)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function pick() {
    if (!explained) {
      setOpen(true)
      return
    }
    inputRef.current?.click()
  }

  return (
    <>
      <button type="button" className={className} onClick={pick}>
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={capture ? 'environment' : undefined}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file) return
          const reader = new FileReader()
          reader.onload = () => onPhoto(String(reader.result))
          reader.readAsDataURL(file)
        }}
      />
      {open ? (
        <PermissionSheet
          title="Photos stay on this device"
          body={CAMERA_PREAMBLE}
          confirmLabel="Choose a photo"
          onConfirm={() => {
            markPermissionExplained('camera')
            setOpen(false)
            requestAnimationFrame(() => inputRef.current?.click())
          }}
          onCancel={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}
