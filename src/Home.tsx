import { Link } from 'react-router-dom'
import { Anchor, Bird, BookOpen, Church, Club, Coins, Crown, Flag, Globe2, Landmark, Lightbulb, MessageCircle, Shield, Spade, Trophy } from 'lucide-react'
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
  {
    to: '/knopen',
    icon: <Anchor size={34} aria-hidden="true" />,
    accent: '#8a5a2b',
    title: 'Nautische knopen',
    subtitle: 'Knopen & steken',
    description: 'De belangrijkste knopen en steken: hoe ze eruitzien, waarvoor je ze gebruikt en waar je op let.',
    stats: ['13 knopen', 'met foto’s'],
  },
  {
    to: '/kerk',
    icon: <Church size={34} aria-hidden="true" />,
    accent: '#6b3a5b',
    title: 'Kerkelijke hiërarchie',
    subtitle: 'Rooms-Katholieke Kerk',
    description: 'Alle posities van paus tot diaken, plus kardinalen, eretitels en de rangorde in kloosterordes.',
    stats: ['van paus tot diaken', 'incl. ordes'],
  },
  {
    to: '/europa',
    icon: <Crown size={34} aria-hidden="true" />,
    accent: '#245c8f',
    title: 'Europa in vogelvlucht',
    subtitle: 'Machtsgeschiedenis',
    description: 'Wie had wanneer de macht in Europa, van de Minoërs en Romeinen tot de EU — bewust beknopt.',
    stats: ['±40 machten', '4000 jaar'],
  },
  {
    to: '/geschiedenis',
    icon: <Landmark size={34} aria-hidden="true" />,
    accent: '#7a4a1f',
    title: 'Geschiedenis van Nederland',
    subtitle: 'Vanaf 1300',
    description: 'Ruim 150 belangrijke gebeurtenissen en personen, van de Hoekse twisten tot nu — leren in blokken en overhoren.',
    stats: ['±150 items', '8 tijdvakken'],
  },
  {
    to: '/vogels',
    icon: <Bird size={34} aria-hidden="true" />,
    accent: '#3a6b35',
    title: 'Vogels van Nederland',
    subtitle: 'Zien & horen',
    description: 'Veertig veelvoorkomende vogels herkennen aan uiterlijk én geluid, met foto\'s en opnames.',
    stats: ['40 soorten', 'foto + geluid'],
  },
  {
    to: '/rangen',
    icon: <Shield size={34} aria-hidden="true" />,
    accent: '#455a64',
    title: 'Rangen en standen',
    subtitle: 'Krijgsmacht · politie · brandweer',
    description: 'De rangordes van marine, mariniers, landmacht, luchtmacht, marechaussee, politie en brandweer — met aanspreektitels.',
    stats: ['7 onderdelen', '±110 rangen'],
  },
  {
    to: '/spaans',
    icon: <MessageCircle size={34} aria-hidden="true" />,
    accent: '#b3541e',
    title: 'Spaans',
    subtitle: 'Taaltrainer',
    description: 'Ruim 290 woorden en zinnen in 15 thema\'s — je voortgang per woord wordt automatisch bewaard.',
    stats: ['15 thema\'s', 'met voortgang'],
  },
  {
    to: '/bridge',
    icon: <Spade size={34} aria-hidden="true" />,
    accent: '#3b5b34',
    title: 'Bridge',
    subtitle: 'Vijfkaart hoog',
    description: 'Complete cursus vanaf nul plus biedtrainers met echte gedeelde handen — na afloop kun je meedoen.',
    stats: ['9 hoofdstukken', '3 trainers'],
  },
  {
    to: '/klaverjas',
    icon: <Club size={34} aria-hidden="true" />,
    accent: '#20614d',
    title: 'Klaverjassen',
    subtitle: 'Amsterdams (verplicht)',
    description: 'Van kaartvolgorde tot roem en nat: leer de Amsterdamse regels en oefen met echte spelsituaties.',
    stats: ['7 hoofdstukken', '4 trainers'],
  },
  {
    to: '/weetjes',
    icon: <Lightbulb size={34} aria-hidden="true" />,
    accent: '#4c3f91',
    title: 'Weetjes',
    subtitle: 'Elke dag iets nieuws',
    description: 'Driehonderd diepe weetjes uit techniek, natuur en wetenschap — met een weetje van de dag, een bibliotheek per vakgebied en overhoren.',
    stats: ['300 weetjes', '±30 vakgebieden'],
  },
  {
    to: '/geld',
    icon: <Coins size={34} aria-hidden="true" />,
    accent: '#8a6d1f',
    title: 'Geldbijnamen',
    subtitle: 'Joet · meier · barkie',
    description: 'De bijnamen van geld — van gulden (heitje, rooie rug) tot euro-straattaal (barkie, mille, meloen) — met hun herkomst en overhoren op bedrag.',
    stats: ['gulden & euro', 'met herkomst'],
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
