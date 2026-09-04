import { useEffect } from 'react'
import {
  Crosshair,
  FlaskConical,
  Gauge,
  Home,
  LifeBuoy,
  MoreHorizontal,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { worldForModule } from '../data/worlds.ts'
import { levelFromXp, xpIntoLevel } from '../engine/scoring.ts'
import { cn } from '../lib/cn.ts'
import { resumeAudio, setMuted, startAmbient } from '../lib/sfx.ts'
import { usePlayerStore } from '../store.ts'

const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/train', label: 'Session', icon: Gauge },
  { to: '/lab', label: 'Lab', icon: FlaskConical },
  { to: '/help', label: 'Assist', icon: LifeBuoy },
  { to: '/locker', label: 'Garage', icon: Trophy },
  { to: '/more', label: 'System', icon: MoreHorizontal },
]

export function Shell() {
  const { xp, sparks, streak, toast, setToast, studentName, soundOn, toggleSound, parent } =
    usePlayerStore()
  const level = levelFromXp(xp)
  const into = xpIntoLevel(xp)
  const audioEnabled = soundOn !== false
  const loc = useLocation()
  const world = worldForModule(parent.moduleId)

  useEffect(() => {
    const unlock = () => {
      void resumeAudio()
      setMuted(!usePlayerStore.getState().soundOn)
      if (usePlayerStore.getState().soundOn) {
        startAmbient(worldForModule(usePlayerStore.getState().parent.moduleId).id)
      }
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    return () => window.removeEventListener('pointerdown', unlock)
  }, [])

  return (
    <div className="mx-auto min-h-dvh max-w-xl pb-28">
      <header className="sticky top-0 z-30 flex items-center gap-2 px-4 py-3 backdrop-blur-xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-paper">
          <Crosshair className="h-4 w-4 text-sky" />
        </div>
        <div className="hud-pill flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
          <Zap className="h-3.5 w-3.5 text-gold" />
          {streak}
        </div>
        <div className="hud-pill flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-sky" />
          {sparks}
        </div>
        <button
          type="button"
          className={cn('hud-pill flex items-center rounded-full px-2 py-1', !audioEnabled && 'opacity-40')}
          aria-label={audioEnabled ? 'Mute sound' : 'Turn sound on'}
          onClick={() => {
            void resumeAudio()
            toggleSound()
          }}
        >
          {audioEnabled ? <Volume2 className="h-4 w-4 text-sky" /> : <VolumeX className="h-4 w-4 text-ink" />}
        </button>
        <div className="hud-pill ml-auto flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold">
          <span className="text-ink">LV</span>
          {level}
          <span className="h-1 w-16 overflow-hidden rounded-full bg-mist">
            <span className="block h-full bg-sky" style={{ width: `${(into / 120) * 100}%` }} />
          </span>
        </div>
      </header>

      {loc.pathname === '/' ? (
        <p className="px-5 pb-1 text-[11px] font-medium uppercase tracking-[0.22em] text-ink">
          {studentName} · {world.district}
        </p>
      ) : null}

      <Outlet />

      {toast ? (
        <button
          type="button"
          className="fixed bottom-28 left-1/2 z-40 -translate-x-1/2 rounded-full border border-sky/40 bg-chrome px-4 py-2 text-sm font-semibold text-sky"
          onClick={() => setToast(undefined)}
        >
          {toast}
        </button>
      ) : null}

      <nav className="dock fixed bottom-0 left-0 right-0 z-30 px-2 py-2">
        <div className="mx-auto flex max-w-xl items-end justify-around">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className="flex flex-col items-center gap-1">
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-ink',
                      isActive && 'border-sky/40 bg-white/5 text-sky',
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className={cn('text-[10px] font-medium uppercase tracking-[0.14em]', isActive ? 'text-sky' : 'text-ink')}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
