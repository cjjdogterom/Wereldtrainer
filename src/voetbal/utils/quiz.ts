import { winnersOnly, getTotalTitles } from '../data/DatasetContext';
import { formatYear } from './format';
import type { Champion, Dataset, QuizMode, QuizOrder, QuizQuestion } from '../types';

export interface QuizOptions {
  count: number;
  mode: QuizMode;
  eraFilter: string; // 'all' of een era-sleutel uit de dataset
  order: QuizOrder;
  allYears: boolean;
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createSeasonToClubQuestion(dataset: Dataset, champion: Champion): QuizQuestion {
  return {
    id: `s2c-${champion.id}`,
    type: 'season-to-club',
    question: dataset.questionWinner(formatYear(champion.year)),
    correctAnswer: champion.winner!,
    correctYear: champion.year,
    champion,
  };
}

function createClubToSeasonQuestion(dataset: Dataset, champion: Champion): QuizQuestion {
  const winner = champion.winner!;
  const total = getTotalTitles(dataset, winner);
  const decadeStart = Math.floor(champion.year / 10) * 10;
  const decade = `${decadeStart}–${decadeStart + 9}`;
  const hint = total > 1 ? `Tip: ${decade}.` : '';

  return {
    id: `c2s-${champion.id}`,
    type: 'club-to-season',
    question: dataset.questionYear(winner, hint),
    correctAnswer: formatYear(champion.year),
    correctYear: champion.year,
    champion,
  };
}

function orderPool(pool: Champion[], order: QuizOrder): Champion[] {
  const sorted = [...pool].sort((a, b) => a.year - b.year);
  if (order === 'reverse-chronological') return sorted.reverse();
  if (order === 'chronological') return sorted;
  return shuffle(pool);
}

function resolveQuestionType(mode: QuizMode, index: number): 'season-to-club' | 'club-to-season' {
  if (mode === 'season-to-club') return 'season-to-club';
  if (mode === 'club-to-season') return 'club-to-season';
  return index % 2 === 0 ? 'season-to-club' : 'club-to-season';
}

function filterPool(dataset: Dataset, eraFilter: string): Champion[] {
  const pool = winnersOnly(dataset);
  if (eraFilter === 'all') return pool;
  return pool.filter((c) => c.era === eraFilter);
}

export function getPoolSize(dataset: Dataset, eraFilter: string): number {
  return filterPool(dataset, eraFilter).length;
}

export function generateQuiz(dataset: Dataset, options: QuizOptions): QuizQuestion[] {
  const { mode, eraFilter, order, allYears } = options;

  const pool = filterPool(dataset, eraFilter);
  const ordered = orderPool(pool, order);
  const count = allYears ? pool.length : Math.min(options.count, pool.length);
  const selected = ordered.slice(0, count);

  return selected.map((champion, index) => {
    const type = resolveQuestionType(mode, index);
    return type === 'season-to-club'
      ? createSeasonToClubQuestion(dataset, champion)
      : createClubToSeasonQuestion(dataset, champion);
  });
}

export function getScoreFeedback(percentage: number): string {
  if (percentage === 100) return 'Perfect! Je bent een echte voetbalhistoricus!';
  if (percentage >= 80) return 'Uitstekend! Je kent de winnaars als geen ander.';
  if (percentage >= 60) return 'Goed gedaan! Nog even oefenen en je bent er.';
  if (percentage >= 40) return 'Niet slecht, maar er is ruimte voor verbetering.';
  return 'Tijd om het overzicht nog eens door te nemen!';
}
