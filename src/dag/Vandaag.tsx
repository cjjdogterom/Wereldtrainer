import { useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, RotateCcw, Volume2, X } from 'lucide-react'
import TopBalk, { datumTekst } from '../ui/TopBalk'
import SeinVlag from '../seinen/Vlag'
import { MODULES, MODULE_BY_ID } from '../modules'
import { REEKS_DREMPEL, type Uitslag } from './stand'
import type { Beeld, DagItem } from './bronnen'
import { useDagItems, useDagStand } from './useDag'
import './vandaag.css'

const KAART_MODULES = MODULES.filter((m) => m.id !== 'spaans')

export default function Vandaag() {
  const { vandaag, uitslagen, poco, pocoKlaar, reeks, markeer } = useDagStand()
  const { items, laden } = useDagItems(vandaag)
  const kaartRefs = useRef<Record<string, HTMLElement | null>>({})

  const onderdelen = ['spaans', ...KAART_MODULES.map((m) => m.id)].filter((id) => id === 'spaans' || items[id] !== null)
  const af = onderdelen.filter((id) => uitslagen[id]).length

  function beantwoord(moduleId: string, uitslag: Uitslag) {
    markeer(moduleId, uitslag)
    const volgende = KAART_MODULES.find((m) => m.id !== moduleId && items[m.id] && !uitslagen[m.id])
    if (volgende) {
      window.setTimeout(() => {
        kaartRefs.current[volgende.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 260)
    }
  }

  const spaans = MODULE_BY_ID.spaans
  const pocoPct = poco.totaal ? Math.round((Math.min(poco.klaar, poco.totaal) / poco.totaal) * 100) : 0

  return (
    <div className="vd">
      <TopBalk reeks={reeks} />

      <section className="vd-kop">
        <p className="vd-eyebrow">Dagprogramma · {datumTekst()}</p>
        <h1>Vandaag leer je {onderdelen.length} dingen</h1>
        <p className="vd-intro">
          Uit elk onderwerp één kaart, plus je dertig Spaanse woorden. Kijk eerst zelf of je het weet, draai dan de kaart om en wees eerlijk.
        </p>
        <div className="vd-voortgang" aria-label={`${af} van ${onderdelen.length} onderdelen af`}>
          <div className="vd-segmenten">
            {onderdelen.map((id) => (
              <span
                key={id}
                className={`vd-seg ${uitslagen[id] ?? ''}`}
                style={{ '--seg': MODULE_BY_ID[id]?.accent } as CSSProperties}
                title={MODULE_BY_ID[id]?.title}
              />
            ))}
          </div>
          <span className="vd-telling tabular">
            <b>{af}</b> van {onderdelen.length} af
          </span>
        </div>
        {af >= onderdelen.length && onderdelen.length > 0 && (
          <p className="vd-klaar" role="status">
            Alles af voor vandaag. Morgen staat er een nieuw rijtje klaar.
          </p>
        )}
      </section>

      <main className="vd-lijst">
        <article
          className={`vd-kaart vd-spaans${uitslagen.spaans ? ' gedaan' : ''}`}
          style={{ '--mk': spaans.accent } as CSSProperties}
        >
          <div className="vd-kaart-band lade-spaans">
            <span className="vd-kaart-mod">{spaans.icon}{spaans.title}</span>
            {uitslagen.spaans && <span className="vd-stempel goed"><Check size={14} /> af</span>}
          </div>
          <div className="vd-kaart-body">
            <h2 className="vd-vraag">Dertig nieuwe woorden</h2>
            <p className="vd-hint">
              Poco a Poco zet ze in blokjes van zes klaar: kennismaken, meerkeuze en typen. Een woord is binnen als je het twee keer op rij goed hebt.
            </p>
            <div className="vd-poco">
              <div className="vd-poco-balk"><i style={{ width: `${pocoPct}%` }} /></div>
              <span className="tabular">{Math.min(poco.klaar, poco.totaal)} / {poco.totaal}</span>
            </div>
            <Link to="/spaans" className="vd-knop hoofd">
              {poco.klaar === 0 ? 'Begin met de woorden' : pocoKlaar ? 'Herhaal in Poco a Poco' : 'Ga verder'} <ArrowRight size={16} />
            </Link>
          </div>
        </article>

        {KAART_MODULES.map((m) => {
          const item = items[m.id]
          if (item === null) return null
          return (
            <DagKaart
              key={m.id}
              moduleId={m.id}
              item={item}
              laden={laden}
              uitslag={uitslagen[m.id]}
              onAntwoord={(u) => beantwoord(m.id, u)}
              onOpnieuw={() => markeer(m.id, null)}
              refFn={(el) => {
                kaartRefs.current[m.id] = el
              }}
            />
          )
        })}
      </main>

      <footer className="vd-voet">
        Een dag telt mee voor je reeks als je minstens {REEKS_DREMPEL} onderdelen af hebt. Je voortgang staat op elk apparaat waarop je de Wereldtrainer opent.
      </footer>
    </div>
  )
}

function DagKaart({
  moduleId,
  item,
  laden,
  uitslag,
  onAntwoord,
  onOpnieuw,
  refFn,
}: {
  moduleId: string
  item: DagItem | undefined
  laden: boolean
  uitslag?: Uitslag
  onAntwoord: (u: Uitslag) => void
  onOpnieuw: () => void
  refFn: (el: HTMLElement | null) => void
}) {
  const m = MODULE_BY_ID[moduleId]
  const [omgedraaid, setOmgedraaid] = useState(false)
  const open = omgedraaid || !!uitslag

  return (
    <article
      ref={refFn}
      className={`vd-kaart${uitslag ? ` gedaan ${uitslag}` : ''}`}
      style={{ '--mk': m.accent } as CSSProperties}
      aria-busy={laden && !item}
    >
      <div className={`vd-kaart-band lade-${m.id}`}>
        <span className="vd-kaart-mod">{m.icon}{m.title}</span>
        {uitslag === 'goed' && <span className="vd-stempel goed"><Check size={14} /> wist ik</span>}
        {uitslag === 'fout' && <span className="vd-stempel fout"><X size={14} /> nog oefenen</span>}
      </div>

      {!item ? (
        <div className="vd-kaart-body">
          <div className="vd-skelet" />
          <div className="vd-skelet kort" />
        </div>
      ) : (
        <div className="vd-kaart-body">
          {item.beeld && <BeeldBlok beeld={item.beeld} verborgen={!open} />}
          <h2 className="vd-vraag">{item.vraag}</h2>

          {!open ? (
            <button type="button" className="vd-knop hoofd" onClick={() => setOmgedraaid(true)}>
              Draai om
            </button>
          ) : (
            <div className="vd-antwoord">
              <p className="vd-antwoord-kern">{item.antwoord}</p>
              {item.extra && <p className="vd-antwoord-extra">{item.extra}</p>}
              {item.geluid && <Geluid src={item.geluid} />}

              {!uitslag ? (
                <div className="vd-oordeel">
                  <button type="button" className="vd-knop goed" onClick={() => onAntwoord('goed')}>
                    <Check size={17} /> Wist ik
                  </button>
                  <button type="button" className="vd-knop fout" onClick={() => onAntwoord('fout')}>
                    <X size={17} /> Nog niet
                  </button>
                </div>
              ) : (
                <div className="vd-na">
                  <Link to={m.to} className="vd-link">
                    Verder in {m.title} <ArrowRight size={15} />
                  </Link>
                  <button
                    type="button"
                    className="vd-link stil"
                    onClick={() => {
                      setOmgedraaid(false)
                      onOpnieuw()
                    }}
                  >
                    <RotateCcw size={14} /> Opnieuw
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  )
}

function BeeldBlok({ beeld, verborgen }: { beeld: Beeld; verborgen: boolean }) {
  if (beeld.soort === 'img')
    return (
      <div className={`vd-beeld ${beeld.vorm ?? 'foto'}`}>
        <img src={beeld.src} alt={beeld.alt} loading="lazy" />
      </div>
    )
  if (beeld.soort === 'seinvlag')
    return (
      <div className="vd-beeld object">
        <SeinVlag letter={beeld.letter} size={118} />
      </div>
    )
  if (beeld.soort === 'hand')
    return (
      <div className="vd-hand" aria-label="Jouw hand">
        {beeld.kleuren.map((k) => (
          <div key={k.symbool} className="vd-hand-rij">
            <span className={`vd-hand-sym${k.rood ? ' rood' : ''}`}>{k.symbool}</span>
            <span className="vd-hand-kaarten">{k.kaarten}</span>
          </div>
        ))}
        {!verborgen && <span className="vd-hand-punten">{beeld.punten} honneurpunten</span>}
      </div>
    )
  return <div className="vd-groot">{beeld.tekst}</div>
}

function Geluid({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement>(null)
  return (
    <>
      <audio ref={ref} src={src} preload="none" />
      <button type="button" className="vd-link" onClick={() => ref.current?.play()}>
        <Volume2 size={15} /> Laat het geluid horen
      </button>
    </>
  )
}
