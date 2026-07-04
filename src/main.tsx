import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './Home.tsx'

// Elke leermodule is een eigen chunk: de home laadt licht en snel.
const TopografieApp = lazy(() => import('./App.tsx'))
const VoetbalApp = lazy(() => import('./voetbal/App.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div className="module-loading">Laden…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topografie/*" element={<TopografieApp />} />
          <Route path="/voetbal/*" element={<VoetbalApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
