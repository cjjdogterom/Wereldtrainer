import { VOETBAL_BASE } from '../App';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMeta, getWinnerStats, useDataset } from '../data/DatasetContext';
import EntityLogo from '../components/EntityLogo';
import { entityToSlug } from '../utils/slug';
import '../styles/Clubs.css';

export default function Clubs() {
  const dataset = useDataset();
  const base = `${VOETBAL_BASE}/${dataset.id}`;
  const [search, setSearch] = useState('');
  const winners = getWinnerStats(dataset);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return winners;
    return winners.filter(
      (c) =>
        c.winner.toLowerCase().includes(q) ||
        getMeta(dataset, c.winner).mnemonic?.toLowerCase().includes(q)
    );
  }, [winners, search, dataset]);

  return (
    <div className="clubs-page">
      <div className="page-header">
        <h1>Overzicht per {dataset.entityNoun}</h1>
        <p>
          Bekijk per {dataset.entityNoun} alle gewonnen titels, met ezelsbruggetjes om
          de jaren te onthouden.
        </p>
      </div>

      <input
        type="search"
        className="search-input"
        placeholder={`Zoek op naam van ${dataset.entityNoun}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="clubs-grid">
        {filtered.map((club) => {
          const meta = getMeta(dataset, club.winner);

          return (
            <Link
              key={club.winner}
              to={`${base}/winnaars/${entityToSlug(club.winner)}`}
              className="club-card"
            >
              <div className="club-card-header">
                <EntityLogo winner={club.winner} size={48} />
                <div>
                  <h3>{club.winner}</h3>
                  <span className="club-title-count">
                    {club.totalTitles} {club.totalTitles === 1 ? 'titel' : 'titels'}
                  </span>
                </div>
              </div>

              <div className="club-seasons-preview">
                {club.seasons.map((s, i) => (
                  <span key={`${s}-${i}`} className="season-chip">
                    {s}
                  </span>
                ))}
              </div>

              {meta.mnemonic && (
                <p className="club-mnemonic-preview">
                  {meta.mnemonic}
                </p>
              )}

              <span className="club-card-link">Bekijk details →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
