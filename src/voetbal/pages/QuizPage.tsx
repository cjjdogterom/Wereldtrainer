import { useState } from 'react';
import Quiz from '../components/Quiz';
import { getPoolSize } from '../utils/quiz';
import { useDataset } from '../data/DatasetContext';
import type { QuizMode, QuizOrder } from '../types';

const modes: { value: QuizMode; label: string; description: string }[] = [
  {
    value: 'season-to-club',
    label: 'Jaar → Winnaar',
    description: 'Wie won er in een bepaald jaar?',
  },
  {
    value: 'club-to-season',
    label: 'Winnaar → Jaar',
    description: 'In welk jaar won een bepaalde winnaar?',
  },
  {
    value: 'mixed',
    label: 'Gemengd',
    description: 'Afwisselend jaar→winnaar en winnaar→jaar.',
  },
];

const orders: { value: QuizOrder; label: string; description: string }[] = [
  {
    value: 'random',
    label: 'Willekeurig',
    description: 'Vragen in willekeurige volgorde.',
  },
  {
    value: 'chronological',
    label: 'Op volgorde',
    description: 'Chronologisch van oud naar nieuw.',
  },
  {
    value: 'reverse-chronological',
    label: 'Omgekeerd',
    description: 'Van nieuw naar oud.',
  },
];

export default function QuizPage() {
  const dataset = useDataset();
  const hasEras = dataset.eras.length > 1;

  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<QuizMode>('mixed');
  const [order, setOrder] = useState<QuizOrder>('random');
  const [eraFilter, setEraFilter] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [allYears, setAllYears] = useState(false);
  const [quizKey, setQuizKey] = useState(0);

  const poolSize = getPoolSize(dataset, eraFilter);
  const effectiveCount = allYears ? poolSize : questionCount;
  const maxSlider = Math.min(50, Math.max(5, getPoolSize(dataset, 'all')));

  const handleStart = () => {
    setQuizKey((k) => k + 1);
    setStarted(true);
  };

  const handleStartAllYears = () => {
    setAllYears(true);
    setMode('mixed');
    setOrder('chronological');
    setEraFilter('all');
    setQuizKey((k) => k + 1);
    setStarted(true);
  };

  if (started) {
    return (
      <div className="quiz-page">
        <div className="page-header compact">
          <h1>Overhoring</h1>
          <button
            className="btn btn-outline"
            onClick={() => {
              setStarted(false);
              setAllYears(false);
            }}
          >
            ← Instellingen
          </button>
        </div>
        <Quiz
          key={quizKey}
          count={effectiveCount}
          mode={mode}
          eraFilter={eraFilter}
          order={order}
          allYears={allYears}
        />
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="page-header">
        <h1>Overhoringsmodus</h1>
        <p>Stel je quiz samen en test je kennis van de {dataset.winnerNounPlural}.</p>
      </div>

      <div className="quiz-quick-start">
        <button className="btn btn-primary btn-large" onClick={handleStartAllYears}>
          Alle {getPoolSize(dataset, 'all')} overhoren (gemengd, op volgorde)
        </button>
        <p className="quick-start-hint">
          Doorloop chronologisch elke winnaar uit de geschiedenis.
        </p>
      </div>

      <div className="quiz-setup">
        <section className="setup-section">
          <h2>Vraagtype</h2>
          <div className="mode-grid">
            {modes.map((m) => (
              <button
                key={m.value}
                className={`mode-card ${mode === m.value ? 'selected' : ''}`}
                onClick={() => setMode(m.value)}
              >
                <h3>{m.label}</h3>
                <p>{m.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="setup-section">
          <h2>Volgorde</h2>
          <div className="mode-grid">
            {orders.map((o) => (
              <button
                key={o.value}
                className={`mode-card ${order === o.value ? 'selected' : ''}`}
                onClick={() => setOrder(o.value)}
              >
                <h3>{o.label}</h3>
                <p>{o.description}</p>
              </button>
            ))}
          </div>
        </section>

        {hasEras && (
          <section className="setup-section">
            <h2>Periode</h2>
            <div className="era-options">
              <label className="era-option">
                <input
                  type="radio"
                  name="era"
                  value="all"
                  checked={eraFilter === 'all'}
                  onChange={() => setEraFilter('all')}
                />
                Alle ({getPoolSize(dataset, 'all')})
              </label>
              {dataset.eras.map((era) => (
                <label key={era.key} className="era-option">
                  <input
                    type="radio"
                    name="era"
                    value={era.key}
                    checked={eraFilter === era.key}
                    onChange={() => setEraFilter(era.key)}
                  />
                  {era.label} ({getPoolSize(dataset, era.key)})
                </label>
              ))}
            </div>
          </section>
        )}

        <section className="setup-section">
          <h2>Aantal vragen</h2>
          <label className="era-option all-years-option">
            <input
              type="checkbox"
              checked={allYears}
              onChange={(e) => setAllYears(e.target.checked)}
            />
            Alles ({poolSize} vragen)
          </label>
          {!allYears && (
            <>
              <h3 className="slider-label">{questionCount} vragen</h3>
              <input
                type="range"
                min={5}
                max={maxSlider}
                step={5}
                value={Math.min(questionCount, maxSlider)}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="question-slider"
              />
              <div className="slider-labels">
                <span>5</span>
                <span>{Math.round(maxSlider / 2)}</span>
                <span>{maxSlider}</span>
              </div>
            </>
          )}
        </section>

        <button className="btn btn-secondary btn-large" onClick={handleStart}>
          Start aangepaste overhoring
        </button>
      </div>
    </div>
  );
}
