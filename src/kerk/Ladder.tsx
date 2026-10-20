import Volgorde from '../leer/Volgorde'
import { shuffle } from '../leer/match'
import { LADDER } from './data'

// Bouw de gezagsladder: vijf posities van hoog naar laag.
export default function Ladder() {
  const metRang = LADDER.filter((p) => p.rang !== undefined)
  return (
    <Volgorde
      opdracht="Bouw de ladder: zet deze posities van hoog naar laag."
      begin="hoogst"
      eind="laagst"
      maak={() => {
        const gekozen = shuffle(metRang)
          .filter((p, i, arr) => arr.findIndex((x) => x.rang === p.rang) === i)
          .slice(0, 5)
          .sort((a, b) => (a.rang ?? 0) - (b.rang ?? 0))
        return gekozen.map((p) => ({
          id: p.id,
          inhoud: (
            <span className="kerk-sport">
              {p.wapen && <img src={`/kerk/${p.wapen}`} alt="" />}
              <span>{p.naam}</span>
            </span>
          ),
          label: p.naam,
        }))
      }}
    />
  )
}
