import Volgorde from '../leer/Volgorde'
import { shuffle } from '../leer/match'
import { ONDERDELEN } from './data'
import { INSIGNES } from './insignes'

// Leg de onderscheidingstekens van één onderdeel van hoog naar laag.
export default function Sorteren({ onderdeelId }: { onderdeelId: string }) {
  const o = ONDERDELEN.find((x) => x.id === onderdeelId) ?? ONDERDELEN[0]
  return (
    <div className="rg-sorteren">
      <Volgorde
        key={o.id}
        opdracht={`${o.naam}: zet deze rangen van hoog naar laag.`}
        begin="hoogst"
        eind="laagst"
        maak={() => {
          const idx = shuffle(o.rangen.map((_, i) => i))
            .slice(0, Math.min(5, o.rangen.length))
            .sort((a, b) => a - b)
          return idx.map((i) => {
            const r = o.rangen[i]
            const file = INSIGNES[`${o.id}|${r.naam}`]
            return {
              id: r.naam,
              inhoud: (
                <span className="rg-sorteer-item">
                  {file && <img src={`/rangen/${file}`} alt="" />}
                  <span>{r.naam}</span>
                </span>
              ),
              label: r.naam,
              detail: r.cluster,
            }
          })
        }}
      />
    </div>
  )
}
