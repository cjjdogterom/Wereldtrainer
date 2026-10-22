import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { GROEPEN, MODULES, type Module } from '../modules'
import { useGeheugen } from '../dag/useLeer'
import { soortVan, useBron, vakStand } from './stand'
import '../ui/laden.css'
import './vakken.css'

const SOORT_LABEL = { stampen: 'stampen', lezen: 'in de krant', spaans: 'eigen app', vrij: '' }

// De bibliotheek: alle vakken, met per vak waar je staat en wat er hierna komt.
export default function Vakken() {
  return (
    <div className="vk">
      <header className="vk-kop">
        <h1>Vakken</h1>
        <p>Alles wat je leert, met per vak waar je staat. Tik op een vak voor het hele leerpad.</p>
      </header>
      {GROEPEN.map((gr) => {
        const leden = MODULES.filter((m) => m.groep === gr.id)
        if (!leden.length) return null
        return (
          <section key={gr.id} className="vk-groep">
            <h2>{gr.titel}</h2>
            <ul>
              {leden.map((m) => (
                <VakRij key={m.id} m={m} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function VakRij({ m }: { m: Module }) {
  const { g } = useGeheugen()
  const bron = useBron(m.id)
  const st = vakStand(g, m.id, bron)
  const pct = st && st.totaal ? (st.klaar / st.totaal) * 100 : 0
  const soort = soortVan(m.id)
  return (
    <li>
      <Link to={`/vakken/${m.id}`} className="vk-rij" style={{ '--vk': m.accent } as CSSProperties}>
        <span className={`vk-icoon lade-${m.id}`}>{m.icon}</span>
        <span className="vk-tekst">
          <span className="vk-naam">
            {m.title}
            {SOORT_LABEL[soort] && <small>{SOORT_LABEL[soort]}</small>}
          </span>
          <span className="vk-volgende">{st?.volgende ? `Hierna: ${st.volgende}` : m.subtitle}</span>
          {st && st.totaal > 0 && (
            <span className="vk-balk">
              <i style={{ width: `${pct}%` }} />
            </span>
          )}
        </span>
        <span className="vk-getal tabular">{st ? (st.totaal ? `${st.klaar}/${st.totaal}` : st.klaar || '') : ''}</span>
        <ChevronRight size={18} className="vk-pijl" />
      </Link>
    </li>
  )
}
