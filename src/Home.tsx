import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import './home.css'
import TopBalk from './ui/TopBalk'
import { GROEPEN, MODULES } from './modules'
import { useDagStand } from './dag/useDag'

function begroeting(): string {
  const h = new Date().getHours()
  if (h < 6) return 'Nog wakker'
  if (h < 12) return 'Goedemorgen'
  if (h < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

export default function Home() {
  const { uitslagen, reeks, poco } = useDagStand()
  const totaal = MODULES.length
  const af = MODULES.filter((m) => uitslagen[m.id]).length
  const pct = Math.round((af / totaal) * 100)
  const alles = af >= totaal

  return (
    <div className="hub">
      <TopBalk reeks={reeks} />

      <section className="hub-dag" aria-labelledby="dag-titel">
        <div className="hub-dag-tekst">
          <p className="hub-eyebrow">{begroeting()}</p>
          <h1 id="dag-titel">
            {alles ? 'Je dagprogramma is af.' : af === 0 ? 'Vandaag staan er ' + totaal + ' kaarten klaar.' : `Nog ${totaal - af} te gaan vandaag.`}
          </h1>
          <p className="hub-dag-uitleg">
            Uit elk onderwerp één kaart, plus dertig Spaanse woorden
            {poco.klaar > 0 ? ` (${Math.min(poco.klaar, poco.totaal)} van ${poco.totaal} gedaan)` : ''}. Tien minuten, elke dag.
          </p>
          <Link to="/vandaag" className="hub-start">
            {alles ? 'Bekijk wat je deed' : af === 0 ? 'Begin aan vandaag' : 'Ga verder'} <ArrowRight size={18} />
          </Link>
        </div>

        <div className="hub-dag-ring" style={{ '--pct': pct } as CSSProperties} aria-label={`${af} van ${totaal} af`}>
          <div className="hub-dag-ring-binnen">
            <span className="hub-dag-getal tabular">{af}</span>
            <span className="hub-dag-van">van {totaal}</span>
          </div>
        </div>

        <ul className="hub-dag-chips" aria-label="Onderwerpen van vandaag">
          {MODULES.map((m) => (
            <li
              key={m.id}
              className={`hub-chip ${uitslagen[m.id] ?? ''}`}
              style={{ '--hub-accent': m.accent } as CSSProperties}
              title={m.title}
            >
              <span className="hub-chip-icoon">{uitslagen[m.id] ? <Check size={14} strokeWidth={3} /> : m.icon}</span>
              <span className="hub-chip-naam">{m.title}</span>
            </li>
          ))}
        </ul>
      </section>

      <main className="hub-kast">
        {GROEPEN.map((g) => {
          const leden = MODULES.filter((m) => m.groep === g.id)
          if (!leden.length) return null
          return (
            <section key={g.id} className="hub-plank" aria-labelledby={`plank-${g.id}`}>
              <header className="hub-plank-kop">
                <h2 id={`plank-${g.id}`}>{g.titel}</h2>
                <p>{g.ondertitel}</p>
              </header>
              <div className="hub-laden">
                {leden.map((m) => (
                  <Link key={m.id} to={m.to} className="hub-lade" style={{ '--hub-accent': m.accent } as CSSProperties}>
                    <div className={`hub-lade-front lade-${m.id}`}>
                      <span className="hub-lade-icoon">{m.icon}</span>
                      <span className="hub-lade-greep" aria-hidden="true" />
                      {uitslagen[m.id] && (
                        <span className="hub-lade-vandaag">
                          <Check size={13} strokeWidth={3} /> vandaag
                        </span>
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
