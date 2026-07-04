import { useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { distractors, shuffle } from '../leer/match'
import SeinVlag from './Vlag'
import { CIJFER_MORSE, SEINEN, type Sein } from './data'
import './seinen.css'

const ACCENT = '#1e516e'

type QuizSoort = 'vlag-letter' | 'letter-morse' | 'morse-letter' | 'letter-navo' | 'vlag-betekenis' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'vlag-letter', titel: 'Vlag → letter', uitleg: 'Zie de seinvlag, kies de juiste letter en het spelalfabet-woord.' },
  { id: 'vlag-betekenis', titel: 'Vlag → betekenis', uitleg: 'Zie de seinvlag, kies wat dit sein betekent.' },
  { id: 'letter-navo', titel: 'Letter → spelalfabet', uitleg: 'Typ het NAVO-woord bij de letter (Alfa, Bravo…).' },
  { id: 'letter-morse', titel: 'Letter → morse', uitleg: 'Kies de juiste morsecode bij de letter.' },
  { id: 'morse-letter', titel: 'Morse → letter', uitleg: 'Zie de morsecode, typ de letter of het cijfer.' },
  { id: 'mix', titel: 'Mix', uitleg: 'Twintig vragen, alle soorten door elkaar.' },
]

function vraagVlagLetter(sein: Sein): Vraag {
  const opts = shuffle([sein, ...distractors(SEINEN, sein, 3, (s) => s.letter)])
  return {
    prompt: (
      <div className="sn-vraagvlag">
        <SeinVlag letter={sein.letter} size={110} />
        <span>Welke letter seint deze vlag?</span>
      </div>
    ),
    options: opts.map((s) => `${s.letter} · ${s.navo}`),
    correct: opts.findIndex((s) => s.letter === sein.letter),
    explain: `${sein.letter} (${sein.navo}): ${sein.betekenis}`,
  }
}

function vraagVlagBetekenis(sein: Sein): Vraag {
  const opts = shuffle([sein, ...distractors(SEINEN, sein, 3, (s) => s.letter)])
  return {
    prompt: (
      <div className="sn-vraagvlag">
        <SeinVlag letter={sein.letter} size={110} />
        <span>Wat betekent dit sein?</span>
      </div>
    ),
    options: opts.map((s) => s.betekenis),
    correct: opts.findIndex((s) => s.letter === sein.letter),
    explain: `Dit is vlag ${sein.letter} (${sein.navo}).`,
  }
}

function vraagLetterNavo(sein: Sein): Vraag {
  return {
    prompt: <>Wat is het spelalfabet-woord voor de letter <strong>{sein.letter}</strong>?</>,
    accepted: [sein.navo],
    antwoordLabel: 'Bijv. Alfa',
    explain: `${sein.letter} = ${sein.navo}`,
  }
}

function vraagLetterMorse(sein: Sein): Vraag {
  const opts = shuffle([sein, ...distractors(SEINEN, sein, 3, (s) => s.letter)])
  return {
    prompt: <>Wat is de morsecode voor <strong>{sein.letter}</strong> ({sein.navo})?</>,
    options: opts.map((s) => <span className="sn-morse" key={s.letter}>{s.morse}</span>),
    correct: opts.findIndex((s) => s.letter === sein.letter),
    explain: `${sein.letter} = ${sein.morse}`,
  }
}

function vraagMorseLetter(): Vraag {
  const alles = [
    ...SEINEN.map((s) => ({ teken: s.letter, morse: s.morse, accepted: [s.letter, s.navo] })),
    ...CIJFER_MORSE.map((c) => ({ teken: c.cijfer, morse: c.morse, accepted: [c.cijfer] })),
  ]
  const item = alles[Math.floor(Math.random() * alles.length)]
  return {
    prompt: (
      <div className="sn-vraagvlag">
        <span className="sn-morse sn-morse-groot">{item.morse}</span>
        <span>Welke letter of welk cijfer is dit?</span>
      </div>
    ),
    accepted: item.accepted,
    antwoordLabel: 'Letter of cijfer',
    explain: `${item.morse} = ${item.teken}`,
  }
}

function maakQuiz(soort: QuizSoort): Vraag[] {
  if (soort === 'mix') {
    const soorten: QuizSoort[] = ['vlag-letter', 'vlag-betekenis', 'letter-navo', 'letter-morse', 'morse-letter']
    return Array.from({ length: 20 }, () => maakVraag(soorten[Math.floor(Math.random() * soorten.length)]))
  }
  return Array.from({ length: 15 }, () => maakVraag(soort))
}

function maakVraag(soort: QuizSoort): Vraag {
  const sein = SEINEN[Math.floor(Math.random() * SEINEN.length)]
  switch (soort) {
    case 'vlag-letter': return vraagVlagLetter(sein)
    case 'vlag-betekenis': return vraagVlagBetekenis(sein)
    case 'letter-navo': return vraagLetterNavo(sein)
    case 'letter-morse': return vraagLetterMorse(sein)
    default: return vraagMorseLetter()
  }
}

export default function SeinenApp() {
  const [tab, setTab] = useState('leren')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)

  return (
    <LeerShell
      mark="SN"
      accent={ACCENT}
      title="Nautisch seinen"
      subtitle="Seinvlaggen · morse · spelalfabet"
      tabs={[{ id: 'leren', label: 'Leren' }, { id: 'overhoren', label: 'Overhoren' }]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null) }}
      footnote={<p>Betekenissen volgens het Internationaal Seinboek (enkelvoudige seinen).</p>}
    >
      {tab === 'leren' && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Leren</p>
            <h1>Vlaggen, spelalfabet en morse</h1>
            <p>Elke letter heeft een seinvlag, een spelalfabet-woord en een morsecode. De vlag heeft daarnaast een eigen betekenis als hij alleen wordt gehesen.</p>
          </div>
          <div className="km-table-wrap">
            <table className="km-table">
              <thead>
                <tr>
                  <th>Vlag</th>
                  <th>Letter</th>
                  <th>Spelalfabet</th>
                  <th>Morse</th>
                  <th>Betekenis als enkel sein</th>
                </tr>
              </thead>
              <tbody>
                {SEINEN.map((s) => (
                  <tr key={s.letter}>
                    <td><SeinVlag letter={s.letter} size={44} /></td>
                    <td className="km-num">{s.letter}</td>
                    <td>{s.navo}</td>
                    <td><span className="sn-morse">{s.morse}</span></td>
                    <td>{s.betekenis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="sn-tussenkop">Cijfers in morse</h2>
          <div className="km-grid sn-cijfers">
            {CIJFER_MORSE.map((c) => (
              <div className="km-card sn-cijfer" key={c.cijfer}>
                <span className="km-num sn-cijfer-teken">{c.cijfer}</span>
                <span className="sn-morse">{c.morse}</span>
              </div>
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
