import { useEffect, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { shuffle } from '../leer/match'
import { KNOPEN } from './data'

type Kaart = { sleutel: string; knoop: string; soort: 'foto' | 'naam' }

const PAREN = 6

// Memory: zoek bij elke foto de juiste naam.
export default function Memory() {
  const [spel, setSpel] = useState(0)
  const kaarten = useMemo<Kaart[]>(() => {
    const gekozen = shuffle(KNOPEN).slice(0, PAREN)
    return shuffle(gekozen.flatMap((k) => [
      { sleutel: `${k.id}-f`, knoop: k.id, soort: 'foto' as const },
      { sleutel: `${k.id}-n`, knoop: k.id, soort: 'naam' as const },
    ]))
  }, [spel])
  const [open, setOpen] = useState<string[]>([])
  const [gevonden, setGevonden] = useState<string[]>([])
  const [zetten, setZetten] = useState(0)
  const perId = useMemo(() => new Map(KNOPEN.map((k) => [k.id, k])), [])

  useEffect(() => {
    if (open.length !== 2) return
    const [a, b] = open.map((s) => kaarten.find((k) => k.sleutel === s)!)
    const t = window.setTimeout(
      () => {
        if (a.knoop === b.knoop && a.soort !== b.soort) setGevonden((g) => [...g, a.knoop])
        setOpen([])
      },
      a.knoop === b.knoop ? 450 : 1100,
    )
    return () => window.clearTimeout(t)
  }, [open, kaarten])

  function draai(s: string) {
    if (open.length === 2 || open.includes(s)) return
    const k = kaarten.find((x) => x.sleutel === s)!
    if (gevonden.includes(k.knoop)) return
    if (open.length === 1) setZetten((z) => z + 1)
    setOpen([...open, s])
  }

  const klaar = gevonden.length === PAREN
  const laatste = gevonden.length ? perId.get(gevonden[gevonden.length - 1]) : undefined

  return (
    <div className="kn-memory">
      <div className="kn-memory-kop">
        <p>Zoek bij elke knoop de juiste naam.</p>
        <span className="tabular">
          {gevonden.length}/{PAREN} paren · {zetten} zetten
        </span>
      </div>
      <div className="kn-memory-veld">
        {kaarten.map((k) => {
          const zichtbaar = open.includes(k.sleutel) || gevonden.includes(k.knoop)
          const knoop = perId.get(k.knoop)!
          return (
            <button
              key={k.sleutel}
              type="button"
              className={`kn-mem-kaart${zichtbaar ? ' open' : ''}${gevonden.includes(k.knoop) ? ' gevonden' : ''}`}
              onClick={() => draai(k.sleutel)}
              aria-label={zichtbaar ? (k.soort === 'naam' ? knoop.naam : `Foto van een knoop`) : 'Omgedraaide kaart'}
            >
              <span className="kn-mem-rug" aria-hidden="true" />
              <span className="kn-mem-voor">{k.soort === 'foto' ? <img src={knoop.afbeelding} alt="" /> : <span className="kn-mem-naam">{knoop.naam}</span>}</span>
            </button>
          )
        })}
      </div>
      {laatste && !klaar && (
        <p className="kn-mem-laatst">
          <strong>{laatste.naam}</strong>: {laatste.doel}
        </p>
      )}
      {klaar && (
        <div className="kn-mem-klaar">
          <p>
            Alle paren gevonden in {zetten} zetten{zetten <= PAREN + 2 ? ' — uitstekend geheugen.' : '.'}
          </p>
          <button
            type="button"
            className="km-btn km-btn-primary"
            onClick={() => {
              setSpel(spel + 1)
              setOpen([])
              setGevonden([])
              setZetten(0)
            }}
          >
            <RotateCcw size={16} /> Nieuw spel
          </button>
        </div>
      )}
    </div>
  )
}
