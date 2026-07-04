import { useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { distractors, shuffle } from '../leer/match'
import { KNOPEN, type Knoop } from './data'
import { VAARKNOPEN } from './knots3d'
import './knopen.css'

const ACCENT = '#8a5a2b'

type QuizSoort = 'foto-naam' | 'doel-naam' | 'naam-doel' | 'vaarknopen' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'foto-naam', titel: 'Foto → naam', uitleg: 'Herken de knoop op de foto.' },
  { id: 'doel-naam', titel: 'Doel → knoop', uitleg: 'Welke knoop gebruik je hiervoor?' },
  { id: 'naam-doel', titel: 'Knoop → doel', uitleg: 'Waarvoor is deze knoop bedoeld?' },
  { id: 'vaarknopen', titel: 'Alle vaarknopen', uitleg: 'Doelvragen uit de volledige knots3d-lijst (58 knopen).' },
  { id: 'mix', titel: 'Mix', uitleg: 'Alle vraagsoorten door elkaar.' },
]

function vraagFotoNaam(knoop: Knoop): Vraag {
  const opts = shuffle([knoop, ...distractors(KNOPEN, knoop, 3, (k) => k.id)])
  return {
    prompt: (
      <div className="kn-vraagfoto">
        <img src={knoop.afbeelding} alt="Welke knoop is dit?" loading="lazy" />
        <span>Welke knoop is dit?</span>
      </div>
    ),
    options: opts.map((k) => k.naam),
    correct: opts.findIndex((k) => k.id === knoop.id),
    explain: `${knoop.naam} (${knoop.engels}): ${knoop.doel.toLowerCase()}.`,
  }
}

function vraagDoelNaam(knoop: Knoop): Vraag {
  const opts = shuffle([knoop, ...distractors(KNOPEN, knoop, 3, (k) => k.id)])
  return {
    prompt: <>Welke knoop gebruik je om: <em>{knoop.doel.toLowerCase()}</em>?</>,
    options: opts.map((k) => k.naam),
    correct: opts.findIndex((k) => k.id === knoop.id),
    explain: knoop.uitleg,
  }
}

// Extra variatie: doelvragen uit de volledige knots3d-vaarknopenlijst
function vraagVaarknoop(): Vraag {
  const knoop = VAARKNOPEN[Math.floor(Math.random() * VAARKNOPEN.length)]
  const opts = shuffle([knoop, ...distractors(VAARKNOPEN, knoop, 3, (k) => k.naam)])
  return {
    prompt: <>Welke knoop hoort hierbij: <em>{knoop.doel}</em></>,
    options: opts.map((k) => k.naam),
    correct: opts.findIndex((k) => k.naam === knoop.naam),
    explain: `${knoop.naam}: ${knoop.doel}`,
  }
}

function vraagNaamDoel(knoop: Knoop): Vraag {
  const opts = shuffle([knoop, ...distractors(KNOPEN, knoop, 3, (k) => k.id)])
  return {
    prompt: <>Waarvoor gebruik je de <strong>{knoop.naam.toLowerCase()}</strong>?</>,
    options: opts.map((k) => k.doel),
    correct: opts.findIndex((k) => k.id === knoop.id),
    explain: knoop.uitleg,
  }
}

function maakQuiz(soort: QuizSoort): Vraag[] {
  if (soort === 'vaarknopen') {
    return Array.from({ length: 15 }, () => vraagVaarknoop())
  }
  const volgorde = shuffle(KNOPEN)
  const soorten = ['foto-naam', 'doel-naam', 'naam-doel', 'vaarknopen'] as const
  return volgorde.map((knoop) => {
    const s = soort === 'mix' ? soorten[Math.floor(Math.random() * soorten.length)] : soort
    if (s === 'foto-naam') return vraagFotoNaam(knoop)
    if (s === 'doel-naam') return vraagDoelNaam(knoop)
    if (s === 'vaarknopen') return vraagVaarknoop()
    return vraagNaamDoel(knoop)
  })
}

export default function KnopenApp() {
  const [tab, setTab] = useState('leren')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)
  const [zoek, setZoek] = useState('')

  return (
    <LeerShell
      mark="KN"
      accent={ACCENT}
      title="Nautische knopen"
      subtitle={`${KNOPEN.length} knopen en hun gebruik`}
      tabs={[{ id: 'leren', label: 'Basisknopen' }, { id: 'alle', label: 'Alle vaarknopen' }, { id: 'overhoren', label: 'Overhoren' }]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null) }}
      footnote={
        <p>
          Foto's via <a href="https://commons.wikimedia.org" target="_blank" rel="noreferrer">Wikimedia Commons</a> (vrije licenties) · knopenlijst en 3D-animaties via <a href="https://knots3d.com/nl/vaarknopen" target="_blank" rel="noreferrer">knots3d.com</a>.
        </p>
      }
    >
      {tab === 'leren' && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Leren</p>
            <h1>Knopen en hun toepassing</h1>
            <p>Per knoop: waarvoor je hem gebruikt en waar je op moet letten.</p>
          </div>
          <div className="kn-grid">
            {KNOPEN.map((k) => (
              <article className="km-card kn-kaart" key={k.id}>
                <div className="kn-foto">
                  <img src={k.afbeelding} alt={`${k.naam} (${k.engels})`} loading="lazy" />
                </div>
                <span className="km-card-sub">{k.engels}</span>
                <h3>{k.naam}</h3>
                <p className="kn-doel">{k.doel}</p>
                <p>{k.uitleg}</p>
                {k.onthoud && <p className="kn-onthoud">Onthoud: {k.onthoud}</p>}
              </article>
            ))}
          </div>
        </>
      )}

      {tab === 'alle' && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Alle vaarknopen</p>
            <h1>{VAARKNOPEN.length} vaarknopen</h1>
            <p>De volledige lijst van knots3d. Klik op een knoop om de stap-voor-stap 3D-animatie op knots3d.com te bekijken.</p>
          </div>
          <div className="kn-zoek">
            <input
              value={zoek}
              onChange={(e) => setZoek(e.target.value)}
              placeholder="Zoek een knoop…"
              autoComplete="off"
            />
          </div>
          <div className="kn-lijst">
            {VAARKNOPEN.filter((k) => (k.naam + ' ' + k.doel).toLowerCase().includes(zoek.toLowerCase())).map((k) => (
              <a className="kn-rij" key={k.url} href={k.url} target="_blank" rel="noreferrer">
                <div>
                  <strong>{k.naam}</strong>
                  <p>{k.doel}</p>
                </div>
                <span className="kn-3d">3D →</span>
              </a>
            ))}
          </div>
        </>
      )}

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
