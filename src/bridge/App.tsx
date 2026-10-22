import { useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import '../leer/km.css'
import InbedPagina from '../ui/InbedPagina'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { pickRandom, shuffle } from '../leer/match'
import { ANTWOORD_SCENARIOS } from './antwoorden'
import BridgeCursus from './Cursus'
import Scorekaart from './Scorekaart'
import { hcp, isSans, KLEUREN, KLEUR_SYMBOOL, legUitOpening, maakHand, openingsbod, rangLabel, type Bod, type Hand } from './kaarten'
import './bridge.css'

const ACCENT = '#2f5a33'

function HandView({ hand }: { hand: Hand }) {
  return (
    <div className="br-hand">
      {KLEUREN.map((kleur) => (
        <div className="br-kleur" key={kleur}>
          <span className={`br-symbool${kleur === 'H' || kleur === 'D' ? ' br-rood' : ''}`}>{KLEUR_SYMBOOL[kleur]}</span>
          <span className="br-kaarten">{hand[kleur].length > 0 ? hand[kleur].map(rangLabel).join(' ') : '—'}</span>
        </div>
      ))}
    </div>
  )
}

function TekstHand({ kaarten }: { kaarten: [string, string, string, string] }) {
  const symbolen = ['♠', '♥', '♦', '♣']
  return (
    <div className="br-hand">
      {kaarten.map((k, i) => (
        <div className="br-kleur" key={i}>
          <span className={`br-symbool${i === 1 || i === 2 ? ' br-rood' : ''}`}>{symbolen[i]}</span>
          <span className="br-kaarten">{k || '—'}</span>
        </div>
      ))}
    </div>
  )
}

type QuizSoort = 'hcp' | 'opening' | 'antwoord' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'hcp', titel: 'Punten tellen', uitleg: 'Tel de honneurpunten van een willekeurige hand.' },
  { id: 'opening', titel: 'Wat open je?', uitleg: 'Krijg een hand en kies het juiste openingsbod (vijfkaart hoog).' },
  { id: 'antwoord', titel: 'Wat antwoord je?', uitleg: 'Partner opent — kies jouw bijbod.' },
  { id: 'mix', titel: 'Mix', uitleg: 'Alles door elkaar.' },
]

const ALLE_BODS: Bod[] = ['pas', '1♣', '1♦', '1♥', '1♠', '1SA', '2♣', '2SA']

function vraagHcp(): Vraag {
  const hand = maakHand()
  const punten = hcp(hand)
  return {
    prompt: (
      <div className="br-vraag">
        <HandView hand={hand} />
        <span>Hoeveel honneurpunten (HCP) telt deze hand?</span>
      </div>
    ),
    accepted: [String(punten)],
    antwoordLabel: 'Aantal punten',
    explain: `A=4, H=3, V=2, B=1 → deze hand telt ${punten} punten${isSans(hand) ? ' en heeft een sans-verdeling' : ''}.`,
  }
}

function vraagOpening(): Vraag {
  let hand = maakHand()
  let bod = openingsbod(hand)
  let poging = 0
  while (bod === null && poging < 50) {
    hand = maakHand()
    bod = openingsbod(hand)
    poging += 1
  }
  const goedBod = bod ?? 'pas'
  const opts = shuffle([goedBod, ...shuffle(ALLE_BODS.filter((b) => b !== goedBod)).slice(0, 3)])
  return {
    prompt: (
      <div className="br-vraag">
        <HandView hand={hand} />
        <span>Jij mag openen. Wat bied je?</span>
      </div>
    ),
    options: opts,
    correct: opts.indexOf(goedBod),
    explain: legUitOpening(hand, goedBod),
  }
}

function vraagAntwoord(): Vraag {
  const s = pickRandom(ANTWOORD_SCENARIOS)
  const opts = shuffle(s.opties.map((tekst, i) => ({ tekst, goed: i === s.goed })))
  return {
    prompt: (
      <div className="br-vraag">
        <span className="br-context">Partner opent <strong>{s.opening}</strong>. Jouw hand ({s.hcp} punten):</span>
        <TekstHand kaarten={s.hand} />
        <span>Wat bied je?</span>
      </div>
    ),
    options: opts.map((o) => o.tekst),
    correct: opts.findIndex((o) => o.goed),
    explain: s.uitleg,
  }
}

function maakQuiz(soort: QuizSoort): Vraag[] {
  return Array.from({ length: 10 }, () => {
    const s = soort === 'mix' ? pickRandom(['hcp', 'opening', 'antwoord'] as const) : soort
    if (s === 'hcp') return vraagHcp()
    if (s === 'opening') return vraagOpening()
    return vraagAntwoord()
  })
}

type Tab = 'trainer' | 'hulp' | 'cursus' | 'quiz' | 'score' | 'kaart'

// Elke tab als een biedkaartje uit de biedbox.
const TABS: { id: Tab; bod: string; rood?: boolean; label: string; uitleg: string }[] = [
  { id: 'trainer', bod: '1♠', label: 'Biedtrainer', uitleg: 'Openen, antwoorden en aan tafel met vier spelers' },
  { id: 'hulp', bod: '1♥', rood: true, label: 'Biedhulp', uitleg: 'Tik je eigen hand in en krijg advies per ronde' },
  { id: 'cursus', bod: '1♦', rood: true, label: 'Cursus', uitleg: 'Bridge vanaf nul, in negen hoofdstukken' },
  { id: 'quiz', bod: '1♣', label: 'Snelle quiz', uitleg: 'Tien vragen: punten tellen, openen, antwoorden' },
  { id: 'score', bod: '1SA', label: 'Scorekaart', uitleg: 'Houd de score bij aan tafel' },
  { id: 'kaart', bod: 'PDF', label: 'Biedkaart', uitleg: 'Alle biedingen op papier, om bij je te houden' },
]

const LS_TAB = 'wt-bridge-tab'

function leesTab(): Tab {
  try {
    const t = localStorage.getItem(LS_TAB) as Tab | null
    return t && TABS.some((x) => x.id === t) ? t : 'trainer'
  } catch {
    return 'trainer'
  }
}

export default function BridgeApp() {
  const [tab, setTabState] = useState<Tab>(leesTab)
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)
  const actief = TABS.find((t) => t.id === tab)!

  function setTab(t: Tab) {
    setTabState(t)
    setQuiz(null)
    try {
      localStorage.setItem(LS_TAB, t)
    } catch {
      /* negeren */
    }
  }

  return (
    <div className="km-app br-app" style={{ '--km-accent': ACCENT } as CSSProperties}>
      <header className="br-tafel">
        <div className="br-tafel-binnen">
          <Link to="/vakken" className="br-terug">
            <ArrowLeft size={16} /> Wereldtrainer
          </Link>
          <div className="br-titel">
            <span className="br-kleuren" aria-hidden="true">
              <span>♠</span>
              <span className="rd">♥</span>
              <span className="rd">♦</span>
              <span>♣</span>
            </span>
            <h1>Bridge</h1>
            <p>Vijfkaart hoog · zwakke sans 15–17</p>
          </div>
          <nav className="br-biedbox" aria-label="Onderdelen">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`br-biedkaart${t.id === tab ? ' aan' : ''}`}
                aria-current={t.id === tab ? 'page' : undefined}
                onClick={() => setTab(t.id)}
              >
                <span className={`br-bod${t.rood ? ' rd' : ''}`}>{t.bod}</span>
                <span className="br-bod-label">{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <p className="br-tab-uitleg">{actief.uitleg}</p>

      {tab === 'trainer' && <InbedPagina key="trainer" src="/bridge/biedtrainer.html" titel="Biedtrainer · 5-kaart hoog" />}
      {tab === 'hulp' && <InbedPagina key="hulp" src="/bridge/biedhulp.html" titel="Biedhulp · 5-kaart hoog" />}

      {(tab === 'cursus' || tab === 'quiz' || tab === 'score' || tab === 'kaart') && (
        <main className="km-main">
          {tab === 'cursus' && <BridgeCursus />}

          {tab === 'quiz' && quiz === null && (
            <>
              <div className="km-page-head">
                <p className="km-eyebrow">Snelle quiz</p>
                <h1>Kies een quiz</h1>
                <p>De handen worden willekeurig gedeeld — elke ronde is anders.</p>
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

          {tab === 'quiz' && quiz !== null && (
            <>
              <div className="km-back-row">
                <button type="button" className="km-btn km-btn-secondary" onClick={() => setQuiz(null)}>
                  ← Andere quiz
                </button>
              </div>
              <QuizRunner maak={() => maakQuiz(quiz)} />
            </>
          )}

          {tab === 'score' && <Scorekaart />}

          {tab === 'kaart' && (
            <section className="br-pdf">
              <div className="br-pdf-blad" aria-hidden="true">
                <span className="br-pdf-kop">Biedkaart</span>
                <span className="br-pdf-sub">5-kaart hoog</span>
                {['Puntentelling', 'Openingen', 'Antwoorden 1♥/1♠', 'Antwoorden 1♣/1♦', 'Na 1SA en 2SA', 'Na 2♣ mancheforcing', 'Zwakke twee & preëmpt', 'Herbiedingen', 'Denkstappen'].map((r) => (
                  <span key={r} className="br-pdf-regel">{r}</span>
                ))}
              </div>
              <div className="br-pdf-tekst">
                <h2>Alle biedingen op vier A4'tjes</h2>
                <p>
                  Openingen, antwoorden op elke opening, de tweede en derde biedronde en een denkstappenplan — met bij elk bod een voorbeeldhand. Print hem of bewaar hem op je telefoon.
                </p>
                <div className="br-pdf-knoppen">
                  <a className="km-btn km-btn-primary" href="/bridge/biedkaart-5-kaart-hoog.pdf" target="_blank" rel="noopener">
                    <FileText size={17} /> Open de biedkaart
                  </a>
                  <a className="km-btn km-btn-secondary" href="/bridge/biedkaart-5-kaart-hoog.pdf" download>
                    <Download size={17} /> Download
                  </a>
                </div>
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  )
}
