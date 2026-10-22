import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import Dag from './dag/Dag.tsx'
import Navigatie from './ui/Navigatie.tsx'

// Elke leermodule is een eigen chunk: de home laadt licht en snel.
const TopografieApp = lazy(() => import('./App.tsx'))
const VoetbalApp = lazy(() => import('./voetbal/App.tsx'))
const SeinenApp = lazy(() => import('./seinen/App.tsx'))
const KnopenApp = lazy(() => import('./knopen/App.tsx'))
const KerkApp = lazy(() => import('./kerk/App.tsx'))
const EuropaApp = lazy(() => import('./europa/App.tsx'))
const GeschiedenisApp = lazy(() => import('./geschiedenis/App.tsx'))
const VogelsApp = lazy(() => import('./vogels/App.tsx'))
const RangenApp = lazy(() => import('./rangen/App.tsx'))
const SpaansApp = lazy(() => import('./spaans/App.tsx'))
const KlaverjasApp = lazy(() => import('./klaverjas/App.tsx'))
const BridgeApp = lazy(() => import('./bridge/App.tsx'))
const WeetjesApp = lazy(() => import('./weetjes/App.tsx'))
const GeldApp = lazy(() => import('./geld/App.tsx'))
const Sessie = lazy(() => import('./dag/Sessie.tsx'))
const Krant = lazy(() => import('./dag/Krant.tsx'))
const LeesStuk = lazy(() => import('./dag/Lezen.tsx').then((m) => ({ default: m.LeesStuk })))
const Vakken = lazy(() => import('./vakken/Vakken.tsx'))
const Vak = lazy(() => import('./vakken/Vak.tsx'))
const Voortgang = lazy(() => import('./vakken/Voortgang.tsx'))
const Les = lazy(() => import('./dag/Les.tsx'))
const Lezen = lazy(() => import('./dag/Lezen.tsx'))
const ElektronicaApp = lazy(() => import('./elektronica/App.tsx'))
const PlantenApp = lazy(() => import('./planten/App.tsx'))
const VervoerApp = lazy(() => import('./vervoer/App.tsx'))
const KlussenApp = lazy(() => import('./klussen/App.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navigatie />
      <Suspense fallback={<div className="module-loading">Laden…</div>}>
        <Routes>
          <Route path="/" element={<Dag />} />
          <Route path="/sessie" element={<Sessie />} />
          <Route path="/krant" element={<Krant />} />
          <Route path="/krant/:nr" element={<Lezen />} />
          <Route path="/lezen/:m/:id" element={<LeesStuk />} />
          <Route path="/vakken" element={<Vakken />} />
          <Route path="/vakken/:id" element={<Vak />} />
          <Route path="/voortgang" element={<Voortgang />} />
          <Route path="/vandaag" element={<Navigate to="/" replace />} />
          <Route path="/vandaag/lees/:nr" element={<Lezen />} />
          <Route path="/vandaag/:moduleId" element={<Les />} />
          <Route path="/elektronica/*" element={<ElektronicaApp />} />
          <Route path="/planten/*" element={<PlantenApp />} />
          <Route path="/vervoer/*" element={<VervoerApp />} />
          <Route path="/klussen/*" element={<KlussenApp />} />
          <Route path="/topografie/*" element={<TopografieApp />} />
          <Route path="/voetbal/*" element={<VoetbalApp />} />
          <Route path="/seinen/*" element={<SeinenApp />} />
          <Route path="/knopen/*" element={<KnopenApp />} />
          <Route path="/kerk/*" element={<KerkApp />} />
          <Route path="/europa/*" element={<EuropaApp />} />
          <Route path="/geschiedenis/*" element={<GeschiedenisApp />} />
          <Route path="/vogels/*" element={<VogelsApp />} />
          <Route path="/rangen/*" element={<RangenApp />} />
          <Route path="/spaans/*" element={<SpaansApp />} />
          <Route path="/klaverjas/*" element={<KlaverjasApp />} />
          <Route path="/bridge/*" element={<BridgeApp />} />
          <Route path="/weetjes/*" element={<WeetjesApp />} />
          <Route path="/geld/*" element={<GeldApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
