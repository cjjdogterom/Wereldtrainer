import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import { BookOpen, Check, Globe2, GraduationCap, Map as MapIcon, RotateCcw, Target, Timer, X } from 'lucide-react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import geoUrl from 'world-atlas/countries-10m.json?url'
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
    if (!question.answered || !question.correct) {
      return
    }

    const timeout = window.setTimeout(() => {
      nextQuestion()
    }, 2000)

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

        {screen === 'leren' && <LearnPanel countries={pool} progress={progress} />}

        {screen === 'kaart' && <MapPanel continent={continent} countries={pool} progress={progress} weakestCountries={weakestCountries} />}
      </section>
    </main>
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

      {showPreviousQuestion && previousQuestion && <PreviousQuestionPanel question={previousQuestion} countries={visibleCountries} />}

      <div className={isMapQuestion ? 'question-stage map-question-stage' : 'question-stage'}>
        {isMapQuestion ? (
          <>
            <CuePanel continent={continent} countries={visibleCountries} country={question.country} mode={question.mode} clues={activeClues} />
            <CountryClickMap continent={continent} countries={visibleCountries} question={question} chooseCountry={chooseOption} />
          </>
        ) : (
          <CuePanel continent={continent} countries={visibleCountries} country={question.country} mode={question.mode} clues={activeClues} />
        )}
      </div>

      {isCapital ? (
        <form className="answer-form" onSubmit={submitCapital}>
          <input
            value={question.typedAnswer}
            onChange={(event) => setQuestion((current) => ({ ...current, typedAnswer: event.target.value }))}
            disabled={question.answered}
            placeholder="Hoofdstad"
            autoComplete="off"
          />
          <button type="submit">{question.answered ? 'Volgende' : 'Controleer'}</button>
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
                {question.mode === 'vlaggen' ? <span aria-hidden="true">{country.flag}</span> : country.name}
              </button>
            )
          })}
        </div>
      ) : null}

      {question.answered && (
        <div className={question.correct ? 'feedback correct' : 'feedback wrong'} role="status">
          {question.correct ? <Check size={20} aria-hidden="true" /> : <X size={20} aria-hidden="true" />}
          <span>
            {feedbackText(question, visibleCountries)}
            {question.correct ? ' Volgende vraag start automatisch.' : ''}
          </span>
          <button type="button" onClick={nextQuestion}>
            Volgende vraag
          </button>
        </div>
      )}
    </div>
  )
}

function PreviousQuestionPanel({ question, countries: visibleCountries }: { question: Question; countries: Country[] }) {
  return (
    <section className={question.correct ? 'previous-question correct' : 'previous-question wrong'} aria-label="Vorige vraag">
      <div>
        <span>Vorige vraag</span>
        <strong>{modeLabels[question.mode]} · {question.country.name}</strong>
      </div>
      <p>{feedbackText(question, visibleCountries)}</p>
    </section>
  )
}

function CuePanel({
  continent,
  countries: visibleCountries,
  country,
  mode,
  clues,
}: {
  continent: Continent
  countries: Country[]
  country: Country
  mode: Exclude<TrainerMode, 'gemengd'>
  clues: Record<Clue, boolean>
}) {
  return (
    <div className="cue-panel">
      <div className="country-clues">
        <strong>{cueInstruction(mode)}</strong>
        <span>{mode === 'hoofdsteden' ? 'Typ de hoofdstad. Kleine spelfouten tellen goed.' : 'Gebruik de aangevinkte hints.'}</span>
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
  const view = mapViewForContinent(continent)

  return (
    <div className="cue-map">
      <ComposableMap projectionConfig={{ scale: 145 }} width={980} height={520}>
        <ZoomableGroup center={view.center} zoom={view.zoom}>
          <Geographies geography={geoUrl}>
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
                    strokeWidth={view.strokeWidth}
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
              <circle r={markerRadius(country, view)} fill="#2364aa" stroke="#0f172a" strokeWidth={0.9 / view.zoom} vectorEffect="non-scaling-stroke" />
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
  const smallCountries = useMemo(() => visibleCountries.filter((country) => country.area <= SMALL_COUNTRY_AREA), [visibleCountries])
  const view = mapViewForContinent(continent)

  return (
    <div className="practice-map-frame">
      <ComposableMap projectionConfig={{ scale: 145 }} width={980} height={520}>
        <ZoomableGroup center={view.center} zoom={view.zoom}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geography) => {
                const country = countryByMapId.get(geographyKey(geography))
                const isTarget = country?.id === question.country.id
                const isWrongPick = Boolean(question.answered && country && question.selectedId === country.id && !isTarget)
                const fill = question.answered && isTarget ? '#228b5b' : isWrongPick ? '#c84b4b' : country ? '#d8e5ed' : 'transparent'

                return (
                  <Geography
                    key={geography.rsmKey}
                    geography={geography}
                    data-country-id={country?.id}
                    aria-label={country?.name}
                    fill={fill}
                    stroke={country ? '#ffffff' : 'transparent'}
                    strokeWidth={view.strokeWidth}
                    onClick={() => {
                      if (country) {
                        chooseCountry(country.id)
                      }
                    }}
                    style={{
                      default: { cursor: country && !question.answered ? 'pointer' : 'default', opacity: country ? 1 : 0, outline: 'none', pointerEvents: country ? 'auto' : 'none' },
                      hover: { cursor: country && !question.answered ? 'pointer' : 'default', opacity: country ? 1 : 0, fill: country && !question.answered ? '#2364aa' : fill, outline: 'none' },
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
            const radius = markerRadius(country, view)

            return (
              <Marker key={`marker-${country.id}`} coordinates={[country.latlng[1], country.latlng[0]]}>
                <circle
                  r={radius}
                  fill={fill}
                  stroke="#0f172a"
                  strokeWidth={0.9 / view.zoom}
                  vectorEffect="non-scaling-stroke"
                  role="button"
                  aria-label={country.name}
                  onClick={() => {
                    if (!question.answered) {
                      chooseCountry(country.id)
                    }
                  }}
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

function mapViewForContinent(continent: Continent): MapView {
  const views: Record<Continent, MapView> = {
    Wereld: { center: [8, 14], zoom: 1, strokeWidth: 0.35 },
    Afrika: { center: [20, 1], zoom: 2.45, strokeWidth: 0.28 },
    Azie: { center: [87, 28], zoom: 2.05, strokeWidth: 0.24 },
    Europa: { center: [15, 51], zoom: 5.9, strokeWidth: 0.1 },
    'Noord-Amerika': { center: [-95, 42], zoom: 2.25, strokeWidth: 0.22 },
    'Zuid-Amerika': { center: [-60, -18], zoom: 2.7, strokeWidth: 0.22 },
    Oceanie: { center: [145, -18], zoom: 3.05, strokeWidth: 0.18 },
  }

  return views[continent]
}

function markerRadius(country: Country, view: MapView) {
  const screenRadius = country.id === 'VAT' || country.id === 'MCO' ? 7 : 6
  return screenRadius / view.zoom
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

function LearnPanel({ countries: visibleCountries, progress }: { countries: Country[]; progress: ProgressState }) {
  return (
    <div className="learn-panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Leren</p>
          <h2>Alle landen, vlaggen en hoofdsteden</h2>
        </div>
        <span className="count-pill">{visibleCountries.length} landen</span>
      </header>

      <div className="learn-grid">
        {visibleCountries.map((country) => {
          const score = masteryForCountry(progress, country.id)
          return (
            <article className="country-card" key={country.id}>
              <span className="card-flag" aria-hidden="true">
                {country.flag}
              </span>
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
  const countryByMapId = useMemo(() => new Map(visibleCountries.map((country) => [country.mapId, country])), [visibleCountries])
  const smallCountries = useMemo(() => visibleCountries.filter((country) => country.area <= SMALL_COUNTRY_AREA), [visibleCountries])
  const view = mapViewForContinent(continent)

  return (
    <div className="map-panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Heatmap</p>
          <h2>Waar ken je de wereld al?</h2>
        </div>
        <div className="legend">
          <span className="unknown"></span> nieuw
          <span className="low"></span> oefenen
          <span className="mid"></span> groeit
          <span className="high"></span> sterk
        </div>
      </header>

      <div className="map-frame">
        <ComposableMap projectionConfig={{ scale: 145 }} width={980} height={520}>
          <ZoomableGroup center={view.center} zoom={view.zoom}>
            <Geographies geography={geoUrl}>
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
                      strokeWidth={view.strokeWidth}
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
              const radius = markerRadius(country, view)
              return (
                <Marker key={`marker-${country.id}`} coordinates={[country.latlng[1], country.latlng[0]]}>
                  <circle r={radius} fill={scoreColor(score)} stroke="#0f172a" strokeWidth={0.85 / view.zoom} vectorEffect="non-scaling-stroke" />
                </Marker>
              )
            })}
            {weakestCountries.slice(0, 5).map((country) => (
              <Marker key={country.id} coordinates={[country.latlng[1], country.latlng[0]]}>
                <circle r={3} fill="#111827" stroke="#fff" strokeWidth={1.2} />
              </Marker>
            ))}
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
    </div>
  )
}

export default App
