import { getWinnerStats, useDataset } from '../data/DatasetContext';
import EntityLogo from '../components/EntityLogo';
import '../styles/Stats.css';

export default function Stats() {
  const dataset = useDataset();
  const stats = getWinnerStats(dataset);
  const maxTitles = stats[0]?.totalTitles ?? 1;
  const multipleWinners = stats.filter((s) => s.totalTitles > 1).length;

  return (
    <div className="stats-page">
      <div className="page-header">
        <h1>Statistieken</h1>
        <p>
          Ranglijst van alle {dataset.entityNounPlural} met minstens één titel.
        </p>
      </div>

      <div className="stats-summary">
        <div className="summary-card">
          <span className="summary-number">{stats.length}</span>
          <span className="summary-label">{dataset.entityNounPlural} met titel</span>
        </div>
        <div className="summary-card highlight">
          <span className="summary-number">{stats[0]?.winner}</span>
          <span className="summary-label">Meeste titels ({stats[0]?.totalTitles})</span>
        </div>
        <div className="summary-card">
          <span className="summary-number">{multipleWinners}</span>
          <span className="summary-label">Met meerdere titels</span>
        </div>
      </div>

      <div className="stats-table-wrapper">
        <table className="stats-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{dataset.entityColumnLabel}</th>
              <th>Totaal</th>
              <th>Eerste titel</th>
              <th>Laatste titel</th>
              <th>Verdeling</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((club, index) => (
              <tr key={club.winner} className={index < 3 ? `top-${index + 1}` : ''}>
                <td className="rank-cell">{index + 1}</td>
                <td className="club-name-cell">

                  <span className="stats-winner">
                    <EntityLogo winner={club.winner} size={24} />
                    {club.winner}
                  </span>
                </td>
                <td className="title-count">{club.totalTitles}</td>
                <td>{club.firstTitle}</td>
                <td>{club.lastTitle}</td>
                <td className="bar-cell">
                  <div className="title-bar">
                    <div
                      className="title-bar-fill"
                      style={{ width: `${(club.totalTitles / maxTitles) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="fun-facts">
        <h2>Wist je dat?</h2>
        <ul>
          {dataset.funFacts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
