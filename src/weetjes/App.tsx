import { useMemo, useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { distractors, pickRandom, shuffle } from '../leer/match'
import { WEETJES, type Weetje } from './data'
import './weetjes.css'

const ACCENT = '#4c3f91'

// Unieke categorieën in de volgorde waarin ze voorkomen.
const CATEGORIEEN = [...new Set(WEETJES.map((w) => w.categorie))]

// ── Weetje van de dag: deterministisch op de datum, zodat het elke dag
// hetzelfde weetje is en om de N dagen doorrolt. ──
const MS_PER_DAG = 86_400_000
const EPOCH = Date.UTC(2026, 0, 1)

function dagNummer(offset: number): number {
  const nu = new Date()
  const middernacht = Date.UTC(nu.getFullYear(), nu.getMonth(), nu.getDate())
  return Math.floor((middernacht - EPOCH) / MS_PER_DAG) + offset
}

function weetjeVoorDag(offset: number): Weetje {
  const n = WEETJES.length
  const idx = ((dagNummer(offset) % n) + n) % n
  return WEETJES[idx]
}

// ── Quiz ──
type QuizSoort = 'vraag' | 'categorie' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'vraag', titel: 'Uitleg → weetje', uitleg: 'Lees de uitleg en kies bij welk weetje die hoort.' },
  { id: 'categorie', titel: 'Weetje → vakgebied', uitleg: 'In welke categorie valt dit weetje?' },
  { id: 'mix', titel: 'Mix', uitleg: 'Beide vraagsoorten door elkaar.' },
]

function vraagUitlegNaarWeetje(): Vraag {
  const goed = pickRandom(WEETJES)
  const opties = shuffle([goed, ...distractors(WEETJES, goed, 3, (w) => String(w.id))])
  return {
    prompt: (
      <span>
        Bij welk weetje hoort deze uitleg?
        <span className="wj-quiz-uitleg">{goed.uitleg}</span>
      </span>
    ),
    options: opties.map((w) => w.vraag),
    correct: opties.findIndex((w) => w.id === goed.id),
    explain: `${goed.vraag} — categorie: ${goed.categorie}.`,
  }
}

function vraagCategorie(): Vraag {
  const goed = pickRandom(WEETJES)
  const andere = shuffle(CATEGORIEEN.filter((c) => c !== goed.categorie)).slice(0, 3)
  const opties = shuffle([goed.categorie, ...andere])
  return {
    prompt: (
      <span>
        In welke categorie valt dit weetje?
        <span className="wj-quiz-uitleg">{goed.vraag}</span>
      </span>
    ),
    options: opties,
    correct: opties.findIndex((c) => c === goed.categorie),
    explain: goed.uitleg,
  }
}

function maakQuiz(soort: QuizSoort): Vraag[] {
  return Array.from({ length: 12 }, () => {
    const s = soort === 'mix' ? pickRandom(['vraag', 'categorie'] as const) : soort
    return s === 'vraag' ? vraagUitlegNaarWeetje() : vraagCategorie()
  })
}

// ── Bibliotheek-item met verbergbare uitleg ──
function BiebItem({ weetje }: { weetje: Weetje }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`wj-item${open ? ' open' : ''}`}>
      <button type="button" className="wj-item-kop" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="wj-item-nr">{weetje.id}</span>
        <span className="wj-item-vraag">{weetje.vraag}</span>
        <span className="wj-item-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="wj-item-uitleg">{weetje.uitleg}</p>}
    </div>
  )
}

export default function WeetjesApp() {
  const [tab, setTab] = useState('dag')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)

  // Weetje van de dag
  const [dagOffset, setDagOffset] = useState(0)
  const [onthuld, setOnthuld] = useState(false)
  const dagWeetje = useMemo(() => weetjeVoorDag(dagOffset), [dagOffset])

  function gaNaarDag(delta: number) {
    setDagOffset((o) => o + delta)
    setOnthuld(false)
  }

  function willekeurig() {
    const n = WEETJES.length
    const doel = pickRandom(WEETJES)
    // Vertaal terug naar een offset t.o.v. vandaag zodat de kop klopt.
    const vandaagIdx = ((dagNummer(0) % n) + n) % n
    const doelIdx = WEETJES.findIndex((w) => w.id === doel.id)
    setDagOffset(doelIdx - vandaagIdx)
    setOnthuld(false)
  }

  // Bibliotheek
  const [filter, setFilter] = useState<string>('Alles')
  const [zoek, setZoek] = useState('')

  const gefilterd = useMemo(() => {
    const term = zoek.trim().toLowerCase()
    return WEETJES.filter((w) => {
      if (filter !== 'Alles' && w.categorie !== filter) return false
      if (term && !(`${w.vraag} ${w.uitleg}`.toLowerCase().includes(term))) return false
      return true
    })
  }, [filter, zoek])

  return (
    <LeerShell
      mark="?!"
      accent={ACCENT}
      title="Weetjes"
      subtitle="Elke dag iets nieuws leren"
      tabs={[
        { id: 'dag', label: 'Weetje van de dag' },
        { id: 'bibliotheek', label: 'Bibliotheek' },
        { id: 'overhoren', label: 'Overhoren' },
      ]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null) }}
      footnote={<p>{WEETJES.length} diepe weetjes uit ~{CATEGORIEEN.length} vakgebieden — van straalmotoren en metallurgie tot fysiologie en baanmechanica.</p>}
    >
      {/* ── Weetje van de dag ── */}
      {tab === 'dag' && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">
              {dagOffset === 0 ? 'Weetje van vandaag' : dagOffset < 0 ? `${-dagOffset} dag(en) terug` : `${dagOffset} dag(en) vooruit`}
            </p>
            <h1>Leer iets nieuws</h1>
          </div>

          <article className="wj-dag km-panel">
            <span className="wj-dag-cat">{dagWeetje.categorie}</span>
            <h2 className="wj-dag-vraag">{dagWeetje.vraag}</h2>

            {onthuld ? (
              <p className="wj-dag-uitleg">{dagWeetje.uitleg}</p>
            ) : (
              <button type="button" className="km-btn km-btn-primary wj-onthul" onClick={() => setOnthuld(true)}>
                Toon uitleg
              </button>
            )}

            <div className="wj-dag-nav">
              <button type="button" className="km-btn km-btn-secondary" onClick={() => gaNaarDag(-1)}>← Vorige</button>
              <button type="button" className="km-btn km-btn-secondary" onClick={willekeurig}>Verras me</button>
              <button type="button" className="km-btn km-btn-secondary" onClick={() => gaNaarDag(1)}>Volgende →</button>
            </div>
          </article>
        </>
      )}

      {/* ── Bibliotheek ── */}
      {tab === 'bibliotheek' && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Bibliotheek</p>
            <h1>Alle {WEETJES.length} weetjes</h1>
            <p>Kies een vakgebied of zoek, en klik een weetje open voor de uitleg.</p>
          </div>

          <input
            className="wj-zoek"
            value={zoek}
            onChange={(e) => setZoek(e.target.value)}
            placeholder="Zoek in vragen en uitleg…"
            autoComplete="off"
          />

          <div className="km-filters">
            {['Alles', ...CATEGORIEEN].map((c) => (
              <button
                key={c}
                type="button"
                className={`km-chip${filter === c ? ' active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="wj-telling">{gefilterd.length} weetje(s)</p>

          <div className="wj-lijst">
            {gefilterd.map((w) => <BiebItem key={w.id} weetje={w} />)}
            {gefilterd.length === 0 && <p className="wj-leeg">Niets gevonden — pas je zoekterm of filter aan.</p>}
          </div>
        </>
      )}

      {/* ── Overhoren ── */}
      {tab === 'overhoren' && quiz === null && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Overhoren</p>
            <h1>Kies een overhoring</h1>
          </div>
          <div className="km-quiz-menu">
            {QUIZZEN.map((q) => (
              <button key={q.id} type="button" className="km-card" onClick={() => setQuiz(q.id)}>
                <h3>{q.titel}</h3>
                <p>{q.uitleg}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {tab === 'overhoren' && quiz !== null && (
        <>
          <div className="km-back-row">
            <button type="button" className="km-btn km-btn-secondary" onClick={() => setQuiz(null)}>← Andere overhoring</button>
          </div>
          <QuizRunner maak={() => maakQuiz(quiz)} />
        </>
      )}
    </LeerShell>
  )
}
