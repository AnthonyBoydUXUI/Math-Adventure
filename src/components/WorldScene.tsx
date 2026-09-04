import { SIGNAL_SHEETS, worldMap } from '../data/sheets.ts'
import { worldForModule } from '../data/worlds.ts'
import { cn } from '../lib/cn.ts'
import { SheetArt } from './SheetArt.tsx'

export function WorldScene({
  moduleId,
  className,
  embed,
  sheet = 'map',
}: {
  moduleId: string
  className?: string
  paint?: string
  wheels?: string
  wing?: string
  visor?: string
  suit?: string
  kicks?: string
  mood?: string
  embed?: boolean
  sheet?: 'map' | 'hero'
}) {
  const world = worldForModule(moduleId)
  const src = sheet === 'hero' ? SIGNAL_SHEETS.hero : worldMap(world.id)
  const alt = sheet === 'hero' ? 'Signal and the Harbor RS' : `${world.district} map`
  return (
    <div
      className={cn(
        embed
          ? 'relative h-56 w-full overflow-hidden bg-[#05070b]'
          : 'relative overflow-hidden bg-[#05070b]',
        className,
      )}
    >
      <SheetArt src={src} alt={alt} cover={embed} className={embed ? 'h-full' : undefined} />
    </div>
  )
}
