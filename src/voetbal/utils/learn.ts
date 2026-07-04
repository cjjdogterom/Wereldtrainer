import type { Champion, Dataset } from '../types';
import { winnersOnly } from '../data/DatasetContext';

/** Verdeel alle winnaars (chronologisch) in blokken van `size` opeenvolgende jaren. */
export function getLearnChunks(dataset: Dataset, size: number): Champion[][] {
  const items = [...winnersOnly(dataset)].sort((a, b) => a.year - b.year);
  const chunks: Champion[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/** Kies een willekeurige nog-niet-gekende vraag uit het blok. */
export function pickQuestion(chunk: Champion[], mastered: Set<string>): Champion | null {
  const remaining = chunk.filter((c) => !mastered.has(c.id));
  if (remaining.length === 0) return null;
  const index = Math.floor(Math.random() * remaining.length);
  return remaining[index];
}
