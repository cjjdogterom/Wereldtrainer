import { useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { distractors, pickRandom, shuffle } from '../leer/match'
import { ALLE_POSITIES, GROEPEN, LADDER, type Positie } from './data'
import './kerk.css'

const ACCENT = '#6b3a5b'

type QuizSoort = 'wie-hoger' | 'positie-taak' | 'taak-positie' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'wie-hoger', titel: 'Wie staat hoger?', uitleg: 'Kies van twee posities de hoogste in de hiërarchie.' },
  { id: 'positie-taak', titel: 'Positie → rol', uitleg: 'Wat doet deze positie?' },
  { id: 'taak-positie', titel: 'Rol → positie', uitleg: 'Welke positie hoort bij deze rol?' },
  { id: 'mix', titel: 'Mix', uitleg: 'Alle vraagsoorten door elkaar.' },
]

function vraagWieHoger(): Vraag {
  const a = pickRandom(LADDER)
  let b = pickRandom(LADDER)
  while (b.id === a.id) b = pickRandom(LADDER)
  const paar = shuffle([a, b])
  const hoogste = a.rang! < b.rang! ? a : b
  return {
    prompt: <>Wie staat <strong>hoger</strong> in de hiërarchie?</>,
    options: paar.map((p) => p.naam),
    correct: paar.findIndex((p) => p.id === hoogste.id),
    explain: `${hoogste.naam} staat hoger: ${hoogste.omschrijving}`,
  }
}

function vraagPositieTaak(p: Positie): Vraag {
  const opts = shuffle([p, ...distractors(ALLE_POSITIES, p, 3, (x) => x.id)])
  return {
    prompt: <>Wat is de rol van een <strong>{p.naam.toLowerCase()}</strong>?</>,
    options: opts.map((x) => x.omschrijving),
    correct: opts.findIndex((x) => x.id === p.id),
  }
}

function vraagTaakPositie(p: Positie): Vraag {
  const opts = shuffle([p, ...distractors(ALLE_POSITIES, p, 3, (x) => x.id)])
  return {
    prompt: <>Welke positie hoort hierbij: <em>{p.omschrijving}</em></>,
    options: opts.map((x) => x.naam),
    correct: opts.findIndex((x) => x.id === p.id),
  }
}

function maakQuiz(soort: QuizSoort): Vraag[] {
  const n = 15
  return Array.from({ length: n }, () => {
    const s = soort === 'mix' ? pickRandom(['wie-hoger', 'positie-taak', 'taak-positie'] as const) : soort
    if (s === 'wie-hoger') return vraagWieHoger()
    const p = pickRandom(ALLE_POSITIES)
    return s === 'positie-taak' ? vraagPositieTaak(p) : vraagTaakPositie(p)
  })
}

export default function KerkApp() {
  const [tab, setTab] = useState('leren')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)

  return (
    <LeerShell
      mark="RK"
      accent={ACCENT}
      title="Kerkelijke hiërarchie"
      subtitle="Posities in de Rooms-Katholieke Kerk"
      tabs={[{ id: 'leren', label: 'Leren' }, { id: 'overhoren', label: 'Overhoren' }]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null) }}
      footnote={
        <p>
          Gebaseerd op <a href="https://nl.wikipedia.org/wiki/Hi%C3%ABrarchie_van_de_Rooms-Katholieke_Kerk" target="_blank" rel="noreferrer">Wikipedia: Hiërarchie van de Rooms-Katholieke Kerk</a>.
        </p>
      }
    >
      {tab === 'leren' && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Leren</p>
            <h1>Van paus tot diaken</h1>
            <p>De ladder hieronder is de ambtelijke hiërarchie. Daarnaast bestaan wijdingen, vervangende functies, eretitels en de rangorde binnen kloosterordes.</p>
          </div>

          <ol className="rk-ladder">
            {LADDER.map((p) => (
              <li key={p.id} className="rk-trede">
                <span className="rk-rang">{p.rang}</span>
                <div>
                  <strong>{p.naam}</strong>
                  <p>{p.omschrijving}</p>
                </div>
              </li>
            ))}
          </ol>

          {GROEPEN.map((groep) => (
            <section key={groep.titel} className="rk-groep">
              <h2>{groep.titel}</h2>
              <p className="rk-groep-uitleg">{groep.uitleg}</p>
              <div className="km-grid">
                {groep.posities.map((p) => (
                  <div className="km-card" key={p.id}>
                    <h3>{p.naam}</h3>
                    <p>{p.omschrijving}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
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
