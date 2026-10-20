import { useState, type ReactNode } from 'react'
import { AlertTriangle, ArrowLeft, ArrowRight, CircleHelp } from 'lucide-react'
import QuizRunner, { type Vraag } from './QuizRunner'
import { shuffle } from './match'
import './lessen.css'

export type LesVraag = { vraag: string; opties: string[]; goed: number; uitleg: string }

export type BasisLes = {
  id: string
  titel: string
  kern: string
  uitleg: string[]
  feiten?: string[]
  formules?: { formule: string; betekenis: string }[]
  letOp?: string
  vragen: LesVraag[]
}

// Eén les lezen: kern, illustratie, uitleg, formules, feiten, waarschuwing en
// een korte toets. De module bepaalt zelf de illustratie (`beeld`).
export function LesLezer({
  les,
  nummer,
  totaal,
  beeld,
  onVorige,
  onVolgende,
  onGelezen,
}: {
  les: BasisLes
  nummer: number
  totaal: number
  beeld?: ReactNode
  onVorige: () => void
  onVolgende: () => void
  onGelezen: () => void
}) {
  const [toets, setToets] = useState(false)
  return (
    <article className="ls-lezer">
      <p className="ls-nr">
        Les {nummer} van {totaal}
      </p>
      <h2>{les.titel}</h2>
      <p className="ls-kern">{les.kern}</p>

      {beeld}

      <div className="ls-uitleg">
        {les.uitleg.map((alinea, i) => (
          <p key={i}>{alinea}</p>
        ))}
      </div>

      {les.formules && les.formules.length > 0 && (
        <div className="ls-formules">
          {les.formules.map((f) => (
            <div key={f.formule} className="ls-formule">
              <code>{f.formule}</code>
              <span>{f.betekenis}</span>
            </div>
          ))}
        </div>
      )}

      {les.feiten && les.feiten.length > 0 && (
        <ul className="ls-feiten">
          {les.feiten.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}

      {les.letOp && (
        <aside className="ls-letop">
          <AlertTriangle size={18} aria-hidden="true" />
          <p>{les.letOp}</p>
        </aside>
      )}

      {!toets ? (
        <button
          type="button"
          className="ls-toetsknop"
          onClick={() => {
            setToets(true)
            onGelezen()
          }}
        >
          <CircleHelp size={18} /> Test jezelf ({les.vragen.length} vragen)
        </button>
      ) : (
        <div className="ls-toets">
          <QuizRunner maak={() => les.vragen.map((v) => naarVraag(v))} herstartLabel="Nog eens" />
        </div>
      )}

      <div className="ls-bladeren">
        <button type="button" className="km-btn km-btn-secondary" onClick={onVorige} disabled={nummer === 1}>
          <ArrowLeft size={16} /> Vorige
        </button>
        <button type="button" className="km-btn km-btn-primary" onClick={onVolgende} disabled={nummer === totaal}>
          Volgende les <ArrowRight size={16} />
        </button>
      </div>
    </article>
  )
}

export function naarVraag(v: LesVraag, label?: string): Vraag {
  const volgorde = shuffle(v.opties.map((tekst, i) => ({ tekst, goed: i === v.goed })))
  return {
    prompt: (
      <span className="ls-vraag">
        {label && <small>{label}</small>}
        {v.vraag}
      </span>
    ),
    options: volgorde.map((o) => o.tekst),
    correct: volgorde.findIndex((o) => o.goed),
    explain: v.uitleg,
  }
}

export function lessenQuiz(lessen: BasisLes[], aantal = 10): Vraag[] {
  const alle = lessen.flatMap((l) => l.vragen.map((v) => ({ v, les: l.titel })))
  return shuffle(alle)
    .slice(0, aantal)
    .map(({ v, les }) => naarVraag(v, les))
}

// Bijhouden welke lessen gelezen zijn, per module.
export function useGelezen(sleutel: string) {
  const [gelezen, setGelezen] = useState<string[]>(() => {
    try {
      const d = JSON.parse(localStorage.getItem(sleutel) ?? '[]')
      return Array.isArray(d) ? d : Array.isArray(d?.gelezen) ? d.gelezen : []
    } catch {
      return []
    }
  })
  function markeer(id: string) {
    if (gelezen.includes(id)) return
    const nieuw = [...gelezen, id]
    setGelezen(nieuw)
    try {
      localStorage.setItem(sleutel, JSON.stringify(nieuw))
    } catch {
      /* negeren */
    }
  }
  return { gelezen, markeer }
}
