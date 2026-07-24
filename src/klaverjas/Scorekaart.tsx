import { useEffect, useState } from 'react'

// Scorekaart voor klaverjassen: 162 punten per spel, roem apart, nat en pit
// worden automatisch herkend. De troefmaker wisselt elk spel (om de beurt),
// beginnend bij wie de eerste troef bepaalt.
type Ronde = {
  wijPunten: number | null
  zijPunten: number | null
  wijRoem: number
  zijRoem: number
}

type Spel = {
  eersteTroef: 'wij' | 'zij'
  rondes: Ronde[]
}

const SLEUTEL = 'leerapp-klaverjas-score-v1'
const TOTAAL = 162

function leegSpel(eersteTroef: 'wij' | 'zij'): Spel {
  return { eersteTroef, rondes: Array.from({ length: 16 }, () => ({ wijPunten: null, zijPunten: null, wijRoem: 0, zijRoem: 0 })) }
}

function laad(): Spel | null {
  try {
    const raw = localStorage.getItem(SLEUTEL)
    return raw ? (JSON.parse(raw) as Spel) : null
  } catch {
    return null
  }
}

// Wie maakt troef in ronde i (0-based)? Om en om, beginnend bij eersteTroef.
function troefmaker(spel: Spel, i: number): 'wij' | 'zij' {
  const even = i % 2 === 0
  return spel.eersteTroef === 'wij' ? (even ? 'wij' : 'zij') : (even ? 'zij' : 'wij')
}

// Uitslag van één ronde, met nat- en pit-logica.
export function rondeUitslag(spel: Spel, i: number): { wij: number; zij: number; nat: boolean; pit: 'wij' | 'zij' | null } | null {
  const r = spel.rondes[i]
  if (r.wijPunten === null || r.zijPunten === null) return null
  const maker = troefmaker(spel, i)
  const pit = r.wijPunten === TOTAAL ? 'wij' : r.zijPunten === TOTAAL ? 'zij' : null
  const wijRoem = r.wijRoem + (pit === 'wij' ? 100 : 0)
  const zijRoem = r.zijRoem + (pit === 'zij' ? 100 : 0)
  let wij = r.wijPunten + wijRoem
  let zij = r.zijPunten + zijRoem
  const nat = maker === 'wij' ? wij <= zij : zij <= wij
  if (nat) {
    const alles = TOTAAL + wijRoem + zijRoem
    if (maker === 'wij') { wij = 0; zij = alles } else { zij = 0; wij = alles }
  }
  return { wij, zij, nat, pit }
}

export default function Scorekaart() {
  const [spel, setSpel] = useState<Spel | null>(() => laad())

  useEffect(() => {
    try {
      if (spel) localStorage.setItem(SLEUTEL, JSON.stringify(spel))
      else localStorage.removeItem(SLEUTEL)
    } catch { /* opslag niet beschikbaar */ }
  }, [spel])

  // ── Startvraag: wie bepaalt de eerste troef? ──
  if (!spel) {
    return (
      <div className="km-panel kj-start">
        <p className="km-eyebrow">Scorekaart</p>
        <h2>Wie bepaalt de eerste troef?</h2>
        <p>Daarna wisselt de troefmaker elk spel automatisch om en om.</p>
        <div className="kj-start-knoppen">
          <button type="button" className="km-btn km-btn-primary" onClick={() => setSpel(leegSpel('wij'))}>Wij</button>
          <button type="button" className="km-btn km-btn-primary" onClick={() => setSpel(leegSpel('zij'))}>Zij</button>
        </div>
      </div>
    )
  }

  function zetPunten(i: number, kant: 'wij' | 'zij', tekst: string) {
    setSpel((huidig) => {
      if (!huidig) return huidig
      const rondes = huidig.rondes.map((r, j) => {
        if (j !== i) return r
        if (tekst.trim() === '') return { ...r, wijPunten: null, zijPunten: null }
        const n = Math.max(0, Math.min(TOTAAL, parseInt(tekst, 10) || 0))
        // het andere getal automatisch aanvullen tot 162
        return kant === 'wij'
          ? { ...r, wijPunten: n, zijPunten: TOTAAL - n }
          : { ...r, zijPunten: n, wijPunten: TOTAAL - n }
      })
      return { ...huidig, rondes }
    })
  }

  function zetRoem(i: number, kant: 'wij' | 'zij', tekst: string) {
    setSpel((huidig) => {
      if (!huidig) return huidig
      const n = Math.max(0, parseInt(tekst, 10) || 0)
      const rondes = huidig.rondes.map((r, j) => (j === i ? { ...r, [kant === 'wij' ? 'wijRoem' : 'zijRoem']: n } : r))
      return { ...huidig, rondes }
    })
  }

  const uitslagen = spel.rondes.map((_, i) => rondeUitslag(spel, i))
  const totaalWij = uitslagen.reduce((s, u) => s + (u?.wij ?? 0), 0)
  const totaalZij = uitslagen.reduce((s, u) => s + (u?.zij ?? 0), 0)
  const klaar = uitslagen.every((u) => u !== null)

  return (
    <div className="kj-score">
      <div className="kj-score-kop">
        <div>
          <p className="km-eyebrow">Scorekaart</p>
          <h2>16 spellen · eerste troef: {spel.eersteTroef}</h2>
          <p className="kj-score-hint">Vul één puntengetal in — het andere wordt automatisch aangevuld (samen 162). Roem vul je per team apart in; nat en pit rekent de kaart zelf uit.</p>
        </div>
        <button type="button" className="km-btn km-btn-secondary" onClick={() => setSpel(null)}>Nieuw spel</button>
      </div>

      <div className="km-table-wrap kj-score-tabel">
        <table className="km-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Troef</th>
              <th>Punten wij</th>
              <th>Roem wij</th>
              <th>Punten zij</th>
              <th>Roem zij</th>
              <th>Wij</th>
              <th>Zij</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {spel.rondes.map((r, i) => {
              const maker = troefmaker(spel, i)
              const u = uitslagen[i]
              return (
                <tr key={i} className={u?.nat ? 'kj-nat-rij' : ''}>
                  <td className="km-num">{i + 1}</td>
                  <td><span className={`kj-maker kj-maker-${maker}`}>{maker}</span></td>
                  <td><input inputMode="numeric" value={r.wijPunten ?? ''} onChange={(e) => zetPunten(i, 'wij', e.target.value)} placeholder="–" /></td>
                  <td><input inputMode="numeric" value={r.wijRoem || ''} onChange={(e) => zetRoem(i, 'wij', e.target.value)} placeholder="0" /></td>
                  <td><input inputMode="numeric" value={r.zijPunten ?? ''} onChange={(e) => zetPunten(i, 'zij', e.target.value)} placeholder="–" /></td>
                  <td><input inputMode="numeric" value={r.zijRoem || ''} onChange={(e) => zetRoem(i, 'zij', e.target.value)} placeholder="0" /></td>
                  <td className="km-num">{u ? u.wij : ''}</td>
                  <td className="km-num">{u ? u.zij : ''}</td>
                  <td className="kj-badges">
                    {u?.nat && <span className="kj-badge kj-badge-nat">nat</span>}
                    {u?.pit && <span className="kj-badge kj-badge-pit">pit {u.pit}</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6}><strong>Totaal</strong></td>
              <td className="km-num kj-totaal">{totaalWij}</td>
              <td className="km-num kj-totaal">{totaalZij}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {klaar && (
        <p className="kj-winnaar">
          {totaalWij === totaalZij ? 'Gelijkspel!' : totaalWij > totaalZij ? `Wij winnen met ${totaalWij} tegen ${totaalZij}!` : `Zij winnen met ${totaalZij} tegen ${totaalWij}.`}
        </p>
      )}
    </div>
  )
}
