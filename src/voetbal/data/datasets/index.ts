import type { Dataset } from '../../types';
import { eredivisie } from './eredivisie';
import { knvbBeker } from './knvbBeker';
import { championsLeague } from './championsLeague';
import { wereldkampioenschap } from './wereldkampioenschap';
import { europeesKampioenschap } from './europeesKampioenschap';

export const datasets: Dataset[] = [
  eredivisie,
  knvbBeker,
  championsLeague,
  wereldkampioenschap,
  europeesKampioenschap,
];

const datasetMap: Record<string, Dataset> = Object.fromEntries(
  datasets.map((d) => [d.id, d])
);

export function getDataset(id: string | undefined): Dataset | undefined {
  return id ? datasetMap[id] : undefined;
}
