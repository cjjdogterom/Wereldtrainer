import { VOETBAL_BASE } from '../App';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMeta, useDataset } from '../data/DatasetContext';
import EntityLogo from '../components/EntityLogo';
import { entityToSlug } from '../utils/slug';
import { formatYear } from '../utils/format';
import '../styles/Overview.css';

export default function Overview() {
  const dataset = useDataset();
  const base = `${VOETBAL_BASE}/${dataset.id}`;
  const champions = dataset.champions;
  const hasEras = dataset.eras.length > 1;

  const eraLabels = useMemo(() => {
    const map: Record<string, string> = {};
    for (const e of dataset.eras) map[e.key] = e.label;
    return map;
  }, [dataset]);

  const [search, setSearch] = useState('');
  const [eraFilter, setEraFilter] = useState<string>('all');
  const [decade, setDecade] = useState<string>('all');

  const decades = useMemo(() => {
    const set = new Set<string>();
    for (const c of champions) set.add(`${Math.floor(c.year / 10) * 10}s`);
    return ['all', ...Array.from(set).sort()];
  }, [champions]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return champions.filter((c) => {
      if (hasEras && eraFilter !== 'all' && c.era !== eraFilter) return false;

      if (decade !== 'all') {
        const cDecade = `${Math.floor(c.year / 10) * 10}s`;
        if (cDecade !== decade) return false;
      }

      if (!query) return true;

      const meta = c.winner ? getMeta(dataset, c.winner) : null;

      return (
        String(c.year).includes(query) ||
        c.season.toLowerCase().includes(query) ||
        c.winner?.toLowerCase().includes(query) ||
        c.location?.toLowerCase().includes(query) ||
        c.note?.toLowerCase().includes(query) ||
        meta?.mnemonic?.toLowerCase().includes(query)
      );
    });
  }, [search, eraFilter, decade, champions, dataset, hasEras]);

  return (
    <div className="overview-page">
      <div className="page-header">
        <h1>Overzicht {dataset.winnerNounPlural}</h1>
        <p>
          Alle {champions.length} {dataset.editionNounPlural} met hun {dataset.winnerNoun}.
        </p>
      </div>

      <div className="filters">
        <input
          type="search"
          className="search-input"
          placeholder={`Zoek op jaar, ${dataset.entityNoun} of plaats...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {hasEras && (
          <select
            className="filter-select"
            value={eraFilter}
            onChange={(e) => setEraFilter(e.target.value)}
          >
            <option value="all">Alle periodes</option>
            {dataset.eras.map((era) => (
              <option key={era.key} value={era.key}>
                {era.filterLabel}
              </option>
            ))}
          </select>
        )}
        <select
          className="filter-select"
          value={decade}
          onChange={(e) => setDecade(e.target.value)}
        >
          {decades.map((d) => (
            <option key={d} value={d}>
              {d === 'all' ? 'Alle decennia' : d}
            </option>
          ))}
        </select>
      </div>

      <p className="results-count">
        {filtered.length} {filtered.length === 1 ? 'resultaat' : 'resultaten'}
      </p>

      <div className="champions-table-wrapper">
        <table className="champions-table">
          <thead>
            <tr>
              <th>Jaar</th>
              <th>{dataset.entityColumnLabel}</th>
              <th>{dataset.locationColumnLabel}</th>
              {hasEras && <th>Periode</th>}
              <th>Ezelsbruggetje</th>
              <th>Opmerking</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const meta = c.winner ? getMeta(dataset, c.winner) : null;

              return (
                <tr key={c.id} className={c.winner ? '' : 'no-champion'}>
                  <td className="season-cell">{formatYear(c.year)}</td>
                  <td className="club-cell">
                    {c.winner ? (
                      <>
                        <EntityLogo winner={c.winner} size={32} />
                        <Link
                          to={`${base}/winnaars/${entityToSlug(c.winner)}`}
                          className="club-link"
                        >
                          {c.winner}
                        </Link>
                      </>
                    ) : (
                      <span className="no-winner">—</span>
                    )}
                  </td>
                  <td>{c.location ?? '—'}</td>
                  {hasEras && (
                    <td>
                      {c.era && eraLabels[c.era] ? (
                        <span className={`era-tag era-${c.era}`}>{eraLabels[c.era]}</span>
                      ) : (
                        ''
                      )}
                    </td>
                  )}
                  <td className="mnemonic-cell">
                    {meta?.mnemonic ? (
                      <span className="mnemonic-tooltip" title={meta.mnemonicDetail}>
                        {meta.mnemonic}
                      </span>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="note-cell">{c.note ?? ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
