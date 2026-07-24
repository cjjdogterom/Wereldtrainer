import { useEffect, useState } from 'react'

// Scorekaart voor bridge: vul het contract en het resultaat in, de kaart
// rekent de score zelf uit (standaard puntentelling).
type Rij = {
  wie: 'wij' | 'zij'
  niveau: number
  soort: '♣' | '♦' | '♥' | '♠' | 'SA'
  doublet: 1 | 2 | 4
  kwetsbaar: boolean
  // 0 = precies gemaakt, positief = overslagen, negatief = downslagen
  resultaat: number
}

const SLEUTEL = 'leerapp-bridge-score-v1'
const SOORTEN: Rij['soort'][] = ['♣', '♦', '♥', '♠', 'SA']

function laad(): Rij[] {
  try {
    const raw = localStorage.getItem(SLEUTEL)
    return raw ? (JSON.parse(raw) as Rij[]) : []
  } catch {
    return []
  }
}

// Standaard (duplicate) bridgescore. Positief = punten voor de spelende
// partij, negatief = punten voor de tegenpartij.
export function bridgeScore(r: Rij): number {
  const { niveau, soort, doublet, kwetsbaar, resultaat } = r
  if (resultaat < 0) {
    const down = -resultaat
    let straf = 0
    if (doublet === 1) {
      straf = down * (kwetsbaar ? 100 : 50)
    } else {
      // gedoubleerd: 100/200/200/300... (kwetsbaar 200/300/300…), geredoubleerd ×2
      for (let i = 1; i <= down; i += 1) {
        let per: number
        if (kwetsbaar) per = i === 1 ? 200 : 300
        else per = i === 1 ? 100 : i <= 3 ? 200 : 300
        straf += per
      }
      if (doublet === 4) straf *= 2
    }
    return -straf
  }

  const perSlag = soort === '♣' || soort === '♦' ? 20 : 30
  let trickScore = perSlag * niveau + (soort === 'SA' ? 10 : 0)
  trickScore *= doublet
  let score = trickScore
  // premies
  score += trickScore >= 100 ? (kwetsbaar ? 500 : 300) : 50
  if (niveau === 6) score += kwetsbaar ? 750 : 500
  if (niveau === 7) score += kwetsbaar ? 1500 : 1000
  if (doublet === 2) score += 50
  if (doublet === 4) score += 100
  // overslagen
  if (resultaat > 0) {
    if (doublet === 1) score += resultaat * perSlag
    else score += resultaat * (kwetsbaar ? 200 : 100) * (doublet === 4 ? 2 : 1)
  }
  return score
}

const LEGE_RIJ: Rij = { wie: 'wij', niveau: 3, soort: 'SA', doublet: 1, kwetsbaar: false, resultaat: 0 }

export default function Scorekaart() {
  const [rijen, setRijen] = useState<Rij[]>(() => laad())
  const [concept, setConcept] = useState<Rij>(LEGE_RIJ)

  useEffect(() => {
    try {
      localStorage.setItem(SLEUTEL, JSON.stringify(rijen))
    } catch { /* opslag niet beschikbaar */ }
  }, [rijen])

  function puntenVoor(r: Rij): { wij: number; zij: number } {
    const score = bridgeScore(r)
    const voorSpeler = score >= 0
    const wijSpelen = r.wie === 'wij'
    const wij = (voorSpeler ? wijSpelen : !wijSpelen) ? Math.abs(score) : 0
    return { wij, zij: wij === 0 ? Math.abs(score) : 0 }
  }

  const totaalWij = rijen.reduce((s, r) => s + puntenVoor(r).wij, 0)
  const totaalZij = rijen.reduce((s, r) => s + puntenVoor(r).zij, 0)

  const conceptScore = bridgeScore(concept)
  const maxOver = 7 - concept.niveau
  const maxDown = concept.niveau + 6

  return (
    <div className="br-score">
      <div className="kj-score-kop">
        <div>
          <p className="km-eyebrow">Scorekaart</p>
          <h2>Wij {totaalWij} — {totaalZij} Zij</h2>
          <p className="kj-score-hint">Kies het contract en het resultaat; de score wordt automatisch uitgerekend en bij het juiste team opgeteld.</p>
        </div>
        {rijen.length > 0 && (
          <button type="button" className="km-btn km-btn-secondary" onClick={() => setRijen([])}>Nieuw spel</button>
        )}
      </div>

      <div className="km-panel br-invoer">
        <div className="br-invoer-velden">
          <label>
            <span>Gespeeld door</span>
            <select value={concept.wie} onChange={(e) => setConcept({ ...concept, wie: e.target.value as Rij['wie'] })}>
              <option value="wij">Wij</option>
              <option value="zij">Zij</option>
            </select>
          </label>
          <label>
            <span>Contract</span>
            <span className="br-contract-keuze">
              <select value={concept.niveau} onChange={(e) => setConcept({ ...concept, niveau: Number(e.target.value), resultaat: 0 })}>
                {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <select value={concept.soort} onChange={(e) => setConcept({ ...concept, soort: e.target.value as Rij['soort'] })}>
                {SOORTEN.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={concept.doublet} onChange={(e) => setConcept({ ...concept, doublet: Number(e.target.value) as Rij['doublet'] })}>
                <option value={1}>–</option>
                <option value={2}>doublet</option>
                <option value={4}>redoublet</option>
              </select>
            </span>
          </label>
          <label>
            <span>Resultaat</span>
            <select value={concept.resultaat} onChange={(e) => setConcept({ ...concept, resultaat: Number(e.target.value) })}>
              {Array.from({ length: maxOver }, (_, i) => maxOver - i).map((n) => (
                <option key={`+${n}`} value={n}>+{n} (overslagen)</option>
              ))}
              <option value={0}>precies gemaakt</option>
              {Array.from({ length: maxDown }, (_, i) => -(i + 1)).map((n) => (
                <option key={n} value={n}>{n} (down)</option>
              ))}
            </select>
          </label>
          <label className="br-check">
            <input type="checkbox" checked={concept.kwetsbaar} onChange={(e) => setConcept({ ...concept, kwetsbaar: e.target.checked })} />
            <span>Kwetsbaar</span>
          </label>
        </div>
        <div className="br-invoer-actie">
          <span className="br-preview km-num">
            {conceptScore >= 0
              ? `+${conceptScore} voor ${concept.wie}`
              : `${-conceptScore} voor ${concept.wie === 'wij' ? 'zij' : 'wij'}`}
          </span>
          <button type="button" className="km-btn km-btn-primary" onClick={() => setRijen([...rijen, concept])}>
            Noteer
          </button>
        </div>
      </div>

      {rijen.length > 0 && (
        <div className="km-table-wrap kj-score-tabel">
          <table className="km-table">
            <thead>
              <tr><th>#</th><th>Contract</th><th>Door</th><th>Resultaat</th><th>Wij</th><th>Zij</th><th></th></tr>
            </thead>
            <tbody>
              {rijen.map((r, i) => {
                const p = puntenVoor(r)
                const rood = r.soort === '♥' || r.soort === '♦'
                return (
                  <tr key={i}>
                    <td className="km-num">{i + 1}</td>
                    <td>
                      <strong className={rood ? 'br-rood' : ''}>{r.niveau}{r.soort}</strong>
                      {r.doublet === 2 ? ' ×' : r.doublet === 4 ? ' ××' : ''}
                      {r.kwetsbaar ? <span className="br-kw"> kw</span> : ''}
                    </td>
                    <td>{r.wie}</td>
                    <td className="km-num">{r.resultaat === 0 ? 'C' : r.resultaat > 0 ? `+${r.resultaat}` : r.resultaat}</td>
                    <td className="km-num">{p.wij || ''}</td>
                    <td className="km-num">{p.zij || ''}</td>
                    <td>
                      <button type="button" className="br-verwijder" aria-label="Verwijder regel" onClick={() => setRijen(rijen.filter((_, j) => j !== i))}>✕</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}><strong>Totaal</strong></td>
                <td className="km-num kj-totaal">{totaalWij}</td>
                <td className="km-num kj-totaal">{totaalZij}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
