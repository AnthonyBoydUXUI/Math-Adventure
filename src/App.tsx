import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { CloudProvider } from './cloud/CloudProvider.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { Shell } from './components/Shell.tsx'
import { useDeviceSurface } from './hooks/useDeviceSurface.ts'
import { AccountPage } from './pages/AccountPage.tsx'
import { HelpPage } from './pages/HelpPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { LabPage } from './pages/LabPage.tsx'
import { LegalPage } from './pages/LegalPage.tsx'
import { LockerPage } from './pages/LockerPage.tsx'
import { CoachPage, MapPage, MorePage } from './pages/MorePage.tsx'
import { ParentPage } from './pages/ParentPage.tsx'
import { PrivacyCenter } from './pages/PrivacyCenter.tsx'
import { TrainPage } from './pages/TrainPage.tsx'
import { WatchPage } from './pages/WatchPage.tsx'
import { usePlayerStore } from './store.ts'

function WatchRedirect() {
  const surface = useDeviceSurface()
  const loc = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (surface === 'watch' && loc.pathname === '/') navigate('/watch', { replace: true })
  }, [surface, loc.pathname, navigate])
  return null
}

function HydratedRoutes() {
  const [ready, setReady] = useState(() => usePlayerStore.persist.hasHydrated())

  useEffect(() => {
    const unsub = usePlayerStore.persist.onFinishHydration(() => setReady(true))
    if (usePlayerStore.persist.hasHydrated()) {
      queueMicrotask(() => setReady(true))
    }
    return unsub
  }, [])

  if (!ready) {
    return (
      <div className="grid min-h-dvh place-items-center text-sm font-medium text-ink" role="status">
        Loading Aero…
      </div>
    )
  }

  return (
    <CloudProvider>
      <WatchRedirect />
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/train" element={<TrainPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/locker" element={<LockerPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/watch" element={<WatchPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/coach" element={<CoachPage />} />
          <Route path="/parent" element={<ParentPage />} />
          <Route path="/privacy" element={<LegalPage kind="privacy" />} />
          <Route path="/terms" element={<LegalPage kind="terms" />} />
          <Route path="/support" element={<LegalPage kind="support" />} />
          <Route path="/privacy-center" element={<PrivacyCenter />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </CloudProvider>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <HydratedRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
