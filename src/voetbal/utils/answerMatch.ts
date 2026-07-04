export type MatchResult = 'exact' | 'fuzzy' | 'wrong';

export interface AnswerCheck {
  result: MatchResult;
  message?: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
    }
  }
  return matrix[b.length][a.length];
}

function isFuzzyMatch(input: string, target: string): boolean {
  const a = normalize(input);
  const b = normalize(target);
  if (!a || !b) return false;
  if (a === b) return true;
  if (b.includes(a) || a.includes(b)) return true;

  const maxLen = Math.max(a.length, b.length);
  const distance = levenshtein(a, b);
  const threshold = maxLen <= 4 ? 1 : maxLen <= 8 ? 2 : 3;
  return distance <= threshold;
}

function getVariants(winner: string, aliases: Record<string, string[]>): string[] {
  return [winner, ...(aliases[winner] ?? [])];
}

export function checkWinnerAnswer(
  input: string,
  correctWinner: string,
  aliases: Record<string, string[]>
): AnswerCheck {
  const normalizedInput = normalize(input);
  if (!normalizedInput) return { result: 'wrong' };

  const variants = getVariants(correctWinner, aliases);

  for (const variant of variants) {
    if (normalize(variant) === normalizedInput) {
      return { result: 'exact' };
    }
  }

  for (const variant of variants) {
    if (isFuzzyMatch(input, variant)) {
      return { result: 'fuzzy', message: 'Bijna goed — kleine spelfout, maar geaccepteerd!' };
    }
  }

  return { result: 'wrong' };
}

export function checkYearAnswer(input: string, correctYear: number): AnswerCheck {
  const trimmed = input.trim();
  const parsed = parseInt(trimmed, 10);

  if (Number.isNaN(parsed)) {
    return { result: 'wrong' };
  }

  if (parsed === correctYear) {
    return { result: 'exact' };
  }

  if (levenshtein(trimmed, String(correctYear)) <= 1) {
    return {
      result: 'fuzzy',
      message: `Bijna goed — het juiste jaar is ${correctYear}.`,
    };
  }

  return { result: 'wrong' };
}

export function checkAnswer(
  input: string,
  correctAnswer: string,
  type: 'season-to-club' | 'club-to-season',
  correctYear: number,
  aliases: Record<string, string[]>
): AnswerCheck {
  if (type === 'season-to-club') {
    return checkWinnerAnswer(input, correctAnswer, aliases);
  }
  return checkYearAnswer(input, correctYear);
}
