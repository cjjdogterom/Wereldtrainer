import { Link } from 'react-router-dom';
import { datasets } from '../data/datasets';
import { getUniqueWinners, winnersOnly } from '../data/DatasetContext';
import { VOETBAL_BASE } from '../App';
import CompetitionMark from '../components/CompetitionMark';
import '../styles/Trainers.css';

export default function TrainerPicker() {
  return (
    <div className="trainers-page">
      <header className="trainers-hero">
        <Link to="/" className="trainers-back">← Leerapp</Link>
        <p className="trainers-eyebrow">Voetbalwinnaars</p>
        <h1>Kies je competitie</h1>
        <p className="trainers-intro">
          Alle winnaars van het Nederlandse en Europese voetbal sinds 1889 — bekijk de
          erelijsten, leer de jaartallen en overhoor jezelf.
        </p>
      </header>

      <main className="trainers-main">
        <div className="trainers-grid">
          {datasets.map((d) => {
            const titles = winnersOnly(d).length;
            const unique = getUniqueWinners(d).length;

            return (
              <Link key={d.id} to={`${VOETBAL_BASE}/${d.id}`} className="trainer-card">
                <div className="trainer-card-head">
                  <CompetitionMark id={d.id} color={d.theme.primary} size={44} />
                  <div>
                    <h2>{d.title}</h2>
                    <span className="trainer-card-sub" style={{ color: d.theme.primary }}>{d.subtitle}</span>
                  </div>
                </div>
                <p className="trainer-card-desc">{d.cardDescription}</p>
                <div className="trainer-card-stats">
                  <div className="tc-stat">
                    <span className="tc-num">{titles}</span>
                    <span className="tc-label">Titels</span>
                  </div>
                  <div className="tc-stat">
                    <span className="tc-num">{unique}</span>
                    <span className="tc-label">{d.entityNounPlural}</span>
                  </div>
                  <span className="trainer-card-cta" style={{ color: d.theme.primary }}>Open trainer →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="trainers-footer">
        <p>Data gebaseerd op KNVB-historie, UEFA, FIFA en RSSSF · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
