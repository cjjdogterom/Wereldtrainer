import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import TopBalk, { datumTekst } from '../ui/TopBalk'
import { MODULES, MODULE_BY_ID } from '../modules'
import { dagSleutel, type Geheugen } from './geheugen'
import { LEERSTOF } from './leerstof'
import { DAGNAMEN, ROOSTER, WEEKVOLGORDE, roosterVoor } from './rooster'
import { useGeheugen, useLesPlan, usePoco } from './useLeer'
import './vandaag.css'

export default function Vandaag() {
  const { g, vandaag, wijzig, reeks } = useGeheugen()
  const poco = usePoco(vandaag)
  const gepland = roosterVoor()
  const sleutel = dagSleutel(vandaag)
  const klaar = g.dagen[sleutel]?.klaar ?? []
  const af = gepland.filter((m) => klaar.includes(m)).length
  const extra = MODULES.filter((m) => LEERSTOF[m.id] && !gepland.includes(m.id))
  const spaans = MODULE_BY_ID.spaans
  const pocoPct = poco.totaal ? Math.round((Math.min(poco.klaar, poco.totaal) / poco.totaal) * 100) : 0

  return (
    <div className="vd">
      <TopBalk reeks={reeks} />

      <section className="vd-kop">
        <p className="vd-eyebrow">{datumTekst()}</p>
        <h1>{af === gepland.length ? 'Klaar voor vandaag.' : `Vandaag: ${gepland.map((id) => MODULE_BY_ID[id]?.title).join(', ')}`}</h1>
        <p className="vd-intro">Elke les begint met leerkaarten en eindigt met een korte overhoring. Wat je kent komt na een tijd kort terug, zodat je het niet vergeet.</p>
        <Weekrooster g={g} vandaag={vandaag} />
      </section>

      <main className="vd-lijst">
        <article className="vd-les" style={{ '--mk': spaans.accent } as CSSProperties}>
          <div className="vd-les-band lade-spaans">
            <span className="vd-les-mod">
              {spaans.icon}
              {spaans.title}
            </span>
            <span className="vd-les-elke">elke dag</span>
          </div>
          <div className="vd-les-body">
            <h2>Dertig woorden in Poco a Poco</h2>
            <div className="vd-poco">
              <div className="vd-poco-balk">
                <i style={{ width: `${pocoPct}%` }} />
              </div>
              <span className="tabular">
                {Math.min(poco.klaar, poco.totaal)} / {poco.totaal}
              </span>
            </div>
            <Link to="/spaans" className="vd-knop">
              {poco.klaar === 0 ? 'Begin' : poco.klaar >= poco.totaal ? 'Herhaal' : 'Ga verder'} <ArrowRight size={16} />
            </Link>
          </div>
        </article>

        {gepland.map((id) => (
          <LesKaartje key={id} moduleId={id} g={g} vandaag={vandaag} wijzig={wijzig} />
        ))}

        <section className="vd-extra">
          <h2>Extra oefenen</h2>
          <p>Ook zin in een ander onderwerp? Elke les telt mee voor je voortgang.</p>
          <div className="vd-extra-lijst">
            {extra.map((m) => (
              <Link key={m.id} to={`/vandaag/${m.id}`} className="vd-extra-item" style={{ '--mk': m.accent } as CSSProperties}>
                <span className="vd-extra-icoon">{m.icon}</span>
                <span>{m.title}</span>
                {g.modules[m.id]?.les?.dag === vandaag && g.modules[m.id]?.les?.klaar && <Check size={15} className="vd-extra-vink" />}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="vd-voet">Een dag telt mee voor je reeks als de drie lessen van het rooster af zijn.</footer>
    </div>
  )
}

function Weekrooster({ g, vandaag }: { g: Geheugen; vandaag: number }) {
  const nu = new Date()
  const vandaagDag = nu.getDay()
  // dagnummer van de maandag van deze week
  const offset = (vandaagDag + 6) % 7
  return (
    <ol className="vd-week" aria-label="Weekrooster">
      {WEEKVOLGORDE.map((dag, i) => {
        const n = vandaag - offset + i
        const d = g.dagen[dagSleutel(n)]
        const vol = !!d && d.gepland.length > 0 && d.gepland.every((m) => d.klaar.includes(m))
        return (
          <li key={dag} className={`${dag === vandaagDag ? 'nu' : ''}${n < vandaag ? ' voorbij' : ''}${vol ? ' vol' : ''}`}>
            <span className="vd-week-dag">{DAGNAMEN[dag].slice(0, 2)}</span>
            <span className="vd-week-mods">
              {ROOSTER[dag].map((id) => (
                <span key={id} className="vd-week-mod" style={{ '--mk': MODULE_BY_ID[id]?.accent } as CSSProperties} title={MODULE_BY_ID[id]?.title}>
                  {MODULE_BY_ID[id]?.icon}
                </span>
              ))}
            </span>
            {vol && <Check size={13} className="vd-week-vink" />}
          </li>
        )
      })}
    </ol>
  )
}

function LesKaartje({
  moduleId,
  g,
  vandaag,
  wijzig,
}: {
  moduleId: string
  g: Geheugen
  vandaag: number
  wijzig: ReturnType<typeof useGeheugen>['wijzig']
}) {
  const m = MODULE_BY_ID[moduleId]
  const { leerstof, eenheden, les, voortgang } = useLesPlan(moduleId, g, vandaag, wijzig)
  if (!m || !leerstof) return null
  const naam = (id: string) => eenheden?.find((e) => e.id === id)?.naam ?? '…'
  const klaar = les?.klaar
  return (
    <article className={`vd-les${klaar ? ' klaar' : ''}`} style={{ '--mk': m.accent } as CSSProperties}>
      <div className={`vd-les-band lade-${m.id}`}>
        <span className="vd-les-mod">
          {m.icon}
          {m.title}
        </span>
        {klaar && (
          <span className="vd-les-stempel">
            <Check size={14} /> {klaar.goed}/{klaar.totaal}
          </span>
        )}
      </div>
      <div className="vd-les-body">
        {!les ? (
          <div className="vd-skelet" />
        ) : (
          <>
            <h2>
              {les.nieuw.length > 0
                ? leerstof.perDag === 1
                  ? naam(les.nieuw[0])
                  : `${les.nieuw.length} nieuwe ${leerstof.meervoud}`
                : les.herhaal.length > 0
                  ? 'Herhalen'
                  : 'Vandaag niets nieuws'}
            </h2>
            {les.nieuw.length > 1 && <p className="vd-les-namen">{les.nieuw.map(naam).join(' · ')}</p>}
            {les.herhaal.length > 0 && (
              <p className="vd-les-herhaal">
                + {les.herhaal.length} herhaling{les.herhaal.length === 1 ? '' : 'en'}
              </p>
            )}
            {voortgang && (
              <div className="vd-les-voortgang">
                <div className="vd-poco-balk">
                  <i style={{ width: `${(voortgang.gekend / Math.max(voortgang.totaal, 1)) * 100}%` }} />
                </div>
                <span className="tabular">
                  {voortgang.gekend}/{voortgang.totaal} {leerstof.meervoud}
                </span>
              </div>
            )}
            <Link to={`/vandaag/${moduleId}`} className={`vd-knop${klaar ? ' stil' : ''}`}>
              {klaar ? 'Bekijk of ga verder' : 'Begin de les'} <ArrowRight size={16} />
            </Link>
          </>
        )}
      </div>
    </article>
  )
}

