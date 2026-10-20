import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Hammer, Lightbulb, RotateCcw, Wrench, X } from 'lucide-react'
import '../leer/km.css'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { shuffle } from '../leer/match'
import { KEUZES, KLUSSEN, PROBLEMEN } from './data'
import Fotos from '../ui/Fotos'
import { FOTOS } from './fotos'
import { ONDERWERPEN, type Keuze, type Klus, type Onderwerp, type Probleem } from './types'
import './klussen.css'

type Modus = 'stappen' | 'keuze' | 'mis'

const LS = 'wt-klussen-onderwerp'

function leesOnderwerp(): Onderwerp {
  try {
    const o = localStorage.getItem(LS) as Onderwerp | null
    return o && ONDERWERPEN.some((x) => x.id === o) ? o : 'bevestigen'
  } catch {
    return 'bevestigen'
  }
}

export default function KlussenApp() {
  const [onderwerp, setOnderwerpState] = useState<Onderwerp>(leesOnderwerp)
  const [modus, setModus] = useState<Modus>('stappen')
  const info = ONDERWERPEN.find((o) => o.id === onderwerp)!

  function setOnderwerp(o: Onderwerp) {
    setOnderwerpState(o)
    try {
      localStorage.setItem(LS, o)
    } catch {
      /* negeren */
    }
  }

  return (
    <div className="km-app kl-app">
      <header className="kl-bord">
        <div className="kl-bord-binnen">
          <Link to="/" className="kl-terug">
            <ArrowLeft size={16} /> Wereldtrainer
          </Link>
          <div className="kl-titel">
            <h1>Klussen</h1>
            <p>Van hollewandplug tot spiegelglans</p>
          </div>
          <nav className="kl-haken" aria-label="Onderwerpen">
            {ONDERWERPEN.map((o) => (
              <button key={o.id} type="button" className={`kl-label${o.id === onderwerp ? ' aan' : ''}`} aria-pressed={o.id === onderwerp} onClick={() => setOnderwerp(o.id)}>
                <span className="kl-gaatje" aria-hidden="true" />
                {o.titel}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="kl-main">
        <div className="kl-kop">
          <div>
            <h2>{info.titel}</h2>
            <p className="kl-intro">{info.intro}</p>
          </div>
          <div className="kl-modi" role="tablist">
            {(
              [
                ['stappen', 'Stappenplannen'],
                ['keuze', 'Keuzehulp'],
                ['mis', 'Wat ging er mis?'],
              ] as [Modus, string][]
            ).map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={modus === id} className={modus === id ? 'aan' : ''} onClick={() => setModus(id)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {modus === 'stappen' && <Stappen key={onderwerp} klussen={KLUSSEN.filter((k) => k.onderwerp === onderwerp)} />}
        {modus === 'keuze' && <Keuzehulp key={onderwerp} keuzes={KEUZES.filter((k) => k.onderwerp === onderwerp)} />}
        {modus === 'mis' && <WatGingMis key={onderwerp} problemen={PROBLEMEN.filter((p) => p.onderwerp === onderwerp)} />}
      </main>
    </div>
  )
}

/* ─── Stappenplannen ─── */

function Niveau({ n }: { n: 1 | 2 | 3 }) {
  return (
    <span className="kl-niveau" title={['Eenvoudig', 'Gemiddeld', 'Gevorderd'][n - 1]}>
      {[1, 2, 3].map((i) => (
        <Hammer key={i} size={13} className={i <= n ? 'vol' : ''} aria-hidden="true" />
      ))}
      <span className="kl-niveau-tekst">{['eenvoudig', 'gemiddeld', 'gevorderd'][n - 1]}</span>
    </span>
  )
}

function Stappen({ klussen }: { klussen: Klus[] }) {
  const gesorteerd = useMemo(() => [...klussen].sort((a, b) => a.niveau - b.niveau), [klussen])
  const [open, setOpen] = useState<Klus | null>(null)
  if (open) return <KlusDetail klus={open} onTerug={() => setOpen(null)} />
  return (
    <div className="kl-klussen">
      {gesorteerd.map((k) => (
        <button key={k.id} type="button" className="kl-werkbon" onClick={() => setOpen(k)}>
          <Niveau n={k.niveau} />
          <span className="kl-werkbon-titel">{k.titel}</span>
          <span className="kl-werkbon-wanneer">{k.wanneer}</span>
          <span className="kl-werkbon-voet">
            {k.stappen.length} stappen · {k.materiaal.length + k.gereedschap.length} spullen <ArrowRight size={14} />
          </span>
        </button>
      ))}
    </div>
  )
}

function KlusDetail({ klus, onTerug }: { klus: Klus; onTerug: () => void }) {
  const [vink, setVink] = useState<Record<string, boolean>>({})
  const [stap, setStap] = useState<number | null>(null)
  const toggle = (k: string) => setVink((v) => ({ ...v, [k]: !v[k] }))
  const lijst = (titel: string, items: string[], soort: string) => (
    <div className="kl-lijst">
      <h4>{titel}</h4>
      <ul>
        {items.map((m) => {
          const sleutel = `${soort}:${m}`
          return (
            <li key={m}>
              <label className={vink[sleutel] ? 'gedaan' : ''}>
                <input type="checkbox" checked={!!vink[sleutel]} onChange={() => toggle(sleutel)} />
                {m}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
  return (
    <article className="kl-detail">
      <button type="button" className="kl-terugknop" onClick={onTerug}>
        <ArrowLeft size={16} /> Alle klussen
      </button>
      <Niveau n={klus.niveau} />
      <h3>{klus.titel}</h3>
      <p className="kl-wanneer">{klus.wanneer}</p>
      <div className="kl-fotos">
        <Fotos fotos={FOTOS[klus.id]} />
      </div>

      <div className="kl-benodigd">
        {lijst('Materiaal', klus.materiaal, 'm')}
        {lijst('Gereedschap', klus.gereedschap, 'g')}
      </div>

      <h4 className="kl-kopje">Werkvolgorde</h4>
      <ol className="kl-stappen">
        {klus.stappen.map((s, i) => (
          <li key={s.titel} className={stap === i ? 'actief' : stap !== null && i < stap ? 'gedaan' : ''}>
            <button type="button" onClick={() => setStap(i)} className="kl-stap-kop">
              <span className="kl-stap-nr">{i + 1}</span>
              <span>{s.titel}</span>
            </button>
            <p>{s.uitleg}</p>
            {s.tip && (
              <p className="kl-tip">
                <Lightbulb size={15} aria-hidden="true" /> {s.tip}
              </p>
            )}
          </li>
        ))}
      </ol>

      <div className="kl-valkuilen">
        <h4>
          <AlertTriangle size={17} aria-hidden="true" /> Valkuilen
        </h4>
        <ul>
          {klus.valkuilen.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/* ─── Keuzehulp ─── */

function Keuzehulp({ keuzes }: { keuzes: Keuze[] }) {
  const groepen = useMemo(() => {
    const m = new Map<string, Keuze[]>()
    for (const k of keuzes) m.set(k.vraag, [...(m.get(k.vraag) ?? []), k])
    return [...m.entries()]
  }, [keuzes])
  const [groep, setGroep] = useState(0)
  const [gekozen, setGekozen] = useState<string | null>(null)
  const [toets, setToets] = useState(false)
  const [vraag, items] = groepen[groep] ?? ['', []]
  const advies = items.find((k) => k.id === gekozen)

  if (!groepen.length) return <p className="kl-leeg">Nog geen keuzehulp voor dit onderwerp.</p>

  return (
    <div className="kl-keuzehulp">
      <div className="kl-vragen" role="tablist">
        {groepen.map(([v], i) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={i === groep}
            className={i === groep ? 'aan' : ''}
            onClick={() => {
              setGroep(i)
              setGekozen(null)
              setToets(false)
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {!toets ? (
        <div className="kl-keuze-indeling">
          <div className="kl-situaties">
            <p className="kl-situaties-kop">Wat is jouw situatie?</p>
            {items.map((k) => (
              <button key={k.id} type="button" className={`kl-situatie${k.id === gekozen ? ' aan' : ''}`} onClick={() => setGekozen(k.id)}>
                {k.situatie}
              </button>
            ))}
            {items.length >= 4 && (
              <button type="button" className="kl-toetsknop" onClick={() => setToets(true)}>
                Test jezelf op „{vraag}”
              </button>
            )}
          </div>
          <div className="kl-advies-vak" aria-live="polite">
            {advies ? (
              <div className="kl-advies">
                <Fotos fotos={FOTOS[advies.id]} />
                <p className="kl-advies-situatie">{advies.situatie}</p>
                <p className="kl-advies-keuze">
                  <Check size={20} aria-hidden="true" /> {advies.keuze}
                </p>
                <p>{advies.waarom}</p>
                {advies.specs && advies.specs.length > 0 && (
                  <ul className="kl-specs">
                    {advies.specs.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                )}
                {advies.nietGebruiken && (
                  <p className="kl-niet">
                    <X size={17} aria-hidden="true" />
                    <span>
                      <b>Niet:</b> {advies.nietGebruiken}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <div className="kl-advies leeg">
                <Wrench size={34} aria-hidden="true" />
                <p>Kies links een situatie, dan zie je hier wat je gebruikt — en wat juist niet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="kl-toets">
          <button type="button" className="kl-terugknop" onClick={() => setToets(false)}>
            <ArrowLeft size={16} /> Terug naar de keuzehulp
          </button>
          <QuizRunner key={vraag} maak={() => keuzeQuiz(items)} />
        </div>
      )}
    </div>
  )
}

function keuzeQuiz(items: Keuze[]): Vraag[] {
  return shuffle(items).map((k) => {
    const fout = shuffle(items.filter((x) => x.id !== k.id && x.keuze !== k.keuze)).slice(0, 3)
    const opties = shuffle([k, ...fout])
    return {
      prompt: <span className="kl-quizvraag">{k.situatie}</span>,
      options: opties.map((o) => o.keuze),
      correct: opties.indexOf(k),
      explain: k.waarom,
    }
  })
}

/* ─── Wat ging er mis? ─── */

function WatGingMis({ problemen }: { problemen: Probleem[] }) {
  const [volgorde, setVolgorde] = useState(() => shuffle(problemen))
  const [i, setI] = useState(0)
  const [keuze, setKeuze] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const p = volgorde[i]
  const opties = useMemo(() => (p ? shuffle(p.oorzaken) : []), [p])

  if (!problemen.length) return <p className="kl-leeg">Nog geen problemen voor dit onderwerp.</p>

  if (!p)
    return (
      <div className="kl-mis-klaar">
        <h3>
          {score} van {volgorde.length} goed gediagnosticeerd
        </h3>
        <button
          type="button"
          className="km-btn km-btn-primary"
          onClick={() => {
            setVolgorde(shuffle(problemen))
            setI(0)
            setScore(0)
            setKeuze(null)
          }}
        >
          <RotateCcw size={16} /> Nog een ronde
        </button>
      </div>
    )

  const goed = keuze !== null && opties[keuze].juist
  return (
    <div className="kl-mis">
      <p className="kl-mis-teller tabular">
        Probleem {i + 1} van {volgorde.length}
      </p>
      <div className="kl-symptoom">
        <span>Het probleem</span>
        <p>{p.symptoom}</p>
      </div>
      <p className="kl-mis-vraag">Wat is de oorzaak?</p>
      <div className="kl-oorzaken">
        {opties.map((o, j) => (
          <button
            key={o.oorzaak}
            type="button"
            disabled={keuze !== null}
            className={keuze === null ? '' : o.juist ? 'goed' : j === keuze ? 'fout' : 'uit'}
            onClick={() => {
              setKeuze(j)
              if (o.juist) setScore((s) => s + 1)
            }}
          >
            {o.oorzaak}
          </button>
        ))}
      </div>
      {keuze !== null && (
        <div className={`kl-diagnose ${goed ? 'goed' : 'fout'}`}>
          <p className="kl-diagnose-oordeel">{goed ? 'Goed gezien.' : 'Niet de oorzaak.'}</p>
          <Fotos fotos={FOTOS[p.id]} />
          <p>{p.uitleg}</p>
          <h4>Herstellen</h4>
          <p>{p.oplossing}</p>
          <h4>Voorkomen</h4>
          <p>{p.voorkomen}</p>
          <button
            type="button"
            className="km-btn km-btn-primary"
            onClick={() => {
              setI(i + 1)
              setKeuze(null)
            }}
          >
            Volgende <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
