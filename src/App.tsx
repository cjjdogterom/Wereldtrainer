import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import { BookOpen, Check, Globe2, GraduationCap, Map as MapIcon, RotateCcw, Target, Timer, X } from 'lucide-react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import mediumGeoUrl from 'world-atlas/countries-50m.json?url'
import worldGeoUrl from 'world-atlas/countries-110m.json?url'
import './App.css'
import { continents, countries, modeLabels, routineLabels, type Continent, type Country, type Routine, type TrainerMode } from './data/countries'
import {
  applyAnswer,
  isCloseCapitalAnswer,
  loadProgress,
  masteryForCountry,
  masteryForMode,
  resetProgress,
  saveProgress,
  scoreColor,
  summarizeProgress,
  type ProgressState,
} from './lib/training'

type Screen = 'oefenen' | 'leren' | 'kaart'
type Clue = 'name' | 'flag' | 'capital' | 'place'
type ClueSettings = Record<Exclude<TrainerMode, 'gemengd'>, Record<Clue, boolean>>

type Question = {
  country: Country
  mode: Exclude<TrainerMode, 'gemengd'>
  options: Country[]
  answered: boolean
  correct: boolean | null
  selectedId: string | null
  typedAnswer: string
}

const TRAINING_MODES: Exclude<TrainerMode, 'gemengd'>[] = ['landen', 'vlaggen', 'hoofdsteden']
const SMALL_COUNTRY_AREA = 3000
const WORLD_MARKER_MAX_AREA = 200
const WORLD_DETAIL_ZOOM = 1.65
const ADVANCE_CORRECT_MS = 1750
const ADVANCE_WRONG_MS = 4000

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

const SIMILAR_FLAG_GROUPS = [
  ['NLD', 'LUX', 'RUS', 'SRB', 'SVK', 'SVN', 'HRV', 'PRY'],
  ['BEL', 'DEU', 'UGA', 'AGO'],
  ['IRL', 'CIV', 'IND', 'NER'],
  ['ROU', 'MDA', 'AND', 'TCD'],
  ['IDN', 'MCO', 'POL', 'SGP', 'AUT', 'LVA'],
  ['JPN', 'BGD', 'PLW'],
  ['AUS', 'NZL', 'FJI', 'TUV'],
  ['USA', 'MYS', 'LBR'],
  ['TUR', 'TUN', 'PAK', 'AZE'],
  ['NOR', 'ISL', 'FIN', 'SWE', 'DNK'],
  ['HUN', 'BGR', 'IRN', 'TJK'],
  ['COL', 'ECU', 'VEN'],
  ['ARG', 'SLV', 'HND', 'NIC', 'GTM'],
  ['QAT', 'BHR'],
  ['ARE', 'JOR', 'KWT', 'SDN', 'SSD'],
  ['MLI', 'SEN', 'GIN', 'CMR'],
  ['GHA', 'ETH', 'BOL', 'LTU', 'MMR'],
  ['CZE', 'PHL', 'CUB'],
  ['CHL', 'TEX', 'CUB', 'PRI'],
  ['MAR', 'VNM'],
  ['SOM', 'FSM'],
]

const DEFAULT_CLUES: ClueSettings = {
  landen: { name: true, flag: false, capital: false, place: false },
  vlaggen: { name: true, flag: false, capital: false, place: false },
  hoofdsteden: { name: true, flag: true, capital: false, place: false },
}

const CLUE_LABELS: Record<Clue, string> = {
  name: 'Naam',
  flag: 'Vlag',
  capital: 'Hoofdstad',
  place: 'Plek op kaart',
}

const CLUES_BY_MODE: Record<Exclude<TrainerMode, 'gemengd'>, Clue[]> = {
  landen: ['name', 'flag', 'capital'],
  vlaggen: ['place', 'name', 'capital'],
  hoofdsteden: ['place', 'name', 'flag'],
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

function getMode(mode: TrainerMode): Exclude<TrainerMode, 'gemengd'> {
  return mode === 'gemengd' ? pickRandom(TRAINING_MODES) : mode
}

function countryWeight(country: Country, progress: ProgressState, mode: Exclude<TrainerMode, 'gemengd'>, routine: Routine) {
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

function weightedPick(items: Country[], progress: ProgressState, mode: Exclude<TrainerMode, 'gemengd'>, routine: Routine) {
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

function buildOptions(pool: Country[], country: Country, mode: Exclude<TrainerMode, 'gemengd'>) {
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

function buildQuestion(pool: Country[], progress: ProgressState, selectedMode: TrainerMode, routine: Routine): Question {
  const mode = getMode(selectedMode)
  const country = weightedPick(pool, progress, mode, routine)
  const options = buildOptions(pool, country, mode)

  return {
    country,
    mode,
    options,
    answered: false,
    correct: null,
    selectedId: null,
    typedAnswer: '',
  }
}

function App() {
  const [screen, setScreen] = useState<Screen>('oefenen')
  const [continent, setContinent] = useState<Continent>('Wereld')
  const [mode, setMode] = useState<TrainerMode>('vlaggen')
  const [routine, setRoutine] = useState<Routine>('slim')
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [clues, setClues] = useState<ClueSettings>(DEFAULT_CLUES)
  const [previousQuestion, setPreviousQuestion] = useState<Question | null>(null)
  const [showPreviousQuestion, setShowPreviousQuestion] = useState(false)
  const progressRef = useRef(progress)

  const pool = useMemo(
    () => (continent === 'Wereld' ? countries : countries.filter((country) => country.continent === continent)),
    [continent],
  )

  const [question, setQuestion] = useState<Question>(() => buildQuestion(countries, progress, 'vlaggen', 'slim'))

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
  }, [progress])

  useEffect(() => {
    setQuestion(buildQuestion(pool, progressRef.current, mode, routine))
    setShowPreviousQuestion(false)
  }, [pool, mode, routine])

  const nextQuestion = useCallback(() => {
    if (question.answered) {
      setPreviousQuestion(question)
    }
    setShowPreviousQuestion(false)
    setQuestion(buildQuestion(pool, progress, mode, routine))
  }, [mode, pool, progress, question, routine])

  useEffect(() => {
    if (!question.answered) {
      return
    }

    const delay = question.correct ? ADVANCE_CORRECT_MS : ADVANCE_WRONG_MS
    const timeout = window.setTimeout(() => {
      nextQuestion()
    }, delay)

    return () => window.clearTimeout(timeout)
  }, [nextQuestion, question])

  function recordAnswer(correct: boolean) {
    setProgress((current) => applyAnswer(current, { countryId: question.country.id, mode: question.mode, correct }))
  }

  function chooseOption(countryId: string) {
    if (question.answered) {
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

    const correct = isCloseCapitalAnswer(question.typedAnswer, question.country.capitals)
    setQuestion((current) => ({ ...current, answered: true, correct }))
    recordAnswer(correct)
  }

  function clearProgress() {
    resetProgress()
    setProgress({})
  }

  function toggleClue(clueMode: Exclude<TrainerMode, 'gemengd'>, clue: Clue) {
    setClues((current) => {
      const activeClues = CLUES_BY_MODE[clueMode].filter((item) => current[clueMode][item])
      if (current[clueMode][clue] && activeClues.length === 1) {
        return current
      }

      return {
        ...current,
        [clueMode]: {
          ...current[clueMode],
          [clue]: !current[clueMode][clue],
        },
      }
    })
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Instellingen">
        <div className="brand">
          <Globe2 size={28} aria-hidden="true" />
          <div>
            <h1>Wereldtrainer</h1>
            <p>{countries.length} landen om te leren</p>
          </div>
        </div>

        <section className="control-group" aria-labelledby="continent-title">
          <h2 id="continent-title">Gebied</h2>
          <div className="button-grid">
            {continents.map((item) => (
              <button className={item === continent ? 'is-active' : ''} type="button" key={item} onClick={() => setContinent(item)}>
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="control-group" aria-labelledby="mode-title">
          <h2 id="mode-title">Training</h2>
          <div className="button-grid compact">
            {(['landen', 'vlaggen', 'hoofdsteden', 'gemengd'] as TrainerMode[]).map((item) => (
              <button className={item === mode ? 'is-active' : ''} type="button" key={item} onClick={() => setMode(item)}>
                {modeLabels[item]}
              </button>
            ))}
          </div>
        </section>

        <section className="control-group" aria-labelledby="routine-title">
          <h2 id="routine-title">Routine</h2>
          <div className="button-grid compact">
            {(['slim', 'normaal', 'fouten', 'snel'] as Routine[]).map((item) => (
              <button className={item === routine ? 'is-active' : ''} type="button" key={item} onClick={() => setRoutine(item)}>
                {routineLabels[item]}
              </button>
            ))}
          </div>
        </section>

        <section className="control-group" aria-labelledby="clues-title">
          <h2 id="clues-title">Toon bij vraag</h2>
          <ClueControls mode={mode} clues={clues} toggleClue={toggleClue} />
        </section>

        <nav className="nav-tabs" aria-label="Schermen">
          <button className={screen === 'oefenen' ? 'is-active' : ''} type="button" onClick={() => setScreen('oefenen')} title="Oefenen">
            <Target size={18} aria-hidden="true" />
            Oefenen
          </button>
          <button className={screen === 'leren' ? 'is-active' : ''} type="button" onClick={() => setScreen('leren')} title="Leren">
            <BookOpen size={18} aria-hidden="true" />
            Leren
          </button>
          <button className={screen === 'kaart' ? 'is-active' : ''} type="button" onClick={() => setScreen('kaart')} title="Kaart">
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
      </aside>

      <section className="workspace">
        {screen === 'oefenen' && (
          <PracticePanel
            continent={continent}
            countries={pool}
            clues={clues}
            previousQuestion={previousQuestion}
            showPreviousQuestion={showPreviousQuestion}
            question={question}
            routine={routine}
            chooseOption={chooseOption}
            submitCapital={submitCapital}
            setQuestion={setQuestion}
            nextQuestion={nextQuestion}
            setShowPreviousQuestion={setShowPreviousQuestion}
          />
        )}

        {screen === 'leren' && <LearnPanel continent={continent} countries={pool} progress={progress} />}

        {screen === 'kaart' && <MapPanel continent={continent} countries={pool} progress={progress} weakestCountries={weakestCountries} />}
      </section>
    </main>
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

type PracticePanelProps = {
  continent: Continent
  countries: Country[]
  clues: ClueSettings
  previousQuestion: Question | null
  showPreviousQuestion: boolean
  question: Question
  routine: Routine
  chooseOption: (countryId: string) => void
  submitCapital: (event: FormEvent<HTMLFormElement>) => void
  setQuestion: Dispatch<SetStateAction<Question>>
  nextQuestion: () => void
  setShowPreviousQuestion: Dispatch<SetStateAction<boolean>>
}

function ClueControls({
  mode,
  clues,
  toggleClue,
}: {
  mode: TrainerMode
  clues: ClueSettings
  toggleClue: (mode: Exclude<TrainerMode, 'gemengd'>, clue: Clue) => void
}) {
  const modes = mode === 'gemengd' ? TRAINING_MODES : [mode]

  return (
    <div className="clue-controls">
      {modes.map((clueMode) => (
        <div className="clue-mode" key={clueMode}>
          {mode === 'gemengd' && <strong>{modeLabels[clueMode]}</strong>}
          <div>
            {CLUES_BY_MODE[clueMode].map((clue) => (
              <label key={clue}>
                <input type="checkbox" checked={clues[clueMode][clue]} onChange={() => toggleClue(clueMode, clue)} />
                <span>{CLUE_LABELS[clue]}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
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
  routine,
  chooseOption,
  submitCapital,
  setQuestion,
  nextQuestion,
  setShowPreviousQuestion,
}: PracticePanelProps) {
  const isCapital = question.mode === 'hoofdsteden'
  const isMapQuestion = question.mode === 'landen'
  const activeClues = clues[question.mode]
  const capitalInputRef = useRef<HTMLInputElement>(null)
  const mapLayout = mapQuestionLayout(continent)

  useEffect(() => {
    if (isCapital && !question.answered) {
      capitalInputRef.current?.focus()
    }
  }, [isCapital, question])

  return (
    <div className="practice-layout">
      <header className="panel-header">
        <div>
          <p className="eyebrow">{modeLabels[question.mode]} oefenen</p>
          <h2>{practiceTitle(question.mode)}</h2>
        </div>
        <div className="routine-pill">
          {routine === 'snel' ? <Timer size={16} aria-hidden="true" /> : <GraduationCap size={16} aria-hidden="true" />}
          {routineLabels[routine]}
        </div>
      </header>

      {previousQuestion && (
        <div className="previous-question-tools">
          <button type="button" onClick={() => setShowPreviousQuestion((current) => !current)}>
            {showPreviousQuestion ? 'Verberg vorige vraag' : 'Vorige vraag'}
          </button>
        </div>
      )}

      {showPreviousQuestion && previousQuestion && <PreviousQuestionPanel question={previousQuestion} countries={visibleCountries} continent={continent} />}

      <div className={isMapQuestion ? `question-stage map-question-stage map-layout-${mapLayout}` : 'question-stage'}>
        {isMapQuestion ? (
          <div className="map-question-content">
            <CountryClickMap continent={continent} countries={visibleCountries} question={question} chooseCountry={chooseOption} />
            <CuePanel
              continent={continent}
              countries={visibleCountries}
              country={question.country}
              mode={question.mode}
              clues={activeClues}
              answered={question.answered}
              correct={question.correct}
              feedbackMessage={question.answered ? feedbackText(question, visibleCountries) : undefined}
              onNext={nextQuestion}
            />
          </div>
        ) : (
          <CuePanel
            continent={continent}
            countries={visibleCountries}
            country={question.country}
            mode={question.mode}
            clues={activeClues}
            answered={question.answered}
            correct={question.correct}
            feedbackMessage={question.answered ? feedbackText(question, visibleCountries) : undefined}
            onNext={nextQuestion}
          />
        )}
      </div>

      {isCapital ? (
        <form className="answer-form" onSubmit={submitCapital}>
          <input
            ref={capitalInputRef}
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
      ) : !isMapQuestion ? (
        <div className={question.mode === 'vlaggen' ? 'options-grid flag-options-grid' : 'options-grid'}>
          {question.options.map((country) => {
            const isSelected = question.selectedId === country.id
            const isCorrectAnswer = question.answered && country.id === question.country.id
            const isWrongSelection = question.answered && isSelected && country.id !== question.country.id

            return (
              <button
                className={['option-button', isCorrectAnswer ? 'correct' : '', isWrongSelection ? 'wrong' : ''].join(' ')}
                type="button"
                key={country.id}
                data-country-id={country.id}
                aria-label={question.mode === 'vlaggen' ? `Vlag van ${country.name}` : country.name}
                onClick={() => chooseOption(country.id)}
              >
                {question.mode === 'vlaggen' ? (
                  <>
                    <span aria-hidden="true">{country.flag}</span>
                    {(isCorrectAnswer || isWrongSelection) && (
                      <span className="option-reveal-name">{country.name}</span>
                    )}
                  </>
                ) : (
                  <>
                    {country.name}
                    {isCorrectAnswer && <Check size={14} aria-hidden="true" />}
                    {isWrongSelection && <X size={14} aria-hidden="true" />}
                  </>
                )}
              </button>
            )
          })}
        </div>
      ) : null}

      {question.answered && !question.correct && (
        <WrongAnswerReveal question={question} countries={visibleCountries} />
      )}
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
  feedbackMessage,
  onNext,
}: {
  continent: Continent
  countries: Country[]
  country: Country
  mode: Exclude<TrainerMode, 'gemengd'>
  clues: Record<Clue, boolean>
  answered?: boolean
  correct?: boolean | null
  feedbackMessage?: string
  onNext?: () => void
}) {
  return (
    <div className="cue-panel">
      <div className="country-clues">
        {answered && mode === 'hoofdsteden' ? (
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
        ) : (
          <>
            <strong>{cueInstruction(mode)}</strong>
            <span>{mode === 'hoofdsteden' ? 'Typ de hoofdstad. Kleine spelfouten tellen goed.' : 'Gebruik de aangevinkte hints.'}</span>
          </>
        )}
      </div>
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
    </div>
  )
}

function cueInstruction(mode: Exclude<TrainerMode, 'gemengd'>) {
  if (mode === 'landen') {
    return 'Klik het land aan op de kaart.'
  }

  if (mode === 'vlaggen') {
    return 'Kies de juiste vlag.'
  }

  return 'Welke hoofdstad hoort erbij?'
}

function CountryClueMap({ continent, countries: visibleCountries, country }: { continent: Continent; countries: Country[]; country: Country }) {
  const countryByMapId = useMemo(() => new Map(visibleCountries.map((item) => [item.mapId, item])), [visibleCountries])
  const effectiveContinent: Continent = continent === 'Wereld' ? country.continent : continent
  const view = useMemo(() => mapViewForContinent(effectiveContinent), [effectiveContinent])
  const [position, setPosition] = useState<MapPosition>({ coordinates: view.center, zoom: view.zoom })
  const geoData = geoDataFor(effectiveContinent, position.zoom)

  useEffect(() => {
    setPosition({ coordinates: view.center, zoom: view.zoom })
  }, [view])

  return (
    <div className="cue-map">
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
                    fill={isTarget ? '#2364aa' : mapCountry ? '#d8e5ed' : 'transparent'}
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
              <circle r={markerRadiusForZoom(country, position.zoom)} fill="#2364aa" stroke="#0f172a" strokeWidth={0.9 / position.zoom} vectorEffect="non-scaling-stroke" />
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}

function CountryClickMap({
  continent,
  countries: visibleCountries,
  question,
  chooseCountry,
}: {
  continent: Continent
  countries: Country[]
  question: Question
  chooseCountry: (countryId: string) => void
}) {
  const countryByMapId = useMemo(() => new Map(visibleCountries.map((country) => [country.mapId, country])), [visibleCountries])
  const isWorldMode = continent === 'Wereld'
  const [drillContinent, setDrillContinent] = useState<Exclude<Continent, 'Wereld'> | null>(null)
  const worldView = useMemo(() => mapViewForContinent(continent), [continent])
  const [position, setPosition] = useState<MapPosition>({ coordinates: worldView.center, zoom: worldView.zoom })

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

  useEffect(() => {
    setPosition({ coordinates: worldView.center, zoom: worldView.zoom })
  }, [worldView])

  useEffect(() => {
    if (!isWorldMode) return
    setDrillContinent(null)
    setPosition({ coordinates: worldView.center, zoom: worldView.zoom })
  }, [question.country.id, isWorldMode, worldView])

  function drillTo(cont: Exclude<Continent, 'Wereld'>) {
    const contView = mapViewForContinent(cont)
    setDrillContinent(cont)
    // Use ~82% of normal zoom so the full continent fits in the practice frame
    setPosition({ coordinates: contView.center, zoom: contView.zoom * 0.82 })
  }

  const showContinentView = isWorldMode && !drillContinent && !question.answered

  return (
    <div className="practice-map-frame">
      {showContinentView && (
        <div className="map-overlay-hint">Klik een continent om in te zoomen</div>
      )}
      {isWorldMode && drillContinent && !question.answered && (
        <button className="map-back-button" type="button" onClick={() => {
          setDrillContinent(null)
          setPosition({ coordinates: worldView.center, zoom: worldView.zoom })
        }}>
          ← Wereld
        </button>
      )}
      <ComposableMap projectionConfig={{ scale: 145 }} width={980} height={520}>
        <ZoomableGroup center={position.coordinates} zoom={position.zoom} onMoveEnd={setPosition}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geography) => {
                const country = countryByMapId.get(geographyKey(geography))
                const isTarget = country?.id === question.country.id
                const isWrongPick = Boolean(question.answered && country && question.selectedId === country.id && !isTarget)

                if (showContinentView) {
                  const continentColor = country ? CONTINENT_COLORS[country.continent] : 'transparent'
                  const hoverColor = country ? CONTINENT_HOVER_COLORS[country.continent] : 'transparent'
                  return (
                    <Geography
                      key={geography.rsmKey}
                      geography={geography}
                      fill={continentColor}
                      stroke="#ffffff"
                      strokeWidth={strokeWidthForZoom(worldView, position.zoom)}
                      onClick={() => { if (country) drillTo(country.continent) }}
                      style={{
                        default: { opacity: country ? 1 : 0, outline: 'none', pointerEvents: country ? 'auto' : 'none', cursor: country ? 'pointer' : 'default' },
                        hover: { opacity: country ? 1 : 0, fill: hoverColor, outline: 'none', cursor: country ? 'pointer' : 'default' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  )
                }

                const fill = question.answered && isTarget ? '#228b5b' : isWrongPick ? '#c84b4b' : country ? '#d8e5ed' : 'transparent'
                const isClickable = Boolean(country && !question.answered)

                return (
                  <Geography
                    key={geography.rsmKey}
                    geography={geography}
                    data-country-id={country?.id}
                    aria-label={country?.name}
                    fill={fill}
                    stroke={country ? '#ffffff' : 'transparent'}
                    strokeWidth={strokeWidthForZoom(effectiveView, position.zoom)}
                    onClick={() => {
                      if (!country || question.answered) return
                      if (isWorldMode && drillContinent && country.continent !== drillContinent) {
                        drillTo(country.continent)
                      } else {
                        chooseCountry(country.id)
                      }
                    }}
                    style={{
                      default: { cursor: isClickable ? 'pointer' : 'default', opacity: country ? 1 : 0, outline: 'none', pointerEvents: country ? 'auto' : 'none' },
                      hover: { cursor: isClickable ? 'pointer' : 'default', opacity: country ? 1 : 0, fill: isClickable ? '#2364aa' : fill, outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>
          {smallCountries.map((country) => {
            const isTarget = country.id === question.country.id
            const isWrongPick = Boolean(question.answered && question.selectedId === country.id && !isTarget)
            const fill = question.answered && isTarget ? '#228b5b' : isWrongPick ? '#c84b4b' : '#f8fbfd'
            const radius = markerRadiusForZoom(country, position.zoom)

            return (
              <Marker key={`marker-${country.id}`} coordinates={[country.latlng[1], country.latlng[0]]}>
                <circle
                  r={radius}
                  fill={fill}
                  stroke="#0f172a"
                  strokeWidth={0.9 / position.zoom}
                  vectorEffect="non-scaling-stroke"
                  role="button"
                  aria-label={country.name}
                  onClick={() => { if (!question.answered) chooseCountry(country.id) }}
                  style={{ cursor: question.answered ? 'default' : 'pointer' }}
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

function practiceTitle(mode: Exclude<TrainerMode, 'gemengd'>) {
  if (mode === 'hoofdsteden') {
    return 'Welke hoofdstad hoort erbij?'
  }

  if (mode === 'landen') {
    return 'Klik het land aan op de kaart'
  }

  return 'Welke vlag hoort hierbij?'
}

function modeAccuracy(progress: ProgressState, countryId: string, mode: Exclude<TrainerMode, 'gemengd'>): number | null {
  const stats = progress[countryId]?.[mode]
  if (!stats) return null
  const attempts = stats.correct + stats.wrong
  if (!attempts) return null
  return Math.round((stats.correct / attempts) * 100)
}

function LearnFlagMap({ continent, countries: visibleCountries }: { continent: Continent; countries: Country[] }) {
  const view = useMemo(() => mapViewForContinent(continent), [continent])
  const [position, setPosition] = useState<MapPosition>({ coordinates: view.center, zoom: view.zoom })
  const countryByMapId = useMemo(() => new Map(visibleCountries.map((c) => [c.mapId, c])), [visibleCountries])
  const [hovered, setHovered] = useState<Country | null>(null)
  const [layers, setLayers] = useState({ flags: true, names: true, capitals: false })
  const geoData = geoDataFor(continent, position.zoom)
  const allOff = !layers.flags && !layers.names && !layers.capitals

  useEffect(() => {
    setPosition({ coordinates: view.center, zoom: view.zoom })
  }, [view])

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
        <ZoomableGroup center={position.coordinates} zoom={position.zoom} onMoveEnd={setPosition}>
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
  const [position, setPosition] = useState<MapPosition>({ coordinates: view.center, zoom: view.zoom })
  const countryByMapId = useMemo(() => new Map(visibleCountries.map((c) => [c.mapId, c])), [visibleCountries])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [layers, setLayers] = useState({ flags: true, names: true, capitals: true })
  const geoData = geoDataFor(continent, position.zoom)
  const allOff = !layers.flags && !layers.names && !layers.capitals

  useEffect(() => {
    setPosition({ coordinates: view.center, zoom: view.zoom })
  }, [view])

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
            <ZoomableGroup center={position.coordinates} zoom={position.zoom} onMoveEnd={setPosition}>
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

                const flagPx = Math.max(8, 18 / position.zoom)
                const namePx = Math.max(5, 12 / position.zoom)
                const capPx = Math.max(3.5, 8 / position.zoom)

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
                        fill={isHov ? '#2364aa' : '#4a5f7a'}
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

function LearnPanel({ continent, countries: visibleCountries, progress }: { continent: Continent; countries: Country[]; progress: ProgressState }) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [learnView, setLearnView] = useState<'tegels' | 'kaart' | 'overzicht'>('tegels')
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
          </div>
          <span className="count-pill">{visibleCountries.length} landen</span>
        </div>
      </header>

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
      const mode = sort.col as Exclude<TrainerMode, 'gemengd'>
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
                            hover: { opacity: country ? 1 : 0, outline: 'none', fill: country ? '#2364aa' : '#dfe6ea' },
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
