import { SIGNAL_SHEETS } from '../data/sheets.ts'
import { cn } from '../lib/cn.ts'

export function SheetArt({
  src,
  alt,
  className,
  cover,
}: {
  src: string
  alt: string
  className?: string
  cover?: boolean
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('block w-full bg-[#05070b]', cover ? 'h-full object-cover' : 'object-contain', className)}
    />
  )
}

export function SignalBust({ className }: { className?: string }) {
  return <SheetArt src={SIGNAL_SHEETS.bust} alt="Signal" className={cn('bg-transparent', className)} />
}
