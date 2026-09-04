import { Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { WeekStrip } from '../components/WeekStrip.tsx'
import { WindowBox } from '../components/WindowBox.tsx'
import { WorldScene } from '../components/WorldScene.tsx'
import { moduleById, skillById } from '../data/curriculum.ts'
import { worldForModule } from '../data/worlds.ts'
import { dayKey } from '../lib/clock.ts'
import { resumeAudio } from '../lib/sfx.ts'
import { usePlayerStore } from '../store.ts'

export function HomePage() {
  const navigate = useNavigate()
  const { mission, parent, cosmetics, resumeOrStart, session, bookmark, practiceDays } = usePlayerStore()
  const mod = moduleById(parent.moduleId)
  const focus = skillById(mission.focusSkillId)
  const world = worldForModule(parent.moduleId)

  function startSession() {
    resumeAudio()
    resumeOrStart(false)
    navigate('/train')
  }

  const cta = session.active ? 'Continue' : session.completed ? 'Next' : 'Start'
  const mood = session.completed ? 'cheer' : session.active ? 'lockin' : 'idle'

  return (
    <div className="px-4 pb-8">
      <WindowBox stamp="12+" series={`M${mod?.number ?? ''}`}>
        <div className="relative min-h-[320px] text-white">
          <WorldScene
            moduleId={parent.moduleId}
            paint={cosmetics.paint}
            wheels={cosmetics.wheels}
            wing={cosmetics.wing}
            visor={cosmetics.goggles}
            suit={cosmetics.hoodie}
            kicks={cosmetics.kicks}
            mood={mood}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070910] via-transparent to-transparent" />
          <div className="relative flex min-h-[320px] flex-col justify-end px-4 pb-5 pt-10">
            <h1 className="type-pack text-[44px]">{world.name}</h1>
            <p className="mt-1 text-sm font-semibold text-white/80">{world.adventure}</p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">{focus?.name}</p>
            <button
              type="button"
              className="press mt-4 inline-flex w-fit items-center gap-2 bg-[#0e1a3a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-bone"
              onClick={startSession}
            >
              <Play className="h-4 w-4 fill-gold text-gold" />
              {cta}
            </button>
          </div>
        </div>
      </WindowBox>

      <div className="mt-4">
        <WeekStrip practiced={practiceDays} inProgressKey={session.active ? dayKey() : undefined} />
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-navy">{bookmark.label}</p>
    </div>
  )
}
