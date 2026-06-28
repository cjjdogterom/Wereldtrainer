import { useEffect, useMemo, useRef, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react'
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

function buildQuestion(pool: Country[], progress: ProgressState, selectedMode: TrainerMode, routine: Routine): Question {
  const mode = getMode(selectedMode)
  const country = weightedPick(pool, progress, mode, routine)
  const options = shuffle([country, ...shuffle(pool.filter((item) => item.id !== country.id)).slice(0, 3)])

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
  }, [pool, mode, routine])

  function nextQuestion() {
    setQuestion(buildQuestion(pool, progress, mode, routine))
  }

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
            question={question}
            routine={routine}
            chooseOption={chooseOption}
            submitCapital={submitCapital}
            setQuestion={setQuestion}
            nextQuestion={nextQuestion}
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
  question: Question
  routine: Routine
  chooseOption: (countryId: string) => void
  submitCapital: (event: FormEvent<HTMLFormElement>) => void
  setQuestion: Dispatch<SetStateAction<Question>>
  nextQuestion: () => void
}

function PracticePanel({ continent, countries: visibleCountries, question, routine, chooseOption, submitCapital, setQuestion, nextQuestion }: PracticePanelProps) {
  const isCapital = question.mode === 'hoofdsteden'
  const isMapQuestion = question.mode === 'landen'

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

      <div className={isMapQuestion ? 'question-stage map-question-stage' : 'question-stage'}>
        {isMapQuestion ? (
          <>
            <div className="country-clues">
              <strong>{question.country.name}</strong>
              <span>Klik dit land aan op de kaart.</span>
            </div>
            <CountryClickMap continent={continent} countries={visibleCountries} question={question} chooseCountry={chooseOption} />
          </>
        ) : (
          <div className={question.mode === 'vlaggen' ? 'flag-display only-flag' : 'flag-display'}>
            <span aria-label={`Vlag van ${question.country.name}`}>{question.country.flag}</span>
          </div>
        )}

        {question.mode === 'hoofdsteden' && (
          <div className="country-clues">
            <strong>{question.country.name}</strong>
            <span>Typ de hoofdstad. Kleine spelfouten tellen goed.</span>
          </div>
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
        <div className="options-grid">
          {question.options.map((country) => {
            const isSelected = question.selectedId === country.id
            const isCorrectAnswer = question.answered && country.id === question.country.id
            const isWrongSelection = question.answered && isSelected && country.id !== question.country.id

            return (
              <button
                className={['option-button', isCorrectAnswer ? 'correct' : '', isWrongSelection ? 'wrong' : ''].join(' ')}
                type="button"
                key={country.id}
                onClick={() => chooseOption(country.id)}
              >
                {country.name}
              </button>
            )
          })}
        </div>
      ) : null}

      {question.answered && (
        <div className={question.correct ? 'feedback correct' : 'feedback wrong'} role="status">
          {question.correct ? <Check size={20} aria-hidden="true" /> : <X size={20} aria-hidden="true" />}
          <span>{feedbackText(question)}</span>
          <button type="button" onClick={nextQuestion}>
            Volgende vraag
          </button>
        </div>
      )}
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
                const country = countryByMapId.get(String(geography.id))
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

function feedbackText(question: Question) {
  if (question.mode === 'landen') {
    return question.correct ? `Goed, dat is ${question.country.name}.` : `Bijna. Je zocht ${question.country.name}.`
  }

  return `${question.correct ? 'Goed!' : 'Bijna.'} ${question.country.name} heeft als hoofdstad ${question.country.capital}.`
}

function practiceTitle(mode: Exclude<TrainerMode, 'gemengd'>) {
  if (mode === 'hoofdsteden') {
    return 'Welke hoofdstad hoort erbij?'
  }

  if (mode === 'landen') {
    return 'Klik het land aan op de kaart'
  }

  return 'Welk land hoort bij deze vlag?'
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
                  const country = countryByMapId.get(String(geography.id))
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
