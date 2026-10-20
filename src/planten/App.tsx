import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Leaf, Skull, Utensils, X } from 'lucide-react'
import '../leer/km.css'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { shuffle } from '../leer/match'
import { PLANTEN } from './data'
import { FOTO } from './media'
import { GROEP_TITEL, type Plant, type PlantGroep } from './types'
import './planten.css'

type Tab = PlantGroep | 'giftig-eetbaar'
type Modus = 'herbarium' | 'herkennen' | 'kenmerken'

const TABS: { id: Tab; titel: string }[] = [
  { id: 'boom', titel: GROEP_TITEL.boom },
  { id: 'struik', titel: GROEP_TITEL.struik },
  { id: 'wild', titel: GROEP_TITEL.wild },
  { id: 'giftig-eetbaar', titel: 'Giftig & eetbaar' },
]

function plantenVoor(tab: Tab): Plant[] {
  if (tab === 'giftig-eetbaar') return PLANTEN.filter((p) => p.eetbaar || p.giftig || p.verwisseling)
  return PLANTEN.filter((p) => p.groep === tab)
}

export default function PlantenApp() {
  const [tab, setTab] = useState<Tab>('boom')
  const [modus, setModus] = useState<Modus>('herbarium')
  const [open, setOpen] = useState<Plant | null>(null)
  const soorten = useMemo(() => plantenVoor(tab), [tab])

  return (
    <div className="km-app pl-app">
      <header className="pl-kop lade-planten">
        <div className="pl-kop-binnen">
          <Link to="/" className="pl-terug">
            <ArrowLeft size={16} /> Wereldtrainer
          </Link>
          <h1>Planten en bomen</h1>
          <p>{PLANTEN.length} soorten die je in Nederland tegenkomt</p>
        </div>
      </header>

      <nav className="pl-tabs" aria-label="Groepen">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`pl-tab${t.id === tab ? ' aan' : ''}${t.id === 'giftig-eetbaar' ? ' let' : ''}`}
            aria-pressed={t.id === tab}
            onClick={() => {
              setTab(t.id)
              setModus('herbarium')
            }}
          >
            {t.titel}
            <span className="tabular">{plantenVoor(t.id).length}</span>
          </button>
        ))}
      </nav>

      <main className="pl-main">
        <div className="pl-modi" role="tablist">
          {(
            [
              ['herbarium', 'Herbarium'],
              ['herkennen', 'Herken de foto'],
              ['kenmerken', 'Raad aan kenmerken'],
            ] as [Modus, string][]
          ).map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={modus === id} className={modus === id ? 'aan' : ''} onClick={() => setModus(id)}>
              {label}
            </button>
          ))}
        </div>

        {modus === 'herbarium' && tab === 'giftig-eetbaar' && <GiftigEetbaar soorten={soorten} onOpen={setOpen} />}

        {modus === 'herbarium' && tab !== 'giftig-eetbaar' && (
          <div className="pl-vellen">
            {soorten.map((p) => (
              <Vel key={p.id} plant={p} onOpen={() => setOpen(p)} />
            ))}
          </div>
        )}

        {modus === 'herkennen' && (
          <div className="pl-quiz">
            <QuizRunner key={`f-${tab}`} maak={() => maakFotoQuiz(soorten)} />
          </div>
        )}

        {modus === 'kenmerken' && (
          <div className="pl-quiz">
            <QuizRunner key={`k-${tab}`} maak={() => maakKenmerkQuiz(soorten)} />
          </div>
        )}
      </main>

      {open && <Detail plant={open} onSluit={() => setOpen(null)} />}
    </div>
  )
}

function FotoVan({ plant, groot }: { plant: Plant; groot?: boolean }) {
  const f = FOTO[plant.id]
  if (!f)
    return (
      <div className={`pl-foto leeg${groot ? ' groot' : ''}`} aria-hidden="true">
        <Leaf size={groot ? 48 : 32} />
      </div>
    )
  return (
    <div className={`pl-foto${groot ? ' groot' : ''}`}>
      <img src={`/planten/${f.bestand}`} alt={plant.naam} loading="lazy" />
    </div>
  )
}

function Vel({ plant, onOpen }: { plant: Plant; onOpen: () => void }) {
  return (
    <button type="button" className="pl-vel" onClick={onOpen}>
      <span className="pl-tape links" aria-hidden="true" />
      <span className="pl-tape rechts" aria-hidden="true" />
      <FotoVan plant={plant} />
      <span className="pl-etiket">
        <span className="pl-naam">{plant.naam}</span>
        <span className="pl-latijn">{plant.latijn}</span>
        <span className="pl-familie">{plant.familie}</span>
      </span>
      <span className="pl-herken">{plant.herkennen}</span>
      {(plant.giftig || plant.eetbaar) && (
        <span className="pl-badges">
          {plant.eetbaar && (
            <span className="pl-badge eet">
              <Utensils size={12} /> eetbaar
            </span>
          )}
          {plant.giftig && (
            <span className="pl-badge gif">
              <Skull size={12} /> giftig
            </span>
          )}
        </span>
      )}
    </button>
  )
}

function Detail({ plant, onSluit }: { plant: Plant; onSluit: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onSluit()
    window.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [onSluit])

  const f = FOTO[plant.id]
  const rijen: [string, string | undefined][] = [
    ['Blad', plant.blad],
    ['Bloem', plant.bloem],
    ['Vrucht', plant.vrucht],
    ['Schors', plant.schors],
    ['Bloeitijd', plant.bloeitijd],
    ['Hoogte', plant.hoogte],
    ['Waar', plant.waar],
  ]
  return (
    <div className="pl-scherm" role="dialog" aria-modal="true" aria-label={plant.naam} onClick={onSluit}>
      <article className="pl-detail" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="pl-sluit" onClick={onSluit} aria-label="Sluiten">
          <X size={20} />
        </button>
        <FotoVan plant={plant} groot />
        <div className="pl-detail-tekst">
          <p className="pl-familie">{plant.familie} · {GROEP_TITEL[plant.groep]}</p>
          <h2>{plant.naam}</h2>
          <p className="pl-latijn">{plant.latijn}</p>
          <p className="pl-herken-groot">{plant.herkennen}</p>
          <dl className="pl-kenmerken">
            {rijen
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
          </dl>
          <p className="pl-weetje">{plant.wetenswaard}</p>
          {plant.eetbaar && (
            <p className="pl-melding eet">
              <Utensils size={16} /> <span><b>Eetbaar:</b> {plant.eetbaar}</span>
            </p>
          )}
          {plant.giftig && (
            <p className="pl-melding gif">
              <Skull size={16} /> <span><b>Giftig:</b> {plant.giftig}</span>
            </p>
          )}
          {plant.verwisseling && (
            <p className="pl-melding let">
              <AlertTriangle size={16} /> <span><b>Niet verwisselen:</b> {plant.verwisseling}</span>
            </p>
          )}
          {f && (
            <p className="pl-bron">
              Foto: {f.maker} · {f.licentie} ·{' '}
              <a href={f.bron} target="_blank" rel="noopener noreferrer">
                Wikimedia Commons
              </a>
            </p>
          )}
        </div>
      </article>
    </div>
  )
}

function GiftigEetbaar({ soorten, onOpen }: { soorten: Plant[]; onOpen: (p: Plant) => void }) {
  const verwisseling = soorten.filter((p) => p.verwisseling)
  const eetbaar = soorten.filter((p) => p.eetbaar)
  const giftig = soorten.filter((p) => p.giftig && !p.eetbaar)
  const rij = (p: Plant, tekst: string | undefined) => (
    <button key={p.id} type="button" className="pl-rij" onClick={() => onOpen(p)}>
      <FotoVan plant={p} />
      <span>
        <b>{p.naam}</b> <i>{p.latijn}</i>
        <span className="pl-rij-tekst">{tekst}</span>
      </span>
    </button>
  )
  return (
    <div className="pl-ge">
      <aside className="pl-waarschuwing">
        <AlertTriangle size={20} />
        <p>
          Eet nooit iets wat je niet met zekerheid herkent. Veel eetbare planten hebben een giftige dubbelganger, en sommige soorten zijn in kleine hoeveelheden al dodelijk. Plukken in natuurgebieden is vaak verboden.
        </p>
      </aside>
      {verwisseling.length > 0 && (
        <section>
          <h2>Gevaarlijke dubbelgangers</h2>
          <div className="pl-rijen">{verwisseling.map((p) => rij(p, p.verwisseling))}</div>
        </section>
      )}
      <section>
        <h2>Eetbaar — met voorbehoud</h2>
        <div className="pl-rijen">{eetbaar.map((p) => rij(p, p.eetbaar))}</div>
      </section>
      <section>
        <h2>Giftig</h2>
        <div className="pl-rijen">{giftig.map((p) => rij(p, p.giftig))}</div>
      </section>
    </div>
  )
}

function maakFotoQuiz(soorten: Plant[]): Vraag[] {
  const metFoto = soorten.filter((p) => FOTO[p.id])
  const pool = metFoto.length >= 4 ? metFoto : soorten
  return shuffle(pool)
    .slice(0, 10)
    .map((p) => {
      const fout = shuffle(PLANTEN.filter((x) => x.id !== p.id && x.groep === p.groep)).slice(0, 3)
      const opties = shuffle([p, ...fout])
      return {
        prompt: (
          <div className="pl-vraag">
            <FotoVan plant={p} groot />
            <span>Welke soort is dit?</span>
          </div>
        ),
        options: opties.map((o) => o.naam),
        correct: opties.indexOf(p),
        explain: `${p.naam} (${p.latijn}): ${p.herkennen}`,
      }
    })
}

function maakKenmerkQuiz(soorten: Plant[]): Vraag[] {
  return shuffle(soorten)
    .slice(0, 10)
    .map((p) => {
      const fout = shuffle(PLANTEN.filter((x) => x.id !== p.id && x.groep === p.groep)).slice(0, 3)
      const opties = shuffle([p, ...fout])
      const naamRe = new RegExp(p.naam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      const verberg = (s: string) => s.replace(naamRe, '…')
      const aanwijzingen = [p.blad && `Blad: ${p.blad}`, p.bloem && `Bloem: ${p.bloem}`, p.vrucht && `Vrucht: ${p.vrucht}`, p.schors && `Schors: ${p.schors}`]
        .filter((x): x is string => Boolean(x))
        .slice(0, 3)
        .map(verberg)
      return {
        prompt: (
          <div className="pl-vraag">
            <ul className="pl-aanwijzingen">
              {aanwijzingen.map((a) => (
                <li key={a}>{a}</li>
              ))}
              <li>Waar: {verberg(p.waar)}</li>
            </ul>
            <span>Welke soort wordt hier beschreven?</span>
          </div>
        ),
        options: opties.map((o) => o.naam),
        correct: opties.indexOf(p),
        explain: `${p.naam}: ${p.herkennen}`,
      }
    })
}
