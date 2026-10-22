import { useEffect, useState, type CSSProperties } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, X } from 'lucide-react'
import { MODULE_BY_ID } from '../modules'
import { dagStappen, volgendeStap, type Stap } from './dagplan'
import Herhalen from './Herhalen'
import { LesFlow } from './Les'
import { pocoVandaag } from './geheugen'
import { useGeheugen } from './useLeer'
import './dag.css'

const NAAM: Record<string, string> = { herhalen: 'Herhalen', spaans: 'Spaans', krant: 'Krant' }

// De doorlopende dagsessie: na elke stap gaat het vanzelf door naar de
// volgende. Met ?stap=… open je een bepaalde stap direct.
export default function Sessie() {
  const { g, vandaag, markeer } = useGeheugen()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const poco = usePocoLive(vandaag)
  const stappen = dagStappen(g, vandaag, poco)
  const gekozen = params.get('stap')
  const stap = (gekozen && stappen.find((s) => s.id === gekozen)) || volgendeStap(stappen)

  // De stap vastzetten in de URL: zo blijft bijvoorbeeld je uitslag staan,
  // ook als de stap intussen als klaar geldt.
  useEffect(() => {
    if (!gekozen && stap && stap.soort !== 'krant') setParams({ stap: stap.id }, { replace: true })
  }, [gekozen, stap, setParams])

  if (!stap) return <Navigate to="/" replace />
  if (stap.soort === 'krant') return <Navigate to="/krant" replace />

  function klaar(s: Stap) {
    markeer(s.id)
    const rest = stappen.filter((x) => !x.klaar && x.id !== s.id)
    const volgende = rest[0]
    window.scrollTo({ top: 0 })
    if (!volgende || volgende.soort === 'krant') navigate('/krant')
    else setParams({ stap: volgende.id })
  }

  return (
    <div className={`ss ss-${stap.soort}`}>
      <header className="ss-kop">
        <Link to="/" className="ss-sluit" aria-label="Sessie sluiten, terug naar je dag">
          <X size={20} />
        </Link>
        <ol className="ss-stappen">
          {stappen.map((s) => (
            <li key={s.id} className={`${s.klaar ? 'af' : ''}${s.id === stap.id ? ' nu' : ''}`} style={{ '--sk': MODULE_BY_ID[s.id]?.accent } as CSSProperties}>
              <button type="button" onClick={() => (s.soort === 'krant' ? navigate('/krant') : setParams({ stap: s.id }))}>
                {s.klaar && <Check size={12} strokeWidth={3} />}
                {NAAM[s.id] ?? MODULE_BY_ID[s.id]?.title ?? s.id}
              </button>
            </li>
          ))}
        </ol>
      </header>

      <main className="ss-main">
        {stap.soort === 'herhalen' && <Herhalen key="herhalen" onKlaar={() => klaar(stap)} />}
        {stap.soort === 'nieuw' && <LesFlow key={stap.id} moduleId={stap.id} sessie onKlaar={() => klaar(stap)} />}
        {stap.soort === 'spaans' && <SpaansStap poco={poco} onKlaar={() => klaar(stap)} />}
      </main>
    </div>
  )
}

// Poco a Poco draait in dezelfde origin; de voortgang lezen we af uit zijn opslag.
function usePocoLive(vandaag: number) {
  const [poco, setPoco] = useState(() => pocoVandaag(vandaag))
  useEffect(() => {
    const t = window.setInterval(() => setPoco(pocoVandaag(vandaag)), 2000)
    return () => window.clearInterval(t)
  }, [vandaag])
  return poco
}

function SpaansStap({ poco, onKlaar }: { poco: { klaar: number; totaal: number }; onKlaar: () => void }) {
  const klaar = Math.min(poco.klaar, poco.totaal)
  const af = poco.totaal > 0 && poco.klaar >= poco.totaal
  return (
    <div className="ss-spaans">
      <iframe className="ss-poco" src="/poco/index.html#woorden" title="Poco a Poco — woorden van de dag" />
      <div className="ss-spaans-balk">
        <span className="tabular">
          {klaar} / {poco.totaal} woorden
        </span>
        <button type="button" className={`ss-verder${af ? ' af' : ''}`} onClick={onKlaar}>
          {af ? 'Klaar, naar de krant' : 'Later verder, naar de krant'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

