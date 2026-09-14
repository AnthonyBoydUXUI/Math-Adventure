import { useRef, useState, type ReactNode } from 'react'
import { CAMERA_PREAMBLE } from '../content/legal.ts'
import { compressPhoto } from '../lib/photos.ts'
import { usePlayerStore } from '../store.ts'
import { PermissionSheet } from './PermissionSheet.tsx'

export function MediaCapture({
  label,
  className,
  capture,
  multiple,
  onPhoto,
  onPhotos,
}: {
  label: ReactNode
  className?: string
  capture?: boolean
  multiple?: boolean
  onPhoto?: (dataUrl: string) => void
  onPhotos?: (dataUrls: string[]) => void
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

  async function readFiles(list: FileList | null) {
    const files = Array.from(list ?? []).filter((f) => f.type.startsWith('image/'))
    if (!files.length) return
    const urls: string[] = []
    for (const file of files) {
      const raw = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
      })
      urls.push(await compressPhoto(raw))
    }
    if (urls[0]) onPhoto?.(urls[0])
    onPhotos?.(urls)
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
        multiple={multiple}
        capture={capture && !multiple ? 'environment' : undefined}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const list = e.target.files
          e.target.value = ''
          void readFiles(list)
        }}
      />
      {open ? (
        <PermissionSheet
          title="Photos stay on this device"
          body={CAMERA_PREAMBLE}
          confirmLabel={multiple ? 'Choose pages' : 'Choose a photo'}
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
