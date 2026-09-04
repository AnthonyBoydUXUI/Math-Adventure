import { useEffect } from 'react'
import { Flame, Hexagon, MoreHorizontal, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { worldForModule } from '../data/worlds.ts'
import { levelFromXp, xpIntoLevel } from '../engine/scoring.ts'
import { cn } from '../lib/cn.ts'
import { resumeAudio, setMuted, startAmbient } from '../lib/sfx.ts'
import { usePlayerStore } from '../store.ts'
import { Aero } from './Aero.tsx'

const NAV = [
  { to: '/', label: 'Home', color: 'bg-gold', icon: '⌂' },
  { to: '/train', label: 'Flight', color: 'bg-pink', icon: '✈' },
  { to: '/lab', label: 'Lab', color: 'bg-violet', icon: '⚗' },
  { to: '/help', label: 'Help', color: 'bg-sky', icon: '✎' },
  { to: '/locker', label: 'Locker', color: 'bg-leaf', icon: '▣' },
  { to: '/more', label: 'More', color: 'bg-navy', icon: '⋯' },
]

export function Shell() {
  const { xp, sparks, streak, cosmetics, toast, setToast, studentName, soundOn, toggleSound, parent } =
    usePlayerStore()
  const level = levelFromXp(xp)
  const into = xpIntoLevel(xp)
  const audioEnabled = soundOn !== false
  const loc = useLocation()

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
    <div className="mx-auto min-h-dvh max-w-lg pb-28">
      <header className="sticky top-0 z-30 flex items-center gap-2 px-4 py-3 backdrop-blur-md">
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border-2 border-navy bg-white aero-bob">
          <Aero className="h-12 w-12" goggles={cosmetics.goggles} hoodie={cosmetics.hoodie} kicks={cosmetics.kicks} />
        </div>
        <div className="hud-pill flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-extrabold">
          <Flame className="h-4 w-4 text-orange" />
          {streak}
        </div>
        <div className="hud-pill flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-extrabold">
          <Hexagon className="h-4 w-4 fill-sky text-sky" />
          {sparks}
        </div>
        <button
          type="button"
          className={cn('hud-pill flex items-center rounded-full px-2 py-1', !audioEnabled && 'opacity-50')}
          aria-label={audioEnabled ? 'Mute sound' : 'Turn sound on'}
          onClick={() => {
            void resumeAudio()
            toggleSound()
          }}
        >
          {audioEnabled ? <Volume2 className="h-4 w-4 text-leaf" /> : <VolumeX className="h-4 w-4" />}
        </button>
        <div className="hud-pill ml-auto flex items-center gap-2 rounded-full px-2.5 py-1 text-sm font-extrabold">
          <Sparkles className="h-4 w-4 text-violet" />
          Lv {level}
          <span className="h-2 w-14 overflow-hidden rounded-full bg-mist">
            <span className="block h-full bg-violet" style={{ width: `${(into / 120) * 100}%` }} />
          </span>
        </div>
      </header>

      {loc.pathname === '/' ? (
        <p className="px-5 pb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-navy/45">
          {studentName} · {worldForModule(parent.moduleId).district}
        </p>
      ) : null}

      <Outlet />

      {toast ? (
        <button
          type="button"
          className="fixed bottom-28 left-1/2 z-40 -translate-x-1/2 rounded-full border-2 border-navy bg-gold px-4 py-2 text-sm font-extrabold shadow-[0_4px_0_#141628]"
          onClick={() => setToast(undefined)}
        >
          {toast}
        </button>
      ) : null}

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t-2 border-navy bg-cream/95 px-2 py-2 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-end justify-around">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className="flex flex-col items-center gap-1">
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-navy text-lg font-black text-white press',
                      item.color,
                      isActive ? 'translate-y-[-2px]' : 'opacity-90',
                    )}
                  >
                    {item.to === '/more' ? <MoreHorizontal className="h-5 w-5" /> : item.icon}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
