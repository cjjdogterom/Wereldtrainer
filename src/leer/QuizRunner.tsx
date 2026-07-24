import { useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { checkTyped } from './match'

// Eén vraag: meerkeuze (options + correct-index) of typen (accepted-varianten).
export type Vraag = {
  prompt: ReactNode
  options?: ReactNode[]
  correct?: number
  accepted?: string[]
  antwoordLabel?: string
  explain?: ReactNode
  // vrij te gebruiken sleutel zodat modules per vraag voortgang kunnen bijhouden
  id?: string
}

type Uitslag = { goed: boolean; fuzzy: boolean }

// Generieke overhoring: toont vragen één voor één, houdt de score bij en
// eindigt met een resultaatkaart. `maak` levert per run een verse vragenlijst.
// `onUitslag` wordt (indien opgegeven) na elk antwoord aangeroepen.
export default function QuizRunner({
  maak,
  herstartLabel = 'Nog een keer',
  onUitslag,
}: {
  maak: () => Vraag[]
  herstartLabel?: string
  onUitslag?: (vraag: Vraag, goed: boolean) => void
}) {
  const [run, setRun] = useState(0)
  const vragen = useMemo(() => maak(), [run]) // eslint-disable-line react-hooks/exhaustive-deps
  const [idx, setIdx] = useState(0)
  const [uitslag, setUitslag] = useState<Uitslag | null>(null)
  const [gekozen, setGekozen] = useState<number | null>(null)
  const [getypt, setGetypt] = useState('')
  const [score, setScore] = useState(0)
  const [klaar, setKlaar] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const vraag = vragen[idx]

  function beantwoord(goed: boolean, fuzzy = false) {
    setUitslag({ goed, fuzzy })
    if (goed) setScore((s) => s + 1)
    onUitslag?.(vraag, goed)
  }

  function kies(i: number) {
    if (uitslag) return
    setGekozen(i)
    beantwoord(i === vraag.correct)
  }

  function controleerTyped(e: FormEvent) {
    e.preventDefault()
    if (uitslag || !vraag.accepted) return
    const result = checkTyped(getypt, vraag.accepted)
    beantwoord(result !== 'wrong', result === 'fuzzy')
  }

  function volgende() {
    if (idx + 1 >= vragen.length) {
      setKlaar(true)
      return
    }
    setIdx(idx + 1)
    setUitslag(null)
    setGekozen(null)
    setGetypt('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function herstart() {
    setRun((r) => r + 1)
    setIdx(0)
    setUitslag(null)
    setGekozen(null)
    setGetypt('')
    setScore(0)
    setKlaar(false)
  }

  if (klaar) {
    const pct = vragen.length > 0 ? Math.round((score / vragen.length) * 100) : 0
    return (
      <div className="km-panel km-quiz-result">
        <p className="km-eyebrow">Uitslag</p>
        <div className="km-result-score">{pct}%</div>
        <p>{score} van de {vragen.length} goed</p>
        <button type="button" className="km-btn km-btn-primary" onClick={herstart}>{herstartLabel}</button>
      </div>
    )
  }

  return (
    <div className="km-panel km-quiz">
      <div className="km-quiz-meta">
        <span>Vraag {idx + 1} van {vragen.length}</span>
        <span className="km-quiz-score">Score: {score}</span>
      </div>

      <div className="km-quiz-prompt">{vraag.prompt}</div>

      {vraag.options ? (
        <div className="km-quiz-options">
          {vraag.options.map((optie, i) => {
            const isGood = uitslag && i === vraag.correct
            const isBad = uitslag && gekozen === i && i !== vraag.correct
            return (
              <button
                key={i}
                type="button"
                className={`km-option${isGood ? ' good' : ''}${isBad ? ' bad' : ''}`}
                disabled={Boolean(uitslag)}
                onClick={() => kies(i)}
              >
                {optie}
              </button>
            )
          })}
        </div>
      ) : (
        <form className="km-quiz-form" onSubmit={controleerTyped}>
          <input
            ref={inputRef}
            value={getypt}
            onChange={(e) => setGetypt(e.target.value)}
            placeholder={vraag.antwoordLabel ?? 'Typ je antwoord'}
            disabled={Boolean(uitslag)}
            autoComplete="off"
          />
          <button type="submit" className="km-btn km-btn-primary" disabled={Boolean(uitslag) || !getypt.trim()}>
            Controleer
          </button>
        </form>
      )}

      {uitslag && (
        <div className={`km-feedback ${uitslag.goed ? 'good' : 'bad'}`} role="status">
          <strong>{uitslag.goed ? (uitslag.fuzzy ? 'Goed (kleine spelfout)' : 'Goed!') : 'Niet goed'}</strong>
          {vraag.explain && <div className="km-feedback-explain">{vraag.explain}</div>}
          <button type="button" className="km-btn km-btn-primary" onClick={volgende}>
            {idx + 1 >= vragen.length ? 'Bekijk uitslag' : 'Volgende'}
          </button>
        </div>
      )}
    </div>
  )
}
