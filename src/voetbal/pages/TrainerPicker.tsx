import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { datasets } from '../data/datasets';
import { getUniqueWinners, winnersOnly } from '../data/DatasetContext';
import { VOETBAL_BASE } from '../App';
import '../styles/Trainers.css';

export default function TrainerPicker() {
  return (
    <div className="trainers-page">
      <header className="trainers-hero">
        <Link to="/" className="trainers-back">← Leerapp</Link>
        <span className="trainers-badge">⚽ Voetbalwinnaars · Overhoringsplatform</span>
        <h1>Kies je trainer</h1>
        <p>
          Leer en overhoor de winnaars van het Nederlandse en Europese voetbal:
          landskampioenen, bekerwinnaars, Europacup/Champions League, en de wereld- en
          Europees kampioenen.
        </p>
      </header>

      <main className="trainers-main">
        <div className="trainers-grid">
          {datasets.map((d) => {
            const accent = { '--card-accent': d.theme.primary } as CSSProperties;
            const titles = winnersOnly(d).length;
            const unique = getUniqueWinners(d).length;

            return (
              <Link key={d.id} to={`${VOETBAL_BASE}/${d.id}`} className="trainer-card" style={accent}>
                <span className="trainer-card-icon">{d.icon}</span>
                <h2>{d.title}</h2>
                <span className="trainer-card-sub">{d.subtitle}</span>
                <p className="trainer-card-desc">{d.cardDescription}</p>
                <div className="trainer-card-stats">
                  <div className="tc-stat">
                    <span className="tc-num">{titles}</span>
                    <span className="tc-label">Titels</span>
                  </div>
                  <div className="tc-stat">
                    <span className="tc-num">{unique}</span>
                    <span className="tc-label">Unieke {d.entityNounPlural}</span>
                  </div>
                </div>
                <span className="trainer-card-cta">Start trainer →</span>
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
