import { useMemo, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from 'lucide-react'
import { MODULE_BY_ID } from '../modules'
import { planLes, verwerkUitslag, type DagLes } from './geheugen'
import KaartView, { BeeldView } from './KaartView'
import { useGeheugen, useLesPlan } from './useLeer'
import type { Eenheid, Kaart, Toets } from './types'
import './les.css'

type Fase = 'intro' | 'leren' | 'toets' | 'uitslag'
type Vraag = Toets & { eenheid: string }

function schud<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Les() {
  const { moduleId = '' } = useParams()
  const m = MODULE_BY_ID[moduleId]
  const { g, vandaag, wijzig } = useGeheugen()
  const { leerstof, eenheden, les, voortgang } = useLesPlan(moduleId, g, vandaag, wijzig)
  const [fase, setFase] = useState<Fase>('intro')
  const [kaartIdx, setKaartIdx] = useState(0)
  const [vragen, setVragen] = useState<Vraag[]>([])
  const [vIdx, setVIdx] = useState(0)
  const [keuze, setKeuze] = useState<number | null>(null)
  const [antwoorden, setAntwoorden] = useState<Record<number, boolean>>({})
  const [oefenen, setOefenen] = useState(false) // opnieuw doen zonder het geheugen te wijzigen

  const perId = useMemo(() => new Map((eenheden ?? []).map((e) => [e.id, e])), [eenheden])
  const stand = g.modules[moduleId]

  if (!m || !leerstof) {
    return (
      <div className="ls2">
        <p>Dit onderwerp heeft (nog) geen dagles.</p>
        <Link to="/vandaag">Terug</Link>
      </div>
    )
  }

  const nieuwE = (les?.nieuw ?? []).map((id) => perId.get(id)).filter(Boolean) as Eenheid[]
  const herhaalE = (les?.herhaal ?? []).map((id) => perId.get(id)).filter(Boolean) as Eenheid[]
  // Kaarten tonen voor nieuwe stof en voor wat je de vorige keer niet kende.
  const teLeren = [...nieuwE, ...herhaalE.filter((e) => (stand?.items[e.id]?.box ?? 0) === 0)]
  const kaarten: { e: Eenheid; k: Kaart }[] = teLeren.flatMap((e) => e.kaarten.map((k) => ({ e, k })))
  const klaar = les?.klaar && !oefenen

  function startToets() {
    const alle = eenheden ?? []
    const vs = [...nieuwE, ...herhaalE].flatMap((e) => e.toetsen(alle).map((t) => ({ ...t, eenheid: e.id })))
    setVragen(schud(vs))
    setVIdx(0)
    setKeuze(null)
    setAntwoorden({})
    setFase('toets')
  }

  function begin() {
    setOefenen(!!les?.klaar)
    if (kaarten.length) {
      setKaartIdx(0)
      setFase('leren')
    } else startToets()
  }

  function rondAf(goedPer: Record<number, boolean>) {
    if (!les) return
    const ids = [...les.nieuw, ...les.herhaal]
    const gehaald: string[] = []
    const gemist: string[] = []
    for (const id of ids) {
      const mijn = vragen.map((v, i) => ({ v, i })).filter((x) => x.v.eenheid === id)
      const goed = mijn.filter((x) => goedPer[x.i]).length
      if (mijn.length && goed / mijn.length >= 0.75) gehaald.push(id)
      else gemist.push(id)
    }
    const totaalGoed = Object.values(goedPer).filter(Boolean).length
    if (!oefenen) wijzig(moduleId, verwerkUitslag(stand, les, gehaald, gemist, vandaag, totaalGoed, vragen.length), true)
    setFase('uitslag')
  }

  function extraLes() {
    if (!eenheden || !leerstof) return
    const zonderVandaag = stand ? { ...stand, les: undefined } : undefined
    const nieuw: DagLes = planLes(eenheden, zonderVandaag, vandaag, leerstof.perDag, 0, !!leerstof.stapsgewijs)
    wijzig(moduleId, { items: stand?.items ?? {}, les: nieuw })
    setOefenen(false)
    setFase('intro')
  }

  const stijl = { '--mk': m.accent } as CSSProperties

  return (
    <div className="ls2" style={stijl}>
      <header className={`ls2-kop lade-${m.id}`}>
        <div className="ls2-kop-binnen">
          <Link to="/vandaag" className="ls2-terug">
            <ArrowLeft size={16} /> Vandaag
          </Link>
          <h1>
            {m.icon} {m.title}
          </h1>
          {voortgang && (
            <div className="ls2-voortgang" aria-label={`${voortgang.gekend} van ${voortgang.totaal} ${leerstof.meervoud} gekend`}>
              <div className="ls2-balk">
                <i className="gekend" style={{ width: `${(voortgang.gekend / Math.max(voortgang.totaal, 1)) * 100}%` }} />
                <i className="bezig" style={{ width: `${(voortgang.bezig / Math.max(voortgang.totaal, 1)) * 100}%` }} />
              </div>
              <span className="tabular">
                {voortgang.gekend} van {voortgang.totaal} {leerstof.meervoud} gekend
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="ls2-main">
        {!les && <div className="ls2-laden">Les wordt klaargezet…</div>}

        {les && fase === 'intro' && (
          <section className="ls2-intro">
            {klaar ? (
              <>
                <p className="ls2-eyebrow">Les van vandaag — klaar</p>
                <h2>
                  {les.klaar!.goed} van {les.klaar!.totaal} goed
                </h2>
                <p>Wat je nog niet kende komt morgen terug. Je kunt de les nog eens doorlopen of alvast verder.</p>
                <div className="ls2-knoppen">
                  <button type="button" className="ls2-knop" onClick={begin}>
                    <RotateCcw size={16} /> Nog eens doorlopen
                  </button>
                  {eenheden && eenheden.some((e) => !stand?.items[e.id] && !les.nieuw.includes(e.id)) && (
                    <button type="button" className="ls2-knop stil" onClick={extraLes}>
                      Extra les: volgende {leerstof.perDag > 1 ? leerstof.meervoud : leerstof.enkelvoud} <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </>
            ) : nieuwE.length === 0 && herhaalE.length === 0 ? (
              <>
                <p className="ls2-eyebrow">Niets op de planning</p>
                <h2>{eenheden && voortgang && voortgang.gekend + voortgang.bezig >= eenheden.length ? 'Alles gehad!' : 'Morgen gaat het verder'}</h2>
                <p>
                  {leerstof.stapsgewijs
                    ? 'De vorige les komt morgen terug. Pas als je die haalt, ga je door naar de volgende.'
                    : 'Er is vandaag niets nieuws of te herhalen.'}
                </p>
              </>
            ) : (
              <>
                <p className="ls2-eyebrow">Les van vandaag</p>
                <h2>
                  {nieuwE.length > 0 && `${nieuwE.length} ${nieuwE.length === 1 ? (leerstof.perDag === 1 ? 'nieuwe les' : `nieuw ${leerstof.enkelvoud}`) : `nieuwe ${leerstof.meervoud}`}`}
                  {nieuwE.length > 0 && herhaalE.length > 0 && ' en '}
                  {herhaalE.length > 0 && `${herhaalE.length} herhaling${herhaalE.length === 1 ? '' : 'en'}`}
                </h2>
                {nieuwE.length > 0 && (
                  <div className="ls2-lijstje">
                    <h3>Nieuw — {nieuwE[0].hoofdstuk}</h3>
                    <ul>
                      {nieuwE.map((e) => (
                        <li key={e.id}>{e.naam}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {herhaalE.length > 0 && (
                  <div className="ls2-lijstje">
                    <h3>Herhalen</h3>
                    <ul>
                      {herhaalE.map((e) => (
                        <li key={e.id}>
                          {e.naam}
                          {(stand?.items[e.id]?.box ?? 0) === 0 && <span className="ls2-label">opnieuw leren</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="ls2-uitleg">
                  {kaarten.length > 0
                    ? `Eerst ${kaarten.length} leerkaart${kaarten.length === 1 ? '' : 'en'}, daarna een korte overhoring.`
                    : 'Alleen een korte overhoring van wat je al geleerd hebt.'}
                </p>
                <button type="button" className="ls2-knop groot" onClick={begin}>
                  Begin <ArrowRight size={18} />
                </button>
              </>
            )}
          </section>
        )}

        {les && fase === 'leren' && kaarten[kaartIdx] && (
          <section className="ls2-leren">
            <div className="ls2-stappen" aria-label={`Kaart ${kaartIdx + 1} van ${kaarten.length}`}>
              {kaarten.map((_, i) => (
                <span key={i} className={i < kaartIdx ? 'af' : i === kaartIdx ? 'nu' : ''} />
              ))}
            </div>
            <KaartView key={kaartIdx} kaart={kaarten[kaartIdx].k} />
            <div className="ls2-navigatie">
              <button type="button" className="ls2-knop stil" disabled={kaartIdx === 0} onClick={() => setKaartIdx(kaartIdx - 1)}>
                <ArrowLeft size={16} /> Vorige
              </button>
              {kaartIdx < kaarten.length - 1 ? (
                <button type="button" className="ls2-knop" onClick={() => { setKaartIdx(kaartIdx + 1); window.scrollTo({ top: 0 }) }}>
                  Volgende <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" className="ls2-knop" onClick={() => { startToets(); window.scrollTo({ top: 0 }) }}>
                  Naar de overhoring <ArrowRight size={16} />
                </button>
              )}
            </div>
          </section>
        )}

        {les && fase === 'toets' && vragen[vIdx] && (
          <section className="ls2-toets">
            <p className="ls2-eyebrow tabular">
              Overhoring · vraag {vIdx + 1} van {vragen.length}
            </p>
            {vragen[vIdx].beeld && <BeeldView beeld={vragen[vIdx].beeld!} />}
            <h2 className="ls2-vraag">{vragen[vIdx].vraag}</h2>
            <div className="ls2-opties">
              {vragen[vIdx].opties.map((o, i) => {
                const v = vragen[vIdx]
                const cls = keuze === null ? '' : i === v.goed ? 'goed' : i === keuze ? 'fout' : 'uit'
                return (
                  <button
                    key={o + i}
                    type="button"
                    className={cls}
                    disabled={keuze !== null}
                    onClick={() => {
                      setKeuze(i)
                      setAntwoorden((a) => ({ ...a, [vIdx]: i === v.goed }))
                    }}
                  >
                    {i === v.goed && keuze !== null ? <Check size={16} /> : i === keuze ? <X size={16} /> : null}
                    {o}
                  </button>
                )
              })}
            </div>
            {keuze !== null && (
              <div className={`ls2-feedback ${keuze === vragen[vIdx].goed ? 'goed' : 'fout'}`}>
                <p className="ls2-oordeel">{keuze === vragen[vIdx].goed ? 'Goed!' : `Het juiste antwoord: ${vragen[vIdx].opties[vragen[vIdx].goed]}`}</p>
                {vragen[vIdx].uitleg && <p>{vragen[vIdx].uitleg}</p>}
                <button
                  type="button"
                  className="ls2-knop"
                  onClick={() => {
                    if (vIdx < vragen.length - 1) {
                      setVIdx(vIdx + 1)
                      setKeuze(null)
                    } else rondAf(antwoorden)
                  }}
                >
                  {vIdx < vragen.length - 1 ? 'Volgende vraag' : 'Bekijk je uitslag'} <ArrowRight size={16} />
                </button>
              </div>
            )}
          </section>
        )}

        {les && fase === 'uitslag' && (
          <Uitslag
            vragen={vragen}
            antwoorden={antwoorden}
            eenheden={[...nieuwE, ...herhaalE]}
            oefenen={oefenen}
            onOpnieuw={(ids) => {
              const terug = kaarten.findIndex((x) => ids.includes(x.e.id))
              setKaartIdx(Math.max(terug, 0))
              setOefenen(true)
              setFase(kaarten.length ? 'leren' : 'intro')
            }}
          />
        )}
      </main>
    </div>
  )
}

function Uitslag({
  vragen,
  antwoorden,
  eenheden,
  oefenen,
  onOpnieuw,
}: {
  vragen: Vraag[]
  antwoorden: Record<number, boolean>
  eenheden: Eenheid[]
  oefenen: boolean
  onOpnieuw: (ids: string[]) => void
}) {
  const goed = Object.values(antwoorden).filter(Boolean).length
  const perE = eenheden.map((e) => {
    const mijn = vragen.map((v, i) => ({ v, i })).filter((x) => x.v.eenheid === e.id)
    const n = mijn.filter((x) => antwoorden[x.i]).length
    return { e, gehaald: mijn.length > 0 && n / mijn.length >= 0.75 }
  })
  const gemist = perE.filter((x) => !x.gehaald).map((x) => x.e.id)
  return (
    <section className="ls2-uitslag">
      <p className="ls2-eyebrow">{oefenen ? 'Oefenronde (telt niet mee)' : 'Uitslag'}</p>
      <h2>
        {goed} van {vragen.length} goed
      </h2>
      <ul className="ls2-resultaten">
        {perE.map(({ e, gehaald }) => (
          <li key={e.id} className={gehaald ? 'goed' : 'fout'}>
            {gehaald ? <Check size={16} /> : <X size={16} />}
            <span>{e.naam}</span>
            <small>{gehaald ? 'gekend — komt later kort terug' : 'komt morgen terug'}</small>
          </li>
        ))}
      </ul>
      <div className="ls2-knoppen">
        {gemist.length > 0 && (
          <button type="button" className="ls2-knop stil" onClick={() => onOpnieuw(gemist)}>
            <RotateCcw size={16} /> Bekijk wat je miste nog eens
          </button>
        )}
        <Link to="/vandaag" className="ls2-knop">
          Terug naar vandaag <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
