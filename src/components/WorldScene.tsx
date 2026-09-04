import { SIGNAL_SHEETS } from '../data/sheets.ts'
import { worldForModule } from '../data/worlds.ts'
import { cn } from '../lib/cn.ts'
import { LiveWorld } from './LiveWorld.tsx'
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
  if (sheet === 'map') {
    return <LiveWorld worldId={world.id} compact={embed} className={className} />
  }
  return (
    <div
      className={cn(
        embed
          ? 'relative h-56 w-full overflow-hidden bg-[#05070b]'
          : 'relative overflow-hidden bg-[#05070b]',
        className,
      )}
    >
      <SheetArt src={SIGNAL_SHEETS.hero} alt="Signal and the Harbor RS" cover={embed} className={embed ? 'h-full' : undefined} />
    </div>
  )
}
