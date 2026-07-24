import { useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { pickRandom, shuffle } from '../leer/match'
import { ANTWOORD_SCENARIOS } from './antwoorden'
import BridgeCursus from './Cursus'
import Scorekaart from './Scorekaart'
import { hcp, isSans, KLEUREN, KLEUR_SYMBOOL, legUitOpening, maakHand, openingsbod, rangLabel, type Bod, type Hand } from './kaarten'
import './bridge.css'

const ACCENT = '#3b5b34'

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

export default function BridgeApp() {
  const [tab, setTab] = useState('cursus')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)

  return (
    <LeerShell
      mark="BR"
      accent={ACCENT}
      title="Bridge"
      subtitle="Vijfkaart hoog — cursus en biedtrainer"
      tabs={[{ id: 'cursus', label: 'Cursus' }, { id: 'overhoren', label: 'Trainen' }, { id: 'score', label: 'Scorekaart' }]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null) }}
      footnote={<p>Biedafspraken volgens het standaard Nederlandse beginnerssysteem (vijfkaart hoog, zwakke sans 15–17).</p>}
    >
      {tab === 'cursus' && <BridgeCursus />}

      {tab === 'overhoren' && quiz === null && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Trainen</p>
            <h1>Kies een trainer</h1>
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

      {tab === 'overhoren' && quiz !== null && (
        <>
          <div className="km-back-row">
            <button type="button" className="km-btn km-btn-secondary" onClick={() => setQuiz(null)}>← Andere trainer</button>
          </div>
          <QuizRunner maak={() => maakQuiz(quiz)} />
        </>
      )}

      {tab === 'score' && <Scorekaart />}
    </LeerShell>
  )
}
