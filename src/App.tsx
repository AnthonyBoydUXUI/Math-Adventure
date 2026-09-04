import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell.tsx'
import { HelpPage } from './pages/HelpPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { LabPage } from './pages/LabPage.tsx'
import { LockerPage } from './pages/LockerPage.tsx'
import { CoachPage, MapPage, MorePage } from './pages/MorePage.tsx'
import { ParentPage } from './pages/ParentPage.tsx'
import { TrainPage } from './pages/TrainPage.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/train" element={<TrainPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/locker" element={<LockerPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/coach" element={<CoachPage />} />
          <Route path="/parent" element={<ParentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
