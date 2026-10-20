import { useMemo, useState, type FormEvent } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { shuffle } from '../leer/match'
import { GELD, type Geld } from './data'

type Opgave = { vraag: string; antwoordCent: number; munt: 'ƒ' | '€'; uitleg: string; aantal?: boolean }

const isEuro = (g: Geld) => g.groep.startsWith('Euro')

function bedrag(cent: number, munt: 'ƒ' | '€'): string {
  const euro = cent / 100
  return `${munt} ${euro.toLocaleString('nl-NL', { minimumFractionDigits: cent % 100 ? 2 : 0, maximumFractionDigits: 2 })}`
}

function maakOpgave(): Opgave {
  const metWaarde = GELD.filter((g) => g.waardeCent)
  const munt: 'ƒ' | '€' = Math.random() < 0.6 ? 'ƒ' : '€'
  const pool = metWaarde.filter((g) => (munt === '€' ? isEuro(g) : !isEuro(g)))
  const soort = Math.random()
  if (soort < 0.4) {
    // hoeveel van het kleine gaan er in het grote?
    for (let i = 0; i < 50; i += 1) {
      const [a, b] = shuffle(pool).slice(0, 2)
      const groot = a.waardeCent! >= b.waardeCent! ? a : b
      const klein = groot === a ? b : a
      const n = groot.waardeCent! / klein.waardeCent!
      if (Number.isInteger(n) && n > 1 && n <= 400 && groot.bijnaam !== klein.bijnaam)
        return {
          vraag: `Hoe vaak past een ${klein.bijnaam.toLowerCase()} in een ${groot.bijnaam.toLowerCase()}?`,
          antwoordCent: n,
          munt,
          aantal: true,
          uitleg: `${groot.bijnaam} = ${groot.waarde}, ${klein.bijnaam} = ${klein.waarde}, dus ${n} keer.`,
        }
    }
  }
  // optellen: twee of drie bijnamen, met aantallen
  const stukken = shuffle(pool).slice(0, Math.random() < 0.5 ? 2 : 3)
  const aantallen = stukken.map((g) => (g.waardeCent! >= 10000 ? 1 : 1 + Math.floor(Math.random() * 3)))
  const totaal = stukken.reduce((t, g, i) => t + g.waardeCent! * aantallen[i], 0)
  const delen = stukken.map((g, i) => `${aantallen[i] === 1 ? 'een' : aantallen[i]} ${g.bijnaam.toLowerCase()}`)
  return {
    vraag: `Je legt neer: ${delen.slice(0, -1).join(', ')} en ${delen[delen.length - 1]}. Hoeveel is dat?`,
    antwoordCent: totaal,
    munt,
    uitleg: stukken.map((g, i) => `${aantallen[i]} × ${g.bijnaam} (${g.waarde})`).join(' + ') + ` = ${bedrag(totaal, munt)}`,
  }
}

function leesBedrag(t: string): number | null {
  const s = t.replace(/[ƒ€\s]/g, '').replace(/\./g, '').replace(',', '.')
  if (!s) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

// Rekenen met straattaal: optellen en omrekenen met bijnamen.
export default function Afrekenen() {
  const [ronde, setRonde] = useState(0)
  const opgave = useMemo(() => maakOpgave(), [ronde])
  const [invoer, setInvoer] = useState('')
  const [uitslag, setUitslag] = useState<boolean | null>(null)
  const [score, setScore] = useState({ goed: 0, totaal: 0 })

  function controleer(e: FormEvent) {
    e.preventDefault()
    if (uitslag !== null) return
    const n = leesBedrag(invoer)
    if (n === null) return
    const ok = opgave.aantal ? Math.round(n) === opgave.antwoordCent : Math.round(n * 100) === opgave.antwoordCent
    setUitslag(ok)
    setScore((s) => ({ goed: s.goed + (ok ? 1 : 0), totaal: s.totaal + 1 }))
  }

  return (
    <div className="gd-afrekenen">
      <div className="gd-af-kop">
        <span className="gd-af-munt">{opgave.munt === 'ƒ' ? 'Gulden' : 'Euro'}</span>
        {score.totaal > 0 && (
          <span className="tabular">
            {score.goed} van {score.totaal} goed
          </span>
        )}
      </div>
      <p className="gd-af-vraag">{opgave.vraag}</p>
      <form className="gd-af-form" onSubmit={controleer}>
        <span className="gd-af-prefix">{opgave.aantal ? '×' : opgave.munt}</span>
        <input
          value={invoer}
          onChange={(e) => setInvoer(e.target.value)}
          inputMode="decimal"
          placeholder={opgave.aantal ? 'aantal' : '0,00'}
          disabled={uitslag !== null}
          className={uitslag === null ? '' : uitslag ? 'goed' : 'fout'}
          autoFocus
        />
        {uitslag === null ? (
          <button type="submit" className="km-btn km-btn-primary">
            Afrekenen
          </button>
        ) : (
          <button
            type="button"
            className="km-btn km-btn-primary"
            onClick={() => {
              setRonde(ronde + 1)
              setInvoer('')
              setUitslag(null)
            }}
          >
            <RotateCcw size={16} /> Volgende
          </button>
        )}
      </form>
      {uitslag !== null && (
        <p className={`gd-af-uitslag ${uitslag ? 'goed' : 'fout'}`}>
          {uitslag ? <Check size={18} /> : <X size={18} />}
          <span>
            {uitslag ? 'Klopt.' : `Het antwoord is ${opgave.aantal ? `${opgave.antwoordCent} keer` : bedrag(opgave.antwoordCent, opgave.munt)}.`} {opgave.uitleg}
          </span>
        </p>
      )}
    </div>
  )
}
