import { GameViewport } from '../engine/render/GameViewport.tsx'
import type { CastMood } from '../engine/render/cast/canon.ts'
import { worldForModule } from '../data/worlds.ts'
import { cn } from '../lib/cn.ts'

export function WorldScene({
  moduleId,
  className,
  paint,
  wheels,
  wing,
  visor,
  suit,
  kicks,
  mood,
  embed,
}: {
  moduleId: string
  className?: string
  paint?: string
  wheels?: string
  wing?: string
  visor?: string
  suit?: string
  kicks?: string
  mood?: CastMood
  embed?: boolean
}) {
  const world = worldForModule(moduleId)
  return (
    <div
      className={cn(
        embed
          ? 'relative h-56 w-full overflow-hidden bg-[#05070b]'
          : 'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
      aria-hidden
    >
      <GameViewport
        districtId={world.id}
        color={world.color}
        paint={paint}
        wheels={wheels}
        wing={wing}
        visor={visor}
        suit={suit}
        kicks={kicks}
        mood={mood}
      />
    </div>
  )
}
