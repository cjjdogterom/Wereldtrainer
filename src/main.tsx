import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './Home.tsx'

// Elke leermodule is een eigen chunk: de home laadt licht en snel.
const TopografieApp = lazy(() => import('./App.tsx'))
const VoetbalApp = lazy(() => import('./voetbal/App.tsx'))
const SeinenApp = lazy(() => import('./seinen/App.tsx'))
const KnopenApp = lazy(() => import('./knopen/App.tsx'))
const KerkApp = lazy(() => import('./kerk/App.tsx'))
const EuropaApp = lazy(() => import('./europa/App.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div className="module-loading">Laden…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topografie/*" element={<TopografieApp />} />
          <Route path="/voetbal/*" element={<VoetbalApp />} />
          <Route path="/seinen/*" element={<SeinenApp />} />
          <Route path="/knopen/*" element={<KnopenApp />} />
          <Route path="/kerk/*" element={<KerkApp />} />
          <Route path="/europa/*" element={<EuropaApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
