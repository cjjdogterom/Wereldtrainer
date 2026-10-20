import { useMemo, useState, type ReactNode } from 'react'
import { Check, RotateCcw, Undo2, X } from 'lucide-react'
import { shuffle } from './match'
import './volgorde.css'

export type VolgordeItem = { id: string; inhoud: ReactNode; label?: string; detail?: ReactNode }

// Tik de kaartjes aan in de juiste volgorde. `maak` levert een verse set in de
// goede volgorde; het spel schudt ze zelf.
export default function Volgorde({
  maak,
  opdracht,
  begin,
  eind,
}: {
  maak: () => VolgordeItem[]
  opdracht: string
  begin: string // bijv. 'vroegst'
  eind: string // bijv. 'laatst'
}) {
  const [ronde, setRonde] = useState(0)
  const goed = useMemo(() => maak(), [ronde]) // eslint-disable-line react-hooks/exhaustive-deps
  const geschud = useMemo(() => shuffle(goed), [goed])
  const [gekozen, setGekozen] = useState<string[]>([])
  const [score, setScore] = useState({ goed: 0, rondes: 0 })
  const klaar = gekozen.length === goed.length
  const juist = klaar && gekozen.every((id, i) => id === goed[i].id)

  function kies(id: string) {
    if (klaar || gekozen.includes(id)) return
    const nieuw = [...gekozen, id]
    setGekozen(nieuw)
    if (nieuw.length === goed.length) {
      const ok = nieuw.every((x, i) => x === goed[i].id)
      setScore((s) => ({ goed: s.goed + (ok ? 1 : 0), rondes: s.rondes + 1 }))
    }
  }

  function volgende() {
    setGekozen([])
    setRonde((r) => r + 1)
  }

  const perId = new Map(goed.map((x) => [x.id, x]))

  return (
    <div className="vo">
      <div className="vo-kop">
        <p className="vo-opdracht">{opdracht}</p>
        {score.rondes > 0 && (
          <span className="vo-score tabular">
            {score.goed} van {score.rondes} rondes foutloos
          </span>
        )}
      </div>

      <ol className="vo-rij" aria-label="Jouw volgorde">
        {goed.map((_, i) => {
          const id = gekozen[i]
          const item = id ? perId.get(id) : undefined
          const status = klaar && item ? (id === goed[i].id ? 'goed' : 'fout') : ''
          return (
            <li key={i} className={`vo-plek ${item ? 'vol' : ''} ${status}`}>
              <span className="vo-nr">{i === 0 ? begin : i === goed.length - 1 ? eind : i + 1}</span>
              {item ? (
                <div className="vo-inhoud">
                  {item.inhoud}
                  {klaar && item.detail && <div className="vo-detail">{item.detail}</div>}
                </div>
              ) : (
                <span className="vo-leeg">…</span>
              )}
              {status === 'goed' && <Check size={16} className="vo-icoon" />}
              {status === 'fout' && <X size={16} className="vo-icoon" />}
            </li>
          )
        })}
      </ol>

      {!klaar && (
        <>
          <p className="vo-hint">Tik ze aan in volgorde, te beginnen bij {begin}.</p>
          <div className="vo-stapel">
            {geschud
              .filter((x) => !gekozen.includes(x.id))
              .map((x) => (
                <button key={x.id} type="button" className="vo-kaart" onClick={() => kies(x.id)}>
                  {x.inhoud}
                </button>
              ))}
          </div>
          {gekozen.length > 0 && (
            <button type="button" className="vo-terug" onClick={() => setGekozen(gekozen.slice(0, -1))}>
              <Undo2 size={15} /> Laatste terugleggen
            </button>
          )}
        </>
      )}

      {klaar && (
        <div className={`vo-uitslag ${juist ? 'goed' : 'fout'}`}>
          <p>{juist ? 'Precies goed!' : 'Niet helemaal. De juiste volgorde:'}</p>
          {!juist && (
            <ol className="vo-juist">
              {goed.map((x) => (
                <li key={x.id}>
                  {x.label ?? x.inhoud}
                  {x.detail && <span className="vo-juist-detail"> — {x.detail}</span>}
                </li>
              ))}
            </ol>
          )}
          <button type="button" className="km-btn km-btn-primary" onClick={volgende}>
            <RotateCcw size={16} /> Volgende ronde
          </button>
        </div>
      )}
    </div>
  )
}
