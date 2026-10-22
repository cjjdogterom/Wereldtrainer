import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import '../leer/km.css'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { shuffle } from '../leer/match'
import { LesLezer, lessenQuiz, useGelezen } from '../leer/LesLezer'
import { LESSEN } from './lessen'
import { SchemaTekening } from './schemas'
import Fotos from '../ui/Fotos'
import { FOTOS } from './fotos'
import { SYMBOOL_INFO, SymboolKaart } from './symbolen'
import { CATEGORIEEN, type Categorie, type SymboolId } from './types'
import './elektronica.css'

type Modus = 'lessen' | 'overhoren' | 'symbolen'

const LS_CAT = 'wt-elektronica-cat'

function leesCategorie(): Categorie {
  try {
    const c = localStorage.getItem(LS_CAT) as Categorie | null
    return c && CATEGORIEEN.some((x) => x.id === c) ? c : 'installatie'
  } catch {
    return 'installatie'
  }
}

export default function ElektronicaApp() {
  const { gelezen, markeer } = useGelezen('wt-elektronica-gelezen')
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

  return (
    <div className="km-app ek-app">
      <header className="ek-kop lade-elektronica">
        <div className="ek-kop-binnen">
          <Link to="/vakken" className="ek-terug">
            <ArrowLeft size={16} /> Wereldtrainer
          </Link>
          <h1>Elektronica</h1>
          <p>Van groepenkast tot microcontroller</p>
        </div>
      </header>

      {/* De categorieën als automaten in een groepenkast */}
      <nav className="ek-kast" aria-label="Categorieën">
        {CATEGORIEEN.map((c, i) => {
          const totaal = LESSEN.filter((l) => l.categorie === c.id).length
          const af = LESSEN.filter((l) => l.categorie === c.id && gelezen.includes(l.id)).length
          const aan = c.id === categorie
          return (
            <button key={c.id} type="button" className={`ek-automaat${aan ? ' aan' : ''}`} aria-pressed={aan} onClick={() => setCategorie(c.id)}>
              <span className="ek-automaat-nr">groep {i + 1}</span>
              <span className="ek-hendel" aria-hidden="true">
                <span />
              </span>
              <span className="ek-automaat-naam">{c.titel}</span>
              <span className="ek-automaat-kort">{c.kort}</span>
              <span className="ek-automaat-teller tabular">
                {af}/{totaal}
              </span>
            </button>
          )
        })}
      </nav>

      <main className="ek-main">
        <div className="ek-cat-kop">
          <p className="ek-intro">{cat.intro}</p>
          <div className="ek-modi" role="tablist">
            <button type="button" role="tab" aria-selected={modus === 'lessen'} className={modus === 'lessen' ? 'aan' : ''} onClick={() => setModus('lessen')}>
              Lessen
            </button>
            <button type="button" role="tab" aria-selected={modus === 'overhoren'} className={modus === 'overhoren' ? 'aan' : ''} onClick={() => setModus('overhoren')}>
              Overhoren
            </button>
            {categorie === 'meten' && (
              <button type="button" role="tab" aria-selected={modus === 'symbolen'} className={modus === 'symbolen' ? 'aan' : ''} onClick={() => setModus('symbolen')}>
                Symbolen
              </button>
            )}
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
                  {les.schema && <SchemaTekening id={les.schema} />}
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

        {modus === 'symbolen' && (
          <div className="ls-quiz">
            <QuizRunner key="symbolen" maak={maakSymboolQuiz} />
          </div>
        )}
      </main>
    </div>
  )
}

function maakSymboolQuiz(): Vraag[] {
  const ids = Object.keys(SYMBOOL_INFO) as SymboolId[]
  return shuffle(ids)
    .slice(0, 10)
    .map((id) => {
      const fout = shuffle(ids.filter((x) => x !== id)).slice(0, 3)
      const opties = shuffle([id, ...fout])
      return {
        prompt: (
          <div className="ek-symboolvraag">
            <SymboolKaart id={id} breedte={180} />
            <span>Welk onderdeel is dit?</span>
          </div>
        ),
        options: opties.map((o) => SYMBOOL_INFO[o].naam),
        correct: opties.indexOf(id),
        explain: SYMBOOL_INFO[id].uitleg,
      }
    })
}
