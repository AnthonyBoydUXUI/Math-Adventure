import { useEffect } from 'react'
import { DayClock } from './DayClock.tsx'
import { Cloud, FlaskConical, Gauge, Home, LifeBuoy, MoreHorizontal, Trophy, Volume2, VolumeX } from 'lucide-react'
import { CastMark } from './Aero.tsx'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useCloud } from '../cloud/CloudProvider.tsx'
import { worldForModule } from '../data/worlds.ts'
import { buildTestReport } from '../engine/testReady.ts'
import { useDeviceSurface } from '../hooks/useDeviceSurface.ts'
import { cn } from '../lib/cn.ts'
import { resumeAudio, setMuted, startAmbient } from '../lib/sfx.ts'
import { usePlayerStore } from '../store.ts'
import { ComplianceGate } from './ComplianceGate.tsx'

const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/train', label: 'Run', icon: Gauge },
  { to: '/lab', label: 'Lab', icon: FlaskConical },
  { to: '/help', label: 'Help', icon: LifeBuoy },
  { to: '/locker', label: 'Gear', icon: Trophy },
  { to: '/more', label: 'More', icon: MoreHorizontal },
]

const UNGATED = new Set(['/privacy', '/terms', '/support', '/privacy-center'])

export function Shell() {
  const { sparks, streak, toast, setToast, soundOn, toggleSound, parent, compliance, attempts } =
    usePlayerStore()
  const cloud = useCloud()
  const surface = useDeviceSurface()
  const readiness = buildTestReport(attempts).readiness
  const audioEnabled = soundOn !== false
  const loc = useLocation()
  const world = worldForModule(parent.moduleId)
  const gated = !compliance.acknowledgedAt && !UNGATED.has(loc.pathname)
  const compact = loc.pathname === '/watch' || surface === 'watch'

  useEffect(() => {
    usePlayerStore.getState().ensureToday()
    const rollover = window.setInterval(() => usePlayerStore.getState().ensureToday(), 60_000)
    const unlock = () => {
      const s = usePlayerStore.getState()
      void resumeAudio()
      setMuted(!s.soundOn)
      if (s.soundOn) {
        const phase = s.session.active
          ? (s.mission.phases[s.session.phaseIndex]?.phase ?? 'idle')
          : s.session.completed
            ? 'recap'
            : 'idle'
        startAmbient(worldForModule(s.parent.moduleId).id, phase)
      }
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    return () => {
      window.clearInterval(rollover)
      window.removeEventListener('pointerdown', unlock)
    }
  }, [])

  if (gated) return <ComplianceGate />

  return (
    <div
      className={cn(
        'shell-frame mx-auto min-h-dvh',
        compact
          ? 'max-w-[280px] pb-6'
          : 'max-w-xl pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:max-w-2xl lg:max-w-3xl',
      )}
      data-surface={surface}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 flex items-center gap-1.5 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden border-2 border-[#f3efe6]" aria-hidden>
          <CastMark className="h-11 w-11" />
        </div>
        <div className="hud-chip flex min-h-11 items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em]">
          <span className="sr-only">Test readiness</span>
          {readiness || '—'}
        </div>
        <div className="hud-chip flex min-h-11 items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em]">
          <span className="sr-only">Finished-day streak</span>
          {streak}
        </div>
        <button
          type="button"
          className={cn(
            'hud-chip flex h-11 w-11 items-center justify-center',
            !audioEnabled && 'opacity-40',
          )}
          aria-label={audioEnabled ? 'Mute sound' : 'Turn sound on'}
          onClick={() => {
            void resumeAudio()
            toggleSound()
          }}
        >
          {audioEnabled ? <Volume2 className="h-4 w-4 text-sky" /> : <VolumeX className="h-4 w-4 text-ink" />}
        </button>
        {cloud.user ? (
          <Link
            to="/account"
            className="hud-chip flex h-11 w-11 items-center justify-center"
            aria-label={cloud.status === 'synced' ? 'Cloud backup on' : 'Account'}
          >
            <Cloud className={cn('h-4 w-4', cloud.status === 'synced' ? 'text-leaf' : 'text-gold')} />
          </Link>
        ) : null}
        <div className="hud-chip ml-auto flex min-h-11 items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em]">
          <span className="sr-only">Sparks for extra hints</span>
          {sparks}
        </div>
      </header>

      <div className="flex items-center justify-between gap-3 px-5 pb-2">
        {loc.pathname === '/train' ? null : (
          <>
            <p className="stamp text-ink">{world.name}</p>
            <DayClock compact />
          </>
        )}
      </div>

      <main id="main">
        <Outlet />
        <footer
          className={cn(
            'px-4 pb-2 pt-8 text-center text-[11px] font-medium text-ink',
            (compact || loc.pathname === '/' || loc.pathname === '/train') && 'hidden',
          )}
        >
          <Link to="/privacy" className="inline-flex min-h-11 items-center text-sky">
            Privacy
          </Link>
          {' · '}
          <Link to="/terms" className="inline-flex min-h-11 items-center text-sky">
            Terms
          </Link>
          {' · '}
          <Link to="/support" className="inline-flex min-h-11 items-center text-sky">
            Support
          </Link>
        </footer>
      </main>

      {toast ? (
        <button
          type="button"
          className="fixed bottom-28 left-1/2 z-40 min-h-11 -translate-x-1/2 rounded-sm border border-sky/40 bg-chrome px-4 py-2 text-sm font-semibold text-sky"
          onClick={() => setToast(undefined)}
        >
          {toast}
        </button>
      ) : null}

      <nav className={cn('dock fixed bottom-0 left-0 right-0 z-30 px-2 pt-2', compact && 'hidden')} aria-label="Primary">
        <div className="mx-auto flex max-w-xl items-end justify-around pb-[max(0.5rem,env(safe-area-inset-bottom))] md:max-w-2xl lg:max-w-3xl">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} aria-label={item.label} className="flex min-h-11 flex-col items-center gap-1 px-1">
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-sm border border-transparent text-ink',
                      isActive && 'border-sky/40 bg-white/5 text-sky',
                    )}
                  >
                    <item.icon className="h-5 w-5" aria-hidden />
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
