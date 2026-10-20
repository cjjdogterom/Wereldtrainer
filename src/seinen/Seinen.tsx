import { useMemo, useState, type FormEvent } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { shuffle } from '../leer/match'
import SeinVlag from './Vlag'
import { SEINEN } from './data'

const PER_LETTER = new Map(SEINEN.map((s) => [s.letter, s]))

const WOORDEN = ['HAVEN', 'ANKER', 'BOEG', 'ROER', 'MAST', 'ZEIL', 'KADE', 'SLUIS', 'BAKEN', 'KOMPAS', 'LOODS', 'BOEI', 'KIEL', 'TOUW', 'VLAG', 'STORM', 'VLOED', 'KOERS', 'GIEK', 'FOK', 'SCHOT', 'PIER', 'DUIN', 'WIND', 'GOLF', 'KAAP', 'STUUR', 'BOOT', 'VAREN', 'ZEE']

function Hoist({ woord, klein }: { woord: string; klein?: boolean }) {
  const letters = woord.toUpperCase().replace(/[^A-Z]/g, '').split('')
  return (
    <div className={`sn-hoist${klein ? ' klein' : ''}`}>
      {letters.map((l, i) => (
        <div key={`${l}-${i}`} className="sn-hoist-vlag">
          <SeinVlag letter={l} size={klein ? 64 : 78} />
          {!klein && (
            <>
              <span className="sn-hoist-letter">{l}</span>
              <span className="sn-hoist-navo">{PER_LETTER.get(l)?.navo}</span>
              <span className="sn-hoist-morse">{PER_LETTER.get(l)?.morse}</span>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

// Typ een woord en zie het als vlaggenlijn, met spelalfabet en morse.
export function Seinen() {
  const [tekst, setTekst] = useState('HAVEN')
  const schoon = tekst.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 12)
  return (
    <div className="sn-seinen">
      <label className="sn-invoer">
        <span>Typ een woord (max. 12 letters)</span>
        <input value={tekst} onChange={(e) => setTekst(e.target.value)} maxLength={20} autoCapitalize="characters" spellCheck={false} />
      </label>
      {schoon ? <Hoist woord={schoon} /> : <p className="sn-leeg">Typ letters A–Z.</p>}
      {schoon && (
        <p className="sn-uitspraak">
          Over de marifoon: <strong>{schoon.split('').map((l) => PER_LETTER.get(l)?.navo).join(' – ')}</strong>
        </p>
      )}
    </div>
  )
}

// Lees de vlaggen: welk woord hangt er in de mast?
export function LeesVlaggen() {
  const [ronde, setRonde] = useState(0)
  const woord = useMemo(() => shuffle(WOORDEN)[0], [ronde])
  const [invoer, setInvoer] = useState('')
  const [uitslag, setUitslag] = useState<boolean | null>(null)
  const [score, setScore] = useState({ goed: 0, totaal: 0 })

  function controleer(e: FormEvent) {
    e.preventDefault()
    if (uitslag !== null) return
    const ok = invoer.toUpperCase().replace(/[^A-Z]/g, '') === woord
    setUitslag(ok)
    setScore((s) => ({ goed: s.goed + (ok ? 1 : 0), totaal: s.totaal + 1 }))
  }

  return (
    <div className="sn-lees">
      <div className="sn-lees-kop">
        <p>Welk woord hangt er in de mast?</p>
        {score.totaal > 0 && (
          <span className="tabular">
            {score.goed} van {score.totaal} goed
          </span>
        )}
      </div>
      <div className="sn-mast">
        <Hoist woord={woord} klein />
      </div>
      <form className="sn-lees-form" onSubmit={controleer}>
        <input
          value={invoer}
          onChange={(e) => setInvoer(e.target.value)}
          placeholder="Typ het woord"
          autoCapitalize="characters"
          spellCheck={false}
          disabled={uitslag !== null}
          className={uitslag === null ? '' : uitslag ? 'goed' : 'fout'}
        />
        {uitslag === null ? (
          <button type="submit" className="km-btn km-btn-primary">
            Controleer
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
        <div className={`sn-lees-uitslag ${uitslag ? 'goed' : 'fout'}`}>
          {uitslag ? <Check size={18} /> : <X size={18} />}
          <span>
            {uitslag ? 'Goed gelezen!' : 'Het woord was'} <strong>{woord}</strong>:{' '}
            {woord
              .split('')
              .map((l) => `${l} (${PER_LETTER.get(l)?.navo})`)
              .join(', ')}
          </span>
        </div>
      )}
    </div>
  )
}
