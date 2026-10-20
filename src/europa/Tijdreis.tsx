import { useMemo, useState } from 'react'
import { MACHTEN } from './data'
import { KAARTEN } from './kaarten'
import './tijdreis.css'

const JAAR_UIT_TITEL: Record<string, number> = { 'eu-uitbreiding.png': 2004, 'koude-oorlog.png': 1965 }

function kaartJaar(file: string, titel: string): number {
  if (JAAR_UIT_TITEL[file]) return JAAR_UIT_TITEL[file]
  const m = titel.match(/\((\d{2,4})/)
  return m ? Number(m[1]) : 0
}

function jaarTekst(j: number): string {
  return j < 0 ? `${-j} v.Chr.` : `${j}`
}

// Schuif door 4000 jaar: wie kwam er net op, en hoe zag de kaart eruit?
export default function Tijdreis() {
  const [jaar, setJaar] = useState(1519)
  const machten = useMemo(() => [...MACHTEN].sort((a, b) => a.start - b.start), [])
  const kaarten = useMemo(() => KAARTEN.map((k) => ({ ...k, jaar: kaartJaar(k.file, k.titel) })), [])

  const recent = machten.filter((m) => m.start <= jaar).slice(-4).reverse()
  const kaart = kaarten.reduce<(typeof kaarten)[number] | null>((beste, k) => {
    if (k.jaar > jaar + 30) return beste
    if (!beste || Math.abs(k.jaar - jaar) < Math.abs(beste.jaar - jaar)) return k
    return beste
  }, null)
  const toonKaart = kaart && jaar - kaart.jaar < 250

  return (
    <div className="tr">
      <div className="tr-jaar" aria-live="polite">
        <span className="tr-jaar-getal tabular">{jaarTekst(jaar)}</span>
        <span className="tr-jaar-tijdvak">{recent[0]?.tijdvak ?? 'Oudheid (vóór Rome)'}</span>
      </div>
      <input
        className="tr-schuif"
        type="range"
        min={-2000}
        max={2025}
        step={5}
        value={jaar}
        onChange={(e) => setJaar(Number(e.target.value))}
        aria-label="Kies een jaar"
      />
      <div className="tr-markeringen" aria-hidden="true">
        {[-2000, -1000, 0, 500, 1000, 1500, 2000].map((j) => (
          <button key={j} type="button" style={{ left: `${((j + 2000) / 4025) * 100}%` }} onClick={() => setJaar(j)}>
            {j < 0 ? `${-j} v.C.` : j}
          </button>
        ))}
      </div>

      <div className="tr-inhoud">
        <section>
          <h3>Machten die tot dit jaar opkwamen</h3>
          <ol className="tr-machten">
            {recent.map((m, i) => (
              <li key={m.id} className={i === 0 ? 'nieuwst' : ''}>
                <span className="tr-m-jaar tabular">{m.periode}</span>
                <strong>{m.macht}</strong>
                <span className="tr-m-gebied">{m.gebied}</span>
                {i === 0 && <p>{m.uitleg}</p>}
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h3>De kaart van dat moment</h3>
          {toonKaart ? (
            <figure className="tr-kaart">
              <img src={`/europa/${kaart!.file}`} alt={kaart!.titel} loading="lazy" />
              <figcaption>
                <strong>{kaart!.titel}</strong> {kaart!.uitleg}
              </figcaption>
            </figure>
          ) : (
            <p className="tr-geen">Voor deze tijd is er geen historische kaart. Schuif naar 117 (Rome) of later.</p>
          )}
        </section>
      </div>
    </div>
  )
}
