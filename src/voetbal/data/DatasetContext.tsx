import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Dataset, EntityMeta, WinnerStats } from '../types';

const DatasetContext = createContext<Dataset | null>(null);

export function DatasetProvider({
  dataset,
  children,
}: {
  dataset: Dataset;
  children: ReactNode;
}) {
  return <DatasetContext.Provider value={dataset}>{children}</DatasetContext.Provider>;
}

export function useDataset(): Dataset {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error('useDataset moet binnen een DatasetProvider gebruikt worden');
  return ctx;
}

const fallbackMeta: EntityMeta = { color: '#64748b', shortName: '???' };

/** Metadata (kleur, logo, ezelsbruggetje) voor een winnaar binnen een dataset. */
export function getMeta(dataset: Dataset, winner: string | null): EntityMeta {
  if (!winner) return fallbackMeta;
  return (
    dataset.meta[winner] ?? {
      ...fallbackMeta,
      shortName: winner
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 3)
        .toUpperCase(),
    }
  );
}

/** Alle edities met een daadwerkelijke winnaar (geen lege/afgelaste jaren). */
export function winnersOnly(dataset: Dataset) {
  return dataset.champions.filter((c) => c.winner !== null);
}

export function getWinnerStats(dataset: Dataset): WinnerStats[] {
  const map = new Map<string, { total: number; seasons: string[] }>();

  for (const c of winnersOnly(dataset)) {
    const existing = map.get(c.winner!) ?? { total: 0, seasons: [] };
    existing.total += 1;
    existing.seasons.push(String(c.year));
    map.set(c.winner!, existing);
  }

  return Array.from(map.entries())
    .map(([winner, data]) => ({
      winner,
      totalTitles: data.total,
      seasons: data.seasons,
      firstTitle: data.seasons[0],
      lastTitle: data.seasons[data.seasons.length - 1],
    }))
    .sort((a, b) => b.totalTitles - a.totalTitles || a.winner.localeCompare(b.winner));
}

export function getUniqueWinners(dataset: Dataset): string[] {
  return [...new Set(winnersOnly(dataset).map((c) => c.winner!))].sort();
}

export function getTotalTitles(dataset: Dataset, winner: string): number {
  return winnersOnly(dataset).filter((c) => c.winner === winner).length;
}
