import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import '../leer/km.css'
import QuizRunner from '../leer/QuizRunner'
import { LesLezer, lessenQuiz, useGelezen } from '../leer/LesLezer'
import { LESSEN } from './lessen'
import { Beeld } from './beelden'
import Fotos from '../ui/Fotos'
import { FOTOS } from './fotos'
import { CATEGORIEEN, type Categorie } from './types'
import './vervoer.css'

type Modus = 'lessen' | 'overhoren'

const GROND: Categorie[] = ['auto', 'motorfiets', 'elektrisch', 'trein', 'schip']
const LUCHT: Categorie[] = ['helikopter', 'lucht-techniek', 'lucht-regels', 'lucht-praktijk', 'lucht-meteo']
const LS_CAT = 'wt-vervoer-cat'

function leesCategorie(): Categorie {
  try {
    const c = localStorage.getItem(LS_CAT) as Categorie | null
    return c && CATEGORIEEN.some((x) => x.id === c) ? c : 'auto'
  } catch {
    return 'auto'
  }
}

// Een ronde meter; de naald staat op het percentage gelezen lessen.
function Meter({ pct, aan }: { pct: number; aan: boolean }) {
  const hoek = -120 + (240 * pct) / 100
  return (
    <svg viewBox="0 0 80 80" className="vt-meter" aria-hidden="true">
      <circle cx={40} cy={40} r={36} className="vt-meter-rand" />
      <circle cx={40} cy={40} r={31} className="vt-meter-wijzerplaat" />
      {Array.from({ length: 9 }, (_, i) => {
        const h = ((-120 + i * 30 - 90) * Math.PI) / 180
        return (
          <line
            key={i}
            x1={40 + Math.cos(h) * 25}
            y1={40 + Math.sin(h) * 25}
            x2={40 + Math.cos(h) * 30}
            y2={40 + Math.sin(h) * 30}
            className={i >= 7 ? 'vt-streep rood' : 'vt-streep'}
          />
        )
      })}
      <g style={{ transform: `rotate(${hoek}deg)`, transformOrigin: '40px 40px' }} className="vt-naald">
        <line x1={40} y1={44} x2={40} y2={14} />
      </g>
      <circle cx={40} cy={40} r={3.5} className={aan ? 'vt-as aan' : 'vt-as'} />
      <text x={40} y={60} textAnchor="middle" className="vt-meter-getal">
        {pct}%
      </text>
    </svg>
  )
}

export default function VervoerApp() {
  const { gelezen, markeer } = useGelezen('wt-vervoer-gelezen')
  const [categorie, setCategorieState] = useState<Categorie>(leesCategorie)
  const [modus, setModus] = useState<Modus>('lessen')
  const lessen = useMemo(() => LESSEN.filter((l) => l.categorie === categorie), [categorie])
  const [lesId, setLesId] = useState<string>(() => lessen[0]?.id ?? '')
  const les = lessen.find((l) => l.id === lesId) ?? lessen[0]
  const cat = CATEGORIEEN.find((c) => c.id === categorie)!
  const nummer = lessen.findIndex((l) => l.id === les?.id) + 1

  function setCategorie(c: Categorie) {
    setCategorieState(c)
    setModus('lessen')
    const eerste = LESSEN.find((l) => l.categorie === c && !gelezen.includes(l.id)) ?? LESSEN.find((l) => l.categorie === c)
    setLesId(eerste?.id ?? '')
    try {
      localStorage.setItem(LS_CAT, c)
    } catch {
      /* negeren */
    }
  }

  function ga(delta: number) {
    const volgende = lessen[nummer - 1 + delta]
    if (!volgende) return
    if (delta > 0) markeer(les.id)
    setLesId(volgende.id)
    document.querySelector('.ls-lezer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const rij = (ids: Categorie[], titel: string) => (
    <div className="vt-rij">
      <span className="vt-rij-titel">{titel}</span>
      <div className="vt-meters">
        {ids.map((id) => {
          const c = CATEGORIEEN.find((x) => x.id === id)!
          const totaal = LESSEN.filter((l) => l.categorie === id).length
          const af = LESSEN.filter((l) => l.categorie === id && gelezen.includes(l.id)).length
          const pct = totaal ? Math.round((af / totaal) * 100) : 0
          return (
            <button key={id} type="button" className={`vt-instrument${id === categorie ? ' aan' : ''}`} aria-pressed={id === categorie} onClick={() => setCategorie(id)}>
              <Meter pct={pct} aan={id === categorie} />
              <span className="vt-instrument-naam">{c.titel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="km-app vt-app">
      <header className="vt-paneel">
        <div className="vt-paneel-binnen">
          <Link to="/vakken" className="vt-terug">
            <ArrowLeft size={16} /> Wereldtrainer
          </Link>
          <div className="vt-titel">
            <h1>Voertuigtechniek</h1>
            <p>Over de weg, het spoor, het water en door de lucht</p>
          </div>
          {rij(GROND, 'Grond en water')}
          {rij(LUCHT, 'Lucht')}
        </div>
      </header>

      <main className="vt-main">
        <div className="vt-cat-kop">
          <div>
            <h2>{cat.titel}</h2>
            <p className="vt-intro">{cat.intro}</p>
          </div>
          <div className="vt-modi" role="tablist">
            <button type="button" role="tab" aria-selected={modus === 'lessen'} className={modus === 'lessen' ? 'aan' : ''} onClick={() => setModus('lessen')}>
              Lessen
            </button>
            <button type="button" role="tab" aria-selected={modus === 'overhoren'} className={modus === 'overhoren' ? 'aan' : ''} onClick={() => setModus('overhoren')}>
              Overhoren
            </button>
          </div>
        </div>

        {modus === 'lessen' && les && (
          <div className="ls-indeling">
            <ol className="ls-inhoud" aria-label="Lessen">
              {lessen.map((l) => (
                <li key={l.id}>
                  <button type="button" className={l.id === les.id ? 'aan' : ''} onClick={() => setLesId(l.id)}>
                    <span className={`ls-vinkje${gelezen.includes(l.id) ? ' gelezen' : ''}`} aria-hidden="true">
                      {gelezen.includes(l.id) && <Check size={12} strokeWidth={3} />}
                    </span>
                    {l.titel}
                  </button>
                </li>
              ))}
            </ol>
            <LesLezer
              key={les.id}
              les={les}
              nummer={nummer}
              totaal={lessen.length}
              beeld={
                <>
                  <Fotos fotos={FOTOS[les.id]} />
                  {les.beeld && <Beeld id={les.beeld} />}
                </>
              }
              onVorige={() => ga(-1)}
              onVolgende={() => ga(1)}
              onGelezen={() => markeer(les.id)}
            />
          </div>
        )}

        {modus === 'overhoren' && (
          <div className="ls-quiz">
            <QuizRunner key={categorie} maak={() => lessenQuiz(lessen)} />
          </div>
        )}
      </main>
    </div>
  )
}
