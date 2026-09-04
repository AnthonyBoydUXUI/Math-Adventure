import { Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LiveDay } from '../components/LiveWorld.tsx'
import { SheetArt } from '../components/SheetArt.tsx'
import { WeekStrip } from '../components/WeekStrip.tsx'
import { WindowBox } from '../components/WindowBox.tsx'
import { SIGNAL_SHEETS } from '../data/sheets.ts'
import { moduleById, skillById } from '../data/curriculum.ts'
import { worldForModule } from '../data/worlds.ts'
import { dayKey } from '../lib/clock.ts'
import { resumeAudio } from '../lib/sfx.ts'
import { usePlayerStore } from '../store.ts'

export function HomePage() {
  const navigate = useNavigate()
  const { mission, parent, resumeOrStart, session, bookmark, practiceDays } = usePlayerStore()
  const mod = moduleById(parent.moduleId)
  const focus = skillById(mission.focusSkillId)
  const world = worldForModule(parent.moduleId)

  function startSession() {
    resumeAudio()
    resumeOrStart(false)
    navigate('/train')
  }

  const cta = session.active ? 'Continue' : session.completed ? 'Next' : 'Start'

  return (
    <div className="px-4 pb-8">
      <WindowBox stamp={world.district} series={`M${mod?.number ?? ''} · Live`}>
        <LiveDay />
        <div className="bg-[#070910] px-4 py-5 text-white">
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
      </WindowBox>

      <WindowBox className="mt-4" stamp="Signal" series="Harbor RS">
        <SheetArt src={SIGNAL_SHEETS.hero} alt="Signal and the Harbor RS" />
      </WindowBox>

      <div className="mt-4">
        <WeekStrip practiced={practiceDays} inProgressKey={session.active ? dayKey() : undefined} />
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-navy">{bookmark.label}</p>
    </div>
  )
}
