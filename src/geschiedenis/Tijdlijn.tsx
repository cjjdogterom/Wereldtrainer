import { useMemo, useState } from 'react'
import Volgorde from '../leer/Volgorde'
import { shuffle } from '../leer/match'
import { GESORTEERD, PERIODES, jaarLabel, type HistItem } from './data'
import './tijdlijn.css'

const STARTJAREN = PERIODES.map((p) => Number(p.match(/\((\d{4})/)?.[1] ?? 0))

// Een doorlopende tijdlijn: per eeuw een markering, per tijdvak een kleur.
export function Tijdlijn() {
  const [open, setOpen] = useState<string | null>(null)
  const [filter, setFilter] = useState<'alles' | 'gebeurtenis' | 'persoon'>('alles')
  const items = GESORTEERD.filter((h) => filter === 'alles' || h.soort === filter)
  let vorigeEeuw = -1
  let verstePeriode = -1
  return (
    <div className="tl">
      <div className="tl-filter" role="tablist">
        {(['alles', 'gebeurtenis', 'persoon'] as const).map((f) => (
          <button key={f} type="button" role="tab" aria-selected={filter === f} className={filter === f ? 'aan' : ''} onClick={() => setFilter(f)}>
            {f === 'alles' ? 'Alles' : f === 'gebeurtenis' ? 'Gebeurtenissen' : 'Personen'}
          </button>
        ))}
      </div>
      <ol className="tl-lijn">
        {items.map((h, i) => {
          const eeuw = Math.floor(h.jaar / 100)
          const toonEeuw = eeuw !== vorigeEeuw
          vorigeEeuw = eeuw
          // het tijdvak aankondigen zodra de tijdlijn het startjaar ervan passeert
          let pIdx = verstePeriode
          while (pIdx + 1 < STARTJAREN.length && h.jaar >= STARTJAREN[pIdx + 1]) pIdx += 1
          const toonPeriode = pIdx > verstePeriode
          verstePeriode = pIdx
          const sleutel = `${h.jaar}-${i}`
          const kleur = `tl-p${PERIODES.indexOf(h.periode) % 8}`
          return (
            <li key={sleutel} className={`tl-item ${kleur}`}>
              {toonPeriode && <div className="tl-periode">{PERIODES[pIdx]}</div>}
              {toonEeuw && <div className="tl-eeuw">{eeuw * 100}</div>}
              <button type="button" className={`tl-punt${open === sleutel ? ' open' : ''}`} onClick={() => setOpen(open === sleutel ? null : sleutel)}>
                <span className="tl-jaar tabular">{jaarLabel(h)}</span>
                <span className={`tl-stip ${h.soort}`} aria-hidden="true" />
                <span className="tl-titel">{h.titel}</span>
              </button>
              {open === sleutel && <p className="tl-uitleg">{h.uitleg}</p>}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// Vijf gebeurtenissen uit verschillende eeuwen op volgorde leggen.
export function OpVolgorde() {
  const gebeurtenissen = useMemo(() => GESORTEERD.filter((h) => h.soort === 'gebeurtenis'), [])
  return (
    <Volgorde
      opdracht="Leg deze vijf gebeurtenissen op volgorde."
      begin="vroegst"
      eind="laatst"
      maak={() => {
        const gekozen: HistItem[] = []
        for (const h of shuffle(gebeurtenissen)) {
          if (gekozen.every((x) => Math.abs(x.jaar - h.jaar) >= 15)) gekozen.push(h)
          if (gekozen.length === 5) break
        }
        return gekozen
          .sort((a, b) => a.jaar - b.jaar)
          .map((h) => ({ id: h.titel, inhoud: <span>{h.titel}</span>, label: h.titel, detail: jaarLabel(h) }))
      }}
    />
  )
}
