// Antwoordcontrole met spelfouttolerantie — gedeeld door alle leermodules.
export type MatchResult = 'exact' | 'fuzzy' | 'wrong'

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = []
  for (let i = 0; i <= b.length; i++) matrix[i] = [i]
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1
    }
  }
  return matrix[b.length][a.length]
}

// Accepteert het getypte antwoord als het (op een kleine spelfout na) op een
// van de goede varianten lijkt.
export function checkTyped(input: string, accepted: string[]): MatchResult {
  const a = normalize(input)
  if (!a) return 'wrong'
  for (const variant of accepted) {
    if (normalize(variant) === a) return 'exact'
  }
  for (const variant of accepted) {
    const b = normalize(variant)
    if (!b) continue
    if (b.length >= 4 && (b.includes(a) || a.includes(b)) && a.length >= Math.min(4, b.length)) return 'fuzzy'
    const maxLen = Math.max(a.length, b.length)
    const threshold = maxLen <= 4 ? 1 : maxLen <= 8 ? 2 : 3
    if (levenshtein(a, b) <= threshold) return 'fuzzy'
  }
  return 'wrong'
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

// n willekeurige afleiders uit een pool, zonder het goede antwoord.
export function distractors<T>(pool: T[], correct: T, n: number, key: (item: T) => string): T[] {
  const correctKey = key(correct)
  return shuffle(pool.filter((item) => key(item) !== correctKey)).slice(0, n)
}
