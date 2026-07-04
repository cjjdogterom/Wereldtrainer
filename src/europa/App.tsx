import { useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { distractors, pickRandom, shuffle } from '../leer/match'
import { MACHTEN, TIJDVAKKEN, type Macht } from './data'
import './europa.css'

const ACCENT = '#245c8f'

type QuizSoort = 'macht-periode' | 'macht-gebied' | 'wat-eerder' | 'omschrijving-macht' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'omschrijving-macht', titel: 'Omschrijving → macht', uitleg: 'Herken de macht aan de omschrijving.' },
  { id: 'macht-periode', titel: 'Macht → periode', uitleg: 'Wanneer had deze macht de overhand?' },
  { id: 'macht-gebied', titel: 'Macht → gebied', uitleg: 'Waar regeerde deze macht?' },
  { id: 'wat-eerder', titel: 'Wat kwam eerder?', uitleg: 'Zet twee machten in de juiste volgorde.' },
  { id: 'mix', titel: 'Mix', uitleg: 'Alle vraagsoorten door elkaar.' },
]

function vraagMachtPeriode(m: Macht): Vraag {
  const opts = shuffle([m, ...distractors(MACHTEN, m, 3, (x) => x.id)])
  return {
    prompt: <>In welke periode hoort <strong>{m.macht}</strong>?</>,
    options: opts.map((x) => x.periode),
    correct: opts.findIndex((x) => x.id === m.id),
    explain: `${m.macht} (${m.periode}): ${m.uitleg}`,
  }
}

function vraagMachtGebied(m: Macht): Vraag {
  const opts = shuffle([m, ...distractors(MACHTEN, m, 3, (x) => x.id)])
  return {
    prompt: <>Waar had <strong>{m.macht}</strong> de macht?</>,
    options: opts.map((x) => x.gebied),
    correct: opts.findIndex((x) => x.id === m.id),
    explain: m.uitleg,
  }
}

function vraagOmschrijvingMacht(m: Macht): Vraag {
  const opts = shuffle([m, ...distractors(MACHTEN, m, 3, (x) => x.id)])
  return {
    prompt: <><em>{m.uitleg}</em><br />Over wie of wat gaat dit?</>,
    options: opts.map((x) => x.macht),
    correct: opts.findIndex((x) => x.id === m.id),
    explain: `${m.macht} — ${m.periode}, ${m.gebied.toLowerCase()}.`,
  }
}

function vraagWatEerder(): Vraag {
  const a = pickRandom(MACHTEN)
  let b = pickRandom(MACHTEN)
  while (Math.abs(b.start - a.start) < 30) b = pickRandom(MACHTEN)
  const paar = shuffle([a, b])
  const eerste = a.start < b.start ? a : b
  return {
    prompt: <>Wat kwam <strong>eerder</strong>?</>,
    options: paar.map((m) => `${m.macht}`),
    correct: paar.findIndex((m) => m.id === eerste.id),
    explain: `${eerste.macht} (${eerste.periode}) kwam vóór ${(eerste.id === a.id ? b : a).macht} (${(eerste.id === a.id ? b : a).periode}).`,
  }
}

function maakQuiz(soort: QuizSoort): Vraag[] {
  return Array.from({ length: 15 }, () => {
    const s = soort === 'mix' ? pickRandom(['macht-periode', 'macht-gebied', 'wat-eerder', 'omschrijving-macht'] as const) : soort
    if (s === 'wat-eerder') return vraagWatEerder()
    const m = pickRandom(MACHTEN)
    if (s === 'macht-periode') return vraagMachtPeriode(m)
    if (s === 'macht-gebied') return vraagMachtGebied(m)
    return vraagOmschrijvingMacht(m)
  })
}

export default function EuropaApp() {
  const [tab, setTab] = useState('leren')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)

  return (
    <LeerShell
      mark="EU"
      accent={ACCENT}
      title="Europa in vogelvlucht"
      subtitle="Wie had wanneer de macht, en waar"
      tabs={[{ id: 'leren', label: 'Tijdlijn' }, { id: 'overhoren', label: 'Overhoren' }]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null) }}
      footnote={<p>Bewust beknopt: de grote lijnen van de Europese machtsgeschiedenis.</p>}
    >
      {tab === 'leren' && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Tijdlijn</p>
            <h1>Van Minoërs tot de Europese Unie</h1>
            <p>De grote machten van Europa in chronologische volgorde, per tijdvak.</p>
          </div>

          {TIJDVAKKEN.map((tijdvak) => (
            <section key={tijdvak} className="eu-tijdvak">
              <h2>{tijdvak}</h2>
              <div className="eu-lijst">
                {MACHTEN.filter((m) => m.tijdvak === tijdvak).map((m) => (
                  <article className="eu-item" key={m.id}>
                    <span className="eu-periode km-num">{m.periode}</span>
                    <div>
                      <strong>{m.macht}</strong>
                      <span className="eu-gebied">{m.gebied}</span>
                      <p>{m.uitleg}</p>
                    </div>
                  </article>
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
