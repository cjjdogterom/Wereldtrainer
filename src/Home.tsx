import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import './home.css'
import TopBalk from './ui/TopBalk'
import { GROEPEN, MODULES, MODULE_BY_ID } from './modules'
import { dagSleutel } from './dag/geheugen'
import { roosterVoor } from './dag/rooster'
import { useGeheugen, usePoco } from './dag/useLeer'

function begroeting(): string {
  const h = new Date().getHours()
  if (h < 6) return 'Nog wakker'
  if (h < 12) return 'Goedemorgen'
  if (h < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

export default function Home() {
  const { g, vandaag, reeks } = useGeheugen()
  const poco = usePoco(vandaag)
  const gepland = roosterVoor()
  const klaar = g.dagen[dagSleutel(vandaag)]?.klaar ?? []
  const pocoKlaar = poco.totaal > 0 && poco.klaar >= poco.totaal
  const onderdelen = ['spaans', ...gepland]
  const isKlaar = (id: string) => (id === 'spaans' ? pocoKlaar : klaar.includes(id))
  const af = onderdelen.filter(isKlaar).length
  const pct = Math.round((af / onderdelen.length) * 100)
  const alles = af >= onderdelen.length

  return (
    <div className="hub">
      <TopBalk reeks={reeks} />

      <section className="hub-dag" aria-labelledby="dag-titel">
        <div className="hub-dag-tekst">
          <p className="hub-eyebrow">{begroeting()}</p>
          <h1 id="dag-titel">
            {alles ? 'Je lessen van vandaag zijn af.' : af === 0 ? 'Vandaag leer je:' : `Nog ${onderdelen.length - af} te gaan vandaag.`}
          </h1>
          <p className="hub-dag-uitleg">
            Volgens je weekrooster: Spaans plus {gepland.map((id) => MODULE_BY_ID[id]?.title).join(', ')}. Eerst leerkaarten, dan een korte overhoring — ongeveer een kwartier.
          </p>
          <Link to="/vandaag" className="hub-start">
            {alles ? 'Bekijk je week' : af === 0 ? 'Begin aan vandaag' : 'Ga verder'} <ArrowRight size={18} />
          </Link>
        </div>

        <div className="hub-dag-ring" style={{ '--pct': pct } as CSSProperties} aria-label={`${af} van ${onderdelen.length} af`}>
          <div className="hub-dag-ring-binnen">
            <span className="hub-dag-getal tabular">{af}</span>
            <span className="hub-dag-van">van {onderdelen.length}</span>
          </div>
        </div>

        <ul className="hub-dag-chips" aria-label="Lessen van vandaag">
          {onderdelen.map((id) => {
            const m = MODULE_BY_ID[id]
            if (!m) return null
            return (
              <li key={id} className={`hub-chip${isKlaar(id) ? ' goed' : ''}`} style={{ '--hub-accent': m.accent } as CSSProperties}>
                <span className="hub-chip-icoon">{isKlaar(id) ? <Check size={14} strokeWidth={3} /> : m.icon}</span>
                <span className="hub-chip-naam">{m.title}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <main className="hub-kast">
        {GROEPEN.map((gr) => {
          const leden = MODULES.filter((m) => m.groep === gr.id)
          if (!leden.length) return null
          return (
            <section key={gr.id} className="hub-plank" aria-labelledby={`plank-${gr.id}`}>
              <header className="hub-plank-kop">
                <h2 id={`plank-${gr.id}`}>{gr.titel}</h2>
                <p>{gr.ondertitel}</p>
              </header>
              <div className="hub-laden">
                {leden.map((m) => (
                  <Link key={m.id} to={m.to} className="hub-lade" style={{ '--hub-accent': m.accent } as CSSProperties}>
                    <div className={`hub-lade-front lade-${m.id}`}>
                      <span className="hub-lade-icoon">{m.icon}</span>
                      <span className="hub-lade-greep" aria-hidden="true" />
                      {(gepland.includes(m.id) || m.id === 'spaans') && (
                        <span className="hub-lade-vandaag">{isKlaar(m.id) ? <><Check size={13} strokeWidth={3} /> vandaag</> : 'vandaag'}</span>
                      )}
                    </div>
                    <div className="hub-lade-body">
                      <span className="hub-lade-sub">{m.subtitle}</span>
                      <h3>{m.title}</h3>
                      <p>{m.description}</p>
                      <div className="hub-lade-stats">
                        {m.stats.map((s) => (
                          <span key={s}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </main>

      <footer className="hub-voet">Wereldtrainer · je voortgang reist mee tussen je apparaten</footer>
    </div>
  )
}
