import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BookOpen, Check, X } from 'lucide-react'
import { MODULE_BY_ID } from '../modules'
import { herhaal, herhaalLijst } from './geheugen'
import KaartView, { BeeldView } from './KaartView'
import { laadLeerlijn } from './leerstof'
import { HERHALEN, STAMP_MODULES } from './rooster'
import { useGeheugen } from './useLeer'
import type { Eenheid, Toets } from './types'
import './les.css'

type Vraag = Toets & { m: string; eenheid: Eenheid }

// Hoeveel items er vandaag terug moeten komen (voor het dagoverzicht).
export function useHerhaalAantal() {
  const { g, vandaag } = useGeheugen()
  return herhaalLijst(g, STAMP_MODULES, vandaag).length
}

// De gemengde herhaalronde: één vraag per item, door alle stampvakken heen.
export default function Herhalen({ onKlaar }: { onKlaar: () => void }) {
  const { g, vandaag, wijzig, markeer } = useGeheugen()
  // De lijst één keer vastleggen; antwoorden veranderen het geheugen wel.
  const [lijst] = useState(() => herhaalLijst(g, STAMP_MODULES, vandaag))
  const [lijnen, setLijnen] = useState<Record<string, Eenheid[]>>({})
  const [i, setI] = useState(0)
  const [keuze, setKeuze] = useState<number | null>(null)
  const [score, setScore] = useState<{ goed: number; gemist: Vraag[] }>({ goed: 0, gemist: [] })
  const [kaartOpen, setKaartOpen] = useState(false)

  useEffect(() => {
    const vakken = [...new Set(lijst.map((x) => x.m))]
    Promise.all(vakken.map((m) => laadLeerlijn(m).then((e) => [m, e] as const))).then((r) => setLijnen(Object.fromEntries(r)))
  }, [lijst])

  const vragen = useMemo<Vraag[]>(() => {
    if (lijst.some((x) => !lijnen[x.m])) return []
    return lijst.flatMap(({ m, id }) => {
      const alle = lijnen[m]
      const e = alle.find((x) => x.id === id)
      if (!e) return []
      const ts = e.toetsen(alle)
      if (!ts.length) return []
      return [{ ...ts[Math.floor(Math.random() * ts.length)], m, eenheid: e }]
    })
  }, [lijst, lijnen])

  const leeg = lijst.length === 0
  useEffect(() => {
    if (leeg) markeer(HERHALEN)
  }, [leeg, markeer])

  if (leeg) {
    return (
      <section className="ls2-intro hh">
        <p className="ls2-eyebrow">Herhalen</p>
        <h2>Niets te herhalen vandaag</h2>
        <p>Alles wat je kent zit nog goed in je geheugen. Door naar de nieuwe stof.</p>
        <button type="button" className="ls2-knop groot" onClick={onKlaar}>
          Verder <ArrowRight size={18} />
        </button>
      </section>
    )
  }

  if (!vragen.length) return <div className="ls2-laden">Herhaling wordt klaargezet…</div>

  if (i >= vragen.length) {
    return (
      <section className="ls2-uitslag hh">
        <p className="ls2-eyebrow">Herhalen klaar</p>
        <h2>
          {score.goed} van {vragen.length} nog paraat
        </h2>
        {score.gemist.length > 0 ? (
          <>
            <p>Deze komen morgen terug:</p>
            <ul className="ls2-resultaten">
              {score.gemist.map((v) => (
                <li key={v.m + v.eenheid.id} className="fout">
                  <X size={16} />
                  <span>{v.eenheid.naam}</span>
                  <small>{MODULE_BY_ID[v.m]?.title}</small>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Alles goed. Wat je kent komt pas over een tijdje weer terug.</p>
        )}
        <div className="ls2-knoppen">
          <button type="button" className="ls2-knop groot" onClick={onKlaar}>
            Verder naar nieuwe stof <ArrowRight size={18} />
          </button>
        </div>
      </section>
    )
  }

  const v = vragen[i]
  const mod = MODULE_BY_ID[v.m]
  return (
    <section className="ls2-toets hh" style={{ '--mk': mod?.accent } as React.CSSProperties}>
      <p className="ls2-eyebrow tabular hh-kop">
        <span className="hh-vak">
          {mod?.icon} {mod?.title}
        </span>
        <span>
          {i + 1} / {vragen.length}
        </span>
      </p>
      <div className="hh-balk">
        <i style={{ width: `${(i / vragen.length) * 100}%` }} />
      </div>
      {v.beeld && <BeeldView beeld={v.beeld} />}
      <h2 className="ls2-vraag">{v.vraag}</h2>
      <div className="ls2-opties">
        {v.opties.map((o, j) => {
          const cls = keuze === null ? '' : j === v.goed ? 'goed' : j === keuze ? 'fout' : 'uit'
          return (
            <button
              key={o + j}
              type="button"
              className={cls}
              disabled={keuze !== null}
              onClick={() => {
                const goed = j === v.goed
                setKeuze(j)
                setScore((s) => (goed ? { ...s, goed: s.goed + 1 } : { ...s, gemist: [...s.gemist, v] }))
                wijzig(v.m, herhaal(g.modules[v.m], v.eenheid.id, goed, vandaag))
              }}
            >
              {j === v.goed && keuze !== null ? <Check size={16} /> : j === keuze ? <X size={16} /> : null}
              {o}
            </button>
          )
        })}
      </div>
      {keuze !== null && (
        <div className={`ls2-feedback ${keuze === v.goed ? 'goed' : 'fout'}`}>
          <p className="ls2-oordeel">{keuze === v.goed ? 'Goed, zit er nog in!' : `Het juiste antwoord: ${v.opties[v.goed]}`}</p>
          {v.uitleg && <p>{v.uitleg}</p>}
          {keuze !== v.goed && v.eenheid.kaarten[0] && (
            <button type="button" className="ls2-knop stil" onClick={() => setKaartOpen(!kaartOpen)}>
              <BookOpen size={16} /> {kaartOpen ? 'Verberg de leerkaart' : 'Bekijk de leerkaart'}
            </button>
          )}
          {kaartOpen && <KaartView kaart={v.eenheid.kaarten[0]} />}
          <button
            type="button"
            className="ls2-knop"
            onClick={() => {
              setI(i + 1)
              setKeuze(null)
              setKaartOpen(false)
              if (i + 1 >= vragen.length) markeer(HERHALEN)
              window.scrollTo({ top: 0 })
            }}
          >
            {i < vragen.length - 1 ? 'Volgende' : 'Klaar'} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </section>
  )
}
