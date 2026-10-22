import { useMemo, type CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Check, Circle, CircleDot, Clock } from 'lucide-react'
import { MODULE_BY_ID } from '../modules'
import { useGeheugen } from '../dag/useLeer'
import { LEERSTOF } from '../dag/leerstof'
import { RUBRIEK, sleutel, stukSleutel } from '../dag/krant'
import { leestijd } from '../krant/stukken'
import { soortVan, statusVan, useBron, vakStand, type Status } from './stand'
import '../ui/laden.css'
import './vakken.css'

const STATUS_ICOON: Record<Status, React.ReactNode> = {
  gekend: <Check size={14} strokeWidth={3} />,
  bezig: <CircleDot size={14} />,
  nieuw: <Circle size={14} />,
}

// Het leerpad van één vak: waar je staat, wat er komt, en de weg naar de module.
export default function Vak() {
  const { id = '' } = useParams()
  const m = MODULE_BY_ID[id]
  const { g } = useGeheugen()
  const bron = useBron(id)
  const soort = soortVan(id)
  const st = vakStand(g, id, bron)

  const hoofdstukken = useMemo(() => {
    const uit: { naam: string; eenheden: NonNullable<typeof bron>['eenheden'] }[] = []
    for (const e of bron?.eenheden ?? []) {
      const laatste = uit[uit.length - 1]
      if (laatste && laatste.naam === e.hoofdstuk) laatste.eenheden.push(e)
      else uit.push({ naam: e.hoofdstuk, eenheden: [e] })
    }
    return uit
  }, [bron])

  if (!m) return <Navigate to="/vakken" replace />

  const volgendeStuk = bron?.stukken.find((x) => !g.krant?.gelezen[stukSleutel(id, x.id)])
  const status = (eid: string): Status =>
    soort === 'lezen' ? (g.krant?.gelezen[sleutel(id, eid)] ? 'gekend' : 'nieuw') : statusVan(g, id, eid)
  // Het hoofdstuk waar je nu zit staat open; de rest is ingeklapt.
  const huidig = hoofdstukken.findIndex((h) => h.eenheden.some((e) => status(e.id) !== 'gekend'))

  return (
    <div className="vk vk-vak" style={{ '--vk': m.accent } as CSSProperties}>
      <header className={`vk-vak-kop lade-${m.id}`}>
        <Link to="/vakken" className="vk-terug">
          <ArrowLeft size={16} /> Vakken
        </Link>
        <span className="vk-vak-icoon">{m.icon}</span>
        <h1>{m.title}</h1>
        <p>{m.description}</p>
        {st && st.totaal > 0 && (
          <div className="vk-vak-stand">
            <span className="vk-balk licht">
              <i style={{ width: `${(st.klaar / st.totaal) * 100}%` }} />
            </span>
            <span className="tabular">
              {st.klaar} van {st.totaal} {st.eenheid}
            </span>
          </div>
        )}
      </header>

      <div className="vk-acties">
        {soort === 'lezen' && volgendeStuk && (
          <Link to={`/lezen/${id}/${volgendeStuk.id}`} className="vk-knop">
            <BookOpen size={17} /> Lees het volgende artikel
          </Link>
        )}
        {soort === 'stampen' && (
          <Link to={`/vandaag/${id}`} className="vk-knop">
            Extra les <ArrowRight size={17} />
          </Link>
        )}
        <Link to={m.to} className={`vk-knop${soort === 'spaans' ? '' : ' stil'}`}>
          {soort === 'spaans' ? 'Open Poco a Poco' : `Vrij oefenen in ${m.title}`} <ArrowRight size={17} />
        </Link>
      </div>

      {soort === 'stampen' && (
        <p className="vk-uitleg">
          Dit vak zit in je dagsessie: elke {LEERSTOF[id]?.perDag === 1 ? 'les' : `keer ${LEERSTOF[id]?.perDag} ${LEERSTOF[id]?.meervoud}`} nieuw, en wat je kent komt
          terug in het gemengde herhalen.
          {LEERSTOF[id]?.stapsgewijs && ' Je gaat pas door als je de vorige les gehaald hebt.'}
        </p>
      )}

      {soort === 'lezen' && bron && bron.stukken.length > 0 && (
        <section className="vk-pad">
          <h2>Artikelen</h2>
          <ol className="vk-artikelen">
            {bron.stukken.map((s) => {
              const gelezen = !!g.krant?.gelezen[stukSleutel(id, s.id)]
              return (
                <li key={s.id} className={`${gelezen ? 'af' : ''}${s === volgendeStuk ? ' volgende' : ''}`}>
                  <Link to={`/lezen/${id}/${s.id}`}>
                    <span className="vk-st">{gelezen ? <Check size={14} strokeWidth={3} /> : <Circle size={14} />}</span>
                    <span className="vk-art-tekst">
                      <strong>{s.kop}</strong>
                      <small>
                        {s.hoofdstuk && `${s.hoofdstuk} · `}
                        <Clock size={11} /> {leestijd(s)} min
                      </small>
                    </span>
                    {s === volgendeStuk && <span className="vk-label">hierna</span>}
                  </Link>
                </li>
              )
            })}
          </ol>
        </section>
      )}

      {hoofdstukken.length > 0 && (
        <section className="vk-pad">
          <h2>{soort === 'lezen' ? 'Korte stukken uit de leerstof' : 'Leerpad'}</h2>
          {soort === 'stampen' && (
            <p className="vk-legenda">
              <span>{STATUS_ICOON.gekend} gekend</span>
              <span>{STATUS_ICOON.bezig} nog oefenen</span>
              <span>{STATUS_ICOON.nieuw} nog niet gehad</span>
            </p>
          )}
          {hoofdstukken.map((h, i) => {
            const klaar = h.eenheden.filter((e) => status(e.id) === 'gekend').length
            return (
              <details key={h.naam + i} className="vk-hoofdstuk" open={soort === 'stampen' && i === huidig}>
                <summary>
                  <span>{h.naam}</span>
                  <span className="tabular">
                    {klaar}/{h.eenheden.length}
                  </span>
                </summary>
                <ul>
                  {h.eenheden.map((e) => {
                    const s = status(e.id)
                    return (
                      <li key={e.id} className={`vk-e ${s}`}>
                        {STATUS_ICOON[s]} {e.naam}
                      </li>
                    )
                  })}
                </ul>
              </details>
            )
          })}
        </section>
      )}

      {soort === 'lezen' && RUBRIEK[id] && (
        <p className="vk-uitleg">Dit vak verschijnt in de krant als de rubriek „{RUBRIEK[id].naam}”. Artikelen die je hier leest, tellen ook daar als gelezen.</p>
      )}
    </div>
  )
}
