import { VOETBAL_BASE } from '../App';
import { Link } from 'react-router-dom';
import {
  getUniqueWinners,
  getWinnerStats,
  useDataset,
  winnersOnly,
} from '../data/DatasetContext';

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function Home() {
  const dataset = useDataset();
  const base = `${VOETBAL_BASE}/${dataset.id}`;
  const stats = getWinnerStats(dataset);
  const top = stats[0];
  const uniqueWinners = getUniqueWinners(dataset).length;
  const titlesWon = winnersOnly(dataset).length;

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">{dataset.heroBadge}</span>
          <h1>{dataset.heroTitle}</h1>
          <p>{dataset.heroText}</p>
          <div className="hero-actions">
            <Link to={`${base}/overzicht`} className="btn btn-primary">
              Bekijk overzicht
            </Link>
            <Link to={`${base}/overhoren`} className="btn btn-secondary">
              Start overhoring
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">{dataset.champions.length}</span>
            <span className="stat-label">{capitalize(dataset.editionNounPlural)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{titlesWon}</span>
            <span className="stat-label">Gewonnen titels</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{uniqueWinners}</span>
            <span className="stat-label">Unieke {dataset.entityNounPlural}</span>
          </div>
          {top && (
            <div className="stat-card">
              <span className="stat-number">{top.totalTitles}</span>
              <span className="stat-label">Record ({top.winner})</span>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <h2>Wat kun je doen?</h2>
        <div className="feature-grid">
          <Link to={`${base}/overzicht`} className="feature-card">
            <h3>Compleet overzicht</h3>
            <p>Doorzoek en filter alle winnaars per jaar, {dataset.entityNoun} of periode.</p>
          </Link>
          <Link to={`${base}/overhoren`} className="feature-card">
            <h3>Overhoringsmodus</h3>
            <p>Test jezelf met quizzen: wie won welk jaar, en in welk jaar won wie?</p>
          </Link>
          <Link to={`${base}/leren`} className="feature-card">
            <h3>Jaartallen leren</h3>
            <p>Leer stap voor stap, telkens 6 jaren op rij: bekijken, oefenen, door naar de volgende 6.</p>
          </Link>
          <Link to={`${base}/winnaars`} className="feature-card">
            <h3>Per {dataset.entityNoun}</h3>
            <p>Bekijk per {dataset.entityNoun} alle gewonnen titels, met ezelsbruggetjes.</p>
          </Link>
          <Link to={`${base}/statistieken`} className="feature-card">
            <h3>Statistieken</h3>
            <p>Bekijk welke {dataset.entityNounPlural} de meeste titels wonnen.</p>
          </Link>
        </div>
      </section>

      <section className="timeline-preview">
        <h2>Hoogtepunten uit de geschiedenis</h2>
        <div className="timeline">
          {dataset.timeline.map((item) => (
            <div key={item.year} className="timeline-item">
              <span className="timeline-year">{item.year}</span>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
