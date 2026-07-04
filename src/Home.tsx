import { Link } from 'react-router-dom'
import { BookOpen, Flag, Globe2, Trophy } from 'lucide-react'
import './home.css'
import { countries } from './data/countries'

// Eén tegel per leermodule. Nieuwe modules: hier een entry toevoegen.
const MODULES = [
  {
    to: '/topografie',
    icon: <Globe2 size={34} aria-hidden="true" />,
    accent: '#0f766e',
    title: 'Topografie',
    subtitle: 'Wereldtrainer',
    description: `Alle ${countries.length} landen: aanwijzen op de kaart, vlaggen en hoofdsteden. Met slim oefenen en examens.`,
    stats: [`${countries.length} landen`, '6 continenten'],
  },
  {
    to: '/voetbal',
    icon: <Trophy size={34} aria-hidden="true" />,
    accent: '#1f4e79',
    title: 'Voetbalwinnaars',
    subtitle: 'Eredivisie & meer',
    description: 'Alle winnaars van de Eredivisie, KNVB Beker, Champions League, het WK en EK — leren en overhoren.',
    stats: ['5 trainers', 'sinds 1889'],
  },
  {
    to: '/seinen',
    icon: <Flag size={34} aria-hidden="true" />,
    accent: '#1e516e',
    title: 'Nautisch seinen',
    subtitle: 'Vlaggen · morse · spelalfabet',
    description: 'De internationale seinvlaggen met hun betekenis, het NAVO-spelalfabet en morsecode.',
    stats: ['26 vlaggen', 'morse A–Z + 0–9'],
  },
]

export default function Home() {
  return (
    <div className="hub">
      <header className="hub-hero">
        <div className="hub-brand">
          <BookOpen size={20} aria-hidden="true" />
          <span>Leerapp</span>
        </div>
        <h1>Wat wil je leren?</h1>
        <p>Kies een onderwerp en begin met oefenen. Je voortgang wordt per onderwerp bewaard.</p>
      </header>

      <main className="hub-grid">
        {MODULES.map((m) => (
          <Link key={m.to} to={m.to} className="hub-card" style={{ '--hub-accent': m.accent } as React.CSSProperties}>
            <span className="hub-card-icon">{m.icon}</span>
            <h2>{m.title}</h2>
            <span className="hub-card-sub">{m.subtitle}</span>
            <p>{m.description}</p>
            <div className="hub-card-stats">
              {m.stats.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <span className="hub-card-cta">Start →</span>
          </Link>
        ))}
      </main>

      <footer className="hub-footer">
        <p>Meer onderwerpen volgen — dit is nog maar het begin.</p>
      </footer>
    </div>
  )
}
