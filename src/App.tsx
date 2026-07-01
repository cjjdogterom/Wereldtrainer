import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type FormEvent, type RefObject, type SetStateAction } from 'react'
import { BookOpen, Check, Globe2, GraduationCap, Map as MapIcon, Menu, RotateCcw, Target, X } from 'lucide-react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import mediumGeoUrl from 'world-atlas/countries-50m.json?url'
import worldGeoUrl from 'world-atlas/countries-110m.json?url'
import './App.css'
import { continents, countries, modeLabels, type Continent, type Country, type Routine, type TrainerMode } from './data/countries'
import {
  applyAnswer,
  isCloseCapitalAnswer,
  isCloseCountryAnswer,
  loadProgress,
  masteryForCountry,
  masteryForMode,
  resetProgress,
  saveProgress,
  scoreColor,
  summarizeProgress,
  type ProgressState,
} from './lib/training'
import { fetchShared, saveShared } from './lib/sync'

type Screen = 'oefenen' | 'leren' | 'kaart'
type Clue = 'name' | 'flag' | 'capital' | 'place'
// A concrete question mode used for rendering/answering
type QuestionMode = Exclude<TrainerMode, 'gemengd' | 'oefenen'>
// Modes that have configurable "show as hint" clues
type CluedMode = Exclude<QuestionMode, 'identify' | 'maximaal'>
type ClueSettings = Record<CluedMode, Record<Clue, boolean>>

// How the user answers a Vlaggen question (flag shown, you supply the rest)
type VlagAnswer = 'mc' | 'kaart' | 'hoofdstad' | 'beide'

type Question = {
  country: Country
  mode: QuestionMode
  options: Country[]
  answered: boolean
  correct: boolean | null
  selectedId: string | null
  typedAnswer: string
  capitalCorrect?: boolean | null
  // For mode === 'vlaggen': which answer method this question uses
  answerKind?: VlagAnswer
  // For multi-step modes (maximaal): typed country answer + per-part results
  typedCountry?: string
  flagSelectedId?: string | null
  step?: number
  mapCorrect?: boolean | null
  flagCorrect?: boolean | null
  countryCorrect?: boolean | null
}

const TRAINING_MODES: Exclude<TrainerMode, 'gemengd' | 'oefenen'>[] = ['landen', 'vlaggen', 'hoofdsteden']
const SMALL_COUNTRY_AREA = 3000
const WORLD_MARKER_MAX_AREA = 200
const WORLD_DETAIL_ZOOM = 1.65
const ADVANCE_CORRECT_MS = 1750
const ADVANCE_WRONG_MS = 4000

type SessionStats = Record<string, { correct: number; wrong: number }>

// How often a country must be answered correctly (in one Slim-oefenen batch)
// before it counts as learned. Base is high on purpose so the country really
// sticks; every wrong answer raises the bar further and keeps it coming back.
const OEFEN_REQUIRED_CORRECT = 5
function sessionRequired(stats: SessionStats, id: string): number {
  return OEFEN_REQUIRED_CORRECT + (stats[id]?.wrong ?? 0)
}

function isSessionCountryDone(stats: SessionStats, id: string): boolean {
  return (stats[id]?.correct ?? 0) >= sessionRequired(stats, id)
}

const OEFEN_BATCH_SIZE = 6
const OEFEN_STRONG = 80
type OefenPhase = 'study' | 'quiz' | 'done'

// Pick the weakest not-yet-strong countries that we haven't drilled this run.
// Shuffle first so that countries with the same mastery (e.g. all 0%) come out
// in a random order instead of always alphabetically.
function computeOefenBatch(pool: Country[], progress: ProgressState, seen: Set<string>, size: number): Country[] {
  return shuffle(pool.filter((c) => !seen.has(c.id) && masteryForCountry(progress, c.id) < OEFEN_STRONG))
    .sort((a, b) => masteryForCountry(progress, a.id) - masteryForCountry(progress, b.id))
    .slice(0, size)
}

const CONTINENT_COLORS: Record<Exclude<Continent, 'Wereld'>, string> = {
  Afrika: '#e8c87a',
  Azie: '#7dbe9e',
  Europa: '#7aadd4',
  'Noord-Amerika': '#e09090',
  'Zuid-Amerika': '#b48fd8',
  Oceanie: '#6ecfcf',
}

const CONTINENT_HOVER_COLORS: Record<Exclude<Continent, 'Wereld'>, string> = {
  Afrika: '#d4a84a',
  Azie: '#5aa87e',
  Europa: '#5592bc',
  'Noord-Amerika': '#c47474',
  'Zuid-Amerika': '#9870bc',
  Oceanie: '#4eb3b3',
}

// Groups of flags that are easily confused, with a short Dutch hint per group.
// Used both for smart distractors and the "Gelijkende vlaggen" learn tab.
const SIMILAR_FLAG_SETS: { label: string; hint: string; ids: string[] }[] = [
  { label: 'Rood-wit-blauw, horizontaal', hint: 'Slavische driekleuren — let op de volgorde en het wapen', ids: ['NLD', 'LUX', 'RUS', 'SRB', 'SVK', 'SVN', 'HRV', 'PRY'] },
  { label: 'Groen-wit-rood, verticaal', hint: 'Italië & Mexico — zelfde kleuren als Hongarije/Bulgarije, maar verticaal', ids: ['ITA', 'MEX'] },
  { label: 'Groen-wit-rood, horizontaal', hint: 'Hongarije, Bulgarije, Iran, Tadzjikistan — zelfde kleuren als Italië, maar horizontaal', ids: ['HUN', 'BGR', 'IRN', 'TJK'] },
  { label: 'Groen-wit-oranje, verticaal', hint: 'Ierland & Ivoorkust (gespiegeld), India, Niger', ids: ['IRL', 'CIV', 'IND', 'NER'] },
  { label: 'Blauw-geel-rood, verticaal', hint: 'Roemenië & Tsjaad zijn vrijwel identiek; Moldavië en Andorra hebben een wapen', ids: ['ROU', 'TCD', 'MDA', 'AND'] },
  { label: 'Zwart-geel-rood', hint: 'België (verticaal), Duitsland, Oeganda', ids: ['BEL', 'DEU', 'UGA'] },
  { label: 'Rood-wit, banen of verticaal', hint: 'Indonesië = Monaco; Polen is omgekeerd; Singapore en Malta', ids: ['IDN', 'MCO', 'POL', 'SGP', 'MLT'] },
  { label: 'Rood-wit-rood, banen', hint: 'Oostenrijk, Letland, Libanon; Peru is verticaal', ids: ['AUT', 'LVA', 'LBN', 'PER'] },
  { label: 'Cirkel op een effen veld', hint: 'Japan, Bangladesh, Palau, Laos', ids: ['JPN', 'BGD', 'PLW', 'LAO'] },
  { label: 'Britse vlag in de hoek', hint: 'Australië, Nieuw-Zeeland, Fiji, Tuvalu', ids: ['AUS', 'NZL', 'FJI', 'TUV'] },
  { label: 'Strepen met een kanton', hint: 'VS, Liberia, Maleisië, Togo', ids: ['USA', 'LBR', 'MYS', 'TGO'] },
  { label: 'Halve maan en ster', hint: 'Turkije & Tunesië (rood); Pakistan & Algerije (groen-wit)', ids: ['TUR', 'TUN', 'PAK', 'DZA'] },
  { label: 'Scandinavisch kruis', hint: 'Denemarken, Noorwegen, Zweden, Finland, IJsland', ids: ['DNK', 'NOR', 'SWE', 'FIN', 'ISL'] },
  { label: 'Geel-blauw-rood (Gran Colombia)', hint: 'Colombia, Ecuador, Venezuela', ids: ['COL', 'ECU', 'VEN'] },
  { label: 'Lichtblauw-wit-lichtblauw (Midden-Amerika)', hint: 'Argentinië, El Salvador, Honduras, Nicaragua, Guatemala', ids: ['ARG', 'SLV', 'HND', 'NIC', 'GTM'] },
  { label: 'Wit/rood met getande rand', hint: 'Qatar vs Bahrein', ids: ['QAT', 'BHR'] },
  { label: 'Pan-Arabisch met driehoek', hint: 'Jordanië, Soedan, Zuid-Soedan, VAE, Koeweit', ids: ['JOR', 'SDN', 'SSD', 'ARE', 'KWT'] },
  { label: 'Rood-wit-zwart, banen', hint: 'Arabische bevrijdingskleuren: Egypte, Irak, Jemen, Syrië', ids: ['EGY', 'IRQ', 'YEM', 'SYR'] },
  { label: 'Groen-geel-rood, verticaal (West-Afrika)', hint: 'Mali, Senegal, Guinee, Kameroen', ids: ['MLI', 'SEN', 'GIN', 'CMR'] },
  { label: 'Pan-Afrikaans geel-groen-rood (banen)', hint: 'Ghana, Ethiopië, Bolivia, Litouwen, Myanmar', ids: ['GHA', 'ETH', 'BOL', 'LTU', 'MMR'] },
  { label: 'Driehoek aan de mast', hint: 'Tsjechië, Filipijnen', ids: ['CZE', 'PHL'] },
  { label: 'Rode vlag met geel/groen symbool', hint: 'China, Vietnam, Noord-Macedonië, Marokko', ids: ['CHN', 'VNM', 'MKD', 'MAR'] },
  { label: 'Vijf symmetrische banen', hint: 'Thailand, Costa Rica, Noord-Korea', ids: ['THA', 'CRI', 'PRK'] },
  { label: 'Blauw-wit gestreept', hint: 'Griekenland, Uruguay', ids: ['GRC', 'URY'] },
  { label: 'Zwart-rood-groen met embleem', hint: 'Kenia, Malawi', ids: ['KEN', 'MWI'] },
  { label: 'Lichtblauw met witte ster', hint: 'Somalië, Micronesia', ids: ['SOM', 'FSM'] },
]

const SIMILAR_FLAG_GROUPS = SIMILAR_FLAG_SETS.map((set) => set.ids)

const DEFAULT_CLUES: ClueSettings = {
  landen: { name: true, flag: false, capital: false, place: false },
  vlaggen: { name: true, flag: false, capital: false, place: false },
  hoofdsteden: { name: true, flag: true, capital: false, place: false },
  combo: { name: false, flag: false, capital: false, place: false },
}


function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

function getMode(mode: TrainerMode): Exclude<TrainerMode, 'gemengd' | 'oefenen'> {
  return mode === 'gemengd' || mode === 'oefenen' ? pickRandom(TRAINING_MODES) : mode
}

// For Oefenen mode: pick which base discipline (landen/vlaggen/hoofdsteden) to
// drill for this country. We weight each discipline by how weak the user is at
// it (weaker → more likely), with a baseline so EVERY discipline — including
// location ("waar ligt het") — keeps coming back now and then, and a lot more
// when the user is also getting that one wrong.
function pickOefenDiscipline(
  progress: ProgressState,
  countryId: string,
): Exclude<TrainerMode, 'gemengd' | 'oefenen' | 'combo'> {
  const base = ['landen', 'vlaggen', 'hoofdsteden'] as const
  const weights = base.map((m) => 14 + (100 - masteryForMode(progress[countryId]?.[m])))
  const total = weights.reduce((sum, w) => sum + w, 0)
  let cursor = Math.random() * total
  for (let i = 0; i < base.length; i += 1) {
    cursor -= weights[i]
    if (cursor <= 0) return base[i]
  }
  return base[0]
}

// Overall weakness weight: lower mastery → picked more often.
function oefenWeight(country: Country, progress: ProgressState) {
  return Math.max(1, 110 - masteryForCountry(progress, country.id))
}

function pickOefenCountry(candidates: Country[], progress: ProgressState): Country {
  const weighted = candidates.map((c) => ({ c, w: oefenWeight(c, progress) }))
  const total = weighted.reduce((sum, item) => sum + item.w, 0)
  let cursor = Math.random() * total
  for (const item of weighted) {
    cursor -= item.w
    if (cursor <= 0) return item.c
  }
  return weighted[0].c
}

function countryWeight(country: Country, progress: ProgressState, mode: Exclude<TrainerMode, 'gemengd' | 'oefenen'>, routine: Routine) {
  const stats = progress[country.id]?.[mode]
  const mastery = masteryForMode(stats)
  const wrong = stats?.wrong ?? 0
  const correct = stats?.correct ?? 0

  if (routine === 'fouten') {
    return wrong > correct ? 12 + wrong * 2 : 0.2
  }

  if (routine === 'slim') {
    return Math.max(1, 120 - mastery)
  }

  if (routine === 'snel') {
    return Math.max(1, 90 - mastery)
  }

  return 1
}

function weightedPick(items: Country[], progress: ProgressState, mode: Exclude<TrainerMode, 'gemengd' | 'oefenen'>, routine: Routine) {
  const weighted = items.map((country) => ({
    country,
    weight: countryWeight(country, progress, mode, routine),
  }))
  const total = weighted.reduce((sum, item) => sum + item.weight, 0)
  let cursor = Math.random() * total

  for (const item of weighted) {
    cursor -= item.weight
    if (cursor <= 0) {
      return item.country
    }
  }

  return weighted[0].country
}

function flagSimilarityScore(target: Country, candidate: Country) {
  if (target.id === candidate.id) {
    return -1
  }

  const sameGroup = SIMILAR_FLAG_GROUPS.some((group) => group.includes(target.id) && group.includes(candidate.id))
  const sameSubregion = target.subregion === candidate.subregion
  const sameContinent = target.continent === candidate.continent
  const distance = Math.hypot(target.latlng[0] - candidate.latlng[0], target.latlng[1] - candidate.latlng[1])

  return (sameGroup ? 1000 : 0) + (sameSubregion ? 220 : 0) + (sameContinent ? 80 : 0) - distance
}

function buildOptions(pool: Country[], country: Country, mode: Exclude<TrainerMode, 'gemengd' | 'oefenen'>) {
  if (mode !== 'vlaggen') {
    return shuffle([country, ...shuffle(pool.filter((item) => item.id !== country.id)).slice(0, 3)])
  }

  const exactGroup = SIMILAR_FLAG_GROUPS.find((group) => group.includes(country.id)) ?? []
  const exactCandidates = shuffle(pool.filter((item) => item.id !== country.id && exactGroup.includes(item.id)))
  const candidates = pool
    .filter((item) => item.id !== country.id)
    .sort((a, b) => flagSimilarityScore(country, b) - flagSimilarityScore(country, a))
  const mergedCandidates = Array.from(new Map([...exactCandidates, ...candidates].map((item) => [item.id, item])).values())

  return shuffle([country, ...mergedCandidates.slice(0, 3)])
}

function emptyQuestion(country: Country, mode: QuestionMode, options: Country[]): Question {
  return {
    country,
    mode,
    options,
    answered: false,
    correct: null,
    selectedId: null,
    typedAnswer: '',
    typedCountry: '',
    flagSelectedId: null,
    step: 0,
  }
}

function optionsForMode(pool: Country[], country: Country, mode: QuestionMode): Country[] {
  if (mode === 'maximaal') return buildOptions(pool, country, 'vlaggen')
  if (mode === 'combo' || mode === 'identify') return []
  return buildOptions(pool, country, mode)
}

function buildQuestion(pool: Country[], progress: ProgressState, selectedMode: TrainerMode): Question {
  const mode = getMode(selectedMode)
  const country =
    mode === 'identify' || mode === 'maximaal' ? pickOefenCountry(pool, progress) : weightedPick(pool, progress, mode, 'slim')
  return emptyQuestion(country, mode, optionsForMode(pool, country, mode))
}

function buildQuestionForCountry(pool: Country[], country: Country, selectedMode: TrainerMode): Question {
  const mode = getMode(selectedMode)
  return emptyQuestion(country, mode, optionsForMode(pool, country, mode))
}

// Oefenen-mode question: drill the given country in the discipline it is weakest at.
function buildOefenQuestion(optionsPool: Country[], country: Country, progress: ProgressState): Question {
  const mode = pickOefenDiscipline(progress, country.id)
  return {
    country,
    mode,
    options: buildOptions(optionsPool, country, mode),
    answered: false,
    correct: null,
    selectedId: null,
    typedAnswer: '',
  }
}

// Stamp the chosen Vlaggen answer-method onto a freshly built question.
function withVlag(question: Question, vlagAnswer: VlagAnswer): Question {
  return question.mode === 'vlaggen' ? { ...question, answerKind: vlagAnswer } : question
}

// The Vlaggen answer method for a question (null for non-vlaggen questions).
function vlagKindOf(question: Question): VlagAnswer | null {
  return question.mode === 'vlaggen' ? question.answerKind ?? 'mc' : null
}

// Does answering require BOTH clicking the country and typing the capital?
function isBothAnswer(question: Question): boolean {
  return question.mode === 'combo' || vlagKindOf(question) === 'beide'
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const onChange = () => setMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return mobile
}

function App() {
  const [screen, setScreen] = useState<Screen>('oefenen')
  const [continent, setContinent] = useState<Continent>('Wereld')
  const [mode, setMode] = useState<TrainerMode>('vlaggen')
  const [vlagAnswer, setVlagAnswer] = useState<VlagAnswer>('mc')
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const repeatQueueRef = useRef<string[]>([])
  const [repeatQueue, setRepeatQueue] = useState<string[]>([])
  // How many more correct answers each wrong country still owes before it stops
  // returning in endless practice (2 on a miss). Keeps mistakes coming back.
  const repeatDebtRef = useRef<Map<string, number>>(new Map())
  const questionsUntilRepeatRef = useRef(3)
  const [clues] = useState<ClueSettings>(DEFAULT_CLUES)
  const [previousQuestion, setPreviousQuestion] = useState<Question | null>(null)
  const [showPreviousQuestion, setShowPreviousQuestion] = useState(false)
  const [session, setSession] = useState<SessionStats | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const isMobile = useIsMobile()
  const progressRef = useRef(progress)

  // ─── Quiz setup / wizard ───
  const [quizStarted, setQuizStarted] = useState(false)
  const [format, setFormat] = useState<'practice' | 'exam'>('practice')
  const [useFocusPool, setUseFocusPool] = useState(false)
  // Exam run state
  const [examQueue, setExamQueue] = useState<Country[]>([])
  const examIdxRef = useRef(0)
  const [examResults, setExamResults] = useState<Array<{ id: string; correct: boolean }>>([])
  const [examDone, setExamDone] = useState(false)

  // ─── Oefenen (smart study) state ───
  const [oefenPhase, setOefenPhase] = useState<OefenPhase>('study')
  const [oefenBatch, setOefenBatch] = useState<Country[]>([])
  const [oefenStats, setOefenStats] = useState<SessionStats>({})
  const [oefenRound, setOefenRound] = useState(1)
  const oefenSeenRef = useRef<Set<string>>(new Set())
  // Slim-oefenen "seen this cycle" per area (continent / focus), synced across devices
  const seenMapRef = useRef<Record<string, Set<string>>>({})
  const syncLoadedRef = useRef(false)

  const persistShared = useCallback(() => {
    if (!syncLoadedRef.current) return
    const oefenSeen: Record<string, string[]> = {}
    for (const [k, s] of Object.entries(seenMapRef.current)) oefenSeen[k] = [...s]
    // local mirror so the cycle survives a reload even before KV is enabled
    try {
      localStorage.setItem('wt-oefenseen-v1', JSON.stringify(oefenSeen))
    } catch {
      /* ignore */
    }
    saveShared({ v: 1, progress: progressRef.current, oefenSeen, updatedAt: Date.now() })
  }, [])

  const basePool = useMemo(
    () => (continent === 'Wereld' ? countries : countries.filter((country) => country.continent === continent)),
    [continent],
  )
  // "Mijn zwakke landen": the weakest (mastery < 80) within the chosen area.
  const focusPool = useMemo(
    () =>
      [...basePool]
        .filter((c) => masteryForCountry(progress, c.id) < OEFEN_STRONG)
        .sort((a, b) => masteryForCountry(progress, a.id) - masteryForCountry(progress, b.id))
        .slice(0, 40),
    [basePool, progress],
  )
  const pool = useFocusPool && focusPool.length > 0 ? focusPool : basePool

  const sessionActivePool = useMemo(
    () => (session !== null ? pool.filter((c) => !isSessionCountryDone(session, c.id)) : null),
    [session, pool],
  )
  const sessionComplete = session !== null && (sessionActivePool?.length ?? 1) === 0
  const activePool = sessionActivePool !== null && sessionActivePool.length > 0 ? sessionActivePool : pool

  const [question, setQuestion] = useState<Question>(() => withVlag(buildQuestion(countries, progress, 'vlaggen'), 'mc'))

  const summary = useMemo(() => summarizeProgress(progress, pool), [pool, progress])
  const weakestCountries = useMemo(
    () =>
      [...pool]
        .sort((a, b) => masteryForCountry(progress, a.id) - masteryForCountry(progress, b.id))
        .slice(0, 8),
    [pool, progress],
  )

  useEffect(() => {
    progressRef.current = progress
    saveProgress(progress)
    persistShared()
  }, [progress, persistShared])

  // On load, pull the shared (cross-device) state; fall back to local if the
  // store isn't set up yet. Guard so we don't overwrite the remote before load.
  useEffect(() => {
    let cancelled = false
    fetchShared().then((shared) => {
      if (cancelled) {
        syncLoadedRef.current = true
        return
      }
      if (shared) {
        const map: Record<string, Set<string>> = {}
        for (const [k, ids] of Object.entries(shared.oefenSeen ?? {})) map[k] = new Set(ids)
        seenMapRef.current = map
        if (shared.progress) {
          progressRef.current = shared.progress
          setProgress(shared.progress)
        }
      } else {
        // No shared store yet — restore the local cycle mirror
        try {
          const raw = localStorage.getItem('wt-oefenseen-v1')
          if (raw) {
            const parsed = JSON.parse(raw) as Record<string, string[]>
            const map: Record<string, Set<string>> = {}
            for (const [k, ids] of Object.entries(parsed)) map[k] = new Set(ids)
            seenMapRef.current = map
          }
        } catch {
          /* ignore */
        }
      }
      syncLoadedRef.current = true
    })
    return () => {
      cancelled = true
    }
  }, [])

  const oefenActivePool = useMemo(
    () => oefenBatch.filter((c) => !isSessionCountryDone(oefenStats, c.id)),
    [oefenBatch, oefenStats],
  )

  // Configure + start a quiz from the wizard. Computes its pool from the config
  // directly (state setters are async) so the first question is correct.
  const startQuiz = useCallback(
    (cfg: { continent: Continent; mode: TrainerMode; vlagAnswer: VlagAnswer; useFocusPool: boolean; format: 'practice' | 'exam' }) => {
      setContinent(cfg.continent)
      setMode(cfg.mode)
      setVlagAnswer(cfg.vlagAnswer)
      setUseFocusPool(cfg.useFocusPool)
      setFormat(cfg.format)
      repeatQueueRef.current = []
      setRepeatQueue([])
      repeatDebtRef.current.clear()
      questionsUntilRepeatRef.current = 3
      setSession(null)
      setPreviousQuestion(null)
      setShowPreviousQuestion(false)
      setExamResults([])
      setExamDone(false)
      examIdxRef.current = 0

      const base = cfg.continent === 'Wereld' ? countries : countries.filter((c) => c.continent === cfg.continent)
      const focus = [...base]
        .filter((c) => masteryForCountry(progressRef.current, c.id) < OEFEN_STRONG)
        .sort((a, b) => masteryForCountry(progressRef.current, a.id) - masteryForCountry(progressRef.current, b.id))
        .slice(0, 40)
      const startPool = cfg.useFocusPool && focus.length > 0 ? focus : base

      if (cfg.mode === 'oefenen') {
        // Continue the cycle: keep the persisted "seen" set for this area so
        // countries that were already covered don't return until all others have.
        const areaKey = cfg.continent + (cfg.useFocusPool ? ':focus' : '')
        if (!seenMapRef.current[areaKey]) seenMapRef.current[areaKey] = new Set()
        oefenSeenRef.current = seenMapRef.current[areaKey]
        let batch = computeOefenBatch(startPool, progressRef.current, oefenSeenRef.current, OEFEN_BATCH_SIZE)
        // Cycle finished but weak countries remain → start a fresh cycle
        if (batch.length === 0 && startPool.some((c) => masteryForCountry(progressRef.current, c.id) < OEFEN_STRONG)) {
          oefenSeenRef.current.clear()
          batch = computeOefenBatch(startPool, progressRef.current, oefenSeenRef.current, OEFEN_BATCH_SIZE)
        }
        persistShared()
        setOefenBatch(batch)
        setOefenStats({})
        setOefenRound(1)
        setOefenPhase(batch.length > 0 ? 'study' : 'done')
      } else if (cfg.format === 'exam') {
        const queue = shuffle(startPool)
        setExamQueue(queue)
        setQuestion(withVlag(buildQuestionForCountry(startPool, queue[0], cfg.mode), cfg.vlagAnswer))
      } else {
        setQuestion(withVlag(buildQuestion(startPool, progressRef.current, cfg.mode), cfg.vlagAnswer))
      }
      setQuizStarted(true)
    },
    [],
  )

  const beginOefenQuiz = useCallback(() => {
    if (oefenBatch.length === 0) return
    const first = pickOefenCountry(oefenBatch, progressRef.current)
    setQuestion(withVlag(buildOefenQuestion(pool, first, progressRef.current), vlagAnswer))
    setOefenPhase('quiz')
    setShowPreviousQuestion(false)
  }, [oefenBatch, pool, vlagAnswer])

  const nextQuestion = useCallback(() => {
    if (question.answered) {
      setPreviousQuestion(question)
    }
    setShowPreviousQuestion(false)

    // ─── Exam: one pass through every country, then show the score ───
    if (format === 'exam') {
      const nextIdx = examIdxRef.current + 1
      if (nextIdx >= examQueue.length) {
        setExamDone(true)
        return
      }
      examIdxRef.current = nextIdx
      setQuestion(withVlag(buildQuestionForCountry(pool, examQueue[nextIdx], mode), vlagAnswer))
      return
    }

    // ─── Oefenen mode: stay within the current batch, then load the next one ───
    if (mode === 'oefenen') {
      const stillDue = oefenBatch.filter((c) => !isSessionCountryDone(oefenStats, c.id))
      if (stillDue.length > 0) {
        setQuestion(withVlag(buildOefenQuestion(pool, pickOefenCountry(stillDue, progress), progress), vlagAnswer))
        return
      }
      // Batch finished — mark these countries as drilled (persisted per area) and grab the next batch.
      oefenBatch.forEach((c) => oefenSeenRef.current.add(c.id))
      let next = computeOefenBatch(pool, progress, oefenSeenRef.current, OEFEN_BATCH_SIZE)
      // Whole cycle covered but weak countries remain → start a fresh cycle.
      if (next.length === 0 && pool.some((c) => masteryForCountry(progress, c.id) < OEFEN_STRONG)) {
        oefenSeenRef.current.clear()
        next = computeOefenBatch(pool, progress, oefenSeenRef.current, OEFEN_BATCH_SIZE)
      }
      persistShared()
      if (next.length === 0) {
        setOefenPhase('done')
        return
      }
      setOefenBatch(next)
      setOefenStats({})
      setOefenRound((r) => r + 1)
      setOefenPhase('study')
      return
    }

    if (session !== null && (sessionActivePool?.length ?? 1) === 0) return

    questionsUntilRepeatRef.current -= 1

    if (questionsUntilRepeatRef.current <= 0 && repeatQueueRef.current.length > 0) {
      questionsUntilRepeatRef.current = 3
      // Re-ask the oldest still-outstanding mistake and rotate it to the back so
      // the others get a turn too. It only leaves the queue once its debt is paid
      // off (see recordResult), so wrong answers keep coming back until learned.
      const idx = repeatQueueRef.current.findIndex((id) => activePool.some((c) => c.id === id))
      if (idx !== -1) {
        const id = repeatQueueRef.current[idx]
        repeatQueueRef.current = [
          ...repeatQueueRef.current.slice(0, idx),
          ...repeatQueueRef.current.slice(idx + 1),
          id,
        ]
        setRepeatQueue([...repeatQueueRef.current])
        const picked = activePool.find((c) => c.id === id)!
        setQuestion(withVlag(buildQuestionForCountry(activePool, picked, mode), vlagAnswer))
        return
      }
    }

    if (questionsUntilRepeatRef.current <= 0) {
      questionsUntilRepeatRef.current = 3
    }

    setQuestion(withVlag(buildQuestion(activePool, progress, mode), vlagAnswer))
  }, [mode, activePool, progress, question, session, sessionActivePool, oefenBatch, oefenStats, pool, vlagAnswer, format, examQueue])

  useEffect(() => {
    if (!question.answered) {
      return
    }
    // In Oefenen mode the quiz pauses on the study/done screens.
    if (mode === 'oefenen' && oefenPhase !== 'quiz') {
      return
    }

    const delay = question.correct ? ADVANCE_CORRECT_MS : ADVANCE_WRONG_MS
    const timeout = window.setTimeout(() => {
      nextQuestion()
    }, delay)

    return () => window.clearTimeout(timeout)
  }, [nextQuestion, question, mode, oefenPhase])

  // Record one or more discipline results for the current country, plus the
  // session / oefen / repeat-queue bookkeeping based on the overall outcome.
  function recordResult(overallCorrect: boolean, parts: Array<{ mode: TrainerMode; correct: boolean }>) {
    const id = question.country.id
    setProgress((current) => parts.reduce((acc, p) => applyAnswer(acc, { countryId: id, mode: p.mode, correct: p.correct }), current))
    if (format === 'exam') {
      setExamResults((prev) => [...prev, { id, correct: overallCorrect }])
    } else if (mode === 'oefenen') {
      setOefenStats((prev) => {
        const old = prev[id] ?? { correct: 0, wrong: 0 }
        return { ...prev, [id]: { correct: old.correct + (overallCorrect ? 1 : 0), wrong: old.wrong + (overallCorrect ? 0 : 1) } }
      })
    } else if (!overallCorrect) {
      // Endless practice: a miss must be answered correctly twice before it stops
      // returning. Queue it (at the back) and (re)set its debt.
      repeatDebtRef.current.set(id, 2)
      repeatQueueRef.current = [...repeatQueueRef.current.filter((x) => x !== id), id]
      setRepeatQueue([...repeatQueueRef.current])
    } else if (repeatDebtRef.current.has(id)) {
      // Correct on a country we were still drilling: pay down its repeat debt.
      const left = (repeatDebtRef.current.get(id) ?? 0) - 1
      if (left <= 0) {
        repeatDebtRef.current.delete(id)
        repeatQueueRef.current = repeatQueueRef.current.filter((x) => x !== id)
        setRepeatQueue([...repeatQueueRef.current])
      } else {
        repeatDebtRef.current.set(id, left)
      }
    }
    if (session !== null) {
      setSession((prev) => {
        if (prev === null) return prev
        const old = prev[id] ?? { correct: 0, wrong: 0 }
        return { ...prev, [id]: { correct: old.correct + (overallCorrect ? 1 : 0), wrong: old.wrong + (overallCorrect ? 0 : 1) } }
      })
    }
  }

  function recordAnswer(correct: boolean) {
    recordResult(correct, [{ mode: question.mode, correct }])
  }

  // Maximaal: pick the flag (step 2 of 3)
  function chooseFlag(countryId: string) {
    if (question.answered) return
    const flagCorrect = countryId === question.country.id
    setQuestion((current) => ({ ...current, flagSelectedId: countryId, flagCorrect, step: 2 }))
  }

  // Identify: location is shown, the user types the country + the capital
  function submitIdentify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (question.answered) {
      nextQuestion()
      return
    }
    const countryCorrect = isCloseCountryAnswer(question.typedCountry ?? '', question.country)
    const capitalCorrect = isCloseCapitalAnswer(question.typedAnswer, question.country.capitals)
    const correct = countryCorrect && capitalCorrect
    setQuestion((current) => ({ ...current, answered: true, correct, countryCorrect, capitalCorrect }))
    recordResult(correct, [
      { mode: 'landen', correct: countryCorrect },
      { mode: 'hoofdsteden', correct: capitalCorrect },
    ])
  }

  function chooseOption(countryId: string) {
    if (question.answered) {
      return
    }

    // Maximaal: step 0 is pointing the country on the map → advance to the flag step
    if (question.mode === 'maximaal') {
      if (question.step !== 0 || question.selectedId !== null) return
      const mapCorrect = countryId === question.country.id
      setQuestion((current) => ({ ...current, selectedId: countryId, mapCorrect, step: 1 }))
      return
    }

    // map + capital flows (combo, vlaggen "beide"): first click only picks the country
    if (isBothAnswer(question)) {
      if (question.selectedId !== null) return
      setQuestion((current) => ({ ...current, selectedId: countryId }))
      return
    }

    const correct = countryId === question.country.id
    setQuestion((current) => ({ ...current, answered: true, correct, selectedId: countryId }))
    recordAnswer(correct)
  }

  function submitCapital(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (question.answered) {
      nextQuestion()
      return
    }

    // Maximaal: final step — capital typed; grade map + flag + capital together
    if (question.mode === 'maximaal') {
      if (question.step !== 2) return
      const capitalCorrect = isCloseCapitalAnswer(question.typedAnswer, question.country.capitals)
      const mapCorrect = question.mapCorrect ?? false
      const flagCorrect = question.flagCorrect ?? false
      const correct = mapCorrect && flagCorrect && capitalCorrect
      setQuestion((current) => ({ ...current, answered: true, correct, capitalCorrect }))
      recordResult(correct, [
        { mode: 'landen', correct: mapCorrect },
        { mode: 'vlaggen', correct: flagCorrect },
        { mode: 'hoofdsteden', correct: capitalCorrect },
      ])
      return
    }

    if (isBothAnswer(question)) {
      if (question.selectedId === null) return
      const capitalCorrect = isCloseCapitalAnswer(question.typedAnswer, question.country.capitals)
      const mapCorrect = question.selectedId === question.country.id
      const correct = capitalCorrect && mapCorrect
      setQuestion((current) => ({ ...current, answered: true, correct, capitalCorrect }))
      recordAnswer(correct)
      return
    }

    const correct = isCloseCapitalAnswer(question.typedAnswer, question.country.capitals)
    setQuestion((current) => ({ ...current, answered: true, correct }))
    recordAnswer(correct)
  }

  function clearProgress() {
    resetProgress()
    setProgress({})
    setSession(null)
    repeatQueueRef.current = []
    setRepeatQueue([])
    repeatDebtRef.current.clear()
    questionsUntilRepeatRef.current = 3
    // Reset the shared Slim-oefenen cycle too (the progress effect persists it)
    seenMapRef.current = {}
    oefenSeenRef.current = new Set()
    if (mode === 'oefenen') {
      const batch = computeOefenBatch(pool, {}, oefenSeenRef.current, OEFEN_BATCH_SIZE)
      setOefenBatch(batch)
      setOefenStats({})
      setOefenRound(1)
      setOefenPhase(batch.length > 0 ? 'study' : 'done')
    }
  }

  function stopSession() {
    setSession(null)
  }

  // A live quiz question is on screen (not the wizard, study/done or exam result)
  const quizQuestionActive =
    screen === 'oefenen' &&
    quizStarted &&
    !(format === 'exam' && examDone) &&
    !(mode === 'oefenen' && oefenPhase !== 'quiz')
  // On phones that becomes a full-screen, chrome-free experience
  const immersive = isMobile && quizQuestionActive

  return (
    <main className={`app-shell${immersive ? ' app-immersive' : ''}`}>

      <aside className="sidebar" aria-label="Instellingen">
        {/* sidebar-head: always visible; on mobile = compact top bar */}
        <div className="sidebar-head">
          <div className="brand">
            <Globe2 size={28} aria-hidden="true" />
            <div>
              <h1>Wereldtrainer</h1>
              <p>{countries.length} landen om te leren</p>
            </div>
          </div>
          <button
            className="sidebar-toggle"
            type="button"
            onClick={() => setSettingsOpen((s) => !s)}
            aria-label="Instellingen openen"
            aria-expanded={settingsOpen}
          >
            <Menu size={20} aria-hidden="true" />
            Instellingen
          </button>
        </div>

        {/* sidebar-body: always visible on desktop; drawer overlay on mobile */}
        <div className={`sidebar-body${settingsOpen ? ' is-open' : ''}`}>
          <button className="drawer-close" type="button" onClick={() => setSettingsOpen(false)}>
            <X size={18} aria-hidden="true" /> Sluiten
          </button>

          {screen !== 'oefenen' && (
            <section className="control-group" aria-labelledby="continent-title">
              <h2 id="continent-title">Gebied</h2>
              <div className="button-grid">
                {continents.map((item) => (
                  <button className={item === continent ? 'is-active' : ''} type="button" key={item} onClick={() => { setContinent(item); setSettingsOpen(false) }}>
                    {item}
                  </button>
                ))}
              </div>
            </section>
          )}

          <nav className="nav-tabs" aria-label="Schermen">
            <button className={screen === 'oefenen' ? 'is-active' : ''} type="button" onClick={() => { setScreen('oefenen'); setSettingsOpen(false) }} title="Oefenen">
              <Target size={18} aria-hidden="true" />
              Oefenen
            </button>
            <button className={screen === 'leren' ? 'is-active' : ''} type="button" onClick={() => { setScreen('leren'); setSettingsOpen(false) }} title="Leren">
              <BookOpen size={18} aria-hidden="true" />
              Leren
            </button>
            <button className={screen === 'kaart' ? 'is-active' : ''} type="button" onClick={() => { setScreen('kaart'); setSettingsOpen(false) }} title="Kaart">
              <MapIcon size={18} aria-hidden="true" />
              Kaart
            </button>
          </nav>

          <div className="summary">
            <div>
              <strong>{summary.average}%</strong>
              <span>gemiddeld</span>
            </div>
            <div>
              <strong>{summary.mastered}</strong>
              <span>sterk</span>
            </div>
            <div>
              <strong>{summary.trained}</strong>
              <span>geoefend</span>
            </div>
          </div>

          <button className="reset-button" type="button" onClick={clearProgress}>
            <RotateCcw size={16} aria-hidden="true" />
            Voortgang wissen
          </button>
        </div>
      </aside>

      <section className={`workspace workspace-${screen}`}>
        {screen === 'oefenen' && !quizStarted && (
          <QuizWizard continent={continent} setContinent={setContinent} progress={progress} onStart={startQuiz} />
        )}

        {screen === 'oefenen' && quizStarted && format === 'exam' && examDone && (
          <ExamResultPanel
            results={examResults}
            onRestart={() => startQuiz({ continent, mode, vlagAnswer, useFocusPool, format: 'exam' })}
            onNew={() => setQuizStarted(false)}
          />
        )}

        {screen === 'oefenen' && quizStarted && !(format === 'exam' && examDone) && (
          <div className="quiz-running">
            <button type="button" className="new-quiz-btn" onClick={() => setQuizStarted(false)}>
              ← Andere overhoring
            </button>
            {format === 'exam' && (
              <div className="exam-progress">
                <div className="exam-progress-bar">
                  <div className="exam-progress-fill" style={{ width: `${examQueue.length ? Math.round((examResults.length / examQueue.length) * 100) : 0}%` }} />
                </div>
                <span>{examResults.length} / {examQueue.length}</span>
              </div>
            )}
            <PracticePanel
              continent={continent}
              countries={pool}
              clues={clues}
              previousQuestion={previousQuestion}
              showPreviousQuestion={showPreviousQuestion}
              question={question}
              repeatQueue={repeatQueue}
              chooseOption={chooseOption}
              chooseFlag={chooseFlag}
              submitCapital={submitCapital}
              submitIdentify={submitIdentify}
              setQuestion={setQuestion}
              nextQuestion={nextQuestion}
              setShowPreviousQuestion={setShowPreviousQuestion}
              session={session}
              sessionComplete={sessionComplete}
              sessionActivePool={sessionActivePool}
              onStopSession={stopSession}
              selectedMode={mode}
              progress={progress}
              oefenPhase={oefenPhase}
              oefenBatch={oefenBatch}
              oefenRound={oefenRound}
              oefenActivePool={oefenActivePool}
              onBeginOefenQuiz={beginOefenQuiz}
              onClose={() => setQuizStarted(false)}
              format={format}
              examAnswered={examResults.length}
              examTotal={examQueue.length}
            />
          </div>
        )}

        {screen === 'leren' && <LearnPanel continent={continent} countries={pool} progress={progress} />}

        {screen === 'kaart' && <MapPanel continent={continent} countries={pool} progress={progress} weakestCountries={weakestCountries} />}
      </section>

      {/* Mobile-only bottom navigation */}
      <nav className="mobile-bottom-nav" aria-label="Schermen">
        <button className={screen === 'oefenen' ? 'is-active' : ''} type="button" onClick={() => setScreen('oefenen')}>
          <Target size={22} aria-hidden="true" />
          <span>Oefenen</span>
        </button>
        <button className={screen === 'leren' ? 'is-active' : ''} type="button" onClick={() => setScreen('leren')}>
          <BookOpen size={22} aria-hidden="true" />
          <span>Leren</span>
        </button>
        <button className={screen === 'kaart' ? 'is-active' : ''} type="button" onClick={() => setScreen('kaart')}>
          <MapIcon size={22} aria-hidden="true" />
          <span>Kaart</span>
        </button>
      </nav>
    </main>
  )
}

// Big flag shown as the question cue for the (reversed) Vlaggen mode
function FlagCue({ flag, instruction }: { flag: string; instruction: string }) {
  return (
    <div className="flag-cue-display">
      <span className="flag-cue-emoji" aria-hidden="true">{flag}</span>
      <strong className="flag-cue-instruction">{instruction}</strong>
    </div>
  )
}

// Multiple-choice country buttons with A/B/C/D labels
function OptionsGrid({ question, chooseOption }: { question: Question; chooseOption: (id: string) => void }) {
  const letters = ['A', 'B', 'C', 'D']
  return (
    <div className="options-grid name-options-grid">
      {question.options.map((country, i) => {
        const isSelected = question.selectedId === country.id
        const isCorrectAnswer = question.answered && country.id === question.country.id
        const isWrongSelection = question.answered && isSelected && country.id !== question.country.id
        return (
          <button
            className={['option-button', isCorrectAnswer ? 'correct' : '', isWrongSelection ? 'wrong' : ''].join(' ')}
            type="button"
            key={country.id}
            data-country-id={country.id}
            aria-label={country.name}
            disabled={question.answered}
            onClick={() => chooseOption(country.id)}
          >
            <span className="option-key" aria-hidden="true">{letters[i]}</span>
            <span className="option-text">{country.name}</span>
            {isCorrectAnswer && <Check size={15} aria-hidden="true" />}
            {isWrongSelection && <X size={15} aria-hidden="true" />}
          </button>
        )
      })}
    </div>
  )
}

// Standalone capital text input (hoofdsteden + vlaggen "hoofdstad")
function CapitalForm({
  question,
  submitCapital,
  setQuestion,
  inputRef,
}: {
  question: Question
  submitCapital: (event: FormEvent<HTMLFormElement>) => void
  setQuestion: Dispatch<SetStateAction<Question>>
  inputRef: RefObject<HTMLInputElement | null>
}) {
  return (
    <form className="answer-form" onSubmit={submitCapital}>
      <input
        ref={inputRef}
        value={question.typedAnswer}
        onChange={(event) => setQuestion((current) => ({ ...current, typedAnswer: event.target.value }))}
        disabled={question.answered}
        placeholder="Hoofdstad"
        autoComplete="off"
        className={question.answered ? (question.correct ? 'answered-correct' : 'answered-wrong') : ''}
      />
      <button type="submit" disabled={question.answered && !question.correct}>
        {question.answered ? 'Volgende' : 'Controleer'}
      </button>
    </form>
  )
}

// Map + capital combo (combo mode and vlaggen "beide"): flag bar on top, map below
function ComboStage({
  question,
  continent,
  visibleCountries,
  chooseOption,
  submitCapital,
  setQuestion,
  nextQuestion,
  comboInputRef,
  mapLayout,
  enableKeyboard,
  cursorStartId,
}: {
  question: Question
  continent: Continent
  visibleCountries: Country[]
  chooseOption: (id: string) => void
  submitCapital: (event: FormEvent<HTMLFormElement>) => void
  setQuestion: Dispatch<SetStateAction<Question>>
  nextQuestion: () => void
  comboInputRef: RefObject<HTMLInputElement | null>
  mapLayout: string
  enableKeyboard: boolean
  cursorStartId?: string
}) {
  return (
    <div className={`question-stage combo-question-stage map-layout-${mapLayout}`}>
      <div className="combo-control-bar">
        <span className="combo-flag-emoji">{question.country.flag}</span>
        {question.answered ? (
          <ComboAnswerReveal question={question} onNext={nextQuestion} />
        ) : (
          <form className="answer-form combo-form" onSubmit={submitCapital}>
            <span className="combo-instruction">
              {question.selectedId === null ? 'Klik het land aan op de kaart' : 'Goed! Typ nu de hoofdstad'}
            </span>
            <div className="combo-form-row">
              <input
                ref={comboInputRef}
                value={question.typedAnswer}
                onChange={(e) => setQuestion((c) => ({ ...c, typedAnswer: e.target.value }))}
                disabled={question.selectedId === null}
                placeholder={question.selectedId === null ? 'Klik eerst een land...' : 'Hoofdstad'}
                autoComplete="off"
              />
              <button type="submit" disabled={!question.typedAnswer.trim() || question.selectedId === null}>
                Controleer
              </button>
            </div>
          </form>
        )}
      </div>
      <CountryClickMap
        continent={continent}
        countries={visibleCountries}
        question={question}
        chooseCountry={chooseOption}
        mapLocked={question.selectedId !== null}
        enableKeyboard={enableKeyboard}
        cursorStartId={cursorStartId}
      />
    </div>
  )
}

// Flag multiple-choice (used by Maximaal step 2) with A/B/C/D labels
function FlagOptionsGrid({ question, onPick }: { question: Question; onPick: (id: string) => void }) {
  const letters = ['A', 'B', 'C', 'D']
  return (
    <div className="options-grid flag-options-grid">
      {question.options.map((country, i) => {
        const isPicked = question.flagSelectedId === country.id
        const isCorrectAnswer = question.answered && country.id === question.country.id
        const isWrongSelection = question.answered && isPicked && country.id !== question.country.id
        return (
          <button
            className={['option-button', isCorrectAnswer ? 'correct' : '', isWrongSelection ? 'wrong' : ''].join(' ')}
            type="button"
            key={country.id}
            aria-label={`Vlag van ${country.name}`}
            disabled={question.answered}
            onClick={() => onPick(country.id)}
          >
            <span className="option-key" aria-hidden="true">{letters[i]}</span>
            <span aria-hidden="true" className="flag-option-emoji">{country.flag}</span>
          </button>
        )
      })}
    </div>
  )
}

// Read-only summary of a Maximaal answer (ligging + vlag + hoofdstad)
function MaximaalReveal({ question, countries: visibleCountries, onNext }: { question: Question; countries: Country[]; onNext: () => void }) {
  const picked = visibleCountries.find((c) => c.id === question.selectedId) ?? null
  const pickedFlag = visibleCountries.find((c) => c.id === question.flagSelectedId) ?? null
  const row = (ok: boolean | null | undefined, label: string, value: string) => (
    <div className={`mx-reveal-row ${ok ? 'mx-ok' : 'mx-bad'}`}>
      {ok ? <Check size={15} aria-hidden="true" /> : <X size={15} aria-hidden="true" />}
      <span className="mx-reveal-label">{label}</span>
      <span className="mx-reveal-value">{value}</span>
    </div>
  )
  return (
    <div className="maximaal-reveal" role="status" aria-live="polite">
      <div className="maximaal-reveal-flag">{question.country.flag}</div>
      <strong className="maximaal-reveal-name">{question.country.name}</strong>
      {row(question.mapCorrect, 'Ligging', question.mapCorrect ? 'Goed aangewezen' : `Jij koos ${picked?.name ?? '—'}`)}
      {row(question.flagCorrect, 'Vlag', question.flagCorrect ? 'Goede vlag' : `Jij koos ${pickedFlag ? pickedFlag.flag : '—'}`)}
      {row(question.capitalCorrect, 'Hoofdstad', question.capitalCorrect ? question.country.capital : `${question.country.capital} (jij: "${question.typedAnswer || '—'}")`)}
      <button type="button" className="inline-next-button" onClick={onNext}>Volgende →</button>
    </div>
  )
}

// Maximaal: one country, three sequential tasks (point + flag + capital)
function MaximaalStage({
  question,
  continent,
  visibleCountries,
  chooseOption,
  chooseFlag,
  submitCapital,
  setQuestion,
  nextQuestion,
  capitalRef,
  cursorStartId,
}: {
  question: Question
  continent: Continent
  visibleCountries: Country[]
  chooseOption: (id: string) => void
  chooseFlag: (id: string) => void
  submitCapital: (event: FormEvent<HTMLFormElement>) => void
  setQuestion: Dispatch<SetStateAction<Question>>
  nextQuestion: () => void
  capitalRef: RefObject<HTMLInputElement | null>
  cursorStartId?: string
}) {
  const step = question.step ?? 0
  return (
    <div className="question-stage maximaal-stage">
      <div className="maximaal-head">
        <span className="maximaal-step">{question.answered ? 'Klaar' : `Stap ${step + 1} / 3`}</span>
        <strong className="maximaal-country">{question.country.name}</strong>
      </div>
      {question.answered ? (
        <MaximaalReveal question={question} countries={visibleCountries} onNext={nextQuestion} />
      ) : step === 0 ? (
        <>
          <p className="maximaal-instruction">Wijs het land aan op de kaart (pijltjes + Enter, of klik)</p>
          <CountryClickMap continent={continent} countries={visibleCountries} question={question} chooseCountry={chooseOption} enableKeyboard cursorStartId={cursorStartId} />
        </>
      ) : step === 1 ? (
        <>
          <p className="maximaal-instruction">Kies de juiste vlag (A/B/C/D)</p>
          <FlagOptionsGrid question={question} onPick={chooseFlag} />
        </>
      ) : (
        <>
          <p className="maximaal-instruction">Typ de hoofdstad</p>
          <form className="answer-form" onSubmit={submitCapital}>
            <input
              ref={capitalRef}
              value={question.typedAnswer}
              onChange={(e) => setQuestion((c) => ({ ...c, typedAnswer: e.target.value }))}
              placeholder="Hoofdstad"
              autoComplete="off"
            />
            <button type="submit" disabled={!question.typedAnswer.trim()}>Controleer</button>
          </form>
        </>
      )}
    </div>
  )
}

// Identify: the location is shown highlighted; the user types country + capital
function IdentifyStage({
  question,
  continent,
  visibleCountries,
  submitIdentify,
  setQuestion,
  nextQuestion,
  countryRef,
}: {
  question: Question
  continent: Continent
  visibleCountries: Country[]
  submitIdentify: (event: FormEvent<HTMLFormElement>) => void
  setQuestion: Dispatch<SetStateAction<Question>>
  nextQuestion: () => void
  countryRef: RefObject<HTMLInputElement | null>
}) {
  return (
    <div className="question-stage identify-stage">
      <div className="identify-map">
        <CountryClueMap continent={continent} countries={visibleCountries} country={question.country} big />
      </div>
      {question.answered ? (
        <div className={`identify-reveal ${question.correct ? 'mx-ok' : 'mx-bad'}`} role="status" aria-live="polite">
          <span className="identify-reveal-flag">{question.country.flag}</span>
          <div className="identify-reveal-lines">
            <div className={question.countryCorrect ? 'mx-reveal-row mx-ok' : 'mx-reveal-row mx-bad'}>
              {question.countryCorrect ? <Check size={15} /> : <X size={15} />}
              <span className="mx-reveal-value">{question.country.name}{!question.countryCorrect && ` (jij: "${question.typedCountry || '—'}")`}</span>
            </div>
            <div className={question.capitalCorrect ? 'mx-reveal-row mx-ok' : 'mx-reveal-row mx-bad'}>
              {question.capitalCorrect ? <Check size={15} /> : <X size={15} />}
              <span className="mx-reveal-value">{question.country.capital}{!question.capitalCorrect && ` (jij: "${question.typedAnswer || '—'}")`}</span>
            </div>
          </div>
          <button type="button" className="inline-next-button" onClick={nextQuestion}>Volgende →</button>
        </div>
      ) : (
        <form className="answer-form identify-form" onSubmit={submitIdentify}>
          <input
            ref={countryRef}
            value={question.typedCountry ?? ''}
            onChange={(e) => setQuestion((c) => ({ ...c, typedCountry: e.target.value }))}
            placeholder="Welk land?"
            autoComplete="off"
          />
          <input
            value={question.typedAnswer}
            onChange={(e) => setQuestion((c) => ({ ...c, typedAnswer: e.target.value }))}
            placeholder="Hoofdstad"
            autoComplete="off"
          />
          <button type="submit" disabled={!(question.typedCountry ?? '').trim() && !question.typedAnswer.trim()}>Controleer</button>
        </form>
      )}
    </div>
  )
}

function ComboAnswerReveal({ question, onNext }: { question: Question; onNext: () => void }) {
  const mapCorrect = question.selectedId === question.country.id
  const capitalCorrect = question.capitalCorrect ?? false

  return (
    <div className="combo-answer-reveal" role="status" aria-live="polite">
      <div className="combo-reveal-row">
        <div className={`combo-reveal-item ${mapCorrect ? 'combo-correct' : 'combo-wrong'}`}>
          {mapCorrect ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}
          <span className="combo-reveal-flag">{question.country.flag}</span>
          <span>{mapCorrect ? question.country.name : `${question.country.name} (jij klikte ernaast)`}</span>
        </div>
        <div className={`combo-reveal-item ${capitalCorrect ? 'combo-correct' : 'combo-wrong'}`}>
          {capitalCorrect ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}
          <span>
            {capitalCorrect
              ? question.country.capital
              : `${question.country.capital} (jij: "${question.typedAnswer || '—'}")`}
          </span>
        </div>
      </div>
      <button type="button" className="inline-next-button car-next" onClick={onNext}>
        Volgende →
      </button>
    </div>
  )
}

function CorrectAnswerReveal({ question, onNext }: { question: Question; onNext?: () => void }) {
  return (
    <div className="correct-answer-reveal" role="status" aria-live="polite">
      <div className="car-top">
        <Check size={15} aria-hidden="true" />
        <span>Goed!</span>
      </div>
      <div className="car-body">
        <span className="war-flag">{question.country.flag}</span>
        <strong className="war-name">{question.country.name}</strong>
        <span className="war-capital">{question.country.capital}</span>
      </div>
      {onNext && (
        <button type="button" className="inline-next-button car-next" onClick={onNext}>
          Volgende →
        </button>
      )}
    </div>
  )
}

function WrongAnswerReveal({ question, countries: visibleCountries }: { question: Question; countries: Country[] }) {
  const wrongCountry = question.selectedId ? (visibleCountries.find((c) => c.id === question.selectedId) ?? null) : null
  const isCapital = question.mode === 'hoofdsteden'

  return (
    <div className="wrong-answer-reveal" role="status" aria-live="polite">
      <div className="war-countdown" key={`${question.country.id}-${question.mode}`} />
      <div className="war-cards">
        <div className="war-card war-wrong">
          <span className="war-label">
            <X size={15} aria-hidden="true" /> Jij koos
          </span>
          {isCapital ? (
            <>
              <span className="war-flag">{question.country.flag}</span>
              <strong className="war-name">{question.country.name}</strong>
              <span className="war-capital war-typed">"{question.typedAnswer || '—'}"</span>
            </>
          ) : wrongCountry ? (
            <>
              <span className="war-flag">{wrongCountry.flag}</span>
              <strong className="war-name">{wrongCountry.name}</strong>
              <span className="war-capital">{wrongCountry.capital}</span>
            </>
          ) : (
            <span className="war-capital">—</span>
          )}
        </div>
        <div className="war-arrow">→</div>
        <div className="war-card war-correct">
          <span className="war-label">
            <Check size={15} aria-hidden="true" /> Goede antwoord
          </span>
          <span className="war-flag">{question.country.flag}</span>
          <strong className="war-name">{question.country.name}</strong>
          <span className="war-capital">{question.country.capital}</span>
        </div>
      </div>
    </div>
  )
}

// The wizard is built around two clear choices: WHAT you want to learn (the goal,
// i.e. the answer you give) and WHAT you see as a hint. Each combination maps to
// an internal (mode, vlagAnswer) pair.
type WizardSee = { key: string; label: string; sub: string; mode: TrainerMode; vlag: VlagAnswer }
type LearnGoal = { key: string; label: string; icon: string; sees: WizardSee[] }

const LEARN_GOALS: LearnGoal[] = [
  {
    key: 'ligging',
    label: 'Waar het ligt',
    icon: '🗺️',
    sees: [
      { key: 'naam', label: 'Bij de naam', sub: 'Je ziet de naam → wijs het land aan op de kaart', mode: 'landen', vlag: 'mc' },
      { key: 'vlag', label: 'Bij de vlag', sub: 'Je ziet de vlag → wijs het land aan op de kaart', mode: 'vlaggen', vlag: 'kaart' },
      { key: 'naam-hfd', label: 'Naam + hoofdstad', sub: 'Je ziet de naam → wijs het land aan én typ de hoofdstad', mode: 'combo', vlag: 'mc' },
    ],
  },
  {
    key: 'hoofdsteden',
    label: 'Hoofdsteden',
    icon: '🏛️',
    sees: [
      { key: 'naam', label: 'Bij de naam', sub: 'Je ziet de naam → typ de hoofdstad', mode: 'hoofdsteden', vlag: 'mc' },
      { key: 'vlag', label: 'Bij de vlag', sub: 'Je ziet de vlag → typ de hoofdstad', mode: 'vlaggen', vlag: 'hoofdstad' },
    ],
  },
  {
    key: 'vlaggen',
    label: 'Vlaggen',
    icon: '🚩',
    sees: [
      { key: 'mc', label: 'Kies het land', sub: 'Je ziet de vlag → kies het juiste land (A/B/C/D)', mode: 'vlaggen', vlag: 'mc' },
      { key: 'kaart', label: 'Wijs het aan', sub: 'Je ziet de vlag → wijs het land aan op de kaart', mode: 'vlaggen', vlag: 'kaart' },
      { key: 'hoofdstad', label: 'Typ de hoofdstad', sub: 'Je ziet de vlag → typ de hoofdstad', mode: 'vlaggen', vlag: 'hoofdstad' },
      { key: 'beide', label: 'Aanwijzen + hoofdstad', sub: 'Je ziet de vlag → wijs het aan én typ de hoofdstad', mode: 'vlaggen', vlag: 'beide' },
    ],
  },
  {
    key: 'herkennen',
    label: 'Landen herkennen',
    icon: '🔍',
    sees: [
      { key: 'only', label: 'Typ land + hoofdstad', sub: 'Je ziet alleen de ligging → typ het land én de hoofdstad', mode: 'identify', vlag: 'mc' },
    ],
  },
  {
    key: 'alles',
    label: 'Alles tegelijk',
    icon: '🏆',
    sees: [
      { key: 'only', label: 'Maximaal', sub: 'Je ziet de naam → wijs aan + kies de vlag + typ de hoofdstad', mode: 'maximaal', vlag: 'mc' },
    ],
  },
  {
    key: 'mix',
    label: 'Mix',
    icon: '🎲',
    sees: [
      { key: 'only', label: 'Door elkaar', sub: 'Een verrassingsmix van alle methodes', mode: 'gemengd', vlag: 'mc' },
    ],
  },
]

type QuizConfig = { continent: Continent; mode: TrainerMode; vlagAnswer: VlagAnswer; useFocusPool: boolean; format: 'practice' | 'exam' }

function QuizWizard({
  continent,
  setContinent,
  progress,
  onStart,
}: {
  continent: Continent
  setContinent: (c: Continent) => void
  progress: ProgressState
  onStart: (cfg: QuizConfig) => void
}) {
  const [goalKey, setGoalKey] = useState('ligging')
  const [seeKey, setSeeKey] = useState('naam')
  const [focus, setFocus] = useState(false)
  const [format, setFormat] = useState<'practice' | 'exam'>('practice')

  const goal = LEARN_GOALS.find((g) => g.key === goalKey) ?? LEARN_GOALS[0]
  const see = goal.sees.find((s) => s.key === seeKey) ?? goal.sees[0]

  const chooseGoal = (g: LearnGoal) => {
    setGoalKey(g.key)
    setSeeKey(g.sees[0].key)
  }

  const weakCount = useMemo(() => {
    const base = continent === 'Wereld' ? countries : countries.filter((c) => c.continent === continent)
    return base.filter((c) => masteryForCountry(progress, c.id) < OEFEN_STRONG).length
  }, [continent, progress])

  const start = (over?: Partial<QuizConfig>) =>
    onStart({ continent, mode: see.mode, vlagAnswer: see.vlag, useFocusPool: focus, format, ...over })

  return (
    <div className="wizard">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Overhoring samenstellen</p>
          <h2>Wat wil je oefenen?</h2>
        </div>
      </header>

      <div className="wizard-presets">
        <button type="button" className="wizard-preset" onClick={() => start({ mode: 'oefenen', vlagAnswer: 'mc', format: 'practice' })}>
          <span className="wp-icon">🎯</span>
          <span className="wp-text"><strong>Slim oefenen</strong><span>Je zwakste landen, tot je ze 5× goed hebt</span></span>
        </button>
        <button type="button" className="wizard-preset wizard-preset-max" onClick={() => start({ mode: 'maximaal', vlagAnswer: 'mc', format: 'exam' })}>
          <span className="wp-icon">🏆</span>
          <span className="wp-text"><strong>Maximaal-examen</strong><span>Aanwijzen + vlag + hoofdstad — met eindscore</span></span>
        </button>
      </div>

      <p className="wizard-or">of stel het zelf samen</p>

      <div className="wizard-section wizard-section-area">
        <h3>1 · Gebied</h3>
        <div className="button-grid">
          {continents.map((item) => (
            <button key={item} type="button" className={item === continent ? 'is-active' : ''} onClick={() => setContinent(item)}>
              {item}
            </button>
          ))}
        </div>
        <label className="wizard-focus">
          <input type="checkbox" checked={focus} onChange={() => setFocus((f) => !f)} />
          <span>Alleen mijn zwakke landen <small>({weakCount})</small></span>
        </label>
      </div>

      <div className="wizard-section">
        <h3>2 · Wat wil je leren?</h3>
        <div className="button-grid wizard-goals">
          {LEARN_GOALS.map((g) => (
            <button key={g.key} type="button" className={g.key === goalKey ? 'is-active' : ''} onClick={() => chooseGoal(g)}>
              <span aria-hidden="true">{g.icon}</span> {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="wizard-section">
        <h3>3 · Wat zie je?</h3>
        {goal.sees.length > 1 && (
          <div className="button-grid wizard-sees">
            {goal.sees.map((s) => (
              <button key={s.key} type="button" className={s.key === see.key ? 'is-active' : ''} onClick={() => setSeeKey(s.key)}>
                {s.label}
              </button>
            ))}
          </div>
        )}
        <p className="wizard-note">{see.sub}</p>
      </div>

      <div className="wizard-section">
        <h3>4 · Vorm</h3>
        <div className="wizard-format">
          <button type="button" className={format === 'practice' ? 'is-active' : ''} onClick={() => setFormat('practice')}>
            Oefenen <small>eindeloos, fouten komen terug</small>
          </button>
          <button type="button" className={format === 'exam' ? 'is-active' : ''} onClick={() => setFormat('exam')}>
            Examen <small>met eindscore</small>
          </button>
        </div>
      </div>

      <button type="button" className="wizard-start" onClick={() => start()}>
        Start overhoring →
      </button>
    </div>
  )
}

function ExamResultPanel({ results, onRestart, onNew }: { results: Array<{ id: string; correct: boolean }>; onRestart: () => void; onNew: () => void }) {
  const byId = useMemo(() => new Map(countries.map((c) => [c.id, c])), [])
  const total = results.length
  const correct = results.filter((r) => r.correct).length
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const wrong = results.filter((r) => !r.correct).map((r) => byId.get(r.id)).filter((c): c is Country => Boolean(c))
  return (
    <div className="practice-layout">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Examen afgerond</p>
          <h2>Je score</h2>
        </div>
      </header>
      <div className="session-complete exam-result">
        <div className="session-complete-icon" aria-hidden="true">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
        <div className="exam-score" style={{ color: pct >= 80 ? '#228b5b' : pct >= 50 ? '#b07400' : '#c84b4b' }}>{pct}%</div>
        <p>{correct} van de {total} goed</p>
        {wrong.length > 0 && (
          <div className="exam-wrong">
            <h3>Nog oefenen ({wrong.length})</h3>
            <div className="exam-wrong-list">
              {wrong.map((c) => (
                <span key={c.id} className="exam-wrong-item"><span aria-hidden="true">{c.flag}</span> {c.name}</span>
              ))}
            </div>
          </div>
        )}
        <div className="exam-result-actions">
          <button type="button" className="wizard-start" onClick={onRestart}>Opnieuw</button>
          <button type="button" className="session-stop-btn" onClick={onNew}>Andere overhoring</button>
        </div>
      </div>
    </div>
  )
}

type PracticePanelProps = {
  continent: Continent
  countries: Country[]
  clues: ClueSettings
  previousQuestion: Question | null
  showPreviousQuestion: boolean
  question: Question
  repeatQueue: string[]
  chooseOption: (countryId: string) => void
  chooseFlag: (countryId: string) => void
  submitCapital: (event: FormEvent<HTMLFormElement>) => void
  submitIdentify: (event: FormEvent<HTMLFormElement>) => void
  setQuestion: Dispatch<SetStateAction<Question>>
  nextQuestion: () => void
  setShowPreviousQuestion: Dispatch<SetStateAction<boolean>>
  session: SessionStats | null
  sessionComplete: boolean
  sessionActivePool: Country[] | null
  onStopSession: () => void
  selectedMode: TrainerMode
  progress: ProgressState
  oefenPhase: OefenPhase
  oefenBatch: Country[]
  oefenRound: number
  oefenActivePool: Country[]
  onBeginOefenQuiz: () => void
  onClose: () => void
  format: 'practice' | 'exam'
  examAnswered: number
  examTotal: number
}

// ─── Full-screen mobile quiz: map fills the screen, the question floats over it ───
function MobileQuiz({
  continent,
  visibleCountries,
  question,
  chooseOption,
  chooseFlag,
  submitCapital,
  submitIdentify,
  setQuestion,
  nextQuestion,
  onClose,
  isOefenen,
  oefenDone,
  oefenTotal,
  format,
  examAnswered,
  examTotal,
}: {
  continent: Continent
  visibleCountries: Country[]
  question: Question
  chooseOption: (id: string) => void
  chooseFlag: (id: string) => void
  submitCapital: (event: FormEvent<HTMLFormElement>) => void
  submitIdentify: (event: FormEvent<HTMLFormElement>) => void
  setQuestion: Dispatch<SetStateAction<Question>>
  nextQuestion: () => void
  onClose: () => void
  isOefenen: boolean
  oefenDone: number
  oefenTotal: number
  format: 'practice' | 'exam'
  examAnswered: number
  examTotal: number
}) {
  const vlagKind = vlagKindOf(question)
  const isBoth = question.mode === 'combo' || vlagKind === 'beide'
  const isMapOnly = question.mode === 'landen' || vlagKind === 'kaart'
  const isCapitalOnly = question.mode === 'hoofdsteden' || vlagKind === 'hoofdstad'
  const isMC = vlagKind === 'mc'
  const isIdentify = question.mode === 'identify'
  const isMaximaal = question.mode === 'maximaal'
  const flagCueMode = question.mode === 'vlaggen' || question.mode === 'combo'
  const usesClickMap = isMapOnly || isBoth || isMaximaal
  const hasMapBg = usesClickMap || isIdentify
  const answered = question.answered
  const step = question.step ?? 0
  const capRef = useRef<HTMLInputElement>(null)
  const countryRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (answered) return
    if (isIdentify) countryRef.current?.focus()
    else if (isCapitalOnly) capRef.current?.focus()
    else if ((isBoth && question.selectedId !== null) || (isMaximaal && step === 2)) capRef.current?.focus()
  }, [answered, isIdentify, isCapitalOnly, isBoth, isMaximaal, step, question.selectedId, question.country.id])

  const mapLocked = isBoth ? question.selectedId !== null : isMaximaal ? step !== 0 : answered

  let prompt = ''
  if (isMaximaal) prompt = step === 0 ? 'Wijs het land aan' : step === 1 ? 'Kies de juiste vlag' : 'Typ de hoofdstad'
  else if (isMapOnly) prompt = question.mode === 'vlaggen' ? 'Waar ligt deze vlag?' : 'Wijs het land aan'
  else if (isBoth) prompt = question.selectedId === null ? 'Wijs het land aan' : 'Typ de hoofdstad'
  else if (isMC) prompt = 'Welk land hoort bij deze vlag?'
  else if (isCapitalOnly) prompt = 'Wat is de hoofdstad?'
  else if (isIdentify) prompt = 'Welk land is dit? Typ land + hoofdstad'

  const progressText = format === 'exam' ? `${examAnswered}/${examTotal}` : isOefenen ? `${oefenDone}/${oefenTotal}` : ''

  const capInput = (disabled: boolean, placeholder: string) => (
    <input
      ref={capRef}
      value={question.typedAnswer}
      onChange={(e) => setQuestion((c) => ({ ...c, typedAnswer: e.target.value }))}
      disabled={disabled}
      placeholder={placeholder}
      autoComplete="off"
    />
  )

  let answerEl: React.ReactNode = null
  if (!answered) {
    if (isMC) answerEl = <OptionsGrid question={question} chooseOption={chooseOption} />
    else if (isMaximaal && step === 1) answerEl = <FlagOptionsGrid question={question} onPick={chooseFlag} />
    else if (isMaximaal && step === 2)
      answerEl = (
        <form className="answer-form" onSubmit={submitCapital}>
          {capInput(false, 'Hoofdstad')}
          <button type="submit" disabled={!question.typedAnswer.trim()}>OK</button>
        </form>
      )
    else if (isBoth)
      answerEl = (
        <form className="answer-form" onSubmit={submitCapital}>
          {capInput(question.selectedId === null, question.selectedId === null ? 'Wijs eerst het land aan' : 'Hoofdstad')}
          <button type="submit" disabled={!question.typedAnswer.trim() || question.selectedId === null}>OK</button>
        </form>
      )
    else if (isCapitalOnly)
      answerEl = (
        <form className="answer-form" onSubmit={submitCapital}>
          {capInput(false, 'Hoofdstad')}
          <button type="submit" disabled={!question.typedAnswer.trim()}>OK</button>
        </form>
      )
    else if (isIdentify)
      answerEl = (
        <form className="answer-form identify-form" onSubmit={submitIdentify}>
          <input ref={countryRef} value={question.typedCountry ?? ''} onChange={(e) => setQuestion((c) => ({ ...c, typedCountry: e.target.value }))} placeholder="Welk land?" autoComplete="off" />
          {capInput(false, 'Hoofdstad')}
          <button type="submit">OK</button>
        </form>
      )
  }

  const reveal = (
    <div className={`immersive-reveal ${question.correct ? 'ir-ok' : 'ir-bad'}`} role="status" aria-live="polite">
      <span className="ir-flag" aria-hidden="true">{question.country.flag}</span>
      <div className="ir-info">
        <strong>{question.country.name}</strong>
        <span>{question.country.capital}</span>
      </div>
      <button type="button" className="inline-next-button" onClick={nextQuestion}>Volgende →</button>
    </div>
  )

  return (
    <div className={`immersive ${hasMapBg ? 'immersive-has-map' : 'immersive-no-map'}`}>
      {usesClickMap && (
        <CountryClickMap continent={continent} countries={visibleCountries} question={question} chooseCountry={chooseOption} mapLocked={mapLocked} />
      )}
      {isIdentify && (
        <div className="immersive-locmap">
          <CountryClueMap continent={continent} countries={visibleCountries} country={question.country} big />
        </div>
      )}

      <button className="immersive-close" type="button" onClick={onClose} aria-label="Overhoring sluiten">✕</button>

      {hasMapBg ? (
        <div className="immersive-prompt">
          {flagCueMode && <span className="ip-flag" aria-hidden="true">{question.country.flag}</span>}
          <div className="ip-text">
            {(isMaximaal || (!flagCueMode && !isIdentify)) && <strong className="ip-subject">{question.country.name}</strong>}
            <span className="ip-instruction">{prompt}{isMaximaal && !answered ? ` · stap ${step + 1}/3` : ''}</span>
          </div>
          {progressText && <span className="ip-progress">{progressText}</span>}
        </div>
      ) : (
        <div className="immersive-cue">
          {flagCueMode ? (
            <span className="immersive-cue-flag" aria-hidden="true">{question.country.flag}</span>
          ) : (
            <>
              <span className="immersive-cue-label">LAND</span>
              <strong className="immersive-cue-name">{question.country.name}</strong>
            </>
          )}
          <span className="immersive-cue-instr">{prompt}</span>
          {progressText && <span className="immersive-cue-progress">{progressText}</span>}
        </div>
      )}

      {(answered || answerEl) && <div className="immersive-bottom">{answered ? reveal : answerEl}</div>}
    </div>
  )
}

function PracticePanel({
  continent,
  countries: visibleCountries,
  clues,
  previousQuestion,
  showPreviousQuestion,
  question,
  repeatQueue,
  chooseOption,
  chooseFlag,
  submitCapital,
  submitIdentify,
  setQuestion,
  nextQuestion,
  setShowPreviousQuestion,
  session,
  sessionComplete,
  sessionActivePool,
  onStopSession,
  selectedMode,
  progress,
  oefenPhase,
  oefenBatch,
  oefenRound,
  oefenActivePool,
  onBeginOefenQuiz,
  onClose,
  format,
  examAnswered,
  examTotal,
}: PracticePanelProps) {
  const isMobile = useIsMobile()
  const isOefenen = selectedMode === 'oefenen'
  const vlagKind = vlagKindOf(question)
  // Derived interaction model (works for plain modes AND the configurable Vlaggen mode)
  const isBoth = question.mode === 'combo' || vlagKind === 'beide'
  const isMapOnly = question.mode === 'landen' || vlagKind === 'kaart'
  const isCapitalOnly = question.mode === 'hoofdsteden' || vlagKind === 'hoofdstad'
  const isMC = vlagKind === 'mc'
  const isFlagCue = question.mode === 'vlaggen'
  const isIdentify = question.mode === 'identify'
  const isMaximaal = question.mode === 'maximaal'
  const activeClues = clues[(question.mode in clues ? question.mode : 'landen') as CluedMode]
  const capitalInputRef = useRef<HTMLInputElement>(null)
  const comboInputRef = useRef<HTMLInputElement>(null)
  const countryInputRef = useRef<HTMLInputElement>(null)
  const mapLayout = mapQuestionLayout(continent)
  const cursorStartId = previousQuestion?.country.id
  // A multiple-choice step is active (Vlaggen MC, or Maximaal flag step)
  const mcActive = !question.answered && (isMC || (isMaximaal && question.step === 1))
  const mcChoose = isMaximaal ? chooseFlag : chooseOption

  useEffect(() => {
    if (isCapitalOnly && !question.answered) {
      capitalInputRef.current?.focus()
    }
  }, [isCapitalOnly, question])

  useEffect(() => {
    if (isIdentify && !question.answered) {
      countryInputRef.current?.focus()
    }
  }, [isIdentify, question])

  useEffect(() => {
    if ((isBoth && question.selectedId !== null && !question.answered) || (isMaximaal && question.step === 2 && !question.answered)) {
      comboInputRef.current?.focus()
      capitalInputRef.current?.focus()
    }
  }, [isBoth, isMaximaal, question.selectedId, question.step, question.answered])

  // Keyboard: Enter advances after a correct answer; A/B/C/D (or 1-4) pick a multiple-choice option.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && question.answered && question.correct) {
        e.preventDefault()
        nextQuestion()
        return
      }
      if (mcActive) {
        const idx = { a: 0, b: 1, c: 2, d: 3, '1': 0, '2': 1, '3': 2, '4': 3 }[e.key.toLowerCase()]
        if (idx !== undefined && question.options[idx]) {
          e.preventDefault()
          mcChoose(question.options[idx].id)
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [question, mcActive, mcChoose, nextQuestion])

  const sessionDone = sessionActivePool !== null ? visibleCountries.length - sessionActivePool.length : 0
  const sessionPct = visibleCountries.length > 0 ? Math.round((sessionDone / visibleCountries.length) * 100) : 0

  // ─── Oefenen: study / done screens (no quiz, no scrolling) ───
  if (isOefenen && oefenPhase !== 'quiz') {
    return (
      <div className="practice-layout">
        <header className="panel-header">
          <div>
            <p className="eyebrow">Slim oefenen</p>
            <h2>{oefenPhase === 'done' ? 'Alles geoefend!' : `Leer deze ${oefenBatch.length} landen`}</h2>
          </div>
        </header>
        {oefenPhase === 'done' ? (
          <OefenDonePanel continent={continent} />
        ) : (
          <OefenStudyPanel batch={oefenBatch} progress={progress} round={oefenRound} onBegin={onBeginOefenQuiz} />
        )}
      </div>
    )
  }

  const oefenTotal = oefenBatch.length
  const oefenDone = oefenTotal - oefenActivePool.length
  const oefenPct = oefenTotal > 0 ? Math.round((oefenDone / oefenTotal) * 100) : 0

  // On phones the quiz is a full-screen, map-first experience (the question floats over the map).
  if (isMobile) {
    return (
      <MobileQuiz
        continent={continent}
        visibleCountries={visibleCountries}
        question={question}
        chooseOption={chooseOption}
        chooseFlag={chooseFlag}
        submitCapital={submitCapital}
        submitIdentify={submitIdentify}
        setQuestion={setQuestion}
        nextQuestion={nextQuestion}
        onClose={onClose}
        isOefenen={isOefenen}
        oefenDone={oefenDone}
        oefenTotal={oefenTotal}
        format={format}
        examAnswered={examAnswered}
        examTotal={examTotal}
      />
    )
  }

  return (
    <div className="practice-layout">
      <header className="panel-header">
        <div>
          <p className="eyebrow">{isOefenen ? `Oefenronde ${oefenRound}` : `${modeLabels[question.mode]} oefenen`}</p>
          <h2>{practiceTitle(question.mode, question.answerKind)}</h2>
        </div>
        {isOefenen ? (
          <div className="routine-pill repeat-queue-pill">
            <GraduationCap size={14} aria-hidden="true" />
            {weakestModeLabel(question.mode)}
          </div>
        ) : repeatQueue.length > 0 ? (
          <div className="routine-pill repeat-queue-pill">
            <RotateCcw size={14} aria-hidden="true" />
            {repeatQueue.length} te herhalen
          </div>
        ) : null}
      </header>

      {isOefenen && (
        <div className="session-hud" role="status" aria-label="Oefenronde voortgang">
          <div className="session-hud-bar">
            <div className="session-hud-fill" style={{ width: `${oefenPct}%` }} />
          </div>
          <span className="session-hud-text">
            {oefenDone} / {oefenTotal} landen in deze ronde
          </span>
        </div>
      )}

      {session !== null && !sessionComplete && sessionActivePool !== null && (
        <div className="session-hud" role="status" aria-label="Sessie voortgang">
          <div className="session-hud-bar">
            <div className="session-hud-fill" style={{ width: `${sessionPct}%` }} />
          </div>
          <span className="session-hud-text">
            {sessionDone} / {visibleCountries.length} landen klaar
          </span>
        </div>
      )}

      {sessionComplete && session !== null ? (
        <SessionCompletePanel countries={visibleCountries} session={session} onStop={onStopSession} />
      ) : (
        <>
          {previousQuestion && (
            <div className="previous-question-tools">
              <button type="button" onClick={() => setShowPreviousQuestion((current) => !current)}>
                {showPreviousQuestion ? 'Verberg vorige vraag' : 'Vorige vraag'}
              </button>
            </div>
          )}

          {showPreviousQuestion && previousQuestion && <PreviousQuestionPanel question={previousQuestion} countries={visibleCountries} continent={continent} />}

          {isMaximaal ? (
            <MaximaalStage
              question={question}
              continent={continent}
              visibleCountries={visibleCountries}
              chooseOption={chooseOption}
              chooseFlag={chooseFlag}
              submitCapital={submitCapital}
              setQuestion={setQuestion}
              nextQuestion={nextQuestion}
              capitalRef={capitalInputRef}
              cursorStartId={cursorStartId}
            />
          ) : isIdentify ? (
            <IdentifyStage
              question={question}
              continent={continent}
              visibleCountries={visibleCountries}
              submitIdentify={submitIdentify}
              setQuestion={setQuestion}
              nextQuestion={nextQuestion}
              countryRef={countryInputRef}
            />
          ) : isBoth ? (
            <ComboStage
              question={question}
              continent={continent}
              visibleCountries={visibleCountries}
              chooseOption={chooseOption}
              submitCapital={submitCapital}
              setQuestion={setQuestion}
              nextQuestion={nextQuestion}
              comboInputRef={comboInputRef}
              mapLayout={mapLayout}
              enableKeyboard
              cursorStartId={cursorStartId}
            />
          ) : isMapOnly ? (
            <div className={`question-stage map-question-stage map-layout-${mapLayout}`}>
              <div className="map-question-content">
                <CountryClickMap
                  continent={continent}
                  countries={visibleCountries}
                  question={question}
                  chooseCountry={chooseOption}
                  enableKeyboard
                  cursorStartId={cursorStartId}
                />
                <CuePanel
                  continent={continent}
                  countries={visibleCountries}
                  country={question.country}
                  mode={question.mode}
                  clues={activeClues}
                  answered={question.answered}
                  correct={question.correct}
                  selectedId={question.selectedId}
                  feedbackMessage={question.answered ? feedbackText(question, visibleCountries) : undefined}
                  onNext={nextQuestion}
                  flagCue={isFlagCue}
                />
              </div>
            </div>
          ) : (
            <div className="question-stage">
              {isFlagCue ? (
                <FlagCue
                  flag={question.country.flag}
                  instruction={isMC ? 'Welk land hoort bij deze vlag?' : 'Wat is de hoofdstad?'}
                />
              ) : (
                <CuePanel
                  continent={continent}
                  countries={visibleCountries}
                  country={question.country}
                  mode={question.mode}
                  clues={activeClues}
                  answered={question.answered}
                  correct={question.correct}
                  selectedId={question.selectedId}
                  feedbackMessage={question.answered ? feedbackText(question, visibleCountries) : undefined}
                  onNext={nextQuestion}
                />
              )}
              {question.answered && (
                question.correct
                  ? <CorrectAnswerReveal question={question} onNext={nextQuestion} />
                  : <WrongAnswerReveal question={question} countries={visibleCountries} />
              )}
            </div>
          )}

          {isCapitalOnly ? (
            <CapitalForm question={question} submitCapital={submitCapital} setQuestion={setQuestion} inputRef={capitalInputRef} />
          ) : isMC ? (
            <OptionsGrid question={question} chooseOption={chooseOption} />
          ) : null}
        </>
      )}
    </div>
  )
}

const OEFEN_AREA_LABELS: Record<'landen' | 'vlaggen' | 'hoofdsteden', string> = {
  landen: 'Ligging',
  vlaggen: 'Vlag',
  hoofdsteden: 'Hoofdstad',
}

function weakestModeLabel(mode: QuestionMode): string {
  if (mode === 'landen' || mode === 'vlaggen' || mode === 'hoofdsteden') return OEFEN_AREA_LABELS[mode]
  if (mode === 'combo') return 'Dubbel'
  return modeLabels[mode]
}

// Which disciplines does the user not yet know well for this country?
function weakAreas(progress: ProgressState, id: string): string[] {
  const out: string[] = []
  for (const m of ['landen', 'vlaggen', 'hoofdsteden'] as const) {
    if (masteryForMode(progress[id]?.[m]) < 50) out.push(OEFEN_AREA_LABELS[m])
  }
  return out
}

// Shows where a set of countries lie — highlights them all on one map.
function BatchLocationMap({ batch }: { batch: Country[] }) {
  const ids = useMemo(() => new Set(batch.map((c) => c.id)), [batch])
  const conts = new Set(batch.map((c) => c.continent))
  const effectiveContinent: Continent = conts.size === 1 ? ([...conts][0] as Continent) : 'Wereld'
  const view = useMemo(() => mapViewForContinent(effectiveContinent), [effectiveContinent])
  const [position, setPosition] = useState<MapPosition>({ coordinates: view.center, zoom: view.zoom })
  const countryByMapId = useMemo(() => new Map(countries.map((c) => [c.mapId, c])), [])
  const geoData = geoDataFor(effectiveContinent, position.zoom)

  useEffect(() => {
    setPosition({ coordinates: view.center, zoom: view.zoom })
  }, [view])

  return (
    <div className="oefen-map">
      <ComposableMap projectionConfig={{ scale: 145 }} width={980} height={520}>
        <ZoomableGroup center={position.coordinates} zoom={position.zoom} onMoveEnd={setPosition}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geography) => {
                const c = countryByMapId.get(geographyKey(geography))
                const hit = Boolean(c && ids.has(c.id))
                return (
                  <Geography
                    key={geography.rsmKey}
                    geography={geography}
                    fill={hit ? '#0f766e' : c ? '#d8e5ed' : 'transparent'}
                    stroke={c ? '#ffffff' : 'transparent'}
                    strokeWidth={strokeWidthForZoom(view, position.zoom)}
                    style={{
                      default: { opacity: c ? 1 : 0, outline: 'none', pointerEvents: 'none' },
                      hover: { opacity: c ? 1 : 0, outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>
          {batch.map((c) => (
            <Marker key={c.id} coordinates={[c.latlng[1], c.latlng[0]]}>
              <circle r={6 / position.zoom} fill="#0f766e" stroke="#ffffff" strokeWidth={2 / position.zoom} vectorEffect="non-scaling-stroke" />
              <text
                y={-10 / position.zoom}
                textAnchor="middle"
                style={{
                  fontSize: `${12 / position.zoom}px`,
                  fontWeight: 700,
                  fill: '#0b3b37',
                  stroke: '#ffffff',
                  strokeWidth: 3.5 / position.zoom,
                  paintOrder: 'stroke',
                  fontFamily: 'inherit',
                }}
              >
                {c.flag} {c.name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}

function OefenStudyPanel({
  batch,
  progress,
  round,
  onBegin,
}: {
  batch: Country[]
  progress: ProgressState
  round: number
  onBegin: () => void
}) {
  return (
    <div className="oefen-study">
      <p className="oefen-study-intro">
        Ronde {round} · Bekijk op de kaart waar deze landen liggen (met vlag en naam) en leer de hoofdstad. Daarna overhoor ik je tot je elk land 5× goed hebt.
      </p>
      <BatchLocationMap batch={batch} />
      <div className="oefen-study-grid">
        {batch.map((c) => {
          const weak = weakAreas(progress, c.id)
          return (
            <div className="oefen-card" key={c.id}>
              <span className="oefen-card-flag" aria-hidden="true">{c.flag}</span>
              <strong className="oefen-card-name">{c.name}</strong>
              <span className="oefen-card-capital">{c.capital}</span>
              {weak.length > 0 && (
                <div className="oefen-card-weak">
                  {weak.map((w) => (
                    <span key={w}>{w}</span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button className="oefen-begin-btn" type="button" onClick={onBegin}>
        Begin overhoren →
      </button>
    </div>
  )
}

function OefenDonePanel({ continent }: { continent: Continent }) {
  const where = continent === 'Wereld' ? 'de hele wereld' : continent
  return (
    <div className="session-complete oefen-done">
      <div className="session-complete-icon" aria-hidden="true">🏆</div>
      <h2>Knap gedaan!</h2>
      <p>
        Je kent alle landen van <strong>{where}</strong> nu goed (80%+). Kies een ander gebied of een andere
        trainingsmodus om verder te gaan.
      </p>
    </div>
  )
}

function SessionCompletePanel({
  countries,
  session,
  onStop,
}: {
  countries: Country[]
  session: SessionStats
  onStop: () => void
}) {
  const totalCorrect = countries.reduce((sum, c) => sum + (session[c.id]?.correct ?? 0), 0)
  const totalWrong = countries.reduce((sum, c) => sum + (session[c.id]?.wrong ?? 0), 0)
  const total = totalCorrect + totalWrong
  const pct = total > 0 ? Math.round((totalCorrect / total) * 100) : 100

  const toughCountries = countries
    .filter((c) => (session[c.id]?.wrong ?? 0) > 0)
    .sort((a, b) => (session[b.id]?.wrong ?? 0) - (session[a.id]?.wrong ?? 0))
    .slice(0, 6)

  return (
    <div className="session-complete">
      <div className="session-complete-icon" aria-hidden="true">🎉</div>
      <h2>Sessie voltooid!</h2>
      <p>Je hebt alle <strong>{countries.length}</strong> landen geoefend.</p>
      <div className="session-complete-stats">
        <div className="scs-item">
          <strong style={{ color: pct >= 80 ? '#228b5b' : pct >= 60 ? '#b07400' : '#c84b4b' }}>{pct}%</strong>
          <span>score</span>
        </div>
        <div className="scs-item">
          <strong style={{ color: '#228b5b' }}>{totalCorrect}</strong>
          <span>goed</span>
        </div>
        <div className="scs-item">
          <strong style={{ color: '#c84b4b' }}>{totalWrong}</strong>
          <span>fout</span>
        </div>
      </div>
      {toughCountries.length > 0 && (
        <div className="session-tough">
          <p>Volgende keer extra aandacht:</p>
          <div className="session-tough-list">
            {toughCountries.map((c) => (
              <span key={c.id} className="session-tough-item">
                {c.flag} {c.name}
                <small>{session[c.id]?.wrong ?? 0}× fout</small>
              </span>
            ))}
          </div>
        </div>
      )}
      <button type="button" className="session-start-btn" onClick={onStop}>
        Sessie afsluiten
      </button>
    </div>
  )
}

function PreviousQuestionPanel({ question, countries: visibleCountries, continent }: { question: Question; countries: Country[]; continent: Continent }) {
  return (
    <section className={question.correct ? 'previous-question correct' : 'previous-question wrong'} aria-label="Vorige vraag">
      <div className="prev-q-meta">
        <div>
          <span className="prev-q-label">Vorige vraag</span>
          <strong>{modeLabels[question.mode]} · {question.country.name}</strong>
        </div>
        <span className={question.correct ? 'result-badge correct' : 'result-badge wrong'}>
          {question.correct ? <Check size={13} aria-hidden="true" /> : <X size={13} aria-hidden="true" />}
          {question.correct ? 'Goed' : 'Fout'}
        </span>
      </div>

      {question.mode === 'vlaggen' && (
        <div className="prev-options-row">
          {question.options.map((country) => {
            const isCorrect = country.id === question.country.id
            const isWrongPick = question.selectedId === country.id && !isCorrect
            return (
              <div
                key={country.id}
                className={['prev-flag-option', isCorrect ? 'correct' : '', isWrongPick ? 'wrong' : ''].join(' ')}
                aria-label={`Vlag van ${country.name}${isCorrect ? ' — juist antwoord' : ''}${isWrongPick ? ' — jouw keuze' : ''}`}
              >
                <span aria-hidden="true">{country.flag}</span>
                {(isCorrect || isWrongPick) && (
                  <span className="prev-flag-badge" aria-hidden="true">
                    {isCorrect ? <Check size={11} /> : <X size={11} />}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {question.mode === 'landen' && (
        <>
          <div className="prev-answer-row">
            {!question.correct && question.selectedId && (
              <div className="prev-answer-item wrong">
                <span>Je klikte</span>
                <strong>{visibleCountries.find((c) => c.id === question.selectedId)?.name ?? '—'}</strong>
              </div>
            )}
            <div className="prev-answer-item correct">
              <span>Juist antwoord</span>
              <strong>{question.country.name}</strong>
            </div>
          </div>
          <PrevQuestionMap
            continent={continent}
            countries={visibleCountries}
            correctCountry={question.country}
            wrongCountryId={question.correct ? null : question.selectedId}
          />
        </>
      )}

      {question.mode === 'hoofdsteden' && (
        <div className="prev-answer-row">
          <div className={question.correct ? 'prev-answer-item correct' : 'prev-answer-item wrong'}>
            <span>{question.correct ? 'Jouw antwoord' : 'Jij typte'}</span>
            <strong>{question.typedAnswer || '(leeg)'}</strong>
          </div>
          {!question.correct && (
            <div className="prev-answer-item correct">
              <span>Juist antwoord</span>
              <strong>{question.country.capital}</strong>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function PrevQuestionMap({
  continent,
  countries: visibleCountries,
  correctCountry,
  wrongCountryId,
}: {
  continent: Continent
  countries: Country[]
  correctCountry: Country
  wrongCountryId: string | null
}) {
  const countryByMapId = useMemo(() => new Map(visibleCountries.map((c) => [c.mapId, c])), [visibleCountries])
  const effectiveContinent: Continent = continent === 'Wereld' ? correctCountry.continent : continent
  const view = useMemo(() => mapViewForContinent(effectiveContinent), [effectiveContinent])
  const [position, setPosition] = useState<MapPosition>({ coordinates: view.center, zoom: view.zoom })
  const geoData = geoDataFor(effectiveContinent, position.zoom)
  const wrongCountry = wrongCountryId ? visibleCountries.find((c) => c.id === wrongCountryId) ?? null : null

  useEffect(() => {
    setPosition({ coordinates: view.center, zoom: view.zoom })
  }, [view])

  return (
    <div className="cue-map prev-question-map">
      <ComposableMap projectionConfig={{ scale: 145 }} width={980} height={520}>
        <ZoomableGroup center={position.coordinates} zoom={position.zoom} onMoveEnd={setPosition}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geography) => {
                const mapCountry = countryByMapId.get(geographyKey(geography))
                const isCorrect = mapCountry?.id === correctCountry.id
                const isWrong = Boolean(wrongCountryId && mapCountry?.id === wrongCountryId)
                const fill = isCorrect ? '#26a46c' : isWrong ? '#d45252' : mapCountry ? '#d8e5ed' : 'transparent'
                return (
                  <Geography
                    key={geography.rsmKey}
                    geography={geography}
                    fill={fill}
                    stroke={mapCountry ? '#ffffff' : 'transparent'}
                    strokeWidth={strokeWidthForZoom(view, position.zoom)}
                    style={{
                      default: { opacity: mapCountry ? 1 : 0, outline: 'none', pointerEvents: 'none' },
                      hover: { opacity: mapCountry ? 1 : 0, outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>
          {correctCountry.area <= SMALL_COUNTRY_AREA && (
            <Marker coordinates={[correctCountry.latlng[1], correctCountry.latlng[0]]}>
              <circle r={markerRadiusForZoom(correctCountry, position.zoom)} fill="#26a46c" stroke="#0f172a" strokeWidth={0.9 / position.zoom} vectorEffect="non-scaling-stroke" />
            </Marker>
          )}
          {wrongCountry && wrongCountry.area <= SMALL_COUNTRY_AREA && (
            <Marker coordinates={[wrongCountry.latlng[1], wrongCountry.latlng[0]]}>
              <circle r={markerRadiusForZoom(wrongCountry, position.zoom)} fill="#d45252" stroke="#0f172a" strokeWidth={0.9 / position.zoom} vectorEffect="non-scaling-stroke" />
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}

function CuePanel({
  continent,
  countries: visibleCountries,
  country,
  mode,
  clues,
  answered,
  correct,
  selectedId,
  feedbackMessage,
  onNext,
  flagCue,
}: {
  continent: Continent
  countries: Country[]
  country: Country
  mode: Exclude<TrainerMode, 'gemengd' | 'oefenen'>
  clues: Record<Clue, boolean>
  answered?: boolean
  correct?: boolean | null
  selectedId?: string | null
  feedbackMessage?: string
  onNext?: () => void
  flagCue?: boolean
}) {
  const wrongCountry = selectedId ? (visibleCountries.find((c) => c.id === selectedId) ?? null) : null
  const showMapFeedback = Boolean(answered && (mode === 'landen' || flagCue))

  return (
    <div className="cue-panel">
      <div className="country-clues">
        {showMapFeedback ? (
          <div className={correct ? 'map-answer-feedback maf-correct-bg' : 'map-answer-feedback maf-wrong-bg'} role="status" aria-live="polite">
            {correct ? (
              <div className="maf-correct-card">
                <div className="maf-header maf-header-correct">
                  <Check size={16} aria-hidden="true" /> Goed!
                </div>
                <span className="maf-big-flag">{country.flag}</span>
                <strong className="maf-big-name">{country.name}</strong>
                <span className="maf-capital-line">{country.capital}</span>
              </div>
            ) : (
              <div className="maf-pair">
                {wrongCountry ? (
                  <div className="maf-single maf-wrong">
                    <span className="war-label"><X size={12} aria-hidden="true" /> Jij koos</span>
                    <span className="war-flag">{wrongCountry.flag}</span>
                    <strong className="war-name">{wrongCountry.name}</strong>
                    <span className="war-capital">{wrongCountry.capital}</span>
                  </div>
                ) : null}
                <div className="maf-arrow">→</div>
                <div className="maf-single maf-correct">
                  <span className="war-label"><Check size={12} aria-hidden="true" /> Goed antwoord</span>
                  <span className="war-flag">{country.flag}</span>
                  <strong className="war-name">{country.name}</strong>
                  <span className="war-capital">{country.capital}</span>
                </div>
              </div>
            )}
          </div>
        ) : answered && mode === 'hoofdsteden' ? (
          <div className={correct ? 'inline-feedback correct' : 'inline-feedback wrong'} role="status">
            <div className="inline-feedback-row">
              <div className="inline-feedback-text">
                {correct ? <Check size={18} aria-hidden="true" /> : <X size={18} aria-hidden="true" />}
                <span>{feedbackMessage}</span>
              </div>
              {correct && (
                <button type="button" className="inline-next-button" onClick={onNext}>
                  Volgende →
                </button>
              )}
            </div>
          </div>
        ) : flagCue ? (
          <div className="flag-cue-display">
            <span className="flag-cue-emoji" aria-hidden="true">{country.flag}</span>
            <strong className="flag-cue-instruction">Waar ligt dit land?</strong>
          </div>
        ) : (
          <>
            <strong>{cueInstruction(mode)}</strong>
            <span>{mode === 'hoofdsteden' ? 'Typ de hoofdstad. Kleine spelfouten tellen goed.' : 'Gebruik de aangevinkte hints.'}</span>
          </>
        )}
      </div>
      {!showMapFeedback && !flagCue && (
        <div className="cue-grid">
          {clues.name && (
            <div className="cue-card">
              <span>Land</span>
              <strong>{country.name}</strong>
            </div>
          )}
          {clues.flag && (
            <div className="cue-card flag-cue">
              <span>Vlag</span>
              <strong aria-label={`Vlag van ${country.name}`}>{country.flag}</strong>
            </div>
          )}
          {clues.capital && (
            <div className="cue-card">
              <span>Hoofdstad</span>
              <strong>{country.capital}</strong>
            </div>
          )}
          {clues.place && <CountryClueMap continent={continent} countries={visibleCountries} country={country} />}
        </div>
      )}
    </div>
  )
}

function cueInstruction(mode: Exclude<TrainerMode, 'gemengd' | 'oefenen'>) {
  if (mode === 'landen') {
    return 'Klik het land aan op de kaart.'
  }

  if (mode === 'vlaggen') {
    return 'Kies de juiste vlag.'
  }

  return 'Welke hoofdstad hoort erbij?'
}

function CountryClueMap({ continent, countries: visibleCountries, country, big }: { continent: Continent; countries: Country[]; country: Country; big?: boolean }) {
  const countryByMapId = useMemo(() => new Map(visibleCountries.map((item) => [item.mapId, item])), [visibleCountries])
  const effectiveContinent: Continent = continent === 'Wereld' ? country.continent : continent
  const view = useMemo(() => mapViewForContinent(effectiveContinent), [effectiveContinent])
  const [position, setPosition] = useState<MapPosition>({ coordinates: view.center, zoom: view.zoom })
  const geoData = geoDataFor(effectiveContinent, position.zoom)

  useEffect(() => {
    setPosition({ coordinates: view.center, zoom: view.zoom })
  }, [view])

  return (
    <div className={big ? 'cue-map cue-map-big' : 'cue-map'}>
      <ComposableMap projectionConfig={{ scale: 145 }} width={980} height={520}>
        <ZoomableGroup center={position.coordinates} zoom={position.zoom} onMoveEnd={setPosition}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geography) => {
                const mapCountry = countryByMapId.get(geographyKey(geography))
                const isTarget = mapCountry?.id === country.id

                return (
                  <Geography
                    key={geography.rsmKey}
                    geography={geography}
                    data-country-id={mapCountry?.id}
                    aria-label={mapCountry?.name}
                    fill={isTarget ? '#0f766e' : mapCountry ? '#d8e5ed' : 'transparent'}
                    stroke={mapCountry ? '#ffffff' : 'transparent'}
                    strokeWidth={strokeWidthForZoom(view, position.zoom)}
                    style={{
                      default: { opacity: mapCountry ? 1 : 0, outline: 'none', pointerEvents: 'none' },
                      hover: { opacity: mapCountry ? 1 : 0, outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>
          {country.area <= SMALL_COUNTRY_AREA && (
            <Marker coordinates={[country.latlng[1], country.latlng[0]]}>
              <circle r={markerRadiusForZoom(country, position.zoom)} fill="#0f766e" stroke="#0f172a" strokeWidth={0.9 / position.zoom} vectorEffect="non-scaling-stroke" />
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}

// Nearest country (by lat/lng) to a [lng, lat] map centre — used to seed the keyboard cursor.
function nearestCountryToCenter(list: Country[], centerLngLat: [number, number]): Country | null {
  const [clng, clat] = centerLngLat
  let best: Country | null = null
  let bestDist = Infinity
  for (const c of list) {
    const d = (c.latlng[0] - clat) ** 2 + (c.latlng[1] - clng) ** 2
    if (d < bestDist) {
      bestDist = d
      best = c
    }
  }
  return best
}

// Closest country in a compass direction from `cur` (arrow-key navigation).
function bestCountryInDirection(cur: Country, list: Country[], dir: 'up' | 'down' | 'left' | 'right'): Country | null {
  const clat = cur.latlng[0]
  const clng = cur.latlng[1]
  let best: Country | null = null
  let bestScore = Infinity
  for (const c of list) {
    if (c.id === cur.id) continue
    const dlat = c.latlng[0] - clat
    const dlng = c.latlng[1] - clng
    let primary: number
    let cross: number
    if (dir === 'up') {
      if (dlat <= 0) continue
      primary = dlat
      cross = Math.abs(dlng)
    } else if (dir === 'down') {
      if (dlat >= 0) continue
      primary = -dlat
      cross = Math.abs(dlng)
    } else if (dir === 'right') {
      if (dlng <= 0) continue
      primary = dlng
      cross = Math.abs(dlat)
    } else {
      if (dlng >= 0) continue
      primary = -dlng
      cross = Math.abs(dlat)
    }
    const score = primary + cross * 2
    if (score < bestScore) {
      bestScore = score
      best = c
    }
  }
  return best
}

function CountryClickMap({
  continent,
  countries: visibleCountries,
  question,
  chooseCountry,
  mapLocked,
  enableKeyboard,
  cursorStartId,
}: {
  continent: Continent
  countries: Country[]
  question: Question
  chooseCountry: (countryId: string) => void
  mapLocked?: boolean
  enableKeyboard?: boolean
  cursorStartId?: string
}) {
  const countryByMapId = useMemo(() => new Map(visibleCountries.map((country) => [country.mapId, country])), [visibleCountries])
  const isWorldMode = continent === 'Wereld'
  const [drillContinent, setDrillContinent] = useState<Exclude<Continent, 'Wereld'> | null>(null)
  const worldView = useMemo(() => mapViewForContinent(continent), [continent])
  // On phones the map is full-screen and portrait, so open it zoomed in to fill it.
  const zoomBoost = useMemo(() => (typeof window !== 'undefined' && window.innerWidth <= 640 ? 1.7 : 1), [])
  const [position, setPosition] = useState<MapPosition>({ coordinates: worldView.center, zoom: worldView.zoom * zoomBoost })
  const [cursorId, setCursorId] = useState<string | null>(cursorStartId ?? null)
  const cursorIdRef = useRef<string | null>(cursorId)

  const effectiveContinent: Continent = drillContinent ?? continent
  const effectiveView = useMemo(() => mapViewForContinent(effectiveContinent), [effectiveContinent])
  const geoData = geoDataFor(effectiveContinent, position.zoom)

  const smallCountries = useMemo(
    () => visibleCountries.filter((c) => {
      if (!shouldShowMarker(c, effectiveContinent)) return false
      if (drillContinent && c.continent !== drillContinent) return false
      return true
    }),
    [effectiveContinent, drillContinent, visibleCountries],
  )

  // Countries reachable by the keyboard cursor — those currently shown in this view.
  const navigable = useMemo(
    () => (effectiveContinent === 'Wereld' ? visibleCountries : visibleCountries.filter((c) => c.continent === effectiveContinent)),
    [effectiveContinent, visibleCountries],
  )

  useEffect(() => {
    setPosition({ coordinates: worldView.center, zoom: worldView.zoom * zoomBoost })
  }, [worldView, zoomBoost])

  useEffect(() => {
    if (!isWorldMode) return
    setDrillContinent(null)
    setPosition({ coordinates: worldView.center, zoom: worldView.zoom * zoomBoost })
  }, [question.country.id, isWorldMode, worldView, zoomBoost])

  // Reset the cursor to the previous question's country whenever a new question loads.
  useEffect(() => {
    setCursorId(cursorStartId ?? null)
  }, [question.country.id, cursorStartId])

  useEffect(() => {
    cursorIdRef.current = cursorId
  }, [cursorId])

  function drillTo(cont: Exclude<Continent, 'Wereld'>) {
    const contView = mapViewForContinent(cont)
    setDrillContinent(cont)
    // Use ~82% of normal zoom so the full continent fits in the practice frame
    setPosition({ coordinates: contView.center, zoom: contView.zoom * 0.82 * zoomBoost })
  }

  const locked = mapLocked ?? question.answered
  const showContinentView = isWorldMode && !drillContinent && !locked

  // Arrow keys move the cursor between countries; Enter confirms the highlighted one.
  useEffect(() => {
    if (!enableKeyboard || locked) return
    function onKey(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName ?? '').toLowerCase()
      if (tag === 'input' || tag === 'textarea') return
      const dir = ({ ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' } as const)[e.key]
      if (dir) {
        e.preventDefault()
        const cur = navigable.find((c) => c.id === cursorIdRef.current) ?? nearestCountryToCenter(navigable, effectiveView.center)
        if (!cur) return
        const next = bestCountryInDirection(cur, navigable, dir) ?? cur
        setCursorId(next.id)
      } else if (e.key === 'Enter') {
        const target = cursorIdRef.current ?? nearestCountryToCenter(navigable, effectiveView.center)?.id ?? null
        if (target) {
          e.preventDefault()
          chooseCountry(target)
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [enableKeyboard, locked, navigable, effectiveView, chooseCountry])

  return (
    <div className="practice-map-frame">
      {showContinentView && (
        <div className="map-overlay-hint">Klik een continent om in te zoomen</div>
      )}
      {isWorldMode && drillContinent && !locked && (
        <button className="map-back-button" type="button" onClick={() => {
          setDrillContinent(null)
          setPosition({ coordinates: worldView.center, zoom: worldView.zoom })
        }}>
          ← Wereld
        </button>
      )}
      <ComposableMap projectionConfig={{ scale: 145 }} width={980} height={520}>
        <ZoomableGroup center={position.coordinates} zoom={position.zoom} minZoom={1} maxZoom={48} onMoveEnd={setPosition}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geography) => {
                const country = countryByMapId.get(geographyKey(geography))
                const isTarget = country?.id === question.country.id
                const isWrongPick = Boolean(locked && country && question.selectedId === country.id && !isTarget)
                const isCursor = Boolean(enableKeyboard && !locked && country && country.id === cursorId)

                if (showContinentView) {
                  const continentColor = country ? CONTINENT_COLORS[country.continent] : 'transparent'
                  const hoverColor = country ? CONTINENT_HOVER_COLORS[country.continent] : 'transparent'
                  return (
                    <Geography
                      key={geography.rsmKey}
                      geography={geography}
                      fill={continentColor}
                      stroke={isCursor ? '#1d4ed8' : '#ffffff'}
                      strokeWidth={isCursor ? strokeWidthForZoom(worldView, position.zoom) * 3.5 : strokeWidthForZoom(worldView, position.zoom)}
                      onClick={() => { if (country) drillTo(country.continent) }}
                      style={{
                        default: { opacity: country ? 1 : 0, outline: 'none', pointerEvents: country ? 'auto' : 'none', cursor: country ? 'pointer' : 'default' },
                        hover: { opacity: country ? 1 : 0, fill: hoverColor, outline: 'none', cursor: country ? 'pointer' : 'default' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  )
                }

                const fill = locked && isTarget ? '#16a34a' : isWrongPick ? '#dc2626' : isCursor ? '#9ec5e8' : country ? '#d8e5ed' : 'transparent'
                const isClickable = Boolean(country && !locked)

                return (
                  <Geography
                    key={geography.rsmKey}
                    geography={geography}
                    data-country-id={country?.id}
                    aria-label={country?.name}
                    fill={fill}
                    stroke={isCursor ? '#1d4ed8' : country ? '#ffffff' : 'transparent'}
                    strokeWidth={isCursor ? strokeWidthForZoom(effectiveView, position.zoom) * 3.5 : strokeWidthForZoom(effectiveView, position.zoom)}
                    onClick={() => {
                      if (!country || locked) return
                      if (isWorldMode && drillContinent && country.continent !== drillContinent) {
                        drillTo(country.continent)
                      } else {
                        chooseCountry(country.id)
                      }
                    }}
                    style={{
                      default: { cursor: isClickable ? 'pointer' : 'default', opacity: country ? 1 : 0, outline: 'none', pointerEvents: country ? 'auto' : 'none' },
                      hover: { cursor: isClickable ? 'pointer' : 'default', opacity: country ? 1 : 0, fill: isClickable ? '#0f766e' : fill, outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>
          {smallCountries.map((country) => {
            const isTarget = country.id === question.country.id
            const isWrongPick = Boolean(locked && question.selectedId === country.id && !isTarget)
            const isCursor = Boolean(enableKeyboard && !locked && country.id === cursorId)
            const fill = locked && isTarget ? '#16a34a' : isWrongPick ? '#dc2626' : isCursor ? '#9ec5e8' : '#f8fbfd'
            const radius = markerRadiusForZoom(country, position.zoom)

            return (
              <Marker key={`marker-${country.id}`} coordinates={[country.latlng[1], country.latlng[0]]}>
                <circle
                  r={isCursor ? radius * 1.35 : radius}
                  fill={fill}
                  stroke={isCursor ? '#1d4ed8' : '#0f172a'}
                  strokeWidth={isCursor ? 2.4 / position.zoom : 0.9 / position.zoom}
                  vectorEffect="non-scaling-stroke"
                  role="button"
                  aria-label={country.name}
                  onClick={() => { if (!locked) chooseCountry(country.id) }}
                  style={{ cursor: locked ? 'default' : 'pointer' }}
                />
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}

type MapView = {
  center: [number, number]
  zoom: number
  strokeWidth: number
}

function mapQuestionLayout(continent: Continent) {
  return continent === 'Afrika' || continent === 'Zuid-Amerika' ? 'side' : 'stack'
}

type MapPosition = {
  coordinates: [number, number]
  zoom: number
}

function mapViewForContinent(continent: Continent): MapView {
  const views: Record<Continent, MapView> = {
    Wereld: { center: [8, 14], zoom: 1, strokeWidth: 0.35 },
    Afrika: { center: [20, -4], zoom: 3.45, strokeWidth: 0.2 },
    Azie: { center: [87, 26], zoom: 2.25, strokeWidth: 0.22 },
    Europa: { center: [15, 51], zoom: 5.9, strokeWidth: 0.1 },
    'Noord-Amerika': { center: [-95, 41], zoom: 2.45, strokeWidth: 0.2 },
    'Zuid-Amerika': { center: [-60, -19], zoom: 3.85, strokeWidth: 0.15 },
    Oceanie: { center: [145, -18], zoom: 3.25, strokeWidth: 0.16 },
  }

  return views[continent]
}

function markerRadiusForZoom(country: Country, zoom: number) {
  const screenRadius = country.id === 'VAT' || country.id === 'MCO' ? 5.2 : 4.4
  return screenRadius / zoom
}

function strokeWidthForZoom(view: MapView, zoom: number) {
  return view.strokeWidth * (view.zoom / zoom)
}

function geoDataFor(continent: Continent, zoom: number) {
  return continent === 'Wereld' && zoom < WORLD_DETAIL_ZOOM ? worldGeoUrl : mediumGeoUrl
}

function markerAreaLimit(continent: Continent) {
  return continent === 'Wereld' ? WORLD_MARKER_MAX_AREA : SMALL_COUNTRY_AREA
}

function shouldShowMarker(country: Country, continent: Continent) {
  return country.area <= markerAreaLimit(continent) || (continent === 'Wereld' && country.id === 'XKX')
}

function geographyKey(geography: { id?: string | number; properties?: { name?: string } }) {
  return String(geography.id ?? geography.properties?.name ?? '')
}

function feedbackText(question: Question, visibleCountries: Country[]) {
  if (question.mode === 'landen') {
    const selectedCountry = visibleCountries.find((country) => country.id === question.selectedId)
    return question.correct
      ? `Goed, dat is ${question.country.name}.`
      : `Bijna. Je klikte ${selectedCountry?.name ?? 'een ander land'} aan. Het goede antwoord is ${question.country.name}.`
  }

  if (question.mode === 'vlaggen') {
    const selectedCountry = visibleCountries.find((country) => country.id === question.selectedId)
    return question.correct
      ? `Goed, dat is de vlag van ${question.country.name}.`
      : `Bijna. Je koos ${selectedCountry?.name ?? 'een andere vlag'}. Het goede antwoord is ${question.country.name}.`
  }

  return question.correct
    ? `Goed! ${question.country.capital} is de hoofdstad van ${question.country.name}.`
    : `Bijna. Je typte ${question.typedAnswer || 'geen antwoord'}. De hoofdstad van ${question.country.name} is ${question.country.capital}.`
}

function practiceTitle(mode: QuestionMode, answerKind?: VlagAnswer) {
  if (mode === 'hoofdsteden') return 'Welke hoofdstad hoort erbij?'
  if (mode === 'landen') return 'Klik het land aan op de kaart'
  if (mode === 'combo') return 'Klik het land + typ de hoofdstad'
  if (mode === 'maximaal') return 'Aanwijzen + vlag + hoofdstad'
  if (mode === 'identify') return 'Welk land is dit?'
  // vlaggen — title depends on the chosen answer method
  if (answerKind === 'kaart') return 'Waar ligt dit land?'
  if (answerKind === 'hoofdstad') return 'Wat is de hoofdstad?'
  if (answerKind === 'beide') return 'Waar ligt het + wat is de hoofdstad?'
  return 'Welk land hoort bij deze vlag?'
}

function modeAccuracy(progress: ProgressState, countryId: string, mode: Exclude<TrainerMode, 'gemengd' | 'oefenen'>): number | null {
  const stats = progress[countryId]?.[mode]
  if (!stats) return null
  const attempts = stats.correct + stats.wrong
  if (!attempts) return null
  return Math.round((stats.correct / attempts) * 100)
}

function LearnFlagMap({ continent, countries: visibleCountries }: { continent: Continent; countries: Country[] }) {
  const view = useMemo(() => mapViewForContinent(continent), [continent])
  // On phones the world map is shown in a tall frame — open it zoomed in so the
  // countries are legible and the map fills the frame instead of letterboxing.
  const initialZoom = useMemo(() => {
    const phone = typeof window !== 'undefined' && window.innerWidth <= 640
    return phone && continent === 'Wereld' ? view.zoom * 2.4 : view.zoom
  }, [continent, view])
  const [position, setPosition] = useState<MapPosition>({ coordinates: view.center, zoom: initialZoom })
  const countryByMapId = useMemo(() => new Map(visibleCountries.map((c) => [c.mapId, c])), [visibleCountries])
  const [hovered, setHovered] = useState<Country | null>(null)
  const [layers, setLayers] = useState({ flags: true, names: true, capitals: false })
  const geoData = geoDataFor(continent, position.zoom)
  const allOff = !layers.flags && !layers.names && !layers.capitals

  useEffect(() => {
    setPosition({ coordinates: view.center, zoom: initialZoom })
  }, [view, initialZoom])

  function toggleLayer(key: keyof typeof layers) {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flag-map-wrap">
      <div className="map-layer-controls">
        <span className="mlc-label">Toon:</span>
        {(['flags', 'names', 'capitals'] as const).map((key) => (
          <button key={key} type="button" className={layers[key] ? 'mlc-btn active' : 'mlc-btn'} onClick={() => toggleLayer(key)}>
            {key === 'flags' ? 'Vlaggen' : key === 'names' ? 'Namen' : 'Hoofdsteden'}
          </button>
        ))}
        {allOff && <span className="mlc-hint">Zweef voor details</span>}
      </div>
      <ComposableMap projectionConfig={{ scale: 145 }} width={980} height={520}>
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          onMove={(m: { zoom: number }) => setPosition((prev) => ({ ...prev, zoom: m.zoom }))}
          onMoveEnd={setPosition}
        >
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const country = countryByMapId.get(geographyKey(geo))
                const fill = country
                  ? continent === 'Wereld'
                    ? (CONTINENT_COLORS[country.continent as Exclude<Continent, 'Wereld'>] ?? '#d8e5ed')
                    : '#c4d8e8'
                  : 'transparent'
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={hovered?.id === country?.id ? '#7aadd4' : fill}
                    stroke={country ? 'rgba(255,255,255,0.7)' : 'transparent'}
                    strokeWidth={strokeWidthForZoom(view, position.zoom)}
                    style={{ default: { outline: 'none' }, hover: { outline: 'none', opacity: 0.8 }, pressed: { outline: 'none' } }}
                    onMouseEnter={() => country && setHovered(country)}
                    onMouseLeave={() => setHovered(null)}
                  />
                )
              })
            }
          </Geographies>
          {visibleCountries.map((country) => {
            const isHov = hovered?.id === country.id
            const showFlag = layers.flags || (allOff && isHov)
            const showName = layers.names || (allOff && isHov)
            const showCap = (layers.capitals && position.zoom >= 2.5) || (allOff && isHov)
            if (!showFlag && !showName && !showCap) return null

            const flagPx = 14 / position.zoom
            const namePx = 7 / position.zoom
            const capPx = 5.5 / position.zoom
            const totalH = (showFlag ? flagPx : 0) + (showName ? namePx * 0.95 : 0) + (showCap ? capPx * 0.9 : 0)
            let cy = -totalH / 2
            let flagY = 0, nameY = 0, capY = 0
            if (showFlag) { flagY = cy + flagPx * 0.8; cy += flagPx }
            if (showName) { nameY = cy + namePx * 0.85; cy += namePx * 0.95 }
            if (showCap) { capY = cy + capPx * 0.75 }

            return (
              <Marker key={country.id} coordinates={[country.latlng[1], country.latlng[0]]}>
                {showFlag && (
                  <text textAnchor="middle" y={flagY} style={{ fontSize: `${flagPx}px`, userSelect: 'none', pointerEvents: 'none' }}>
                    {country.flag}
                  </text>
                )}
                {showName && (
                  <text
                    textAnchor="middle"
                    y={nameY}
                    fill="#0f1c2e"
                    stroke="rgba(255,255,255,0.88)"
                    strokeWidth={namePx * 0.3}
                    style={{ fontSize: `${namePx}px`, fontWeight: 700, userSelect: 'none', pointerEvents: 'none', paintOrder: 'stroke' as const }}
                  >
                    {country.name}
                  </text>
                )}
                {showCap && (
                  <text
                    textAnchor="middle"
                    y={capY}
                    fill="#4a5f7a"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth={capPx * 0.25}
                    style={{ fontSize: `${capPx}px`, userSelect: 'none', pointerEvents: 'none', paintOrder: 'stroke' as const }}
                  >
                    {country.capital}
                  </text>
                )}
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>
      {hovered && (
        <div className="flag-map-tooltip">
          <span className="fmtt-flag">{hovered.flag}</span>
          <div>
            <strong>{hovered.name}</strong>
            <small>{hovered.capital}</small>
          </div>
        </div>
      )}
      <p className="flag-map-hint">Scroll om in te zoomen · zweef voor details</p>
    </div>
  )
}

function LearnContinentView({
  continent,
  countries: visibleCountries,
}: {
  continent: Exclude<Continent, 'Wereld'>
  countries: Country[]
}) {
  const view = useMemo(() => mapViewForContinent(continent), [continent])
  const zoomBoost = useMemo(() => (typeof window !== 'undefined' && window.innerWidth <= 640 ? 1.5 : 1), [])
  const [position, setPosition] = useState<MapPosition>({ coordinates: view.center, zoom: view.zoom * zoomBoost })
  const countryByMapId = useMemo(() => new Map(visibleCountries.map((c) => [c.mapId, c])), [visibleCountries])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [layers, setLayers] = useState({ flags: true, names: true, capitals: true })
  const geoData = geoDataFor(continent, position.zoom)
  const allOff = !layers.flags && !layers.names && !layers.capitals

  useEffect(() => {
    setPosition({ coordinates: view.center, zoom: view.zoom * zoomBoost })
  }, [view, zoomBoost])

  function toggleLayer(key: keyof typeof layers) {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="continent-overview">
      <div className="continent-list">
        {visibleCountries.map((country) => (
          <div
            key={country.id}
            className={`continent-list-item${hoveredId === country.id ? ' is-hovered' : ''}`}
            onMouseEnter={() => setHoveredId(country.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <span className="cl-flag" aria-hidden="true">{country.flag}</span>
            <div className="cl-info">
              <strong>{country.name}</strong>
              <span>{country.capital}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="continent-map-col">
        <div className="map-layer-controls">
          <span className="mlc-label">Toon:</span>
          {(['flags', 'names', 'capitals'] as const).map((key) => (
            <button key={key} type="button" className={layers[key] ? 'mlc-btn active' : 'mlc-btn'} onClick={() => toggleLayer(key)}>
              {key === 'flags' ? 'Vlaggen' : key === 'names' ? 'Namen' : 'Hoofdsteden'}
            </button>
          ))}
          {allOff && <span className="mlc-hint">Zweef over land voor details</span>}
        </div>
        <div className="continent-map-panel">
          <ComposableMap projectionConfig={{ scale: 145 }} width={980} height={520}>
            <ZoomableGroup
              center={position.coordinates}
              zoom={position.zoom}
              onMove={(m: { zoom: number }) => setPosition((prev) => ({ ...prev, zoom: m.zoom }))}
              onMoveEnd={setPosition}
            >
              <Geographies geography={geoData}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const country = countryByMapId.get(geographyKey(geo))
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={country ? (hoveredId === country.id ? '#5592bc' : '#c4d8e8') : 'transparent'}
                        stroke={country ? '#ffffff' : 'transparent'}
                        strokeWidth={strokeWidthForZoom(view, position.zoom)}
                        style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                        onMouseEnter={() => country && setHoveredId(country.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      />
                    )
                  })
                }
              </Geographies>
              {visibleCountries.map((country) => {
                const isHov = hoveredId === country.id
                const showFlag = layers.flags || (allOff && isHov)
                const showName = layers.names || (allOff && isHov)
                const showCap = layers.capitals || (allOff && isHov)
                if (!showFlag && !showName && !showCap) return null

                const flagPx = 18 / position.zoom
                const namePx = 12 / position.zoom
                const capPx = 8 / position.zoom

                const totalH =
                  (showFlag ? flagPx : 0) +
                  (showName ? namePx * 0.95 : 0) +
                  (showCap ? capPx * 0.9 : 0)
                let cy = -totalH / 2
                let flagY = 0, nameY = 0, capY = 0
                if (showFlag) { flagY = cy + flagPx * 0.8; cy += flagPx }
                if (showName) { nameY = cy + namePx * 0.85; cy += namePx * 0.95 }
                if (showCap) { capY = cy + capPx * 0.75 }

                return (
                  <Marker key={country.id} coordinates={[country.latlng[1], country.latlng[0]]}>
                    {showFlag && (
                      <text textAnchor="middle" y={flagY} style={{ fontSize: `${flagPx}px`, userSelect: 'none', pointerEvents: 'none' }}>
                        {country.flag}
                      </text>
                    )}
                    {showName && (
                      <text
                        textAnchor="middle"
                        y={nameY}
                        fill={isHov ? '#1b5a9e' : '#0f1c2e'}
                        stroke="rgba(255,255,255,0.92)"
                        strokeWidth={namePx * 0.32}
                        style={{ fontSize: `${namePx}px`, fontWeight: 800, userSelect: 'none', pointerEvents: 'none', paintOrder: 'stroke' as const }}
                      >
                        {country.name}
                      </text>
                    )}
                    {showCap && (
                      <text
                        textAnchor="middle"
                        y={capY}
                        fill={isHov ? '#0f766e' : '#4a5f7a'}
                        stroke="rgba(255,255,255,0.85)"
                        strokeWidth={capPx * 0.25}
                        style={{ fontSize: `${capPx}px`, userSelect: 'none', pointerEvents: 'none', paintOrder: 'stroke' as const }}
                      >
                        ● {country.capital}
                      </text>
                    )}
                  </Marker>
                )
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>
    </div>
  )
}

// Learn tab: groups of look-alike flags shown side by side
function SimilarFlagsView() {
  const byId = useMemo(() => new Map(countries.map((c) => [c.id, c])), [])
  return (
    <div className="similar-flags">
      <p className="similar-flags-intro">
        Deze vlaggen lijken sterk op elkaar. Bekijk elke groep naast elkaar en let op de kleine verschillen.
      </p>
      <div className="similar-flags-groups">
        {SIMILAR_FLAG_SETS.map((set) => {
          const members = set.ids.map((id) => byId.get(id)).filter((c): c is Country => Boolean(c))
          if (members.length < 2) return null
          return (
            <section className="flag-group" key={set.label}>
              <div className="flag-group-head">
                <strong>{set.label}</strong>
                <span>{set.hint}</span>
              </div>
              <div className="flag-group-row">
                {members.map((c) => (
                  <div className="flag-group-item" key={c.id}>
                    <span className="fg-flag" aria-hidden="true">{c.flag}</span>
                    <span className="fg-name">{c.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function LearnPanel({ continent, countries: visibleCountries, progress }: { continent: Continent; countries: Country[]; progress: ProgressState }) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [learnView, setLearnView] = useState<'tegels' | 'kaart' | 'overzicht' | 'vlaggen'>('tegels')
  const [overviewContinent, setOverviewContinent] = useState<Exclude<Continent, 'Wereld'> | null>(null)

  const continentList: Exclude<Continent, 'Wereld'>[] = ['Afrika', 'Azie', 'Europa', 'Noord-Amerika', 'Zuid-Amerika', 'Oceanie']

  const effectiveOverviewContinent: Exclude<Continent, 'Wereld'> | null =
    continent !== 'Wereld' ? continent : overviewContinent

  const overviewCountries = useMemo(
    () =>
      effectiveOverviewContinent
        ? visibleCountries.filter((c) => c.continent === effectiveOverviewContinent)
        : visibleCountries,
    [effectiveOverviewContinent, visibleCountries],
  )

  function selectCountry(country: Country) {
    setSelectedCountry((current) => (current?.id === country.id ? null : country))
  }

  return (
    <div className="learn-panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Leren</p>
          <h2>Alle landen, vlaggen en hoofdsteden</h2>
        </div>
        <div className="learn-controls">
          <div className="learn-view-toggle">
            <button type="button" className={learnView === 'tegels' ? 'lvt-btn active' : 'lvt-btn'} onClick={() => setLearnView('tegels')}>
              Tegels
            </button>
            <button type="button" className={learnView === 'kaart' ? 'lvt-btn active' : 'lvt-btn'} onClick={() => setLearnView('kaart')}>
              Vlaggenkaart
            </button>
            <button type="button" className={learnView === 'overzicht' ? 'lvt-btn active' : 'lvt-btn'} onClick={() => setLearnView('overzicht')}>
              Per continent
            </button>
            <button type="button" className={learnView === 'vlaggen' ? 'lvt-btn active' : 'lvt-btn'} onClick={() => setLearnView('vlaggen')}>
              Gelijkende vlaggen
            </button>
          </div>
          {learnView !== 'vlaggen' && <span className="count-pill">{visibleCountries.length} landen</span>}
        </div>
      </header>

      {learnView === 'vlaggen' && <SimilarFlagsView />}

      {learnView === 'kaart' && <LearnFlagMap continent={continent} countries={visibleCountries} />}

      {learnView === 'overzicht' &&
        (effectiveOverviewContinent ? (
          <div className="overview-wrap">
            {continent === 'Wereld' && (
              <button type="button" className="overview-back" onClick={() => setOverviewContinent(null)}>
                ← Alle continenten
              </button>
            )}
            <LearnContinentView continent={effectiveOverviewContinent} countries={overviewCountries} />
          </div>
        ) : (
          <div className="continent-picker">
            <p className="continent-picker-hint">Kies een continent om te verkennen</p>
            <div className="continent-picker-grid">
              {continentList.map((cont) => {
                const cnt = visibleCountries.filter((c) => c.continent === cont).length
                return (
                  <button
                    key={cont}
                    type="button"
                    className="continent-pick-card"
                    style={{ '--cont-color': CONTINENT_COLORS[cont] } as React.CSSProperties}
                    onClick={() => setOverviewContinent(cont)}
                  >
                    <strong>{cont}</strong>
                    <span>{cnt} landen</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

      {learnView === 'tegels' && (
        <div className={selectedCountry ? 'learn-layout has-detail' : 'learn-layout'}>
          <div className="learn-grid">
            {visibleCountries.map((country) => {
              const score = masteryForCountry(progress, country.id)
              const isSelected = selectedCountry?.id === country.id
              return (
                <article
                  className={isSelected ? 'country-card is-selected' : 'country-card'}
                  key={country.id}
                  onClick={() => selectCountry(country)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && selectCountry(country)}
                  aria-pressed={isSelected}
                >
                  <span className="card-flag" aria-hidden="true">{country.flag}</span>
                  <div>
                    <h3>{country.name}</h3>
                    <p>{country.capital}</p>
                    <span>{country.continent}</span>
                  </div>
                  <strong style={{ color: scoreColor(score) }}>{score}%</strong>
                </article>
              )
            })}
          </div>

          {selectedCountry ? (
            <CountryDetailPanel
              continent={continent}
              countries={visibleCountries}
              country={selectedCountry}
              progress={progress}
              onClose={() => setSelectedCountry(null)}
            />
          ) : (
            <div className="learn-detail-placeholder">
              <Globe2 size={36} aria-hidden="true" />
              <p>Klik op een land om de kaart en details te zien</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CountryDetailPanel({
  continent,
  countries,
  country,
  progress,
  onClose,
}: {
  continent: Continent
  countries: Country[]
  country: Country
  progress: ProgressState
  onClose: () => void
}) {
  const score = masteryForCountry(progress, country.id)
  return (
    <div className="learn-detail-panel">
      <div className="detail-header">
        <span className="detail-flag" aria-hidden="true">{country.flag}</span>
        <button className="detail-close" type="button" onClick={onClose} aria-label="Sluiten">
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="detail-info">
        <h3>{country.name}</h3>
        <div className="detail-meta">
          <div className="detail-meta-item">
            <span>Hoofdstad</span>
            <strong>{country.capital}</strong>
          </div>
          <div className="detail-meta-item">
            <span>Continent</span>
            <strong>{country.continent}</strong>
          </div>
          <div className="detail-meta-item">
            <span>Score</span>
            <strong style={{ color: scoreColor(score) }}>{score}%</strong>
          </div>
        </div>
      </div>
      <CountryClueMap continent={continent} countries={countries} country={country} />
    </div>
  )
}

type SortCol = 'name' | 'totaal' | 'vlaggen' | 'landen' | 'hoofdsteden'

function ProgressListView({ progress }: { progress: ProgressState }) {
  const [filterContinent, setFilterContinent] = useState<Continent>('Wereld')
  const [sort, setSort] = useState<{ col: SortCol; dir: 'asc' | 'desc' }>({ col: 'totaal', dir: 'asc' })

  const continentOptions: Continent[] = ['Wereld', 'Afrika', 'Azie', 'Europa', 'Noord-Amerika', 'Zuid-Amerika', 'Oceanie']

  const rows = useMemo(() => {
    const filtered = filterContinent === 'Wereld' ? countries : countries.filter((c) => c.continent === filterContinent)
    return [...filtered].sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1
      if (sort.col === 'name') return dir * a.name.localeCompare(b.name, 'nl')
      if (sort.col === 'totaal') return dir * (masteryForCountry(progress, a.id) - masteryForCountry(progress, b.id))
      const mode = sort.col as Exclude<TrainerMode, 'gemengd' | 'oefenen'>
      return dir * ((modeAccuracy(progress, a.id, mode) ?? -1) - (modeAccuracy(progress, b.id, mode) ?? -1))
    })
  }, [filterContinent, sort, progress])

  function toggleSort(col: SortCol) {
    setSort((prev) => (prev.col === col ? { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'desc' }))
  }

  function SortIcon({ col }: { col: SortCol }) {
    if (sort.col !== col) return <span className="sort-idle">↕</span>
    return <span className="sort-active">{sort.dir === 'desc' ? '↓' : '↑'}</span>
  }

  function PctCell({ val }: { val: number | null }) {
    if (val === null) return <td className="pct-cell pct-none">—</td>
    const color = val >= 80 ? '#228b5b' : val >= 50 ? '#b07400' : '#c84b4b'
    return <td className="pct-cell" style={{ color }}>{val}%</td>
  }

  return (
    <div className="progress-list-wrap">
      <div className="progress-continent-filter">
        {continentOptions.map((cont) => (
          <button
            key={cont}
            type="button"
            className={filterContinent === cont ? 'pf-chip active' : 'pf-chip'}
            onClick={() => setFilterContinent(cont)}
          >
            {cont === 'Wereld' ? 'Alle' : cont}
          </button>
        ))}
      </div>
      <div className="progress-table-wrap">
        <table className="progress-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => toggleSort('name')}>Land <SortIcon col="name" /></th>
              <th className="sortable" onClick={() => toggleSort('landen')}>Landen <SortIcon col="landen" /></th>
              <th className="sortable" onClick={() => toggleSort('vlaggen')}>Vlaggen <SortIcon col="vlaggen" /></th>
              <th className="sortable" onClick={() => toggleSort('hoofdsteden')}>Hoofdsteden <SortIcon col="hoofdsteden" /></th>
              <th className="sortable" onClick={() => toggleSort('totaal')}>Totaal <SortIcon col="totaal" /></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((country) => {
              const totaal = masteryForCountry(progress, country.id)
              return (
                <tr key={country.id}>
                  <td className="country-name-cell">
                    <span aria-hidden="true">{country.flag}</span>
                    <div>
                      <strong>{country.name}</strong>
                      <small>{country.capital}</small>
                    </div>
                  </td>
                  <PctCell val={modeAccuracy(progress, country.id, 'landen')} />
                  <PctCell val={modeAccuracy(progress, country.id, 'vlaggen')} />
                  <PctCell val={modeAccuracy(progress, country.id, 'hoofdsteden')} />
                  <td className="pct-cell pct-totaal" style={{ color: totaal > 0 ? scoreColor(totaal) : '#94a3b8', fontWeight: 700 }}>
                    {totaal > 0 ? `${totaal}%` : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MapPanel({
  continent,
  countries: visibleCountries,
  progress,
  weakestCountries,
}: {
  continent: Continent
  countries: Country[]
  progress: ProgressState
  weakestCountries: Country[]
}) {
  const [mapTab, setMapTab] = useState<'kaart' | 'lijst'>('kaart')
  const countryByMapId = useMemo(() => new Map(visibleCountries.map((country) => [country.mapId, country])), [visibleCountries])
  const smallCountries = useMemo(() => visibleCountries.filter((country) => shouldShowMarker(country, continent)), [continent, visibleCountries])
  const view = useMemo(() => mapViewForContinent(continent), [continent])
  const [position, setPosition] = useState<MapPosition>({ coordinates: view.center, zoom: view.zoom })
  const geoData = geoDataFor(continent, position.zoom)

  useEffect(() => {
    setPosition({ coordinates: view.center, zoom: view.zoom })
  }, [view])

  return (
    <div className="map-panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Voortgang</p>
          <h2>Waar ken je de wereld al?</h2>
        </div>
        <div className="map-tab-group">
          <button type="button" className={mapTab === 'kaart' ? 'mtab active' : 'mtab'} onClick={() => setMapTab('kaart')}>
            Kaart
          </button>
          <button type="button" className={mapTab === 'lijst' ? 'mtab active' : 'mtab'} onClick={() => setMapTab('lijst')}>
            Lijst
          </button>
        </div>
        {mapTab === 'kaart' && (
          <div className="legend">
            <span className="unknown"></span> nieuw
            <span className="low"></span> oefenen
            <span className="mid"></span> groeit
            <span className="high"></span> sterk
          </div>
        )}
      </header>

      {mapTab === 'lijst' ? (
        <ProgressListView progress={progress} />
      ) : (
        <>
          <div className="map-frame">
            <ComposableMap projectionConfig={{ scale: 145 }} width={980} height={520}>
              <ZoomableGroup center={position.coordinates} zoom={position.zoom} onMoveEnd={setPosition}>
                <Geographies geography={geoData}>
                  {({ geographies }) =>
                    geographies.map((geography) => {
                      const country = countryByMapId.get(geographyKey(geography))
                      const score = country ? masteryForCountry(progress, country.id) : 0
                      return (
                        <Geography
                          key={geography.rsmKey}
                          geography={geography}
                          data-country-id={country?.id}
                          aria-label={country?.name}
                          fill={country ? scoreColor(score) : 'transparent'}
                          stroke={country ? '#ffffff' : 'transparent'}
                          strokeWidth={strokeWidthForZoom(view, position.zoom)}
                          style={{
                            default: { opacity: country ? 1 : 0, outline: 'none', pointerEvents: country ? 'auto' : 'none' },
                            hover: { opacity: country ? 1 : 0, outline: 'none', fill: country ? '#0f766e' : '#dfe6ea' },
                            pressed: { outline: 'none' },
                          }}
                        />
                      )
                    })
                  }
                </Geographies>
                {smallCountries.map((country) => {
                  const score = masteryForCountry(progress, country.id)
                  const radius = markerRadiusForZoom(country, position.zoom)
                  return (
                    <Marker key={`marker-${country.id}`} coordinates={[country.latlng[1], country.latlng[0]]}>
                      <circle r={radius} fill={scoreColor(score)} stroke="#0f172a" strokeWidth={0.85 / position.zoom} vectorEffect="non-scaling-stroke" />
                    </Marker>
                  )
                })}
              </ZoomableGroup>
            </ComposableMap>
          </div>

          <section className="weak-list" aria-labelledby="weak-title">
            <h3 id="weak-title">Beste volgende landen om te oefenen</h3>
            <div>
              {weakestCountries.map((country) => (
                <span key={country.id}>
                  {country.flag} {country.name} · {masteryForCountry(progress, country.id)}%
                </span>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default App
