import { useMemo, useRef, useState } from 'react'
import { Check, Image as ImageIcon, Play, RotateCcw, Type, X } from 'lucide-react'
import { shuffle } from '../leer/match'
import { VOGELS, type Vogel } from './data'

const RONDES = 8
const MET_ALLES = VOGELS.filter((v) => v.foto && v.geluidUrl)

function verberg(t: string, naam: string) {
  return t.replace(new RegExp(naam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '…')
}

// Raad de vogel: eerst alleen het geluid, dan het uiterlijk, dan de foto.
// Hoe minder hints je nodig hebt, hoe meer punten.
export default function Hints() {
  const [spel, setSpel] = useState(0)
  const reeks = useMemo(() => shuffle(MET_ALLES).slice(0, RONDES), [spel])
  const [ronde, setRonde] = useState(0)
  const [hints, setHints] = useState(1)
  const [keuze, setKeuze] = useState<string | null>(null)
  const [punten, setPunten] = useState(0)
  const audio = useRef<HTMLAudioElement>(null)
  const v = reeks[ronde] as Vogel | undefined

  const opties = useMemo(() => {
    if (!v) return []
    const zelfde = VOGELS.filter((x) => x.id !== v.id && x.categorie === v.categorie)
    const anders = VOGELS.filter((x) => x.id !== v.id && x.categorie !== v.categorie)
    return shuffle([v, ...shuffle(zelfde).slice(0, 2), ...shuffle(anders).slice(0, 1)])
  }, [v])

  if (!v)
    return (
      <div className="vg-hints vg-hints-klaar">
        <h2>
          {punten} van {RONDES * 3} punten
        </h2>
        <p>{punten >= RONDES * 2 ? 'Je herkent ze al aan het geluid — knap.' : 'Luister vaker naar de geluiden bij Leren; die zijn het lastigst.'}</p>
        <button
          type="button"
          className="km-btn km-btn-primary"
          onClick={() => {
            setSpel(spel + 1)
            setRonde(0)
            setHints(1)
            setKeuze(null)
            setPunten(0)
          }}
        >
          <RotateCcw size={16} /> Nog een spel
        </button>
      </div>
    )

  const geraden = keuze !== null
  const goed = keuze === v.id

  return (
    <div className="vg-hints">
      <p className="vg-hints-teller tabular">
        Vogel {ronde + 1} van {RONDES} · {punten} punten
      </p>

      <div className="vg-hint">
        <span className="vg-hint-nr">Hint 1 · geluid</span>
        <audio ref={audio} src={v.geluidUrl} preload="none" />
        <button type="button" className="vg-speel" onClick={() => audio.current?.play()}>
          <Play size={18} /> Speel het geluid af
        </button>
        <p className="vg-hint-tekst">{verberg(v.geluid, v.naam)}</p>
      </div>

      {hints >= 2 || geraden ? (
        <div className="vg-hint">
          <span className="vg-hint-nr">Hint 2 · uiterlijk</span>
          <p className="vg-hint-tekst">{verberg(v.uiterlijk, v.naam)}</p>
        </div>
      ) : null}

      {hints >= 3 || geraden ? (
        <div className="vg-hint">
          <span className="vg-hint-nr">Hint 3 · foto</span>
          <img className="vg-hint-foto" src={`/vogels/${v.foto}`} alt="Welke vogel?" />
        </div>
      ) : null}

      {!geraden && hints < 3 && (
        <button type="button" className="vg-meer" onClick={() => setHints(hints + 1)}>
          {hints === 1 ? <Type size={16} /> : <ImageIcon size={16} />} Nog een hint (−1 punt)
        </button>
      )}

      <div className="vg-hint-opties">
        {opties.map((o) => (
          <button
            key={o.id}
            type="button"
            disabled={geraden}
            className={!geraden ? '' : o.id === v.id ? 'goed' : o.id === keuze ? 'fout' : 'uit'}
            onClick={() => {
              setKeuze(o.id)
              if (o.id === v.id) setPunten(punten + (4 - hints))
            }}
          >
            {geraden && o.id === v.id && <Check size={16} />}
            {geraden && o.id === keuze && o.id !== v.id && <X size={16} />}
            {o.naam}
          </button>
        ))}
      </div>

      {geraden && (
        <div className={`vg-hint-uitslag ${goed ? 'goed' : 'fout'}`}>
          <p>
            {goed ? `Goed, +${4 - hints} punt${4 - hints === 1 ? '' : 'en'}.` : `Het was de ${v.naam.toLowerCase()}.`} <i>{v.latijn}</i>
          </p>
          <button
            type="button"
            className="km-btn km-btn-primary"
            onClick={() => {
              setRonde(ronde + 1)
              setHints(1)
              setKeuze(null)
            }}
          >
            Volgende vogel
          </button>
        </div>
      )}
    </div>
  )
}
