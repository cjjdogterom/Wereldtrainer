import type { Country, TrainerMode } from '../data/countries'

export type ModeStats = {
  correct: number
  wrong: number
  streak: number
  lastSeen: number
}

export type CountryStats = Partial<Record<TrainerMode, ModeStats>>

export type ProgressState = Record<string, CountryStats>

export type AnswerResult = {
  countryId: string
  mode: TrainerMode
  correct: boolean
}

const STORAGE_KEY = 'wereld-trainer-progress-v1'
const MODES: TrainerMode[] = ['landen', 'vlaggen', 'hoofdsteden']

function blankStats(): ModeStats {
  return { correct: 0, wrong: 0, streak: 0, lastSeen: 0 }
}

export function loadProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as ProgressState) : {}
  } catch {
    return {}
  }
}

export function saveProgress(progress: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function applyAnswer(progress: ProgressState, result: AnswerResult): ProgressState {
  const current = progress[result.countryId]?.[result.mode] ?? blankStats()
  const nextStats: ModeStats = {
    correct: current.correct + (result.correct ? 1 : 0),
    wrong: current.wrong + (result.correct ? 0 : 1),
    streak: result.correct ? current.streak + 1 : 0,
    lastSeen: Date.now(),
  }

  return {
    ...progress,
    [result.countryId]: {
      ...progress[result.countryId],
      [result.mode]: nextStats,
    },
  }
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY)
}

export function masteryForCountry(progress: ProgressState, countryId: string) {
  const stats = progress[countryId]
  if (!stats) {
    return 0
  }

  const scores = MODES.map((mode) => masteryForMode(stats[mode]))
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / MODES.length)
}

export function masteryForMode(stats?: ModeStats) {
  if (!stats) {
    return 0
  }

  const attempts = stats.correct + stats.wrong
  if (!attempts) {
    return 0
  }

  const accuracy = stats.correct / attempts
  const experience = Math.min(1, attempts / 6)
  const streakBoost = Math.min(0.2, stats.streak * 0.04)
  return Math.round(Math.min(1, accuracy * 0.8 + experience * 0.2 + streakBoost) * 100)
}

export function summarizeProgress(progress: ProgressState, countries: Country[]) {
  const scores = countries.map((country) => masteryForCountry(progress, country.id))
  const trained = scores.filter((score) => score > 0).length
  const mastered = scores.filter((score) => score >= 80).length
  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0
  return { trained, mastered, average }
}

export function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
}

function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: b.length + 1 }, (_, index) => [index])

  for (let index = 0; index <= a.length; index += 1) {
    matrix[0][index] = index
  }

  for (let row = 1; row <= b.length; row += 1) {
    for (let column = 1; column <= a.length; column += 1) {
      const cost = b[row - 1] === a[column - 1] ? 0 : 1
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost,
      )
    }
  }

  return matrix[b.length][a.length]
}

export function isCloseCapitalAnswer(answer: string, capitals: string[]) {
  const normalizedAnswer = normalizeAnswer(answer)
  if (!normalizedAnswer) {
    return false
  }

  return capitals.some((capital) => {
    const normalizedCapital = normalizeAnswer(capital)
    const allowedErrors = normalizedCapital.length <= 5 ? 1 : normalizedCapital.length <= 10 ? 2 : 3
    return normalizedAnswer === normalizedCapital || levenshtein(normalizedAnswer, normalizedCapital) <= allowedErrors
  })
}

// Fuzzy match for a typed country name (Dutch name, English name, or any alias).
export function isCloseCountryAnswer(answer: string, country: Country): boolean {
  const normalizedAnswer = normalizeAnswer(answer)
  if (!normalizedAnswer) {
    return false
  }

  const candidates = [country.name, country.englishName, ...country.aliases]
  return candidates.some((candidate) => {
    const normalized = normalizeAnswer(candidate)
    if (!normalized) {
      return false
    }
    const allowedErrors = normalized.length <= 5 ? 1 : normalized.length <= 10 ? 2 : 3
    return normalizedAnswer === normalized || levenshtein(normalizedAnswer, normalized) <= allowedErrors
  })
}

export function scoreColor(score: number) {
  if (score >= 80) {
    return '#228b5b'
  }
  if (score >= 50) {
    return '#d89a28'
  }
  if (score > 0) {
    return '#c84b4b'
  }
  return '#cfd6df'
}
