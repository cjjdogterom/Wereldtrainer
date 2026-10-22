import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Flame } from 'lucide-react'
import { MODULE_BY_ID } from '../modules'
import { dagSleutel, type Geheugen } from '../dag/geheugen'
import { RUBRIEK, RUBRIEKEN } from '../dag/krant'
import { DAGNAMEN, KRANT_ROOSTER, STAMP_MODULES, STAMP_ROOSTER, WEEKVOLGORDE } from '../dag/rooster'
import { useGeheugen } from '../dag/useLeer'
import { pocoGeleerd, useBron, vakStand } from './stand'
import './vakken.css'

const WEKEN = 10

// Eén overzicht van wat je kent: reeks, de afgelopen weken en per vak.
export default function Voortgang() {
  const { g, vandaag, reeks } = useGeheugen()
  const spaans = pocoGeleerd()
  return (
    <div className="vk vg">
      <header className="vk-kop">
        <h1>Voortgang</h1>
        <p>Wat je kent en hoe je ervoor staat.</p>
      </header>

      <section className="vg-blok vg-top">
        <div className="vg-reeks">
          <Flame size={28} />
          <strong className="tabular">{reeks}</strong>
          <span>{reeks === 1 ? 'dag' : 'dagen'} op rij</span>
        </div>
        <Kalender g={g} vandaag={vandaag} />
      </section>

      <section className="vg-blok">
        <h2>Deze week</h2>
        <Week g={g} vandaag={vandaag} />
      </section>

      <section className="vg-blok">
        <h2>Stampen</h2>
        <ul className="vg-lijst">
          {STAMP_MODULES.map((m) => (
            <VakBalk key={m} id={m} />
          ))}
          <li>
            <Link to="/vakken/spaans" className="vg-rij" style={{ '--vk': MODULE_BY_ID.spaans.accent } as CSSProperties}>
              <span className="vg-naam">Spaans</span>
              <span className="vg-getal tabular">{spaans} woorden en zinnen geleerd</span>
            </Link>
          </li>
        </ul>
      </section>

      <section className="vg-blok">
        <h2>De krant</h2>
        <ul className="vg-lijst">
          {RUBRIEKEN.map((m) => (
            <VakBalk key={m} id={m} naam={RUBRIEK[m].naam} />
          ))}
        </ul>
      </section>
    </div>
  )
}

function VakBalk({ id, naam }: { id: string; naam?: string }) {
  const { g } = useGeheugen()
  const bron = useBron(id)
  const st = vakStand(g, id, bron)
  const m = MODULE_BY_ID[id]
  return (
    <li>
      <Link to={`/vakken/${id}`} className="vg-rij" style={{ '--vk': m?.accent } as CSSProperties}>
        <span className="vg-naam">{naam ?? m?.title}</span>
        <span className="vk-balk">
          <i style={{ width: `${st && st.totaal ? (st.klaar / st.totaal) * 100 : 0}%` }} />
        </span>
        <span className="vg-getal tabular">{st ? `${st.klaar}/${st.totaal}` : '…'}</span>
      </Link>
    </li>
  )
}

function dagVol(g: Geheugen, n: number): 'vol' | 'deels' | '' {
  const d = g.dagen[dagSleutel(n)]
  if (!d || !d.klaar.length) return ''
  return d.gepland.length > 0 && d.gepland.every((m) => d.klaar.includes(m)) ? 'vol' : 'deels'
}

// De afgelopen weken als raster: per kolom een week, maandag bovenaan.
function Kalender({ g, vandaag }: { g: Geheugen; vandaag: number }) {
  const offset = (new Date().getDay() + 6) % 7
  const maandag = vandaag - offset - (WEKEN - 1) * 7
  return (
    <div className="vg-kal" aria-label={`De afgelopen ${WEKEN} weken`}>
      {Array.from({ length: WEKEN * 7 }, (_, i) => {
        const w = Math.floor(i / 7)
        const d = i % 7
        const n = maandag + w * 7 + d
        return <i key={i} style={{ gridColumn: w + 1, gridRow: d + 1 }} className={n > vandaag ? 'later' : `${dagVol(g, n)}${n === vandaag ? ' nu' : ''}`} title={dagSleutel(n)} />
      })}
    </div>
  )
}

function Week({ g, vandaag }: { g: Geheugen; vandaag: number }) {
  const vandaagDag = new Date().getDay()
  const offset = (vandaagDag + 6) % 7
  return (
    <ol className="vg-week">
      {WEEKVOLGORDE.map((dag, i) => {
        const n = vandaag - offset + i
        const v = dagVol(g, n)
        return (
          <li key={dag} className={`${dag === vandaagDag ? 'nu' : ''} ${v}`}>
            <span className="vg-week-dag">{DAGNAMEN[dag].slice(0, 2)}</span>
            <span className="vg-week-vak">
              {STAMP_ROOSTER[dag].map((id) => (
                <span key={id} title={MODULE_BY_ID[id]?.title} style={{ '--vk': MODULE_BY_ID[id]?.accent } as CSSProperties}>
                  {MODULE_BY_ID[id]?.icon}
                </span>
              ))}
            </span>
            <span className="vg-week-krant">{RUBRIEK[KRANT_ROOSTER[dag][0]]?.naam}</span>
          </li>
        )
      })}
    </ol>
  )
}
