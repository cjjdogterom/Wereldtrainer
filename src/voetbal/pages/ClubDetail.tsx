import { VOETBAL_BASE } from '../App';
import { Link, useParams } from 'react-router-dom';
import { getMeta, useDataset, winnersOnly } from '../data/DatasetContext';
import EntityLogo from '../components/EntityLogo';
import { slugToEntity } from '../utils/slug';
import { formatYear } from '../utils/format';
import '../styles/Clubs.css';

function groupByDecade(titles: { year: number }[]): [string, number][] {
  const map = new Map<string, number>();
  for (const t of titles) {
    const decade = `${Math.floor(t.year / 10) * 10}s`;
    map.set(decade, (map.get(decade) ?? 0) + 1);
  }
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

export default function ClubDetail() {
  const dataset = useDataset();
  const base = `${VOETBAL_BASE}/${dataset.id}`;
  const { slug } = useParams<{ slug: string }>();
  const winnerName = slug ? slugToEntity(slug) : null;

  const eraLabels: Record<string, string> = {};
  for (const e of dataset.eras) eraLabels[e.key] = e.label;

  if (!winnerName) {
    return (
      <div className="clubs-page">
        <p>{dataset.entityNoun} niet gevonden.</p>
        <Link to={`${base}/winnaars`}>← Terug naar {dataset.entityNounPlural}</Link>
      </div>
    );
  }

  const titles = winnersOnly(dataset).filter((c) => c.winner === winnerName);
  const meta = getMeta(dataset, winnerName);

  if (titles.length === 0) {
    return (
      <div className="clubs-page">
        <p>Geen titels gevonden voor {winnerName}.</p>
        <Link to={`${base}/winnaars`}>← Terug naar {dataset.entityNounPlural}</Link>
      </div>
    );
  }

  return (
    <div className="clubs-page">
      <Link to={`${base}/winnaars`} className="back-link">
        ← Alle {dataset.entityNounPlural}
      </Link>

      <div className="club-detail-header">
        <EntityLogo winner={winnerName} size={72} />
        <div>
          <h1>{winnerName}</h1>
          <p className="club-detail-stats">
            {titles.length} {titles.length === 1 ? 'titel' : 'titels'} ({dataset.winnerNounPlural})
          </p>
          <p className="club-detail-range">
            Eerste titel: {formatYear(titles[0].year)} · Laatste titel:{' '}
            {formatYear(titles[titles.length - 1].year)}
          </p>
        </div>
      </div>

      {meta.mnemonic && (
        <div className="mnemonic-card">
          <h2>
            Ezelsbruggetje
          </h2>
          <p className="mnemonic-short">{meta.mnemonic}</p>
          {meta.mnemonicDetail && <p className="mnemonic-detail">{meta.mnemonicDetail}</p>}
        </div>
      )}

      <section className="club-titles-section">
        <h2>Alle titels</h2>
        <div className="club-titles-timeline">
          {titles.map((t) => (
            <div key={t.id} className="title-entry">
              <span className="title-season">{formatYear(t.year)}</span>
              {t.era && eraLabels[t.era] && (
                <span className={`era-tag era-${t.era}`}>{eraLabels[t.era]}</span>
              )}
              {t.note && <span className="title-note">{t.note}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="club-decades">
        <h2>Per decennium</h2>
        <div className="decade-grid">
          {groupByDecade(titles).map(([decade, count]) => (
            <div key={decade} className="decade-card">
              <span className="decade-label">{decade}</span>
              <span className="decade-count">
                {count} {count === 1 ? 'titel' : 'titels'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
