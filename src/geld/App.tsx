import { useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { distractors, pickRandom, shuffle } from '../leer/match'
import { GELD, type Geld } from './data'
import './geld.css'

const ACCENT = '#8a6d1f'

const GROEPEN: Geld['groep'][] = ['Munten (gulden)', 'Biljetten & bijnamen (gulden)', 'Euro (informeel & straattaal)', 'Geld in het algemeen']

// Alleen bijnamen met een concreet bedrag lenen zich voor de bedrag-quiz.
const MET_BEDRAG = GELD.filter((g) => g.waardeCent !== null)

type QuizSoort = 'bedrag' | 'herkomst' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'bedrag', titel: 'Bijnaam → bedrag', uitleg: 'Hoeveel is een joet, een meier, een knaak?' },
  { id: 'herkomst', titel: 'Bijnaam → herkomst', uitleg: 'Waar komt de naam vandaan?' },
  { id: 'mix', titel: 'Mix', uitleg: 'Beide vraagsoorten door elkaar.' },
]

function vraagBedrag(): Vraag {
  const goed = pickRandom(MET_BEDRAG)
  // Afleiders met een ánder bedrag, zodat er nooit twee goede antwoorden zijn.
  const anders = shuffle(MET_BEDRAG.filter((g) => g.waardeCent !== goed.waardeCent))
  const opties = shuffle([goed, ...anders.slice(0, 3)])
  return {
    prompt: <>Hoeveel is <strong>een {goed.bijnaam.toLowerCase()}</strong>?</>,
    options: opties.map((g) => g.waarde),
    correct: opties.findIndex((g) => g.waardeCent === goed.waardeCent),
    explain: goed.herkomst,
  }
}

function vraagHerkomst(): Vraag {
  const goed = pickRandom(GELD)
  const opties = shuffle([goed, ...distractors(GELD, goed, 3, (g) => g.bijnaam)])
  return {
    prompt: <>Waar komt de naam <strong>{goed.bijnaam.toLowerCase()}</strong> vandaan?</>,
    options: opties.map((g) => g.herkomst),
    correct: opties.findIndex((g) => g.bijnaam === goed.bijnaam),
  }
}

function maakQuiz(soort: QuizSoort): Vraag[] {
  return Array.from({ length: 12 }, () => {
    const s = soort === 'mix' ? pickRandom(['bedrag', 'herkomst'] as const) : soort
    return s === 'bedrag' ? vraagBedrag() : vraagHerkomst()
  })
}

export default function GeldApp() {
  const [tab, setTab] = useState('leren')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)

  return (
    <LeerShell
      mark="ƒ€"
      accent={ACCENT}
      title="Geldbijnamen"
      subtitle="Gulden, euro & straattaal"
      tabs={[{ id: 'leren', label: 'Leren' }, { id: 'overhoren', label: 'Overhoren' }]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null) }}
      footnote={<p>Geldnamen van het gulden-tijdperk (tot de euro in 2002) tot de euro-straattaal van nu. Veel oude namen komen uit het Bargoens (dieventaal met sterke Jiddisch-Hebreeuwse invloed), de nieuwe vooral uit de hiphop en straattaal.</p>}
    >
      {tab === 'leren' && (
        <article className="gl-artikel">
          <div className="km-page-head">
            <p className="km-eyebrow">Leren</p>
            <h1>Wat is een joet, een meier of een barkie?</h1>
            <p>Van kleingeld tot miljoen: de bijnamen van de gulden én de euro, en waar ze vandaan komen.</p>
          </div>

          {GROEPEN.map((groep) => (
            <section key={groep} className="gl-groep">
              <h2>{groep}</h2>
              <div className="km-table-wrap">
                <table className="km-table">
                  <thead>
                    <tr>
                      <th>Bijnaam</th>
                      <th>Waarde</th>
                      <th>Herkomst</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GELD.filter((g) => g.groep === groep).map((g) => (
                      <tr key={g.bijnaam}>
                        <td><strong>{g.bijnaam}</strong></td>
                        <td className="km-num">{g.waarde}</td>
                        <td>{g.herkomst}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </article>
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
